import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllJobsAdminAPI, deleteJobAPI, updateJobAPI } from '../api/axios';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      const { data } = await getAllJobsAdminAPI();
      setJobs(data);
    } catch { toast.error('Failed to load jobs'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteJobAPI(id);
      toast.success('Job deleted');
      setJobs(jobs.filter(j => j._id !== id));
    } catch { toast.error('Failed to delete job'); }
  };

  const toggleStatus = async (job) => {
    const newStatus = job.status === 'Open' ? 'Closed' : 'Open';
    try {
      await updateJobAPI(job._id, { status: newStatus });
      toast.success(`Job marked as ${newStatus}`);
      setJobs(jobs.map(j => j._id === job._id ? { ...j, status: newStatus } : j));
    } catch { toast.error('Failed to update status'); }
  };

  const filtered = jobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.branch.toLowerCase().includes(search.toLowerCase()) ||
    j.department.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Spinner message="Loading jobs..." />;

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1>💼 Manage Jobs</h1>
            <p>{jobs.length} total job listings</p>
          </div>
          <Link to="/admin/jobs/new" id="post-job-btn" className="btn-primary">+ Post New Job</Link>
        </div>

        <div className="search-toolbar">
          <input
            type="text"
            placeholder="🔍 Search by title, branch, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ maxWidth: '400px' }}
          />
        </div>

        <div className="table-card">
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr><th>#</th><th>Title</th><th>Branch</th><th>Department</th><th>Seats</th><th>Type</th><th>Status</th><th>Posted</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map((job, i) => (
                  <tr key={job._id}>
                    <td>{i + 1}</td>
                    <td><strong>{job.title}</strong></td>
                    <td><span className="branch-tag">{job.branch}</span></td>
                    <td>{job.department}</td>
                    <td>{job.availableSeats}</td>
                    <td>{job.jobType}</td>
                    <td>
                      <button
                        className={`status-toggle ${job.status === 'Open' ? 'open' : 'closed'}`}
                        onClick={() => toggleStatus(job)}
                      >
                        {job.status === 'Open' ? '🟢 Open' : '🔴 Closed'}
                      </button>
                    </td>
                    <td>{new Date(job.createdAt).toLocaleDateString('en-PK')}</td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-icon edit" onClick={() => navigate(`/admin/jobs/${job._id}/edit`)} title="Edit">✏️</button>
                        <Link to={`/admin/applications?job=${job._id}`} className="btn-icon view" title="View Applicants">👥</Link>
                        <button className="btn-icon delete" onClick={() => handleDelete(job._id, job.title)} title="Delete">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="empty-state"><span className="empty-icon">📭</span><p>No jobs found.</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminJobs;
