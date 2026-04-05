import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TRIP_SERVICE_URL = 'http://localhost:8081';

export default function SearchPage() {
  const [form, setForm] = useState({ destination: '', startDate: '', endDate: '' });
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSearch = async e => {
    e.preventDefault();
    setSearched(true);
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${TRIP_SERVICE_URL}/api/trips/searchTrips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: form.destination,
          ...(form.startDate && { startDate: form.startDate }),
          ...(form.endDate && { endDate: form.endDate }),
        }),
      });
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
      const data = await res.json();
      setInventories(data.inventories || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch inventories.');
    } finally {
      setLoading(false);
    }
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

      {searched && (
        <div style={{ marginTop: '2.5rem' }}>
          <div className="section-header">
            <h2>Available Inventories</h2>
            {!loading && (
              <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                {inventories.length} result{inventories.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {loading && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <div className="spinner" />
            </div>
          )}

          {error && <div className="alert alert-error">{error}</div>}

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
                    <div className="inventory-card-hotel-id">ID: {inv.hotelId}</div>
                    <div className="inventory-card-name">{inv.hotelName}</div>
                    <div className="inventory-card-price">
                      ${inv.price.toFixed(2)} <span>/ night</span>
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
