const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-brand">
        <span className="footer-logo">🏢 Maratib ATS</span>
        <p className="footer-tagline">Multi-Branch Recruitment & Applicant Tracking System</p>
      </div>
      <div className="footer-links">
        <div className="footer-col">
          <h4>Branches</h4>
          <span>📍 Islamabad</span>
          <span>📍 Lahore</span>
          <span>📍 Karachi</span>
          <span>🌐 Remote</span>
        </div>
        <div className="footer-col">
          <h4>Portal</h4>
          <a href="/">Browse Jobs</a>
          <a href="/login">Login</a>
          <a href="/register">Register</a>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© {new Date().getFullYear()} Maratib — BSCS Semester Project</p>
    </div>
  </footer>
);

export default Footer;
