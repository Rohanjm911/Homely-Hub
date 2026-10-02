import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Users, Bed, ChevronLeft, ChevronRight, Heart } from 'lucide-react';

const PropertyCard = ({ property }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const images = property.images && property.images.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop&q=80'];

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Link
      to={`/properties/${property._id}`}
      style={{
        display: 'block',
        textDecoration: 'none',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)',
        position: 'relative',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
      className="card-hover-effect property-card-wrapper"
    >
      {/* Image Carousel Container */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '68%', overflow: 'hidden', backgroundColor: 'var(--bg-subtle)' }}>
        <img
          src={images[currentImgIndex]}
          alt={property.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80';
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.04)'; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1.0)'; }}
        />

        {/* Favorite Heart Button */}
        <button
          onClick={toggleFavorite}
          aria-label="Save stay to favorites"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 2,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.9)'; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <Heart
            size={15}
            color={isFavorite ? '#ff3b30' : '#1d1d1f'}
            fill={isFavorite ? '#ff3b30' : 'none'}
          />
        </button>

        {/* Property Type Badge */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          color: '#ffffff',
          fontSize: '0.68rem',
          fontWeight: 600,
          padding: '0.25rem 0.65rem',
          borderRadius: 'var(--radius-full)',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          zIndex: 2,
          border: '1px solid rgba(255, 255, 255, 0.15)',
        }}>
          {property.propertyType}
        </div>

        {/* Carousel Prev/Next Arrows (if multiple images) */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              aria-label="Previous photo"
              style={{
                position: 'absolute',
                top: '50%',
                left: '10px',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: 'none',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 2,
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)',
              }}
            >
              <ChevronLeft size={15} color="#1d1d1f" />
            </button>
            <button
              onClick={nextImage}
              aria-label="Next photo"
              style={{
                position: 'absolute',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: 'none',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 2,
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)',
              }}
            >
              <ChevronRight size={15} color="#1d1d1f" />
            </button>

            {/* Dots */}
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '4px',
              zIndex: 2,
              padding: '2px 5px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(8px)',
            }}>
              {images.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === currentImgIndex ? '12px' : '4px',
                    height: '4px',
                    borderRadius: '2px',
                    backgroundColor: i === currentImgIndex ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
                    transition: 'all 0.2s ease',
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Card Body */}
      <div style={{ padding: '1rem 1.15rem 1.15rem' }}>
        {/* City & Rating */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            <MapPin size={13} color="var(--primary)" />
            <span>{property.city}, {property.country || 'India'}</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--text-main)',
          }}>
            <Star size={13} color="#f5a623" fill="#f5a623" />
            <span>{property.rating?.toFixed(2) || '4.85'}</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>
              ({property.numReviews || 12})
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '0.98rem',
          fontWeight: 600,
          color: 'var(--text-main)',
          marginBottom: '0.5rem',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          letterSpacing: '-0.015em',
        }}>
          {property.title}
        </h3>

        {/* Capacity Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: 'var(--input-bg)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-xs)' }}>
            <Users size={12} color="var(--text-muted)" /> {property.maxGuests} guests
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: 'var(--input-bg)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-xs)' }}>
            <Bed size={12} color="var(--text-muted)" /> {property.bedrooms} bed{property.bedrooms > 1 ? 's' : ''}
          </span>
        </div>

        {/* Price Lockup */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              ₹{property.pricePerNight?.toLocaleString()}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 400 }}> / night</span>
          </div>
          <span style={{
            fontSize: '0.72rem',
            color: 'var(--primary)',
            fontWeight: 500,
            background: 'var(--primary-light)',
            padding: '0.2rem 0.55rem',
            borderRadius: 'var(--radius-full)'
          }}>
            Instant lock
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
