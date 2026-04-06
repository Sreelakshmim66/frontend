import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { SEARCH_TRIPS } from '../graphql/queries';

function toDateString(date) {
  return date.toISOString().split('T')[0];
}

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const dayAfter = new Date();
dayAfter.setDate(dayAfter.getDate() + 2);

export default function SearchPage() {
  const [form, setForm] = useState({ destination: '', startDate: toDateString(tomorrow), endDate: toDateString(dayAfter) });
  const [searched, setSearched] = useState(false);
  const [validationError, setError] = useState('');
  const navigate = useNavigate();
  const [searchTrips, { data, loading, error }] = useLazyQuery(SEARCH_TRIPS);
  const inventories = data?.searchTrips?.inventories || [];

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSearch = e => {
    e.preventDefault();
    setError('');

    if (!form.startDate || !form.endDate) {
      setError('Please select both start and end dates.');
      return;
    }
    if (new Date(form.endDate) <= new Date(form.startDate)) {
      setError('End date must be after start date.');
      return;
    }

    setSearched(true);
    searchTrips({
      variables: {
        input: {
          destination: form.destination,
          startDate: form.startDate || null,
          endDate: form.endDate || null,
        },
      },
    });
  };

  return (
    <div className="page">
      <div className="dashboard-header">
        <h1>Find your next <span>destination</span>.</h1>
        <p>Search for trips by destination and travel dates.</p>
      </div>

      <div className="card" style={{ maxWidth: 600, margin: '0 auto', padding: '2rem' }}>
        <form className="form" onSubmit={handleSearch}>
          <div className="form-group">
            <label className="form-label">Destination</label>
            <input
              className="form-input"
              name="destination"
              placeholder="e.g. Paris, France"
              value={form.destination}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start date</label>
              <input
                className="form-input"
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">End date</label>
              <input
                className="form-input"
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {validationError && <div className="alert alert-error" style={{ maxWidth: 600, margin: '1rem auto 0' }}>{validationError}</div>}

      {searched && (
        <div style={{ marginTop: '2.5rem' }}>
          {!loading && (
            <div className="section-header">
              <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                {inventories.length} result{inventories.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}

          {loading && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <div className="spinner" />
            </div>
          )}

          {error && <div className="alert alert-error">{error.message}</div>}


          {!loading && !error && inventories.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3>No inventories found</h3>
              <p>Try a different destination or adjust the dates.</p>
            </div>
          )}

          {!loading && inventories.length > 0 && (
            <div className="inventory-grid">
              {inventories.map(inv => (
                <div key={inv.hotelId} className="inventory-card">
                  <div className="inventory-card-photo">
                    <img src={inv.photoUrl} alt={inv.hotelName} />
                  </div>
                  <div className="inventory-card-body">
<div className="inventory-card-name">{inv.hotelName}</div>
                    <div className="inventory-card-price">
                      ₹{inv.price.toFixed(2)} <span>/ night</span>
                    </div>
                  </div>
                  <div className="inventory-card-footer">
                    <button
                      className="btn btn-primary btn-full"
                      onClick={() => navigate('/reserve', { state: { inventory: inv, searchParams: form } })}
                    >
                      Reserve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
