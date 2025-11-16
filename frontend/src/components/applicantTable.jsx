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
    
    // Update local state
    setApplicants(prev => 
      prev.map(app => 
        app.ApplicationID === appId ? { ...app, Status: status } : app
      )
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      'Applied': { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
      'Shortlisted': { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' },
      'InterviewScheduled': { bg: '#e0e7ff', text: '#3730a3', border: '#a5b4fc' },
      'Selected': { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
      'Rejected': { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' }
    };
    return colors[status] || colors['Applied'];
  };

  if (loading) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        color: '#64748b',
        fontSize: '0.875rem'
      }}>
        Loading applicants...
      </div>
    );
  }

  if (applicants.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        background: 'rgba(148, 163, 184, 0.1)',
        borderRadius: '0.75rem',
        border: '1px dashed #cbd5e1'
      }}>
        <User size={32} color="#94a3b8" style={{ margin: '0 auto 0.5rem' }} />
        <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
          No applicants yet
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '0.75rem',
      overflow: 'hidden',
      border: '1px solid #e2e8f0'
    }}>
      <div style={{
        background: 'linear-gradient(to right, #f8fafc, #f1f5f9)',
        padding: '1rem 1.25rem',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '1rem',
          fontWeight: '600',
          color: '#0f172a',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <User size={18} />
          Applicants ({applicants.length})
        </h3>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr style={{
              background: '#f8fafc',
              borderBottom: '2px solid #e2e8f0'
            }}>
              <th style={headerStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={14} />
                  Name
                </div>
              </th>
              <th style={headerStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <GraduationCap size={14} />
                  GPA
                </div>
              </th>
              <th style={headerStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={14} />
                  Resume
                </div>
              </th>
              <th style={headerStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((a, index) => (
              <ApplicantRow 
                key={a.ApplicationID} 
                applicant={a} 
                updateStatus={updateStatus}
                getStatusColor={getStatusColor}
                isLast={index === applicants.length - 1}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ApplicantRow({ applicant, updateStatus, getStatusColor, isLast }) {
  const [isHovered, setIsHovered] = useState(false);
  const statusColor = getStatusColor(applicant.Status);

  return (
    <tr 
      style={{
        background: isHovered ? '#f8fafc' : 'white',
        borderBottom: isLast ? 'none' : '1px solid #f1f5f9',
        transition: 'background 0.2s'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <td style={cellStyle}>
        <div style={{
          fontWeight: '500',
          color: '#0f172a'
        }}>
          {applicant.Name}
        </div>
      </td>
      <td style={cellStyle}>
        <div style={{
          display: 'inline-block',
          background: applicant.GPA >= 8.5 ? '#d1fae5' : applicant.GPA >= 7.0 ? '#fef3c7' : '#fee2e2',
          color: applicant.GPA >= 8.5 ? '#065f46' : applicant.GPA >= 7.0 ? '#92400e' : '#991b1b',
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          fontSize: '0.875rem',
          fontWeight: '600'
        }}>
          {applicant.GPA}
        </div>
      </td>
      <td style={cellStyle}>
        <a 
          href={applicant.Resume}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#2563eb',
            textDecoration: 'none',
            fontWeight: '500',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.color = '#1e40af'}
          onMouseLeave={(e) => e.target.style.color = '#2563eb'}
        >
          <FileText size={14} />
          View
        </a>
      </td>
      <td style={cellStyle}>
        <div style={{ position: 'relative', display: 'inline-block', width: '100%', maxWidth: '200px' }}>
          <select 
            value={applicant.Status}
            onChange={(e) => updateStatus(applicant.ApplicationID, e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 2rem 0.5rem 0.75rem',
              background: statusColor.bg,
              color: statusColor.text,
              border: `1px solid ${statusColor.border}`,
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              appearance: 'none',
              outline: 'none',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.02)';
              e.target.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="Applied">Applied</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="InterviewScheduled">Interview Scheduled</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
          <ChevronDown 
            size={16} 
            style={{
              position: 'absolute',
              right: '0.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              color: statusColor.text
            }}
          />
        </div>
      </td>
    </tr>
  );
}

const headerStyle = {
  padding: '0.75rem 1rem',
  textAlign: 'left',
  fontSize: '0.75rem',
  fontWeight: '600',
  color: '#475569',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const cellStyle = {
  padding: '1rem',
  fontSize: '0.875rem',
  color: '#334155'
};