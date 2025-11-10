import {useEffect, useState} from 'react';
import JobPostForm from '../components/JobPostForm';

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

    return (
        <div>
            <h1> Company Dashboard </h1>
            <p> Total Jobs: {stats.total_jobs }</p>
            <p> Total Applicants: {stats.total_applications}</p>
            <p> Selected: {stats.selected} </p>
            <JobPostForm companyId={companyId} />
            <h2> Active Job Postings </h2>
            {jobs.map(job=> (
                <div key = {job.JobID}>
                    <h3>{job.Title}</h3>
                    <button onClick={() => fetch(`http://localhost:5000/api/company/jobs/${job.JobID}/stop`, { method: "PUT" })}>
                        Stop Hiring
                    </button>
                    <ApplicantTable jobId={job.JobID}/>
                </div>
            ))}
        </div>
    );
}