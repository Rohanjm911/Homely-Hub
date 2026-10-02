import React from 'react';

/**
 * HomelyHub Brand Logo Component
 * Recreates the official "HH" dual-block emblem and "Homely Hub" typography
 * Left 'H': Theme-adaptive (Black in light mode, Clean White in dark mode)
 * Right 'H': Signature Vibrant Coral Red (#ff333a)
 * "Homely": Signature Vibrant Coral Red (#ff333a)
 * "Hub": Theme-adaptive (Dark in light mode, Clean White in dark mode)
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
  // Sizing definitions
  const sizeMap = {
    sm: { iconWidth: 32, iconHeight: 22, fontSize: '1.15rem', subSize: '0.55rem', gap: '0.5rem' },
    md: { iconWidth: 40, iconHeight: 28, fontSize: '1.45rem', subSize: '0.62rem', gap: '0.65rem' },
    lg: { iconWidth: 54, iconHeight: 38, fontSize: '1.85rem', subSize: '0.72rem', gap: '0.75rem' },
    xl: { iconWidth: 70, iconHeight: 48, fontSize: '2.3rem', subSize: '0.82rem', gap: '0.9rem' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const defaultSubtitle = isHost ? 'HOST & ANALYTICS' : 'VERIFIED OWNERS & TENANTS';
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
      {/* Bespoke HH Dual-Block Vector Emblem */}
      {variant !== 'text-only' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.05) translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1) translateY(0)';
          }}
        >
          <svg
            width={currentSize.iconWidth}
            height={currentSize.iconHeight}
            viewBox="0 0 100 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: 'block' }}
          >
            {/* Left Block H - adapts to theme: black in light, white in dark */}
            <path
              d="M0 0 H21 V26 H33 V0 H54 V70 H33 V44 H21 V70 H0 Z"
              fill="var(--text-main, #0f172a)"
            />

            {/* Right Block H - Signature Vibrant Coral Red */}
            <path
              d="M46 0 H67 V26 H79 V0 H100 V70 H79 V44 H67 V70 H46 Z"
              fill="#ff333a"
            />
          </svg>
        </div>
      )}

      {/* Typography Brandmark ("Homely Hub") */}
      {variant !== 'icon-only' && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <div
            style={{
              fontFamily: 'Plus Jakarta Sans, Outfit, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontSize: currentSize.fontSize,
              fontWeight: 900,
              letterSpacing: '-0.04em',
              display: 'flex',
              alignItems: 'center',
              lineHeight: 1.05,
            }}
          >
            {/* "Homely" in Signature Vibrant Coral Red */}
            <span style={{ color: '#ff333a', letterSpacing: '-0.035em' }}>
              Homely
            </span>

            {/* "Hub" in adaptive clean contrast color */}
            <span
              style={{
                marginLeft: '0.28em',
                color: 'var(--text-main, #0f172a)',
                letterSpacing: '-0.035em',
              }}
            >
              Hub
            </span>
          </div>

          {/* Subtitle tag */}
          {showSubtitle && (
            <div
              style={{
                fontSize: currentSize.subSize,
                color: isHost ? '#10b981' : 'var(--text-muted, #64748b)',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginTop: '3px',
                fontFamily: 'Inter, -apple-system, sans-serif',
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
