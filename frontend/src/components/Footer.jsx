import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-main)',
      borderTop: '1px solid var(--border-color)',
      padding: '3rem 1.5rem 2.5rem',
      marginTop: '4rem',
      transition: 'background-color 0.35s ease, border-color 0.35s ease',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem',
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ marginBottom: '0.85rem' }}>
              <Logo size="sm" showSubtitle={true} subtitleText="Find Your Retreat" />
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.1rem' }}>
              Next-generation vacation stay discovery & intelligent travel curation. Effortless, conflict-free bookings designed for tranquility.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.7rem', background: 'var(--input-bg)', color: 'var(--text-muted)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-xs)', fontWeight: 500 }}>Verified Stays</span>
              <span style={{ fontSize: '0.7rem', background: 'var(--input-bg)', color: 'var(--text-muted)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-xs)', fontWeight: 500 }}>Secure Auth</span>
              <span style={{ fontSize: '0.7rem', background: 'var(--input-bg)', color: 'var(--text-muted)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-xs)', fontWeight: 500 }}>AI Curation</span>
              <span style={{ fontSize: '0.7rem', background: 'var(--input-bg)', color: 'var(--text-muted)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-xs)', fontWeight: 500 }}>Interactive Maps</span>
            </div>
          </div>

          {/* Quick Destinations */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Top Destinations</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              <li>Goa Coastal Retreats</li>
              <li>Manali Mountain Chalets</li>
              <li>Mumbai Skyline Lofts</li>
              <li>Jaipur Heritage Suites</li>
              <li>Bengaluru Creative Studios</li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Capabilities</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              <li>Atomic Date Overlap Guard</li>
              <li>Intelligent Listing Copywriter</li>
              <li>Tailored Day-by-Day Itineraries</li>
              <li>Direct Host Performance Analytics</li>
              <li>Instant Reservation Receipts</li>
            </ul>
          </div>

          {/* Intelligent Assistant Info Card */}
          <div style={{
            background: 'var(--bg-card)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            backdropFilter: 'blur(16px)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.88rem' }}>
              <Sparkles size={16} color="var(--primary)" />
              Intelligent Itinerary Generator
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
              Effortlessly generate full travel plans synchronized with your stay bookings in real-time.
            </p>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.78rem',
          color: 'var(--text-subtle)',
          gap: '1rem',
        }}>
          <div>
            © 2026 HomelyHub. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Engineered for seamless hospitality
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
