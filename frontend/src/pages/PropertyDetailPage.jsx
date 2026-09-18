import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPropertyDetails, clearPropertyDetails } from '../features/properties/propertySlice';
import { createBooking, resetBookingStatus } from '../features/bookings/bookingSlice';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import {
  Star,
  MapPin,
  Users,
  Bed,
  Bath,
  Clock,
  ShieldCheck,
  Sparkles,
  Wifi,
  Coffee,
  Tv,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Phone,
  Mail,
  User,
  FileText,
  X,
  CreditCard,
  Lock,
} from 'lucide-react';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { property, detailsLoading, error } = useSelector((state) => state.properties);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { loading: bookingLoading, createSuccess, error: bookingError, currentBooking } = useSelector((state) => state.bookings);

  // Reservation form dates
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const defaultCheckout = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [checkInDate, setCheckInDate] = useState(tomorrow);
  const [checkOutDate, setCheckOutDate] = useState(defaultCheckout);
  const [guests, setGuests] = useState(2);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Guest Details Confirmation Modal State (Multi-step verification before booking)
  const [showGuestDetailsModal, setShowGuestDetailsModal] = useState(false);
  const [guestFullName, setGuestFullName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestGovtId, setGuestGovtId] = useState('');
  const [guestPurpose, setGuestPurpose] = useState('Vacation / Leisure');
  const [guestSpecialRequests, setGuestSpecialRequests] = useState('');
  const [guestDetailsError, setGuestDetailsError] = useState('');

  // Pre-fill from logged-in user profile
  useEffect(() => {
    if (user) {
      if (!guestFullName) setGuestFullName(user.name || '');
      if (!guestEmail) setGuestEmail(user.email || '');
      if (!guestPhone && user.phone) setGuestPhone(user.phone || '');
    }
  }, [user]);

  useEffect(() => {
    dispatch(fetchPropertyDetails(id));
    return () => {
      dispatch(clearPropertyDetails());
      dispatch(resetBookingStatus());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (createSuccess) {
      setShowSuccessModal(true);
    }
  }, [createSuccess]);

  if (detailsLoading || !property) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#0284c7', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: '#64748b', fontWeight: 600 }}>Loading property details...</p>
      </div>
    );
  }

  // Calculate nights and price
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  const diffTime = end.getTime() - start.getTime();
  const nights = diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;

  const cleaningFee = property.cleaningFee || 500;
  const serviceFee = property.serviceFee || 300;
  const baseTotal = nights * property.pricePerNight;
  const grandTotal = baseTotal + cleaningFee + serviceFee;

  // OVERLAP CHECK (Challenges Faced & Safe Booking Flow - Slide 4, 8 & 9)
  // Clash = existing start < my check-out AND existing end > my check-in
  const hasOverlap = (property.currentBookings || []).some((booking) => {
    const existingStart = new Date(booking.checkInDate);
    const existingEnd = new Date(booking.checkOutDate);
    return existingStart < end && existingEnd > start;
  });

  // Step 1: User clicks "Proceed to Guest Details" from the dates widget
  const handleProceedToGuestDetails = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/properties/${id}` } } });
      return;
    }

    if (nights <= 0) {
      alert('Check-out date must be after check-in date');
      return;
    }

    if (hasOverlap) {
      alert('Selected dates clash with an existing booking. Please pick alternative dates.');
      return;
    }

    setGuestDetailsError('');
    setShowGuestDetailsModal(true);
  };

  // Step 2: User completes guest information and confirms reservation
  const handleConfirmFinalBooking = async (e) => {
    e.preventDefault();
    if (!guestFullName.trim()) {
      setGuestDetailsError('Please provide your full legal name');
      return;
    }
    if (!guestEmail.trim()) {
      setGuestDetailsError('Please enter a valid email address');
      return;
    }
    if (!guestPhone.trim() || guestPhone.trim().length < 8) {
      setGuestDetailsError('Please enter a valid phone number (minimum 8 digits)');
      return;
    }

    setGuestDetailsError('');
    setShowGuestDetailsModal(false);

    dispatch(
      createBooking({
        propertyId: property._id,
        checkInDate,
        checkOutDate,
        guests: Number(guests),
        guestDetails: {
          fullName: guestFullName.trim(),
          email: guestEmail.trim(),
          phone: guestPhone.trim(),
          governmentId: guestGovtId.trim(),
          purposeOfStay: guestPurpose,
          specialRequests: guestSpecialRequests.trim(),
        },
        paymentInfo: {
          id: `ORD_${Date.now()}`,
          status: 'Paid',
          method: 'Card / UPI Simulation',
        },
      })
    );
  };

  const images = property.images && property.images.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200'];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 1.5rem 4rem' }}>
      {/* Back link */}
      <Link
        to="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.9rem',
          fontWeight: 600,
          color: '#64748b',
          marginBottom: '1.25rem',
          textDecoration: 'none',
        }}
      >
        <ArrowLeft size={16} /> Back to explore stays
      </Link>

      {/* Header Info */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.3rem)', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
          {property.title}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.9rem', color: '#64748b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 700, color: '#0f172a' }}>
            <Star size={16} color="#f59e0b" fill="#f59e0b" />
            <span>{property.rating?.toFixed(2) || '4.85'}</span>
            <span style={{ color: '#64748b', fontWeight: 500 }}>({property.numReviews || 12} reviews)</span>
          </div>
          <span>•</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#0284c7', fontWeight: 600 }}>
            <MapPin size={16} />
            <span>{property.address}, {property.city}, {property.country || 'India'}</span>
          </div>
          <span>•</span>
          <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '0.2rem 0.65rem', borderRadius: '9999px', fontWeight: 700, fontSize: '0.78rem' }}>
            {property.propertyType} ({property.roomType || 'Entire place'})
          </span>
        </div>
      </div>

      {/* Image Gallery */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: images.length > 1 ? '2.2fr 1fr' : '1fr',
        gap: '0.85rem',
        borderRadius: '24px',
        overflow: 'hidden',
        height: '480px',
        marginBottom: '2.5rem',
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08)',
      }}>
        <div style={{ height: '100%', overflow: 'hidden', position: 'relative' }}>
          <img
            src={images[0]}
            alt={property.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80';
            }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1.0)'; }}
          />
        </div>
        {images.length > 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', height: '100%' }}>
            {images.slice(1, 3).map((img, idx) => (
              <div key={idx} style={{ height: 'calc(50% - 0.425rem)', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={img}
                  alt={`Stay photo ${idx + 2}`}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80';
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.04)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1.0)'; }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Two-Column Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1.1fr)',
        gap: '3rem',
        alignItems: 'start',
      }}>
        {/* Left Column: Details, Amenities, Location Map */}
        <div>
          {/* Host Card */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid var(--border-color)',
            marginBottom: '1.5rem',
          }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Hosted by {property.owner?.name || 'Verified Host'}
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                {property.maxGuests} guests • {property.bedrooms} bedroom{property.bedrooms > 1 ? 's' : ''} • {property.bathrooms} bathroom{property.bathrooms > 1 ? 's' : ''}
              </p>
            </div>
            <img
              src={property.owner?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(property.owner?.name || 'Host')}`}
              alt={property.owner?.name}
              style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #059669' }}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
              About this place
            </h3>
            <p style={{ fontSize: '0.98rem', color: 'var(--text-muted)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
              {property.description}
            </p>
          </div>

          {/* Amenities Grid */}
          <div style={{ paddingBottom: '2rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
              What this place offers
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.85rem' }}>
              {property.amenities?.map((amenity, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: 'var(--text-main)',
                    padding: '0.7rem 0.95rem',
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <CheckCircle size={16} color="#059669" />
                  <span style={{ color: 'var(--text-main)' }}>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Leaflet Map Section */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              Where you will be
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1rem' }}>
              {property.address}, {property.city}, {property.state}, {property.country}
            </p>
            <div style={{ height: '320px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
              <MapContainer
                center={[property.location?.lat || 18.922, property.location?.lng || 72.834]}
                zoom={14}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[property.location?.lat || 18.922, property.location?.lng || 72.834]}>
                  <Popup>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{property.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{property.address}</div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Reservation & Overlap Guard Box */}
        <div style={{
          position: 'sticky',
          top: '90px',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '24px',
          padding: '1.75rem',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-xl)',
          transition: 'background-color 0.35s ease, border-color 0.35s ease',
        }}>
          {/* Nightly Rate */}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669', letterSpacing: '-0.02em' }}>
                ₹{property.pricePerNight?.toLocaleString()}
              </span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}> / night</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.88rem', fontWeight: 700 }}>
              <Star size={15} fill="#d97706" color="#d97706" />
              <span style={{ color: 'var(--text-main)', fontWeight: 800 }}>{property.rating?.toFixed(2) || '4.85'}</span>
            </div>
          </div>

            {/* Form */}
          <form onSubmit={handleProceedToGuestDetails}>
            <div style={{ border: '1px solid var(--border-color)', borderRadius: '14px', overflow: 'hidden', marginBottom: '1rem', backgroundColor: 'var(--bg-subtle)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ padding: '0.65rem 0.85rem', borderRight: '1px solid var(--border-color)' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    CHECK-IN
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    required
                    style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}
                  />
                </div>
                <div style={{ padding: '0.65rem 0.85rem' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    CHECKOUT
                  </label>
                  <input
                    type="date"
                    min={checkInDate || today}
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    required
                    style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}
                  />
                </div>
              </div>
              <div style={{ padding: '0.65rem 0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  GUESTS
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer' }}
                >
                  {Array.from({ length: property.maxGuests || 4 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num} style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}>
                      {num} guest{num > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Currently Reserved Date Windows */}
            {property.currentBookings && property.currentBookings.length > 0 && (
              <div style={{
                marginBottom: '1rem',
                padding: '0.75rem',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                fontSize: '0.78rem',
              }}>
                <div style={{ fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={13} color="#059669" />
                  Already Booked Dates:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {property.currentBookings.map((b, idx) => {
                    const inStr = new Date(b.checkInDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
                    const outStr = new Date(b.checkOutDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
                    return (
                      <span
                        key={idx}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(244, 63, 94, 0.1)',
                          color: '#e11d48',
                          fontWeight: 700,
                          fontSize: '0.73rem',
                          border: '1px solid rgba(244, 63, 94, 0.2)',
                        }}
                      >
                        {inStr} → {outStr}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Overlap Warning Alert (Slide 8 & 9) */}
            {hasOverlap && (
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.6rem',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '12px',
                padding: '0.85rem',
                marginBottom: '1rem',
                color: '#b91c1c',
                fontSize: '0.82rem',
                lineHeight: 1.45,
              }}>
                <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
                <div>
                  <strong>Overlap Detected:</strong> These dates overlap with an existing guest reservation. Please choose different dates above.
                </div>
              </div>
            )}

            {/* Price breakdown */}
            {nights > 0 && !hasOverlap && (
              <div style={{ marginBottom: '1.25rem', fontSize: '0.88rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>₹{property.pricePerNight?.toLocaleString()} x {nights} night{nights > 1 ? 's' : ''}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>₹{baseTotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Cleaning fee</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>₹{cleaningFee}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>HomelyHub service fee</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>₹{serviceFee}</span>
                </div>
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.65rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                  <span>Total before taxes</span>
                  <span style={{ color: '#059669' }}>₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={bookingLoading || hasOverlap || nights <= 0}
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '14px',
                border: 'none',
                background: hasOverlap || nights <= 0
                  ? 'var(--bg-subtle)'
                  : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                color: hasOverlap || nights <= 0 ? 'var(--text-muted)' : '#ffffff',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: hasOverlap || nights <= 0 ? 'not-allowed' : 'pointer',
                boxShadow: hasOverlap ? 'none' : '0 4px 14px rgba(5, 150, 105, 0.4)',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                if (!hasOverlap && nights > 0) {
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(5, 150, 105, 0.5)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseOut={(e) => {
                if (!hasOverlap && nights > 0) {
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(5, 150, 105, 0.4)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {bookingLoading
                ? 'Securing Reservation...'
                : hasOverlap
                ? 'Unavailable for Selected Dates'
                : 'Continue to Guest Details →'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              🔒 Protected by safe booking & zero double-booking algorithm
            </div>
          </form>
        </div>
      </div>

      {/* Booking Success Modal */}
      {showSuccessModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '1.5rem',
        }}>
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '24px',
            maxWidth: '480px',
            width: '100%',
            padding: '2.2rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--border-color)',
            transition: 'all 0.3s ease',
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(5, 150, 105, 0.15)',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              border: '1px solid rgba(5, 150, 105, 0.3)',
            }}>
              <CheckCircle size={36} />
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Booking Confirmed!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Your stay at <strong style={{ color: 'var(--text-main)' }}>{property.title}</strong> has been secured and the selected dates are now locked on the house.
            </p>

            <div style={{
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: '16px',
              padding: '1.15rem',
              textAlign: 'left',
              marginBottom: '1.75rem',
              fontSize: '0.88rem',
              border: '1px solid var(--border-color)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Dates:</span>
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{checkInDate} → {checkOutDate} ({nights} nights)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Guests:</span>
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{guests} Guests</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Order / Payment ID:</span>
                <span style={{ fontWeight: 700, color: '#059669' }}>{currentBooking?.paymentInfo?.id || 'TXN_CONFIRMED'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', fontSize: '1rem' }}>
                <span style={{ color: 'var(--text-main)' }}>Total Paid:</span>
                <span style={{ color: '#059669' }}>₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/my-bookings');
                }}
                style={{
                  flex: 1,
                  padding: '0.75rem 1.25rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(5, 150, 105, 0.4)',
                  transition: 'all 0.2s ease',
                }}
              >
                View in My Trips
              </button>
              <button
                onClick={() => setShowSuccessModal(false)}
                style={{
                  padding: '0.75rem 1.35rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GUEST DETAILS CONFIRMATION MODAL (Step 2: Collect full guest info before final booking) */}
      {showGuestDetailsModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2100,
            padding: '1rem',
          }}
          onClick={() => setShowGuestDetailsModal(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: '24px',
              maxWidth: '560px',
              width: '100%',
              padding: '2rem 2.2rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
              border: '1px solid var(--border-color)',
              maxHeight: '90vh',
              overflowY: 'auto',
              animation: 'modalSlideUp 0.25s ease-out forwards',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  color: '#059669',
                  backgroundColor: 'rgba(5, 150, 105, 0.12)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  marginBottom: '0.35rem',
                }}>
                  <ShieldCheck size={13} />
                  <span>Step 2 of 2: Guest Details & Verification</span>
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                  Provide Guest Information
                </h3>
              </div>
              <button
                onClick={() => setShowGuestDetailsModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '0.35rem',
                  borderRadius: '8px',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Summary Banner */}
            <div style={{
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '0.9rem 1.15rem',
              marginBottom: '1.25rem',
              fontSize: '0.85rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.92rem' }}>{property.title}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '2px' }}>
                  {checkInDate} → {checkOutDate} • {nights} night{nights > 1 ? 's' : ''} • {guests} guest{guests > 1 ? 's' : ''}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Due</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#059669' }}>₹{grandTotal.toLocaleString()}</div>
              </div>
            </div>

            {/* Validation Error Banner */}
            {guestDetailsError && (
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                fontSize: '0.84rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem',
              }}>
                <AlertTriangle size={16} />
                <span>{guestDetailsError}</span>
              </div>
            )}

            {/* Guest Details Form */}
            <form onSubmit={handleConfirmFinalBooking}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
                {/* Full Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                    Primary Guest Full Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={guestFullName}
                      onChange={(e) => setGuestFullName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.85rem 0.75rem 2.4rem',
                        borderRadius: '12px',
                        border: '1.5px solid var(--border-color)',
                        backgroundColor: 'var(--bg-main)',
                        color: 'var(--text-main)',
                        fontSize: '0.88rem',
                        outline: 'none',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>
                </div>

                {/* Email & Phone Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                      Email Address <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="email"
                        required
                        placeholder="guest@example.com"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem 0.85rem 0.75rem 2.4rem',
                          borderRadius: '12px',
                          border: '1.5px solid var(--border-color)',
                          backgroundColor: 'var(--bg-main)',
                          color: 'var(--text-main)',
                          fontSize: '0.88rem',
                          outline: 'none',
                          fontFamily: 'inherit',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                      Phone / Mobile <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem 0.85rem 0.75rem 2.4rem',
                          borderRadius: '12px',
                          border: '1.5px solid var(--border-color)',
                          backgroundColor: 'var(--bg-main)',
                          color: 'var(--text-main)',
                          fontSize: '0.88rem',
                          outline: 'none',
                          fontFamily: 'inherit',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Government ID & Purpose of Stay */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                      Govt ID Number (Aadhaar / Passport)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <FileText size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        placeholder="e.g. 5432 1098 7654"
                        value={guestGovtId}
                        onChange={(e) => setGuestGovtId(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem 0.85rem 0.75rem 2.4rem',
                          borderRadius: '12px',
                          border: '1.5px solid var(--border-color)',
                          backgroundColor: 'var(--bg-main)',
                          color: 'var(--text-main)',
                          fontSize: '0.88rem',
                          outline: 'none',
                          fontFamily: 'inherit',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                      Purpose of Visit
                    </label>
                    <select
                      value={guestPurpose}
                      onChange={(e) => setGuestPurpose(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.85rem',
                        borderRadius: '12px',
                        border: '1.5px solid var(--border-color)',
                        backgroundColor: 'var(--bg-main)',
                        color: 'var(--text-main)',
                        fontSize: '0.88rem',
                        outline: 'none',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      <option value="Vacation / Leisure">🌴 Vacation / Leisure</option>
                      <option value="Work / Remote Business">💼 Work / Remote Trip</option>
                      <option value="Family Gathering / Visit">👨‍👩‍👧 Family Visit</option>
                      <option value="Celebration / Getaway">🎉 Weekend Getaway</option>
                    </select>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                    Special Requests / Note to Host (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Late check-in around 8 PM, extra towels requested..."
                    value={guestSpecialRequests}
                    onChange={(e) => setGuestSpecialRequests(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.85rem',
                      borderRadius: '12px',
                      border: '1.5px solid var(--border-color)',
                      backgroundColor: 'var(--bg-main)',
                      color: 'var(--text-main)',
                      fontSize: '0.88rem',
                      outline: 'none',
                      resize: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
              </div>

              {/* Host Sharing Disclosure */}
              <div style={{
                marginTop: '1.1rem',
                marginBottom: '1.35rem',
                fontSize: '0.76rem',
                color: 'var(--text-muted)',
                lineHeight: 1.45,
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}>
                <Lock size={14} color="#059669" style={{ flexShrink: 0 }} />
                <span>Your contact & guest profile details will be shared directly with host <strong>{property.owner?.name || 'the host'}</strong> to coordinate your check-in.</span>
              </div>

              {/* Modal Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowGuestDetailsModal(false)}
                  style={{
                    padding: '0.75rem 1.25rem',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                  }}
                >
                  Back to Dates
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  style={{
                    padding: '0.75rem 1.6rem',
                    borderRadius: '12px',
                    backgroundColor: '#059669',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    cursor: bookingLoading ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 14px rgba(5, 150, 105, 0.4)',
                  }}
                >
                  <CreditCard size={16} />
                  {bookingLoading ? 'Processing Booking...' : 'Confirm & Reserve Stay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailPage;
