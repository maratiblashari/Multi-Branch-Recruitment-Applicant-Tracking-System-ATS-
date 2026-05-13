import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyApplicationsAPI, getMyInterviewsAPI } from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';

const STATUS_STEPS = ['Submitted', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected'];

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('applications');

  useEffect(() => {
    const load = async () => {
      try {
        const [appRes, intRes] = await Promise.all([getMyApplicationsAPI(), getMyInterviewsAPI()]);
        setApplications(appRes.data);
        setInterviews(intRes.data);
      } catch { }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const stats = {
    total: applications.length,
    shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
    interviews: applications.filter(a => a.status === 'Interview Scheduled').length,
    selected: applications.filter(a => a.status === 'Selected').length,
  };

  if (loading) return <Spinner message="Loading your dashboard..." />;

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Welcome Banner */}
        <div className="dashboard-welcome">
          <div className="welcome-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <div>
            <h1>Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋</h1>
            <p>Track your applications and interview schedules below.</p>
          </div>
          <Link to="/profile" className="btn-secondary" style={{ marginLeft: 'auto' }}>Edit Profile</Link>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-box blue"><span className="stat-box-num">{stats.total}</span><span className="stat-box-label">Applications</span></div>
          <div className="stat-box purple"><span className="stat-box-num">{stats.shortlisted}</span><span className="stat-box-label">Shortlisted</span></div>
          <div className="stat-box orange"><span className="stat-box-num">{stats.interviews}</span><span className="stat-box-label">Interviews</span></div>
          <div className="stat-box green"><span className="stat-box-num">{stats.selected}</span><span className="stat-box-label">Selected</span></div>
        </div>

        {/* Profile Completion Warning */}
        {!user?.resumeUrl && (
          <div className="warning-banner">
            ⚠️ Your profile is incomplete. <Link to="/profile">Upload your resume</Link> to start applying for jobs.
          </div>
        )}

        {/* Tabs */}
        <div className="tabs">
          <button id="tab-applications" className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`} onClick={() => setActiveTab('applications')}>
            📋 Applications ({applications.length})
          </button>
          <button id="tab-interviews" className={`tab-btn ${activeTab === 'interviews' ? 'active' : ''}`} onClick={() => setActiveTab('interviews')}>
            📅 Interviews ({interviews.length})
          </button>
        </div>

        {/* Applications Table */}
        {activeTab === 'applications' && (
          <div className="table-card">
            {applications.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📭</span>
                <p>No applications yet. <Link to="/">Browse Jobs →</Link></p>
              </div>
            ) : (
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Job Title</th>
                      <th>Branch</th>
                      <th>Department</th>
                      <th>Applied On</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app, i) => (
                      <tr key={app._id}>
                        <td>{i + 1}</td>
                        <td><Link to={`/jobs/${app.job?._id}`} className="table-link">{app.job?.title}</Link></td>
                        <td><span className="branch-tag">{app.job?.branch}</span></td>
                        <td>{app.job?.department}</td>
                        <td>{new Date(app.createdAt).toLocaleDateString('en-PK')}</td>
                        <td><StatusBadge status={app.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Interviews */}
        {activeTab === 'interviews' && (
          <div className="interviews-grid">
            {interviews.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📅</span>
                <p>No interviews scheduled yet.</p>
              </div>
            ) : (
              interviews.map(iv => (
                <div key={iv._id} className="interview-card candidate">
                  <div className="interview-card-header">
                    <h3>{iv.job?.title}</h3>
                    <span className={`interview-type-badge ${iv.interviewType?.toLowerCase()}`}>{iv.interviewType}</span>
                  </div>
                  <p className="interview-branch">📍 {iv.job?.branch} — {iv.job?.department}</p>
                  <div className="interview-datetime">
                    <span>📅 {new Date(iv.scheduledDate).toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <span>⏰ {iv.scheduledTime}</span>
                  </div>
                  {iv.meetingLink && (
                    <a href={iv.meetingLink} target="_blank" rel="noreferrer" className="btn-primary" style={{ marginTop: '12px', display: 'inline-block' }}>
                      🔗 Join Meeting
                    </a>
                  )}
                  {iv.message && (
                    <div className="interview-message">
                      <strong>Message from HR:</strong>
                      <p>{iv.message}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;
