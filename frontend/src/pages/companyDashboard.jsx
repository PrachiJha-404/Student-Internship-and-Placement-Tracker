import {useEffect, useState} from 'react';
import JobPostForm from '../components/JobPostForm';
import ApplicantTable from "../components/applicantTable.jsx";

export default function CompanyDashboard({companyId}){
    const [stats, setStats] = useState({});
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5000/api/company/${companyId}/dashboard`)
        .then(r=> r.json())
        .then(setStats);
        fetch(`http://localhost:5000/api/company/${companyId}/jobs`)
        .then(r=>r.json())
        .then(setJobs);

    }, [companyId]);

    const activeJobs = jobs.filter(job => new Date(job.Deadline) > new Date());

    return (
        <div>
            <h1> Company Dashboard </h1>
            <p> Total Jobs: {stats.total_jobs }</p>
            <p>Active Jobs: {activeJobs.length}</p>
            <p> Total Applicants: {stats.total_applications}</p>
            <p> Selected: {stats.selected} </p>
            <JobPostForm companyId={companyId} />
            <h2> Active Job Postings </h2>
            {jobs.map(job => {
  const isClosed = new Date(job.Deadline) <= new Date();

  return (
    <div
      key={job.JobID}
      style={{
        marginBottom: "1.5rem",
        padding: "1rem",
        borderRadius: "8px",
        border: "1px solid #ccc",
        background: isClosed ? "#f2f2f2" : "#fff",
        opacity: isClosed ? 0.6 : 1,
      }}
    >
      <h3>{job.Title}</h3>
      <p><b>Deadline:</b> {new Date(job.Deadline).toLocaleDateString()}</p>

      {!isClosed ? (
        <button
          onClick={async () => {
            const res = await fetch(
              `http://localhost:5000/api/company/jobs/${job.JobID}/stop`,
              { method: "PUT" }
            );
            const data = await res.json();
            if (res.ok) {
              alert("✅ " + data.message);
              const refreshed = await fetch(
                `http://localhost:5000/api/company/${companyId}/jobs`
              ).then(r => r.json());
              setJobs(refreshed);
            }
          }}
          style={{
            background: "#dc3545",
            color: "white",
            border: "none",
            padding: "0.4rem 0.8rem",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Stop Hiring
        </button>
      ) : (
        <p style={{ color: "#888", fontStyle: "italic" }}>Hiring closed</p>
      )}

      <ApplicantTable jobId={job.JobID} />
    </div>
  );
})}

        </div>
    );
}