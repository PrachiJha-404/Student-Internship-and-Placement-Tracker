import { useEffect, useState } from "react";
import api from "../api/axios";

export default function StudentNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await api.get("/api/user/notifications");
                setNotifications(res.data);
            } catch (err) {
                console.log("Notification fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    if (loading) return <div className="p-6">Loading notifications...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h2 className="text-3xl font-bold text-blue-700 mb-6">Notifications</h2>

            {notifications.length === 0 ? (
                <p className="text-gray-600">No notifications yet.</p>
            ) : (
                <div className="space-y-4">
                    {notifications.map((note) => (
                        <div
                            key={note.NotificationID}
                            className={`p-5 rounded-xl shadow border cursor-pointer transition 
                                bg-white hover:shadow-lg ${note.IsRead === 0 ? "border-blue-400" : "border-gray-200"
                                }`}
                        >
                            <div className="flex justify-between items-start">

                                {/* Message */}
                                <div>
                                    <h3 className="font-semibold text-gray-800">
                                        {note.Message}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {new Date(note.DateTime).toLocaleString()}
                                    </p>
                                </div>

                                {/* Indicator Dot */}
                                <div
                                    className={`w-3 h-3 rounded-full mt-2 ${note.IsRead === 0 ? "bg-blue-600" : "bg-gray-400"
                                        }`}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
