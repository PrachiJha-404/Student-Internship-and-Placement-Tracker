import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
    const storedRole = localStorage.getItem("role");

    // No login → go to home
    if (!storedRole) {
        return <Navigate to="/" replace />;
    }

    // Wrong page for this role → redirect to their dashboard
    if (role && storedRole !== role) {
        if (storedRole === "student") return <Navigate to="/student/dashboard" />;
        if (storedRole === "company") return <Navigate to="/company/dashboard" />;
    }

    return children;
}
