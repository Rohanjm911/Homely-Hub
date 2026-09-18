import React from 'react';

/**
 * HomelyHub Premium Brand Logo Component
 * Features an iconic bespoke vector emblem (architectural haven + welcoming hearth + AI spark)
 * with modern dual-tone typography and responsive sizing.
 */
const Logo = ({
  isHost = false,
  size = 'md',
  showSubtitle = true,
  subtitleText = null,
  variant = 'full',
  className = '',
  style = {},
}) => {
  // Sizing tokens
  const sizeMap = {
    sm: { iconSize: 32, fontSize: '1.2rem', subSize: '0.58rem', gap: '0.5rem', iconRadius: 10 },
    md: { iconSize: 42, fontSize: '1.45rem', subSize: '0.64rem', gap: '0.65rem', iconRadius: 13 },
    lg: { iconSize: 52, fontSize: '1.8rem', subSize: '0.72rem', gap: '0.75rem', iconRadius: 16 },
    xl: { iconSize: 64, fontSize: '2.2rem', subSize: '0.8rem', gap: '0.9rem', iconRadius: 20 },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // Color schemes - Sleek Emerald & Slate
  const brandGradient = isHost
    ? 'linear-gradient(135deg, #047857 0%, #10b981 50%, #059669 100%)'
    : 'linear-gradient(135deg, #064e3b 0%, #059669 50%, #10b981 100%)';

  const brandShadow = isHost
    ? '0 6px 18px -2px rgba(5, 150, 105, 0.4), 0 2px 6px -1px rgba(5, 150, 105, 0.2)'
    : '0 6px 18px -2px rgba(5, 150, 105, 0.38), 0 2px 6px -1px rgba(6, 78, 59, 0.25)';

  const hubTextColor = isHost ? '#059669' : '#059669';
  const hubGradient = isHost
    ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
    : 'linear-gradient(135deg, #059669 0%, #34d399 100%)';

  const defaultSubtitle = isHost ? 'HOST SMARTER • EARN BETTER' : 'FEELS LIKE HOME, ANYWHERE';
  const finalSubtitle = subtitleText || defaultSubtitle;

  return (
    <div
      className={`homely-hub-brand ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: currentSize.gap,
        userSelect: 'none',
        textDecoration: 'none',
        ...style,
      }}
    >
      {/* Bespoke Vector Brand Emblem */}
      {variant !== 'text-only' && (
        <div
          style={{
            width: `${currentSize.iconSize}px`,
            height: `${currentSize.iconSize}px`,
            borderRadius: `${currentSize.iconRadius}px`,
            background: brandGradient,
            boxShadow: brandShadow,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.04)';
            e.currentTarget.style.boxShadow = isHost
              ? '0 10px 24px -2px rgba(5, 150, 105, 0.5), 0 4px 10px -2px rgba(5, 150, 105, 0.3)'
              : '0 10px 24px -2px rgba(37, 99, 235, 0.48), 0 4px 10px -2px rgba(2, 132, 199, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = brandShadow;
          }}
        >
          {/* Subtle Glassmorphic Sheen Overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '45%',
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%)',
              borderTopLeftRadius: `${currentSize.iconRadius}px`,
              borderTopRightRadius: `${currentSize.iconRadius}px`,
              pointerEvents: 'none',
            }}
          />

          {/* Premium Vector SVG Icon */}
          <svg
            width="62%"
            height="62%"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ position: 'relative', zIndex: 1 }}
          >
            {/* Architectural Haven Roofline */}
            <path
              d="M5 14.5L16 5L27 14.5"
              stroke="#ffffff"
              strokeWidth="2.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Welcoming Body / Haven Arch */}
            <path
              d="M8 13.5V23.5C8 25.433 9.567 27 11.5 27H20.5C22.433 27 24 25.433 24 23.5V13.5"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.95"
            />

            {/* Warm Hearth / Doorway with soft arch */}
            <path
              d="M13 27V19.5C13 17.843 14.343 16.5 16 16.5C17.657 16.5 19 17.843 19 19.5V27"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Glowing AI Spark / North Star Beacon */}
            <circle cx="23.5" cy="8.5" r="1.8" fill="#fef08a" />
            <path
              d="M23.5 5.5V6.8M23.5 10.2V11.5M20.5 8.5H21.8M25.2 8.5H26.5"
              stroke="#fef08a"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}

      {/* Typography Brandmark */}
      {variant !== 'icon-only' && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <div
            style={{
              fontFamily: 'Outfit, system-ui, -apple-system, sans-serif',
              fontSize: currentSize.fontSize,
              fontWeight: 800,
              letterSpacing: '-0.035em',
              display: 'flex',
              alignItems: 'center',
              lineHeight: 1.1,
            }}
          >
            {/* "Homely" in high-contrast adaptive primary text */}
            <span style={{ color: 'var(--text-main)', letterSpacing: '-0.03em' }}>Homely</span>

            {/* "Hub" with high-contrast, crystal-clear solid brand styling */}
            <span
              style={{
                marginLeft: '1px',
                color: hubTextColor,
                fontWeight: 900,
                letterSpacing: '-0.03em',
              }}
            >
              Hub
            </span>

            {/* Subtle Brand Accent Dot */}
            <span
              style={{
                display: 'inline-block',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: isHost ? '#10b981' : '#0284c7',
                marginLeft: '3px',
                marginBottom: '4px',
                boxShadow: isHost ? '0 0 10px rgba(16, 185, 129, 0.7)' : '0 0 10px rgba(2, 132, 199, 0.7)',
              }}
            />
          </div>

          {/* Subtitle tag */}
          {showSubtitle && (
            <div
              style={{
                fontSize: currentSize.subSize,
                color: isHost ? '#10b981' : 'var(--text-muted)',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginTop: '3px',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {isHost && (
                <span
                  style={{
                    display: 'inline-block',
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                  }}
                />
              )}
              {finalSubtitle}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
