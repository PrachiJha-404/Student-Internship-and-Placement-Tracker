from flask import Blueprint, request, jsonify
from db import query_db, execute_db
from werkzeug.security import check_password_hash, generate_password_hash

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

#Dashboard
# Dashboard
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


#Get all job postings for a company
@company_bp.route('/jobs', methods=['GET'])
def get_company_jobs():
    company_id = request.headers.get("x-company-id")
    jobs = query_db("SELECT * FROM jobposting WHERE CompanyID=%s", (company_id,))
    return jsonify(jobs)

#Add a New Job Posting (with Deadline)
@company_bp.route('/jobs', methods=['POST'])
def add_job():
    company_id = request.headers.get("x-company-id")
    data = request.json
    execute_db("""
        INSERT INTO jobposting (CompanyID, Title, Description, Deadline, Salary, MinGPA)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (company_id, data['title'], data['description'], data['deadline'], data['salary'], data['minGpa']))

    return jsonify({"message": "Job created successfully"})

#Stop Hiring (Close a Job)
@company_bp.route('/jobs/<int:job_id>/stop', methods=['PUT'])
def stop_hiring(job_id):
    execute_db("UPDATE jobposting SET Deadline = CURDATE() WHERE JobID = %s", (job_id,))
    return jsonify({"message": "Hiring stopped for this job"})

#View Applicants for a Job
@company_bp.route('/jobs/<int:job_id>/applicants', methods=['GET'])
def view_applicants(job_id):
    applicants = query_db("""
        SELECT 
            a.ApplicationID, s.StudentID, s.Name, s.GPA, s.Resume, a.Status
        FROM application a
        JOIN student s ON a.StudentID = s.StudentID
        WHERE a.JobID = %s
    """, (job_id,))
    return jsonify(applicants)

#Update Applicant Status (OA / Interview / Selected / Rejected)
@company_bp.route('/applications/<int:application_id>/status', methods=['PUT'])
def update_status(application_id):
    data = request.json
    new_status = data.get('status')
    execute_db("UPDATE application SET Status=%s WHERE ApplicationID=%s", (new_status, application_id))
    return jsonify({"message": f"Application status updated to {new_status}"})

#SIGNUP
@company_bp.route('/register', methods=['POST'])
def register_company():
    data = request.json
    hashed = generate_password_hash(data['password'])

    execute_db("""
        INSERT INTO company (Name, Domain, Location, EligibilityCriteria, JobRole, PasswordHash)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (data['name'], data['domain'], data['location'], data['eligibility'], data['jobRole'], hashed))

    return jsonify({"message": "Company registered successfully"})

