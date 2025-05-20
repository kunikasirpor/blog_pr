// src/components/Login.jsx
import React, { useState } from 'react';
import Toast from './AuthToast';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('user');
  const [password, setPassword] = useState('pass');
  const [toast, setToast] = useState({ message: '', type: '' });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setToast({ message: data.message || 'Login successful', type: 'success' });
        onLoginSuccess?.(); // Call login success handler
      } else {
        setToast({ message: data.message || 'Login failed', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Server error', type: 'error' });
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Login</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="text"
          placeholder="Username"
          style={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          style={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" style={styles.button}>Login</button>
      </form>
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({})}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: '40px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    boxShadow: '2px 2px 10px rgba(0,0,0,0.1)',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Login;
