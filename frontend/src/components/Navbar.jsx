import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../features/auth/authSlice';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import NotificationCenter from './NotificationCenter';
import {
  Compass,
  Sparkles,
  PlusCircle,
  Calendar,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Home,
  TrendingUp,
} from 'lucide-react';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setDropdownOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const isHost = isAuthenticated && user?.role === 'host';

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: 'var(--nav-bg)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-color)',
      transition: 'background-color 0.35s ease, border-color 0.35s ease, box-shadow 0.3s ease',
      boxShadow: '0 4px 20px -4px rgba(0, 0, 0, 0.04)',
    }}>
      {/* Dual-Tone Ambient Hairline */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, transparent 0%, #059669 30%, #10b981 70%, #f59e0b 90%, transparent 100%)',
        opacity: 0.6,
      }} />

      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Brand Logo */}
        <Link to={isHost ? "/host/dashboard" : "/"} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <Logo isHost={isHost} size="md" />
        </Link>

        {/* Desktop Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {/* GUEST SPECIFIC LINKS: Hidden for Hosts */}
          {!isHost && (
            <>
              <Link
                to="/"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: isActive('/') ? '#059669' : 'var(--text-main)',
                  padding: '0.52rem 1.05rem',
                  borderRadius: '9999px',
                  backgroundColor: isActive('/') ? 'var(--primary-light)' : 'transparent',
                  border: isActive('/') ? '1px solid #a7f3d0' : '1px solid transparent',
                  boxShadow: isActive('/') ? '0 2px 8px rgba(5, 150, 105, 0.12)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <Compass size={17} color={isActive('/') ? '#059669' : 'currentColor'} />
                <span>Explore Stays</span>
              </Link>
            </>
          )}

          {/* HOST SPECIFIC LINKS: Always prominent for Hosts */}
          {isHost && (
            <Link
              to="/host/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.92rem',
                fontWeight: 800,
                color: isActive('/host/dashboard') ? '#047857' : '#059669',
                padding: '0.55rem 1.15rem',
                borderRadius: '9999px',
                backgroundColor: isActive('/host/dashboard') ? '#ecfdf5' : 'rgba(236, 253, 245, 0.85)',
                border: '1.5px solid rgba(16, 185, 129, 0.4)',
                boxShadow: '0 2px 10px rgba(16, 185, 129, 0.15)',
                transition: 'all 0.2s ease',
              }}
            >
              <TrendingUp size={17} color="#059669" />
              <span>Host Analytics</span>
            </Link>
          )}

          {/* Host a Stay link (Only for Hosts) */}
          {isHost && (
            <Link
              to="/add-property"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: isActive('/add-property') ? '#059669' : 'var(--text-main)',
                padding: '0.52rem 1.05rem',
                borderRadius: '9999px',
                backgroundColor: isActive('/add-property') ? '#ecfdf5' : 'transparent',
                border: isActive('/add-property') ? '1px solid #a7f3d0' : '1px solid transparent',
                transition: 'all 0.2s ease',
              }}
            >
              <PlusCircle size={17} />
              <span>Host a Stay</span>
            </Link>
          )}

          {/* GUEST SPECIFIC "GUEST DASHBOARD & TRIPS": Hidden for Hosts */}
          {isAuthenticated && !isHost && (
            <Link
              to="/guest/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: isActive('/guest/dashboard') || isActive('/my-bookings') ? '#1d4ed8' : 'var(--text-main)',
                padding: '0.52rem 1.1rem',
                borderRadius: '9999px',
                backgroundColor: isActive('/guest/dashboard') || isActive('/my-bookings') ? 'rgba(37, 99, 235, 0.12)' : 'transparent',
                border: isActive('/guest/dashboard') || isActive('/my-bookings') ? '1.5px solid rgba(37, 99, 235, 0.35)' : '1px solid var(--border-color)',
                boxShadow: isActive('/guest/dashboard') || isActive('/my-bookings') ? '0 2px 10px rgba(37, 99, 235, 0.15)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <Compass size={17} color="#2563eb" />
              <span>Guest Dashboard</span>
            </Link>
          )}
        </nav>

        {/* Right side controls: Theme Toggle + Notification Center + Auth Button / User Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Notification Center (Live Booking & Stay-End Alerts) */}
          <NotificationCenter />

          {/* Automatic & Interactive Light/Dark Mode Switch */}
          <ThemeToggle />

          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.35rem 0.85rem 0.35rem 0.45rem',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  transition: 'all 0.25s ease',
                }}
              >
                <img
                  src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'User')}`}
                  alt={user?.name}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {user?.name?.split(' ')[0]}
                </span>
                <span style={{
                  fontSize: '0.7rem',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '9999px',
                  backgroundColor: isHost ? '#ecfdf5' : 'var(--bg-subtle)',
                  color: isHost ? '#059669' : 'var(--text-muted)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}>
                  {user?.role}
                </span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '120%',
                    width: '220px',
                    backgroundColor: 'var(--dropdown-bg)',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-xl)',
                    border: '1px solid var(--dropdown-border)',
                    padding: '0.5rem',
                    zIndex: 1100,
                  }}
                >
                  <div style={{ padding: '0.6rem 0.8rem', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{user?.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{user?.email}</div>
                  </div>

                  {isHost ? (
                    <>
                      <Link
                        to="/host/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.65rem 0.8rem',
                          fontSize: '0.88rem',
                          color: '#10b981',
                          fontWeight: 700,
                          borderRadius: '8px',
                          textDecoration: 'none',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <TrendingUp size={16} color="#10b981" />
                        Host Analytics
                      </Link>
                      <Link
                        to="/add-property"
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.65rem 0.8rem',
                          fontSize: '0.88rem',
                          color: 'var(--text-main)',
                          fontWeight: 600,
                          borderRadius: '8px',
                          textDecoration: 'none',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <PlusCircle size={16} color="var(--text-muted)" />
                        List a Property
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/guest/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.65rem 0.8rem',
                          fontSize: '0.88rem',
                          color: '#2563eb',
                          fontWeight: 700,
                          borderRadius: '8px',
                          textDecoration: 'none',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Compass size={16} color="#2563eb" />
                        Travel Dashboard & Trips
                      </Link>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.65rem 0.8rem',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: '#f43f5e',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(244, 63, 94, 0.12)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <LogOut size={16} />
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link
                to="/login"
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  textDecoration: 'none',
                  transition: 'background-color 0.2s ease',
                }}
              >
                Log in
              </Link>
              <Link
                to="/register"
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  padding: '0.52rem 1.25rem',
                  borderRadius: '9999px',
                  boxShadow: '0 4px 14px rgba(5, 150, 105, 0.35)',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 18px rgba(5, 150, 105, 0.45)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(5, 150, 105, 0.35)';
                }}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
