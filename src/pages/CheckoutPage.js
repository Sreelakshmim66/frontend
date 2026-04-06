import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import { GET_ME, GET_TRIP, CREATE_BOOKING } from '../graphql/queries';
import { useAuth } from '../context/AuthContext';

const PAYMENT_OPTIONS = [
  { id: 'upi', label: 'UPI' },
  { id: 'card', label: 'Credit / Debit Card' },
  { id: 'netbanking', label: 'Net Banking' },
];

export default function CheckoutPage() {
  const { tripId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });
  const [paymentErrors, setPaymentErrors] = useState({});
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const inventory = state?.inventory;
  const searchParams = state?.searchParams;

  const [fetchTrip, { data: tripQueryData, loading: tripLoading, error: tripQueryError }] = useLazyQuery(GET_TRIP);

  useEffect(() => {
    if (inventory && searchParams) return;
    fetchTrip({ variables: { tripId } });
  }, [tripId, inventory, searchParams]);

  const tripData = tripQueryData?.trip;

  const { data: profileData, loading: profileLoading, error: profileError } = useQuery(GET_ME, {
    variables: { userId: user?.userId },
    skip: !user?.userId,
  });

  const [fetchProfileFallback, { data: profileFallbackData, loading: profileFallbackLoading }] = useLazyQuery(GET_ME);

  useEffect(() => {
    if (profileLoading || profileFallbackLoading) return;
    if (!profileData?.me && user?.userId) {
      fetchProfileFallback({ variables: { userId: user.userId } });
    }
  }, [profileLoading, profileData, user?.userId]);

  const profile = profileData?.me || profileFallbackData?.me;

  const [createBooking] = useMutation(CREATE_BOOKING);

  if (tripLoading || profileLoading || profileFallbackLoading) {
    return (
      <div className="page" style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (tripQueryError) {
    return (
      <div className="page">
        <div className="alert alert-error">{tripQueryError.message}</div>
        <button className="btn btn-ghost btn-sm" style={{ marginTop: '1rem' }} onClick={() => navigate('/search')}>
          Back to search
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: '1.5rem' }} onClick={() => navigate(-1)}>
        Back
      </button>

      <div className="dashboard-header">
        <h1>Complete your <span>booking</span>.</h1>
        <p>Review your trip details and choose a payment method.</p>
      </div>

      <div className="reserve-layout">

        {/* Trip Details */}
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '1.5rem' }}>
            Trip Details
          </h3>
          {inventory && (
            <div className="reserve-hotel-photo" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1.25rem' }}>
              <img src={inventory.photoUrl} alt={inventory.hotelName} style={{ width: '100%', objectFit: 'cover', maxHeight: 180 }} />
            </div>
          )}
          <div className="profile-field">
            <span className="profile-field-label">Trip ID</span>
            <span className="profile-field-value" style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--muted)' }}>{tripId}</span>
          </div>
          <div className="profile-field">
            <span className="profile-field-label">Hotel</span>
            <span className="profile-field-value">{inventory?.hotelName || tripData?.name}</span>
          </div>
          <div className="profile-field">
            <span className="profile-field-label">Check-in</span>
            <span className="profile-field-value">{searchParams?.startDate || tripData?.startDate}</span>
          </div>
          <div className="profile-field">
            <span className="profile-field-label">Check-out</span>
            <span className="profile-field-value">{searchParams?.endDate || tripData?.endDate}</span>
          </div>
          {inventory && (
            <div className="profile-field">
              <span className="profile-field-label">Price per night</span>
              <span className="profile-field-value">₹{inventory.price.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* User Details */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '1.5rem' }}>
              Traveller Details
            </h3>
            <div className="profile-field">
              <span className="profile-field-label">Name</span>
              <span className="profile-field-value">{profile?.firstName} {profile?.lastName}</span>
            </div>
            <div className="profile-field">
              <span className="profile-field-label">Email</span>
              <span className="profile-field-value">{profile?.email}</span>
            </div>
            <div className="profile-field">
              <span className="profile-field-label">Mobile</span>
              <span className="profile-field-value">{profile?.mobileNumber || '—'}</span>
            </div>
          </div>

          {/* Payment Options */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '1.5rem' }}>
              Payment Method
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {PAYMENT_OPTIONS.map(opt => (
                <label
                  key={opt.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${paymentMethod === opt.id ? 'var(--accent)' : 'var(--border)'}`,
                    cursor: 'pointer',
                    fontWeight: paymentMethod === opt.id ? 600 : 400,
                    transition: 'border-color 0.15s',
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={opt.id}
                    checked={paymentMethod === opt.id}
                    onChange={() => setPaymentMethod(opt.id)}
                    style={{ accentColor: 'var(--accent)' }}
                  />
                  {opt.label}
                </label>
              ))}
            </div>

            {paymentMethod === 'upi' && (
              <div style={{ marginTop: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--muted)' }}>
                  UPI ID
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  style={{ width: '100%', padding: '0.85rem 1rem', fontSize: '1rem', boxSizing: 'border-box' }}
                />
                {paymentErrors.upiId && <span style={{ color: 'var(--error, #e53e3e)', fontSize: '0.8rem', marginTop: '0.3rem', display: 'block' }}>{paymentErrors.upiId}</span>}
              </div>
            )}

            {paymentMethod === 'card' && (
              <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--muted)' }}>
                    Card Number
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    value={cardDetails.number}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 16);
                      const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                      setCardDetails(prev => ({ ...prev, number: formatted }));
                    }}
                    style={{ width: '100%', padding: '0.85rem 1rem', fontSize: '1rem', boxSizing: 'border-box' }}
                  />
                  {paymentErrors.number && <span style={{ color: 'var(--error, #e53e3e)', fontSize: '0.8rem', marginTop: '0.3rem', display: 'block' }}>{paymentErrors.number}</span>}
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--muted)' }}>
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={cardDetails.expiry}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                        const formatted = val.length > 2 ? `${val.slice(0, 2)}/${val.slice(2)}` : val;
                        setCardDetails(prev => ({ ...prev, expiry: formatted }));
                      }}
                      style={{ width: '100%', padding: '0.85rem 1rem', fontSize: '1rem', boxSizing: 'border-box' }}
                    />
                    {paymentErrors.expiry && <span style={{ color: 'var(--error, #e53e3e)', fontSize: '0.8rem', marginTop: '0.3rem', display: 'block' }}>{paymentErrors.expiry}</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--muted)' }}>
                      CVV
                    </label>
                    <input
                      type="password"
                      className="input"
                      placeholder="•••"
                      maxLength={3}
                      value={cardDetails.cvv}
                      onChange={e => setCardDetails(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) }))}
                      style={{ width: '100%', padding: '0.85rem 1rem', fontSize: '1rem', boxSizing: 'border-box' }}
                    />
                    {paymentErrors.cvv && <span style={{ color: 'var(--error, #e53e3e)', fontSize: '0.8rem', marginTop: '0.3rem', display: 'block' }}>{paymentErrors.cvv}</span>}
                  </div>
                </div>
              </div>
            )}

            <button
              className="btn btn-primary btn-full"
              style={{ marginTop: '1.5rem' }}
              onClick={async () => {
                const errors = {};
                if (paymentMethod === 'upi') {
                  if (!upiId.trim()) errors.upiId = 'UPI ID is required.';
                  else if (!/^[\w.\-]+@[\w]+$/.test(upiId.trim())) errors.upiId = 'Enter a valid UPI ID (e.g. yourname@upi).';
                } else if (paymentMethod === 'card') {
                  if (!cardDetails.number.trim()) errors.number = 'Card number is required.';
                  else if (cardDetails.number.replace(/\s/g, '').length !== 16) errors.number = 'Enter a valid 16-digit card number.';
                  if (!cardDetails.expiry.trim()) errors.expiry = 'Expiry date is required.';
                  else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiry)) errors.expiry = 'Enter a valid expiry date (MM/YY).';
                  if (!cardDetails.cvv.trim()) errors.cvv = 'CVV is required.';
                  else if (cardDetails.cvv.length !== 3) errors.cvv = 'CVV must be 3 digits.';
                }
                setPaymentErrors(errors);
                if (Object.keys(errors).length > 0) return;

                setBookingError('');
                setBookingLoading(true);
                try {
                  const { data } = await createBooking({
                    variables: {
                      input: {
                        tripId,
                        userId: user?.userId,
                      },
                    },
                  });
                  navigate('/confirmation', { state: { booking: data.createBooking, profile } });
                } catch (err) {
                  setBookingError(err.message || 'Failed to complete booking.');
                } finally {
                  setBookingLoading(false);
                }
              }}
              disabled={bookingLoading}
            >
              {bookingLoading ? 'Processing...' : 'Complete Booking'}
            </button>
            {bookingError && (
              <div className="alert alert-error" style={{ marginTop: '1rem' }}>{bookingError}</div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
