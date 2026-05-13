import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🏢</span>
          <span className="logo-text">Maratib <span className="logo-accent">ATS</span></span>
        </Link>

        {/* Hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className={`ham-line ${menuOpen ? 'open' : ''}`}></span>
          <span className={`ham-line ${menuOpen ? 'open' : ''}`}></span>
          <span className={`ham-line ${menuOpen ? 'open' : ''}`}></span>
        </button>

        {/* Nav Links */}
        <div className={`nav-links ${menuOpen ? 'nav-open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            Jobs
          </Link>

          {!user && (
            <>
              <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn-primary nav-btn" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}

          {user && user.role === 'candidate' && (
            <>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Profile</Link>
            </>
          )}

          {user && user.role === 'admin' && (
            <>
              <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Admin Panel</Link>
              <Link to="/admin/jobs" className={`nav-link ${isActive('/admin/jobs') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Jobs</Link>
              <Link to="/admin/applications" className={`nav-link ${isActive('/admin/applications') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Applicants</Link>
              <Link to="/admin/interviews" className={`nav-link ${isActive('/admin/interviews') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Interviews</Link>
            </>
          )}

          {user && (
            <div className="nav-user">
              <div className="nav-avatar">{user.name?.charAt(0).toUpperCase()}</div>
              <span className="nav-name">{user.name?.split(' ')[0]}</span>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
