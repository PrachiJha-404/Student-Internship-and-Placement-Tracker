import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function StudentDashboard() {
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalApplied: 0,
        upcomingInterviews: 0,
        unreadNotifications: 0
    });
    const [profileOpen, setProfileOpen] = useState(false);

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        gpa: "",
        batchYear: ""
    });

    const [eligibleJobs, setEligibleJobs] = useState([]);
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login/user";
    };
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/api/user/profile");
                setProfile({
                    name: res.data.Name,
                    email: res.data.Email,
                    gpa: res.data.GPA,
                    batchYear: res.data.BatchYear
                });
            } catch (err) {
                console.log("Profile error:", err);
            }
        };
        fetchProfile();
    }, []);

    // Fetch stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get("/api/user/dashboard");
                setStats(res.data);
            } catch (err) {
                console.log("Dashboard error:", err);
            }
        };
        fetchStats();
    }, []);

    // Fetch eligible jobs for this user
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await api.get("/api/user/eligible_jobs");
                setEligibleJobs(res.data);
            } catch (err) {
                console.log("Eligible jobs error:", err);
            }
        };
        fetchJobs();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* PROFILE BUTTON */}
            <button
                onClick={() => setProfileOpen(true)}
                className="absolute top-6 right-6 bg-white shadow-md p-3 rounded-full hover:shadow-lg transition"
            >
                👤
            </button>
            <h2 className="text-3xl font-bold mb-6 text-blue-700">Student Dashboard</h2>

            {/* ======= TOP STATS SECTION ======= */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Applications */}
                <div
                    onClick={() => navigate(`/student/applications`)}
                    className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-600 cursor-pointer hover:shadow-xl transition"
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold text-green-600">Your Applications</h3>
                            <p className="text-gray-600 mt-2">
                                View all applied jobs.
                            </p>
                        </div>
                        <div className="text-4xl font-extrabold text-green-700">
                            {stats.totalApplied}
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div
                    onClick={() => navigate(`/student/notifications`)}
                    className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-600 cursor-pointer hover:shadow-xl transition"
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold text-yellow-600">Notifications</h3>
                            <p className="text-gray-600 mt-2">
                                Latest updates.
                            </p>
                        </div>
                        <div className="text-4xl font-extrabold text-yellow-600">
                            {stats.unreadNotifications}
                        </div>
                    </div>
                </div>

                {/* Interviews */}
                <div
                    onClick={() => navigate(`/student/interviews`)}
                    className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-600 cursor-pointer hover:shadow-xl transition"
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold text-purple-600">Upcoming Interviews</h3>
                            <p className="text-gray-600 mt-2">
                                Scheduled rounds.
                            </p>
                        </div>
                        <div className="text-4xl font-extrabold text-purple-700">
                            {stats.upcomingInterviews}
                        </div>
                    </div>
                </div>

            </div>


            {/* ======= ELIGIBLE JOBS SECTION ======= */}
            <h3 className="text-2xl font-bold mt-10 mb-4 text-blue-700">
                Eligible Jobs
            </h3>

            {eligibleJobs.length === 0 ? (
                <p className="text-gray-600">No eligible jobs at the moment.</p>
            ) : (
                <div className="space-y-4">
                    {eligibleJobs.map((job) => (
                        <div
                            key={job.JobID}
                            onClick={() => navigate(`/student/jobs/${job.JobID}`)}
                            className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg cursor-pointer transition"
                        >
                            <h4 className="text-xl font-bold text-blue-600">{job.Title}</h4>
                            <p className="text-gray-600">{job.CompanyName}</p>
                            <p className="text-gray-500 text-sm mt-1">
                                Min GPA: {job.MinGPA}
                            </p>
                        </div>
                    ))}
                </div>
            )}
            {/* PROFILE DRAWER */}
            <div
                className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 p-6 ${profileOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Close Button */}
                <button
                    onClick={() => setProfileOpen(false)}
                    className="absolute top-4 right-4 text-gray-600 text-2xl"
                >
                    ✖
                </button>

                <h2 className="text-2xl font-bold text-blue-700 mb-6">Profile</h2>

                {/* PROFILE DETAILS */}
                <div className="space-y-4">
                    <div>
                        <p className="text-gray-500 text-sm">Name</p>
                        <p className="text-lg font-semibold">{profile.name}</p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">Email</p>
                        <p className="text-lg font-semibold">{profile.email}</p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">GPA</p>
                        <p className="text-lg font-semibold">{profile.gpa}</p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">Batch Year</p>
                        <p className="text-lg font-semibold">{profile.batchYear}</p>
                    </div>
                </div>

                {/* LOGOUT BUTTON */}
                <button
                    onClick={handleLogout}
                    className="mt-10 w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                    Logout
                </button>
            </div>

        </div>
    );
}
