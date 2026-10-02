import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Clock, Calendar, CheckCheck, X, AlertTriangle } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { useSelector } from 'react-redux';

const NotificationCenter = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await axiosClient.get('/notifications');
      if (res.data && res.data.success) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      // Auto poll every 25 seconds for new stay completions or bookings
      const interval = setInterval(fetchNotifications, 25000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await axiosClient.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setLoading(true);
      await axiosClient.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        aria-label="View notifications"
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '36px',
          height: '36px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: isOpen ? 'var(--border-color)' : 'var(--input-bg)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-main)',
          cursor: 'pointer',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-coral)',
              color: '#ffffff',
              fontSize: '0.65rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--bg-card-solid)',
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 10px)',
            width: '360px',
            maxWidth: '90vw',
            backgroundColor: 'var(--dropdown-bg)',
            border: '1px solid var(--dropdown-border)',
            borderRadius: '20px',
            boxShadow: 'var(--shadow-xl)',
            zIndex: 1200,
            overflow: 'hidden',
            animation: 'fadeIn 0.2s ease forwards',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.9rem 1.15rem',
              borderBottom: '1px solid var(--border-color)',
              background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-subtle) 100%)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                Notifications
              </span>
              {unreadCount > 0 && (
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(5, 150, 105, 0.15)',
                    color: '#059669',
                    border: '1px solid rgba(5, 150, 105, 0.3)',
                  }}
                >
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={loading}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  color: '#059669',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '6px',
                }}
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
          </div>

          {/* List of Notifications */}
          <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div
                style={{
                  padding: '2.5rem 1.5rem',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                }}
              >
                <Clock size={32} style={{ margin: '0 auto 0.6rem', opacity: 0.5 }} />
                <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>No notifications yet</div>
                <div style={{ fontSize: '0.78rem', marginTop: '0.2rem' }}>
                  Booking updates and stay completion notices will appear here.
                </div>
              </div>
            ) : (
              notifications.map((notif) => {
                const isBooking = notif.type === 'booking_confirmed';
                const isCompleted = notif.type === 'stay_completed';
                const isCancelled = notif.type === 'booking_cancelled';

                return (
                  <div
                    key={notif._id}
                    style={{
                      padding: '0.85rem 1.1rem',
                      borderBottom: '1px solid var(--border-color)',
                      backgroundColor: notif.isRead
                        ? 'transparent'
                        : isCancelled
                        ? 'rgba(239, 68, 68, 0.05)'
                        : 'rgba(5, 150, 105, 0.04)',
                      transition: 'background-color 0.15s ease',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                      {/* Icon */}
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          backgroundColor: isBooking
                            ? 'rgba(5, 150, 105, 0.15)'
                            : isCompleted
                            ? 'rgba(217, 119, 6, 0.15)'
                            : isCancelled
                            ? 'rgba(239, 68, 68, 0.15)'
                            : 'var(--bg-subtle)',
                          color: isBooking
                            ? '#059669'
                            : isCompleted
                            ? '#d97706'
                            : isCancelled
                            ? '#ef4444'
                            : 'var(--text-muted)',
                        }}
                      >
                        {isBooking ? <Calendar size={16} /> : isCancelled ? <AlertTriangle size={16} /> : <Check size={16} />}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: '0.84rem',
                            fontWeight: notif.isRead ? 600 : 800,
                            color: 'var(--text-main)',
                            marginBottom: '0.2rem',
                          }}
                        >
                          {notif.title}
                        </div>
                        <div
                          style={{
                            fontSize: '0.78rem',
                            color: 'var(--text-muted)',
                            lineHeight: 1.45,
                            marginBottom: '0.45rem',
                          }}
                        >
                          {notif.message}
                        </div>

                        {/* Rich Guest Metadata for Host */}
                        {notif.metadata?.guestName && (
                          <div
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '0.35rem',
                              marginBottom: '0.45rem',
                            }}
                          >
                            <span
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                padding: '0.15rem 0.5rem',
                                borderRadius: '6px',
                                backgroundColor: 'var(--bg-subtle)',
                                color: 'var(--text-main)',
                                border: '1px solid var(--border-color)',
                              }}
                            >
                              👤 {notif.metadata.guestName}
                            </span>
                            <span
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                padding: '0.15rem 0.5rem',
                                borderRadius: '6px',
                                backgroundColor: 'var(--bg-subtle)',
                                color: 'var(--text-muted)',
                                border: '1px solid var(--border-color)',
                              }}
                            >
                              ✉️ {notif.metadata.guestEmail}
                            </span>
                            <span
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                padding: '0.15rem 0.5rem',
                                borderRadius: '6px',
                                backgroundColor: 'rgba(5, 150, 105, 0.12)',
                                color: '#059669',
                                border: '1px solid rgba(5, 150, 105, 0.25)',
                              }}
                            >
                              👥 {notif.metadata.guestsCount} Guest{notif.metadata.guestsCount > 1 ? 's' : ''}
                            </span>
                            {notif.metadata?.cancellationReason && (
                              <span
                                style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 600,
                                  padding: '0.15rem 0.5rem',
                                  borderRadius: '6px',
                                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                  color: '#ef4444',
                                  border: '1px solid rgba(239, 68, 68, 0.2)',
                                  width: '100%',
                                  marginTop: '0.2rem',
                                }}
                              >
                                📝 Reason: "{notif.metadata.cancellationReason}"
                              </span>
                            )}
                          </div>
                        )}
                        <div
                          style={{
                            fontSize: '0.7rem',
                            color: 'var(--text-subtle)',
                            fontWeight: 600,
                          }}
                        >
                          {new Date(notif.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>

                      {/* Read Indicator / Button */}
                      {!notif.isRead && (
                        <button
                          onClick={(e) => handleMarkAsRead(notif._id, e)}
                          title="Mark as read"
                          aria-label="Mark notification as read"
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            padding: '0.2rem',
                            borderRadius: '4px',
                          }}
                        >
                          <span
                            style={{
                              display: 'inline-block',
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: '#059669',
                            }}
                          />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
