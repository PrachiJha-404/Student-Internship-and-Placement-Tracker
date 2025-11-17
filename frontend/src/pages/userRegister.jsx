import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function RegisterUser() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        studentId: "",
        name: "",
        email: "",
        password: "",
        gpa: "",
        batchYear: "",
    });

    const [resume, setResume] = useState(null);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setResume(e.target.files[0]);
    };

    const handleRegister = async () => {
        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => formData.append(key, value));
            formData.append("resume", resume);

            const res = await api.post("/api/user/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("Registration Successful!");
            navigate("/login/user");

        } catch (err) {
            setError(err.response?.data?.error || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-50 p-6">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">

                <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
                    Student Registration
                </h2>

                {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

                {/* Inputs */}
                {["studentId", "name", "email", "password", "gpa", "batchYear"].map((field) => (
                    <input
                        key={field}
                        name={field}
                        type={field === "password" ? "password" : "text"}
                        placeholder={field === "studentId" ? "Student ID" :
                            field === "batchYear" ? "Batch Year" : field.toUpperCase()}
                        className="w-full p-3 border rounded-lg mb-4"
                        value={form[field]}
                        onChange={handleChange}
                    />
                ))}

                {/* Resume Upload */}
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="w-full p-3 border rounded-lg mb-4"
                />

                <button
                    onClick={handleRegister}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                    Register
                </button>

                <p className="text-center text-gray-600 mt-5">
                    Already have an account?{" "}
                    <Link to="/login/user" className="text-blue-600 font-semibold hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}
