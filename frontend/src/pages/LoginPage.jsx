import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser, clearError } from '../features/auth/authSlice';
import Logo from '../components/Logo';
import { Mail, Lock, Sparkles, UserCheck, ShieldCheck, Star } from 'lucide-react';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const res = await dispatch(loginUser({ email, password }));
    if (!res.error) {
      const loggedUser = res.payload?.user || res.payload;
      if (loggedUser?.role === 'host') {
        navigate('/host/dashboard', { replace: true });
      } else {
        const fromPath = location.state?.from?.pathname;
        const targetPath = fromPath && fromPath !== '/login' ? fromPath : '/guest/dashboard';
        navigate(targetPath, { replace: true });
      }
    }
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    dispatch(clearError());
    const res = await dispatch(loginUser({ email: demoEmail, password: demoPassword }));
    if (!res.error) {
      const loggedUser = res.payload?.user || res.payload;
      if (loggedUser?.role === 'host') {
        navigate('/host/dashboard', { replace: true });
      } else {
        const fromPath = location.state?.from?.pathname;
        const targetPath = fromPath && fromPath !== '/login' ? fromPath : '/guest/dashboard';
        navigate(targetPath, { replace: true });
      }
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1.25rem',
    }}>
      {/* Centered Main Brand Logo across both panels */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '2rem',
        filter: 'drop-shadow(0 4px 16px rgba(0, 0, 0, 0.15))',
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Logo size="xl" />
        </Link>
      </div>

      <div className="auth-split-wrapper">
        
        {/* ========================================================
            LEFT SIDE: ARTISTIC ANIMATED HOUSE & BRAND SHOWCASE
            ======================================================== */}
        <div
          className="auth-hero-banner"
          style={{
            position: 'relative',
            background: 'linear-gradient(145deg, #090d16 0%, #111827 50%, #0d121f 100%)',
            padding: '3rem 2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            overflow: 'hidden',
          }}
        >
          {/* Ambient Glowing Gradient Orb */}
          <div
            className="auth-ambient-glow"
            style={{
              position: 'absolute',
              top: '15%',
              left: '20%',
              width: '280px',
              height: '280px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.28) 0%, rgba(255, 51, 58, 0.12) 50%, transparent 75%)',
              filter: 'blur(40px)',
              pointerEvents: 'none',
            }}
          />

          {/* Top Tagline */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#818cf8',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '1rem',
            }}>
              <ShieldCheck size={14} color="#818cf8" />
              Verified Owners & Stays
            </div>
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.035em',
              lineHeight: 1.25,
              marginBottom: '0.6rem',
            }}>
              Welcome to your next sanctuary.
            </h2>
            <p style={{
              color: '#94a3b8',
              fontSize: '0.88rem',
              lineHeight: 1.5,
              maxWidth: '340px',
            }}>
              Discover vetted homes, connect with premier hosts, and enjoy seamless bookings without overlap.
            </p>
          </div>

          {/* CENTER: INTERACTIVE ANIMATED HOUSE SVG */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            margin: '2rem 0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <svg
              className="auth-house-floating"
              width="280"
              height="230"
              viewBox="0 0 340 280"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ filter: 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.45))' }}
            >
              {/* Background Stars / Twinkles */}
              <circle cx="50" cy="40" r="2" fill="#818cf8" className="auth-star-1" />
              <circle cx="290" cy="50" r="2.5" fill="#fef08a" className="auth-star-2" />
              <circle cx="260" cy="95" r="1.5" fill="#ffffff" className="auth-star-3" />
              <circle cx="80" cy="110" r="1.8" fill="#818cf8" className="auth-star-2" />

              {/* Floating Cloud */}
              <g className="auth-cloud-drift" opacity="0.25">
                <path d="M45 70 C45 62 53 56 61 58 C65 52 75 52 79 57 C85 55 93 60 93 67 C93 72 89 76 83 76 L52 76 C48 76 45 73 45 70 Z" fill="#ffffff" />
              </g>

              {/* Chimney Smoke Particles */}
              <circle cx="106" cy="42" r="5" fill="#e0e7ff" className="auth-smoke-1" />
              <circle cx="107" cy="34" r="6" fill="#c7d2fe" className="auth-smoke-2" />
              <circle cx="109" cy="24" r="7" fill="#a5b4fc" className="auth-smoke-3" />

              {/* Chimney */}
              <rect x="98" y="58" width="16" height="38" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="2" />
              <rect x="95" y="54" width="22" height="6" rx="2" fill="#ff333a" />

              {/* Floating Ground / Island with Gentle Curved Shadow */}
              <ellipse cx="170" cy="248" rx="130" ry="18" fill="rgba(0, 0, 0, 0.4)" />
              <path
                d="M50 240 C50 230 110 220 170 220 C230 220 290 230 290 240 C290 252 230 258 170 258 C110 258 50 252 50 240 Z"
                fill="url(#islandGrad)"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1.5"
              />

              {/* House Main Body */}
              <rect x="90" y="118" width="160" height="110" rx="12" fill="#0f172a" stroke="#334155" strokeWidth="2.5" />

              {/* Modern Slat Wall Detail */}
              <line x1="90" y1="145" x2="250" y2="145" stroke="#1e293b" strokeWidth="1.5" />
              <line x1="90" y1="175" x2="250" y2="175" stroke="#1e293b" strokeWidth="1.5" />
              <line x1="90" y1="205" x2="250" y2="205" stroke="#1e293b" strokeWidth="1.5" />

              {/* Gable / Slanted Modern Roof */}
              <path
                d="M72 122 L170 52 L268 122 Z"
                fill="url(#roofGrad)"
                stroke="#6366f1"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* Roof Trim Eaves Accent */}
              <path
                d="M68 123 L170 50 L272 123"
                stroke="#ff333a"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Attic / Peak Circular Star Window */}
              <circle cx="170" cy="92" r="13" fill="#1e293b" stroke="#475569" strokeWidth="2" />
              <circle cx="170" cy="92" r="8" fill="#fef08a" className="auth-window-glow" />

              {/* Glowing Warm Living Room Window (Left) */}
              <rect
                x="112"
                y="142"
                width="42"
                height="46"
                rx="6"
                fill="#fef08a"
                stroke="#fbbf24"
                strokeWidth="2"
                className="auth-window-glow"
              />
              <line x1="133" y1="142" x2="133" y2="188" stroke="#ca8a04" strokeWidth="1.8" />
              <line x1="112" y1="165" x2="154" y2="165" stroke="#ca8a04" strokeWidth="1.8" />

              {/* Modern Warm Arch Entrance Door (Right) */}
              <path
                d="M186 228 V160 C186 150 196 142 208 142 C220 142 230 150 230 160 V228 H186 Z"
                fill="#1e1e24"
                stroke="#ff333a"
                strokeWidth="2.5"
              />
              {/* Door Glass Panel */}
              <path
                d="M194 185 V162 C194 156 200 151 208 151 C216 151 222 156 222 162 V185 H194 Z"
                fill="#818cf8"
                fillOpacity="0.4"
                stroke="#818cf8"
                strokeWidth="1.2"
              />
              {/* Golden Door Handle */}
              <circle cx="196" cy="195" r="3" fill="#fbbf24" />

              {/* Porch Welcome Light Lantern */}
              <circle cx="176" cy="154" r="5" fill="#fef08a" className="auth-window-glow" />
              <path d="M176 148 V152" stroke="#cbd5e1" strokeWidth="1.5" />

              {/* Decorative Potted Plant outside door */}
              <rect x="236" y="212" width="12" height="16" rx="2" fill="#d97706" />
              <circle cx="242" cy="207" r="8" fill="#10b981" />
              <circle cx="240" cy="200" r="5" fill="#34d399" />

              {/* Gradients */}
              <defs>
                <linearGradient id="roofGrad" x1="170" y1="52" x2="170" y2="122" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#1e1b4b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <linearGradient id="islandGrad" x1="50" y1="220" x2="290" y2="258" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Bottom Social Proof Badge */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255, 51, 58, 0.15)',
              color: '#ff333a',
            }}>
              <Star size={16} fill="#ff333a" color="#ff333a" />
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                4.9 / 5 Rating from 12,000+ Guests
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                Zero double-booking guarantee with verified AI sync
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            RIGHT SIDE: MODERN LOGIN FORM
            ======================================================== */}
        <div style={{
          padding: '3.2rem 2.8rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <h1 style={{
            fontSize: '1.95rem',
            fontWeight: 700,
            textAlign: 'center',
            color: 'var(--text-main)',
            marginBottom: '0.45rem',
            letterSpacing: '-0.04em',
            fontFamily: 'var(--font-heading)',
          }}>
            Welcome back
          </h1>
          <p style={{
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.88rem',
            marginBottom: '2rem',
            letterSpacing: '-0.01em',
          }}>
            Sign in to access your stays and bookings
          </p>

          {error && (
            <div style={{
              backgroundColor: 'rgba(255, 51, 58, 0.08)',
              border: '1px solid rgba(255, 51, 58, 0.22)',
              color: '#ff333a',
              borderRadius: '14px',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              fontSize: '0.84rem',
              textAlign: 'center',
              fontWeight: 500,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                marginBottom: '0.45rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                Email Address
              </label>
              <div className="auth-input-group">
                <Mail size={16} color="var(--text-muted)" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: '0.92rem',
                    color: 'var(--text-main)',
                    fontFamily: 'var(--font-main)',
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.45rem' }}>
                <label style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}>
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--primary)',
                    fontWeight: 500,
                    textDecoration: 'none',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="auth-input-group">
                <Lock size={16} color="var(--text-muted)" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: '0.92rem',
                    color: 'var(--text-main)',
                    fontFamily: 'var(--font-main)',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="auth-btn-primary"
              style={{ marginTop: '0.5rem' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* 1-Click Instant Demo Profiles */}
          <div style={{ marginTop: '2rem', paddingTop: '1.4rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              textAlign: 'center',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.95rem',
            }}>
              Instant Demo Profiles
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={() => handleDemoLogin('host@homelyhub.com', 'Password@123')}
                className="auth-demo-pill"
                style={{ gridColumn: 'span 2' }}
              >
                <Sparkles size={14} color="#ff333a" />
                <span style={{ fontWeight: 600 }}>Host: Aarav Sharma</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('aditya@example.com', 'Password@123')}
                className="auth-demo-pill"
              >
                <UserCheck size={14} color="var(--primary)" />
                <span>Aditya Rao</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('meera@example.com', 'Password@123')}
                className="auth-demo-pill"
              >
                <UserCheck size={14} color="var(--primary)" />
                <span>Meera Nair</span>
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              style={{
                color: 'var(--primary)',
                fontWeight: 600,
                textDecoration: 'none',
                marginLeft: '0.2rem',
              }}
            >
              Sign up now
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
