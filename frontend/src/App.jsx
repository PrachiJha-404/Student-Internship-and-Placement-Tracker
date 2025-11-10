import { useState } from "react";
import CompanyLogin from "./pages/companyLogin.jsx";
import CompanySignup from "./pages/companySignup.jsx";
import CompanyDashboard from "./pages/companyDashboard.jsx";

function App() {
  const [companyId, setCompanyId] = useState(null);
  const [showSignup, setShowSignup] = useState(false);


  // when a company logs in, setCompanyId() will be called from CompanyLogin
  // once companyId is set, dashboard will show instead of login

  return (
    <div style={{ padding: "2rem", fontFamily: "Inter, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>
        Internship & Placement Tracker
      </h1>

      <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center" }}>
        {!companyId ? (
          showSignup ? (
            <CompanySignup onSignupComplete={() => setShowSignup(false)} />
          ) : (
            <CompanyLogin onLogin={setCompanyId} />
          )
        ) : (
          <CompanyDashboard companyId={companyId} />
        )}
      </div>
    {!companyId && (
        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          {showSignup ? (
            <>
              Already registered?{" "}
              <a
                href="#"
                onClick={() => setShowSignup(false)}
                style={{ color: "#007bff" }}
              >
                Log in
              </a>
            </>
          ) : (
            <>
              New company?{" "}
              <a
                href="#"
                onClick={() => setShowSignup(true)}
                style={{ color: "#007bff" }}
              >
                Sign up
              </a>
            </>
          )}
        </p>
      )}
    </div>
  );
}

export default App;
