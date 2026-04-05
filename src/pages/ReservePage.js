import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TRIP_SERVICE_URL = 'http://localhost:8082';

export default function ReservePage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const inventory = state?.inventory;
  const searchParams = state?.searchParams;

  if (!inventory) {
    return (
      <div className="page">
        <div className="alert alert-error">No inventory selected. Please go back and search.</div>
        <button className="btn btn-ghost btn-sm" style={{ marginTop: '1rem' }} onClick={() => navigate('/search')}>
          Back to search
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: '1.5rem' }} onClick={() => navigate('/search')}>
        Back to search
      </button>

      <div className="dashboard-header">
        <h1>Reserve your <span>stay</span>.</h1>
        <p>Review the details below and confirm your reservation.</p>
      </div>

      <div className="reserve-layout">
        <div className="reserve-hotel-card">
          <div className="reserve-hotel-photo">
            <img src={inventory.photoUrl} alt={inventory.hotelName} />
          </div>
          <div className="reserve-hotel-info">
            <div className="inventory-card-hotel-id">Hotel ID: {inventory.hotelId}</div>
            <h2 className="reserve-hotel-name">{inventory.hotelName}</h2>
            <div className="reserve-hotel-price">
              ₹{inventory.price.toFixed(2)} <span>/ night</span>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '1.5rem' }}>
            Booking Summary
          </h3>
          <div className="profile-field">
            <span className="profile-field-label">Hotel</span>
            <span className="profile-field-value">{inventory.hotelName}</span>
          </div>
          <div className="profile-field">
            <span className="profile-field-label">Hotel ID</span>
            <span className="profile-field-value">{inventory.hotelId}</span>
          </div>
          {searchParams?.destination && (
            <div className="profile-field">
              <span className="profile-field-label">Destination</span>
              <span className="profile-field-value">{searchParams.destination}</span>
            </div>
          )}
          {searchParams?.startDate && (
            <div className="profile-field">
              <span className="profile-field-label">Check-in</span>
              <span className="profile-field-value">{searchParams.startDate}</span>
            </div>
          )}
          {searchParams?.endDate && (
            <div className="profile-field">
              <span className="profile-field-label">Check-out</span>
              <span className="profile-field-value">{searchParams.endDate}</span>
            </div>
          )}
          <div className="profile-field">
            <span className="profile-field-label">Price per night</span>
            <span className="profile-field-value">₹{inventory.price.toFixed(2)}</span>
          </div>

          {error && <div className="alert alert-error" style={{ marginTop: '1rem' }}>{error}</div>}

          <button
            className="btn btn-primary btn-full"
            style={{ marginTop: '1.5rem' }}
            disabled={loading}
            onClick={async () => {
              setError('');
              setLoading(true);
              try {
                const res = await fetch(`${TRIP_SERVICE_URL}/api/trips/createTrip`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    hotelName: inventory.hotelName,
                    hotelId: inventory.hotelId,
                    userId: user?.userId,
                    startDate: searchParams?.startDate || '',
                    endDate: searchParams?.endDate || '',
                  }),
                });
                if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
                const trip = await res.json();
                navigate(`/checkout/${trip.tripId}`, { state: { inventory, searchParams } });
              } catch (err) {
                setError(err.message || 'Failed to create trip.');
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? 'Processing...' : 'Confirm Reservation'}
          </button>
        </div>
      </div>
    </div>
  );
}
