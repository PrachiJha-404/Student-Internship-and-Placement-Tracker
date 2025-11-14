from flask import Blueprint, request, jsonify
from db import query_db, execute_db
from werkzeug.security import check_password_hash, generate_password_hash, send_from_directory
import os
import datetime  
from weakzeug.utils import secure_filename


UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads", "resumes")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
ALLOWED_EXTENSIONS = {"pdf"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
user_bp = Blueprint('user_bp', __name__, url_prefix='/api/user')

@user_bp.route('/register', methods=['POST'])
def register_user():
    try:
        data = request.json
        required = ['name', 'email', 'password', 'gpa', 'batchYear']
        for field in required:
            if field not in data or data[field] == "":
                return jsonify({"error": f"Missing required field: {field}"}), 400

        hashed = generate_password_hash(data['password'])

        execute_db("""
            INSERT INTO STUDENTS (Name, Email, PasswordHash, GPA, Resume, BatchYear)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            data['name'],
            data['email'],
            hashed,
            data['gpa'],
            None,
            data['batchYear']
        ))
        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        print("Error during user registration:", e)
        return jsonify({"error": "Registration failed, please try again"}), 500
    

@user_bp.route('/login', methods=['POST'])
def login_user():
    try:
        data = request.json

        required = ['email', 'password']
        for field in required:
            if field not in data or data[field] == "":
                return jsonify({"error": f"Missing required field: {field}"}), 400

        email = data['email']
        password = data['password']

        # Fetch user
        user = query_db("SELECT * FROM STUDENTS WHERE Email=%s", (email,), fetchone=True)

        if not user:
            return jsonify({"error": "User not found"}), 404

        # Check password hash
        if not check_password_hash(user['PasswordHash'], password):
            return jsonify({"error": "Incorrect password"}), 401

        # Login success
        return jsonify({
            "message": "Login successful",
            "studentId": user["StudentID"],
            "name": user["Name"]
        }), 200

    except Exception as e:
        print("Login error:", e)
        return jsonify({"error": "Login failed, please try again"}), 500

    
@user_bp.route("/<int:student_id>/upload_resume", methods=["POST"])
def upload_resume(student_id):
    try:
        if "resume" not in request.files:
            return jsonify({"error": "No file part"}), 400

        file = request.files["resume"]
        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400

        if not allowed_file(file.filename):
            return jsonify({"error": "Only PDF resumes allowed"}), 400

        # make filename safe and unique (include timestamp)
        filename = secure_filename(f"resume_{student_id}_{int(datetime.utcnow().timestamp())}.pdf")
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)

        # Save relative path in DB (or absolute if you prefer)
        db_path = os.path.relpath(filepath, start=os.path.dirname(os.path.dirname(__file__)))
        execute_db("UPDATE student SET Resume=%s WHERE StudentID=%s", (db_path, student_id))

        return jsonify({"message": "Resume uploaded", "path": db_path}), 200

    except Exception:
        return jsonify({"error": "Upload failed"}), 500

@user_bp.route("/resume/<path:filename>", methods=["GET"])
def serve_resume(filename):
    # SECURITY: in production restrict access (authentication) before serving
    return send_from_directory(UPLOAD_FOLDER, filename, as_attachment=True)

@user_bp.route("/<int:student_id>/dashboard", methods=["GET"])
def user_dashboard(student_id):
    try:
        # total applied
        applied = query_db("SELECT COUNT(*) AS cnt FROM application WHERE StudentID=%s", (student_id,), fetchone=True) or {"cnt": 0}
        # upcoming interviews (assuming interviewscheduler has ApplicationID, ScheduledAt)
        upcoming = query_db(
            """
            SELECT COUNT(*) AS cnt FROM interviewscheduler i
            JOIN application a ON i.ApplicationID = a.ApplicationID
            WHERE a.StudentID = %s AND i.InterviewAt >= NOW()
            """,
            (student_id,),
            fetchone=True,
        ) or {"cnt": 0}
        # unread notifications
        unread = query_db("SELECT COUNT(*) AS cnt FROM notification WHERE StudentID=%s AND `IsRead`=0", (student_id,), fetchone=True) or {"cnt": 0}

        return jsonify({
            "totalApplied": applied["cnt"],
            "upcomingInterviews": upcoming["cnt"],
            "unreadNotifications": unread["cnt"]
        })

    except Exception:
        return jsonify({"error": "Failed to fetch dashboard"}), 500


@user_bp.route("/<int:student_id>/eligible_jobs", methods=["GET"])
def eligible_jobs(student_id):
    """
    Returns all open jobs where student's GPA >= job.MinGPA and job deadline not passed.
    Query params: optional ?search=string or ?companyId=...
    """
    try:
        # get student's GPA
        user = query_db("SELECT GPA FROM student WHERE StudentID=%s", (student_id,), fetchone=True)
        if not user:
            return jsonify({"error": "Student not found"}), 404

        student_gpa = float(user["GPA"])

        # optional filters
        search = request.args.get("search")
        company_id = request.args.get("companyId")

        sql = """
            SELECT * FROM v_company_open_positions WHERE MinGPA <= %s
        """
        params = [student_gpa]

        if company_id:
            sql += " AND jp.CompanyID = %s"
            params.append(company_id)

        if search:
            sql += " AND (jp.Title LIKE %s OR c.Name LIKE %s)"
            params.extend([f"%{search}%", f"%{search}%"])

        jobs = query_db(sql, tuple(params))
        return jsonify(jobs), 200

    except Exception:
        return jsonify({"error": "Failed to fetch jobs"}), 500

@user_bp.route("/jobs/<int:job_id>", methods=["GET"])
def job_detail(job_id):
    try:
        job = query_db(
            """
            SELECT jp.*, c.Name AS CompanyName, c.Domain, c.Location, c.EligibilityCriteria, c.JobRole
            FROM jobposting jp
            JOIN company c ON jp.CompanyID = c.CompanyID
            WHERE jp.JobID = %s
            """,
            (job_id,),
            fetchone=True,
        )
        if not job:
            return jsonify({"error": "Job not found"}), 404
        return jsonify(job), 200

    except Exception:
        # current_app.logger.exception("Job detail error")
        return jsonify({"error": "Failed to fetch job"}), 500
    

@user_bp.route("/jobs/<int:job_id>/apply", methods=["POST"])
def apply_job(job_id):
    try:
        data = request.json or {}
        student_id = data.get("studentId")

        if not student_id:
            return jsonify({"error": "studentId required"}), 400

        try:
            # ✔ CALL your stored procedure
            execute_db(
                "CALL apply_for_job(%s, %s, %s)",
                (student_id, job_id, "cover_letter")
            )

        except Exception as e:
            error_str = str(e)

            # ✔ Eligibility or deadline or status issues
            if "45000" in error_str:
                return jsonify({
                    "error": "Not eligible to apply (status/GPA/deadline/duplicate)."
                }), 403

            # ✔ Unique constraint violation (if you add one)
            if "Duplicate" in error_str:
                return jsonify({
                    "error": "You have already applied for this job."
                }), 409

            # Any other DB error
            print("Unexpected DB error:", error_str)
            return jsonify({"error": "Failed to apply due to server error"}), 500

        # SUCCESS
        return jsonify({"message": "Application submitted successfully"}), 201

    except Exception as e:
        print("Apply job error:", e)
        return jsonify({"error": "Internal server error"}), 500



@user_bp.route("/<int:student_id>/applications", methods=["GET"])
def user_applications(student_id):
    try:
        #this uses a view which shows which student has applied for which job in which company
        apps = query_db(
            """
            SELECT * from v_student_application
            WHERE StudentID = %s
            ORDER BY DateApplied DESC
            """,
            (student_id,),
        )
        return jsonify(apps), 200
    except Exception:
        # current_app.logger.exception("User applications error")
        return jsonify({"error": "Failed to fetch applications"}), 500

@user_bp.route("/<int:student_id>/notifications", methods=["GET"])
def get_notifications(student_id):
    try:
        notes = query_db("SELECT * FROM notification WHERE StudentID=%s ORDER BY CreatedOn DESC", (student_id,))
        return jsonify(notes), 200
    except Exception:
        # current_app.logger.exception("Notifications error")
        return jsonify({"error": "Failed to fetch notifications"}), 500