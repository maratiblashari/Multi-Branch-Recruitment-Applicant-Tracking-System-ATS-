import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  const branchColors = {
    Islamabad: '#3b82f6',
    Lahore:    '#f59e0b',
    Karachi:   '#22c55e',
    Remote:    '#8b5cf6',
  };

  const typeIcons = {
    'Full-time':  '💼',
    'Part-time':  '⏰',
    'Contract':   '📋',
    'Internship': '🎓',
  };

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div className="job-branch-badge" style={{ backgroundColor: `${branchColors[job.branch] || '#64748b'}18`, color: branchColors[job.branch] || '#64748b' }}>
          📍 {job.branch}
        </div>
        <div className={`job-status-dot ${job.status === 'Open' ? 'open' : 'closed'}`} />
      </div>

      <h3 className="job-title">{job.title}</h3>
      <p className="job-department">🏛 {job.department}</p>

      <div className="job-meta">
        <span className="job-tag">{typeIcons[job.jobType] || '💼'} {job.jobType}</span>
        <span className="job-tag">👥 {job.availableSeats} seat{job.availableSeats !== 1 ? 's' : ''}</span>
        {job.salary && <span className="job-tag">💰 {job.salary}</span>}
        <span className="job-tag">📊 {job.experienceLevel}</span>
      </div>

      {job.deadline && (
        <p className="job-deadline">
          ⏳ Deadline: {new Date(job.deadline).toLocaleDateString('en-PK')}
        </p>
      )}

      <div className="job-card-footer">
        <span className="job-posted">
          {new Date(job.createdAt).toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <Link to={`/jobs/${job._id}`} className="btn-view-job">
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
