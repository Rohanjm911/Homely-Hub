import React from 'react';
import { Search, MapPin, Calendar, Home, Users, RotateCcw } from 'lucide-react';

const popularCities = ['All', 'Goa', 'Manali', 'Mumbai', 'Jaipur', 'Bengaluru', 'Kerala'];

const FilterBar = ({ filters, onFilterChange, onSearch, onReset }) => {
  const propertyTypes = ['All', 'House', 'Flat', 'Guest House', 'Hotel', 'Villa', 'Cottage'];

  return (
    <div style={{
      background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-subtle) 100%)',
      borderRadius: '26px',
      padding: '1.45rem 1.75rem',
      boxShadow: '0 12px 30px -6px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(5, 150, 105, 0.08)',
      border: '1px solid var(--border-color)',
      marginBottom: '2.5rem',
      position: 'relative',
      overflow: 'hidden',
      transition: 'background-color 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease',
    }}>
      {/* Dual-Tone Top Trim Accent */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #059669 0%, #10b981 50%, #f59e0b 100%)',
        opacity: 0.9,
      }} />

      {/* Top Filter Inputs Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))',
        gap: '0.9rem',
        alignItems: 'center',
        marginBottom: '1.25rem',
      }}>
        {/* City / Keyword */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Where
          </label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            padding: '0.65rem 0.85rem',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: '14px',
            border: '1px solid var(--border-color)',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          }}>
            <MapPin size={17} color="#059669" />
            <input
              type="text"
              placeholder="Search destination or stay"
              value={filters.keyword || ''}
              onChange={(e) => onFilterChange({ keyword: e.target.value })}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: 'var(--text-main)',
              }}
            />
          </div>
        </div>

        {/* Check-In Date */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Check In
          </label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            padding: '0.65rem 0.85rem',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: '14px',
            border: '1px solid var(--border-color)',
          }}>
            <Calendar size={17} color="#059669" />
            <input
              type="date"
              value={filters.checkIn || ''}
              onChange={(e) => onFilterChange({ checkIn: e.target.value })}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: 'var(--text-main)',
              }}
            />
          </div>
        </div>

        {/* Check-Out Date */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Check Out
          </label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            padding: '0.65rem 0.85rem',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: '14px',
            border: '1px solid var(--border-color)',
          }}>
            <Calendar size={17} color="#059669" />
            <input
              type="date"
              value={filters.checkOut || ''}
              onChange={(e) => onFilterChange({ checkOut: e.target.value })}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: 'var(--text-main)',
              }}
            />
          </div>
        </div>

        {/* Property Type Dropdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Property Type
          </label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            padding: '0.65rem 0.85rem',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: '14px',
            border: '1px solid var(--border-color)',
          }}>
            <Home size={17} color="#059669" />
            <select
              value={filters.propertyType || ''}
              onChange={(e) => onFilterChange({ propertyType: e.target.value === 'All' ? '' : e.target.value })}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: 'var(--text-main)',
                cursor: 'pointer',
              }}
            >
              {propertyTypes.map((type) => (
                <option key={type} value={type === 'All' ? '' : type} style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Max Budget Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Max Price / Night
          </label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            padding: '0.65rem 0.85rem',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: '14px',
            border: '1px solid var(--border-color)',
          }}>
            <span style={{ fontWeight: 800, color: '#059669', fontSize: '0.95rem' }}>₹</span>
            <input
              type="number"
              placeholder="Max budget (₹)"
              value={filters.maxPrice || ''}
              onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: 'var(--text-main)',
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.6rem', height: '100%', marginTop: 'auto' }}>
          <button
            onClick={onSearch}
            aria-label="Filter stays"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.72rem 1.25rem',
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '14px',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(5, 150, 105, 0.35)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseOver={(e) => { e.currentTarget.style.boxShadow = '0 6px 18px rgba(5, 150, 105, 0.45)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(5, 150, 105, 0.35)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <Search size={16} strokeWidth={2.5} />
            Search
          </button>
          <button
            onClick={onReset}
            title="Reset Filters"
            aria-label="Reset all search filters"
            style={{
              padding: '0.72rem',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-color)',
              borderRadius: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s ease, color 0.15s ease, transform 0.15s ease',
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.transform = 'rotate(-20deg)'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.transform = 'rotate(0deg)'; }}
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* City Quick Chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', paddingTop: '0.85rem', borderTop: '1px solid var(--border-color)' }}>
        <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Top Spots:
        </span>
        {popularCities.map((city) => {
          const isSelected = (city === 'All' && !filters.city) || filters.city === city;
          return (
            <button
              key={city}
              onClick={() => onFilterChange({ city: city === 'All' ? '' : city })}
              style={{
                fontSize: '0.8rem',
                fontWeight: isSelected ? 700 : 600,
                padding: '0.35rem 0.95rem',
                borderRadius: '9999px',
                border: isSelected ? '1px solid #059669' : '1px solid var(--border-color)',
                backgroundColor: isSelected ? '#059669' : 'var(--bg-subtle)',
                color: isSelected ? '#ffffff' : 'var(--text-main)',
                cursor: 'pointer',
                boxShadow: isSelected ? '0 2px 8px rgba(5, 150, 105, 0.3)' : 'none',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseOver={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'var(--border-color)';
                }
              }}
              onMouseOut={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                }
              }}
            >
              {city}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterBar;
