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

  // Determine effective color: default at start MUST be 'gray' (màu xám, có cánh, không có phụ kiện)
  const effectiveColor: FairyColorId = colorId || (
    id === 'flower' ? 'mint' :
    id === 'moon' ? 'lavender' :
    id === 'cloud' ? 'blue' :
    id === 'bunny' ? 'rose' :
    id === 'star' ? 'cream' :
    id === 'mushroom' ? 'peach' :
    'gray'
  );

  const getFairyTheme = () => {
    switch (effectiveColor) {
      case 'mint':
        return {
          name: 'Mint Fairy',
          bodyHighlight: '#FFFFFF',
          bodyLight: '#E8FAF3',
          bodyMid: '#B5E8D5',
          bodyShadow: '#6BC4A6',
          bodyDark: '#3A9679',
          hairHighlight: '#FFFFFF',
          hairLight: '#EAF7F2',
          hairMid: '#BCE5D3',
          hairShadow: '#7EC4A8',
          dressLight: '#F2FBF6',
          dressMid: '#C8EADB',
          dressShadow: '#96D0BC',
          rimLight: '#B2F6E3',
          ambientGlow: 'rgba(168, 210, 196, 0.6)',
          wingCream: '#FFFFF4',
          wingTint: '#E3F8EE',
          wingGlow: 'rgba(168, 245, 226, 0.55)',
          blush: '#FFAEBE',
          accent: '#A8D2C4',
          particleColor: '#E5FAF1'
        };
      case 'lavender':
        return {
          name: 'Lavender Fairy',
          bodyHighlight: '#FFFFFF',
          bodyLight: '#F3EFFF',
          bodyMid: '#D4CBF5',
          bodyShadow: '#AEA0E3',
          bodyDark: '#7E6BC4',
          hairHighlight: '#FFFFFF',
          hairLight: '#EDE6FD',
          hairMid: '#C8BDF1',
          hairShadow: '#9F8FE0',
          dressLight: '#F5F2FE',
          dressMid: '#DAD1F7',
          dressShadow: '#B5A6E8',
          rimLight: '#E5DDFE',
          ambientGlow: 'rgba(185, 169, 232, 0.65)',
          wingCream: '#FFFFFA',
          wingTint: '#EEE8FC',
          wingGlow: 'rgba(185, 169, 232, 0.6)',
          blush: '#FFAFD6',
          accent: '#B9A9E8',
          particleColor: '#EFEAFF'
        };
      case 'blue':
        return {
          name: 'Blue Fairy',
          bodyHighlight: '#FFFFFF',
          bodyLight: '#EBF4FD',
          bodyMid: '#BCD9F8',
          bodyShadow: '#82B2E6',
          bodyDark: '#568DC7',
          hairHighlight: '#FFFFFF',
          hairLight: '#E3F1FD',
          hairMid: '#B2D5F8',
          hairShadow: '#76A8DE',
          dressLight: '#F0F6FD',
          dressMid: '#C2DEF9',
          dressShadow: '#8BB8E8',
          rimLight: '#B8E0FD',
          ambientGlow: 'rgba(145, 184, 232, 0.6)',
          wingCream: '#FFFFF6',
          wingTint: '#E0F0FC',
          wingGlow: 'rgba(145, 184, 232, 0.55)',
          blush: '#FFAEC7',
          accent: '#91B8E8',
          particleColor: '#D8ECFD'
        };
      case 'rose':
        return {
          name: 'Rose Fairy',
          bodyHighlight: '#FFFFFF',
          bodyLight: '#FDF2F8',
          bodyMid: '#F5C2DF',
          bodyShadow: '#D88EBA',
          bodyDark: '#B3558F',
          hairHighlight: '#FFFFFF',
          hairLight: '#FDECF5',
          hairMid: '#F0B6D5',
          hairShadow: '#D47CA8',
          dressLight: '#FDF4F9',
          dressMid: '#F6CEE2',
          dressShadow: '#DF9CBE',
          rimLight: '#FCE0EE',
          ambientGlow: 'rgba(235, 155, 187, 0.6)',
          wingCream: '#FFFFF8',
          wingTint: '#FBE8F2',
          wingGlow: 'rgba(235, 155, 187, 0.55)',
          blush: '#FFA8C2',
          accent: '#F5C6DF',
          particleColor: '#FBE8F2'
        };
      case 'cream':
        return {
          name: 'Cream Fairy',
          bodyHighlight: '#FFFFFF',
          bodyLight: '#FFFDF0',
          bodyMid: '#F8ECC2',
          bodyShadow: '#DECB89',
          bodyDark: '#AD9645',
          hairHighlight: '#FFFFFF',
          hairLight: '#FEF9E3',
          hairMid: '#F5E4A7',
          hairShadow: '#D2BD6F',
          dressLight: '#FFFDF3',
          dressMid: '#FBF0D0',
          dressShadow: '#E3D299',
          rimLight: '#FFF4C7',
          ambientGlow: 'rgba(244, 238, 220, 0.65)',
          wingCream: '#FFFFFF',
          wingTint: '#FFFCEB',
          wingGlow: 'rgba(245, 232, 175, 0.6)',
          blush: '#FFBEA6',
          accent: '#F4EEDC',
          particleColor: '#FFFCEB'
        };
      case 'peach':
        return {
          name: 'Peach Fairy',
          bodyHighlight: '#FFFFFF',
          bodyLight: '#FFF4EE',
          bodyMid: '#FDD5C2',
          bodyShadow: '#F1A987',
          bodyDark: '#C9744D',
          hairHighlight: '#FFFFFF',
          hairLight: '#FFEFE5',
          hairMid: '#FCC8B0',
          hairShadow: '#E79670',
          dressLight: '#FFF6F0',
          dressMid: '#FEDDCD',
          dressShadow: '#F3B497',
          rimLight: '#FFE3D3',
          ambientGlow: 'rgba(253, 190, 160, 0.6)',
          wingCream: '#FFFFF7',
          wingTint: '#FFF0E8',
          wingGlow: 'rgba(253, 190, 160, 0.55)',
          blush: '#FF9E88',
          accent: '#FDD5C2',
          particleColor: '#FFF0E8'
        };
      case 'charcoal':
        return {
          name: 'Charcoal Fairy',
          bodyHighlight: '#F1F5F9',
          bodyLight: '#CBD5E1',
          bodyMid: '#64748B',
          bodyShadow: '#334155',
          bodyDark: '#1E293B',
          hairHighlight: '#E2E8F0',
          hairLight: '#94A3B8',
          hairMid: '#475569',
          hairShadow: '#1E293B',
          dressLight: '#94A3B8',
          dressMid: '#475569',
          dressShadow: '#1E293B',
          rimLight: '#CBD5E1',
          ambientGlow: 'rgba(148, 163, 184, 0.45)',
          wingCream: '#F8FAFC',
          wingTint: '#E2E8F0',
          wingGlow: 'rgba(148, 163, 184, 0.5)',
          blush: '#F87171',
          accent: '#64748B',
          particleColor: '#E2E8F0'
        };
      case 'gray':
      default:
        return {
          name: 'Neutral Fairy',
          bodyHighlight: '#FFFFFF',
          bodyLight: '#F3F4F6',
          bodyMid: '#D1D5DB',
          bodyShadow: '#9CA3AF',
          bodyDark: '#6B7280',
          hairHighlight: '#FFFFFF',
          hairLight: '#E5E7EB',
          hairMid: '#9CA3AF',
          hairShadow: '#6B7280',
          dressLight: '#F9FAFB',
          dressMid: '#E5E7EB',
          dressShadow: '#9CA3AF',
          rimLight: '#F3F4F6',
          ambientGlow: 'rgba(209, 213, 219, 0.5)',
          wingCream: '#FFFFFF',
          wingTint: '#F3F4F6',
          wingGlow: 'rgba(229, 231, 235, 0.6)',
          blush: '#FCA5A5',
          accent: '#9CA3AF',
          particleColor: '#F3F4F6'
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

          {/* 11. ACCESSORIES (NƠ, VÒNG HOA, KẸP TÓC, KÍNH) */}
          {accessory === 'bow' && (
            <g id="fairy-accessory-bow" className="filter drop-shadow(0 3px 6px rgba(0,0,0,0.35))">
              {/* Cute Ribbon Bow on side hair */}
              <g transform="translate(82, 60) rotate(-18)">
                {/* Left loop */}
                <path d="M 0 0 C -14 -12 -18 6 0 0 Z" fill="#F472B6" stroke="#BE185D" strokeWidth="1" />
                <path d="M -3 -3 C -9 -8 -11 3 -3 -1" fill="#FCE7F3" opacity="0.9" />
                {/* Right loop */}
                <path d="M 0 0 C 14 -12 18 6 0 0 Z" fill="#F472B6" stroke="#BE185D" strokeWidth="1" />
                <path d="M 3 -3 C 9 -8 11 3 3 -1" fill="#FCE7F3" opacity="0.9" />
                {/* Center knot */}
                <circle cx="0" cy="0" r="3.8" fill="#DB2777" />
                <circle cx="-1" cy="-1" r="1.4" fill="#FFFFFF" />
                {/* Dangling ribbons */}
                <path d="M -1 2 Q -5 12 -8 17 Q -3 14 0 7" fill="#F472B6" />
                <path d="M 1 2 Q 5 12 8 17 Q 3 14 0 7" fill="#F472B6" />
              </g>
            </g>
          )}

          {accessory === 'wreath' && (
            <g id="fairy-accessory-wreath" className="filter drop-shadow(0 3px 6px rgba(0,0,0,0.35))">
              {/* Delicate Flower Wreath Resting on Crown */}
              <path
                d="M 84 56 Q 120 42 156 56"
                stroke="#10B981"
                strokeWidth="2.8"
                strokeLinecap="round"
                fill="none"
              />
              {/* Mini leaves */}
              <ellipse cx="94" cy="51" rx="3.5" ry="2" fill="#34D399" transform="rotate(-25 94 51)" />
              <ellipse cx="146" cy="51" rx="3.5" ry="2" fill="#34D399" transform="rotate(25 146 51)" />
              <ellipse cx="120" cy="45" rx="3.5" ry="2" fill="#6EE7B7" />

              {/* Blooming Flower 1 - Left Pink */}
              <circle cx="92" cy="55" r="4.2" fill="#F472B6" />
              <circle cx="92" cy="55" r="1.5" fill="#FEF08A" />

              {/* Blooming Flower 2 - Center White Rose */}
              <circle cx="110" cy="46" r="4.8" fill="#FFFFFF" />
              <circle cx="110" cy="46" r="1.8" fill="#FBBF24" />

              {/* Blooming Flower 3 - Lavender */}
              <circle cx="130" cy="47" r="4.5" fill="#C084FC" />
              <circle cx="130" cy="47" r="1.6" fill="#FEF08A" />

              {/* Blooming Flower 4 - Soft Peach */}
              <circle cx="148" cy="55" r="4.2" fill="#FB923C" />
              <circle cx="148" cy="55" r="1.5" fill="#FEF08A" />
            </g>
          )}

          {accessory === 'hairpin' && (
            <g id="fairy-accessory-hairpin" className="filter drop-shadow(0 3px 8px rgba(0,0,0,0.4))">
              {/* Starlet Hairpin on side-swept hair */}
              <g transform="translate(86, 70)">
                <line x1="-10" y1="4" x2="12" y2="-5" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
                {/* Glowing 4-point starlet */}
                <circle cx="0" cy="0" r="7" fill="#FDE047" opacity="0.4" />
                <path
                  d="M 0 -8 Q 1.5 -1.5 8 0 Q 1.5 1.5 0 8 Q -1.5 1.5 -8 0 Q -1.5 -1.5 0 -8 Z"
                  fill="#FEF08A"
                  stroke="#D97706"
                  strokeWidth="0.9"
                />
                <circle cx="0" cy="0" r="2.2" fill="#FFFFFF" />
              </g>
            </g>
          )}

          {accessory === 'glasses' && (
            <g id="fairy-accessory-glasses" className="filter drop-shadow(0 2px 4px rgba(0,0,0,0.3))">
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
