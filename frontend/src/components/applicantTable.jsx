import { useState, useEffect } from "react";

export default function ApplicantTable({ jobId }) {
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/company/jobs/${jobId}/applicants`)
      .then(r => r.json())
      .then(setApplicants);
  }, [jobId]);

  const updateStatus = async (appId, status) => {
    await fetch(`http://localhost:5000/api/company/applications/${appId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  };

  return (
    <table>
      <thead>
        <tr><th>Name</th><th>GPA</th><th>Resume</th><th>Status</th></tr>
      </thead>
      <tbody>
        {applicants.map(a => (
          <tr key={a.ApplicationID}>
            <td>{a.Name}</td>
            <td>{a.GPA}</td>
            <td><a href={a.Resume}>View</a></td>
            <td>
              <select defaultValue={a.Status} onChange={(e) => updateStatus(a.ApplicationID, e.target.value)}>
                <option>Applied</option>
                <option>Shortlisted</option>
                <option>InterviewScheduled</option>
                <option>Selected</option>
                <option>Rejected</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
