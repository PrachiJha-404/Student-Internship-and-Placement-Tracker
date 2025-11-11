import { useState } from "react";

export default function JobPostForm({ companyId }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    salary: "",
    minGpa: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.deadline) {
      alert("⚠️ Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      await fetch(`http://localhost:5000/api/company/${companyId}/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      alert("✅ Job posted successfully!");
      setForm({
        title: "",
        description: "",
        deadline: "",
        salary: "",
        minGpa: "",
      });
    } catch (err) {
      console.error("❌ Error posting job:", err);
      alert("Server error — check console");
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1.2rem 1.5rem",
        maxWidth: "900px",
        width: "100%",
        margin: "0 auto",
      }}
    >
      {/* <div style={{ gridColumn: "1 / span 2", textAlign: "center" }}>
        <h3 style={{ color: "#222", marginBottom: "0.5rem" }}>Post a New Job</h3>
      </div> */}

      <Input
        label="Job Title"
        name="title"
        value={form.title}
        onChange={handleChange}
        required
      />
      <Input
        label="Application Deadline"
        name="deadline"
        type="date"
        value={form.deadline}
        onChange={handleChange}
        required
      />

      <TextArea
        label="Description"
        name="description"
        value={form.description}
        onChange={handleChange}
        required
        style={{ gridColumn: "1 / span 2" }}
      />

      <Input
        label="Salary"
        name="salary"
        type="number"
        placeholder="e.g. 60000"
        value={form.salary}
        onChange={handleChange}
      />
      <Input
        label="Minimum GPA"
        name="minGpa"
        type="number"
        step="0.1"
        placeholder="e.g. 8.0"
        value={form.minGpa}
        onChange={handleChange}
      />

      <div style={{ gridColumn: "1 / span 2", textAlign: "center" }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            background: loading ? "#ccc" : "#007bff",
            color: "#fff",
            border: "none",
            padding: "0.8rem 1.5rem",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.2s ease",
          }}
          onMouseOver={(e) => !loading && (e.target.style.background = "#0056b3")}
          onMouseOut={(e) => !loading && (e.target.style.background = "#007bff")}
        >
          {loading ? "Posting..." : "Publish Job"}
        </button>
      </div>
    </form>
  );
}

/* 🌟 Reusable Input Component */
function Input({ label, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label style={{ color: "#444", marginBottom: "0.3rem", fontWeight: "500" }}>
        {label}
      </label>
      <input
        {...props}
        style={{
          padding: "0.7rem",
          border: "1px solid #ccc",
          borderRadius: "6px",
          fontSize: "1rem",
          outline: "none",
          transition: "border-color 0.2s ease",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#007bff")}
        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
      />
    </div>
  );
}

/* 🌟 Reusable TextArea Component */
function TextArea({ label, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label style={{ color: "#444", marginBottom: "0.3rem", fontWeight: "500" }}>
        {label}
      </label>
      <textarea
        {...props}
        rows={3}
        style={{
          padding: "0.7rem",
          border: "1px solid #ccc",
          borderRadius: "6px",
          fontSize: "1rem",
          outline: "none",
          resize: "vertical",
          transition: "border-color 0.2s ease",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#007bff")}
        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
      />
    </div>
  );
}
