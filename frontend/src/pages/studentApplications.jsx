import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function StudentApplications() {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const statusColors = {
        "Applied": "bg-blue-100 text-blue-700",
        "Under Review": "bg-gray-200 text-gray-700",
        "Interview Scheduled": "bg-purple-200 text-purple-700",
        "Selected": "bg-green-200 text-green-700",
        "Rejected": "bg-red-200 text-red-700",
    };

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await api.get("/api/user/applications");
                setApplications(res.data);
            } catch (err) {
                console.log("Applications fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    if (loading) return <div className="p-6">Loading your applications...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">

            <h2 className="text-3xl font-bold text-blue-700 mb-6">
                Your Applications
            </h2>

            {applications.length === 0 ? (
                <p className="text-gray-600">You haven't applied to any jobs yet.</p>
            ) : (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <div
                            key={app.ApplicationID}
                            onClick={() => navigate(`/student/jobs/${app.JobID}`)}
                            className="bg-white p-5 rounded-xl shadow border border-gray-200 hover:shadow-lg cursor-pointer transition"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold text-blue-700">{app.Title}</h3>
                                    <p className="text-gray-600">{app.CompanyName}</p>
                                    <p className="text-gray-500 text-sm">📍 {app.Location}</p>
                                    <p className="text-gray-500 text-sm mt-1">
                                        Applied on: <b>{app.DateApplied}</b>
                                    </p>
                                </div>

                                {/* STATUS BADGE */}
                                <span
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold ${statusColors[app.Status] || "bg-gray-200 text-gray-700"
                                        }`}
                                >
                                    {app.Status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}
