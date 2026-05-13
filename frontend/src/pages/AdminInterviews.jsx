import { useState, useEffect } from 'react';
import { getAllInterviewsAPI, getAllApplicationsAPI, scheduleInterviewAPI, updateInterviewAPI, deleteInterviewAPI } from '../api/axios';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';

const AdminInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [shortlisted, setShortlisted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ applicationId:'', scheduledDate:'', scheduledTime:'', interviewType:'Online', meetingLink:'', message:'' });

  useEffect(() => {
    const load = async () => {
      try {
        const [ivRes, appRes] = await Promise.all([getAllInterviewsAPI(), getAllApplicationsAPI()]);
        setInterviews(ivRes.data);
        setShortlisted(appRes.data.filter(a => a.status === 'Shortlisted'));
      } catch { toast.error('Failed to load data'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const handleSchedule = async (e) => {
    e.preventDefault();
    if (!form.applicationId || !form.scheduledDate || !form.scheduledTime) return toast.error('Fill required fields');
    setSaving(true);
    try {
      const { data } = await scheduleInterviewAPI(form);
      setInterviews(prev => [...prev, data]);
      setShortlisted(prev => prev.filter(a => a._id !== form.applicationId));
      toast.success('Interview scheduled & email sent!');
      setShowForm(false);
      setForm({ applicationId:'', scheduledDate:'', scheduledTime:'', interviewType:'Online', meetingLink:'', message:'' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to schedule'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Cancel this interview?')) return;
    try {
      await deleteInterviewAPI(id);
      setInterviews(prev => prev.filter(i => i._id !== id));
      toast.success('Interview cancelled');
    } catch { toast.error('Failed to cancel'); }
  };

  if (loading) return <Spinner message="Loading interviews..." />;

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1>📅 Interview Management</h1>
            <p>{interviews.length} scheduled • {shortlisted.length} shortlisted candidates awaiting</p>
          </div>
          <button id="schedule-interview-btn" className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Schedule Interview'}
          </button>
        </div>

        {/* Schedule Form */}
        {showForm && (
          <div className="card-section">
            <h2>Schedule New Interview</h2>
            <form onSubmit={handleSchedule} className="auth-form">
              <div className="form-group">
                <label>Select Shortlisted Candidate *</label>
                <select className="form-input" value={form.applicationId} onChange={e => setForm({ ...form, applicationId: e.target.value })} required>
                  <option value="">— Choose candidate —</option>
                  {shortlisted.map(a => (
                    <option key={a._id} value={a._id}>
                      {a.candidate?.name} → {a.job?.title} ({a.job?.branch})
                    </option>
                  ))}
                </select>
                {shortlisted.length === 0 && <small style={{ color: '#f59e0b' }}>⚠️ No shortlisted candidates. Shortlist applicants from the Applications page first.</small>}
              </div>
              <div className="form-row-3">
                <div className="form-group">
                  <label>Date *</label>
                  <input type="date" className="form-input" value={form.scheduledDate} onChange={e => setForm({ ...form, scheduledDate: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Time *</label>
                  <input type="time" className="form-input" value={form.scheduledTime} onChange={e => setForm({ ...form, scheduledTime: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Interview Type</label>
                  <select className="form-input" value={form.interviewType} onChange={e => setForm({ ...form, interviewType: e.target.value })}>
                    <option>Online</option>
                    <option>In-Person</option>
                    <option>Phone</option>
                  </select>
                </div>
              </div>
              {form.interviewType === 'Online' && (
                <div className="form-group">
                  <label>Meeting Link (Google Meet / Zoom)</label>
                  <input type="url" className="form-input" placeholder="https://meet.google.com/..." value={form.meetingLink} onChange={e => setForm({ ...form, meetingLink: e.target.value })} />
                </div>
              )}
              <div className="form-group">
                <label>Message to Candidate</label>
                <textarea className="form-input" rows={3} placeholder="Instructions, preparation tips, dress code..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
              </div>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Scheduling...' : '📅 Schedule & Send Email'}
              </button>
            </form>
          </div>
        )}

        {/* Interviews Grid */}
        {interviews.length === 0 ? (
          <div className="empty-state"><span className="empty-icon">📅</span><p>No interviews scheduled yet.</p></div>
        ) : (
          <div className="interviews-grid">
            {interviews.map(iv => (
              <div key={iv._id} className="interview-card">
                <div className="interview-card-header">
                  <div>
                    <h3>{iv.candidate?.name}</h3>
                    <p>{iv.candidate?.email}</p>
                  </div>
                  <span className={`interview-type-badge ${iv.interviewType?.toLowerCase()}`}>{iv.interviewType}</span>
                </div>
                <div className="interview-job-info">
                  <strong>{iv.job?.title}</strong>
                  <span className="branch-tag">{iv.job?.branch}</span>
                </div>
                <div className="interview-datetime">
                  <span>📅 {new Date(iv.scheduledDate).toLocaleDateString('en-PK', { weekday:'short', month:'short', day:'numeric', year:'numeric' })}</span>
                  <span>⏰ {iv.scheduledTime}</span>
                </div>
                {iv.meetingLink && (
                  <a href={iv.meetingLink} target="_blank" rel="noreferrer" className="meeting-link">🔗 {iv.meetingLink}</a>
                )}
                {iv.message && (
                  <p className="interview-message-preview">💬 {iv.message}</p>
                )}
                <div className="interview-actions">
                  <span className={`status-chip status-${iv.status?.toLowerCase()}`}>{iv.status}</span>
                  <button className="btn-icon delete" onClick={() => handleDelete(iv._id)} title="Cancel interview">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInterviews;
