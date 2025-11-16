import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api/axios";
export default function LoginUser() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const handleLogin = async () => {
        try {
            const res = await api.post("/api/user/login", { email, password });
            alert("Login Successful!");
            console.log(res.data);
            localStorage.setItem("studentId", res.data.studentId);
            localStorage.setItem("role", "student");
            console.log("Hello")
            navigate("/student/dashboard");
        } catch (err) {
            setError(err.response?.data?.error || "Login failed");
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-50 p-6">
            <div className="bg-white p-8 rounded-2xl max-w-md w-full shadow-lg">

                <h2 className="text-3xl font-bold mb-6 text-blue-700 text-center">
                    Student Login
                </h2>

                {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 border rounded-lg mb-4"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-3 border rounded-lg mb-4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                    Login
                </button>

                <p className="text-center text-gray-600 mt-5">
                    Don't have an account?{" "}
                    <Link to="/register/user" className="text-blue-600 font-semibold hover:underline">
                        Register here
                    </Link>
                </p>

            </div>
        </div>
    );
}
