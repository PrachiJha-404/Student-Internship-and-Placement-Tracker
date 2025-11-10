import { useState } from "react";

export default function JobPostForm({ companyId }) {
  const [form, setForm] = useState({ title: "", description: "", deadline: "", salary: "", minGpa: "" });
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`http://localhost:5000/api/company/${companyId}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    alert("Job posted!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Post a New Job</h3>
      <input name="title" placeholder="Title" onChange={handleChange} />
      <input name="description" placeholder="Description" onChange={handleChange} />
      <input name="deadline" type="date" onChange={handleChange} />
      <input name="salary" type="number" placeholder="Salary" onChange={handleChange} />
      <input name="minGpa" type="number" step="0.1" placeholder="Min GPA" onChange={handleChange} />
      <button>Publish</button>
    </form>
  );
}
