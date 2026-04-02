import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_TRIP, CREATE_BOOKING } from '../graphql/queries';
import { useAuth } from '../context/AuthContext';

const TYPE_ICON = { HOTEL: '🏨', FLIGHT: '✈️', ACTIVITY: '🎯' };

function AddBookingModal({ tripId, userId, onClose, onCreated }) {
  const [form, setForm] = useState({ type: 'HOTEL', details: '' });
  const [error, setError] = useState('');
  const [createBooking, { loading }] = useMutation(CREATE_BOOKING);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault(); setError('');
    try {
      const { data } = await createBooking({
        variables: { input: { tripId, userId, type: form.type, details: form.details } }
      });
      if (data?.createBooking) { onCreated(); onClose(); }
    } catch (err) {
      setError(err.message || 'Failed to add booking.');
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>Add booking</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Booking type</label>
            <select className="form-select" name="type" value={form.type} onChange={handleChange}>
              <option value="HOTEL">🏨 Hotel</option>
              <option value="FLIGHT">✈️ Flight</option>
              <option value="ACTIVITY">🎯 Activity</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Details</label>
            <input className="form-input" name="details"
              placeholder="e.g. Hilton Athens, Check-in 2pm"
              value={form.details} onChange={handleChange} />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-ghost btn-full" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-teal btn-full" disabled={loading}>
              {loading ? 'Adding…' : 'Add booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TripDetailPage() {
  const { tripId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_TRIP, {
    variables: { tripId },
    skip: !tripId,
  });

  const trip = data?.trip;
  const bookings = trip?.bookings || [];

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

  if (!trip) return (
    <div className="page">
      <div className="alert alert-error">Trip not found.</div>
    </div>
  );

  return (
    <div className="page">
      {/* Back button */}
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/dashboard')}
        style={{ marginBottom: '1.5rem' }}>
        ← Back to dashboard
      </button>

      {/* Hero */}
      <div className="trip-detail-hero">
        <div className="trip-detail-hero-content">
          <div className="trip-detail-destination">📍 {trip.destination}</div>
          <div className="trip-detail-name">{trip.name}</div>
          <div className="trip-detail-meta">
            {trip.startDate && <span>🗓 From: {trip.startDate}</span>}
            {trip.endDate   && <span>To: {trip.endDate}</span>}
            {trip.createdAt && (
              <span>Created: {new Date(trip.createdAt).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      </div>

      {/* Bookings section */}
      <div className="section-header">
        <h2>Bookings ({bookings.length})</h2>
        <button className="btn btn-teal btn-sm" onClick={() => setShowModal(true)}>
          + Add booking
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>No bookings yet</h3>
          <p>Add hotels, flights, or activities for this trip.</p>
          <button className="btn btn-teal" onClick={() => setShowModal(true)}>
            Add first booking
          </button>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map(b => (
            <div key={b.id} className="booking-card">
              <div className="booking-type-badge">{TYPE_ICON[b.type] || '📌'}</div>
              <div className="booking-info">
                <h4>{b.type}</h4>
                <p>{b.details || 'No details provided'}</p>
                {b.createdAt && (
                  <p style={{ fontSize: '0.78rem', marginTop: '0.2rem' }}>
                    Added {new Date(b.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              <span className="booking-status">{b.status}</span>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <AddBookingModal
          tripId={trip.id}
          userId={user?.userId}
          onClose={() => setShowModal(false)}
          onCreated={() => refetch()}
        />
      )}
    </div>
  );
}
