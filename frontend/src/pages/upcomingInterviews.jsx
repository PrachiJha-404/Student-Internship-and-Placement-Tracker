import { useEffect, useState } from "react";
import api from "../api/axios";

export default function StudentInterviews() {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const res = await api.get("/api/user/interviews");
                setInterviews(res.data);
            } catch (err) {
                console.log("Interview fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInterviews();
    }, []);

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">

            <h2 className="text-3xl font-bold text-blue-700 mb-6">
                Upcoming Interviews
            </h2>

            {interviews.length === 0 ? (
                <p className="text-gray-600">No upcoming interviews scheduled.</p>
            ) : (
                <div className="space-y-4">
                    {interviews.map((i) => {
                        const isLink = i.LinkOrLocation?.startsWith("http");

                        return (
                            <div
                                key={i.ScheduleID}
                                className="bg-white p-5 rounded-xl shadow border border-gray-200"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-bold text-blue-600">{i.Title}</h3>
                                        <p className="text-gray-600">{i.CompanyName}</p>

                                        <p className="text-gray-500 mt-2">
                                            📅 <b>{new Date(i.InterviewAt).toLocaleString()}</b>
                                        </p>

                                        {isLink ? (
                                            <a
                                                href={i.LinkOrLocation}
                                                target="_blank"
                                                className="text-blue-600 underline mt-2 inline-block"
                                            >
                                                Join Online Meeting →
                                            </a>
                                        ) : (
                                            <p className="text-gray-500 mt-2">
                                                📍 <b>{i.LinkOrLocation}</b>
                                            </p>
                                        )}
                                    </div>

                                    <div className="text-4xl">🗂️</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
