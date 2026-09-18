import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import {
  TrendingUp,
  BedDouble,
  IndianRupee,
  Users,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  PlusCircle,
  Home,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Ban,
  X,
  Send,
  History,
  CheckCircle,
  Search,
  RotateCcw,
  Filter,
} from 'lucide-react';

const HostDashboardPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Bookings Tab & Filter State
  const [bookingTab, setBookingTab] = useState('incoming'); // 'incoming' | 'past' | 'cancelled' | 'all'
  const [bookingSearch, setBookingSearch] = useState('');

  // Cancellation Modal State
  const [selectedBookingToCancel, setSelectedBookingToCancel] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelMessage, setCancelMessage] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get('/bookings/host/analytics');
      if (res.data && res.data.success) {
        setAnalytics(res.data.analytics);
      }
    } catch (err) {
      console.error('Failed to load host analytics:', err);
      setError(err.response?.data?.message || 'Could not fetch host analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
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

  const handleConfirmCancelBooking = async (e) => {
    e.preventDefault();
    if (!selectedBookingToCancel) return;
    if (!cancellationReason.trim()) {
      setCancelMessage({ type: 'error', text: 'Please enter an appropriate cancellation reason for the guest.' });
      return;
    }

    try {
      setCancelLoading(true);
      setCancelMessage(null);
      const res = await axiosClient.put(`/bookings/${selectedBookingToCancel._id}/cancel`, {
        reason: cancellationReason.trim(),
      });

      if (res.data && res.data.success) {
        setCancelMessage({ type: 'success', text: 'Booking successfully cancelled and dates unlocked!' });
        setTimeout(() => {
          handleCloseCancelModal();
          fetchAnalytics();
        }, 1200);
      }
    } catch (err) {
      console.error('Cancellation error:', err);
      setCancelMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to cancel booking. Please try again.',
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

  const [resetLoading, setResetLoading] = useState(false);

  const handleResetBookingsStats = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to reset all bookings?\n\nThis will:\n• Clear all bookings & set stats (Occupancy, Revenue, Tenants) to 0\n• Unlock all booked dates across all stays\n• Keep all properties intact\n\nYou can book fresh stays right after!'
    );
    if (!confirmed) return;

    try {
      setResetLoading(true);
      const res = await axiosClient.post('/bookings/host/reset-bookings');
      if (res.data && res.data.success) {
        alert('All bookings have been successfully reset! Stats are now 0 and all dates are unlocked.');
        await fetchAnalytics();
      }
    } catch (err) {
      console.error('Failed to reset bookings:', err);
      alert(err.response?.data?.message || 'Failed to reset bookings.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
      {/* Top Hero Banner */}
      <div style={{
        position: 'relative',
        borderRadius: '28px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #064e3b 0%, #047857 40%, #059669 70%, #10b981 100%)',
        color: '#ffffff',
        padding: '3rem 2.5rem',
        marginBottom: '2.5rem',
        boxShadow: '0 25px 50px -12px rgba(5, 150, 105, 0.35)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <div style={{
          position: 'absolute',
          top: '-30%',
          right: '-10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)',
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
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(12px)',
              fontSize: '0.84rem',
              fontWeight: 700,
              letterSpacing: '0.3px',
              marginBottom: '1rem',
            }}>
              <TrendingUp size={16} color="#a7f3d0" />
              <span>Real-Time Host Revenue & Operations</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.6rem' }}>
              Host Performance & Operations
            </h1>
            <p style={{ fontSize: '1.02rem', color: '#d1fae5', maxWidth: '620px', lineHeight: 1.6 }}>
              Track your property revenue, occupied rooms, verified tenants, and upcoming guest check-ins with zero double-booking protection.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleResetBookingsStats}
              disabled={resetLoading}
              title="Reset all bookings to zero for fresh testing"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                color: '#fee2e2',
                border: '1px solid rgba(248, 113, 113, 0.35)',
                padding: '0.75rem 1.25rem',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: resetLoading ? 'not-allowed' : 'pointer',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.15s ease',
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.35)'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'; }}
            >
              <RotateCcw size={16} color="#fca5a5" className={resetLoading ? 'spin-anim' : ''} />
              {resetLoading ? 'Resetting...' : 'Reset Stats (Bookings)'}
            </button>
            <button
              onClick={fetchAnalytics}
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
              }}
            >
              <RefreshCw size={16} /> Refresh
            </button>
            <Link
              to="/add-property"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                backgroundColor: '#ffffff',
                color: '#064e3b',
                padding: '0.75rem 1.4rem',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.92rem',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
              }}
            >
              <PlusCircle size={18} /> Add New Stay
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.25rem' }}>
          <div style={{ width: '50px', height: '50px', border: '4px solid #e2e8f0', borderTopColor: '#059669', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: '#64748b', fontWeight: 600, fontSize: '1rem' }}>Calculating occupancy & rent analytics...</p>
        </div>
      ) : error ? (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '20px', padding: '2rem', textAlign: 'center', color: '#b91c1c' }}>
          <AlertCircle size={36} style={{ margin: '0 auto 0.75rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Unable to Load Analytics</h3>
          <p style={{ marginTop: '0.25rem', fontSize: '0.92rem' }}>{error}</p>
        </div>
      ) : (
        <div>
          {/* 4 KEY METRIC CARDS REQUIRED BY USER */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2.5rem',
          }}>
            {/* 1. OCCUPIED ROOMS & OCCUPANCY RATE */}
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
                  Occupied Rooms
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
                  <BedDouble size={22} />
                </div>
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1 }}>
                {analytics.occupiedBedrooms}
                <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: '6px' }}>
                  / {analytics.totalBedrooms} Total
                </span>
              </div>
              <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ flex: 1, height: '8px', borderRadius: '9999px', backgroundColor: 'var(--bg-subtle)', overflow: 'hidden' }}>
                  <div style={{
                    width: `${analytics.occupancyRate}%`,
                    height: '100%',
                    borderRadius: '9999px',
                    backgroundColor: '#0284c7',
                    transition: 'width 0.4s ease',
                  }} />
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0284c7' }}>
                  {analytics.occupancyRate}%
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Currently active bookings right now
              </p>
            </div>

            {/* 2. RENT MONEY EARNED */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: '24px',
              padding: '1.75rem',
              border: '1.5px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Rent Money Earned
                </span>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <IndianRupee size={22} strokeWidth={2.4} />
                </div>
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1 }}>
                ₹{analytics.totalEarnings.toLocaleString()}
              </div>
              <div style={{ marginTop: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700, color: '#10b981' }}>
                <ShieldCheck size={14} /> 100% Verified Payouts
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Gross revenue from confirmed reservations
              </p>
            </div>

            {/* 3. TOTAL NUMBER OF TENANTS */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: '24px',
              padding: '1.75rem',
              border: '1.5px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Total Tenants Hosted
                </span>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(167, 139, 250, 0.15)',
                  color: '#a78bfa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Users size={22} />
                </div>
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1 }}>
                {analytics.totalTenants}
                <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: '6px' }}>
                  Guests
                </span>
              </div>
              <div style={{ marginTop: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: 'rgba(167, 139, 250, 0.15)', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700, color: '#c4b5fd' }}>
                Across {analytics.totalProperties} Active {analytics.totalProperties === 1 ? 'Stay' : 'Stays'}
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Unique verified travelers who stayed with you
              </p>
            </div>

            {/* 4. ACTIVE RESERVATIONS COUNT */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: '24px',
              padding: '1.75rem',
              border: '1.5px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fb923c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Current Active Trips
                </span>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(251, 146, 60, 0.15)',
                  color: '#fb923c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Clock size={22} />
                </div>
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1 }}>
                {analytics.activeBookingsCount}
                <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: '6px' }}>
                  Active Stays
                </span>
              </div>
              <div style={{ marginTop: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#fff7ed', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700, color: '#c2410c' }}>
                Guests Checked In Right Now
              </div>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.5rem' }}>
                Ongoing stays undergoing active lodging
              </p>
            </div>
          </div>

          {/* INTERACTIVE ANALYTICS GRAPHS SECTION */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)',
            gap: '1.75rem',
            marginBottom: '2.5rem',
          }}>
            {/* GRAPH 1: 6-MONTH REVENUE TRAJECTORY BAR CHART */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: '24px',
              padding: '2rem',
              border: '1.5px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                    FINANCIAL GROWTH
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    Monthly Revenue Trajectory
                  </h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#10b981' }} />
                    <span>Payouts (₹)</span>
                  </div>
                </div>
              </div>

              {/* Responsive SVG Bar Chart */}
              {(() => {
                const data = analytics.monthlyRevenue || [];
                const maxRev = Math.max(...data.map((d) => d.revenue), 10000);
                const chartHeight = 180;

                return (
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'space-between',
                      height: `${chartHeight}px`,
                      paddingBottom: '0.5rem',
                      borderBottom: '2px solid #f1f5f9',
                      gap: '0.75rem',
                    }}>
                      {data.map((item, idx) => {
                        const barHeight = Math.max(12, Math.round((item.revenue / maxRev) * (chartHeight - 40)));
                        const isCurrentMonth = idx === data.length - 1;

                        return (
                          <div
                            key={idx}
                            style={{
                              flex: 1,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              height: '100%',
                              justifyContent: 'flex-end',
                              position: 'relative',
                            }}
                          >
                            {/* Value Label above Bar */}
                            <div style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              color: isCurrentMonth ? '#047857' : '#64748b',
                              marginBottom: '6px',
                            }}>
                              {item.revenue > 0 ? `₹${(item.revenue / 1000).toFixed(1)}k` : '₹0'}
                            </div>

                            {/* Bar Pill */}
                            <div
                              style={{
                                width: '100%',
                                maxWidth: '42px',
                                height: `${barHeight}px`,
                                borderRadius: '8px 8px 3px 3px',
                                background: isCurrentMonth
                                  ? 'linear-gradient(180deg, #10b981 0%, #059669 100%)'
                                  : 'linear-gradient(180deg, #cbd5e1 0%, #94a3b8 100%)',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                boxShadow: isCurrentMonth ? '0 4px 12px rgba(16, 185, 129, 0.35)' : 'none',
                              }}
                              title={`${item.month}: ₹${item.revenue.toLocaleString()} (${item.bookings} bookings)`}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Month Labels underneath */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.65rem' }}>
                      {data.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            flex: 1,
                            textAlign: 'center',
                            fontSize: '0.8rem',
                            fontWeight: idx === data.length - 1 ? 800 : 600,
                            color: idx === data.length - 1 ? '#059669' : '#64748b',
                          }}
                        >
                          {item.month}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* GRAPH 2: ROOM OCCUPANCY & PORTFOLIO ALLOCATION GAUGE */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: '24px',
              padding: '2rem',
              border: '1.5px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  CAPACITY MANAGEMENT
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
                  Occupancy & Room Utilization
                </h3>

                {/* Circular / Segmented visual progress */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '1.25rem',
                  borderRadius: '18px',
                  border: '1px solid var(--border-color)',
                  marginBottom: '1.25rem',
                }}>
                  {/* Visual SVG Circular Gauge */}
                  <div style={{ position: 'relative', width: '90px', height: '90px', flexShrink: 0 }}>
                    <svg width="90" height="90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="var(--border-color)"
                        strokeWidth="3.8"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#0284c7"
                        strokeWidth="3.8"
                        strokeDasharray={`${analytics.occupancyRate}, 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                      fontWeight: 800,
                      color: 'var(--text-main)',
                    }}>
                      {analytics.occupancyRate}%
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      {analytics.occupiedBedrooms} of {analytics.totalBedrooms} Bedrooms Booked
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.4 }}>
                      {analytics.occupancyRate > 50
                        ? 'High demand! More than half of your capacity is actively booked.'
                        : 'Capacity ready for new guests. Stays are available for instant reservations.'}
                    </p>
                  </div>
                </div>

                {/* Status Breakdown Pills */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0284c7' }} />
                      Active Lodging
                    </span>
                    <strong style={{ color: 'var(--text-main)' }}>{analytics.occupiedBedrooms} Rooms</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                      Vacant & Available
                    </span>
                    <strong style={{ color: 'var(--text-main)' }}>
                      {Math.max(0, analytics.totalBedrooms - analytics.occupiedBedrooms)} Rooms
                    </strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#7c3aed' }} />
                      Total Listings
                    </span>
                    <strong style={{ color: 'var(--text-main)' }}>{analytics.totalProperties} Properties</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TWO-COLUMN LOWER SECTION: NEXT BOOKING SPOTLIGHT & PROPERTY PERFORMANCE */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(340px, 1fr) minmax(0, 1.8fr)',
            gap: '2rem',
            alignItems: 'start',
            marginBottom: '2.5rem',
          }}>
            {/* NEXT UPCOMING BOOKING SPOTLIGHT CARD */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: '24px',
              padding: '2rem',
              border: '1.5px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  backgroundColor: '#ecfdf5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Calendar size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    Next Upcoming Booking
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Next guest arriving at your properties</p>
                </div>
              </div>

              {analytics.nextBooking ? (
                <div style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: '18px',
                  border: '1.5px solid var(--border-color)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <img
                      src={analytics.nextBooking.user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(analytics.nextBooking.user?.name || 'Guest')}`}
                      alt="Guest avatar"
                      style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                    />
                    <div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        {analytics.nextBooking.user?.name || 'Verified Traveler'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {analytics.nextBooking.user?.email || 'Guest Email'}
                      </div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                    <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      ASSIGNED PROPERTY
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                      {analytics.nextBooking.property?.title || 'Stay'}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {analytics.nextBooking.property?.city}
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.75rem',
                    backgroundColor: 'var(--bg-card)',
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                  }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>CHECK-IN</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        {formatDate(analytics.nextBooking.checkInDate)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>CHECK-OUT</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        {formatDate(analytics.nextBooking.checkOutDate)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>GUESTS</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        {analytics.nextBooking.guests} guests ({analytics.nextBooking.nights} nights)
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>PAYOUT</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#10b981' }}>
                        ₹{analytics.nextBooking.totalPrice?.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Host Action: Cancel upcoming booking */}
                  {analytics.nextBooking.orderStatus !== 'cancelled' && (
                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleOpenCancelModal(analytics.nextBooking)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          color: '#ef4444',
                          border: '1px solid rgba(239, 68, 68, 0.25)',
                          padding: '0.5rem 0.95rem',
                          borderRadius: '10px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.18)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                        }}
                      >
                        <Ban size={14} /> Cancel Booking
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: '18px',
                  padding: '3rem 1.5rem',
                  textAlign: 'center',
                  border: '1.5px dashed var(--border-color)',
                  color: 'var(--text-muted)',
                }}>
                  <Calendar size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
                  <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '1rem' }}>No upcoming bookings scheduled</div>
                  <p style={{ fontSize: '0.82rem', marginTop: '0.35rem' }}>
                    New reservations made by guests will spotlight here automatically with check-in schedules.
                  </p>
                </div>
              )}
            </div>

            {/* PROPERTY PERFORMANCE BREAKDOWN & OCCUPANCY STATUS */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: '24px',
              padding: '2rem',
              border: '1.5px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    My Properties & Occupancy
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Room availability and revenue generated per listing</p>
                </div>
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '9999px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}>
                  {analytics.propertyPerformance.length} Listings
                </span>
              </div>

              {analytics.propertyPerformance.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
                  <Home size={36} style={{ margin: '0 auto 0.75rem', color: 'var(--text-muted)' }} />
                  <p style={{ fontWeight: 700, color: 'var(--text-main)' }}>You haven't listed any properties yet</p>
                  <Link
                    to="/add-property"
                    style={{
                      display: 'inline-block',
                      marginTop: '0.75rem',
                      color: '#10b981',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                    }}
                  >
                    List your first stay →
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {analytics.propertyPerformance.map((prop) => (
                    <div
                      key={prop.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        padding: '1rem 1.15rem',
                        borderRadius: '16px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-subtle)',
                        transition: 'all 0.2s ease',
                      }}
                      className="card-hover-effect"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                        <img
                          src={prop.image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'}
                          alt={prop.title}
                          style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>
                              {prop.title}
                            </span>
                            <span style={{
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              padding: '0.2rem 0.55rem',
                              borderRadius: '9999px',
                              backgroundColor: prop.isOccupied ? '#fef2f2' : '#ecfdf5',
                              color: prop.isOccupied ? '#dc2626' : '#059669',
                              border: prop.isOccupied ? '1px solid #fecaca' : '1px solid #a7f3d0',
                              textTransform: 'uppercase',
                            }}>
                              {prop.isOccupied ? 'OCCUPIED' : 'VACANT'}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {prop.city} • {prop.bedrooms} Bedrooms • ₹{prop.pricePerNight?.toLocaleString()} / night
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#10b981' }}>
                          ₹{prop.earnings.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                          {prop.totalBookings} {prop.totalBookings === 1 ? 'Booking' : 'Bookings'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RESERVATIONS LOG: DUAL-TONE TABBED SYSTEM (INCOMING & PAST & CANCELLED) */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '24px',
            padding: '2rem',
            border: '1.5px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)',
          }}>
            {/* Header & Title */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                  <Calendar size={20} color="#10b981" />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                    Host Reservations & Booking History
                  </h3>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                  Manage incoming arrivals, review past completed stays, or inspect cancelled bookings.
                </p>
              </div>

              {/* Quick Search */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '0.45rem 0.85rem',
                minWidth: '240px',
              }}>
                <Search size={16} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder="Search guest, property, city..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: 'var(--text-main)',
                    fontSize: '0.84rem',
                    outline: 'none',
                    width: '100%',
                  }}
                />
                {bookingSearch && (
                  <button
                    onClick={() => setBookingSearch('')}
                    style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* TABS NAVIGATION */}
            {(() => {
              const incomingList = analytics.incomingBookings || analytics.allBookings?.filter(b => b.orderStatus !== 'cancelled' && new Date(b.checkOutDate) >= new Date()) || [];
              const pastList = analytics.pastBookings || analytics.allBookings?.filter(b => b.orderStatus !== 'cancelled' && new Date(b.checkOutDate) < new Date()) || [];
              const cancelledList = analytics.cancelledBookings || analytics.allBookings?.filter(b => b.orderStatus === 'cancelled') || [];
              const allList = analytics.allBookings || analytics.recentBookings || [];

              const tabs = [
                { id: 'incoming', label: 'Incoming & Active', count: incomingList.length, icon: Calendar, color: '#10b981' },
                { id: 'past', label: 'Past Bookings', count: pastList.length, icon: History, color: '#0284c7' },
                { id: 'cancelled', label: 'Cancelled', count: cancelledList.length, icon: Ban, color: '#ef4444' },
                { id: 'all', label: 'All Logs', count: allList.length, icon: Filter, color: 'var(--text-muted)' },
              ];

              let activeList = [];
              if (bookingTab === 'incoming') activeList = incomingList;
              else if (bookingTab === 'past') activeList = pastList;
              else if (bookingTab === 'cancelled') activeList = cancelledList;
              else activeList = allList;

              // Apply Search Filter
              if (bookingSearch.trim()) {
                const q = bookingSearch.toLowerCase().trim();
                activeList = activeList.filter((b) =>
                  (b.user?.name && b.user.name.toLowerCase().includes(q)) ||
                  (b.user?.email && b.user.email.toLowerCase().includes(q)) ||
                  (b.property?.title && b.property.title.toLowerCase().includes(q)) ||
                  (b.property?.city && b.property.city.toLowerCase().includes(q))
                );
              }

              return (
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    borderBottom: '1.5px solid var(--border-color)',
                    marginBottom: '1.5rem',
                    overflowX: 'auto',
                    paddingBottom: '0.2rem',
                  }}>
                    {tabs.map((tab) => {
                      const TabIcon = tab.icon;
                      const isActive = bookingTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setBookingTab(tab.id)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.65rem 1.1rem',
                            border: 'none',
                            borderBottom: isActive ? `2.5px solid ${tab.color}` : '2.5px solid transparent',
                            backgroundColor: isActive ? 'var(--bg-subtle)' : 'transparent',
                            borderRadius: '10px 10px 0 0',
                            color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                            fontWeight: isActive ? 800 : 600,
                            fontSize: '0.88rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <TabIcon size={15} color={isActive ? tab.color : 'currentColor'} />
                          <span>{tab.label}</span>
                          <span style={{
                            fontSize: '0.72rem',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '9999px',
                            backgroundColor: isActive ? tab.color : 'var(--bg-subtle)',
                            color: isActive ? '#ffffff' : 'var(--text-muted)',
                            fontWeight: 800,
                          }}>
                            {tab.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* TAB CONTENT: BOOKINGS TABLE */}
                  {activeList.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: 'var(--text-muted)' }}>
                      <Calendar size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.6 }} />
                      <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>
                        {bookingSearch
                          ? `No bookings match "${bookingSearch}"`
                          : bookingTab === 'incoming'
                          ? 'No incoming or upcoming guest bookings scheduled.'
                          : bookingTab === 'past'
                          ? 'No past completed reservations recorded yet.'
                          : bookingTab === 'cancelled'
                          ? 'No cancelled reservations. Great job maintaining bookings!'
                          : 'No bookings recorded on this account yet.'}
                      </p>
                      <p style={{ fontSize: '0.82rem', marginTop: '4px' }}>
                        {bookingSearch ? 'Try a different search keyword.' : 'Bookings made by guests will show up right here in real time.'}
                      </p>
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                        <thead>
                          <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1.5px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left' }}>
                            <th style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>Guest</th>
                            <th style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>Property</th>
                            <th style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>Dates</th>
                            <th style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>Nights / Guests</th>
                            <th style={{ padding: '0.85rem 1rem', fontWeight: 800, textAlign: 'right' }}>Total Value</th>
                            <th style={{ padding: '0.85rem 1rem', fontWeight: 800, textAlign: 'center' }}>Status</th>
                            <th style={{ padding: '0.85rem 1rem', fontWeight: 800, textAlign: 'center' }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeList.map((b) => {
                            const isIncoming = new Date(b.checkOutDate) >= new Date() && b.orderStatus !== 'cancelled';
                            const isPast = new Date(b.checkOutDate) < new Date() && b.orderStatus !== 'cancelled';

                            return (
                              <tr key={b._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.15s ease' }}>
                                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                    <img
                                      src={b.user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(b.user?.name || 'Guest')}`}
                                      alt=""
                                      style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border-color)', objectFit: 'cover' }}
                                    />
                                    <div>
                                      <div style={{ color: 'var(--text-main)' }}>{b.user?.name || 'Traveler'}</div>
                                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 500 }}>{b.user?.email}</div>
                                    </div>
                                  </div>
                                </td>
                                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-main)', fontWeight: 600 }}>
                                  <div>{b.property?.title || 'Stay'}</div>
                                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 500 }}>{b.property?.city}</div>
                                </td>
                                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                                    {formatDate(b.checkInDate)} → {formatDate(b.checkOutDate)}
                                  </div>
                                  <div style={{ fontSize: '0.72rem', color: isIncoming ? '#10b981' : isPast ? '#0284c7' : 'var(--text-muted)', fontWeight: 700 }}>
                                    {isIncoming ? '🟢 Incoming / Active' : isPast ? '🏁 Past Stay' : '❌ Cancelled'}
                                  </div>
                                </td>
                                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                                  {b.nights} nights • {b.guests} guest{b.guests > 1 ? 's' : ''}
                                </td>
                                <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 800, color: b.orderStatus === 'cancelled' ? 'var(--text-muted)' : '#10b981' }}>
                                  ₹{b.totalPrice?.toLocaleString()}
                                </td>
                                <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                                  <span style={{
                                    fontSize: '0.72rem',
                                    fontWeight: 800,
                                    padding: '0.25rem 0.65rem',
                                    borderRadius: '9999px',
                                    backgroundColor:
                                      b.orderStatus === 'cancelled'
                                        ? 'rgba(239, 68, 68, 0.15)'
                                        : isIncoming
                                        ? 'rgba(16, 185, 129, 0.15)'
                                        : 'rgba(2, 132, 199, 0.15)',
                                    color:
                                      b.orderStatus === 'cancelled'
                                        ? '#ef4444'
                                        : isIncoming
                                        ? '#10b981'
                                        : '#0284c7',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.3px',
                                  }}>
                                    {b.orderStatus === 'cancelled' ? 'Cancelled' : isIncoming ? 'Upcoming' : 'Completed'}
                                  </span>
                                </td>
                                <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                                  {b.orderStatus === 'confirmed' ? (
                                    <button
                                      onClick={() => handleOpenCancelModal(b)}
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.35rem',
                                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                        color: '#ef4444',
                                        border: '1px solid rgba(239, 68, 68, 0.25)',
                                        padding: '0.35rem 0.75rem',
                                        borderRadius: '8px',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        transition: 'all 0.15s ease',
                                      }}
                                      onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                                      }}
                                      onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                                      }}
                                    >
                                      <Ban size={13} /> Cancel
                                    </button>
                                  ) : b.orderStatus === 'cancelled' && b.cancellationReason ? (
                                    <span
                                      title={`Cancelled by ${b.cancelledBy || 'system'}: ${b.cancellationReason}`}
                                      style={{
                                        fontSize: '0.72rem',
                                        color: 'var(--text-muted)',
                                        maxWidth: '140px',
                                        display: 'inline-block',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        cursor: 'help',
                                      }}
                                    >
                                      Reason: {b.cancellationReason}
                                    </span>
                                  ) : (
                                    <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>✓ Settled</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* HOST CANCEL BOOKING MODAL WITH REASON BOX */}
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
              maxWidth: '520px',
              width: '100%',
              padding: '2rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
              animation: 'modalSlideUp 0.25s ease-out forwards',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
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
                    Cancel Guest Booking
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Dates will be unlocked & guest will be notified
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

            {/* Target Booking Info Card */}
            <div style={{
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '1rem',
              marginBottom: '1.25rem',
              fontSize: '0.85rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Stay:</span>
                <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>
                  {selectedBookingToCancel.property?.title || 'Property'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Guest:</span>
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                  {selectedBookingToCancel.user?.name} ({selectedBookingToCancel.user?.email})
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Stay Schedule:</span>
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                  {formatDate(selectedBookingToCancel.checkInDate)} → {formatDate(selectedBookingToCancel.checkOutDate)} ({selectedBookingToCancel.nights} nights)
                </span>
              </div>
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
                <AlertCircle size={16} />
                <span>{cancelMessage.text}</span>
              </div>
            )}

            {/* Reason Input Box */}
            <form onSubmit={handleConfirmCancelBooking}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  marginBottom: '0.45rem',
                }}>
                  Cancellation Reason <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Please describe the reason clearly. This will be sent directly to the guest in their notification tray:
                </p>
                <textarea
                  rows={4}
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="e.g. Property maintenance required / Emergency plumbing repair / Accidental double-booking issue..."
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
                    transition: 'border-color 0.15s ease',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#ef4444';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                  }}
                  required
                />
              </div>

              {/* Quick Preset Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                {[
                  'Emergency maintenance / repairs needed',
                  'Water or power supply disruption',
                  'Property unavailable due to personal emergency',
                  'Violation of house rules terms',
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
                      transition: 'all 0.15s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = 'var(--text-main)';
                      e.currentTarget.style.borderColor = '#ef4444';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = 'var(--text-muted)';
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                    }}
                  >
                    + {preset}
                  </button>
                ))}
              </div>

              {/* Modal Action Buttons */}
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
                  Keep Booking
                </button>
                <button
                  type="submit"
                  onClick={handleConfirmCancelBooking}
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
                    boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)',
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

export default HostDashboardPage;

