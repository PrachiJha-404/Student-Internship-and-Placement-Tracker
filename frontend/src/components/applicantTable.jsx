import { useState, useEffect } from "react";
import { User, GraduationCap, FileText, ChevronDown } from "lucide-react";

export default function ApplicantTable({ jobId }) {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/company/jobs/${jobId}/applicants`)
      .then(r => r.json())
      .then(data => {
        setApplicants(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [jobId]);

  const updateStatus = async (appId, status) => {
    await fetch(`http://localhost:5000/api/company/applications/${appId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    setApplicants(prev =>
      prev.map(app =>
        app.ApplicationID === appId ? { ...app, Status: status } : app
      )
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      Applied: { bg: "#dbeafe", text: "#1e40af", border: "#93c5fd" },
      Shortlisted: { bg: "#fef3c7", text: "#92400e", border: "#fcd34d" },
      InterviewScheduled: { bg: "#e0e7ff", text: "#3730a3", border: "#a5b4fc" },
      Selected: { bg: "#d1fae5", text: "#065f46", border: "#6ee7b7" },
      Rejected: { bg: "#fee2e2", text: "#991b1b", border: "#fca5a5" },
    };
    return colors[status] || colors["Applied"];
  };

  if (loading)
    return <p style={{ padding: "1rem", color: "#64748b" }}>Loading applicants...</p>;

  if (applicants.length === 0)
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
        No applicants yet.
      </div>
    );

  return (
    <div style={{ background: "white", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
      <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #e2e8f0" }}>
        <h3 style={{ margin: 0, fontWeight: 600, color: "#0f172a", display: "flex", gap: "0.5rem" }}>
          <User size={18} />
          Applicants ({applicants.length})
        </h3>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
            <th style={headerStyle}>Name</th>
            <th style={headerStyle}>GPA</th>
            <th style={headerStyle}>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <FileText size={14} />
                Resume
              </div>
            </th>
            <th style={headerStyle}>Status</th>
          </tr>
        </thead>

        <tbody>
          {applicants.map((a, i) => (
            <ApplicantRow
              key={a.ApplicationID}
              applicant={a}
              updateStatus={updateStatus}
              getStatusColor={getStatusColor}
              isLast={i === applicants.length - 1}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ApplicantRow({ applicant, updateStatus, getStatusColor, isLast }) {
  const statusColor = getStatusColor(applicant.Status);

  return (
    <tr style={{ borderBottom: isLast ? "none" : "1px solid #f1f5f9" }}>
      <td style={cellStyle}>{applicant.Name}</td>

      <td style={cellStyle}>
        <span
          style={{
            padding: "0.25rem 0.75rem",
            borderRadius: "9999px",
            background: applicant.GPA >= 8.5 ? "#d1fae5" : applicant.GPA >= 7 ? "#fef3c7" : "#fee2e2",
            color: applicant.GPA >= 8.5 ? "#065f46" : applicant.GPA >= 7 ? "#92400e" : "#991b1b",
            fontWeight: 600,
          }}
        >
          {applicant.GPA}
        </span>
      </td>

      <td style={cellStyle}>
        {applicant.Resume ? (
          <a
            href={`http://127.0.0.1:5000/api/user/resume/${applicant.Resume}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#2563eb", textDecoration: "underline", fontWeight: "500" }}
          >
            View
          </a>
        ) : (
          <span style={{ color: "#64748b" }}>No file</span>
        )}
      </td>

      <td style={cellStyle}>
        <select
          value={applicant.Status}
          onChange={(e) => updateStatus(applicant.ApplicationID, e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "0.5rem",
            background: statusColor.bg,
            color: statusColor.text,
            border: `1px solid ${statusColor.border}`,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <option value="Applied">Applied</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="InterviewScheduled">Interview Scheduled</option>
          <option value="Selected">Selected</option>
          <option value="Rejected">Rejected</option>
        </select>
      </td>
    </tr>
  );
}

const headerStyle = {
  padding: "0.75rem 1rem",
  textAlign: "left",
  fontWeight: "600",
  fontSize: "0.75rem",
  color: "#475569",
  textTransform: "uppercase",
};

const cellStyle = {
  padding: "1rem",
  color: "#334155",
  fontSize: "0.875rem",
};
