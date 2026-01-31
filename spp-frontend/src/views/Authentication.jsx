import React, { useState } from 'react';

export default function Authentication({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('teacher');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Demo credentials for testing
  const demoUsers = {
    'admin@spp.edu': { password: 'admin123', role: 'admin', name: 'Admin User' },
    'teacher@spp.edu': { password: 'teacher123', role: 'teacher', name: 'Teacher User' },
    'parent@spp.edu': { password: 'parent123', role: 'parent', name: 'Parent User' }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const user = demoUsers[email];
      
      if (user && user.password === password) {
        const userData = {
          email,
          name: user.name,
          role: user.role
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('authToken', 'demo-token-' + Date.now());
        
        onLoginSuccess(userData);
      } else {
        setError('Invalid email or password');
      }
      
      setLoading(false);
    }, 500);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password || !name) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const userData = {
        email,
        name,
        role
      };
      localStorage.setItem('currentUser', JSON.stringify(userData));
      localStorage.setItem('userRole', role);
      localStorage.setItem('authToken', 'demo-token-' + Date.now());
      
      onLoginSuccess(userData);
      
      setLoading(false);
    }, 500);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h1>📚 SPP System</h1>
          <p>Student Placement Portal</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {isLogin ? (
          <form onSubmit={handleLogin}>
            <h2>Login to Your Account</h2>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="auth-toggle">
              <p>Don't have an account? <button type="button" onClick={() => setIsLogin(false)}>Register here</button></p>
            </div>

            <div className="demo-credentials">
              <p><strong>Demo Credentials:</strong></p>
              <div className="demo-item">
                <span>Admin:</span> admin@spp.edu / admin123
              </div>
              <div className="demo-item">
                <span>Teacher:</span> teacher@spp.edu / teacher123
              </div>
              <div className="demo-item">
                <span>Parent:</span> parent@spp.edu / parent123
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <h2>Create New Account</h2>

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Account Type</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} disabled={loading}>
                <option value="teacher">Teacher</option>
                <option value="admin">Administrator</option>
                <option value="parent">Parent</option>
              </select>
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Creating Account...' : 'Register'}
            </button>

            <div className="auth-toggle">
              <p>Already have an account? <button type="button" onClick={() => setIsLogin(true)}>Login here</button></p>
            </div>
          </form>
        )}
      </div>

      <style>{`
        .auth-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #051219 0%, #0d1f2d 100%);
          padding: 2rem;
        }

        .auth-box {
          background: #0d1f2d;
          border: 1px solid #1a4d5c;
          border-radius: 12px;
          padding: 2.5rem;
          width: 100%;
          max-width: 450px;
          box-shadow: 0 8px 32px rgba(0, 212, 255, 0.1);
        }

        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .auth-header h1 {
          margin: 0 0 0.5rem 0;
          color: #00d4ff;
          font-size: 1.8rem;
        }

        .auth-header p {
          margin: 0;
          color: #bbb;
          font-size: 0.95rem;
        }

        .auth-box h2 {
          color: #00f5d4;
          margin-bottom: 1.5rem;
          font-size: 1.3rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          color: #bbb;
          margin-bottom: 0.5rem;
          font-weight: bold;
          font-size: 0.9rem;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          background: #051219;
          border: 1px solid #1a4d5c;
          color: #fff;
          padding: 0.75rem;
          border-radius: 6px;
          font-family: inherit;
          font-size: 0.95rem;
          transition: all 0.3s;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #00d4ff;
          background: #0f2a3d;
          box-shadow: 0 0 8px rgba(0, 212, 255, 0.2);
        }

        .form-group input:disabled,
        .form-group select:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-button {
          width: 100%;
          background: linear-gradient(135deg, #00d4ff, #00f5d4);
          color: #051219;
          padding: 0.75rem;
          border: none;
          border-radius: 6px;
          font-weight: bold;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .auth-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 212, 255, 0.3);
        }

        .auth-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-error {
          background: #3d0f0f;
          border: 1px solid #ff6b6b;
          color: #ff9999;
          padding: 0.75rem;
          border-radius: 6px;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }

        .auth-toggle {
          text-align: center;
          margin-top: 1.5rem;
        }

        .auth-toggle p {
          color: #bbb;
          margin: 0;
          font-size: 0.9rem;
        }

        .auth-toggle button {
          background: none;
          border: none;
          color: #00d4ff;
          cursor: pointer;
          font-weight: bold;
          text-decoration: underline;
          padding: 0;
        }

        .auth-toggle button:hover {
          color: #00f5d4;
        }

        .demo-credentials {
          background: #051219;
          border: 1px solid #1a4d5c;
          border-radius: 6px;
          padding: 1rem;
          margin-top: 1.5rem;
          font-size: 0.85rem;
        }

        .demo-credentials p {
          margin: 0 0 0.5rem 0;
          color: #00d4ff;
          font-weight: bold;
        }

        .demo-item {
          color: #bbb;
          margin: 0.3rem 0;
          padding: 0.3rem 0;
        }

        .demo-item span {
          color: #00d4ff;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
