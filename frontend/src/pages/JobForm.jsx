import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createJobAPI, getJobByIdAPI, updateJobAPI } from '../api/axios';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

const BRANCHES    = ['Islamabad', 'Lahore', 'Karachi', 'Remote'];
const JOB_TYPES   = ['Full-time', 'Part-time', 'Contract', 'Internship'];
const EXP_LEVELS  = ['Entry Level', 'Mid Level', 'Senior Level', 'Manager'];
const DEPARTMENTS = ['Engineering','Marketing','Finance','HR','Operations','Sales','IT','Design','Legal','Other'];

const JobForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title:'', description:'', requirements:'', department: DEPARTMENTS[0],
    branch: BRANCHES[0], availableSeats:1, salary:'', jobType: JOB_TYPES[0],
    experienceLevel: EXP_LEVELS[0], status:'Open', deadline:'',
  });

  useEffect(() => {
    if (!isEdit) return;
    getJobByIdAPI(id).then(({ data }) => {
      setForm({
        title: data.title, description: data.description, requirements: data.requirements,
        department: data.department, branch: data.branch, availableSeats: data.availableSeats,
        salary: data.salary||'', jobType: data.jobType, experienceLevel: data.experienceLevel,
        status: data.status, deadline: data.deadline ? data.deadline.split('T')[0] : '',
      });
      setLoading(false);
    }).catch(() => { toast.error('Job not found'); navigate('/admin/jobs'); });
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.requirements) return toast.error('Fill required fields');
    setSaving(true);
    try {
      if (isEdit) { await updateJobAPI(id, form); toast.success('Job updated!'); }
      else { await createJobAPI(form); toast.success('Job posted!'); }
      navigate('/admin/jobs');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <Spinner message="Loading job..." />;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth:'800px' }}>
        <button className="back-btn" onClick={() => navigate('/admin/jobs')}>← Back to Jobs</button>
        <h1 className="page-title">{isEdit ? '✏️ Edit Job' : '➕ Post New Job'}</h1>
        <div className="card-section">
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="job-title">Job Title *</label>
              <input id="job-title" name="title" value={form.title} onChange={handleChange} className="form-input" placeholder="e.g. Senior React Developer" required />
            </div>
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="job-branch">Branch</label>
                <select id="job-branch" name="branch" value={form.branch} onChange={handleChange} className="form-input">
                  {BRANCHES.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="job-dept">Department</label>
                <select id="job-dept" name="department" value={form.department} onChange={handleChange} className="form-input">
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row-3">
              <div className="form-group">
                <label htmlFor="job-type">Job Type</label>
                <select id="job-type" name="jobType" value={form.jobType} onChange={handleChange} className="form-input">
                  {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="job-exp">Experience</label>
                <select id="job-exp" name="experienceLevel" value={form.experienceLevel} onChange={handleChange} className="form-input">
                  {EXP_LEVELS.map(e => <option key={e}>{e}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="job-seats">Seats *</label>
                <input id="job-seats" type="number" name="availableSeats" value={form.availableSeats} onChange={handleChange} className="form-input" min={1} required />
              </div>
            </div>
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="job-salary">Salary Range</label>
                <input id="job-salary" name="salary" value={form.salary} onChange={handleChange} className="form-input" placeholder="e.g. 80k–120k PKR" />
              </div>
              <div className="form-group">
                <label htmlFor="job-deadline">Deadline</label>
                <input id="job-deadline" type="date" name="deadline" value={form.deadline} onChange={handleChange} className="form-input" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="job-status">Status</label>
              <select id="job-status" name="status" value={form.status} onChange={handleChange} className="form-input">
                <option>Open</option><option>Closed</option><option>Paused</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="job-desc">Job Description *</label>
              <textarea id="job-desc" name="description" value={form.description} onChange={handleChange} className="form-input" rows={5} required />
            </div>
            <div className="form-group">
              <label htmlFor="job-req">Requirements *</label>
              <textarea id="job-req" name="requirements" value={form.requirements} onChange={handleChange} className="form-input" rows={5} required />
            </div>
            <div className="form-row-2">
              <button type="button" className="btn-secondary" onClick={() => navigate('/admin/jobs')}>Cancel</button>
              <button id="job-save-btn" type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Saving...' : isEdit ? '💾 Update Job' : '🚀 Post Job'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobForm;
