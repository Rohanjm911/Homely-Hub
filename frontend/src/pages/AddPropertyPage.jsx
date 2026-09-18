import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createProperty } from '../features/properties/propertySlice';
import { generateDescription, clearAiData } from '../features/ai/aiSlice';
import {
  Sparkles,
  Home,
  MapPin,
  UploadCloud,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowRight,
} from 'lucide-react';

const commonAmenitiesList = [
  'Wifi',
  'Air conditioning',
  'Kitchen',
  'Private pool',
  'Free parking',
  'Mountain view',
  'Sea view',
  'Dedicated workspace',
  'Indoor fireplace',
  'Garden',
  'Elevator',
  'Free breakfast',
];

const AddPropertyPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { createLoading, error: createError } = useSelector((state) => state.properties);
  const { description: aiDescription, generatingDesc, descError } = useSelector((state) => state.ai);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'House',
    roomType: 'Entire place',
    pricePerNight: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    amenities: ['Wifi', 'Air conditioning', 'Kitchen'],
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80',
    ],
    lat: 15.544,
    lng: 73.755,
  });

  const [customImageUrl, setCustomImageUrl] = useState('');

  // Whenever AI generates a description, update the textarea
  useEffect(() => {
    if (aiDescription) {
      setFormData((prev) => ({ ...prev, description: aiDescription }));
    }
  }, [aiDescription]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      };
    });
  };

  const handleAddImage = () => {
    if (customImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, customImageUrl.trim()],
      }));
      setCustomImageUrl('');
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // AI Description Trigger (Slide 4 & 8: AI writes 3-4 sentence description strictly from details)
  const handleGenerateAiDescription = () => {
    if (!formData.title || !formData.city || !formData.propertyType) {
      alert('Please fill in Title, City, and Property Type first so the AI can craft an accurate description.');
      return;
    }

    dispatch(
      generateDescription({
        title: formData.title,
        propertyType: formData.propertyType,
        roomType: formData.roomType,
        city: formData.city,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        maxGuests: formData.maxGuests,
        amenities: formData.amenities,
      })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.city || !formData.pricePerNight || !formData.address) {
      alert('Please fill all required fields');
      return;
    }

    const payload = {
      ...formData,
      pricePerNight: Number(formData.pricePerNight),
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      maxGuests: Number(formData.maxGuests),
      location: {
        lat: Number(formData.lat) || 15.544,
        lng: Number(formData.lng) || 73.755,
      },
    };

    const res = await dispatch(createProperty(payload));
    if (!res.error) {
      dispatch(clearAiData());
      navigate(`/properties/${res.payload._id}`);
    }
  };

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
      {/* Page Hero Banner */}
      <div style={{
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #047857 0%, #059669 50%, #10b981 100%)',
        color: '#ffffff',
        padding: '2.75rem 2.25rem',
        marginBottom: '2.5rem',
        boxShadow: '0 20px 40px -10px rgba(5, 150, 105, 0.3)',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.35rem 0.9rem',
          borderRadius: '9999px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(8px)',
          fontSize: '0.82rem',
          fontWeight: 700,
          marginBottom: '1rem',
        }}>
          <Home size={15} />
          <span>Host Creator Hub</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Publish Your Property on HomelyHub
        </h1>
        <p style={{ color: '#d1fae5', fontSize: '1rem', maxWidth: '650px', lineHeight: 1.6 }}>
          Reach thousands of verified guests. Leverage our AI assistant to write compelling descriptions grounded in your actual amenities.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basics */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '2.25rem',
          border: '1.5px solid #e2e8f0',
          marginBottom: '2rem',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
            }}>
              1
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Property Essentials
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>Core identity and pricing of your place</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                Property Title *
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Sunset Coastal Villa with Private Plunge Pool"
                value={formData.title}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.85rem 1.1rem',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.95rem',
                  color: '#0f172a',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                  Property Type *
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.85rem 1.1rem', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem', color: '#0f172a', outline: 'none', backgroundColor: '#ffffff' }}
                >
                  {['House', 'Flat', 'Guest House', 'Hotel', 'Villa', 'Cottage'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                  Room Type
                </label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.85rem 1.1rem', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem', color: '#0f172a', outline: 'none', backgroundColor: '#ffffff' }}
                >
                  <option value="Entire place">Entire place</option>
                  <option value="Private room">Private room</option>
                  <option value="Shared room">Shared room</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                  Price per Night (₹) *
                </label>
                <input
                  type="number"
                  name="pricePerNight"
                  placeholder="e.g. 4500"
                  value={formData.pricePerNight}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '0.85rem 1.1rem', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem', color: '#0f172a', outline: 'none' }}
                />
              </div>
            </div>

            {/* Capacity grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                  Bedrooms
                </label>
                <input
                  type="number"
                  min="1"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.85rem 1.1rem', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem', color: '#0f172a', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                  Bathrooms
                </label>
                <input
                  type="number"
                  min="1"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.85rem 1.1rem', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem', color: '#0f172a', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                  Max Guests
                </label>
                <input
                  type="number"
                  min="1"
                  name="maxGuests"
                  value={formData.maxGuests}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.85rem 1.1rem', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem', color: '#0f172a', outline: 'none' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Location */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '2.25rem',
          border: '1.5px solid #e2e8f0',
          marginBottom: '2rem',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
            }}>
              2
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Location & Map Coordinates
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>For exact Leaflet map rendering</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                Street Address *
              </label>
              <input
                type="text"
                name="address"
                placeholder="e.g. Villa 12, Calangute Beach Road"
                value={formData.address}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.85rem 1.1rem', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem', color: '#0f172a', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="e.g. Goa"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '0.85rem 1.1rem', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem', color: '#0f172a', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  placeholder="e.g. Goa"
                  value={formData.state}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.85rem 1.1rem', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem', color: '#0f172a', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                  Latitude (GPS)
                </label>
                <input
                  type="number"
                  step="any"
                  name="lat"
                  value={formData.lat}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.85rem 1.1rem', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem', color: '#0f172a', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                  Longitude (GPS)
                </label>
                <input
                  type="number"
                  step="any"
                  name="lng"
                  value={formData.lng}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.85rem 1.1rem', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem', color: '#0f172a', outline: 'none' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Amenities Checklist */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '2.25rem',
          border: '1.5px solid #e2e8f0',
          marginBottom: '2rem',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
            }}>
              3
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Amenities & Features
              </h2>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem', marginLeft: '2.9rem' }}>
            Select amenities present in your stay. The AI writer strictly derives listing highlights from these selections.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.85rem' }}>
            {commonAmenitiesList.map((amenity) => {
              const isChecked = formData.amenities.includes(amenity);
              return (
                <button
                  type="button"
                  key={amenity}
                  onClick={() => handleAmenityToggle(amenity)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    border: isChecked ? '1.5px solid #0284c7' : '1.5px solid #e2e8f0',
                    backgroundColor: isChecked ? '#e0f2fe' : '#ffffff',
                    color: isChecked ? '#0369a1' : '#475569',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '6px',
                    border: isChecked ? 'none' : '1.5px solid #cbd5e1',
                    backgroundColor: isChecked ? '#0284c7' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    flexShrink: 0,
                  }}>
                    {isChecked && <CheckCircle size={14} />}
                  </div>
                  <span>{amenity}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 4: AI Description Generator */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '2.25rem',
          border: '1.5px solid #ddd6fe',
          marginBottom: '2rem',
          background: 'linear-gradient(180deg, #ffffff 0%, #faf5ff 100%)',
          boxShadow: '0 12px 30px -6px rgba(124, 58, 237, 0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.35rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#6d28d9', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.01em' }}>
                <Sparkles size={24} color="#7c3aed" />
                <span>4. AI Description Generator</span>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '0.25rem' }}>
                Llama 3.1 synthesizes your selected amenities and location into a captivating guest summary.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGenerateAiDescription}
              disabled={generatingDesc}
              aria-label="Generate AI property description"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '0.85rem 1.6rem',
                borderRadius: '14px',
                fontSize: '0.92rem',
                fontWeight: 700,
                cursor: generatingDesc ? 'not-allowed' : 'pointer',
                boxShadow: '0 8px 20px -4px rgba(124, 58, 237, 0.4)',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => { if (!generatingDesc) e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseOut={(e) => { if (!generatingDesc) e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <Sparkles size={17} />
              {generatingDesc ? 'Crafting Description...' : '✨ Auto-Generate with AI'}
            </button>
          </div>

          <textarea
            name="description"
            rows={4}
            placeholder="Click 'Auto-Generate with AI' or write your custom description..."
            value={formData.description}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '1.1rem 1.25rem',
              borderRadius: '16px',
              border: '1.5px solid #cbd5e1',
              fontSize: '0.95rem',
              lineHeight: 1.65,
              color: '#0f172a',
              outline: 'none',
              fontFamily: 'inherit',
              transition: 'border-color 0.2s ease',
              backgroundColor: '#ffffff',
            }}
          />
        </div>

        {/* Step 5: Images */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '2.25rem',
          border: '1.5px solid #e2e8f0',
          marginBottom: '2.5rem',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#fce7f3',
              color: '#db2777',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
            }}>
              5
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Property Gallery
              </h2>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem', marginLeft: '2.9rem' }}>
            Paste direct image URLs (ImageKit / Unsplash) to showcase your space.
          </p>

          {/* Add Image Input */}
          <div style={{ display: 'flex', gap: '0.85rem', marginBottom: '1.5rem' }}>
            <input
              type="url"
              placeholder="Paste photo URL (e.g. Unsplash or ImageKit URL)"
              value={customImageUrl}
              onChange={(e) => setCustomImageUrl(e.target.value)}
              style={{ flex: 1, padding: '0.85rem 1.1rem', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.92rem', outline: 'none' }}
            />
            <button
              type="button"
              onClick={handleAddImage}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.85rem 1.5rem',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
              }}
            >
              <Plus size={17} /> Add Photo
            </button>
          </div>

          {/* Thumbnail Preview Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
            {formData.images.map((url, idx) => (
              <div key={idx} style={{ position: 'relative', height: '110px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                <img src={url} alt={`Stay preview ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '22px',
                    height: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              padding: '0.9rem 1.75rem',
              borderRadius: '14px',
              border: '1.5px solid #e2e8f0',
              backgroundColor: '#ffffff',
              color: '#64748b',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createLoading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.9rem 2.25rem',
              borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '1.02rem',
              cursor: createLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 20px -4px rgba(5, 150, 105, 0.4)',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => { if (!createLoading) e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseOut={(e) => { if (!createLoading) e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {createLoading ? 'Publishing Stay...' : 'Publish Listing'}
            <ArrowRight size={19} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPropertyPage;
