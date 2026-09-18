import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProperties, setFilters, resetFilters } from '../features/properties/propertySlice';
import PropertyCard from '../components/PropertyCard';
import FilterBar from '../components/FilterBar';
import MapView from '../components/MapView';
import { LayoutGrid, Map, Sparkles, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';

const HomePage = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // If logged-in user is a Host, redirect directly to Host Analytics Dashboard
  if (isAuthenticated && user?.role === 'host') {
    return <Navigate to="/host/dashboard" replace />;
  }
  const {
    properties,
    loading,
    totalProperties,
    filteredPropertiesCount,
    resPerPage,
    currentPage,
    filters,
  } = useSelector((state) => state.properties);

  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'

  // Trigger property fetch whenever filters or page change
  useEffect(() => {
    const queryParams = {
      page: filters.page || 1,
    };
    if (filters.keyword) queryParams.keyword = filters.keyword;
    if (filters.city) queryParams.city = filters.city;
    if (filters.propertyType) queryParams.propertyType = filters.propertyType;
    if (filters.maxPrice) queryParams['pricePerNight[lte]'] = filters.maxPrice;
    if (filters.minPrice) queryParams['pricePerNight[gte]'] = filters.minPrice;
    if (filters.guests) queryParams.guests = filters.guests;
    if (filters.checkIn) queryParams.checkIn = filters.checkIn;
    if (filters.checkOut) queryParams.checkOut = filters.checkOut;

    dispatch(fetchProperties(queryParams));
  }, [dispatch, filters]);

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters({ ...newFilters, page: 1 }));
  };

  const handleSearch = () => {
    // Search is handled automatically via filters change
  };

  const handleReset = () => {
    dispatch(resetFilters());
  };

  const totalPages = Math.ceil(filteredPropertiesCount / resPerPage) || 1;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(setFilters({ page: newPage }));
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 1.5rem 3rem' }}>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        borderRadius: '28px',
        overflow: 'hidden',
        marginBottom: '2.5rem',
        background: 'radial-gradient(circle at 80% 20%, #064e3b 0%, #090d16 65%, #022c22 120%)',
        color: '#ffffff',
        padding: '3.8rem 2.8rem',
        boxShadow: '0 25px 40px -15px rgba(5, 150, 105, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.08) inset',
      }}>
        {/* Subtle decorative background blur glow */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(217, 119, 6, 0.12) 50%, rgba(6, 78, 59, 0) 75%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
        }}>
          {/* Left Column: Headline & Action */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.55rem',
              padding: '0.45rem 1rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(12px)',
              fontSize: '0.82rem',
              fontWeight: 800,
              color: '#34d399',
              marginBottom: '1.25rem',
              border: '1px solid rgba(52, 211, 153, 0.35)',
              boxShadow: '0 4px 15px rgba(5, 150, 105, 0.2)',
            }}>
              <Sparkles size={16} />
              <span>AI-POWERED STAYS & INSTANT ITINERARIES</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.1rem, 3.8vw, 3.2rem)',
              fontWeight: 800,
              lineHeight: 1.16,
              marginBottom: '1.2rem',
              color: '#ffffff',
              letterSpacing: '-0.03em',
            }}>
              Find Your Cozy Haven, <br />
              <span style={{
                background: 'linear-gradient(135deg, #34d399 0%, #fbbf24 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Book with Zero Date Clash.
              </span>
            </h1>

            <p style={{ fontSize: '1.02rem', color: '#cbd5e1', lineHeight: 1.65, marginBottom: '2rem', maxWidth: '540px' }}>
              Explore verified villas, mountain chalets, and heritage suites with smart date-overlap protection, transparent pricing, and instant Groq AI travel curation.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link
                to="/ai-trip-planner"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  color: '#ffffff',
                  padding: '0.85rem 1.65rem',
                  borderRadius: '14px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  boxShadow: '0 8px 24px -4px rgba(5, 150, 105, 0.45)',
                  textDecoration: 'none',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 28px -4px rgba(5, 150, 105, 0.6)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px -4px rgba(5, 150, 105, 0.45)'; }}
              >
                <Sparkles size={18} color="#fef08a" />
                Try AI Trip Planner
              </Link>
            </div>
          </div>

          {/* Right Column: Floating Glassmorphic Stay Highlights & Stats */}
          <div style={{
            background: 'linear-gradient(145deg, rgba(16, 23, 38, 0.85) 0%, rgba(6, 78, 59, 0.4) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            padding: '1.8rem',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.6px', color: '#94a3b8', fontWeight: 800 }}>
                  Curated Collection
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>
                  Handpicked Luxury
                </h3>
              </div>
              <span style={{
                padding: '0.3rem 0.75rem',
                borderRadius: '9999px',
                background: 'rgba(5, 150, 105, 0.25)',
                border: '1px solid rgba(52, 211, 153, 0.4)',
                color: '#34d399',
                fontSize: '0.78rem',
                fontWeight: 700,
              }}>
                100% Verified
              </span>
            </div>

            {/* Quick Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem', textAlign: 'center' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '0.85rem 0.5rem', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#34d399' }}>0</div>
                <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '0.2rem', fontWeight: 600 }}>Date Clashes</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '0.85rem 0.5rem', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fbbf24' }}>4.9★</div>
                <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '0.2rem', fontWeight: 600 }}>Avg Rating</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '0.85rem 0.5rem', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#38bdf8' }}>AI</div>
                <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '0.2rem', fontWeight: 600 }}>Trip Curator</div>
              </div>
            </div>

            {/* Guarantee Highlight */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              backgroundColor: 'rgba(5, 150, 105, 0.15)',
              border: '1px solid rgba(52, 211, 153, 0.25)',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              fontSize: '0.82rem',
              color: '#d1fae5',
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', flexShrink: 0 }} />
              <span>Real-time availability locking prevents double bookings instantaneously.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Filters Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {/* Header Bar for Results & View Mode Toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.75rem',
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            {filters.city ? `Stays in ${filters.city}` : 'All Available Stays'}
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Showing {properties.length} of {filteredPropertiesCount} stays matching your criteria
          </p>
        </div>

        {/* View Toggle (Grid vs Map) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--bg-subtle)',
          padding: '0.3rem',
          borderRadius: '14px',
          border: '1px solid var(--border-color)',
        }}>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.48rem 0.95rem',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: viewMode === 'grid' ? 'var(--bg-card)' : 'transparent',
              color: viewMode === 'grid' ? '#059669' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: viewMode === 'grid' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <LayoutGrid size={16} />
            Grid View
          </button>
          <button
            onClick={() => setViewMode('map')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.48rem 0.95rem',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: viewMode === 'map' ? 'var(--bg-card)' : 'transparent',
              color: viewMode === 'map' ? '#059669' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: viewMode === 'map' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <Map size={16} />
            Map View
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div style={{
          minHeight: '350px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e2e8f0',
            borderTopColor: '#0284c7',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ color: '#64748b', fontWeight: 600 }}>Filtering & verifying stay availability...</p>
        </div>
      ) : properties.length === 0 ? (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '3rem 2rem',
          textAlign: 'center',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)',
        }}>
          <AlertCircle size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
            No stays found for your search criteria
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.92rem', marginBottom: '1.5rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
            Try adjusting your dates or price filters. Stays that are already booked for those dates are hidden to prevent double-booking.
          </p>
          <button
            onClick={handleReset}
            style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              color: '#ffffff',
              padding: '0.65rem 1.25rem',
              borderRadius: '10px',
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <>
          {/* Property Cards Grid (12 per page - Slide 6) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.75rem',
            marginBottom: '3rem',
          }}>
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              marginTop: '2rem',
            }}>
              <button
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.6rem 1.15rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: currentPage <= 1 ? 'var(--bg-subtle)' : 'var(--bg-card)',
                  color: currentPage <= 1 ? 'var(--text-subtle)' : 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                  boxShadow: currentPage <= 1 ? 'none' : 'var(--shadow-sm)',
                  opacity: currentPage <= 1 ? 0.6 : 1,
                  transition: 'all 0.2s ease',
                }}
              >
                <ChevronLeft size={16} /> Previous
              </button>

              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', padding: '0 0.5rem' }}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.6rem 1.15rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: currentPage >= totalPages ? 'var(--bg-subtle)' : 'var(--bg-card)',
                  color: currentPage >= totalPages ? 'var(--text-subtle)' : 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                  boxShadow: currentPage >= totalPages ? 'none' : 'var(--shadow-sm)',
                  opacity: currentPage >= totalPages ? 0.6 : 1,
                  transition: 'all 0.2s ease',
                }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      ) : (
        /* Map View */
        <div>
          <MapView properties={properties} />
        </div>
      )}
    </div>
  );
};

export default HomePage;
