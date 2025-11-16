import { useState } from "react";

export default function CompanySignup({ onSignupComplete = () => {} }) {
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
        padding: "2rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "1.5rem",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.15)",
          background: "#fff",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Company Signup</h2>

        <div>
          <input
            name="name"
            placeholder="Company Name"
            value={form.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            name="domain"
            placeholder="Domain (e.g. Software, Analytics)"
            value={form.domain}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="eligibility"
            placeholder="Eligibility Criteria (e.g. GPA ≥ 8)"
            value={form.eligibility}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="jobRole"
            placeholder="Job Role (e.g. SDE Intern)"
            value={form.jobRole}
            onChange={handleChange}
            style={inputStyle}
          />

          <button onClick={handleSubmit} disabled={loading} style={buttonStyle}>
            {loading ? "Registering..." : "Sign Up"}
          </button>

          {message && (
            <p style={{ textAlign: "center", marginTop: "1rem", color: "#333" }}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  marginBottom: "0.8rem",
  padding: "0.6rem",
  border: "1px solid #ccc",
  borderRadius: "5px",
};

const buttonStyle = {
  width: "100%",
  padding: "0.7rem",
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};