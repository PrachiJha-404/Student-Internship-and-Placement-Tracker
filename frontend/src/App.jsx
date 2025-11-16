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
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {!companyId ? (
        <>
          {/* Auth pages handle their own centering with full-screen gradients */}
          {showSignup ? (
            <CompanySignup onSignupComplete={() => setShowSignup(false)} />
          ) : (
            <CompanyLogin onLogin={setCompanyId} />
          )}
        </>
      ) : (
        // Dashboard with title
        <div style={styles.dashboardContainer}>
          <h1 style={styles.dashboardTitle}>
            Internship & Placement Tracker
          </h1>
          <div style={styles.dashboardContent}>
            <CompanyDashboard companyId={companyId} />
          </div>
        </div>
      )}
      
      {/* Toggle link - completely separate from auth pages */}
      {!companyId && (
        <div style={styles.fixedToggle}>
          <p style={styles.toggleText}>
            {showSignup ? (
              <>
                Already registered?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowSignup(false);
                  }}
                  style={styles.link}
                >
                  Log in
                </a>
              </>
            ) : (
              <>
                New company?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowSignup(true);
                  }}
                  style={styles.link}
                >
                  Sign up
                </a>
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

const styles = {
  fixedToggle: {
    position: "fixed",
    bottom: "30px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 999999,
    background: "rgba(255, 255, 255, 0.95)",
    padding: "12px 24px",
    borderRadius: "50px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    backdropFilter: "blur(10px)",
  },
  toggleText: {
    margin: "0",
    color: "#2d3748",
    fontSize: "15px",
  },
  link: {
    color: "#667eea",
    fontWeight: "700",
    textDecoration: "none",
    cursor: "pointer",
    transition: "color 0.2s ease",
    borderBottom: "2px solid #667eea",
  },
  dashboardContainer: {
    minHeight: "100vh",
    padding: "2rem",
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    background: "#f5f5f5",
  },
  dashboardTitle: {
    textAlign: "center",
    color: "#333",
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "2rem",
  },
  dashboardContent: {
    display: "flex",
    justifyContent: "center",
  },
};

export default App;