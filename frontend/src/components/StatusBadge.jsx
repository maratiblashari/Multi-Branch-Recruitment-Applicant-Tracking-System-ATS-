const STATUS_CONFIG = {
  'Submitted':           { color: '#6366f1', bg: '#eef2ff', label: 'Submitted' },
  'Under Review':        { color: '#f59e0b', bg: '#fffbeb', label: 'Under Review' },
  'Shortlisted':         { color: '#3b82f6', bg: '#eff6ff', label: 'Shortlisted' },
  'Interview Scheduled': { color: '#8b5cf6', bg: '#f5f3ff', label: 'Interview Scheduled' },
  'Rejected':            { color: '#ef4444', bg: '#fef2f2', label: 'Rejected' },
  'Selected':            { color: '#22c55e', bg: '#f0fdf4', label: '🎉 Selected' },
};

const StatusBadge = ({ status, size = 'md' }) => {
  const config = STATUS_CONFIG[status] || { color: '#64748b', bg: '#f1f5f9', label: status };
  const padding = size === 'sm' ? '2px 8px' : '4px 12px';
  const fontSize = size === 'sm' ? '11px' : '13px';

  return (
    <span
      style={{
        display: 'inline-block',
        padding,
        fontSize,
        fontWeight: 600,
        borderRadius: '20px',
        color: config.color,
        backgroundColor: config.bg,
        border: `1px solid ${config.color}30`,
        whiteSpace: 'nowrap',
      }}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
