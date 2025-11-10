from flask import Blueprint, request, jsonify
from db import query_db, execute_db

company_bp = Blueprint('company_bp', __name__, url_prefix='/api/company')

@company_bp.route('/login', methods=['POST'])
def login_company():
    data = request.json
    name = data.get('name')
    password = data.get('password')
    company = query_db("SELECT * FROM company WHERE Name=%s", (name,), fetchone=True)
    if company and password == "company_pass":
        return jsonify({"message": "Login successful", "companyId": company["CompanyID"]})
    return jsonify({"error": "Invalid credentials"}), 401

#Dashboard
def company_dashboard(company_id):
    stats = query_db("""
                      SELECT 
            COUNT(DISTINCT jp.JobID) AS total_jobs,
            COUNT(a.ApplicationID) AS total_applications,
            SUM(a.Status='Selected') AS selected
        FROM jobposting jp
        LEFT JOIN application a ON jp.JobID = a.JobID
        WHERE jp.CompanyID = %s
                     """, (company_id,), fetchone=True)
    
    return jsonify(stats if stats else {})

#Get all job postings for a company
@company_bp.route('/<int:company_id>/jobs', methods=['GET'])
def get_company_jobs(company_id):
    jobs = query_db("SELECT * FROM jobposting WHERE CompanyID=%s", (company_id,))
    return jsonify(jobs)

#Add a New Job Posting (with Deadline)
@company_bp.route('/<int:company_id>/jobs', methods=['POST'])
def add_job(company_id):
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

