import React, { useState } from 'react';

export default function SearchPage() {
  const [form, setForm] = useState({ destination: '', startDate: '', endDate: '' });

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSearch = e => {
    e.preventDefault();
    console.log('Search:', form);
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
          <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '0.5rem' }}>
            Search
          </button>
        </form>
      </div>
    </div>
  );
}
