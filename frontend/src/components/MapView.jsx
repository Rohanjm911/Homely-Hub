import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';

// Fix Leaflet marker icon issue in Vite/Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Create custom price pin icon
const createPriceIcon = (price) => {
  return L.divIcon({
    className: 'custom-leaflet-price-pin',
    html: `<div style="
      background: linear-gradient(135deg, #0284c7 0%, #1d4ed8 100%);
      color: white;
      font-weight: 800;
      font-size: 11px;
      padding: 5px 10px;
      border-radius: 9999px;
      box-shadow: 0 4px 14px rgba(2, 132, 199, 0.45);
      border: 2px solid #ffffff;
      white-space: nowrap;
      cursor: pointer;
      display: inline-block;
      letter-spacing: -0.2px;
      transition: transform 0.15s ease;
    ">₹${price.toLocaleString()}</div>`,
    iconSize: [68, 28],
    iconAnchor: [34, 14],
  });
};

// Component to dynamically re-center map when properties change
function ChangeMapView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

const MapView = ({ properties = [] }) => {
  // Default center (India or first property coordinates)
  let defaultCenter = [20.5937, 78.9629];
  let defaultZoom = 5;

  const validProperties = properties.filter(
    (p) => p.location && typeof p.location.lat === 'number' && typeof p.location.lng === 'number'
  );

  if (validProperties.length > 0) {
    defaultCenter = [validProperties[0].location.lat, validProperties[0].location.lng];
    defaultZoom = validProperties.length === 1 ? 13 : 7;
  }

  return (
    <div style={{ height: '540px', width: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <ChangeMapView center={defaultCenter} zoom={defaultZoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validProperties.map((property) => (
          <Marker
            key={property._id}
            position={[property.location.lat, property.location.lng]}
            icon={createPriceIcon(property.pricePerNight)}
          >
            <Popup>
              <div style={{ width: '200px', padding: '2px' }}>
                <img
                  src={property.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'}
                  alt={property.title}
                  style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '8px', marginBottom: '6px' }}
                />
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', marginBottom: '2px', lineHeight: 1.3 }}>
                  {property.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{property.city}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.78rem', fontWeight: 700, color: '#f59e0b' }}>
                    <Star size={12} fill="#f59e0b" /> {property.rating?.toFixed(1) || '4.8'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 800, color: '#0284c7', fontSize: '0.9rem' }}>
                    ₹{property.pricePerNight?.toLocaleString()} <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 400 }}>/ night</span>
                  </div>
                  <Link
                    to={`/properties/${property._id}`}
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      background: '#0284c7',
                      color: '#ffffff',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      textDecoration: 'none',
                    }}
                  >
                    View
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
