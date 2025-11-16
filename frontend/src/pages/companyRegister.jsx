import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function RegisterCompany() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        domain: "",
        location: "",
        eligibility: "",
        jobRole: "",
        password: ""
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async () => {
        try {
            const res = await api.post("/api/company/register", form);
            alert("Company Registered Successfully!");
            navigate("/login/company");
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-50 p-6">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full">

                <h2 className="text-3xl font-bold text-center mb-6 text-green-700">
                    Company Registration
                </h2>

                {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

                <input
                    name="name"
                    type="text"
                    placeholder="Company Name"
                    className="w-full p-3 border rounded-lg mb-4"
                    value={form.name}
                    onChange={handleChange}
                />

                <input
                    name="domain"
                    type="text"
                    placeholder="Domain (e.g., Software, Finance)"
                    className="w-full p-3 border rounded-lg mb-4"
                    value={form.domain}
                    onChange={handleChange}
                />

                <input
                    name="location"
                    type="text"
                    placeholder="Location"
                    className="w-full p-3 border rounded-lg mb-4"
                    value={form.location}
                    onChange={handleChange}
                />

                <input
                    name="eligibility"
                    type="text"
                    placeholder="Eligibility Criteria (What are you looking for)"
                    className="w-full p-3 border rounded-lg mb-4"
                    value={form.eligibility}
                    onChange={handleChange}
                />

                <input
                    name="jobRole"
                    type="text"
                    placeholder="Job Role (e.g., Frontend Developer)"
                    className="w-full p-3 border rounded-lg mb-4"
                    value={form.jobRole}
                    onChange={handleChange}
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="w-full p-3 border rounded-lg mb-4"
                    value={form.password}
                    onChange={handleChange}
                />

                <button
                    onClick={handleRegister}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                    Register
                </button>

                <p className="text-center text-gray-600 mt-5">
                    Already registered?{" "}
                    <Link to="/login/company" className="text-green-600 font-semibold hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}
