import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, Link2, Building2, Briefcase } from "lucide-react";
import api from "../api/axios";

export default function StudentInterviews() {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const res = await api.get("/api/user/interviews");
                console.log("Fetched interviews:", res.data);
                setInterviews(res.data);
            } catch (err) {
                console.log("Interview fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInterviews();
    }, []);

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #e0e7ff 100%)',
                padding: '2rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{
                    fontSize: '1.25rem',
                    color: '#64748b',
                    fontWeight: '600'
                }}>
                    Loading interviews...
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #e0e7ff 100%)',
            padding: '2rem'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {/* Header */}
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{
                        display: 'inline-block',
                        background: 'linear-gradient(to right, #2563eb, #4f46e5)',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        marginBottom: '1rem'
                    }}>
                        📅 Interview Schedule
                    </div>
                    <h2 style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        background: 'linear-gradient(to right, #0f172a, #1e3a8a)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        marginBottom: '0.5rem'
                    }}>
                        Upcoming Interviews
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '1.125rem' }}>
                        {interviews.length === 0 
                            ? 'No upcoming interviews scheduled yet.' 
                            : `You have ${interviews.length} interview${interviews.length > 1 ? 's' : ''} scheduled`
                        }
                    </p>
                </div>

                {/* Interviews List */}
                {interviews.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '5rem 2rem',
                        background: 'rgba(255, 255, 255, 0.5)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '1.5rem',
                        border: '2px dashed #cbd5e1'
                    }}>
                        <Calendar size={64} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
                        <p style={{ 
                            color: '#475569', 
                            fontSize: '1.25rem', 
                            marginBottom: '0.5rem',
                            fontWeight: '600'
                        }}>
                            No Upcoming Interviews
                        </p>
                        <p style={{ color: '#64748b' }}>
                            Your scheduled interviews will appear here.
                        </p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gap: '1.5rem',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))'
                    }}>
                        {interviews.map((interview) => (
                            <InterviewCard key={interview.ScheduleID} interview={interview} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function InterviewCard({ interview }) {
    const [isHovered, setIsHovered] = useState(false);
    const isLink = interview.LinkOrLocation?.startsWith("http");
    
    // Format date and time
    const interviewDate = new Date(interview.InterviewAt || `${interview.InterviewDate} ${interview.InterviewTime}`);
    const formattedDate = interviewDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const formattedTime = interviewDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    // Check if interview is upcoming or past
    const now = new Date();
    const isPast = interviewDate < now;

    return (
        <div
            style={{
                background: isPast 
                    ? 'rgba(255, 255, 255, 0.5)' 
                    : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: isHovered 
                    ? '0 25px 50px -12px rgba(0,0,0,0.25)' 
                    : '0 10px 15px -3px rgba(0,0,0,0.1)',
                transition: 'all 0.3s',
                border: isPast 
                    ? '1px solid #e2e8f0' 
                    : '2px solid #3b82f6',
                opacity: isPast ? 0.7 : 1,
                position: 'relative',
                overflow: 'hidden'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Top accent bar */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: isPast 
                    ? 'linear-gradient(to right, #94a3b8, #64748b)' 
                    : 'linear-gradient(to right, #2563eb, #4f46e5)'
            }}></div>

            {/* Status Badge */}
            {isPast && (
                <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: '#f1f5f9',
                    color: '#64748b',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                }}>
                    Past
                </div>
            )}

            {/* Company and Job Title */}
            <div style={{ marginBottom: '1.25rem', marginTop: '0.5rem' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem'
                }}>
                    <Building2 size={20} color="#2563eb" />
                    <h3 style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: '#0f172a',
                        margin: 0
                    }}>
                        {interview.CompanyName}
                    </h3>
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginLeft: '1.75rem'
                }}>
                    <Briefcase size={16} color="#64748b" />
                    <p style={{
                        color: '#64748b',
                        fontSize: '1rem',
                        margin: 0
                    }}>
                        {interview.Title}
                    </p>
                </div>
            </div>

            {/* Date and Time */}
            <div style={{
                background: '#f8fafc',
                borderRadius: '0.75rem',
                padding: '1rem',
                marginBottom: '1rem'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '0.75rem'
                }}>
                    <div style={{
                        background: 'linear-gradient(to right, #2563eb, #4f46e5)',
                        borderRadius: '0.5rem',
                        padding: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Calendar size={20} color="white" />
                    </div>
                    <div>
                        <p style={{
                            color: '#0f172a',
                            fontWeight: '600',
                            fontSize: '1rem',
                            margin: 0
                        }}>
                            {formattedDate}
                        </p>
                    </div>
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}>
                    <div style={{
                        background: 'linear-gradient(to right, #4f46e5, #7c3aed)',
                        borderRadius: '0.5rem',
                        padding: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Clock size={20} color="white" />
                    </div>
                    <div>
                        <p style={{
                            color: '#0f172a',
                            fontWeight: '600',
                            fontSize: '1rem',
                            margin: 0
                        }}>
                            {formattedTime}
                        </p>
                    </div>
                </div>
            </div>

            {/* Location/Link */}
            <div style={{
                background: isLink ? '#eff6ff' : '#f1f5f9',
                borderRadius: '0.75rem',
                padding: '1rem',
                marginBottom: isLink ? '1rem' : '0'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}>
                    {isLink ? (
                        <Link2 size={20} color="#2563eb" />
                    ) : (
                        <MapPin size={20} color="#64748b" />
                    )}
                    <div style={{ flex: 1 }}>
                        <p style={{
                            color: '#64748b',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '0.25rem'
                        }}>
                            {isLink ? 'Meeting Link' : 'Location'}
                        </p>
                        <p style={{
                            color: '#0f172a',
                            fontWeight: '500',
                            margin: 0,
                            wordBreak: 'break-all'
                        }}>
                            {interview.LinkOrLocation}
                        </p>
                    </div>
                </div>
            </div>

            {/* Join Meeting Button */}
            {isLink && !isPast && (
                <a
                    href={interview.LinkOrLocation}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: 'block',
                        background: 'linear-gradient(to right, #2563eb, #4f46e5)',
                        color: 'white',
                        padding: '0.875rem',
                        borderRadius: '0.75rem',
                        textAlign: 'center',
                        fontWeight: '600',
                        textDecoration: 'none',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.02)';
                        e.target.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
                    }}
                >
                    Join Meeting →
                </a>
            )}
        </div>
    );
}