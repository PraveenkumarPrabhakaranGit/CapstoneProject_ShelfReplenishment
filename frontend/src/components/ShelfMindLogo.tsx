import React from 'react';

interface ShelfMindLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ShelfMindLogo: React.FC<ShelfMindLogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const dimensions = {
    sm: { width: 32, height: 32 },
    md: { width: 48, height: 48 },
    lg: { width: 64, height: 64 }
  };

  const { width, height } = dimensions[size];

  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center justify-center`}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        {/* Simple Gradient Definitions */}
        <defs>
          <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>
          <linearGradient id="shelfGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#6D28D9" />
          </linearGradient>
        </defs>

        {/* Main Circle Background */}
        <circle
          cx="32"
          cy="32"
          r="30"
          fill="url(#primaryGradient)"
          opacity="0.1"
        />

        {/* Outer Border Ring */}
        <circle
          cx="32"
          cy="32"
          r="30"
          fill="none"
          stroke="url(#primaryGradient)"
          strokeWidth="2"
        />

        {/* Inner Circle */}
        <circle
          cx="32"
          cy="32"
          r="24"
          fill="#FFFFFF"
          opacity="0.95"
        />

        {/* Shelf Structure - Clear Horizontal Lines */}
        <g>
          {/* Top Shelf */}
          <rect
            x="12"
            y="20"
            width="40"
            height="3"
            rx="1.5"
            fill="url(#shelfGradient)"
          />
          
          {/* Middle Shelf */}
          <rect
            x="12"
            y="30.5"
            width="40"
            height="3"
            rx="1.5"
            fill="url(#shelfGradient)"
          />
          
          {/* Bottom Shelf */}
          <rect
            x="12"
            y="41"
            width="40"
            height="3"
            rx="1.5"
            fill="url(#shelfGradient)"
          />
        </g>

        {/* Products on Shelves - Simple Rectangles */}
        <g>
          {/* Top Shelf Products */}
          <rect x="14" y="16" width="4" height="4" rx="1" fill="url(#aiGradient)" opacity="0.8" />
          <rect x="20" y="16" width="4" height="4" rx="1" fill="url(#primaryGradient)" opacity="0.8" />
          <rect x="26" y="16" width="4" height="4" rx="1" fill="url(#shelfGradient)" opacity="0.8" />
          <rect x="32" y="16" width="4" height="4" rx="1" fill="url(#aiGradient)" opacity="0.8" />
          <rect x="38" y="16" width="4" height="4" rx="1" fill="url(#primaryGradient)" opacity="0.8" />
          <rect x="44" y="16" width="4" height="4" rx="1" fill="url(#shelfGradient)" opacity="0.8" />

          {/* Middle Shelf Products */}
          <rect x="14" y="26.5" width="4" height="4" rx="1" fill="url(#primaryGradient)" opacity="0.8" />
          <rect x="20" y="26.5" width="4" height="4" rx="1" fill="url(#shelfGradient)" opacity="0.8" />
          <rect x="26" y="26.5" width="4" height="4" rx="1" fill="url(#aiGradient)" opacity="0.8" />
          <rect x="32" y="26.5" width="4" height="4" rx="1" fill="url(#primaryGradient)" opacity="0.8" />
          <rect x="38" y="26.5" width="4" height="4" rx="1" fill="url(#shelfGradient)" opacity="0.8" />
          <rect x="44" y="26.5" width="4" height="4" rx="1" fill="url(#aiGradient)" opacity="0.8" />

          {/* Bottom Shelf Products */}
          <rect x="14" y="37" width="4" height="4" rx="1" fill="url(#shelfGradient)" opacity="0.8" />
          <rect x="20" y="37" width="4" height="4" rx="1" fill="url(#aiGradient)" opacity="0.8" />
          <rect x="26" y="37" width="4" height="4" rx="1" fill="url(#primaryGradient)" opacity="0.8" />
          <rect x="32" y="37" width="4" height="4" rx="1" fill="url(#shelfGradient)" opacity="0.8" />
          <rect x="38" y="37" width="4" height="4" rx="1" fill="url(#aiGradient)" opacity="0.8" />
          <rect x="44" y="37" width="4" height="4" rx="1" fill="url(#primaryGradient)" opacity="0.8" />
        </g>

        {/* AI Eye/Scanner in Center */}
        <g>
          {/* Scanner Base */}
          <circle
            cx="32"
            cy="32"
            r="6"
            fill="url(#aiGradient)"
            opacity="0.9"
          />
          
          {/* Scanner Lens */}
          <circle
            cx="32"
            cy="32"
            r="4"
            fill="#FFFFFF"
            opacity="0.9"
          />
          
          {/* Scanner Pupil */}
          <circle
            cx="32"
            cy="32"
            r="2"
            fill="url(#primaryGradient)"
          />
          
          {/* Scanner Highlight */}
          <circle
            cx="33"
            cy="31"
            r="0.8"
            fill="#FFFFFF"
            opacity="0.8"
          />
        </g>

        {/* Corner Indicators - AI Monitoring Points */}
        <g>
          <circle cx="18" cy="18" r="1.5" fill="url(#aiGradient)" opacity="0.7" />
          <circle cx="46" cy="18" r="1.5" fill="url(#primaryGradient)" opacity="0.7" />
          <circle cx="18" cy="46" r="1.5" fill="url(#shelfGradient)" opacity="0.7" />
          <circle cx="46" cy="46" r="1.5" fill="url(#aiGradient)" opacity="0.7" />
        </g>

        {/* Simple Grid Pattern for Tech Feel */}
        <g stroke="url(#primaryGradient)" strokeWidth="0.5" opacity="0.2">
          <line x1="32" y1="8" x2="32" y2="56" />
          <line x1="8" y1="32" x2="56" y2="32" />
        </g>
      </svg>
    </div>
  );
};

export default ShelfMindLogo;