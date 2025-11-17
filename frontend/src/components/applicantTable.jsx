import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, Link2, X } from 'lucide-react';
import api from "../api/axios";

// Interview Scheduler Modal Component
function InterviewSchedulerModal({ 
  isOpen, 
  onClose, 
  applicationId, 
  studentName,
  jobTitle,
  onSchedule 
}) {
  const [formData, setFormData] = useState({
    interviewDate: '',
    interviewTime: '',
    linkOrLocation: '',
    isOnline: true
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!formData.interviewDate || !formData.interviewTime || !formData.linkOrLocation) {
      alert('⚠️ Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const interviewAt = `${formData.interviewDate} ${formData.interviewTime}:00`;
      
      await onSchedule({
        applicationId,
        interviewDate: formData.interviewDate,
        interviewTime: formData.interviewTime,
        interviewAt,
        linkOrLocation: formData.linkOrLocation
      });

      setFormData({
        interviewDate: '',
        interviewTime: '',
        linkOrLocation: '',
        isOnline: true
      });
      onClose();
    } catch (error) {
      console.error('Error scheduling interview:', error);
      alert('❌ Failed to schedule interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#0f172a',
              marginBottom: '0.25rem'
            }}>
              Schedule Interview
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
              {studentName} - {jobTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: '#f1f5f9',
              cursor: 'pointer'
            }}
          >
            <X size={20} color="#64748b" />
          </button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              color: '#334155',
              fontWeight: '600',
              fontSize: '0.875rem',
              marginBottom: '0.5rem'
            }}>
              Interview Type
            </label>
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              padding: '0.25rem',
              backgroundColor: '#f1f5f9',
              borderRadius: '0.5rem'
            }}>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isOnline: true })}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  background: formData.isOnline ? 'white' : 'transparent',
                  color: formData.isOnline ? '#2563eb' : '#64748b',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: formData.isOnline ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                Online
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isOnline: false })}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  background: !formData.isOnline ? 'white' : 'transparent',
                  color: !formData.isOnline ? '#2563eb' : '#64748b',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: !formData.isOnline ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                In-Person
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              color: '#334155',
              fontWeight: '600',
              fontSize: '0.875rem',
              marginBottom: '0.5rem'
            }}>
              <Calendar size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Interview Date *
            </label>
            <input
              type="date"
              value={formData.interviewDate}
              onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '0.5rem',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              color: '#334155',
              fontWeight: '600',
              fontSize: '0.875rem',
              marginBottom: '0.5rem'
            }}>
              <Clock size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Interview Time *
            </label>
            <input
              type="time"
              value={formData.interviewTime}
              onChange={(e) => setFormData({ ...formData, interviewTime: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '0.5rem',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              color: '#334155',
              fontWeight: '600',
              fontSize: '0.875rem',
              marginBottom: '0.5rem'
            }}>
              {formData.isOnline ? (
                <>
                  <Link2 size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                  Meeting Link *
                </>
              ) : (
                <>
                  <MapPin size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                  Location *
                </>
              )}
            </label>
            <input
              type="text"
              value={formData.linkOrLocation}
              onChange={(e) => setFormData({ ...formData, linkOrLocation: e.target.value })}
              placeholder={formData.isOnline ? 'https://meet.google.com/...' : 'Office address'}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '0.5rem',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem' }}>
            <button
              onClick={onClose}
              disabled={loading}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '2px solid #e2e8f0',
                background: 'white',
                color: '#64748b',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: loading ? '#cbd5e1' : 'linear-gradient(to right, #2563eb, #4f46e5)',
                color: 'white',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Scheduling...' : 'Schedule Interview'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Applicant Table Component
export default function ApplicantTable({ jobId }) {
  const [applicants, setApplicants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [jobTitle, setJobTitle] = useState('');

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const fetchApplicants = async () => {
    try {
      const res = await api.get(`/api/company/jobs/${jobId}/applicants`);
      console.log("Fetched applicants:", res.data); // Debug log
      setApplicants(res.data);
    } catch (err) {
      console.error("Error fetching applicants:", err);
    }
  };

  const handleStatusChange = async (applicationId, newStatus, applicantName) => {
    if (newStatus === "Interview Scheduled") {
      setSelectedApplicant({ applicationId, name: applicantName });
      setShowModal(true);
      return;
    }

    // Map display status to database enum
    const statusMapping = {
      'Applied': 'Applied',
      'OA Sent': 'Shortlisted',
      'Interview Scheduled': 'InterviewScheduled',
      'Selected': 'Selected',
      'Rejected': 'Rejected'
    };

    const dbStatus = statusMapping[newStatus] || newStatus;

    try {
      await api.put(`/api/company/applications/${applicationId}/status`, {
        status: dbStatus,
      });
      alert(`✅ Status updated to ${newStatus}`);
      fetchApplicants();
    } catch (err) {
      console.error("Error updating status:", err);
      alert("❌ Failed to update status");
    }
  };

  const handleScheduleInterview = async (scheduleData) => {
    try {
      // Only send the fields needed by the stored procedure
      const payload = {
        interviewDate: scheduleData.interviewDate,
        interviewTime: scheduleData.interviewTime,
        linkOrLocation: scheduleData.linkOrLocation
      };
      
      await api.post(
        `/api/company/applications/${scheduleData.applicationId}/schedule-interview`,
        payload
      );
      alert('✅ Interview scheduled successfully!');
      fetchApplicants();
    } catch (err) {
      console.error('Error scheduling interview:', err);
      throw err;
    }
  };

  if (applicants.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        color: '#64748b'
      }}>
        No applicants yet
      </div>
    );
  }

  return (
    <>
      <div>
        <h4 style={{
          fontSize: '1.125rem',
          fontWeight: 'bold',
          color: '#0f172a',
          marginBottom: '1rem'
        }}>
          Applicants ({applicants.length})
        </h4>
        
        <div style={{
          display: 'grid',
          gap: '1rem'
        }}>
          {applicants.map((applicant) => (
            <div
              key={applicant.ApplicationID}
              style={{
                padding: '1rem',
                backgroundColor: '#f8fafc',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0'
              }}
            >
              <div style={{ marginBottom: '0.75rem' }}>
                <p style={{
                  fontWeight: '600',
                  color: '#0f172a',
                  marginBottom: '0.25rem'
                }}>
                  {applicant.Name}
                </p>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#64748b'
                }}>
                  GPA: {applicant.GPA}
                </p>
              </div>

              <div style={{
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap'
              }}>
                {applicant.Resume && (
                  <a
                    href={`http://localhost:5000/${applicant.Resume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      borderRadius: '0.375rem',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      textDecoration: 'none',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    View Resume
                  </a>
                )}
                
                <select
                  value={getStatusDisplay(applicant.Status)}
                  onChange={(e) => handleStatusChange(
                    applicant.ApplicationID, 
                    e.target.value,
                    applicant.Name
                  )}
                  style={{
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    borderRadius: '0.375rem',
                    border: '1px solid #e2e8f0',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Applied">Applied</option>
                  <option value="OA Sent">OA Sent</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      <InterviewSchedulerModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedApplicant(null);
        }}
        applicationId={selectedApplicant?.applicationId}
        studentName={selectedApplicant?.name}
        jobTitle={jobTitle}
        onSchedule={handleScheduleInterview}
      />
    </>
  );
}

function getStatusColor(status) {
  const colors = {
    'Applied': { bg: '#dbeafe', text: '#1e40af' },
    'Shortlisted': { bg: '#fef3c7', text: '#92400e' },
    'InterviewScheduled': { bg: '#e0e7ff', text: '#4338ca' },
    'Selected': { bg: '#d1fae5', text: '#065f46' },
    'Rejected': { bg: '#fee2e2', text: '#991b1b' }
  };
  return colors[status] || { bg: '#f1f5f9', text: '#475569' };
}

function getStatusDisplay(status) {
  const displayNames = {
    'Applied': 'Applied',
    'Shortlisted': 'OA Sent',
    'InterviewScheduled': 'Interview Scheduled',
    'Selected': 'Selected',
    'Rejected': 'Rejected'
  };
  return displayNames[status] || status;
}