import React from 'react';
import { KintsugiObjectType } from '../types';
import { getKintsugiMetaByType } from '../data/kintsugi';

interface KintsugiObjectGraphicProps {
  objectType: KintsugiObjectType;
  repairProgress?: number; // 0 to 100
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showGlow?: boolean;
  className?: string;
}

export const KintsugiObjectGraphic: React.FC<KintsugiObjectGraphicProps> = ({
  objectType,
  repairProgress = 100,
  size = 'md',
  showGlow = true,
  className = ''
}) => {
  const meta = getKintsugiMetaByType(objectType);
  const clampedProgress = Math.max(0, Math.min(100, repairProgress));
  const isHealed = clampedProgress >= 99;

  // Size configurations
  const sizeMap = {
    sm: { width: 64, height: 64, viewBoxSize: 100 },
    md: { width: 110, height: 110, viewBoxSize: 120 },
    lg: { width: 170, height: 170, viewBoxSize: 120 },
    xl: { width: 220, height: 220, viewBoxSize: 120 },
    hero: { width: 260, height: 260, viewBoxSize: 120 }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // Gold seam stroke offset animation
  // Dasharray = 140, offset from 140 (0% progress) down to 0 (100% progress)
  const seamDashOffset = 140 - (clampedProgress / 100) * 140;

  // Render object base according to objectType
  const renderObjectBody = () => {
    switch (objectType) {
      case 'glass_jar': // Lo âu
        return (
          <g>
            {/* Glass Jar Body */}
            <defs>
              <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            {/* Jar Rim */}
            <ellipse cx="60" cy="24" rx="26" ry="6" fill="#BFDBFE" fillOpacity="0.6" stroke="#93C5FD" strokeWidth="2" />
            <ellipse cx="60" cy="22" rx="20" ry="4" fill="#1E293B" stroke="#60A5FA" strokeWidth="1.5" />
            {/* Jar Neck */}
            <path d="M38 24 L38 32 C38 36 30 44 26 56 L24 92 C24 102 36 108 60 108 C84 108 96 102 96 92 L94 56 C90 44 82 36 82 32 L82 24 Z" 
              fill="url(#glassGrad)" 
              stroke="#93C5FD" 
              strokeWidth="2.5" 
            />
            {/* Glass Highlights */}
            <path d="M32 60 Q30 75 30 90" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" fill="none" />
            <path d="M40 98 Q60 104 80 98" stroke="#BFDBFE" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" fill="none" />
          </g>
        );

      case 'tea_cup': // Mệt mỏi
        return (
          <g>
            <defs>
              <linearGradient id="teaCupGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.9" />
                <stop offset="40%" stopColor="#D97706" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#78350F" stopOpacity="0.95" />
              </linearGradient>
            </defs>
            {/* Handle */}
            <path d="M86 52 C104 52 104 80 84 86" fill="none" stroke="#B45309" strokeWidth="6" strokeLinecap="round" />
            <path d="M86 52 C101 52 101 80 84 86" fill="none" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" />
            {/* Cup Base & Saucer */}
            <ellipse cx="60" cy="100" rx="42" ry="7" fill="#78350F" stroke="#D97706" strokeWidth="2" />
            <ellipse cx="60" cy="98" rx="38" ry="5" fill="#B45309" />
            {/* Cup Body */}
            <path d="M26 44 C26 78 40 96 60 96 C80 96 94 78 94 44 Z" fill="url(#teaCupGrad)" stroke="#B45309" strokeWidth="2.5" />
            {/* Cup Rim & Tea Surface */}
            <ellipse cx="60" cy="44" rx="34" ry="10" fill="#92400E" stroke="#FDE68A" strokeWidth="2" />
            <ellipse cx="60" cy="45" rx="30" ry="8" fill="#451A03" />
            <ellipse cx="58" cy="45" rx="22" ry="5" fill="#78350F" opacity="0.7" />
          </g>
        );

      case 'star_crystal': // Lạc lối
        return (
          <g>
            <defs>
              <linearGradient id="crystalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E9D5FF" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#A855F7" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#4C1D95" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            {/* Crystal Facets */}
            <polygon points="60,16 88,42 80,94 40,94 32,42" fill="url(#crystalGrad)" stroke="#C084FC" strokeWidth="2.5" />
            <polygon points="60,16 60,68 88,42" fill="#DDD6FE" fillOpacity="0.45" stroke="#C084FC" strokeWidth="1.5" />
            <polygon points="60,16 32,42 60,68" fill="#C084FC" fillOpacity="0.35" stroke="#C084FC" strokeWidth="1.5" />
            <polygon points="60,68 88,42 80,94" fill="#7E22CE" fillOpacity="0.6" stroke="#C084FC" strokeWidth="1.5" />
            <polygon points="60,68 40,94 32,42" fill="#9333EA" fillOpacity="0.5" stroke="#C084FC" strokeWidth="1.5" />
            <polygon points="60,68 40,94 80,94" fill="#581C87" fillOpacity="0.7" stroke="#C084FC" strokeWidth="1.5" />
            {/* Specular Glint */}
            <circle cx="56" cy="30" r="2.5" fill="#FFFFFF" />
          </g>
        );

      case 'ceramic_vase': // Nặng lòng
        return (
          <g>
            <defs>
              <linearGradient id="vaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDBA74" />
                <stop offset="50%" stopColor="#C2410C" />
                <stop offset="100%" stopColor="#431407" />
              </linearGradient>
            </defs>
            {/* Lip */}
            <ellipse cx="60" cy="22" rx="16" ry="4" fill="#EA580C" stroke="#FDBA74" strokeWidth="2" />
            {/* Body */}
            <path d="M46 22 L48 34 C44 48 24 64 24 82 C24 98 40 106 60 106 C80 106 96 98 96 82 C96 64 76 48 72 34 L74 22 Z"
              fill="url(#vaseGrad)"
              stroke="#EA580C"
              strokeWidth="2.5"
            />
            {/* Terracotta Ring Bands */}
            <path d="M26 80 Q60 92 94 80" stroke="#7C2D12" strokeWidth="2" fill="none" opacity="0.6" />
            <path d="M30 68 Q60 78 90 68" stroke="#FED7AA" strokeWidth="1.5" fill="none" opacity="0.5" />
          </g>
        );

      case 'porcelain_bowl': // Thanh thản
        return (
          <g>
            <defs>
              <linearGradient id="bowlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#BBF7D0" />
                <stop offset="50%" stopColor="#34D399" />
                <stop offset="100%" stopColor="#065F46" />
              </linearGradient>
            </defs>
            {/* Bowl Base Ring */}
            <ellipse cx="60" cy="98" rx="24" ry="5" fill="#047857" stroke="#6EE7B7" strokeWidth="1.5" />
            {/* Bowl Body */}
            <path d="M16 46 C18 84 38 98 60 98 C82 98 102 84 104 46 Z" fill="url(#bowlGrad)" stroke="#A7F3D0" strokeWidth="2.5" />
            {/* Bowl Rim */}
            <ellipse cx="60" cy="46" rx="44" ry="12" fill="#6EE7B7" stroke="#ECFDF5" strokeWidth="2" />
            <ellipse cx="60" cy="47" rx="40" ry="10" fill="#064E3B" />
            <ellipse cx="60" cy="48" rx="36" ry="8" fill="#065F46" opacity="0.8" />
          </g>
        );

      case 'sun_plate': // Hy vọng
        return (
          <g>
            <defs>
              <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="45%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#92400E" />
              </linearGradient>
            </defs>
            {/* Outer Rim */}
            <circle cx="60" cy="60" r="46" fill="url(#sunGrad)" stroke="#FEF08A" strokeWidth="3" />
            {/* Inner Ring */}
            <circle cx="60" cy="60" r="34" fill="#78350F" stroke="#FDE047" strokeWidth="2" />
            <circle cx="60" cy="60" r="26" fill="#F59E0B" opacity="0.9" />
            <circle cx="60" cy="60" r="16" fill="#FEF08A" opacity="0.95" />
          </g>
        );

      case 'heart_gem': // Biết ơn
        return (
          <g>
            <defs>
              <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FBCFE8" />
                <stop offset="45%" stopColor="#EC4899" />
                <stop offset="100%" stopColor="#831843" />
              </linearGradient>
            </defs>
            <path d="M60 98 C24 74 16 54 16 38 C16 24 26 16 38 16 C48 16 56 22 60 30 C64 22 72 16 82 16 C94 16 104 24 104 38 C104 54 96 74 60 98 Z"
              fill="url(#heartGrad)"
              stroke="#F472B6"
              strokeWidth="2.5"
            />
            {/* Heart Facets */}
            <path d="M60 30 L60 96" stroke="#BE185D" strokeWidth="1.5" opacity="0.6" />
            <path d="M38 16 L60 62 L82 16" stroke="#FBCFE8" strokeWidth="1.5" fill="none" opacity="0.7" />
          </g>
        );

      case 'ceramic_bell': // Dịu êm
      default:
        return (
          <g>
            <defs>
              <linearGradient id="bellGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DDD6FE" />
                <stop offset="45%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#4C1D95" />
              </linearGradient>
            </defs>
            {/* Bell Loop */}
            <ellipse cx="60" cy="20" rx="8" ry="6" fill="none" stroke="#DDD6FE" strokeWidth="2.5" />
            {/* Bell Clapper */}
            <circle cx="60" cy="94" r="7" fill="#C4B5FD" stroke="#6D28D9" strokeWidth="2" />
            {/* Bell Flare */}
            <path d="M52 24 C52 40 30 68 24 86 C24 90 28 92 60 92 C92 92 96 90 96 86 C90 68 68 40 68 24 Z"
              fill="url(#bellGrad)"
              stroke="#A78BFA"
              strokeWidth="2.5"
            />
            <ellipse cx="60" cy="88" rx="36" ry="6" fill="#5B21B6" stroke="#DDD6FE" strokeWidth="1.5" />
          </g>
        );
    }
  };

  // Distinct crack paths matching each object geometry
  const renderCracksAndGold = () => {
    let crackPathD = 'M38 34 Q52 50 48 68 T66 88 T82 96';
    let secondaryCrackD = 'M48 68 L74 60 L86 42';

    if (objectType === 'glass_jar') {
      crackPathD = 'M46 26 L54 44 L40 62 L64 78 L58 98 L76 104';
      secondaryCrackD = 'M40 62 L28 72 L32 90';
    } else if (objectType === 'tea_cup') {
      crackPathD = 'M38 46 L46 64 L36 78 L56 94';
      secondaryCrackD = 'M46 64 L70 68 L80 82';
    } else if (objectType === 'star_crystal') {
      crackPathD = 'M60 18 L52 42 L68 62 L48 84 L64 94';
      secondaryCrackD = 'M68 62 L84 56';
    } else if (objectType === 'ceramic_vase') {
      crackPathD = 'M56 24 L44 48 L68 66 L36 82 L64 102';
      secondaryCrackD = 'M68 66 L86 78';
    } else if (objectType === 'sun_plate') {
      crackPathD = 'M60 16 L56 38 L68 60 L48 80 L60 104';
      secondaryCrackD = 'M68 60 L92 66';
    } else if (objectType === 'heart_gem') {
      crackPathD = 'M44 24 L56 46 L44 68 L60 96';
      secondaryCrackD = 'M56 46 L78 52';
    } else if (objectType === 'porcelain_bowl') {
      crackPathD = 'M34 46 L46 64 L40 80 L60 96 L78 82';
      secondaryCrackD = 'M46 64 L68 68';
    }

    return (
      <g>
        {/* Layer 1: Dark physical crack fissure */}
        <path
          d={crackPathD}
          fill="none"
          stroke="#0F172A"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
        <path
          d={secondaryCrackD}
          fill="none"
          stroke="#0F172A"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        />

        {/* Layer 2: Glowing Golden Kintsugi Seam (Animated by progress) */}
        {clampedProgress > 0 && (
          <>
            {/* Outer golden glow aura */}
            <path
              d={crackPathD}
              fill="none"
              stroke="#FDE047"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="140"
              strokeDashoffset={seamDashOffset}
              filter="url(#goldAuraGlow)"
              opacity={clampedProgress > 80 ? 0.95 : 0.75}
              className="transition-all duration-300"
            />
            {/* Solid gold core seam */}
            <path
              d={crackPathD}
              fill="none"
              stroke="#EAB308"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="140"
              strokeDashoffset={seamDashOffset}
              className="transition-all duration-300"
            />
            {/* Sparkling white highlight along gold center */}
            <path
              d={crackPathD}
              fill="none"
              stroke="#FEF08A"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="140"
              strokeDashoffset={seamDashOffset}
              className="transition-all duration-300"
            />

            {/* Secondary crack gold filling */}
            {clampedProgress > 40 && (
              <>
                <path
                  d={secondaryCrackD}
                  fill="none"
                  stroke="#FDE047"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="90"
                  strokeDashoffset={Math.max(0, 90 - ((clampedProgress - 40) / 60) * 90)}
                  filter="url(#goldAuraGlow)"
                  opacity="0.8"
                  className="transition-all duration-300"
                />
                <path
                  d={secondaryCrackD}
                  fill="none"
                  stroke="#EAB308"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="90"
                  strokeDashoffset={Math.max(0, 90 - ((clampedProgress - 40) / 60) * 90)}
                  className="transition-all duration-300"
                />
              </>
            )}

            {/* Radiant golden stardust particles at seam junction */}
            {isHealed && (
              <g className="animate-pulse">
                <circle cx="56" cy="46" r="2.5" fill="#FEF08A" filter="url(#goldAuraGlow)" />
                <circle cx="68" cy="62" r="3" fill="#FFFFFF" filter="url(#goldAuraGlow)" />
                <circle cx="44" cy="68" r="2" fill="#FEF08A" />
                <circle cx="60" cy="94" r="2.5" fill="#FDE047" />
              </g>
            )}
          </>
        )}
      </g>
    );
  };

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      {/* Background Soft Glow */}
      {showGlow && (
        <div
          className="absolute inset-0 rounded-full blur-2xl pointer-events-none opacity-40 transition-all duration-500"
          style={{
            backgroundColor: isHealed ? '#FBBF24' : meta.primaryColor,
            transform: isHealed ? 'scale(1.2)' : 'scale(1)'
          }}
        />
      )}

      {/* SVG Canvas */}
      <svg
        width={currentSize.width}
        height={currentSize.height}
        viewBox={`0 0 ${currentSize.viewBoxSize} ${currentSize.viewBoxSize}`}
        className="relative z-10 drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]"
      >
        <defs>
          <filter id="goldAuraGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Base Vessel */}
        {renderObjectBody()}

        {/* 2. Cracks & Kintsugi Gold */}
        {renderCracksAndGold()}
      </svg>
    </div>
  );
};
