import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfileAPI, uploadPicAPI, uploadResumeAPI, uploadCLAPI } from '../api/axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    city: user?.city || '',
    education: user?.education || '',
    experience: user?.experience || '',
    skills: user?.skills?.join(', ') || '',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState({ pic: false, resume: false, cl: false });

  const picRef   = useRef();
  const resumeRef = useRef();
  const clRef    = useRef();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfileAPI(form);
      await refreshUser();
      toast.success('Profile updated! ✅');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (type, file) => {
    if (!file) return;
    const fd = new FormData();
    const uploadFn = { pic: uploadPicAPI, resume: uploadResumeAPI, cl: uploadCLAPI }[type];
    const fieldName = { pic: 'profilePic', resume: 'resume', cl: 'coverLetter' }[type];
    fd.append(fieldName, file);
    setUploading({ ...uploading, [type]: true });
    try {
      await uploadFn(fd);
      await refreshUser();
      toast.success({ pic: 'Profile picture updated!', resume: 'Resume uploaded!', cl: 'Cover letter uploaded!' }[type]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading({ ...uploading, [type]: false });
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 className="page-title">👤 My Profile</h1>

        {/* Profile Picture */}
        <div className="profile-pic-section">
          <div className="profile-pic-wrapper">
            {user?.profilePic
              ? <img src={user.profilePic} alt="Profile" className="profile-pic" />
              : <div className="profile-pic-placeholder">{user?.name?.charAt(0).toUpperCase()}</div>
            }
          </div>
          <div className="profile-pic-actions">
            <p className="profile-email">{user?.email}</p>
            <span className={`role-badge ${user?.role}`}>{user?.role === 'admin' ? '🛡️ Admin' : '👤 Candidate'}</span>
            <button className="btn-secondary" onClick={() => picRef.current.click()} disabled={uploading.pic}>
              {uploading.pic ? 'Uploading...' : '📷 Change Photo'}
            </button>
            <input type="file" ref={picRef} accept="image/*" style={{ display: 'none' }} onChange={(e) => handleUpload('pic', e.target.files[0])} />
          </div>
        </div>

        {/* Personal Info Form */}
        <div className="card-section">
          <h2 className="section-heading">Personal Information</h2>
          <form onSubmit={handleSave} className="auth-form">
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="profile-name">Full Name</label>
                <input id="profile-name" name="name" value={form.name} onChange={handleChange} className="form-input" placeholder="Your name" />
              </div>
              <div className="form-group">
                <label htmlFor="profile-phone">Phone</label>
                <input id="profile-phone" name="phone" value={form.phone} onChange={handleChange} className="form-input" placeholder="+92 3xx xxxxxxx" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="profile-city">City</label>
              <input id="profile-city" name="city" value={form.city} onChange={handleChange} className="form-input" placeholder="Islamabad" />
            </div>
            <div className="form-group">
              <label htmlFor="profile-education">Education</label>
              <input id="profile-education" name="education" value={form.education} onChange={handleChange} className="form-input" placeholder="e.g. BSCS — FAST NUCES 2025" />
            </div>
            <div className="form-group">
              <label htmlFor="profile-experience">Experience</label>
              <textarea id="profile-experience" name="experience" value={form.experience} onChange={handleChange} className="form-input" rows={3} placeholder="Briefly describe your work experience..." />
            </div>
            <div className="form-group">
              <label htmlFor="profile-skills">Skills (comma-separated)</label>
              <input id="profile-skills" name="skills" value={form.skills} onChange={handleChange} className="form-input" placeholder="React, Node.js, MongoDB..." />
            </div>
            <button id="save-profile-btn" type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : '💾 Save Changes'}
            </button>
          </form>
        </div>

        {/* Document Uploads */}
        <div className="card-section">
          <h2 className="section-heading">Documents</h2>
          <div className="doc-upload-grid">
            {/* Resume */}
            <div className="doc-upload-card">
              <div className="doc-icon">📄</div>
              <div className="doc-info">
                <h4>Resume (PDF)</h4>
                {user?.resumeUrl
                  ? <a href={user.resumeUrl} target="_blank" rel="noreferrer" className="doc-link">View Current Resume ↗</a>
                  : <p className="doc-missing">No resume uploaded</p>
                }
              </div>
              <button className="btn-secondary" onClick={() => resumeRef.current.click()} disabled={uploading.resume}>
                {uploading.resume ? 'Uploading...' : user?.resumeUrl ? '🔄 Replace' : '⬆️ Upload'}
              </button>
              <input type="file" ref={resumeRef} accept=".pdf" style={{ display: 'none' }} onChange={(e) => handleUpload('resume', e.target.files[0])} />
            </div>

            {/* Cover Letter */}
            <div className="doc-upload-card">
              <div className="doc-icon">📝</div>
              <div className="doc-info">
                <h4>Cover Letter (PDF/DOCX)</h4>
                {user?.coverLetterUrl
                  ? <a href={user.coverLetterUrl} target="_blank" rel="noreferrer" className="doc-link">View Cover Letter ↗</a>
                  : <p className="doc-missing">No cover letter uploaded</p>
                }
              </div>
              <button className="btn-secondary" onClick={() => clRef.current.click()} disabled={uploading.cl}>
                {uploading.cl ? 'Uploading...' : user?.coverLetterUrl ? '🔄 Replace' : '⬆️ Upload'}
              </button>
              <input type="file" ref={clRef} accept=".pdf,.docx" style={{ display: 'none' }} onChange={(e) => handleUpload('cl', e.target.files[0])} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
