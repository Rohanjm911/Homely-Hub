import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser, clearError } from '../features/auth/authSlice';
import Logo from '../components/Logo';
import { Mail, Lock, LogIn, Sparkles, UserCheck } from 'lucide-react';

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
      const loggedUser = res.payload?.user;
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
      const loggedUser = res.payload?.user;
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
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
    }}>
      <div style={{
        maxWidth: '440px',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        padding: '2.5rem 2rem',
        border: '1px solid #e2e8f0',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)',
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <Logo size="lg" />
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, textAlign: 'center', color: '#0f172a', marginBottom: '0.4rem' }}>
          Welcome Back
        </h1>
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
          Sign in with JWT HTTP-only cookie persistence
        </p>

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            borderRadius: '10px',
            padding: '0.75rem',
            marginBottom: '1.25rem',
            fontSize: '0.85rem',
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Email Address
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 0.85rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
              <Mail size={17} color="#64748b" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem', color: '#0f172a' }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                Password
              </label>
              <Link to="/forgot-password" style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 600, textDecoration: 'none' }}>
                Forgot Password?
              </Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 0.85rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
              <Lock size={17} color="#64748b" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem', color: '#0f172a' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.8rem',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
              marginTop: '0.5rem',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* 1-Click Demo Accounts */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '0.85rem' }}>
            ⚡ 1-Click Instant Demo Login
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
            <button
              type="button"
              onClick={() => handleDemoLogin('host@homelyhub.com', 'Password@123')}
              style={{
                gridColumn: 'span 2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                padding: '0.65rem',
                borderRadius: '12px',
                border: '1px solid #bbf7d0',
                backgroundColor: '#f0fdf4',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#15803d',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#dcfce7'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#f0fdf4'; }}
            >
              <Sparkles size={16} color="#16a34a" />
              Demo Host (Aarav Sharma)
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('aditya@example.com', 'Password@123')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                padding: '0.65rem',
                borderRadius: '12px',
                border: '1px solid #bfdbfe',
                backgroundColor: '#eff6ff',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#1d4ed8',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#dbeafe'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#eff6ff'; }}
            >
              <UserCheck size={15} color="#2563eb" />
              Guest: Aditya Rao
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('meera@example.com', 'Password@123')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                padding: '0.65rem',
                borderRadius: '12px',
                border: '1px solid #99f6e4',
                backgroundColor: '#f0fdfa',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#0f766e',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#ccfbf1'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#f0fdfa'; }}
            >
              <UserCheck size={15} color="#0d9488" />
              Guest: Meera Nair
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: '#64748b' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#0284c7', fontWeight: 700, textDecoration: 'none' }}>
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
