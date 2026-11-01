import React from 'react';

export type BadgeType =
  | 'moon'
  | 'cloud'
  | 'dewdrop'
  | 'flower'
  | 'star'
  | 'leaf'
  | 'crystal'
  | 'seed';

interface AnonymousBadgeProps {
  type?: BadgeType;
  id?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const AnonymousBadge: React.FC<AnonymousBadgeProps> = ({
  type,
  id,
  name,
  size = 'sm',
  className = ''
}) => {
  // Deterministic badge type selection
  const resolveBadgeType = (): BadgeType => {
    if (type) return type;

    // Check id mapping
    if (id) {
      const lower = id.toLowerCase();
      if (lower.includes('moon')) return 'moon';
      if (lower.includes('cloud')) return 'cloud';
      if (lower.includes('star')) return 'star';
      if (lower.includes('flower') || lower.includes('fairy')) return 'flower';
      if (lower.includes('bunny')) return 'dewdrop';
      if (lower.includes('mushroom')) return 'leaf';
    }

    // Check name hash
    if (name) {
      const types: BadgeType[] = [
        'moon',
        'cloud',
        'dewdrop',
        'flower',
        'star',
        'leaf',
        'crystal',
        'seed'
      ];
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = (hash << 5) - hash + name.charCodeAt(i);
        hash |= 0;
      }
      const index = Math.abs(hash) % types.length;
      return types[index];
    }

    return 'star';
  };

  const badgeType = resolveBadgeType();

  // Size mapping
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const badgeMeta = {
    moon: {
      bgGrad: 'from-[#1E1A38] to-[#121124]',
      border: 'border-[#B9A9E8]/35',
      glow: 'rgba(185, 169, 232, 0.4)',
      accent: '#B9A9E8',
      light: '#EADFFE'
    },
    cloud: {
      bgGrad: 'from-[#17203B] to-[#101526]',
      border: 'border-[#91B8E8]/35',
      glow: 'rgba(145, 184, 232, 0.4)',
      accent: '#91B8E8',
      light: '#DCEBFA'
    },
    dewdrop: {
      bgGrad: 'from-[#14262E] to-[#0D181D]',
      border: 'border-[#8FD8DF]/35',
      glow: 'rgba(143, 216, 223, 0.4)',
      accent: '#8FD8DF',
      light: '#DDF8FA'
    },
    flower: {
      bgGrad: 'from-[#261828] to-[#170E1A]',
      border: 'border-[#DFAFC8]/35',
      glow: 'rgba(223, 175, 200, 0.4)',
      accent: '#DFAFC8',
      light: '#FDEAF3'
    },
    star: {
      bgGrad: 'from-[#252219] to-[#17140C]',
      border: 'border-[#F4EEDC]/40',
      glow: 'rgba(244, 238, 220, 0.45)',
      accent: '#F4EEDC',
      light: '#FFFDF5'
    },
    leaf: {
      bgGrad: 'from-[#142622] to-[#0D1A16]',
      border: 'border-[#A8D2C4]/35',
      glow: 'rgba(168, 210, 196, 0.4)',
      accent: '#A8D2C4',
      light: '#E4F8F1'
    },
    crystal: {
      bgGrad: 'from-[#221C38] to-[#151025]',
      border: 'border-[#C2B2EC]/35',
      glow: 'rgba(194, 178, 236, 0.4)',
      accent: '#C2B2EC',
      light: '#EEE6FD'
    },
    seed: {
      bgGrad: 'from-[#261F18] to-[#18120B]',
      border: 'border-[#ECCEA4]/35',
      glow: 'rgba(236, 206, 164, 0.4)',
      accent: '#ECCEA4',
      light: '#FFF2DF'
    }
  };

  const meta = badgeMeta[badgeType];

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full bg-gradient-to-br ${meta.bgGrad} border ${meta.border} shrink-0 select-none ${sizeClasses[size]} ${className}`}
      style={{
        boxShadow: `0 0 12px ${meta.glow}, inset 0 1px 1px rgba(255, 255, 255, 0.25)`
      }}
      title={`Biểu tượng ẩn danh: ${badgeType}`}
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-3/5 h-3/5 overflow-visible"
      >
        <defs>
          <radialGradient id={`badgeGlow-${badgeType}`} cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor={meta.light} />
            <stop offset="90%" stopColor={meta.accent} />
            <stop offset="100%" stopColor={meta.accent} stopOpacity="0.8" />
          </radialGradient>
        </defs>

        {/* 1. SOFT GLOWING MOON */}
        {badgeType === 'moon' && (
          <g>
            <path
              d="M 18 6 C 11.4 6 6 11.4 6 18 C 6 24.6 11.4 30 18 30 C 21.6 30 24.8 28.4 27 25.8 C 22.2 25.4 18.5 21.4 18.5 16.5 C 18.5 12.2 21.2 8.5 25 7.2 C 22.9 6.4 20.5 6 18 6 Z"
              fill={`url(#badgeGlow-${badgeType})`}
              filter="drop-shadow(0 0 3px rgba(185, 169, 232, 0.7))"
              transform="scale(0.8) translate(3, 2)"
            />
            <circle cx="21" cy="11" r="1" fill="#FFFFFF" opacity="0.8" />
          </g>
        )}

        {/* 2. TINY PUFFY CLOUD */}
        {badgeType === 'cloud' && (
          <g transform="translate(0, 2)">
            <path
              d="M 10 20 C 7.8 20 6 18.2 6 16 C 6 14.1 7.3 12.5 9.1 12.1 C 9.7 9.2 12.2 7 15.3 7 C 18.6 7 21.3 9.4 21.6 12.6 C 23.5 13 25 14.7 25 16.7 C 25 19 23.2 20.8 20.9 20.8 L 10 20.8 Z"
              fill={`url(#badgeGlow-${badgeType})`}
              filter="drop-shadow(0 0 3px rgba(145, 184, 232, 0.7))"
              transform="scale(0.9) translate(1.5, 0)"
            />
            <ellipse cx="14" cy="12" rx="4" ry="2" fill="#FFFFFF" opacity="0.5" />
          </g>
        )}

        {/* 3. LUMINOUS DEWDROP */}
        {badgeType === 'dewdrop' && (
          <g transform="translate(0, -1)">
            <path
              d="M 16 5 C 16 5 8 16 8 20.5 C 8 24.9 11.6 28.5 16 28.5 C 20.4 28.5 24 24.9 24 20.5 C 24 16 16 5 16 5 Z"
              fill={`url(#badgeGlow-${badgeType})`}
              filter="drop-shadow(0 0 3px rgba(143, 216, 223, 0.7))"
              transform="scale(0.85) translate(3, 3)"
            />
            {/* Glassy reflection */}
            <ellipse cx="13.5" cy="17" rx="2" ry="4" transform="rotate(-25 13.5 17)" fill="#FFFFFF" opacity="0.75" />
          </g>
        )}

        {/* 4. SOFT FLOWER BUD / PETAL */}
        {badgeType === 'flower' && (
          <g transform="translate(0, 0)">
            {/* Outer Petals */}
            <path
              d="M 16 7 C 10 13 8 21 16 26 C 24 21 22 13 16 7 Z"
              fill={`url(#badgeGlow-${badgeType})`}
              filter="drop-shadow(0 0 3px rgba(223, 175, 200, 0.7))"
              transform="scale(0.9) translate(1.8, 1.5)"
            />
            {/* Left Layer Petal */}
            <path
              d="M 11 15 C 8 18 10 24 15 25 C 11 22 10 18 11 15 Z"
              fill="#FFFFFF"
              opacity="0.45"
            />
            {/* Right Layer Petal */}
            <path
              d="M 21 15 C 24 18 22 24 17 25 C 21 22 22 18 21 15 Z"
              fill="#FFFFFF"
              opacity="0.45"
            />
            <circle cx="16" cy="17" r="1.5" fill="#FFFFFF" opacity="0.9" />
          </g>
        )}

        {/* 5. SMALL RADIANT STAR */}
        {badgeType === 'star' && (
          <g>
            <path
              d="M 16 4 L 18.5 13.5 L 28 16 L 18.5 18.5 L 16 28 L 13.5 18.5 L 4 16 L 13.5 13.5 Z"
              fill={`url(#badgeGlow-${badgeType})`}
              filter="drop-shadow(0 0 4px rgba(244, 238, 220, 0.8))"
              transform="scale(0.85) translate(3, 2.5)"
            />
            <circle cx="16" cy="16" r="2.2" fill="#FFFFFF" />
          </g>
        )}

        {/* 6. CURVED JADE LEAF */}
        {badgeType === 'leaf' && (
          <g transform="translate(0, -0.5)">
            <path
              d="M 24 7 C 14 7 8 15 9 24 C 18 25 26 19 24 7 Z"
              fill={`url(#badgeGlow-${badgeType})`}
              filter="drop-shadow(0 0 3px rgba(168, 210, 196, 0.7))"
              transform="scale(0.85) translate(3, 3)"
            />
            <path d="M 11 23 Q 16 17 23 9" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.75" />
          </g>
        )}

        {/* 7. SOFT GLOWING CRYSTAL */}
        {badgeType === 'crystal' && (
          <g>
            <polygon
              points="16,5 24,13 16,27 8,13"
              fill={`url(#badgeGlow-${badgeType})`}
              filter="drop-shadow(0 0 3px rgba(194, 178, 236, 0.7))"
              transform="scale(0.85) translate(3, 2)"
            />
            <line x1="16" y1="5" x2="16" y2="27" stroke="#FFFFFF" strokeWidth="1" opacity="0.8" />
            <polygon points="16,5 24,13 16,27" fill="#FFFFFF" fillOpacity="0.25" />
          </g>
        )}

        {/* 8. GLOWING SEED */}
        {badgeType === 'seed' && (
          <g transform="translate(0, 0)">
            <ellipse
              cx="16"
              cy="16"
              rx="7"
              ry="10.5"
              transform="rotate(25 16 16)"
              fill={`url(#badgeGlow-${badgeType})`}
              filter="drop-shadow(0 0 3px rgba(236, 206, 164, 0.7))"
            />
            <ellipse cx="14" cy="14" rx="2" ry="5" transform="rotate(25 14 14)" fill="#FFFFFF" opacity="0.75" />
            <circle cx="16" cy="7" r="1.2" fill="#FFFFFF" className="animate-pulse" />
          </g>
        )}
      </svg>
    </div>
  );
};
