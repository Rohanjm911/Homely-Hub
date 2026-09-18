import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#ffffff',
      borderTop: '1px solid #e2e8f0',
      padding: '3rem 1.5rem 2rem',
      marginTop: '4rem',
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
              <Logo size="sm" showSubtitle={true} subtitleText="Feels Like Home, Anywhere" />
            </div>
            <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, marginBottom: '1rem' }}>
              Next-generation AI-powered stay booking & travel planning platform. Seamlessly connect with top verified stays across India.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.72rem', background: '#f1f5f9', color: '#475569', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 600 }}>MERN Stack</span>
              <span style={{ fontSize: '0.72rem', background: '#f1f5f9', color: '#475569', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 600 }}>JWT Cookie Auth</span>
              <span style={{ fontSize: '0.72rem', background: '#f5f3ff', color: '#7c3aed', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 600 }}>Groq LLM</span>
              <span style={{ fontSize: '0.72rem', background: '#f1f5f9', color: '#475569', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 600 }}>Leaflet Maps</span>
            </div>
          </div>

          {/* Quick Destinations */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Top Destinations</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', color: '#64748b' }}>
              <li>Goa Beach Villas</li>
              <li>Manali Mountain Chalets</li>
              <li>Mumbai Skyline Flats</li>
              <li>Jaipur Royal Haveli Suites</li>
              <li>Bengaluru Digital Nomad Studios</li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Platform Features</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', color: '#64748b' }}>
              <li>Strict Date-Overlap Overbooking Guard</li>
              <li>AI Listing Description Generator</li>
              <li>Intelligent Day-by-Day Trip Planner</li>
              <li>10-Minute Secure Password Recovery</li>
              <li>Full Redux Toolkit State Engine</li>
            </ul>
          </div>

          {/* AI Info */}
          <div style={{
            background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
            padding: '1.25rem',
            borderRadius: '16px',
            border: '1px solid #bbf7d0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#15803d', fontWeight: 700, fontSize: '0.95rem' }}>
              <Sparkles size={18} />
              AI-First Travel Experience
            </div>
            <p style={{ fontSize: '0.82rem', color: '#166534', lineHeight: 1.5 }}>
              Owners list places effortlessly with automated AI descriptions. Travelers plan entire trips with budget-aligned stays in seconds.
            </p>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #f1f5f9',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.82rem',
          color: '#94a3b8',
          gap: '1rem',
        }}>
          <div>
            © 2026 HomelyHub Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Built with modern MERN Stack & Groq AI
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
