import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ConfirmationPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const booking = state?.booking;
  const profile = state?.profile;

  if (!booking) {
    return (
      <div className="page">
        <div className="alert alert-error">No booking information found.</div>
        <button className="btn btn-ghost btn-sm" style={{ marginTop: '1rem' }} onClick={() => navigate('/search')}>
          Back to search
        </button>
      </div>
    );
  }

  return (
    <div className="page" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>

        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '0.5rem' }}>
          Booking Confirmed!
        </h1>
        <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>
          Your trip has been successfully booked.
        </p>

        <div style={{ background: 'var(--surface, #f9f9f9)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
          <div className="profile-field">
            <span className="profile-field-label">Itinerary Number</span>
            <span className="profile-field-value" style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1rem' }}>
              {booking.bookingId}
            </span>
          </div>
          <div className="profile-field">
            <span className="profile-field-label">Status</span>
            <span className="profile-field-value" style={{ textTransform: 'capitalize' }}>{booking.status}</span>
          </div>
          <div className="profile-field">
            <span className="profile-field-label">Booked On</span>
            <span className="profile-field-value">{booking.createdAt ? new Date(booking.createdAt).toLocaleString() : '—'}</span>
          </div>
        </div>

        <div style={{ background: 'var(--accent-subtle, #eef6ff)', borderRadius: 'var(--radius-md)', padding: '1rem 1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--muted)' }}>
            📧 A confirmation email has been sent to <strong>{profile?.email || booking.userDetails?.email}</strong>.
            Please check your inbox for the booking details.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => navigate('/search')}>
          Book Another Trip
        </button>

      </div>
    </div>
  );
}
