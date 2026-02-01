import React, { useState } from 'react';
import '../styles.css';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email format');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 400));

    const userData = {
      email,
      name: email.split('@')[0],
      role: 'admin',
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('authToken', `token_${Date.now()}`);

    onLogin(userData);
    setLoading(false);
  };

  const handleDemoLogin = () => {
    const demoUser = {
      email: 'demo@steadfastacademy.com',
      name: 'Demo User',
      role: 'admin',
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem('user', JSON.stringify(demoUser));
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('authToken', `token_${Date.now()}`);

    onLogin(demoUser);
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-header">
          <h1 className="login-title">Student Placement Portal</h1>
          <p className="login-subtitle">Steadfast Academy</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="form-input"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="form-input"
              disabled={loading}
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button
            type="submit"
            className="btn-primary login-submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-divider">OR</div>

        <button
          onClick={handleDemoLogin}
          className="btn-secondary login-demo"
          disabled={loading}
        >
          Try Demo Account
        </button>

        <div className="login-footer">
          <p className="footer-text">Demo Credentials:</p>
          <p className="footer-text">Email: demo@steadfastacademy.com</p>
          <p className="footer-text">Password: (any 6+ characters)</p>
        </div>
      </div>
    </div>
  );
}
