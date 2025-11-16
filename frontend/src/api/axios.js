import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:5000"
});

// Automatically attach ID headers
api.interceptors.request.use((config) => {
    const role = localStorage.getItem("role");

    if (role === "student") {
        config.headers["x-student-id"] = localStorage.getItem("studentId");
    }
    if (role === "company") {
        config.headers["x-company-id"] = localStorage.getItem("companyId");
    }

    return config;
});

export default api;
