import React from 'react';
import { GrowthStage } from '../types';

interface PlantGraphicProps {
  stage: GrowthStage;
  plantType?: 'leafy' | 'bush' | 'flower' | 'clover' | 'tree';
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  animate?: boolean;
  className?: string;
}

export const normalizeStage = (raw: GrowthStage): 'seed' | 'sprout' | 'sapling' | 'growing' | 'mature' | 'special' => {
  if (raw === 'seed') return 'seed';
  if (raw === 'sprout') return 'sprout';
  if (raw === 'sapling' || raw === 'bud') return 'sapling';
  if (raw === 'growing') return 'growing';
  if (raw === 'mature' || raw === 'blooming') return 'mature';
  if (raw === 'special' || raw === 'celestial') return 'special';
  return 'seed';
};

export const PlantGraphic: React.FC<PlantGraphicProps> = ({
  stage,
  plantType = 'leafy',
  color = '#A8D2C4',
  size = 'md',
  animate = true,
  className = ''
}) => {
  const normStage = normalizeStage(stage);

  const sizeDimensions = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    hero: 'w-40 h-40 sm:w-48 sm:h-48'
  };

  const uid = `pg-${normStage}-${Math.floor(Math.random() * 10000)}`;

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${sizeDimensions[size]} ${
        animate && normStage !== 'seed' ? 'animate-breathe' : ''
      } ${className}`}
    >
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <defs>
          {/* Soil Gradient */}
          <radialGradient id={`soilMound-${uid}`} cx="50%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#4A3828" />
            <stop offset="60%" stopColor="#2E2218" />
            <stop offset="100%" stopColor="#1B140E" />
          </radialGradient>

          {/* Seed Shell Volumetric Gradient */}
          <radialGradient id={`seedGrad-${uid}`} cx="35%" cy="30%" r="68%">
            <stop offset="0%" stopColor="#DFC3A0" />
            <stop offset="40%" stopColor="#A8815B" />
            <stop offset="85%" stopColor="#6C4E33" />
            <stop offset="100%" stopColor="#422D1B" />
          </radialGradient>

          {/* Sprout & Leaf Gradients */}
          <linearGradient id={`stemGrad-${uid}`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#356E4A" />
            <stop offset="50%" stopColor="#5EA878" />
            <stop offset="100%" stopColor="#8EE0A9" />
          </linearGradient>

          <radialGradient id={`leafGrad-${uid}`} cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#C9F7D9" />
            <stop offset="40%" stopColor="#7CD99D" />
            <stop offset="80%" stopColor="#3F9762" />
            <stop offset="100%" stopColor="#256B41" />
          </radialGradient>

          {/* Darker Leaf Underlayer */}
          <radialGradient id={`leafUnder-${uid}`} cx="40%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#68BE87" />
            <stop offset="70%" stopColor="#2C7046" />
            <stop offset="100%" stopColor="#18492C" />
          </radialGradient>

          {/* Magical Special Glow */}
          <radialGradient id={`starlightAura-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <stop offset="50%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>

          {/* Flower Petal Gradient (if flower type) */}
          <radialGradient id={`petalGrad-${uid}`} cx="45%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor={color} />
            <stop offset="100%" stopColor="#6A539B" />
          </radialGradient>
        </defs>

        {/* ============================================================ */}
        {/* COMMON GROUND SOIL MOUND                                      */}
        {/* ============================================================ */}
        <ellipse cx="80" cy="142" rx="46" ry="11" fill="#0C0E1A" fillOpacity="0.5" />
        <ellipse cx="80" cy="138" rx="42" ry="9" fill={`url(#soilMound-${uid})`} />
        {/* Soil Crumbs */}
        <circle cx="62" cy="138" r="2.5" fill="#5A4533" />
        <circle cx="98" cy="137" r="2.2" fill="#5A4533" />
        <circle cx="75" cy="141" r="1.8" fill="#38291D" />
        <circle cx="88" cy="142" r="2" fill="#38291D" />

        {/* ============================================================ */}
        {/* 1. HẠT GIỐNG: A clearly visible seed sitting in soil          */}
        {/* ============================================================ */}
        {normStage === 'seed' && (
          <g>
            {/* Seed Depression Shadow in soil */}
            <ellipse cx="80" cy="132" rx="15" ry="6" fill="#1C140E" opacity="0.8" />
            
            {/* The Clearly Visible Volumetric Seed */}
            <path
              d="M 80 106 
                 C 92 118, 95 133, 80 135 
                 C 65 133, 68 118, 80 106 Z"
              fill={`url(#seedGrad-${uid})`}
              filter="drop-shadow(0 3px 5px rgba(0,0,0,0.3))"
            />
            {/* Seed Crease / Seam with vital glow */}
            <path
              d="M 80 110 Q 82 122 80 132"
              stroke="#D8BD97"
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity="0.85"
            />
            {/* Specular Highlight on Seed Shell */}
            <ellipse
              cx="76"
              cy="118"
              rx="4"
              ry="8"
              transform="rotate(-25 76 118)"
              fill="#FFFFFF"
              fillOpacity="0.45"
            />
            {/* Subtle Sleeping Life Sparkle */}
            <circle cx="80" cy="120" r="1.5" fill="#C9F7D9" className="animate-pulse" />
          </g>
        )}

        {/* ============================================================ */}
        {/* 2. MẦM NON: A tiny green sprout emerging from the soil        */}
        {/* ============================================================ */}
        {normStage === 'sprout' && (
          <g>
            {/* Cracked Seed Base */}
            <path d="M 72 134 C 74 130, 80 131, 82 135 Z" fill="#6C4E33" />
            <path d="M 82 134 C 84 130, 88 131, 89 135 Z" fill="#6C4E33" />

            {/* Emerging Slender Curved Stem */}
            <path
              d="M 80 135 C 80 120, 78 108, 80 98"
              stroke={`url(#stemGrad-${uid})`}
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Left Cotyledon (Baby Leaf) */}
            <path
              d="M 80 100 C 68 95, 62 104, 72 108 C 76 109, 79 104, 80 100 Z"
              fill={`url(#leafGrad-${uid})`}
              filter="drop-shadow(0 2px 3px rgba(0,0,0,0.15))"
            />
            {/* Right Cotyledon (Baby Leaf) */}
            <path
              d="M 80 98 C 92 93, 98 102, 88 106 C 84 107, 81 102, 80 98 Z"
              fill={`url(#leafGrad-${uid})`}
              filter="drop-shadow(0 2px 3px rgba(0,0,0,0.15))"
            />

            {/* Dewdrop on leaf */}
            <circle cx="68" cy="101" r="2" fill="#FFFFFF" opacity="0.9" />
            <circle cx="67.5" cy="100.5" r="0.8" fill="#FFFFFF" />
          </g>
        )}

        {/* ============================================================ */}
        {/* 3. CÂY CON: A small plant with several visible leaves         */}
        {/* ============================================================ */}
        {normStage === 'sapling' && (
          <g>
            {/* Main Central Stem */}
            <path
              d="M 80 136 C 80 115, 82 92, 80 74"
              stroke={`url(#stemGrad-${uid})`}
              strokeWidth="4.5"
              strokeLinecap="round"
            />

            {/* Lower Left Leaf Pair */}
            <path
              d="M 79 114 C 60 112, 54 125, 68 128 C 74 129, 78 122, 79 114 Z"
              fill={`url(#leafUnder-${uid})`}
            />
            <path
              d="M 81 110 C 100 108, 106 121, 92 124 C 86 125, 82 118, 81 110 Z"
              fill={`url(#leafUnder-${uid})`}
            />

            {/* Mid Leaves */}
            <path
              d="M 80 94 C 58 88, 56 102, 70 106 C 76 107, 79 99, 80 94 Z"
              fill={`url(#leafGrad-${uid})`}
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
            />
            <path
              d="M 80 90 C 102 84, 104 98, 90 102 C 84 103, 81 95, 80 90 Z"
              fill={`url(#leafGrad-${uid})`}
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
            />

            {/* Top Tender Shoot Tip */}
            <path
              d="M 80 74 C 74 65, 78 56, 80 54 C 82 56, 86 65, 80 74 Z"
              fill={`url(#leafGrad-${uid})`}
            />
            <circle cx="80" cy="58" r="1.8" fill="#FFFFFF" opacity="0.9" />
          </g>
        )}

        {/* ============================================================ */}
        {/* 4. CÂY ĐANG LỚN: A noticeably taller plant with more leaves   */}
        {/* ============================================================ */}
        {normStage === 'growing' && (
          <g>
            {/* Taller Main Stem with subtle organic curve */}
            <path
              d="M 80 136 C 80 110, 84 75, 78 48"
              stroke={`url(#stemGrad-${uid})`}
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Low Foliage Branching */}
            <path
              d="M 80 118 C 52 114, 46 130, 64 135 C 72 136, 78 128, 80 118 Z"
              fill={`url(#leafUnder-${uid})`}
            />
            <path
              d="M 80 114 C 108 110, 114 126, 96 131 C 88 132, 82 124, 80 114 Z"
              fill={`url(#leafUnder-${uid})`}
            />

            {/* Mid-Tier Foliage (Larger, arching silhouette) */}
            <path
              d="M 81 96 C 48 88, 44 105, 65 112 C 74 114, 79 104, 81 96 Z"
              fill={`url(#leafGrad-${uid})`}
              filter="drop-shadow(0 3px 6px rgba(0,0,0,0.2))"
            />
            <path
              d="M 81 90 C 114 82, 118 99, 97 106 C 88 108, 83 98, 81 90 Z"
              fill={`url(#leafGrad-${uid})`}
              filter="drop-shadow(0 3px 6px rgba(0,0,0,0.2))"
            />

            {/* Upper Leaves */}
            <path
              d="M 79 72 C 55 64, 54 78, 68 83 C 74 85, 78 78, 79 72 Z"
              fill={`url(#leafGrad-${uid})`}
            />
            <path
              d="M 79 66 C 103 58, 104 72, 90 77 C 84 79, 80 72, 79 66 Z"
              fill={`url(#leafGrad-${uid})`}
            />

            {/* Crown Crest */}
            <path
              d="M 78 48 C 72 38, 76 28, 78 25 C 80 28, 84 38, 78 48 Z"
              fill={`url(#leafGrad-${uid})`}
            />
            <circle cx="78" cy="32" r="2.2" fill="#FFFFFF" opacity="0.95" />
          </g>
        )}

        {/* ============================================================ */}
        {/* 5. CÂY TRƯỞNG THÀNH: Mature plant / bush / tree-like          */}
        {/* ============================================================ */}
        {normStage === 'mature' && (
          <g>
            {/* Trunk / Base Sturdy Stem */}
            <path
              d="M 77 136 L 83 136 L 81 85 L 78 85 Z"
              fill="#423428"
            />
            <path
              d="M 80 136 C 80 100, 81 65, 80 40"
              stroke={`url(#stemGrad-${uid})`}
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Lush Tier 1: Deep Background Canopy Shadow */}
            <circle cx="56" cy="95" r="22" fill={`url(#leafUnder-${uid})`} />
            <circle cx="104" cy="95" r="22" fill={`url(#leafUnder-${uid})`} />
            <circle cx="54" cy="65" r="24" fill={`url(#leafUnder-${uid})`} />
            <circle cx="106" cy="65" r="24" fill={`url(#leafUnder-${uid})`} />
            <circle cx="80" cy="45" r="26" fill={`url(#leafUnder-${uid})`} />

            {/* Lush Tier 2: Mid Foliage Canopy */}
            <circle cx="62" cy="88" r="20" fill={`url(#leafGrad-${uid})`} />
            <circle cx="98" cy="88" r="20" fill={`url(#leafGrad-${uid})`} />
            <circle cx="60" cy="60" r="22" fill={`url(#leafGrad-${uid})`} />
            <circle cx="100" cy="60" r="22" fill={`url(#leafGrad-${uid})`} />
            <circle cx="80" cy="38" r="24" fill={`url(#leafGrad-${uid})`} />

            {/* Lush Tier 3: Foreground Sunlit Fronds / Leaves */}
            <path
              d="M 70 82 C 45 75, 42 90, 60 95 Z"
              fill={`url(#leafGrad-${uid})`}
              filter="drop-shadow(0 3px 5px rgba(0,0,0,0.15))"
            />
            <path
              d="M 90 82 C 115 75, 118 90, 100 95 Z"
              fill={`url(#leafGrad-${uid})`}
              filter="drop-shadow(0 3px 5px rgba(0,0,0,0.15))"
            />

            {/* If Flower Type or Blooming Canopy Feature */}
            {plantType === 'flower' ? (
              <g transform="translate(80, 36)">
                {/* 5 Petal Blossom */}
                <circle cx="-10" cy="-6" r="8" fill={`url(#petalGrad-${uid})`} />
                <circle cx="10" cy="-6" r="8" fill={`url(#petalGrad-${uid})`} />
                <circle cx="-6" cy="8" r="8" fill={`url(#petalGrad-${uid})`} />
                <circle cx="6" cy="8" r="8" fill={`url(#petalGrad-${uid})`} />
                <circle cx="0" cy="-12" r="8" fill={`url(#petalGrad-${uid})`} />
                <circle cx="0" cy="0" r="6" fill="#FFFCE8" />
              </g>
            ) : (
              /* High-crown leaves and dew drops */
              <>
                <circle cx="76" cy="30" r="2.5" fill="#FFFFFF" opacity="0.9" />
                <circle cx="88" cy="44" r="2" fill="#FFFFFF" opacity="0.8" />
                <circle cx="68" cy="55" r="2" fill="#FFFFFF" opacity="0.8" />
              </>
            )}
          </g>
        )}

        {/* ============================================================ */}
        {/* 6. CỘT MỐC ĐẶC BIỆT: Special mature plant with magical glow   */}
        {/* ============================================================ */}
        {normStage === 'special' && (
          <g>
            {/* Luminous Starlight Aura Blooming from Plant */}
            <circle
              cx="80"
              cy="70"
              r="65"
              fill={`url(#starlightAura-${uid})`}
              className="animate-pulse"
            />

            {/* Celestial Floating Micro-Stars */}
            <g className="animate-pulse-glow">
              <polygon points="40,55 42,60 47,61 43,64 44,69 40,66 36,69 37,64 33,61 38,60" fill="#FFFBE6" />
              <polygon points="120,50 122,55 127,56 123,59 124,64 120,61 116,64 117,59 113,56 118,55" fill="#FFFBE6" />
              <polygon points="80,12 82,17 87,18 83,21 84,26 80,23 76,26 77,21 73,18 78,17" fill="#FFFBE6" />
              <circle cx="48" cy="85" r="2.5" fill="#FFFFFF" />
              <circle cx="112" cy="85" r="2.5" fill="#FFFFFF" />
            </g>

            {/* Trunk / Base Sturdy Stem */}
            <path
              d="M 76 136 L 84 136 L 82 85 L 78 85 Z"
              fill="#523F32"
            />
            <path
              d="M 80 136 C 80 100, 81 65, 80 35"
              stroke="#A8E8BD"
              strokeWidth="6.5"
              strokeLinecap="round"
              filter={`drop-shadow(0 0 8px ${color})`}
            />

            {/* Deep Volumetric Shaded Canopy */}
            <circle cx="54" cy="90" r="24" fill={`url(#leafUnder-${uid})`} />
            <circle cx="106" cy="90" r="24" fill={`url(#leafUnder-${uid})`} />
            <circle cx="50" cy="58" r="26" fill={`url(#leafUnder-${uid})`} />
            <circle cx="110" cy="58" r="26" fill={`url(#leafUnder-${uid})`} />
            <circle cx="80" cy="35" r="28" fill={`url(#leafUnder-${uid})`} />

            {/* Luminous Emerald / Starlight Canopy */}
            <circle cx="60" cy="82" r="22" fill={`url(#leafGrad-${uid})`} />
            <circle cx="100" cy="82" r="22" fill={`url(#leafGrad-${uid})`} />
            <circle cx="56" cy="52" r="24" fill={`url(#leafGrad-${uid})`} />
            <circle cx="104" cy="52" r="24" fill={`url(#leafGrad-${uid})`} />
            <circle cx="80" cy="30" r="26" fill={`url(#leafGrad-${uid})`} />

            {/* Glowing Celestial Veins on Leaves */}
            <path d="M 80 30 Q 65 45 56 55" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
            <path d="M 80 30 Q 95 45 104 55" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
            <path d="M 80 50 Q 68 70 60 82" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
            <path d="M 80 50 Q 92 70 100 82" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />

            {/* Crown Milestone Crystal */}
            <circle cx="80" cy="22" r="6" fill="#FFFDE8" filter={`drop-shadow(0 0 10px #FFFFFF)`} />
            <polygon points="80,14 83,20 89,22 83,24 80,30 77,24 71,22 77,20" fill="#FFFFFF" />
          </g>
        )}
      </svg>
    </div>
  );
};
