import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function JobDetail() {
    const { jobId } = useParams();
    const [job, setJob] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await api.get(`/api/user/jobs/${jobId}`);
                setJob(res.data); // includes hasApplied
            } catch (err) {
                setError("Failed to fetch job details");
            }
        };
        fetchJob();
    }, []);

    const applyForJob = async () => {
        try {
            await api.post(`/api/user/jobs/${jobId}/apply`, {});
            setMessage("Application submitted successfully!");
            setError("");

            // Update UI immediately
            setJob((prev) => ({ ...prev, hasApplied: true }));

        } catch (err) {
            setError(err.response?.data?.error || "Failed to apply");
        }
    };

    if (!job) return <div className="p-6">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-lg p-8">

                {/* TITLE */}
                <h1 className="text-4xl font-bold text-blue-700 mb-2">{job.Title}</h1>
                <p className="text-gray-600 text-lg mb-6">at <b>{job.CompanyName}</b></p>

                {/* JOB META INFORMATION */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

                    <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg shadow-sm">
                        <p className="text-gray-600">Location</p>
                        <p className="text-lg font-semibold text-blue-700">{job.Location}</p>
                    </div>

                    <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg shadow-sm">
                        <p className="text-gray-600">Domain</p>
                        <p className="text-lg font-semibold text-green-700">{job.Domain}</p>
                    </div>

                    <div className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded-lg shadow-sm">
                        <p className="text-gray-600"> Eligibility</p>
                        <p className="text-lg font-semibold text-purple-700">{job.EligibilityCriteria}</p>
                    </div>

                    <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg shadow-sm">
                        <p className="text-gray-600">Job Role</p>
                        <p className="text-lg font-semibold text-yellow-700">{job.JobRole}</p>
                    </div>

                    <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm">
                        <p className="text-gray-600">Deadline</p>
                        <p className="text-lg font-semibold text-red-700">{job.Deadline}</p>
                    </div>

                    <div className="p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-lg shadow-sm">
                        <p className="text-gray-600">Salary</p>
                        <p className="text-lg font-semibold text-indigo-700">₹ {job.Salary}</p>
                    </div>

                </div>

                {/* DESCRIPTION */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Job Description</h2>
                    <p className="text-gray-700 leading-relaxed">{job.Description}</p>
                </div>

                {/* APPLY BUTTON */}
                <div className="flex justify-end">
                    {job.hasApplied ? (
                        <button
                            disabled
                            className="bg-gray-400 text-white px-8 py-3 rounded-xl font-semibold shadow-md cursor-not-allowed"
                        >
                            Applied
                        </button>
                    ) : (
                        <button
                            onClick={applyForJob}
                            className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:bg-green-700 transition"
                        >
                            Apply Now
                        </button>
                    )}
                </div>

                {/* Success & Error Messages */}
                {message && <p className="text-green-600 mt-4 text-right font-semibold">{message}</p>}
                {error && <p className="text-red-600 mt-4 text-right font-semibold">{error}</p>}
            </div>
        </div>
    );
}
