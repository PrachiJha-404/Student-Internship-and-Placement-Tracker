import { useState } from "react";

export default function CompanySignup({ onSignupComplete }) {
  const [form, setForm] = useState({
    name: "",
    password: "",
    domain: "",
    location: "",
    eligibility: "",
    jobRole: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [focused, setFocused] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/company/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Company registered successfully! You can now log in.");
        setTimeout(() => onSignupComplete(), 1500);
      } else {
        setMessage(`⚠️ ${data.error || "Registration failed."}`);
      }
    } catch (err) {
      setMessage("⚠️ Server not reachable.");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.iconCircle}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </div>
          <h2 style={styles.title}>Company Signup</h2>
          <p style={styles.subtitle}>Create your company account to get started</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Company Name *</label>
            <input
              name="name"
              placeholder="Your company name"
              value={form.name}
              onChange={handleChange}
              onFocus={() => setFocused({ ...focused, name: true })}
              onBlur={() => setFocused({ ...focused, name: false })}
              required
              style={{
                ...styles.input,
                ...(focused.name ? styles.inputFocused : {}),
              }}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password *</label>
            <input
              name="password"
              type="password"
              placeholder="Create a strong password"
              value={form.password}
              onChange={handleChange}
              onFocus={() => setFocused({ ...focused, password: true })}
              onBlur={() => setFocused({ ...focused, password: false })}
              required
              style={{
                ...styles.input,
                ...(focused.password ? styles.inputFocused : {}),
              }}
            />
          </div>

          <div style={styles.row}>
            <div style={{ ...styles.inputGroup, flex: 1 }}>
              <label style={styles.label}>Domain</label>
              <input
                name="domain"
                placeholder="e.g. Software"
                value={form.domain}
                onChange={handleChange}
                onFocus={() => setFocused({ ...focused, domain: true })}
                onBlur={() => setFocused({ ...focused, domain: false })}
                style={{
                  ...styles.input,
                  ...(focused.domain ? styles.inputFocused : {}),
                }}
              />
            </div>
            <div style={{ ...styles.inputGroup, flex: 1 }}>
              <label style={styles.label}>Location</label>
              <input
                name="location"
                placeholder="City, Country"
                value={form.location}
                onChange={handleChange}
                onFocus={() => setFocused({ ...focused, location: true })}
                onBlur={() => setFocused({ ...focused, location: false })}
                style={{
                  ...styles.input,
                  ...(focused.location ? styles.inputFocused : {}),
                }}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Eligibility Criteria</label>
            <input
              name="eligibility"
              placeholder="e.g. GPA ≥ 8.0"
              value={form.eligibility}
              onChange={handleChange}
              onFocus={() => setFocused({ ...focused, eligibility: true })}
              onBlur={() => setFocused({ ...focused, eligibility: false })}
              style={{
                ...styles.input,
                ...(focused.eligibility ? styles.inputFocused : {}),
              }}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Job Role</label>
            <input
              name="jobRole"
              placeholder="e.g. SDE Intern"
              value={form.jobRole}
              onChange={handleChange}
              onFocus={() => setFocused({ ...focused, jobRole: true })}
              onBlur={() => setFocused({ ...focused, jobRole: false })}
              style={{
                ...styles.input,
                ...(focused.jobRole ? styles.inputFocused : {}),
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {}),
            }}
          >
            {loading ? (
              <span style={styles.buttonContent}>
                <span style={styles.spinner}></span>
                Creating Account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>

          {message && (
            <div
              style={{
                ...styles.message,
                ...(message.includes("✅") ? styles.messageSuccess : styles.messageError),
              }}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "120px 20px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
    overflow: "auto",
  },
  card: {
    background: "rgba(255, 255, 255, 0.98)",
    borderRadius: "20px",
    padding: "40px",
    maxWidth: "550px",
    width: "100%",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
  },
  header: {
    textAlign: "center",
    marginBottom: "32px",
  },
  iconCircle: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
    color: "white",
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1a202c",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "14px",
    color: "#718096",
    margin: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  row: {
    display: "flex",
    gap: "12px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#2d3748",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "15px",
    border: "2px solid #e2e8f0",
    borderRadius: "10px",
    outline: "none",
    transition: "all 0.2s ease",
    backgroundColor: "#f7fafc",
    boxSizing: "border-box",
  },
  inputFocused: {
    borderColor: "#667eea",
    backgroundColor: "white",
    boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
  },
  button: {
    width: "100%",
    padding: "14px",
    fontSize: "16px",
    fontWeight: "600",
    color: "white",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
    marginTop: "8px",
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  },
  buttonContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  spinner: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTopColor: "white",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    display: "inline-block",
  },
  message: {
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    textAlign: "center",
    fontWeight: "500",
  },
  messageSuccess: {
    backgroundColor: "#d4edda",
    color: "#155724",
    border: "1px solid #c3e6cb",
  },
  messageError: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    border: "1px solid #f5c6cb",
  },
};

// Add spinner animation
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  if (!document.getElementById('spinner-animation')) {
    styleSheet.id = 'spinner-animation';
    document.head.appendChild(styleSheet);
  }
}