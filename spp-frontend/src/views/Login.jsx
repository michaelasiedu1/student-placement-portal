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

    // Basic validation
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

    try {
      // Simple demo authentication - in production, call your backend API
      // For now, accept any valid email/password and store in localStorage
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Store auth info in localStorage
      const userData = {
        email,
        name: email.split('@')[0],
        role: 'admin',
        loginTime: new Date().toISOString()
      };

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('authToken', `token_${Date.now()}`);

      onLogin(userData);
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    const demoUser = {
      email: 'demo@steadfastacademy.com',
      name: 'Demo User',
      role: 'admin',
      loginTime: new Date().toISOString()
    };

    localStorage.setItem('user', JSON.stringify(demoUser));
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('authToken', `token_${Date.now()}`);

    onLogin(demoUser);
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <div style={styles.header}>
          <h1 style={styles.title}>Student Placement Portal</h1>
          <p style={styles.subtitle}>Steadfast Academy</p>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={styles.input}
              disabled={loading}
            />
          </div>

          {error && (
            <div style={styles.error}>{error}</div>
          )}

          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={styles.divider}>OR</div>

        <button
          onClick={handleDemoLogin}
          style={styles.demoButton}
          disabled={loading}
        >
          Try Demo Account
        </button>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Demo Credentials:
          </p>
          <p style={styles.footerText}>
            Email: demo@steadfastacademy.com
          </p>
          <p style={styles.footerText}>
            Password: (any 6+ characters)
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: 'Arial, sans-serif',
  },
  loginBox: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 10px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
    marginBottom: '8px',
  },
  input: {
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'white',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '6px',
    marginTop: '10px',
    cursor: 'pointer',
    transition: 'opacity 0.3s',
  },
  error: {
    color: '#d32f2f',
    fontSize: '14px',
    padding: '10px',
    background: '#ffebee',
    borderRadius: '4px',
    textAlign: 'center',
  },
  divider: {
    textAlign: 'center',
    color: '#999',
    fontSize: '14px',
    margin: '20px 0',
  },
  demoButton: {
    padding: '12px',
    fontSize: '16px',
    color: '#667eea',
    background: '#f0f0f0',
    border: '2px solid #667eea',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s',
  },
  footer: {
    marginTop: '20px',
    padding: '15px',
    background: '#f9f9f9',
    borderRadius: '6px',
    textAlign: 'center',
  },
  footerText: {
    fontSize: '12px',
    color: '#666',
    margin: '4px 0',
  },
};
