import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function EligibleJobs() {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await api.get(`/api/user/${studentId}/eligible_jobs`);
                setJobs(res.data);
            } catch (err) {
                console.log("Job fetch error:", err);
            }
        };
        fetchJobs();
    }, []);

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            <h2 className="text-3xl font-bold mb-6 text-blue-700">Eligible Jobs</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs.map((job) => (
                    <div
                        key={job.JobID}
                        onClick={() =>
                            navigate(`/student/${studentId}/jobs/${job.JobID}`)
                        }
                        className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
                    >
                        <h3 className="text-xl font-bold text-blue-600">
                            {job.Title}
                        </h3>
                        <p className="text-gray-600">{job.CompanyName}</p>
                        <p className="mt-2 text-gray-500">
                            Min GPA: {job.MinGPA}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
