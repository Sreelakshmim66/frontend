import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ME } from '../graphql/queries';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();
  const userId = user?.userId;

  const { data, loading, error } = useQuery(GET_ME, {
    variables: { userId },
    skip: !userId,
  });

  const profile = data?.me;

  const initials = profile
    ? `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase()
    : '?';

  if (loading) return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <div className="spinner" />
      </div>
    </div>
  );

  if (error) return (
    <div className="page">
      <div className="alert alert-error">{error.message}</div>
    </div>
  );

  return (
    <div className="page">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800 }}>
          Profile
        </h1>
        <p style={{ color: 'var(--muted)', marginTop: '0.3rem' }}>Your account information</p>
      </div>

      {profile ? (
        <div className="profile-card">
          <div className="profile-card-header">
            <div className="profile-avatar">{initials}</div>
            <div>
              <h2>{profile.firstName} {profile.lastName}</h2>
              <p>{profile.emailId}</p>
            </div>
          </div>
          <div className="profile-fields">
            <div className="profile-field">
              <span className="profile-field-label">User ID</span>
              <span className="profile-field-value" style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--muted)' }}>
                {profile.userId}
              </span>
            </div>
            <div className="profile-field">
              <span className="profile-field-label">First name</span>
              <span className="profile-field-value">{profile.firstName}</span>
            </div>
            <div className="profile-field">
              <span className="profile-field-label">Last name</span>
              <span className="profile-field-value">{profile.lastName || '—'}</span>
            </div>
            <div className="profile-field">
              <span className="profile-field-label">Email</span>
              <span className="profile-field-value">{profile.emailId}</span>
            </div>
            <div className="profile-field">
              <span className="profile-field-label">Mobile</span>
              <span className="profile-field-value">{profile.mobileNumber || '—'}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="alert alert-error">Profile not found.</div>
      )}
    </div>
  );
}
