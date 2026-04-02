import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { REGISTER_MUTATION } from '../graphql/queries';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '', lastName: '', emailId: '',
    password: '', confirmPassword: '', mobileNumber: ''
  });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  const [registerMutation, { loading }] = useMutation(REGISTER_MUTATION);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const { confirmPassword, ...input } = form;

    try {
      const { data } = await registerMutation({ variables: { input } });
      const result = data?.register;
      if (result?.success) {
        setSuccess('Account created! Redirecting to login…');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(result?.message || 'Registration failed.');
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
          <div className="auth-visual-label">Join Sree Travels</div>
          <h1 className="auth-visual-title">
            Plan smarter,<br />travel <span>further.</span>
          </h1>
          <p className="auth-visual-tagline">
            Create an account and start building your next adventure today.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <div className="auth-form-header">
          <h2>Create account</h2>
          <p>Fill in your details to get started</p>
        </div>

        {error   && <div className="alert alert-error"   style={{ marginBottom: '1.25rem' }}>{error}</div>}
        {success && <div className="alert alert-success" style={{ marginBottom: '1.25rem' }}>{success}</div>}

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First name</label>
              <input className="form-input" type="text" name="firstName"
                placeholder="Sreelakshmi" value={form.firstName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Last name</label>
              <input className="form-input" type="text" name="lastName"
                placeholder="M" value={form.lastName} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email address</label>
            <input className="form-input" type="email" name="emailId"
              placeholder="sree@gmail.com" value={form.emailId} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Mobile number</label>
            <input className="form-input" type="tel" name="mobileNumber"
              placeholder="+91 99999 00000" value={form.mobileNumber} onChange={handleChange} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" name="password"
                placeholder="Min 6 chars" value={form.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm password</label>
              <input className="form-input" type="password" name="confirmPassword"
                placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} required />
            </div>
          </div>

          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
