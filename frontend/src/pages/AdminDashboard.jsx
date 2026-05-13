import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllJobsAdminAPI, getAllApplicationsAPI, getAllInterviewsAPI, getAllUsersAPI } from '../api/axios';
import Spinner from '../components/Spinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ jobs: 0, applications: 0, interviews: 0, candidates: 0 });
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [jobs, apps, interviews, users] = await Promise.all([
          getAllJobsAdminAPI(), getAllApplicationsAPI(), getAllInterviewsAPI(), getAllUsersAPI()
        ]);
        setStats({
          jobs: jobs.data.length,
          applications: apps.data.length,
          interviews: interviews.data.length,
          candidates: users.data.length,
        });
        setRecentApps(apps.data.slice(0, 8));
      } catch { }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <Spinner message="Loading admin panel..." />;

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1>🛡️ Admin Dashboard</h1>
            <p>Manage jobs, applicants and interviews across all branches.</p>
          </div>
          <Link to="/admin/jobs/new" className="btn-primary">+ Post New Job</Link>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-box blue"><span className="stat-box-num">{stats.jobs}</span><span className="stat-box-label">Total Jobs</span></div>
          <div className="stat-box purple"><span className="stat-box-num">{stats.applications}</span><span className="stat-box-label">Applications</span></div>
          <div className="stat-box orange"><span className="stat-box-num">{stats.interviews}</span><span className="stat-box-label">Interviews</span></div>
          <div className="stat-box green"><span className="stat-box-num">{stats.candidates}</span><span className="stat-box-label">Candidates</span></div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-cards">
            <Link to="/admin/jobs" className="action-card">
              <span className="action-icon">💼</span>
              <h3>Manage Jobs</h3>
              <p>Post, edit, or close job listings</p>
            </Link>
            <Link to="/admin/applications" className="action-card">
              <span className="action-icon">📋</span>
              <h3>Review Applications</h3>
              <p>Shortlist, reject, and track candidates</p>
            </Link>
            <Link to="/admin/interviews" className="action-card">
              <span className="action-icon">📅</span>
              <h3>Schedule Interviews</h3>
              <p>View and manage all interview schedules</p>
            </Link>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="card-section">
          <div className="section-header">
            <h2>Recent Applications</h2>
            <Link to="/admin/applications" className="btn-secondary">View All</Link>
          </div>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr><th>Candidate</th><th>Job</th><th>Branch</th><th>Applied</th><th>Status</th></tr>
              </thead>
              <tbody>
                {recentApps.map(app => (
                  <tr key={app._id}>
                    <td>
                      <div className="candidate-cell">
                        <div className="mini-avatar">{app.candidate?.name?.charAt(0)}</div>
                        <div>
                          <strong>{app.candidate?.name}</strong>
                          <small>{app.candidate?.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>{app.job?.title}</td>
                    <td><span className="branch-tag">{app.job?.branch}</span></td>
                    <td>{new Date(app.createdAt).toLocaleDateString('en-PK')}</td>
                    <td>
                      <span className={`status-chip status-${app.status?.toLowerCase().replace(' ', '-')}`}>{app.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
