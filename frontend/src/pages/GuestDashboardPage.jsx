import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import {
  Compass,
  Calendar,
  IndianRupee,
  Moon,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Ban,
  X,
  Search,
  History,
  Plane,
  Luggage,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

const GuestDashboardPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tabs: 'upcoming' | 'active' | 'past' | 'cancelled' | 'all'
  const [tripTab, setTripTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Cancellation Modal State
  const [selectedBookingToCancel, setSelectedBookingToCancel] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelMessage, setCancelMessage] = useState(null);

  const fetchGuestAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get('/bookings/guest/analytics');
      if (res.data && res.data.success) {
        setAnalytics(res.data.analytics);
      }
    } catch (err) {
      console.error('Failed to load guest analytics:', err);
      setError(err.response?.data?.message || 'Could not fetch your travel stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuestAnalytics();
  }, []);

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
      setCancelMessage({ type: 'error', text: 'Please choose or write a reason for cancellation.' });
      return;
    }

    try {
      setCancelLoading(true);
      setCancelMessage(null);
      const res = await axiosClient.put(`/bookings/${selectedBookingToCancel._id}/cancel`, {
        reason: cancellationReason.trim(),
      });
      if (res.data && res.data.success) {
        setCancelMessage({ type: 'success', text: 'Reservation cancelled successfully. Refund scheduled!' });
        setTimeout(() => {
          handleCloseCancelModal();
          fetchGuestAnalytics();
        }, 1200);
      }
    } catch (err) {
      console.error('Cancel booking error:', err);
      setCancelMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to cancel reservation.',
      });
    } finally {
      setCancelLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const allBookings = analytics?.allBookings || [];

  // Filter bookings based on active tab and search query
  const filteredBookings = allBookings.filter((booking) => {
    const isCancelled = booking.orderStatus === 'cancelled';
    const now = new Date();
    const start = new Date(booking.checkInDate);
    const end = new Date(booking.checkOutDate);
    const isActive = !isCancelled && start <= now && end >= now;
    const isUpcoming = !isCancelled && start > now;
    const isPast = !isCancelled && (end < now || booking.orderStatus === 'completed');

    if (tripTab === 'upcoming' && !isUpcoming) return false;
    if (tripTab === 'active' && !isActive) return false;
    if (tripTab === 'past' && !isPast) return false;
    if (tripTab === 'cancelled' && !isCancelled) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = booking.property?.title?.toLowerCase().includes(q);
      const matchCity = booking.property?.city?.toLowerCase().includes(q);
      const matchStatus = booking.orderStatus?.toLowerCase().includes(q);
      return matchTitle || matchCity || matchStatus;
    }

    return true;
  });

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
      {/* Top Hero Banner */}
      <div style={{
        position: 'relative',
        borderRadius: '28px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 45%, #4338ca 100%)',
        color: '#ffffff',
        padding: '3rem 2.5rem',
        marginBottom: '2.5rem',
        boxShadow: '0 25px 50px -12px rgba(37, 99, 235, 0.35)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
      }}>
        <div style={{
          position: 'absolute',
          top: '-25%',
          right: '-10%',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(147, 197, 253, 0.3) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(12px)',
              fontSize: '0.84rem',
              fontWeight: 700,
              letterSpacing: '0.3px',
              marginBottom: '1rem',
            }}>
              <Compass size={16} color="#bae6fd" />
              <span>Traveler Hub & Itineraries</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.6rem' }}>
              Guest Travel Dashboard
            </h1>
            <p style={{ fontSize: '1.02rem', color: '#e0f2fe', maxWidth: '620px', lineHeight: 1.6 }}>
              Review your completed voyages, lifetime travel spend, nights stayed, and active reservation itineraries in real-time.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={fetchGuestAnalytics}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                padding: '0.75rem 1.25rem',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.15s ease',
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'; }}
            >
              <RefreshCw size={16} /> Refresh
            </button>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                backgroundColor: '#ffffff',
                color: '#1e40af',
                padding: '0.75rem 1.4rem',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.92rem',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.15s ease',
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <Luggage size={18} /> Book Next Stay
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.25rem' }}>
          <div style={{ width: '50px', height: '50px', border: '4px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: '#64748b', fontWeight: 600, fontSize: '1rem' }}>Calculating your travel stats & itineraries...</p>
        </div>
      ) : error ? (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '20px', padding: '2rem', textAlign: 'center', color: '#b91c1c' }}>
          <AlertCircle size={36} style={{ margin: '0 auto 0.75rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Unable to Load Travel Stats</h3>
          <p style={{ marginTop: '0.25rem', fontSize: '0.92rem' }}>{error}</p>
        </div>
      ) : (
        <div>
          {/* 4 KEY GUEST METRIC STAT CARDS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2.5rem',
          }}>
            {/* 1. TOTAL TRIPS TAKEN */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: '24px',
              padding: '1.75rem',
              border: '1.5px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Total Stays Booked
                </span>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: '#e0f2fe',
                  color: '#0284c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Plane size={20} />
                </div>
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                {analytics?.totalTrips || 0}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.85rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={15} color="#059669" />
                <span>Across {analytics?.citiesVisitedCount || 0} unique cities in India</span>
              </div>
            </div>

            {/* 2. TOTAL TRAVEL SPEND */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: '24px',
              padding: '1.75rem',
              border: '1.5px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Total Travel Spend
                </span>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: '#dcfce7',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <IndianRupee size={20} />
                </div>
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#059669', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                ₹{(analytics?.totalSpent || 0).toLocaleString()}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.85rem', fontSize: '0.82rem', color: '#059669', fontWeight: 600 }}>
                <ShieldCheck size={15} />
                <span>100% Secure Checkout Guarantee</span>
              </div>
            </div>

            {/* 3. TOTAL NIGHTS STAYED */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: '24px',
              padding: '1.75rem',
              border: '1.5px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Nights Under Homely Roofs
                </span>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: '#f3e8ff',
                  color: '#7c3aed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Moon size={20} />
                </div>
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                {analytics?.totalNights || 0} <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Nights</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.85rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <Sparkles size={15} color="#f59e0b" />
                <span>Verified boutique stays & villas</span>
              </div>
            </div>

            {/* 4. UPCOMING / ACTIVE STAYS */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: '24px',
              padding: '1.75rem',
              border: '1.5px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Upcoming Trips
                </span>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: '#ffedd5',
                  color: '#ea580c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Clock size={20} />
                </div>
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ea580c', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                {analytics?.upcomingTripsCount || 0}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.85rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <Calendar size={15} color="#ea580c" />
                <span>{analytics?.activeTripsCount ? `${analytics.activeTripsCount} Active Stay right now` : 'Ready for next getaway'}</span>
              </div>
            </div>
          </div>

          {/* NEXT UPCOMING STAY SHOWCASE (IF ANY) */}
          {analytics?.nextTrip && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(2, 132, 199, 0.08) 100%)',
              border: '1.5px solid #bfdbfe',
              borderRadius: '24px',
              padding: '2rem',
              marginBottom: '2.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '0.3rem 0.85rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.75rem' }}>
                  <Plane size={14} /> Next Upcoming Stay
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                  {analytics.nextTrip.property?.title}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                  <MapPin size={16} color="#2563eb" />
                  <span>{analytics.nextTrip.property?.city}, India</span>
                  <span>•</span>
                  <span>{formatDate(analytics.nextTrip.checkInDate)} → {formatDate(analytics.nextTrip.checkOutDate)} ({analytics.nextTrip.nights} nights)</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>Total Fare</div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#059669' }}>₹{analytics.nextTrip.totalPrice?.toLocaleString()}</div>
                </div>
                <Link
                  to={`/properties/${analytics.nextTrip.property?._id}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    textDecoration: 'none',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                  }}
                >
                  View Details <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          )}

          {/* RESERVATIONS & ITINERARIES SECTION */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '24px',
            padding: '2rem',
            border: '1.5px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)',
          }}>
            {/* Header + Search + Tabs */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={22} color="#2563eb" />
                  Your Trips & Reservations
                </h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Filter upcoming itineraries, completed stays, or manage your bookings.
                </p>
              </div>

              {/* Search Bar */}
              <div style={{ position: 'relative', width: '280px' }}>
                <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search stay name or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 1rem 0.65rem 2.5rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {[
                { key: 'all', label: `All Trips (${allBookings.length})` },
                { key: 'upcoming', label: `Upcoming (${analytics?.upcomingTripsCount || 0})` },
                { key: 'active', label: `Active Stays (${analytics?.activeTripsCount || 0})` },
                { key: 'past', label: `Completed (${analytics?.pastTripsCount || 0})` },
                { key: 'cancelled', label: `Cancelled (${analytics?.cancelledTripsCount || 0})` },
              ].map((tab) => {
                const isSelected = tripTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setTripTab(tab.key)}
                    style={{
                      padding: '0.55rem 1.15rem',
                      borderRadius: '9999px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      border: isSelected ? '1.5px solid #2563eb' : '1px solid var(--border-color)',
                      backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.12)' : 'var(--bg-subtle)',
                      color: isSelected ? '#2563eb' : 'var(--text-muted)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Bookings List */}
            {filteredBookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                  <Luggage size={28} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                  No reservations found
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
                  {searchQuery ? 'No trips match your search query. Try typing another city or stay.' : 'You do not have any trips in this category.'}
                </p>
                <Link
                  to="/"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                  }}
                >
                  Explore Stays <ExternalLink size={15} />
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {filteredBookings.map((booking) => {
                  const isCancelled = booking.orderStatus === 'cancelled';
                  const property = booking.property || {};
                  const now = new Date();
                  const start = new Date(booking.checkInDate);
                  const end = new Date(booking.checkOutDate);
                  const isActive = !isCancelled && start <= now && end >= now;

                  return (
                    <div
                      key={booking._id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(200px, 240px) 1fr auto',
                        gap: '1.5rem',
                        backgroundColor: 'var(--bg-subtle)',
                        borderRadius: '20px',
                        border: isActive ? '2px solid #2563eb' : '1px solid var(--border-color)',
                        overflow: 'hidden',
                        padding: '1.25rem',
                        alignItems: 'center',
                        position: 'relative',
                        opacity: isCancelled ? 0.75 : 1,
                        boxShadow: isActive ? '0 8px 24px -4px rgba(37, 99, 235, 0.15)' : 'none',
                      }}
                    >
                      {/* Stay Thumbnail */}
                      <div style={{ position: 'relative', width: '100%', height: '140px', borderRadius: '14px', overflow: 'hidden' }}>
                        <img
                          src={property.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600'}
                          alt={property.title || 'Stay'}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80';
                          }}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          left: '8px',
                          backgroundColor: isCancelled ? '#ef4444' : isActive ? '#2563eb' : '#059669',
                          color: '#ffffff',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          padding: '0.25rem 0.65rem',
                          borderRadius: '9999px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}>
                          {isCancelled ? 'Cancelled' : isActive ? 'Active Now' : booking.orderStatus === 'completed' ? 'Completed' : 'Confirmed'}
                        </div>
                      </div>

                      {/* Booking Summary */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                          <span style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                            {property.propertyType || 'Boutique Stay'}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem', lineHeight: 1.3 }}>
                          {property.title || 'Reserved Stay'}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                          <MapPin size={15} color="#2563eb" />
                          <span>{property.address || property.city || 'Stay Location'}, India</span>
                        </div>

                        {/* Travel Timing Box */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Calendar size={15} color="var(--text-muted)" />
                            <span>{formatDate(booking.checkInDate)} → {formatDate(booking.checkOutDate)}</span>
                          </div>
                          <span style={{ color: 'var(--text-muted)' }}>•</span>
                          <div>{booking.nights} night{booking.nights > 1 ? 's' : ''}</div>
                          <span style={{ color: 'var(--text-muted)' }}>•</span>
                          <div>{booking.guests} guest{booking.guests > 1 ? 's' : ''}</div>
                        </div>

                        {isCancelled && booking.cancellationReason && (
                          <div style={{ marginTop: '0.65rem', fontSize: '0.82rem', color: '#ef4444', backgroundColor: '#fef2f2', padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid #fecaca', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                            <AlertCircle size={14} />
                            <span>Cancelled ({booking.cancelledBy || 'system'}): "{booking.cancellationReason}"</span>
                          </div>
                        )}
                      </div>

                      {/* Right Side Pricing & Actions */}
                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%', gap: '1rem' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Total Amount</div>
                          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669', letterSpacing: '-0.02em' }}>
                            ₹{booking.totalPrice?.toLocaleString()}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <Link
                            to={`/properties/${property._id}`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              padding: '0.55rem 0.95rem',
                              borderRadius: '10px',
                              backgroundColor: 'var(--bg-card)',
                              border: '1px solid var(--border-color)',
                              color: 'var(--text-main)',
                              fontWeight: 700,
                              fontSize: '0.82rem',
                              textDecoration: 'none',
                            }}
                          >
                            Stay Page <ExternalLink size={14} />
                          </Link>

                          {!isCancelled && (
                            <button
                              onClick={() => handleOpenCancelModal(booking)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                padding: '0.55rem 0.95rem',
                                borderRadius: '10px',
                                backgroundColor: '#fef2f2',
                                border: '1px solid #fecaca',
                                color: '#ef4444',
                                fontWeight: 700,
                                fontSize: '0.82rem',
                                cursor: 'pointer',
                              }}
                            >
                              <Ban size={14} /> Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CANCELLATION MODAL */}
      {selectedBookingToCancel && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1200,
          padding: '1.5rem',
        }}>
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '24px',
            border: '1px solid var(--border-color)',
            maxWidth: '520px',
            width: '100%',
            padding: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444' }}>
                <Ban size={22} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Cancel Reservation
                </h3>
              </div>
              <button
                onClick={handleCloseCancelModal}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.3rem' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Are you sure you want to cancel your stay at <strong>"{selectedBookingToCancel.property?.title}"</strong>? Your reserved dates will be released and your host will be notified immediately.
            </p>

            {cancelMessage && (
              <div style={{
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                marginBottom: '1.25rem',
                backgroundColor: cancelMessage.type === 'error' ? '#fef2f2' : '#f0fdf4',
                color: cancelMessage.type === 'error' ? '#b91c1c' : '#15803d',
                border: `1px solid ${cancelMessage.type === 'error' ? '#fecaca' : '#bbf7d0'}`,
                fontSize: '0.88rem',
                fontWeight: 600,
              }}>
                {cancelMessage.text}
              </div>
            )}

            <form onSubmit={handleConfirmCancel}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  Reason for Cancellation *
                </label>
                <textarea
                  rows={3}
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="e.g., Change of travel plans, emergency, or booked alternative dates..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    resize: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleCloseCancelModal}
                  style={{
                    padding: '0.75rem 1.4rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-subtle)',
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
                  disabled={cancelLoading}
                  style={{
                    padding: '0.75rem 1.4rem',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: cancelLoading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                  }}
                >
                  {cancelLoading ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestDashboardPage;
