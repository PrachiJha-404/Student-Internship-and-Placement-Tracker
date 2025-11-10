import { useState } from "react";

export default function CompanyLogin({ onLogin }) {
  console.log("✅ CompanyLogin loaded");

  const [form, setForm] = useState({ name: "", password: "" });
  const [loading, setLoading] = useState(false);

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
        onLogin(data.companyId); // ✅ switch to dashboard
      } else {
        alert(data.error || "Invalid credentials");
      }
    } catch (err) {
      alert("⚠️ Could not reach server");
      console.error(err);
    }

    setLoading(false);
  };

  // 🧩 The actual JSX needs to be returned here (outside handleSubmit)
  return (
    <div
      style={{
        width: "350px",
        margin: "2rem auto",
        padding: "1.5rem",
        borderRadius: "10px",
        boxShadow: "0 0 8px rgba(0,0,0,0.15)",
        background: "#fff",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Company Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Company Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            marginBottom: "0.8rem",
            padding: "0.6rem",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            marginBottom: "1rem",
            padding: "0.6rem",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.6rem",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
