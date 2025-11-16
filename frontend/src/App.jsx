import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import LoginUser from "./pages/userlogin";
import LoginCompany from "./pages/companyLogin";
import RegisterUser from "./pages/userRegister";
import RegisterCompany from "./pages/companyRegister";

import StudentDashboard from "./pages/StudentDashboard";
import EligibleJobs from "./pages/Eligiblejobs";
import JobDetail from "./pages/JobDetail";

import CompanyDashboard from "./pages/CompanyDashboard";

import ProtectedRoute from "./pages/ProtectedRoutes";
import StudentApplications from "./pages/studentApplications";

import StudentNotifications from "./pages/studentNotifications";
import StudentInterviews from "./pages/upcomingInterviews";




function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login/user" element={<LoginUser />} />
        <Route path="/login/company" element={<LoginCompany />} />
        <Route path="/register/user" element={<RegisterUser />} />
        <Route path="/register/company" element={<RegisterCompany />} />

        {/* STUDENT PROTECTED ROUTES */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/eligible-jobs"
          element={
            <ProtectedRoute role="student">
              <EligibleJobs />
            </ProtectedRoute>
          }
        />

        {/* Job Detail (still student-only) */}
        <Route
          path="/student/jobs/:jobId"
          element={
            <ProtectedRoute role="student">
              <JobDetail />
            </ProtectedRoute>
          }
        />

        {/* COMPANY PROTECTED ROUTES */}
        <Route
          path="/company/dashboard"
          element={
            <ProtectedRoute role="company">
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/applications"
          element={
            <ProtectedRoute role="student">
              <StudentApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/notifications"
          element={
            <ProtectedRoute role="student">
              <StudentNotifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/interviews"
          element={
            <ProtectedRoute role="student">
              <StudentInterviews />
            </ProtectedRoute>
          }
        />

      </Routes>

    </Router>
  );
}

export default App;
