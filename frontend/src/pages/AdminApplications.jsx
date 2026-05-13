import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllApplicationsAPI, getApplicationsByJobAPI, updateAppStatusAPI, sendCandidateEmailAPI } from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';

const STATUSES = ['Submitted','Under Review','Shortlisted','Interview Scheduled','Rejected','Selected'];

const AdminApplications = () => {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('job');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [emailModal, setEmailModal] = useState(null);
  const [emailForm, setEmailForm] = useState({ subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = jobId ? await getApplicationsByJobAPI(jobId) : await getAllApplicationsAPI();
        setApplications(data);
      } catch { toast.error('Failed to load applications'); }
      finally { setLoading(false); }
    };
    load();
  }, [jobId]);

  const handleStatusChange = async (appId, status) => {
    try {
      const { data } = await updateAppStatusAPI(appId, { status });
      setApplications(prev => prev.map(a => a._id === appId ? { ...a, status: data.status } : a));
      if (selected?._id === appId) setSelected({ ...selected, status: data.status });
      toast.success(`Status updated to "${status}" — email sent if applicable`);
    } catch { toast.error('Failed to update status'); }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!emailForm.subject || !emailForm.message) return toast.error('Fill subject and message');
    setSending(true);
    try {
      await sendCandidateEmailAPI(emailModal._id, emailForm);
      toast.success('Email sent!');
      setEmailModal(null);
      setEmailForm({ subject: '', message: '' });
    } catch { toast.error('Failed to send email'); }
    finally { setSending(false); }
  };

  const filtered = filter === 'All' ? applications : applications.filter(a => a.status === filter);

  if (loading) return <Spinner message="Loading applications..." />;

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1>📋 Applications</h1>
            <p>{applications.length} total applications</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="filter-pills" style={{ marginBottom: '20px', flexWrap: 'wrap' }}>
          {['All', ...STATUSES].map(s => (
            <button key={s} className={`filter-pill ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>{s}</button>
          ))}
        </div>

        <div className="admin-split">
          {/* Left: List */}
          <div className="app-list">
            {filtered.length === 0 && <div className="empty-state"><span className="empty-icon">📭</span><p>No applications.</p></div>}
            {filtered.map(app => (
              <div
                key={app._id}
                className={`app-list-item ${selected?._id === app._id ? 'selected' : ''}`}
                onClick={() => setSelected(app)}
              >
                <div className="mini-avatar">{app.candidate?.name?.charAt(0)}</div>
                <div className="app-list-info">
                  <strong>{app.candidate?.name}</strong>
                  <small>{app.job?.title} — {app.job?.branch}</small>
                  <small>{new Date(app.createdAt).toLocaleDateString('en-PK')}</small>
                </div>
                <StatusBadge status={app.status} size="sm" />
              </div>
            ))}
          </div>

          {/* Right: Detail */}
          {selected ? (
            <div className="app-detail-panel">
              <div className="app-detail-header">
                <div className="profile-pic-wrapper" style={{ width: 60, height: 60 }}>
                  {selected.candidate?.profilePic
                    ? <img src={selected.candidate.profilePic} alt="" className="profile-pic" />
                    : <div className="profile-pic-placeholder" style={{ fontSize: 24 }}>{selected.candidate?.name?.charAt(0)}</div>
                  }
                </div>
                <div>
                  <h2>{selected.candidate?.name}</h2>
                  <p>{selected.candidate?.email} • {selected.candidate?.phone}</p>
                  <p>📍 {selected.candidate?.city}</p>
                </div>
              </div>

              <div className="detail-grid">
                <div><strong>Job:</strong> {selected.job?.title}</div>
                <div><strong>Branch:</strong> {selected.job?.branch}</div>
                <div><strong>Department:</strong> {selected.job?.department}</div>
                <div><strong>Applied:</strong> {new Date(selected.createdAt).toLocaleDateString('en-PK')}</div>
                {selected.candidate?.education && <div><strong>Education:</strong> {selected.candidate.education}</div>}
                {selected.candidate?.experience && <div><strong>Experience:</strong> {selected.candidate.experience}</div>}
              </div>

              {selected.candidate?.skills?.length > 0 && (
                <div className="skills-section">
                  <strong>Skills:</strong>
                  <div className="skills-tags">
                    {selected.candidate.skills.map(s => <span key={s} className="skill-tag">{s}</span>)}
                  </div>
                </div>
              )}

              <div className="doc-links">
                {selected.resumeUrl && <a href={selected.resumeUrl} target="_blank" rel="noreferrer" className="btn-secondary">📄 View Resume</a>}
                {selected.candidate?.coverLetterUrl && <a href={selected.candidate.coverLetterUrl} target="_blank" rel="noreferrer" className="btn-secondary">📝 Cover Letter</a>}
              </div>

              {selected.coverLetterText && (
                <div className="cover-text-box">
                  <strong>Cover Letter Message:</strong>
                  <p>{selected.coverLetterText}</p>
                </div>
              )}

              {/* Status Update */}
              <div className="status-update-section">
                <label><strong>Update Status:</strong></label>
                <div className="status-btns">
                  {STATUSES.map(s => (
                    <button
                      key={s}
                      className={`status-action-btn ${selected.status === s ? 'current' : ''}`}
                      onClick={() => handleStatusChange(selected._id, s)}
                    >{s}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <button className="btn-secondary" onClick={() => setEmailModal(selected)}>
                  📧 Send Custom Email
                </button>
              </div>
            </div>
          ) : (
            <div className="app-detail-empty">
              <span style={{ fontSize: '48px' }}>👈</span>
              <p>Select an applicant to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Email Modal */}
      {emailModal && (
        <div className="modal-overlay" onClick={() => setEmailModal(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h2>📧 Send Email to {emailModal.candidate?.name}</h2>
            <form onSubmit={handleSendEmail} className="auth-form">
              <div className="form-group">
                <label>Subject</label>
                <input className="form-input" value={emailForm.subject} onChange={e => setEmailForm({ ...emailForm, subject: e.target.value })} placeholder="Email subject..." required />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea className="form-input" rows={5} value={emailForm.message} onChange={e => setEmailForm({ ...emailForm, message: e.target.value })} placeholder="Your message..." required />
              </div>
              <div className="form-row-2">
                <button type="button" className="btn-secondary" onClick={() => setEmailModal(null)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={sending}>{sending ? 'Sending...' : '📤 Send Email'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApplications;
