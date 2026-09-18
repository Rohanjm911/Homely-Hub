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
        background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-subtle) 100%)',
        borderRadius: '22px',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        transition: 'transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.32s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease',
        boxShadow: 'var(--shadow-md)',
        position: 'relative',
      }}
      className="card-hover-effect"
    >
      {/* Image Carousel Container */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '66%', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
        <img
          src={images[currentImgIndex]}
          alt={property.title}
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
            transition: 'transform 0.5s ease',
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
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
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            border: 'none',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 2,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
            transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.88)'; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <Heart
            size={17}
            color={isFavorite ? '#f43f5e' : '#334155'}
            fill={isFavorite ? '#f43f5e' : 'none'}
          />
        </button>

        {/* Property Type Badge */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          color: '#ffffff',
          fontSize: '0.72rem',
          fontWeight: 700,
          padding: '0.28rem 0.7rem',
          borderRadius: '9999px',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          zIndex: 2,
          border: '1px solid rgba(255, 255, 255, 0.2)',
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
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(6px)',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 2,
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
              }}
            >
              <ChevronLeft size={16} color="#0f172a" />
            </button>
            <button
              onClick={nextImage}
              aria-label="Next photo"
              style={{
                position: 'absolute',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(6px)',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 2,
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
              }}
            >
              <ChevronRight size={16} color="#0f172a" />
            </button>

            {/* Dots */}
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '5px',
              zIndex: 2,
              padding: '3px 6px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              backdropFilter: 'blur(4px)',
            }}>
              {images.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === currentImgIndex ? '14px' : '5px',
                    height: '5px',
                    borderRadius: '3px',
                    backgroundColor: i === currentImgIndex ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                    transition: 'all 0.25s ease',
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Card Body */}
      <div style={{ padding: '1.15rem' }}>
        {/* City & Rating */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            <MapPin size={14} color="#059669" />
            <span>{property.city}, {property.country || 'India'}</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#d97706',
            backgroundColor: 'rgba(217, 119, 6, 0.12)',
            padding: '0.2rem 0.5rem',
            borderRadius: '8px',
            border: '1px solid rgba(217, 119, 6, 0.25)'
          }}>
            <Star size={13} color="#d97706" fill="#d97706" />
            <span style={{ color: 'var(--text-main)', fontWeight: 800 }}>{property.rating?.toFixed(2) || '4.85'}</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              ({property.numReviews || 12})
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '1.02rem',
          fontWeight: 700,
          color: 'var(--text-main)',
          marginBottom: '0.6rem',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          letterSpacing: '-0.01em',
        }}>
          {property.title}
        </h3>

        {/* Capacity Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.9rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', backgroundColor: 'var(--bg-subtle)', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
            <Users size={13} color="var(--text-muted)" /> {property.maxGuests} guests
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', backgroundColor: 'var(--bg-subtle)', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
            <Bed size={13} color="var(--text-muted)" /> {property.bedrooms} bed{property.bedrooms > 1 ? 's' : ''}
          </span>
        </div>

        {/* Price */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#059669', letterSpacing: '-0.02em' }}>
              ₹{property.pricePerNight?.toLocaleString()}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}> / night</span>
          </div>
          <span style={{
            fontSize: '0.74rem',
            color: '#059669',
            fontWeight: 700,
            background: 'rgba(5, 150, 105, 0.12)',
            border: '1px solid rgba(5, 150, 105, 0.25)',
            padding: '0.2rem 0.55rem',
            borderRadius: '9999px'
          }}>
            Free cancellation
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
