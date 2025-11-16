import { useState } from "react";

export default function CompanyLogin({ onLogin }) {
  console.log("✅ CompanyLogin loaded");

  const [form, setForm] = useState({ name: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState({ name: false, password: false });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/company/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        onLogin(data.companyId);
      } else {
        alert(data.error || "Invalid credentials");
      }
    } catch (err) {
      alert("⚠️ Could not reach server");
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
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h2 style={styles.title}>Company Login</h2>
          <p style={styles.subtitle}>Welcome back! Please enter your credentials</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Company Name</label>
            <input
              name="name"
              placeholder="Enter your company name"
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
            <label style={styles.label}>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
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
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
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
    padding: "20px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
    overflow: "auto",
  },
  card: {
    background: "rgba(255, 255, 255, 0.98)",
    borderRadius: "20px",
    padding: "40px",
    paddingBottom: "100px",
    maxWidth: "440px",
    width: "100%",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    marginBottom: "80px",
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