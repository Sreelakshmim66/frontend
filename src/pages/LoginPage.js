import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../graphql/queries';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await loginMutation({ variables: { input: form } });
      const result = data?.login;
        console.log('login result:', result);
      if (result?.success && result?.token) {
        login(result.token, result.userId);
        navigate('/search');
      } else {
        setError(result?.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('Connection error. Is the server running?');
    }
  };

  return (
    <div className="page-auth">
      {/* Left visual panel */}
      <div className="auth-visual">
        <div className="auth-visual-bg" />
        <div className="auth-visual-grid" />
        <div className="auth-visual-content">
          <div className="auth-visual-label">Travel Planning</div>
          <h1 className="auth-visual-title">
            Every journey<br />starts with a <span>plan.</span>
          </h1>
          <p className="auth-visual-tagline">
            Organise your trips, bookings, and adventures all in one place.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <div className="auth-form-header">
          <h2>Welcome back</h2>
          <p>Sign in to continue your journey</p>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>{error}</div>}

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="sree@gmail.com"
              value={form.email}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
}
