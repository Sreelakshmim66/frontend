import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_MY_TRIPS, CREATE_TRIP } from '../graphql/queries';
import { useAuth } from '../context/AuthContext';

const BOOKING_TYPE_ICON = { HOTEL: '🏨', FLIGHT: '✈️', ACTIVITY: '🎯' };

function CreateTripModal({ userId, onClose, onCreated }) {
  const [form, setForm] = useState({ name: '', destination: '', startDate: '', endDate: '' });
  const [error, setError] = useState('');
  const [createTrip, { loading }] = useMutation(CREATE_TRIP);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault(); setError('');
    try {
      const { data } = await createTrip({ variables: { input: { ...form, userId } } });
      if (data?.createTrip) { onCreated(data.createTrip); onClose(); }
    } catch (err) {
      setError(err.message || 'Failed to create trip.');
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>New trip</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Trip name</label>
            <input className="form-input" name="name" placeholder="Summer in Santorini"
              value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Destination</label>
            <input className="form-input" name="destination" placeholder="Santorini, Greece"
              value={form.destination} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start date</label>
              <input className="form-input" type="date" name="startDate"
                value={form.startDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">End date</label>
              <input className="form-input" type="date" name="endDate"
                value={form.endDate} onChange={handleChange} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-ghost btn-full" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Creating…' : 'Create trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const userId = user?.userId;
  const [showModal, setShowModal] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_MY_TRIPS, {
    variables: { userId },
    skip: !userId,
  });

  const trips = data?.myTrips || [];

  const accentColors = ['', 'teal'];

  return (
    <div className="page">
      <div className="dashboard-header">
        <h1>Your <span>adventures</span> await.</h1>
        <p>Manage your trips, bookings, and travel plans below.</p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-card-number">{trips.length}</div>
          <div className="stat-card-label">Total Trips</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-number" style={{ color: 'var(--teal)' }}>
            {trips.filter(t => t.startDate && new Date(t.startDate) > new Date()).length}
          </div>
          <div className="stat-card-label">Upcoming</div>
        </div>
      </div>

      {/* Trips section */}
      <div className="section-header">
        <h2>My Trips</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
          + New trip
        </button>
      </div>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <div className="spinner" />
        </div>
      )}

      {error && <div className="alert alert-error">{error.message}</div>}

      {!loading && !error && trips.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🗺️</div>
          <h3>No trips yet</h3>
          <p>Create your first trip to start planning your next adventure.</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Plan a trip
          </button>
        </div>
      )}

      {!loading && trips.length > 0 && (
        <div className="trips-grid">
          {trips.map((trip, i) => (
            <Link key={trip.id} to={`/trips/${trip.id}`} className="trip-card">
              <div className={`trip-card-accent ${accentColors[i % 2]}`} />
              <div className="trip-card-body">
                <div className="trip-card-destination">📍 {trip.destination}</div>
                <div className="trip-card-name">{trip.name}</div>
                {(trip.startDate || trip.endDate) && (
                  <div className="trip-card-dates">
                    🗓 {trip.startDate || '?'} → {trip.endDate || '?'}
                  </div>
                )}
              </div>
              <div className="trip-card-footer">
                <span>View details →</span>
                <span>{trip.createdAt ? new Date(trip.createdAt).toLocaleDateString() : ''}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {showModal && (
        <CreateTripModal
          userId={userId}
          onClose={() => setShowModal(false)}
          onCreated={() => refetch()}
        />
      )}
    </div>
  );
}
