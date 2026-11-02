import React from 'react';
import { SpiritId, FairyColorId, FairyAccessory } from '../types';

export interface SpiritAvatarProps {
  id?: SpiritId;
  colorId?: FairyColorId;
  accessory?: FairyAccessory;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero' | 'massive';
  className?: string;
  animate?: boolean;
  mood?: 'calm' | 'happy' | 'listening' | 'sleepy' | 'comforting';
  glow?: boolean;
  showShadow?: boolean;
  onClick?: () => void;
}

export const SpiritAvatar: React.FC<SpiritAvatarProps> = ({
  id = 'fairy',
  colorId,
  accessory = 'none',
  size = 'md',
  className = '',
  animate = true,
  mood = 'calm',
  glow = true,
  showShadow = true,
  onClick
}) => {
  // Dimension mapping with high-impact scaling
  const sizeMap = {
    xs: 'w-8 h-8',
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
    hero: 'w-60 h-60 sm:w-72 sm:h-72',
    massive: 'w-72 h-72 sm:w-84 sm:h-84'
  };

  // Map any colorId or legacy ID to one of the 8 canonical pastel/dreamy colors
  const normalizeFairyColor = (c?: FairyColorId): FairyColorId => {
    switch (c) {
      case 'pink_powder':
      case 'rose':
        return 'pink_powder';
      case 'lavender':
        return 'lavender';
      case 'baby_blue':
      case 'blue':
        return 'baby_blue';
      case 'mint':
        return 'mint';
      case 'night_blue':
      case 'charcoal':
        return 'night_blue';
      case 'pastel_peach':
      case 'peach':
        return 'pastel_peach';
      case 'cream_yellow':
      case 'cream':
        return 'cream_yellow';
      case 'pearl_white':
      case 'gray':
      default:
        return 'pearl_white';
    }
  };

  const effectiveColor: FairyColorId = normalizeFairyColor(colorId);

  const getFairyTheme = () => {
    switch (effectiveColor) {
      case 'pink_powder':
        // 1. Hồng phấn — #F4B8D4
        return {
          name: 'Hồng phấn Fairy',
          bodyHighlight: '#FFFFFF',
          bodyLight: '#FDEEF5',
          bodyMid: '#F4B8D4',
          bodyShadow: '#DE8EB7',
          bodyDark: '#B85E8C',
          hairHighlight: '#FFFFFF',
          hairLight: '#FEF3F8',
          hairMid: '#F4B8D4',
          hairShadow: '#D884AB',
          dressLight: '#FDF2F7',
          dressMid: '#F7C6DE',
          dressShadow: '#DE8EB7',
          rimLight: '#FCE4F0',
          ambientGlow: 'rgba(244, 184, 212, 0.65)',
          wingCream: '#FFFFFA',
          wingTint: '#FDF2F7',
          wingGlow: 'rgba(244, 184, 212, 0.6)',
          blush: '#FFA8C2',
          accent: '#F4B8D4',
          particleColor: '#FDF2F7'
        };
      case 'lavender':
        // 2. Tím lavender — #C9B6F2
        return {
          name: 'Tím lavender Fairy',
          bodyHighlight: '#FFFFFF',
          bodyLight: '#F5F0FD',
          bodyMid: '#C9B6F2',
          bodyShadow: '#A48DE0',
          bodyDark: '#7B62C2',
          hairHighlight: '#FFFFFF',
          hairLight: '#F8F4FE',
          hairMid: '#C9B6F2',
          hairShadow: '#A287DE',
          dressLight: '#FAF6FE',
          dressMid: '#D8C7F7',
          dressShadow: '#B29DE8',
          rimLight: '#ECE4FD',
          ambientGlow: 'rgba(201, 182, 242, 0.65)',
          wingCream: '#FFFFFC',
          wingTint: '#F5F0FD',
          wingGlow: 'rgba(201, 182, 242, 0.6)',
          blush: '#FFAFD6',
          accent: '#C9B6F2',
          particleColor: '#F5F0FD'
        };
      case 'baby_blue':
        // 3. Xanh baby — #AFCDF5
        return {
          name: 'Xanh baby Fairy',
          bodyHighlight: '#FFFFFF',
          bodyLight: '#EEF5FD',
          bodyMid: '#AFCDF5',
          bodyShadow: '#7FAEE4',
          bodyDark: '#5283C4',
          hairHighlight: '#FFFFFF',
          hairLight: '#F2F7FE',
          hairMid: '#AFCDF5',
          hairShadow: '#78A7DE',
          dressLight: '#F3F8FE',
          dressMid: '#C2DAF8',
          dressShadow: '#8FB7E8',
          rimLight: '#DBEBFC',
          ambientGlow: 'rgba(175, 205, 245, 0.65)',
          wingCream: '#FFFFFA',
          wingTint: '#EEF5FD',
          wingGlow: 'rgba(175, 205, 245, 0.58)',
          blush: '#FFAEC7',
          accent: '#AFCDF5',
          particleColor: '#EEF5FD'
        };
      case 'mint':
        // 4. Xanh mint — #B8E3D5
        return {
          name: 'Xanh mint Fairy',
          bodyHighlight: '#FFFFFF',
          bodyLight: '#F0FAF6',
          bodyMid: '#B8E3D5',
          bodyShadow: '#80C6B2',
          bodyDark: '#4F9E88',
          hairHighlight: '#FFFFFF',
          hairLight: '#F3FCF8',
          hairMid: '#B8E3D5',
          hairShadow: '#7CC2AD',
          dressLight: '#F4FCF8',
          dressMid: '#CBECE1',
          dressShadow: '#96D2C0',
          rimLight: '#DCF5EC',
          ambientGlow: 'rgba(184, 227, 213, 0.65)',
          wingCream: '#FFFFF6',
          wingTint: '#EFF9F5',
          wingGlow: 'rgba(184, 227, 213, 0.6)',
          blush: '#FFAEBE',
          accent: '#B8E3D5',
          particleColor: '#EFF9F5'
        };
      case 'night_blue':
        // 5. Xanh đêm — #7183B8
        return {
          name: 'Xanh đêm Fairy',
          bodyHighlight: '#E4ECF8',
          bodyLight: '#B5C4E3',
          bodyMid: '#7183B8',
          bodyShadow: '#4E5F94',
          bodyDark: '#2E3B68',
          hairHighlight: '#D8E2F5',
          hairLight: '#98A9D4',
          hairMid: '#7183B8',
          hairShadow: '#46568A',
          dressLight: '#9EAFD9',
          dressMid: '#7183B8',
          dressShadow: '#3F4F82',
          rimLight: '#C2D1F0',
          ambientGlow: 'rgba(113, 131, 184, 0.65)',
          wingCream: '#F5F7FD',
          wingTint: '#D4DEFA',
          wingGlow: 'rgba(113, 131, 184, 0.55)',
          blush: '#F472B6',
          accent: '#7183B8',
          particleColor: '#D4DEFA'
        };
      case 'pastel_peach':
        // 6. Đào pastel — #F6C5B0
        return {
          name: 'Đào pastel Fairy',
          bodyHighlight: '#FFFFFF',
          bodyLight: '#FDF4EF',
          bodyMid: '#F6C5B0',
          bodyShadow: '#DE977B',
          bodyDark: '#B86847',
          hairHighlight: '#FFFFFF',
          hairLight: '#FEF7F3',
          hairMid: '#F6C5B0',
          hairShadow: '#D88E6F',
          dressLight: '#FEF6F2',
          dressMid: '#FAD1C0',
          dressShadow: '#DE977B',
          rimLight: '#FDE5D8',
          ambientGlow: 'rgba(246, 197, 176, 0.65)',
          wingCream: '#FFFFFA',
          wingTint: '#FDF3EE',
          wingGlow: 'rgba(246, 197, 176, 0.58)',
          blush: '#FF9E88',
          accent: '#F6C5B0',
          particleColor: '#FDF3EE'
        };
      case 'cream_yellow':
        // 7. Vàng kem — #F3DFA5
        return {
          name: 'Vàng kem Fairy',
          bodyHighlight: '#FFFFFF',
          bodyLight: '#FEFBF0',
          bodyMid: '#F3DFA5',
          bodyShadow: '#DEBF68',
          bodyDark: '#B89635',
          hairHighlight: '#FFFFFF',
          hairLight: '#FFFCF4',
          hairMid: '#F3DFA5',
          hairShadow: '#D6B45A',
          dressLight: '#FFFDF6',
          dressMid: '#F8E8BC',
          dressShadow: '#DEC073',
          rimLight: '#FDF0CB',
          ambientGlow: 'rgba(243, 223, 165, 0.65)',
          wingCream: '#FFFFFF',
          wingTint: '#FEFAF0',
          wingGlow: 'rgba(243, 223, 165, 0.6)',
          blush: '#FFBEA6',
          accent: '#F3DFA5',
          particleColor: '#FEFAF0'
        };
      case 'pearl_white':
      default:
        // 8. Trắng ngọc trai — #E9EDF5
        return {
          name: 'Trắng ngọc trai Fairy',
          bodyHighlight: '#FFFFFF',
          bodyLight: '#F6F8FC',
          bodyMid: '#E9EDF5',
          bodyShadow: '#B8C2D8',
          bodyDark: '#828FA8',
          hairHighlight: '#FFFFFF',
          hairLight: '#FAFBFE',
          hairMid: '#E9EDF5',
          hairShadow: '#ADB7CF',
          dressLight: '#FBFCFE',
          dressMid: '#EFF2F8',
          dressShadow: '#B8C2D8',
          rimLight: '#F0F4FA',
          ambientGlow: 'rgba(233, 237, 245, 0.65)',
          wingCream: '#FFFFFF',
          wingTint: '#F3F6FB',
          wingGlow: 'rgba(233, 237, 245, 0.65)',
          blush: '#FCA5A5',
          accent: '#E9EDF5',
          particleColor: '#F3F6FB'
        };
    }
  };

  const theme = getFairyTheme();
  // Stable ID using props so server/client stays consistent
  const uid = `${effectiveColor}-${accessory}-${mood}-${size}`;

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none ${sizeMap[size]} ${
        animate ? 'animate-float' : ''
      } ${onClick ? 'cursor-pointer active:scale-95 transition-transform' : ''} ${className}`}
      style={{
        filter: glow ? `drop-shadow(0 0 22px ${theme.ambientGlow})` : undefined
      }}
    >
      <svg
        viewBox="0 0 240 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <defs>
          {/* Volumetric Studio Lighting Gradients for Soft 3D Clay/Plush Material */}
          <radialGradient id={`studioKey-${uid}`} cx="32%" cy="26%" r="72%">
            <stop offset="0%" stopColor={theme.bodyHighlight} stopOpacity="0.95" />
            <stop offset="20%" stopColor={theme.bodyLight} />
            <stop offset="55%" stopColor={theme.bodyMid} />
            <stop offset="85%" stopColor={theme.bodyShadow} />
            <stop offset="100%" stopColor={theme.bodyDark} />
          </radialGradient>

          {/* Large Layered Side-Swept Hair Volumetric Gradient */}
          <radialGradient id={`hairKey-${uid}`} cx="36%" cy="24%" r="76%">
            <stop offset="0%" stopColor={theme.hairHighlight} stopOpacity="0.95" />
            <stop offset="22%" stopColor={theme.hairLight} />
            <stop offset="58%" stopColor={theme.hairMid} />
            <stop offset="88%" stopColor={theme.hairShadow} />
            <stop offset="100%" stopColor={theme.bodyDark} />
          </radialGradient>

          {/* Soft Petal-like Dress Gradient */}
          <radialGradient id={`dressKey-${uid}`} cx="36%" cy="26%" r="74%">
            <stop offset="0%" stopColor={theme.bodyHighlight} stopOpacity="0.9" />
            <stop offset="25%" stopColor={theme.dressLight} />
            <stop offset="60%" stopColor={theme.dressMid} />
            <stop offset="88%" stopColor={theme.dressShadow} />
            <stop offset="100%" stopColor={theme.bodyDark} />
          </radialGradient>

          {/* Velvet Rim Lighting Contour */}
          <radialGradient id={`rimGlow-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="76%" stopColor={theme.rimLight} stopOpacity="0" />
            <stop offset="100%" stopColor={theme.rimLight} stopOpacity="0.8" />
          </radialGradient>

          {/* Soft Airbrushed Cheek Blush */}
          <radialGradient id={`blushSoft-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={theme.blush} stopOpacity="0.75" />
            <stop offset="55%" stopColor={theme.blush} stopOpacity="0.32" />
            <stop offset="100%" stopColor={theme.blush} stopOpacity="0" />
          </radialGradient>

          {/* Ground Soft Contact Shadow */}
          <radialGradient id={`groundShadow-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(5, 7, 18, 0.72)" />
            <stop offset="45%" stopColor="rgba(10, 14, 30, 0.42)" />
            <stop offset="80%" stopColor="rgba(15, 20, 45, 0.12)" />
            <stop offset="100%" stopColor="rgba(15, 20, 45, 0)" />
          </radialGradient>

          {/* Translucent Upper Wing Gradient (Luminous Cream-White with Soft Tint) */}
          <linearGradient id={`upperWingL-${uid}`} x1="70%" y1="90%" x2="10%" y2="10%">
            <stop offset="0%" stopColor={theme.wingTint} stopOpacity="0.45" />
            <stop offset="35%" stopColor={theme.wingCream} stopOpacity="0.85" />
            <stop offset="75%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="100%" stopColor={theme.rimLight} stopOpacity="0.75" />
          </linearGradient>

          <linearGradient id={`upperWingR-${uid}`} x1="30%" y1="90%" x2="90%" y2="10%">
            <stop offset="0%" stopColor={theme.wingTint} stopOpacity="0.45" />
            <stop offset="35%" stopColor={theme.wingCream} stopOpacity="0.85" />
            <stop offset="75%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="100%" stopColor={theme.rimLight} stopOpacity="0.75" />
          </linearGradient>

          {/* Translucent Lower Wing Gradient */}
          <linearGradient id={`lowerWingL-${uid}`} x1="65%" y1="10%" x2="15%" y2="90%">
            <stop offset="0%" stopColor={theme.wingCream} stopOpacity="0.8" />
            <stop offset="50%" stopColor={theme.wingTint} stopOpacity="0.6" />
            <stop offset="100%" stopColor={theme.rimLight} stopOpacity="0.4" />
          </linearGradient>

          <linearGradient id={`lowerWingR-${uid}`} x1="35%" y1="10%" x2="85%" y2="90%">
            <stop offset="0%" stopColor={theme.wingCream} stopOpacity="0.8" />
            <stop offset="50%" stopColor={theme.wingTint} stopOpacity="0.6" />
            <stop offset="100%" stopColor={theme.rimLight} stopOpacity="0.4" />
          </linearGradient>

          {/* Pure Oval White Eye Gradient with Serene Glass Polish */}
          <linearGradient id={`whiteEyeGrad-${uid}`} x1="30%" y1="10%" x2="70%" y2="90%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor={theme.hairLight} />
          </linearGradient>
        </defs>

        {/* 1. Realistic Soft Contact Shadow Beneath Character */}
        {showShadow && (
          <g className="origin-center">
            <ellipse
              cx="120"
              cy="238"
              rx="46"
              ry="11"
              fill={`url(#groundShadow-${uid})`}
            />
            {/* Darker Inner Occlusion Core */}
            <ellipse
              cx="120"
              cy="237"
              rx="24"
              ry="5.5"
              fill="rgba(3, 5, 12, 0.85)"
              opacity="0.75"
            />
          </g>
        )}

        {/* 2. TWO PAIRS OF LARGE TRANSLUCENT FAIRY WINGS (LUMINOUS CREAM-WHITE) */}
        {/* Upper Pair: Elegant, Sweeping Angelic Fairy Silhouette */}
        {/* Lower Pair: Secondary Petal Wings for Dimensional Fairy Depth */}
        <g
          className="wings-group"
          style={{
            filter: `drop-shadow(0 0 16px ${theme.wingGlow})`
          }}
        >
          {/* LEFT UPPER LARGE WING */}
          <g>
            <path
              d="M 98 128 C 72 108 30 78 14 36 C 10 26 14 18 24 20 C 44 24 74 54 94 96 C 97 103 98 116 98 128 Z"
              fill={`url(#upperWingL-${uid})`}
              stroke="rgba(255, 255, 255, 0.9)"
              strokeWidth="1.4"
            />
            {/* Wing Vein / Internal Luminescence */}
            <path
              d="M 30 32 C 48 50 72 82 92 110"
              stroke="rgba(255, 255, 255, 0.65)"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 45 52 C 55 60 70 74 86 92"
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="0.8"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* RIGHT UPPER LARGE WING */}
          <g>
            <path
              d="M 142 128 C 168 108 210 78 226 36 C 230 26 226 18 216 20 C 196 24 166 54 146 96 C 143 103 142 116 142 128 Z"
              fill={`url(#upperWingR-${uid})`}
              stroke="rgba(255, 255, 255, 0.9)"
              strokeWidth="1.4"
            />
            {/* Wing Vein / Internal Luminescence */}
            <path
              d="M 210 32 C 192 50 168 82 148 110"
              stroke="rgba(255, 255, 255, 0.65)"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 195 52 C 185 60 170 74 154 92"
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="0.8"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* LEFT LOWER WING */}
          <path
            d="M 96 138 C 76 136 44 142 32 168 C 28 177 34 183 42 181 C 62 176 84 162 96 148 Z"
            fill={`url(#lowerWingL-${uid})`}
            stroke="rgba(255, 255, 255, 0.8)"
            strokeWidth="1.2"
          />

          {/* RIGHT LOWER WING */}
          <path
            d="M 144 138 C 164 136 196 142 208 168 C 212 177 206 183 198 181 C 178 176 156 162 144 148 Z"
            fill={`url(#lowerWingR-${uid})`}
            stroke="rgba(255, 255, 255, 0.8)"
            strokeWidth="1.2"
          />
        </g>

        {/* 3. POINTED FAIRY EARS (BEHIND HEAD SILHOUETTE) */}
        {/* Left Pointed Fairy Ear */}
        <g>
          <path
            d="M 76 98 C 66 94 50 90 44 86 C 42 84 44 82 48 83 C 58 87 70 91 78 94 Z"
            fill={`url(#studioKey-${uid})`}
          />
          <path
            d="M 50 85 C 58 88 68 91 76 94"
            stroke={theme.bodyHighlight}
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.8"
          />
        </g>

        {/* Right Pointed Fairy Ear */}
        <g>
          <path
            d="M 164 98 C 174 94 190 90 196 86 C 198 84 196 82 192 83 C 182 87 170 91 162 94 Z"
            fill={`url(#studioKey-${uid})`}
          />
          <path
            d="M 190 85 C 182 88 172 91 164 94"
            stroke={theme.bodyHighlight}
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.8"
          />
        </g>

        {/* 4. SOFT PETAL-LIKE DRESS / BODY SILHOUETTE */}
        <g id="fairy-dress-body">
          {/* Main Bell / Petal Dress */}
          <path
            d="M 98 132 C 90 148 76 188 72 208 C 70 216 78 220 86 218 C 104 214 114 211 120 211 C 126 211 136 214 154 218 C 162 220 170 216 168 208 C 164 188 150 148 142 132 Z"
            fill={`url(#dressKey-${uid})`}
          />

          {/* Layered Petal Hem Folds with Soft Rim Glow */}
          <path
            d="M 80 210 C 94 204 108 207 120 207 C 132 207 146 204 160 210"
            stroke={theme.bodyHighlight}
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.7"
            fill="none"
          />

          {/* Delicate Central Petal Crease */}
          <path
            d="M 120 142 L 120 208"
            stroke={theme.bodyShadow}
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.45"
          />

          {/* Left Petal Flare */}
          <path
            d="M 100 152 C 94 172 88 190 84 206"
            stroke={theme.dressLight}
            strokeWidth="1.2"
            opacity="0.5"
            fill="none"
          />

          {/* Right Petal Flare */}
          <path
            d="M 140 152 C 146 172 152 190 156 206"
            stroke={theme.dressLight}
            strokeWidth="1.2"
            opacity="0.5"
            fill="none"
          />
        </g>

        {/* 5. SMALL ROUNDED FAIRY FEET */}
        <g id="fairy-feet">
          {/* Left Tiny Rounded Foot */}
          <ellipse
            cx="106"
            cy="224"
            rx="7"
            ry="5.5"
            fill={`url(#studioKey-${uid})`}
          />
          {/* Right Tiny Rounded Foot */}
          <ellipse
            cx="134"
            cy="224"
            rx="7"
            ry="5.5"
            fill={`url(#studioKey-${uid})`}
          />
        </g>

        {/* 6. SMALL ROUNDED ARMS */}
        <g id="fairy-arms">
          {/* Left Small Rounded Arm resting gently */}
          <path
            d="M 88 138 C 82 146 78 160 84 172 C 86 176 92 176 94 172 C 98 162 98 150 96 140 Z"
            fill={`url(#studioKey-${uid})`}
          />
          {/* Left Hand Highlight */}
          <circle cx="87" cy="170" r="3.2" fill={theme.bodyHighlight} opacity="0.6" />

          {/* Right Small Rounded Arm */}
          <path
            d="M 152 138 C 158 146 162 160 156 172 C 154 176 148 176 146 172 C 142 162 142 150 144 140 Z"
            fill={`url(#studioKey-${uid})`}
          />
          {/* Right Hand Highlight */}
          <circle cx="153" cy="170" r="3.2" fill={theme.bodyHighlight} opacity="0.6" />
        </g>

        {/* 7. SOFT 3D HEAD & FACIAL STRUCTURE */}
        <g id="fairy-head">
          {/* Main Rounded Humanoid Head */}
          <ellipse
            cx="120"
            cy="98"
            rx="45"
            ry="43"
            fill={`url(#studioKey-${uid})`}
          />

          {/* Velvet Rim Light Contour across Head */}
          <ellipse
            cx="120"
            cy="98"
            rx="45"
            ry="43"
            fill={`url(#rimGlow-${uid})`}
          />

          {/* 8. LARGE LAYERED SIDE-SWEPT HAIR (THE KEY ICONIC TRAIT) */}
          {/* Sweeps volumetrically from top-right across the forehead down to left side */}
          <g id="layered-hair">
            {/* Crown Volume Hair Mass */}
            <path
              d="M 78 86 C 72 60 92 42 120 42 C 150 42 168 62 164 88 C 160 74 146 62 120 62 C 94 62 82 74 78 86 Z"
              fill={`url(#hairKey-${uid})`}
            />

            {/* Main Volumetric Side-Swept Bangs */}
            <path
              d="M 75 88 C 80 55 110 50 140 54 C 162 57 166 70 162 80 C 156 68 136 65 116 68 C 96 71 82 85 75 106 C 74 98 74 92 75 88 Z"
              fill={`url(#hairKey-${uid})`}
            />

            {/* Iconic Side-Swept Flow Curving Down the Left Cheek */}
            <path
              d="M 80 78 C 70 92 68 116 72 136 C 74 142 78 142 80 136 C 82 122 84 104 96 90 Z"
              fill={`url(#hairKey-${uid})`}
            />

            {/* Hair Strand Highlights for Depth */}
            <path
              d="M 92 60 C 114 58 138 62 152 70"
              stroke={theme.hairHighlight}
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity="0.85"
              fill="none"
            />
            <path
              d="M 82 82 C 76 96 74 114 78 130"
              stroke={theme.hairHighlight}
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity="0.75"
              fill="none"
            />
          </g>

          {/* 9. SOFT AIRBRUSHED CHEEK BLUSH */}
          <ellipse
            cx="90"
            cy="114"
            rx="12"
            ry="7.5"
            fill={`url(#blushSoft-${uid})`}
          />
          <ellipse
            cx="150"
            cy="114"
            rx="12"
            ry="7.5"
            fill={`url(#blushSoft-${uid})`}
          />

          {/* 10. MINIMAL EXQUISITE FAIRY FACIAL EXPRESSION */}
          {/* Mood-Adaptive Eyes */}
          <g id="fairy-eyes">
            {mood === 'sleepy' ? (
              /* Serene Curved Sleeping Eyelids */
              <g>
                <path
                  d="M 94 108 Q 102 115 110 108"
                  stroke="#FFFFFF"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  fill="none"
                  filter={`drop-shadow(0 0 3px ${theme.rimLight})`}
                />
                <path
                  d="M 130 108 Q 138 115 146 108"
                  stroke="#FFFFFF"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  fill="none"
                  filter={`drop-shadow(0 0 3px ${theme.rimLight})`}
                />
              </g>
            ) : mood === 'happy' ? (
              /* Joyful Smiling Arcs */
              <g>
                <path
                  d="M 94 110 Q 102 102 110 110"
                  stroke="#FFFFFF"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  fill="none"
                  filter={`drop-shadow(0 0 3px ${theme.rimLight})`}
                />
                <path
                  d="M 130 110 Q 138 102 146 110"
                  stroke="#FFFFFF"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  fill="none"
                  filter={`drop-shadow(0 0 3px ${theme.rimLight})`}
                />
              </g>
            ) : (
              /* SIMPLE OVAL WHITE EYES (The Exact Design Reference) */
              /* Pure pearlescent glossy white vertical ovals with minimal serenity */
              <g>
                {/* Left Oval White Eye */}
                <ellipse
                  cx="102"
                  cy="106"
                  rx="4.8"
                  ry="7.2"
                  fill={`url(#whiteEyeGrad-${uid})`}
                  filter="drop-shadow(0 0 3px rgba(255, 255, 255, 0.6))"
                />
                {/* Left Subtle Glass Highlight */}
                <ellipse cx="100.8" cy="103.8" rx="1.8" ry="2.6" fill="#FFFFFF" />

                {/* Right Oval White Eye */}
                <ellipse
                  cx="138"
                  cy="106"
                  rx="4.8"
                  ry="7.2"
                  fill={`url(#whiteEyeGrad-${uid})`}
                  filter="drop-shadow(0 0 3px rgba(255, 255, 255, 0.6))"
                />
                {/* Right Subtle Glass Highlight */}
                <ellipse cx="136.8" cy="103.8" rx="1.8" ry="2.6" fill="#FFFFFF" />
              </g>
            )}
          </g>

          {/* Minimal Peaceful Mouth */}
          {mood === 'happy' ? (
            <path
              d="M 116 118 Q 120 123 124 118"
              stroke={theme.bodyDark}
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />
          ) : mood === 'comforting' ? (
            <path
              d="M 116 118 Q 120 121 124 118"
              stroke={theme.bodyDark}
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
              opacity="0.75"
            />
          ) : (
            <circle cx="120" cy="118" r="1.4" fill={theme.bodyDark} opacity="0.65" />
          )}

          {/* 11. BỘ 16 PHỤ KIỆN FAIRYCORE (NƠ, KẸP BƯỚM, VÒNG HOA, KẸP DÂY LEO, MẶT TRĂNG, SAO, VƯƠNG MIỆN, TIARA, HALO, HOA LAVENDER, BƯỚM ĐẬU, NẤM, VÒNG LÁ, VỎ SÒ, NGỌC TRAI, KÍNH TRÒN) */}
          
          {/* 1. 🎀 Nơ ruy-băng */}
          {(accessory === 'ribbon_bow' || accessory === 'bow') && (
            <g id="fairy-acc-ribbon-bow" className="filter drop-shadow(0 3px 6px rgba(0,0,0,0.35))">
              <g transform="translate(82, 60) rotate(-18)">
                <path d="M 0 0 C -15 -14 -20 6 0 0 Z" fill="#F472B6" stroke="#BE185D" strokeWidth="1.2" />
                <path d="M -3 -3 C -10 -9 -12 3 -3 -1" fill="#FCE7F3" opacity="0.9" />
                <path d="M 0 0 C 15 -14 20 6 0 0 Z" fill="#F472B6" stroke="#BE185D" strokeWidth="1.2" />
                <path d="M 3 -3 C 10 -9 12 3 3 -1" fill="#FCE7F3" opacity="0.9" />
                <circle cx="0" cy="0" r="4" fill="#DB2777" />
                <circle cx="-1" cy="-1" r="1.5" fill="#FFFFFF" />
                <path d="M -1 2 Q -6 13 -9 18 Q -4 15 0 7" fill="#F472B6" />
                <path d="M 1 2 Q 6 13 9 18 Q 4 15 0 7" fill="#F472B6" />
              </g>
            </g>
          )}

          {/* 2. 🦋 Kẹp tóc bướm */}
          {accessory === 'butterfly_clip' && (
            <g id="fairy-acc-butterfly-clip" className="filter drop-shadow(0 3px 6px rgba(0,0,0,0.35))">
              <g transform="translate(84, 66) rotate(-15)">
                {/* Hairpin silver needle */}
                <line x1="-8" y1="5" x2="10" y2="-4" stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round" />
                {/* Forewing Top Left */}
                <path d="M 0 0 C -6 -12 -16 -12 -14 -3 C -13 3 -4 2 0 0 Z" fill="#67E8F9" stroke="#0891B2" strokeWidth="0.8" opacity="0.9" />
                <circle cx="-10" cy="-6" r="1.5" fill="#FFFFFF" />
                {/* Hindwing Bottom Left */}
                <path d="M 0 0 C -5 5 -12 8 -9 12 C -6 14 -1 6 0 0 Z" fill="#A5B4FC" stroke="#4F46E5" strokeWidth="0.8" opacity="0.85" />
                {/* Forewing Top Right */}
                <path d="M 0 0 C 6 -13 16 -13 14 -4 C 13 2 4 2 0 0 Z" fill="#67E8F9" stroke="#0891B2" strokeWidth="0.8" opacity="0.9" />
                <circle cx="10" cy="-6" r="1.5" fill="#FFFFFF" />
                {/* Hindwing Bottom Right */}
                <path d="M 0 0 C 5 5 12 8 9 12 C 6 14 1 6 0 0 Z" fill="#A5B4FC" stroke="#4F46E5" strokeWidth="0.8" opacity="0.85" />
                {/* Butterfly Body */}
                <ellipse cx="0" cy="1" rx="1.6" ry="5.5" fill="#1E293B" />
                {/* Antennae */}
                <path d="M -0.5 -4 Q -3 -8 -6 -7" stroke="#0891B2" strokeWidth="0.8" fill="none" />
                <path d="M 0.5 -4 Q 3 -8 6 -7" stroke="#0891B2" strokeWidth="0.8" fill="none" />
                <circle cx="-6" cy="-7" r="0.8" fill="#FDF2F8" />
                <circle cx="6" cy="-7" r="0.8" fill="#FDF2F8" />
              </g>
            </g>
          )}

          {/* 3. 🌸 Vòng hoa nhỏ */}
          {(accessory === 'small_wreath' || accessory === 'wreath') && (
            <g id="fairy-acc-small-wreath" className="filter drop-shadow(0 3px 6px rgba(0,0,0,0.35))">
              <path d="M 86 56 Q 120 44 154 56" stroke="#10B981" strokeWidth="2.4" strokeLinecap="round" fill="none" />
              {/* Leaves */}
              <ellipse cx="96" cy="51" rx="3.5" ry="1.8" fill="#34D399" transform="rotate(-20 96 51)" />
              <ellipse cx="144" cy="51" rx="3.5" ry="1.8" fill="#34D399" transform="rotate(20 144 51)" />
              <ellipse cx="120" cy="46" rx="3" ry="1.8" fill="#6EE7B7" />
              {/* Tiny Pastel Blossoms */}
              <circle cx="92" cy="55" r="3.8" fill="#F472B6" />
              <circle cx="92" cy="55" r="1.3" fill="#FEF08A" />
              <circle cx="108" cy="47" r="4.2" fill="#FFFFFF" />
              <circle cx="108" cy="47" r="1.5" fill="#FBBF24" />
              <circle cx="128" cy="47" r="4" fill="#C084FC" />
              <circle cx="128" cy="47" r="1.4" fill="#FEF08A" />
              <circle cx="146" cy="54" r="3.8" fill="#FDBA74" />
              <circle cx="146" cy="54" r="1.3" fill="#FEF08A" />
            </g>
          )}

          {/* 4. 🌿 Kẹp lá dây leo */}
          {accessory === 'vine_clip' && (
            <g id="fairy-acc-vine-clip" className="filter drop-shadow(0 3px 6px rgba(0,0,0,0.35))">
              {/* Winding emerald fairy vine */}
              <path d="M 80 58 Q 76 68 82 76 Q 88 84 84 92" stroke="#059669" strokeWidth="2" strokeLinecap="round" fill="none" />
              {/* Little vine tendril curls */}
              <path d="M 83 74 Q 89 74 88 78" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round" fill="none" />
              {/* Leaves along vine */}
              <path d="M 78 60 Q 72 61 74 66 Q 78 64 78 60 Z" fill="#34D399" stroke="#047857" strokeWidth="0.6" />
              <path d="M 80 70 Q 86 68 85 73 Q 81 74 80 70 Z" fill="#6EE7B7" stroke="#047857" strokeWidth="0.6" />
              <path d="M 83 82 Q 89 83 87 88 Q 82 86 83 82 Z" fill="#34D399" stroke="#047857" strokeWidth="0.6" />
              <path d="M 84 90 Q 80 94 82 96 Q 85 93 84 90 Z" fill="#A7F3D0" stroke="#047857" strokeWidth="0.6" />
              {/* Shimmering dew drops */}
              <circle cx="75" cy="63" r="1.2" fill="#FFFFFF" opacity="0.9" />
              <circle cx="86" cy="71" r="1.2" fill="#FFFFFF" opacity="0.9" />
            </g>
          )}

          {/* 5. 🌙 Kẹp mặt trăng */}
          {accessory === 'moon_clip' && (
            <g id="fairy-acc-moon-clip" className="filter drop-shadow(0 3px 8px rgba(245,158,11,0.45))">
              <g transform="translate(84, 66) rotate(-12)">
                {/* Hairpin gold pin */}
                <line x1="-8" y1="4" x2="12" y2="-4" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" />
                {/* Luminous Golden Crescent */}
                <path d="M 0 -10 C 6 -10 10 -4 10 2 C 10 8 5 13 0 13 C 5 10 7 5 6 0 C 5 -5 2 -8 0 -10 Z" fill="#FDE047" stroke="#D97706" strokeWidth="0.9" />
                {/* Inner crescent highlight */}
                <path d="M 2 -7 C 6 -4 6 2 4 6" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.9" />
                {/* Dangling starlet teardrop */}
                <line x1="3" y1="12" x2="4" y2="18" stroke="#FBBF24" strokeWidth="0.8" />
                <circle cx="4" cy="19" r="2.2" fill="#93C5FD" stroke="#3B82F6" strokeWidth="0.6" />
                <circle cx="3.5" cy="18.5" r="0.7" fill="#FFFFFF" />
              </g>
            </g>
          )}

          {/* 6. ⭐ Kẹp ngôi sao */}
          {(accessory === 'star_clip' || accessory === 'hairpin') && (
            <g id="fairy-acc-star-clip" className="filter drop-shadow(0 3px 8px rgba(245,158,11,0.5))">
              <g transform="translate(85, 68)">
                <line x1="-10" y1="4" x2="12" y2="-5" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
                {/* Glowing 5-point star */}
                <circle cx="0" cy="0" r="7.5" fill="#FDE047" opacity="0.4" />
                <path
                  d="M 0 -9 L 2.5 -3 L 8.5 -2.5 L 4 2 L 5.5 8 L 0 5 L -5.5 8 L -4 2 L -8.5 -2.5 L -2.5 -3 Z"
                  fill="#FEF08A"
                  stroke="#D97706"
                  strokeWidth="0.9"
                />
                <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />
                <circle cx="-0.8" cy="-0.8" r="1" fill="#FEF08A" />
              </g>
            </g>
          )}

          {/* 7. 👑 Vương miện hoa */}
          {accessory === 'flower_crown' && (
            <g id="fairy-acc-flower-crown" className="filter drop-shadow(0 4px 8px rgba(0,0,0,0.4))">
              {/* Crown Woven Base */}
              <path d="M 80 54 Q 120 38 160 54" stroke="#059669" strokeWidth="3" strokeLinecap="round" fill="none" />
              {/* Foliage leaves */}
              <ellipse cx="90" cy="48" rx="4" ry="2" fill="#10B981" transform="rotate(-30 90 48)" />
              <ellipse cx="150" cy="48" rx="4" ry="2" fill="#10B981" transform="rotate(30 150 48)" />
              <ellipse cx="106" cy="41" rx="4" ry="2.2" fill="#34D399" transform="rotate(-15 106 41)" />
              <ellipse cx="134" cy="41" rx="4" ry="2.2" fill="#34D399" transform="rotate(15 134 41)" />
              {/* Royal Crown Flowers */}
              {/* Center Royal Rose */}
              <circle cx="120" cy="38" r="6" fill="#F43F5E" stroke="#BE123C" strokeWidth="1" />
              <circle cx="120" cy="38" r="3.2" fill="#FB7185" />
              <circle cx="120" cy="38" r="1.5" fill="#FFFFFF" />
              {/* Flanking Peony Left */}
              <circle cx="102" cy="44" r="5" fill="#EC4899" stroke="#BE185D" strokeWidth="0.8" />
              <circle cx="102" cy="44" r="2.2" fill="#FDF2F8" />
              {/* Flanking Lily Right */}
              <circle cx="138" cy="44" r="5" fill="#A855F7" stroke="#7E22CE" strokeWidth="0.8" />
              <circle cx="138" cy="44" r="2.2" fill="#FAF5FF" />
              {/* Outer Golden Buttercups */}
              <circle cx="86" cy="52" r="4.2" fill="#FBBF24" stroke="#D97706" strokeWidth="0.8" />
              <circle cx="154" cy="52" r="4.2" fill="#FBBF24" stroke="#D97706" strokeWidth="0.8" />
            </g>
          )}

          {/* 8. 💎 Tiara pha lê */}
          {accessory === 'crystal_tiara' && (
            <g id="fairy-acc-crystal-tiara" className="filter drop-shadow(0 4px 10px rgba(167,139,250,0.5))">
              <g transform="translate(120, 48)">
                {/* Silver Tiara Base Arch */}
                <path d="M -34 6 Q 0 -4 34 6" stroke="#E2E8F0" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                <path d="M -30 6 Q 0 -2 30 6" stroke="#94A3B8" strokeWidth="0.8" fill="none" />
                {/* Center Majestic Crystal Peak */}
                <path d="M 0 -16 L 4 -3 L 0 2 L -4 -3 Z" fill="#E0E7FF" stroke="#6366F1" strokeWidth="1" />
                <circle cx="0" cy="-6" r="2" fill="#C7D2FE" />
                <circle cx="-0.8" cy="-8" r="0.8" fill="#FFFFFF" />
                {/* Mid Left Crystal Peak */}
                <path d="M -14 -11 L -11 -2 L -14 3 L -17 -2 Z" fill="#DDD6FE" stroke="#7C3AED" strokeWidth="0.9" />
                {/* Mid Right Crystal Peak */}
                <path d="M 14 -11 L 17 -2 L 14 3 L 11 -2 Z" fill="#DDD6FE" stroke="#7C3AED" strokeWidth="0.9" />
                {/* Outer Crystal Peaks */}
                <path d="M -26 -6 L -24 1 L -26 5 L -28 1 Z" fill="#BAE6FD" stroke="#0284C7" strokeWidth="0.8" />
                <path d="M 26 -6 L 28 1 L 26 5 L 24 1 Z" fill="#BAE6FD" stroke="#0284C7" strokeWidth="0.8" />
                {/* Tiny Facet Glints */}
                <circle cx="0" cy="-16" r="1.5" fill="#FFFFFF" />
                <circle cx="-14" cy="-11" r="1.2" fill="#FFFFFF" />
                <circle cx="14" cy="-11" r="1.2" fill="#FFFFFF" />
              </g>
            </g>
          )}

          {/* 9. ✨ Halo ánh sáng */}
          {accessory === 'light_halo' && (
            <g id="fairy-acc-light-halo" className="filter drop-shadow(0 0 12px rgba(253,224,71,0.85))">
              {/* Outer Golden Halo Glow */}
              <ellipse cx="120" cy="35" rx="35" ry="9" stroke="rgba(253, 224, 71, 0.4)" strokeWidth="6" fill="none" />
              {/* Core Halo Ring */}
              <ellipse cx="120" cy="35" rx="34" ry="8.5" stroke="#FEF08A" strokeWidth="2.5" fill="none" />
              {/* Top Bright Rim Highlight */}
              <path d="M 94 34 Q 120 28 146 34" stroke="#FFFFFF" strokeWidth="1.6" fill="none" opacity="0.95" />
              {/* Floating Sparkle Glints */}
              <circle cx="86" cy="34" r="1.8" fill="#FFFFFF" />
              <circle cx="154" cy="34" r="1.8" fill="#FFFFFF" />
              <path d="M 120 22 L 122 25 L 125 25 L 123 27 L 124 30 L 120 28 L 116 30 L 117 27 L 115 25 L 118 25 Z" fill="#FFFFFF" opacity="0.9" />
            </g>
          )}

          {/* 10. 🌿 Hoa lavender cài tóc */}
          {accessory === 'lavender_flower' && (
            <g id="fairy-acc-lavender-flower" className="filter drop-shadow(0 3px 6px rgba(0,0,0,0.35))">
              <g transform="translate(84, 68) rotate(-20)">
                {/* Slender green stem */}
                <line x1="-6" y1="18" x2="4" y2="-12" stroke="#4D7C0F" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="-3" y1="12" x2="-8" y2="7" stroke="#65A30D" strokeWidth="1.2" strokeLinecap="round" />
                <line x1="0" y1="4" x2="6" y2="0" stroke="#65A30D" strokeWidth="1.2" strokeLinecap="round" />
                {/* Clustered Lavender Florets */}
                <ellipse cx="4" cy="-12" rx="2.5" ry="3.5" fill="#A855F7" />
                <ellipse cx="1" cy="-8" rx="2.8" ry="3.2" fill="#C084FC" />
                <ellipse cx="6" cy="-6" rx="2.8" ry="3.2" fill="#9333EA" />
                <ellipse cx="0" cy="-2" rx="3" ry="3.5" fill="#A855F7" />
                <ellipse cx="5" cy="1" rx="3" ry="3.5" fill="#C084FC" />
                <ellipse cx="-1" cy="5" rx="2.8" ry="3.2" fill="#9333EA" />
                <ellipse cx="4" cy="7" rx="2.8" ry="3.2" fill="#A855F7" />
                {/* Soft Lavender Blossom Highlight */}
                <circle cx="4" cy="-13" r="1" fill="#FFFFFF" opacity="0.8" />
                <circle cx="1" cy="-9" r="0.9" fill="#FFFFFF" opacity="0.8" />
              </g>
            </g>
          )}

          {/* 11. 🦋 Bướm đậu trên tóc */}
          {accessory === 'butterfly_perch' && (
            <g id="fairy-acc-butterfly-perch" className="filter drop-shadow(0 4px 8px rgba(0,0,0,0.4))">
              <g transform="translate(126, 46)">
                {/* Left Fantasy Wing Upright */}
                <path d="M 0 0 C -8 -16 -22 -14 -18 -2 C -15 6 -3 4 0 0 Z" fill="#F472B6" stroke="#DB2777" strokeWidth="1" />
                <circle cx="-12" cy="-8" r="1.8" fill="#FDF2F8" />
                <circle cx="-6" cy="-3" r="1.2" fill="#FEF08A" />
                {/* Right Fantasy Wing Upright */}
                <path d="M 0 0 C 8 -16 22 -14 18 -2 C 15 6 3 4 0 0 Z" fill="#C084FC" stroke="#9333EA" strokeWidth="1" />
                <circle cx="12" cy="-8" r="1.8" fill="#FAF5FF" />
                <circle cx="6" cy="-3" r="1.2" fill="#FEF08A" />
                {/* Butterfly Body resting gently */}
                <ellipse cx="0" cy="1" rx="1.8" ry="6" fill="#312E81" />
                <circle cx="0" cy="-5" r="2" fill="#1E1B4B" />
                {/* Antennae */}
                <path d="M -0.5 -6 Q -4 -11 -7 -10" stroke="#C084FC" strokeWidth="0.9" fill="none" />
                <path d="M 0.5 -6 Q 4 -11 7 -10" stroke="#F472B6" strokeWidth="0.9" fill="none" />
                <circle cx="-7" cy="-10" r="0.9" fill="#FFFFFF" />
                <circle cx="7" cy="-10" r="0.9" fill="#FFFFFF" />
              </g>
            </g>
          )}

          {/* 12. 🍄 Kẹp nấm nhỏ */}
          {accessory === 'mushroom_clip' && (
            <g id="fairy-acc-mushroom-clip" className="filter drop-shadow(0 3px 6px rgba(0,0,0,0.35))">
              <g transform="translate(82, 68)">
                {/* Hairpin needle */}
                <line x1="-6" y1="6" x2="10" y2="-4" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
                {/* Mushroom Cream Stem */}
                <path d="M -2 1 C -3 5 -4 9 0 10 C 4 9 3 5 2 1 Z" fill="#FEF3C7" stroke="#D97706" strokeWidth="0.7" />
                {/* Crimson Coral Mushroom Cap */}
                <path d="M -8 1 C -8 -7 8 -7 8 1 C 5 2 -5 2 -8 1 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="0.9" />
                {/* White Fairy Spots */}
                <circle cx="-4" cy="-2.5" r="1.3" fill="#FFFFFF" />
                <circle cx="0" cy="-4.5" r="1.5" fill="#FFFFFF" />
                <circle cx="4" cy="-2" r="1.2" fill="#FFFFFF" />
                {/* Tiny Spore Sparkles */}
                <circle cx="-6" cy="-7" r="0.8" fill="#FEF08A" />
                <circle cx="6" cy="-6" r="0.7" fill="#FEF08A" />
              </g>
            </g>
          )}

          {/* 13. 🌿 Vòng lá */}
          {accessory === 'leaf_wreath' && (
            <g id="fairy-acc-leaf-wreath" className="filter drop-shadow(0 3px 6px rgba(0,0,0,0.35))">
              {/* Headband arch */}
              <path d="M 84 54 Q 120 42 156 54" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              {/* Alternating Mint and Forest Laurel Leaves */}
              <ellipse cx="90" cy="51" rx="4" ry="1.8" fill="#34D399" stroke="#047857" strokeWidth="0.6" transform="rotate(-35 90 51)" />
              <ellipse cx="102" cy="46" rx="4" ry="1.8" fill="#6EE7B7" stroke="#047857" strokeWidth="0.6" transform="rotate(-20 102 46)" />
              <ellipse cx="114" cy="44" rx="4" ry="1.8" fill="#34D399" stroke="#047857" strokeWidth="0.6" transform="rotate(-5 114 44)" />
              <ellipse cx="126" cy="44" rx="4" ry="1.8" fill="#6EE7B7" stroke="#047857" strokeWidth="0.6" transform="rotate(5 126 44)" />
              <ellipse cx="138" cy="46" rx="4" ry="1.8" fill="#34D399" stroke="#047857" strokeWidth="0.6" transform="rotate(20 138 46)" />
              <ellipse cx="150" cy="51" rx="4" ry="1.8" fill="#6EE7B7" stroke="#047857" strokeWidth="0.6" transform="rotate(35 150 51)" />
              {/* Golden Leaf Buds */}
              <circle cx="96" cy="48" r="1.3" fill="#FBBF24" />
              <circle cx="120" cy="43" r="1.5" fill="#FBBF24" />
              <circle cx="144" cy="48" r="1.3" fill="#FBBF24" />
            </g>
          )}

          {/* 14. 🐚 Kẹp vỏ sò */}
          {accessory === 'seashell_clip' && (
            <g id="fairy-acc-seashell-clip" className="filter drop-shadow(0 3px 6px rgba(0,0,0,0.35))">
              <g transform="translate(84, 68)">
                {/* Hairpin silver needle */}
                <line x1="-7" y1="5" x2="11" y2="-4" stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round" />
                {/* Scallop Fan Base */}
                <path d="M -7 0 C -9 -8 0 -13 0 -13 C 0 -13 9 -8 7 0 C 4 2 -4 2 -7 0 Z" fill="#FBCFE8" stroke="#DB2777" strokeWidth="0.9" />
                {/* Scallop Fluted Ridges */}
                <line x1="0" y1="1" x2="0" y2="-12" stroke="#F472B6" strokeWidth="0.8" />
                <line x1="-1" y1="1" x2="-5" y2="-9" stroke="#F472B6" strokeWidth="0.7" />
                <line x1="1" y1="1" x2="5" y2="-9" stroke="#F472B6" strokeWidth="0.7" />
                {/* Mother of pearl lustre */}
                <ellipse cx="-2" cy="-6" rx="1.8" ry="3" fill="#FFFFFF" opacity="0.6" transform="rotate(-15 -2 -6)" />
                {/* Center Glowing White Pearl */}
                <circle cx="0" cy="0" r="2.8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.7" />
                <circle cx="-0.8" cy="-0.8" r="1" fill="#FEF3C7" />
              </g>
            </g>
          )}

          {/* 15. 🤍 Ngọc trai quanh tóc */}
          {accessory === 'pearls' && (
            <g id="fairy-acc-pearls" className="filter drop-shadow(0 3px 8px rgba(255,255,255,0.45))">
              {/* Pearl Strand Curving Hairline */}
              <path d="M 86 58 Q 120 48 154 58" stroke="#E2E8F0" strokeWidth="1" fill="none" opacity="0.6" />
              {/* Graduated Pearls */}
              <circle cx="86" cy="58" r="2.4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.6" />
              <circle cx="94" cy="55" r="2.8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.6" />
              <circle cx="102" cy="52" r="3.2" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.6" />
              <circle cx="111" cy="50" r="3.5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.6" />
              <circle cx="120" cy="49" r="3.8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.6" />
              <circle cx="129" cy="50" r="3.5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.6" />
              <circle cx="138" cy="52" r="3.2" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.6" />
              <circle cx="146" cy="55" r="2.8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.6" />
              <circle cx="154" cy="58" r="2.4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.6" />
              {/* Pearlescent Highlights */}
              <circle cx="119" cy="48" r="1.2" fill="#FEF9C3" />
              <circle cx="110" cy="49" r="1" fill="#FEF9C3" />
              <circle cx="128" cy="49" r="1" fill="#FEF9C3" />
              <circle cx="101" cy="51" r="0.9" fill="#FEF9C3" />
              <circle cx="137" cy="51" r="0.9" fill="#FEF9C3" />
            </g>
          )}

          {/* 16. 👓 Kính tròn */}
          {accessory === 'glasses' && (
            <g id="fairy-acc-glasses" className="filter drop-shadow(0 2px 4px rgba(0,0,0,0.3))">
              {/* Thin Golden Round Spectacles */}
              {/* Left Lens */}
              <circle cx="102" cy="106" r="10.5" stroke="#FBBF24" strokeWidth="2" fill="rgba(255, 255, 255, 0.14)" />
              <path d="M 96 100 A 7.5 7.5 0 0 1 106 99" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" opacity="0.9" />

              {/* Right Lens */}
              <circle cx="138" cy="106" r="10.5" stroke="#FBBF24" strokeWidth="2" fill="rgba(255, 255, 255, 0.14)" />
              <path d="M 132 100 A 7.5 7.5 0 0 1 142 99" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" opacity="0.9" />

              {/* Nose Bridge */}
              <path d="M 112.5 105 Q 120 101 127.5 105" stroke="#FBBF24" strokeWidth="2" fill="none" strokeLinecap="round" />

              {/* Temples */}
              <path d="M 91.5 106 Q 84 104 78 106" stroke="#FBBF24" strokeWidth="1.6" fill="none" strokeLinecap="round" />
              <path d="M 148.5 106 Q 156 104 162 106" stroke="#FBBF24" strokeWidth="1.6" fill="none" strokeLinecap="round" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};
