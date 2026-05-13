import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobByIdAPI, submitApplicationAPI } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverText, setCoverText] = useState('');
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await getJobByIdAPI(id);
        setJob(data);
      } catch {
        toast.error('Job not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!user) return navigate('/login');
    if (!user.resumeUrl) return toast.error('Please upload your resume in your Profile first!');
    setApplying(true);
    try {
      await submitApplicationAPI({ jobId: id, coverLetterText: coverText });
      toast.success('Application submitted successfully! 🎉');
      setApplied(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <Spinner message="Loading job details..." />;
  if (!job) return null;

  const branchColors = { Islamabad: '#3b82f6', Lahore: '#f59e0b', Karachi: '#22c55e', Remote: '#8b5cf6' };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Back */}
        <button className="back-btn" onClick={() => navigate(-1)}>← Back to Jobs</button>

        <div className="job-detail-card">
          {/* Header */}
          <div className="job-detail-header">
            <div>
              <span className="job-branch-badge" style={{ backgroundColor: `${branchColors[job.branch] || '#64748b'}18`, color: branchColors[job.branch] || '#64748b', marginBottom: '12px', display: 'inline-block' }}>
                📍 {job.branch}
              </span>
              <h1 className="job-detail-title">{job.title}</h1>
              <p className="job-detail-dept">🏛 {job.department}</p>
            </div>
            <div className={`status-pill ${job.status === 'Open' ? 'open' : 'closed'}`}>
              {job.status === 'Open' ? '🟢 Open' : '🔴 Closed'}
            </div>
          </div>

          {/* Meta */}
          <div className="job-meta-grid">
            <div className="meta-item"><span className="meta-icon">💼</span><div><span className="meta-label">Job Type</span><span className="meta-value">{job.jobType}</span></div></div>
            <div className="meta-item"><span className="meta-icon">📊</span><div><span className="meta-label">Experience</span><span className="meta-value">{job.experienceLevel}</span></div></div>
            <div className="meta-item"><span className="meta-icon">👥</span><div><span className="meta-label">Seats</span><span className="meta-value">{job.availableSeats}</span></div></div>
            {job.salary && <div className="meta-item"><span className="meta-icon">💰</span><div><span className="meta-label">Salary</span><span className="meta-value">{job.salary}</span></div></div>}
            {job.deadline && <div className="meta-item"><span className="meta-icon">⏳</span><div><span className="meta-label">Deadline</span><span className="meta-value">{new Date(job.deadline).toLocaleDateString('en-PK')}</span></div></div>}
            <div className="meta-item"><span className="meta-icon">📅</span><div><span className="meta-label">Posted</span><span className="meta-value">{new Date(job.createdAt).toLocaleDateString('en-PK')}</span></div></div>
          </div>

          {/* Description */}
          <div className="job-section">
            <h3>📋 Job Description</h3>
            <p>{job.description}</p>
          </div>

          <div className="job-section">
            <h3>✅ Requirements</h3>
            <p>{job.requirements}</p>
          </div>

          {/* Apply Section */}
          {job.status === 'Open' && !applied && (
            <div className="apply-section">
              <h3>📝 Apply for this Position</h3>
              {!user && <p className="apply-note">⚠️ Please <a href="/login">login</a> to apply.</p>}
              {user && !user.resumeUrl && (
                <p className="apply-note">⚠️ You need to <a href="/profile">upload your resume</a> before applying.</p>
              )}
              {user && user.resumeUrl && (
                <>
                  <div className="form-group">
                    <label htmlFor="cover-text">Cover Letter Message (Optional)</label>
                    <textarea
                      id="cover-text"
                      placeholder="Tell us why you're the perfect fit for this role..."
                      value={coverText}
                      onChange={(e) => setCoverText(e.target.value)}
                      className="form-input"
                      rows={4}
                    />
                  </div>
                  <button
                    id="apply-now-btn"
                    className="btn-primary"
                    onClick={handleApply}
                    disabled={applying}
                    style={{ marginTop: '12px' }}
                  >
                    {applying ? 'Submitting...' : '🚀 Submit Application'}
                  </button>
                </>
              )}
            </div>
          )}

          {applied && (
            <div className="success-banner">
              🎉 Application submitted! Track it in your <a href="/dashboard">Dashboard</a>.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
