import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBookings, cancelBooking } from '../features/bookings/bookingSlice';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Clock,
  CreditCard,
  AlertCircle,
  XCircle,
  CheckCircle2,
  ExternalLink,
  Ban,
  X,
  RefreshCw,
} from 'lucide-react';

const MyBookingsPage = () => {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((state) => state.bookings);

  // Cancellation Modal State
  const [selectedBookingToCancel, setSelectedBookingToCancel] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelMessage, setCancelMessage] = useState(null);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const handleOpenCancelModal = (booking) => {
    setSelectedBookingToCancel(booking);
    setCancellationReason('');
    setCancelMessage(null);
  };

  const handleCloseCancelModal = () => {
    setSelectedBookingToCancel(null);
    setCancellationReason('');
    setCancelMessage(null);
  };

  const handleConfirmCancel = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!selectedBookingToCancel) return;
    if (!cancellationReason.trim()) {
      setCancelMessage({ type: 'error', text: 'Please enter or select a cancellation reason.' });
      return;
    }

    setCancelLoading(true);
    setCancelMessage(null);
    try {
      await dispatch(cancelBooking({
        id: selectedBookingToCancel._id,
        reason: cancellationReason.trim(),
      })).unwrap();

      setCancelMessage({ type: 'success', text: 'Reservation cancelled successfully. Refund scheduled!' });
      setTimeout(() => {
        handleCloseCancelModal();
        dispatch(fetchMyBookings());
      }, 1000);
    } catch (err) {
      console.error(err);
      setCancelMessage({
        type: 'error',
        text: typeof err === 'string' ? err : 'Failed to cancel reservation. Please try again.',
      });
    } finally {
      setCancelLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
      {/* Hero Header */}
      <div style={{
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #4f46e5 100%)',
        color: '#ffffff',
        padding: '2.5rem 2.25rem',
        marginBottom: '2.5rem',
        boxShadow: '0 20px 40px -10px rgba(2, 132, 199, 0.3)',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.35rem 0.9rem',
          borderRadius: '9999px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(8px)',
          fontSize: '0.82rem',
          fontWeight: 700,
          marginBottom: '1rem',
        }}>
          <Calendar size={15} />
          <span>Guest Reservations</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          My Booked Trips & Itineraries
        </h1>
        <p style={{ color: '#e0f2fe', fontSize: '1rem', maxWidth: '600px', lineHeight: 1.6 }}>
          Review confirmed dates, check-in instructions, and payment receipts with zero-double booking guarantee.
        </p>
      </div>

      {loading ? (
        <div style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #e2e8f0', borderTopColor: '#0284c7', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: '#64748b', fontWeight: 600 }}>Loading your reservations...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '24px',
          padding: '4rem 2rem',
          textAlign: 'center',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)',
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            border: '1px solid var(--border-color)',
          }}>
            <Calendar size={32} />
          </div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            No trips booked yet
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.75rem', maxWidth: '420px', margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
            When you reserve a stay, it will appear here with instant date locking and payment verification.
          </p>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: '#ffffff',
              padding: '0.85rem 1.75rem',
              borderRadius: '14px',
              fontWeight: 800,
              fontSize: '0.95rem',
              textDecoration: 'none',
              boxShadow: '0 8px 20px -4px rgba(5, 150, 105, 0.4)',
              transition: 'all 0.2s ease',
            }}
          >
            Explore Stays <ExternalLink size={16} />
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {bookings.map((booking) => {
            const isCancelled = booking.orderStatus === 'cancelled';
            const property = booking.property || {};

            return (
              <div
                key={booking._id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '24px',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden',
                  display: 'grid',
                  gridTemplateColumns: 'minmax(240px, 280px) 1fr',
                  boxShadow: 'var(--shadow-md)',
                  opacity: isCancelled ? 0.75 : 1,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                className="card-hover-effect"
              >
                {/* Stay Thumbnail */}
                <div style={{ position: 'relative', height: '100%', minHeight: '230px', overflow: 'hidden' }}>
                  <img
                    src={property.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600'}
                    alt={property.title || 'Stay'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    backgroundColor: isCancelled ? '#ef4444' : '#059669',
                    color: '#ffffff',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    padding: '0.35rem 0.85rem',
                    borderRadius: '9999px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.6px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                  }}>
                    {isCancelled ? 'Cancelled' : 'Confirmed'}
                  </div>
                </div>

                {/* Details Body */}
                <div style={{ padding: '1.85rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: 1.3 }}>
                        {property.title || 'Reserved Stay'}
                      </h3>
                      <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#059669', letterSpacing: '-0.02em', flexShrink: 0 }}>
                        ₹{booking.totalPrice?.toLocaleString()}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
                      <MapPin size={16} color="#059669" />
                      <span>{property.address || property.city || 'Stay Location'}</span>
                    </div>

                    {/* Booking Meta Grid */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: '0.85rem',
                      backgroundColor: 'var(--bg-subtle)',
                      padding: '1.1rem 1.25rem',
                      borderRadius: '16px',
                      marginBottom: '1.25rem',
                      border: '1px solid var(--border-color)',
                    }}>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.5px' }}>CHECK-IN</div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>{formatDate(booking.checkInDate)}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.5px' }}>CHECK-OUT</div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>{formatDate(booking.checkOutDate)}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.5px' }}>DURATION</div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>{booking.nights} nights • {booking.guests} guests</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.5px' }}>PAYMENT REF</div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#059669', marginTop: '2px' }}>{booking.paymentInfo?.id || 'PAID'}</div>
                      </div>
                    </div>
                    {/* If Cancelled, show reason pill */}
                    {isCancelled && booking.cancellationReason && (
                      <div style={{
                        marginTop: '0.85rem',
                        padding: '0.65rem 0.95rem',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        fontSize: '0.82rem',
                        color: '#ef4444',
                        fontWeight: 600,
                      }}>
                        <strong>Cancellation Reason:</strong> "{booking.cancellationReason}"
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                    <Link
                      to={`/properties/${property._id}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.88rem',
                        color: '#059669',
                        fontWeight: 800,
                        textDecoration: 'none',
                        transition: 'color 0.15s ease',
                      }}
                    >
                      View Stay Details <ExternalLink size={15} />
                    </Link>

                    {!isCancelled && (
                      <button
                        onClick={() => handleOpenCancelModal(booking)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          backgroundColor: 'rgba(239, 68, 68, 0.12)',
                          color: '#ef4444',
                          border: '1px solid rgba(239, 68, 68, 0.25)',
                          padding: '0.55rem 1rem',
                          borderRadius: '10px',
                          fontSize: '0.84rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.12)'; }}
                      >
                        <XCircle size={15} /> Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* GUEST CANCEL BOOKING MODAL WITH REASON BOX */}
      {selectedBookingToCancel && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '1rem',
          }}
          onClick={handleCloseCancelModal}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '24px',
              maxWidth: '500px',
              width: '100%',
              padding: '2rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
              animation: 'modalSlideUp 0.25s ease-out forwards',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Ban size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    Cancel Your Reservation
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Free cancellation - dates will be unlocked
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseCancelModal}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '0.35rem',
                  borderRadius: '8px',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Cancellation Feedback Message */}
            {cancelMessage && (
              <div style={{
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                fontSize: '0.84rem',
                fontWeight: 600,
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: cancelMessage.type === 'error' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(5, 150, 105, 0.12)',
                color: cancelMessage.type === 'error' ? '#ef4444' : '#059669',
                border: `1px solid ${cancelMessage.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(5, 150, 105, 0.3)'}`,
              }}>
                <AlertTriangle size={16} />
                <span>{cancelMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleConfirmCancel}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  marginBottom: '0.45rem',
                }}>
                  Reason for Cancellation <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  rows={3}
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="e.g. Change of travel plans / Medical emergency / Found alternative lodging..."
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '14px',
                    border: '1.5px solid var(--border-color)',
                    backgroundColor: 'var(--bg-main)',
                    color: 'var(--text-main)',
                    fontSize: '0.88rem',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                  required
                />
              </div>

              {/* Quick options */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                {[
                  'Change of travel itinerary',
                  'Emergency / personal reasons',
                  'Booked by mistake',
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setCancellationReason(preset)}
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '0.3rem 0.65rem',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    + {preset}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={handleCloseCancelModal}
                  disabled={cancelLoading}
                  style={{
                    padding: '0.7rem 1.25rem',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                  }}
                >
                  Keep Reservation
                </button>
                <button
                  type="submit"
                  onClick={handleConfirmCancel}
                  disabled={cancelLoading || !cancellationReason.trim()}
                  style={{
                    padding: '0.7rem 1.4rem',
                    borderRadius: '12px',
                    backgroundColor: '#ef4444',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: cancelLoading || !cancellationReason.trim() ? 'not-allowed' : 'pointer',
                    opacity: cancelLoading || !cancellationReason.trim() ? 0.6 : 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                  }}
                >
                  {cancelLoading ? (
                    <>
                      <RefreshCw size={15} style={{ animation: 'spin 0.8s linear infinite' }} />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <Ban size={15} />
                      Confirm Cancellation
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;

