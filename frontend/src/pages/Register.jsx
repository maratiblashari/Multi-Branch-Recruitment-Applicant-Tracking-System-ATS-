import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', phone: '', city: '' });
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill required fields');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (form.password !== form.confirm) return toast.error('Passwords do not match');

    const result = await register({ name: form.name, email: form.email, password: form.password, phone: form.phone, city: form.city });
    if (result.success) {
      toast.success('Account created! Welcome to Maratib 🎉');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <h1>🏢 Maratib ATS</h1>
          <p>Join thousands of professionals building their careers with us across Pakistan.</p>
          <div className="auth-features">
            <div className="auth-feature-item">🏙️ Islamabad Branch</div>
            <div className="auth-feature-item">🏙️ Lahore Branch</div>
            <div className="auth-feature-item">🏙️ Karachi Branch</div>
            <div className="auth-feature-item">🌐 Remote Opportunities</div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Start your career journey today</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="reg-name">Full Name *</label>
                <input id="reg-name" type="text" name="name" placeholder="Ahmed Khan" value={form.name} onChange={handleChange} className="form-input" required />
              </div>
              <div className="form-group">
                <label htmlFor="reg-email">Email *</label>
                <input id="reg-email" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} className="form-input" required />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="reg-phone">Phone</label>
                <input id="reg-phone" type="tel" name="phone" placeholder="+92 300 0000000" value={form.phone} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label htmlFor="reg-city">City</label>
                <input id="reg-city" type="text" name="city" placeholder="Islamabad" value={form.city} onChange={handleChange} className="form-input" />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="reg-password">Password *</label>
                <div className="input-with-icon">
                  <input
                    id="reg-password"
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    placeholder="Min 6 characters"
                    value={form.password}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                  <button type="button" className="input-icon-btn" onClick={() => setShowPass(!showPass)}>{showPass ? '🙈' : '👁️'}</button>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="reg-confirm">Confirm Password *</label>
                <input id="reg-confirm" type="password" name="confirm" placeholder="Repeat password" value={form.confirm} onChange={handleChange} className="form-input" required />
              </div>
            </div>

            <button id="register-submit-btn" type="submit" className="btn-primary btn-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
