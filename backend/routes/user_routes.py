from flask import Blueprint, request, jsonify, send_from_directory
from db import query_db, execute_db
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename
import os
from datetime import datetime


UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads", "resumes")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
ALLOWED_EXTENSIONS = {"pdf"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
 
user_bp = Blueprint('user_bp', __name__, url_prefix='/api/user')

@user_bp.route('/register', methods=['POST'])
def register_user():
    try:
        # Text fields come from request.form
        name = request.form.get("name")
        email = request.form.get("email")
        password = request.form.get("password")
        gpa = request.form.get("gpa")
        batchYear = request.form.get("batchYear")
        studentId = request.form.get("studentId")

        # Validate
        if not all([name, email, password, gpa, batchYear, studentId]):
            return jsonify({"error": "All fields including resume are required"}), 400

        # Resume file
        if "resume" not in request.files:
            return jsonify({"error": "Resume file missing"}), 400

        resume_file = request.files["resume"]

        if resume_file.filename == "":
            return jsonify({"error": "Invalid resume file"}), 400

        if not allowed_file(resume_file.filename):
            return jsonify({"error": "Only PDF files allowed"}), 400

        # Save resume
        filename = secure_filename(
            f"resume_{studentId}_{int(datetime.now().timestamp())}.pdf"
        )
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        resume_file.save(filepath)

        db_path = os.path.relpath(filepath, start=os.path.dirname(os.path.dirname(__file__)))

        hashed_pwd = generate_password_hash(password)

        execute_db("""
            INSERT INTO student (StudentID, Name, Email, PasswordHash, GPA, Resume, BatchYear)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (studentId, name, email, hashed_pwd, gpa, db_path, batchYear))

        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        print("Registration error:", e)
        return jsonify({"error": "Registration failed"}), 500

@user_bp.route("/profile", methods=["GET"])
def get_profile():
    try:
        student_id = request.headers.get("x-student-id")

        user = query_db("""
            SELECT Name, Email, GPA, BatchYear 
            FROM student 
            WHERE StudentID=%s
        """, (student_id,), fetchone=True)

        return jsonify(user), 200
    except Exception as e:
        print("Error during user registration:", e)
        return jsonify({"error": "Not able to get profile, please try again"}), 500

# @user_bp.route('/register', methods=['POST'])
# def register_user():
#     try:
#         data = request.json
#         required = ['studentId','name', 'email', 'password', 'gpa', 'batchYear']
#         for field in required:
#             if field not in data or data[field] == "":
#                 return jsonify({"error": f"Missing required field: {field}"}), 400

#         hashed = generate_password_hash(data['password'])

#         execute_db("""
#             INSERT INTO STUDENT (StudentID ,Name, Email, PasswordHash, GPA, BatchYear)
#             VALUES (%s,%s, %s, %s, %s, %s)
#         """, (
#             data['studentId'],
#             data['name'],
#             data['email'],
#             hashed,
#             data['gpa'],
#             data['batchYear']
#         ))
#         return jsonify({"message": "User registered successfully"}), 201

#     except Exception as e:
#         print("Error during user registration:", e)
#         return jsonify({"error": "Registration failed, please try again"}), 500
    

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
        user = query_db("SELECT * FROM STUDENT WHERE Email=%s", (email,), fetchone=True)

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

    
# @user_bp.route("/<int:student_id>/upload_resume", methods=["POST"])
# def upload_resume(student_id):
#     try:
#         if "resume" not in request.files:
#             return jsonify({"error": "No file part"}), 400

#         file = request.files["resume"]
#         if file.filename == "":
#             return jsonify({"error": "No selected file"}), 400

#         if not allowed_file(file.filename):
#             return jsonify({"error": "Only PDF resumes allowed"}), 400

#         # make filename safe and unique (include timestamp)
#         filename = secure_filename(f"resume_{student_id}_{int(datetime.utcnow().timestamp())}.pdf")
#         filepath = os.path.join(UPLOAD_FOLDER, filename)
#         file.save(filepath)

#         # Save relative path in DB (or absolute if you prefer)
#         db_path = os.path.relpath(filepath, start=os.path.dirname(os.path.dirname(__file__)))
#         execute_db("UPDATE student SET Resume=%s WHERE StudentID=%s", (db_path, student_id))

#         return jsonify({"message": "Resume uploaded", "path": db_path}), 200

#     except Exception:
#         return jsonify({"error": "Upload failed"}), 500

@user_bp.route("/interviews", methods=["GET"])
def get_interviews():
    try:
        student_id = request.headers.get("x-student-id")
        
        if not student_id:
            return jsonify({"error": "Student ID required"}), 400
        
        print(f"📅 Fetching interviews for student: {student_id}")
        interviews = query_db("""
            SELECT 
                i.ScheduleID,
                i.InterviewDate,
                i.InterviewTime,
                i.InterviewAt,
                i.LinkOrLocation,
                a.ApplicationID,
                jp.JobID,
                jp.Title,
                c.Name AS CompanyName
            FROM interviewscheduler i
            JOIN application a ON i.ApplicationID = a.ApplicationID
            JOIN jobposting jp ON a.JobID = jp.JobID
            JOIN company c ON jp.CompanyID = c.CompanyID
            WHERE a.StudentID = %s
            ORDER BY i.InterviewDate ASC, i.InterviewTime ASC
        """, (student_id,))
        
        # Format dates and times in Python
        for interview in interviews:
            if interview['InterviewDate']:
                interview['InterviewDate'] = interview['InterviewDate'].strftime('%Y-%m-%d')
            if interview['InterviewTime']:
                # Handle timedelta from MySQL TIME type
                import datetime
                if isinstance(interview['InterviewTime'], datetime.timedelta):
                    total_seconds = int(interview['InterviewTime'].total_seconds())
                    hours, remainder = divmod(total_seconds, 3600)
                    minutes, seconds = divmod(remainder, 60)
                    interview['InterviewTime'] = f"{hours:02d}:{minutes:02d}:{seconds:02d}"
                else:
                    interview['InterviewTime'] = interview['InterviewTime'].strftime('%H:%M:%S')
            if interview['InterviewAt']:
                interview['InterviewAt'] = interview['InterviewAt'].strftime('%Y-%m-%d %H:%M:%S')
        
        print(f"✅ Found {len(interviews)} interviews")
        print(f"Interviews data: {interviews}")
        return jsonify(interviews), 200
    except Exception as e:
        print("❌ Interview fetch error:")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Failed to fetch interviews", "details": str(e)}), 500

@user_bp.route("/resume/<path:filepath>", methods=["GET"])
def serve_resume(filepath):
    # filepath could be something like "uploads/resumes/resume_123.pdf"
    filename = os.path.basename(filepath)  # extract only the filename
    return send_from_directory(UPLOAD_FOLDER, filename, as_attachment=True)

@user_bp.route("/dashboard", methods=["GET"])
def user_dashboard():
    try:
        student_id = request.headers.get("x-student-id")
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


@user_bp.route("/eligible_jobs", methods=["GET"])
def eligible_jobs():
    """
    Returns all open jobs where student's GPA >= job.MinGPA and job deadline not passed.
    Query params: optional ?search=string or ?companyId=...
    """
    try:
        # get student's GPA
        student_id = request.headers.get("x-student-id")
        user = query_db("SELECT GPA FROM student WHERE StudentID=%s", (student_id,), fetchone=True)
        if not user:
            return jsonify({"error": "Student not found"}), 404

        student_gpa = float(user["GPA"])

        # optional filters
        search = request.args.get("search")
        company_id = request.args.get("companyId")

        sql = """
            SELECT *
            FROM v_company_open_positions jp
            WHERE jp.MinGPA <= %s
              AND jp.JobID NOT IN (
                    SELECT JobID
                    FROM application
                    WHERE StudentID = %s
              )
        """
        params = [student_gpa,student_id]

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
        student_id = request.headers.get("x-student-id")

        job = query_db("""
            SELECT jp.*, 
                   c.Name AS CompanyName, 
                   c.Domain, 
                   c.Location, 
                   c.EligibilityCriteria, 
                   c.JobRole
            FROM jobposting jp
            JOIN company c ON jp.CompanyID = c.CompanyID
            WHERE jp.JobID = %s
        """, (job_id,), fetchone=True)

        if not job:
            return jsonify({"error": "Job not found"}), 404

        # ✔ check if student already applied
        applied = query_db("""
            SELECT 1 FROM application 
            WHERE StudentID=%s AND JobID=%s
            LIMIT 1
        """, (student_id, job_id), fetchone=True)

        job["hasApplied"] = bool(applied)

        return jsonify(job), 200

    except Exception as e:
        print("Job detail error:", e)
        return jsonify({"error": "Failed to fetch job"}), 500

    

@user_bp.route("/jobs/<int:job_id>/apply", methods=["POST"])
def apply_job(job_id):
    try:
        student_id = request.headers.get("x-student-id")
        
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



@user_bp.route("/applications", methods=["GET"])
def user_applications():
    try:
        student_id = request.headers.get("x-student-id")
        #this uses a view which shows which student has applied for which job in which company
        apps = query_db(
            """
            SELECT * from v_student_applications
            WHERE StudentID = %s
            ORDER BY DateApplied DESC
            """,
            (student_id,),
        )
        return jsonify(apps), 200
    except Exception:
        # current_app.logger.exception("User applications error")
        return jsonify({"error": "Failed to fetch applications"}), 500

@user_bp.route("/notifications", methods=["GET"])
def get_notifications():
    try:
        student_id = request.headers.get("x-student-id")
        notes = query_db("SELECT * FROM notification WHERE StudentID=%s ORDER BY DateTime DESC", (student_id,))
        return jsonify(notes), 200
    except Exception as e:
        # current_app.logger.exception("Notifications error")
    
        return jsonify({"error": "Failed to fetch notifications", "err":e}), 500