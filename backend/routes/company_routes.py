from flask import Blueprint, request, jsonify
from db import query_db, execute_db, get_connection
from werkzeug.security import check_password_hash, generate_password_hash
import traceback

company_bp = Blueprint('company_bp', __name__, url_prefix='/api/company')

@company_bp.route('/login', methods=['POST'])
def login_company():
    data = request.json
    name = data.get('name')
    password = data.get('password')
    company = query_db("SELECT * FROM company WHERE name=%s", (name,), fetchone=True)
    if company and check_password_hash(company['PasswordHash'], password):
        return jsonify({"message": "Login successful", "companyId": company["CompanyID"]})
    return jsonify({"error": "Invalid credentials"}), 401

@company_bp.route('/dashboard', methods=['GET'])
def company_dashboard():
    try:
        company_id = int(request.headers.get("x-company-id"))
        stats = query_db("""
            SELECT 
                COUNT(DISTINCT jp.JobID) AS total_jobs,
                COUNT(a.ApplicationID) AS total_applications,
                SUM(a.Status='Selected') AS selected
            FROM jobposting jp
            LEFT JOIN application a ON jp.JobID = a.JobID
            WHERE jp.CompanyID = %s
        """, (company_id,), fetchone=True)

        return jsonify(stats if stats else {
            "total_jobs": 0,
            "total_applications": 0,
            "selected": 0
        })
    except Exception as e:
        print("❌ Error fetching dashboard data:", e)
        return jsonify({"error": "Failed to fetch dashboard"}), 500

@company_bp.route('/jobs', methods=['GET'])
def get_company_jobs():
    company_id = request.headers.get("x-company-id")
    jobs = query_db("SELECT * FROM jobposting WHERE CompanyID=%s", (company_id,))
    return jsonify(jobs)

@company_bp.route('/jobs', methods=['POST'])
def add_job():
    company_id = request.headers.get("x-company-id")
    data = request.json
    execute_db("""
        INSERT INTO jobposting (CompanyID, Title, Description, Deadline, Salary, MinGPA)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (company_id, data['title'], data['description'], data['deadline'], data['salary'], data['minGpa']))

    return jsonify({"message": "Job created successfully"})

@company_bp.route('/jobs/<int:job_id>/stop', methods=['PUT'])
def stop_hiring(job_id):
    execute_db("UPDATE jobposting SET Deadline = CURDATE()-1 WHERE JobID = %s", (job_id,))
    return jsonify({"message": "Hiring stopped for this job"})

@company_bp.route('/jobs/<int:job_id>/applicants', methods=['GET'])
def view_applicants(job_id):
    applicants = query_db("""
        SELECT 
            a.ApplicationID, s.StudentID, s.Name, s.GPA, s.Resume, a.Status
        FROM application a
        JOIN student s ON a.StudentID = s.StudentID
        WHERE a.JobID = %s
    """, (job_id,))
    print(f"📋 Fetched applicants: {applicants}")
    return jsonify(applicants)

@company_bp.route('/applications/<int:application_id>/status', methods=['PUT'])
def update_status(application_id):
    data = request.json
    new_status = data.get('status')
    
    # Map frontend status to database enum values
    status_mapping = {
        'Applied': 'Applied',
        'OA Sent': 'Shortlisted',  # Map to existing enum
        'Interview Scheduled': 'InterviewScheduled',
        'Selected': 'Selected',
        'Rejected': 'Rejected'
    }
    
    db_status = status_mapping.get(new_status, new_status)
    execute_db("UPDATE application SET Status=%s WHERE ApplicationID=%s", (db_status, application_id))
    return jsonify({"message": f"Application status updated to {new_status}"})

# Schedule Interview using the stored procedure
@company_bp.route('/applications/<int:application_id>/schedule-interview', methods=['POST'])
def schedule_interview(application_id):
    conn = None
    cursor = None
    try:
        print(f"📅 Scheduling interview for application {application_id}")
        
        data = request.json
        company_id = request.headers.get("x-company-id")
        
        print(f"📦 Received data: {data}")
        print(f"🏢 Company ID: {company_id}")
        
        # Validate required fields
        required_fields = ['interviewDate', 'interviewTime', 'linkOrLocation']
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            print(f"❌ Missing fields: {missing_fields}")
            return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400
        
        # Verify company owns this application
        print("🔍 Verifying company authorization...")
        app_details = query_db("""
            SELECT 
                a.StudentID, 
                s.Name as StudentName, 
                jp.Title as JobTitle, 
                c.Name as CompanyName,
                jp.JobID
            FROM application a
            JOIN student s ON a.StudentID = s.StudentID
            JOIN jobposting jp ON a.JobID = jp.JobID
            JOIN company c ON jp.CompanyID = c.CompanyID
            WHERE a.ApplicationID = %s AND c.CompanyID = %s
        """, (application_id, company_id), fetchone=True)
        
        if not app_details:
            print(f"❌ Application not found or unauthorized")
            return jsonify({"error": "Application not found or unauthorized"}), 404
        
        print(f"✅ Found application: {app_details}")
        
        # Use the stored procedure to schedule interview
        print("💾 Calling schedule_interview stored procedure...")
        conn = get_connection()
        cursor = conn.cursor()
        
        # Call the stored procedure
        # schedule_interview(p_applicationID, p_date, p_time, p_link)
        cursor.callproc('schedule_interview', [
            application_id,
            data['interviewDate'],
            data['interviewTime'],
            data['linkOrLocation']
        ])
        
        conn.commit()
        print("✅ Stored procedure executed successfully")
        
        # Update application status to 'InterviewScheduled'
        print("📝 Updating application status...")
        cursor.execute("""
            UPDATE application 
            SET Status = 'InterviewScheduled' 
            WHERE ApplicationID = %s
        """, (application_id,))
        
        conn.commit()
        print("✅ Application status updated")
        
        cursor.close()
        conn.close()
        
        return jsonify({
            "message": "Interview scheduled successfully",
            "studentName": app_details['StudentName'],
            "jobTitle": app_details['JobTitle']
        }), 201
        
    except Exception as e:
        print("❌❌❌ ERROR SCHEDULING INTERVIEW ❌❌❌")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {str(e)}")
        print(f"Traceback:")
        traceback.print_exc()
        
        if conn:
            conn.rollback()
        
        return jsonify({
            "error": "Failed to schedule interview",
            "details": str(e)
        }), 500
    
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@company_bp.route('/register', methods=['POST'])
def register_company():
    data = request.json
    hashed = generate_password_hash(data['password'])

    execute_db("""
        INSERT INTO company (Name, Domain, Location, EligibilityCriteria, JobRole, PasswordHash)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (data['name'], data['domain'], data['location'], data['eligibility'], data['jobRole'], hashed))

    return jsonify({"message": "Company registered successfully"})

# Update a job posting
@company_bp.route('/jobs/<int:job_id>', methods=['PUT'])
def update_job(job_id):
    try:
        company_id = request.headers.get("x-company-id")
        data = request.json
        
        # Verify the job belongs to this company
        job = query_db(
            "SELECT * FROM jobposting WHERE JobID=%s AND CompanyID=%s", 
            (job_id, company_id), 
            fetchone=True
        )
        
        if not job:
            return jsonify({"error": "Job not found or unauthorized"}), 404
        
        # Update the job
        execute_db("""
            UPDATE jobposting 
            SET Title=%s, Description=%s, Deadline=%s, Salary=%s, MinGPA=%s
            WHERE JobID=%s AND CompanyID=%s
        """, (
            data['title'], 
            data['description'], 
            data['deadline'], 
            data['salary'], 
            data['minGpa'],
            job_id,
            company_id
        ))
        
        return jsonify({"message": "Job updated successfully"}), 200
        
    except Exception as e:
        print(f"❌ Error updating job: {e}")
        traceback.print_exc()
        return jsonify({"error": "Failed to update job", "details": str(e)}), 500


# Delete a job posting
@company_bp.route('/jobs/<int:job_id>', methods=['DELETE'])
def delete_job(job_id):
    try:
        company_id = request.headers.get("x-company-id")
        
        # Verify the job belongs to this company
        job = query_db(
            "SELECT * FROM jobposting WHERE JobID=%s AND CompanyID=%s", 
            (job_id, company_id), 
            fetchone=True
        )
        
        if not job:
            return jsonify({"error": "Job not found or unauthorized"}), 404
        
        # Check if there are any applications for this job
        applications = query_db(
            "SELECT COUNT(*) as count FROM application WHERE JobID=%s", 
            (job_id,), 
            fetchone=True
        )
        
        if applications and applications['count'] > 0:
            return jsonify({
                "error": "Cannot delete job with existing applications",
                "suggestion": "Consider stopping hiring instead"
            }), 400
        
        # Delete the job
        execute_db("DELETE FROM jobposting WHERE JobID=%s AND CompanyID=%s", (job_id, company_id))
        
        return jsonify({"message": "Job deleted successfully"}), 200
        
    except Exception as e:
        print(f"❌ Error deleting job: {e}")
        traceback.print_exc()
        return jsonify({"error": "Failed to delete job", "details": str(e)}), 500