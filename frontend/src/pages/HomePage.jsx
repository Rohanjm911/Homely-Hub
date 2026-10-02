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
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        marginBottom: '2.5rem',
        background: 'radial-gradient(ellipse at top, #1c1c1e 0%, #000000 100%)',
        color: '#f5f5f7',
        padding: '4rem 3rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 24px 50px -15px rgba(0, 0, 0, 0.5)',
      }}>
        {/* Subtle diffuse ambient lighting */}
        <div
          className="ambient-glow-mesh"
          style={{
            position: 'absolute',
            top: '-30%',
            right: '-10%',
            width: '520px',
            height: '520px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 113, 227, 0.22) 0%, rgba(88, 86, 214, 0.1) 40%, transparent 70%)',
            filter: 'blur(70px)',
            pointerEvents: 'none',
          }}
        />

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
              padding: '0.35rem 0.95rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(12px)',
              fontSize: '0.76rem',
              fontWeight: 600,
              color: '#86868b',
              marginBottom: '1.25rem',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              letterSpacing: '0.04em',
            }}>
              <Sparkles size={14} color="var(--primary)" />
              <span style={{ color: '#f5f5f7' }}>SEAMLESS PROPERTY DISCOVERY</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.3rem, 4vw, 3.3rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: '1.2rem',
              color: '#f5f5f7',
              letterSpacing: '-0.04em',
            }}>
              Connecting Verified <br />
              <span style={{
                background: 'linear-gradient(180deg, #ffffff 0%, #86868b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Owners and Tenants.
              </span>
            </h1>

            <p style={{ fontSize: '1.02rem', color: '#a1a1a6', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '540px', fontWeight: 400 }}>
              Seamless property discovery connecting verified owners and tenants with atomic date-overlap protection and effortless AI travel curation.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
              <Link
                to="/ai-trip-planner"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  background: '#0071e3',
                  color: '#ffffff',
                  padding: '0.75rem 1.45rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 500,
                  fontSize: '0.92rem',
                  textDecoration: 'none',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: '0 4px 14px rgba(0, 113, 227, 0.3)',
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#0077ed'; e.currentTarget.style.transform = 'scale(1.02)'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#0071e3'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <Sparkles size={16} />
                Explore AI Planner
              </Link>
            </div>
          </div>

          {/* Right Column: Precision Glass Highlights Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            padding: '2rem',
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.4rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1.1rem' }}>
              <div>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#86868b', fontWeight: 600 }}>
                  Engineered Comfort
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f5f5f7', marginTop: '0.2rem', letterSpacing: '-0.02em' }}>
                  Handpicked Stays
                </h3>
              </div>
              <span style={{
                padding: '0.3rem 0.8rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#f5f5f7',
                fontSize: '0.75rem',
                fontWeight: 500,
              }}>
                Verified Quality
              </span>
            </div>

            {/* Quick Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', textAlign: 'center' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '0.9rem 0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.02em' }}>0</div>
                <div style={{ fontSize: '0.72rem', color: '#86868b', marginTop: '0.2rem', fontWeight: 500 }}>Clash Rate</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '0.9rem 0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#2997ff', letterSpacing: '-0.02em' }}>4.9★</div>
                <div style={{ fontSize: '0.72rem', color: '#86868b', marginTop: '0.2rem', fontWeight: 500 }}>Avg Rating</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '0.9rem 0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#34c759', letterSpacing: '-0.02em' }}>100%</div>
                <div style={{ fontSize: '0.72rem', color: '#86868b', marginTop: '0.2rem', fontWeight: 500 }}>Instant Confirm</div>
              </div>
            </div>

            {/* Subtle verification pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem 1rem',
              fontSize: '0.8rem',
              color: '#a1a1a6',
            }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#34c759', flexShrink: 0 }} />
              <span>Real-time availability lock with atomic reservations</span>
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
          <h2 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            {filters.city ? `Stays in ${filters.city}` : 'All Available Stays'}
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Showing {properties.length} of {filteredPropertiesCount} properties
          </p>
        </div>

        {/* View Toggle (Grid vs Map) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--input-bg)',
          padding: '0.25rem',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-color)',
        }}>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.9rem',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              backgroundColor: viewMode === 'grid' ? 'var(--bg-card-solid)' : 'transparent',
              color: viewMode === 'grid' ? 'var(--text-main)' : 'var(--text-muted)',
              fontWeight: 500,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: viewMode === 'grid' ? 'var(--shadow-xs)' : 'none',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <LayoutGrid size={15} />
            Grid
          </button>
          <button
            onClick={() => setViewMode('map')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.9rem',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              backgroundColor: viewMode === 'map' ? 'var(--bg-card-solid)' : 'transparent',
              color: viewMode === 'map' ? 'var(--text-main)' : 'var(--text-muted)',
              fontWeight: 500,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: viewMode === 'map' ? 'var(--shadow-xs)' : 'none',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <Map size={15} />
            Map
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
            border: '3px solid var(--border-color)',
            borderTopColor: '#d97706',
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
                  padding: '0.55rem 1.1rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: currentPage <= 1 ? 'transparent' : 'var(--bg-card-solid)',
                  color: currentPage <= 1 ? 'var(--text-subtle)' : 'var(--text-main)',
                  fontWeight: 500,
                  fontSize: '0.84rem',
                  cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                  opacity: currentPage <= 1 ? 0.4 : 1,
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <ChevronLeft size={15} /> Previous
              </button>

              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', padding: '0 0.5rem' }}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.55rem 1.1rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: currentPage >= totalPages ? 'transparent' : 'var(--bg-card-solid)',
                  color: currentPage >= totalPages ? 'var(--text-subtle)' : 'var(--text-main)',
                  fontWeight: 500,
                  fontSize: '0.84rem',
                  cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                  opacity: currentPage >= totalPages ? 0.4 : 1,
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                Next <ChevronRight size={15} />
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
