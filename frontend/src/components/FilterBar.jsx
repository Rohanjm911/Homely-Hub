import React from 'react';
import { Search, MapPin, Calendar, Home, Users, RotateCcw, Palmtree, Mountain, Building2, Trees, Sparkles, Compass } from 'lucide-react';

const popularCities = ['All', 'Goa', 'Manali', 'Mumbai', 'Jaipur', 'Bengaluru', 'Kerala'];

const categories = [
  { id: '', label: 'All Stays', icon: Compass },
  { id: 'Villa', label: 'Villas', icon: Palmtree },
  { id: 'Cottage', label: 'Cottages', icon: Mountain },
  { id: 'Flat', label: 'Apartments', icon: Building2 },
  { id: 'Guest House', label: 'Guest Houses', icon: Trees },
  { id: 'Hotel', label: 'Luxury Hotels', icon: Sparkles },
  { id: 'House', label: 'Independent Homes', icon: Home },
];

const FilterBar = ({ filters, onFilterChange, onSearch, onReset }) => {
  const propertyTypes = ['All', 'House', 'Flat', 'Guest House', 'Hotel', 'Villa', 'Cottage'];

  return (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-xl)',
      padding: '1.25rem 1.5rem',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid var(--border-color)',
      marginBottom: '2rem',
      position: 'relative',
      backdropFilter: 'saturate(180%) blur(20px)',
      WebkitBackdropFilter: 'saturate(180%) blur(20px)',
      transition: 'background-color 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease',
    }}>
      {/* Category Segment Strip */}
      <div className="category-pills-bar" style={{ marginBottom: '1.1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = (cat.id === '' && !filters.propertyType) || filters.propertyType === cat.id;
          return (
            <button
              key={cat.label}
              type="button"
              className={`category-pill-item ${isActive ? 'active' : ''}`}
              onClick={() => onFilterChange({ propertyType: cat.id })}
              aria-label={`Filter by ${cat.label}`}
            >
              <Icon size={15} strokeWidth={isActive ? 2.2 : 1.8} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter Inputs Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
        gap: '0.75rem',
        alignItems: 'center',
        marginBottom: '1rem',
      }}>
        {/* City / Keyword */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Where
          </label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 0.8rem',
            backgroundColor: 'var(--input-bg)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          }}>
            <MapPin size={15} color="var(--primary)" />
            <input
              type="text"
              placeholder="Search destination"
              value={filters.keyword || ''}
              onChange={(e) => onFilterChange({ keyword: e.target.value })}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.86rem',
                fontWeight: 500,
                color: 'var(--text-main)',
              }}
            />
          </div>
        </div>

        {/* Check-In Date */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Check In
          </label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 0.8rem',
            backgroundColor: 'var(--input-bg)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
          }}>
            <Calendar size={15} color="var(--primary)" />
            <input
              type="date"
              value={filters.checkIn || ''}
              onChange={(e) => onFilterChange({ checkIn: e.target.value })}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.86rem',
                fontWeight: 500,
                color: 'var(--text-main)',
              }}
            />
          </div>
        </div>

        {/* Check-Out Date */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Check Out
          </label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 0.8rem',
            backgroundColor: 'var(--input-bg)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
          }}>
            <Calendar size={15} color="var(--primary)" />
            <input
              type="date"
              value={filters.checkOut || ''}
              onChange={(e) => onFilterChange({ checkOut: e.target.value })}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.86rem',
                fontWeight: 500,
                color: 'var(--text-main)',
              }}
            />
          </div>
        </div>

        {/* Property Type Dropdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Property Type
          </label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 0.8rem',
            backgroundColor: 'var(--input-bg)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
          }}>
            <Home size={15} color="var(--primary)" />
            <select
              value={filters.propertyType || ''}
              onChange={(e) => onFilterChange({ propertyType: e.target.value === 'All' ? '' : e.target.value })}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.86rem',
                fontWeight: 500,
                color: 'var(--text-main)',
                cursor: 'pointer',
              }}
            >
              {propertyTypes.map((type) => (
                <option key={type} value={type === 'All' ? '' : type} style={{ backgroundColor: 'var(--bg-card-solid)', color: 'var(--text-main)' }}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Max Budget Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Max Price / Night
          </label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 0.8rem',
            backgroundColor: 'var(--input-bg)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
          }}>
            <span style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '0.9rem' }}>₹</span>
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
                fontSize: '0.86rem',
                fontWeight: 500,
                color: 'var(--text-main)',
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '100%', marginTop: 'auto' }}>
          <button
            onClick={onSearch}
            aria-label="Filter stays"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              padding: '0.65rem 1.15rem',
              background: 'var(--primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.88rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary-hover)'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary)'; }}
          >
            <Search size={15} strokeWidth={2.2} />
            Search
          </button>
          <button
            onClick={onReset}
            title="Reset Filters"
            aria-label="Reset all search filters"
            style={{
              padding: '0.65rem',
              backgroundColor: 'var(--input-bg)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s ease, color 0.2s ease',
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-main)'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'var(--input-bg)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* City Segment Chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Top Destinations:
        </span>
        {popularCities.map((city) => {
          const isSelected = (city === 'All' && !filters.city) || filters.city === city;
          return (
            <button
              key={city}
              onClick={() => onFilterChange({ city: city === 'All' ? '' : city })}
              style={{
                fontSize: '0.78rem',
                fontWeight: isSelected ? 600 : 400,
                padding: '0.3rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                border: isSelected ? '1px solid var(--text-main)' : '1px solid var(--border-color)',
                backgroundColor: isSelected ? 'var(--text-main)' : 'transparent',
                color: isSelected ? 'var(--bg-main)' : 'var(--text-main)',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseOver={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'var(--input-bg)';
                }
              }}
              onMouseOut={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'transparent';
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
