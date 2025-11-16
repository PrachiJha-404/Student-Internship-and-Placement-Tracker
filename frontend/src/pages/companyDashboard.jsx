import { useEffect, useState } from "react";
import { Briefcase, Users, CheckCircle, TrendingUp, Calendar, DollarSign, GraduationCap, X, Plus } from "lucide-react";
import ApplicantTable from "../components/applicantTable.jsx";
import api from "../api/axios.js"
export default function CompanyDashboard({ companyId }) {
  const [stats, setStats] = useState({});
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, jobsRes] = await Promise.all([
          api.get("/api/company/dashboard"),
          api.get("/api/company/jobs"),
        ]);

        setStats(statsRes.data);
        setJobs(jobsRes.data);
        // const statsData = await statsRes.json();
        // const jobsData = await jobsRes.json();
        // setStats(statsData);
        // setJobs(jobsData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [companyId]);

  const activeJobs = jobs.filter((job) => new Date(job.Deadline) > new Date());

  const stopHiring = async (jobId) => {
    const res = await api.put(`/api/company/jobs/${jobId}/stop`);

    const data = await res.json();
    if (res.ok) {
      alert("✅ " + data.message);
      const refreshed = await api.get(`/api/company/jobs`);
      setJobs(refreshed.data);
    }
  };

  const handleJobPosted = async () => {
    setShowForm(false);
    const refreshed = await fetch(
      `http://localhost:5000/api/company/${companyId}/jobs`
    ).then((r) => r.json());
    setJobs(refreshed);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #e0e7ff 100%)',
      position: 'relative'
    }}>
      {/* Animated Background Pattern */}
      <div style={{
        position: 'fixed',
        inset: 0,
        opacity: 0.03,
        pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(0,0,0) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }}></div>

      <div style={{
        position: 'relative',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '2rem 1rem'
      }}>
        {/* Header Section */}
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(to right, #2563eb, #4f46e5)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: '600',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
              cursor: 'default'
            }}>
              Company Portal
            </div>
          </div>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #0f172a, #1e3a8a, #3730a3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.75rem'
          }}>
            Talent Hub
          </h1>
          <p style={{
            color: '#475569',
            fontSize: '1.125rem',
            maxWidth: '42rem',
            margin: '0 auto'
          }}>
            Manage your job postings, track applicants, and build your dream team
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          <StatCard 
            icon={<Briefcase size={24} />}
            title="Total Jobs" 
            value={stats.total_jobs || 0} 
            gradient="linear-gradient(to right, #3b82f6, #2563eb)"
          />
          <StatCard 
            icon={<TrendingUp size={24} />}
            title="Active Jobs" 
            value={activeJobs.length} 
            gradient="linear-gradient(to right, #10b981, #059669)"
          />
          <StatCard 
            icon={<Users size={24} />}
            title="Total Applicants" 
            value={stats.total_applications || 0} 
            gradient="linear-gradient(to right, #f59e0b, #d97706)"
          />
          <StatCard 
            icon={<CheckCircle size={24} />}
            title="Selected" 
            value={stats.selected || 0} 
            gradient="linear-gradient(to right, #8b5cf6, #7c3aed)"
          />
        </div>

        {/* Post Job Button */}
        <div style={{
          marginBottom: '3rem',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              background: 'linear-gradient(to right, #2563eb, #4f46e5)',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '1rem',
              fontWeight: '600',
              fontSize: '1.125rem',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 25px 50px -12px rgba(0,0,0,0.25)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1)';
            }}
          >
            {showForm ? (
              <>
                <X size={20} />
                Close Form
              </>
            ) : (
              <>
                <Plus size={20} />
                Post New Job
              </>
            )}
          </button>
        </div>

        {/* Job Post Form - Slide In Animation */}
        <div style={{
          maxHeight: showForm ? '1000px' : '0',
          opacity: showForm ? 1 : 0,
          transform: showForm ? 'translateY(0)' : 'translateY(-1rem)',
          overflow: 'hidden',
          transition: 'all 0.5s ease-out',
          marginBottom: showForm ? '3rem' : '0'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '1.5rem',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            padding: '2rem',
            border: '1px solid #e2e8f0'
          }}>
            <JobPostForm companyId={companyId} onSuccess={handleJobPosted} />
          </div>
        </div>

        {/* Job Postings */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.5rem'
          }}>
            <h2 style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              color: '#0f172a'
            }}>Job Postings</h2>
            <span style={{
              background: '#e2e8f0',
              color: '#334155',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              {jobs.length}
            </span>
          </div>
          
          {jobs.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '5rem 1rem',
              background: 'rgba(255, 255, 255, 0.5)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1.5rem',
              border: '2px dashed #cbd5e1'
            }}>
              <Briefcase size={64} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
              <p style={{ color: '#475569', fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                No job postings yet.
              </p>
              <p style={{ color: '#64748b' }}>Click "Post New Job" to get started!</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
              gap: '1.5rem'
            }}>
              {jobs.map((job, index) => {
                const isClosed = new Date(job.Deadline) <= new Date();
                return (
                  <JobCard 
                    key={job.JobID} 
                    job={job} 
                    isClosed={isClosed} 
                    stopHiring={stopHiring}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, gradient }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '1rem',
        padding: '1.5rem',
        boxShadow: isHovered ? '0 25px 50px -12px rgba(0,0,0,0.25)' : '0 10px 15px -3px rgba(0,0,0,0.1)',
        transform: isHovered ? 'translateY(-0.25rem)' : 'translateY(0)',
        transition: 'all 0.3s',
        border: '1px solid #e2e8f0'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{
        background: gradient,
        width: '3rem',
        height: '3rem',
        borderRadius: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        marginBottom: '1rem',
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
      }}>
        {icon}
      </div>
      <h3 style={{
        color: '#475569',
        fontSize: '0.875rem',
        fontWeight: '500',
        marginBottom: '0.5rem'
      }}>{title}</h3>
      <p style={{
        fontSize: '2.25rem',
        fontWeight: 'bold',
        color: '#0f172a',
        margin: 0
      }}>
        {value}
      </p>
    </div>
  );
}

function JobCard({ job, isClosed, stopHiring }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '1rem',
        padding: '1.5rem',
        boxShadow: isHovered ? '0 25px 50px -12px rgba(0,0,0,0.25)' : '0 10px 15px -3px rgba(0,0,0,0.1)',
        transition: 'all 0.3s',
        border: '1px solid #e2e8f0',
        opacity: isClosed ? 0.6 : 1
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#0f172a',
          marginBottom: '0.5rem'
        }}>
          {job.Title}
        </h3>
        {isClosed && (
          <span style={{
            display: 'inline-block',
            background: '#fee2e2',
            color: '#b91c1c',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '600'
          }}>
            Closed
          </span>
        )}
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#475569',
          marginBottom: '0.75rem'
        }}>
          <Calendar size={16} />
          <span style={{ fontSize: '0.875rem' }}>
            <span style={{ fontWeight: '600' }}>Deadline:</span> {new Date(job.Deadline).toLocaleDateString()}
          </span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#475569',
          marginBottom: '0.75rem'
        }}>
          <GraduationCap size={16} />
          <span style={{ fontSize: '0.875rem' }}>
            <span style={{ fontWeight: '600' }}>Min GPA:</span> {job.MinGPA}
          </span>
        </div>
        {job.Salary && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#475569'
          }}>
            <DollarSign size={16} />
            <span style={{ fontSize: '0.875rem' }}>
              <span style={{ fontWeight: '600' }}>Salary:</span> {Number(job.Salary).toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {!isClosed && (
        <button
          onClick={() => stopHiring(job.JobID)}
          style={{
            width: '100%',
            background: 'linear-gradient(to right, #ef4444, #dc2626)',
            color: 'white',
            padding: '0.75rem',
            borderRadius: '0.75rem',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
          }}
        >
          Stop Hiring
        </button>
      )}

      <div style={{
        marginTop: '1.5rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid #e2e8f0'
      }}>
        <ApplicantTable jobId={job.JobID} />
      </div>
    </div>
  );
}

function JobPostForm({ companyId, onSuccess }) {
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

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.deadline) {
      alert("⚠️ Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      await await api.post(`/api/company/jobs`, form);

      alert("✅ Job posted successfully!");
      setForm({
        title: "",
        description: "",
        deadline: "",
        salary: "",
        minGpa: "",
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("❌ Error posting job:", err);
      alert("Server error – check console");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2 style={{
        fontSize: '1.875rem',
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        Create New Position
      </h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <Input
          label="Job Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          placeholder="e.g. Senior Software Engineer"
        />
        <Input
          label="Application Deadline"
          name="deadline"
          type="date"
          value={form.deadline}
          onChange={handleChange}
          required
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <TextArea
          label="Job Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          placeholder="Describe the role, responsibilities, and requirements..."
        />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <Input
          label="Salary (Annual)"
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
      </div>

      <div style={{ textAlign: 'center', paddingTop: '1rem' }}>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            background: loading ? '#cbd5e1' : 'linear-gradient(to right, #2563eb, #4f46e5)',
            color: 'white',
            padding: '1rem 3rem',
            borderRadius: '0.75rem',
            fontWeight: '600',
            fontSize: '1.125rem',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.transform = 'scale(1.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.transform = 'scale(1)';
            }
          }}
        >
          {loading ? "Publishing..." : "Publish Job"}
        </button>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label style={{
        color: '#334155',
        fontWeight: '600',
        fontSize: '0.875rem'
      }}>
        {label}
      </label>
      <input
        {...props}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          border: `2px solid ${isFocused ? '#3b82f6' : '#e2e8f0'}`,
          borderRadius: '0.75rem',
          fontSize: '1rem',
          outline: 'none',
          transition: 'all 0.2s',
          background: 'white',
          boxShadow: isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none'
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
}

function TextArea({ label, ...props }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label style={{
        color: '#334155',
        fontWeight: '600',
        fontSize: '0.875rem'
      }}>
        {label}
      </label>
      <textarea
        {...props}
        rows={4}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          border: `2px solid ${isFocused ? '#3b82f6' : '#e2e8f0'}`,
          borderRadius: '0.75rem',
          fontSize: '1rem',
          outline: 'none',
          transition: 'all 0.2s',
          resize: 'vertical',
          background: 'white',
          boxShadow: isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none'
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
}