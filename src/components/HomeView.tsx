import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  ChevronRight,
  Heart,
  Send
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SpiritAvatar } from './SpiritAvatar';
import { getSpiritById } from '../data/spirits';
import { MOODS_LIST, getMoodById } from '../data/moods';
import { MoodId } from '../types';
import { sound } from '../utils/audio';
import { speechService } from '../utils/speech';

export const HomeView: React.FC = () => {
  const {
    userSpirit,
    feedSpiritLove,
    todayMood,
    recordMood,
    openModal,
    setActiveTab,
    gardenPlants
  } = useApp();

  const [moodNote, setMoodNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [isSpeakingHero, setIsSpeakingHero] = useState(false);
  const [tapPoint, setTapPoint] = useState<{ x: number; y: number } | null>(null);
  const [isLightRadiating, setIsLightRadiating] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [rippleKey, setRippleKey] = useState(0);
  const lastTapRef = React.useRef<number>(0);

  const currentSpiritId = userSpirit ? userSpirit.spiritId : 'fairy';
  const spiritMeta = getSpiritById(currentSpiritId);
  const spiritName = userSpirit?.customName || 'Fairy';

  // EXACT REQUIRED GREETING:
  // “Chào {SpiritName}, tôi là Tellie Spirit. Mình ở đây để lắng nghe bạn.”
  const heroGreeting = `Chào ${spiritName}, tôi là Tellie Spirit. Mình ở đây để lắng nghe bạn.`;

  // Voice synthesis subscriber
  useEffect(() => {
    const unsub = speechService.subscribe((speaking, textId) => {
      if (textId === 'hero-greeting') {
        setIsSpeakingHero(speaking);
      } else if (!speaking) {
        setIsSpeakingHero(false);
      }
    });
    return () => {
      unsub();
    };
  }, []);

  const handleToggleVoice = () => {
    if (isSpeakingHero) {
      speechService.stop();
    } else {
      speechService.speak(heroGreeting, 'hero-greeting');
    }
  };

  // Instant light & wave radiation on tap (0s delay, no water drop)
  const handleSpiritTouch = (clientX?: number, clientY?: number, currentTarget?: HTMLElement | null) => {
    const now = Date.now();
    if (now - lastTapRef.current < 150) return;
    lastTapRef.current = now;

    if (clientX !== undefined && clientY !== undefined && currentTarget) {
      const rect = currentTarget.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
      setTapPoint({ x, y });
    } else {
      setTapPoint(null);
    }

    // Instant zero-delay triggers
    sound.playChime(784);
    feedSpiritLove();
    setIsLightRadiating(true);
    setRippleKey(prev => prev + 1);
    setIsConnected(true);

    setTimeout(() => {
      setIsLightRadiating(false);
    }, 1300);
  };

  const handleSelectMood = (moodId: MoodId) => {
    recordMood(moodId, moodNote.trim() || undefined);
    sound.playChime(528);
    setShowNoteInput(false);
    setMoodNote('');
  };

  return (
    <div className="relative space-y-7 text-left pb-8">
      {/* =========================================================================
          MULTI-LAYER ATMOSPHERIC BACKGROUND BLOOMS
          Generous, soft-blurred twilight ombre:
          1. Deep navy base (#0D1020, #171A35, #242347)
          2. Large lavender/blue radial glow behind hero
          3. Soft misty pink/lavender glow around mood & mate
          4. Soft mint/aqua glow around recharge & garden
          5. Subtle vignette and stardust depth
      ========================================================================= */}
      <div className="absolute -inset-x-8 -top-12 -bottom-12 pointer-events-none overflow-hidden -z-10 select-none">
        {/* Layer 1: Global Twilight Ombre Gradient Base (Deep Navy -> Muted Lavender -> Soft Blue) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D1020] via-[#161836] via-40%-[#1A1D3D] via-70%-[#12162E] to-[#0A0D1B] opacity-95" />

        {/* Layer 2: Subtle Large Moon Glow partially visible near upper-right edge */}
        <div className="absolute -top-24 -right-20 w-[420px] h-[420px] sm:w-[500px] sm:h-[500px] pointer-events-none">
          {/* Outermost breathing lunar halo */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FFFEE8]/12 via-[#B9A9E8]/14 to-transparent blur-[90px] animate-moon-pulse" />
          {/* Inner soft moonlight disc partially visible */}
          <div className="absolute top-16 right-16 w-64 h-64 rounded-full bg-gradient-to-br from-[#FFFDF0]/16 via-[#F4EEDC]/10 to-transparent blur-[50px] animate-moon-pulse" />
          {/* Luminous soft crescent crest peek */}
          <div className="absolute top-24 right-20 w-36 h-36 rounded-full border border-[#FFFEE8]/20 blur-sm opacity-35" />
        </div>

        {/* Layer 3: Subtle Atmospheric Blue / Lavender Haze Blooms */}
        {/* Hero Fairy Backlight Aura (Blends Fairy smoothly as focal point) */}
        <div className="absolute top-44 left-1/2 -translate-x-1/2 w-[440px] h-[440px] bg-gradient-to-b from-[#B9A9E8]/16 via-[#91B8E8]/12 to-transparent rounded-full blur-[100px]" />
        
        {/* Midground Gentle Mist Pink & Lavender Haze */}
        <div className="absolute top-[640px] -left-28 w-[420px] h-[340px] bg-gradient-to-r from-[#DFAFC8]/10 via-[#B9A9E8]/08 to-transparent rounded-full blur-[110px]" />

        {/* Lower Night Garden Soft Mint Haze */}
        <div className="absolute bottom-28 -right-20 w-[440px] h-[380px] bg-gradient-to-l from-[#A8D2C4]/12 via-[#91B8E8]/08 to-transparent rounded-full blur-[115px]" />

        {/* Layer 4: Thin Wispy Clouds at Different Depths (Drifting very slowly) */}
        {/* Background Upper Wispy Cloud */}
        <div className="absolute top-16 -left-32 w-[600px] h-28 bg-gradient-to-r from-transparent via-[#232652]/25 to-transparent rounded-full blur-3xl animate-cloud-drift pointer-events-none" />
        
        {/* Midground Wispy Cloud Band */}
        <div className="absolute top-[480px] -right-40 w-[640px] h-32 bg-gradient-to-l from-transparent via-[#252048]/20 to-transparent rounded-full blur-3xl animate-cloud-drift-rev pointer-events-none" />

        {/* Lower Atmospheric Garden Mist */}
        <div className="absolute bottom-64 -left-20 w-[550px] h-36 bg-gradient-to-r from-transparent via-[#16272E]/25 to-transparent rounded-full blur-3xl animate-cloud-drift pointer-events-none" />

        {/* Layer 5: Soft Bokeh / Out-of-Focus Light Particles (Calm, low-contrast) */}
        <div className="absolute top-36 left-12 w-20 h-20 rounded-full bg-[#B9A9E8]/08 blur-xl animate-dust-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-[420px] right-10 w-24 h-24 rounded-full bg-[#91B8E8]/07 blur-xl animate-dust-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-[780px] left-8 w-28 h-28 rounded-full bg-[#DFAFC8]/06 blur-xl animate-dust-float" style={{ animationDelay: '6s' }} />
        <div className="absolute bottom-40 right-16 w-24 h-24 rounded-full bg-[#A8D2C4]/08 blur-xl animate-dust-float" style={{ animationDelay: '2s' }} />

        {/* Layer 6: Tiny Stars (Low-contrast, gentle slow twinkle) */}
        <div className="absolute top-14 left-10 w-1 h-1 rounded-full bg-[#FFFCE8] animate-star-twinkle" style={{ animationDuration: '6.5s', animationDelay: '0.2s' }} />
        <div className="absolute top-28 right-24 w-1.5 h-1.5 rounded-full bg-[#FFFDF0] animate-star-twinkle" style={{ animationDuration: '7.8s', animationDelay: '1.4s' }} />
        <div className="absolute top-36 left-1/3 w-1 h-1 rounded-full bg-[#B9A9E8] animate-star-twinkle" style={{ animationDuration: '5.8s', animationDelay: '2.5s' }} />
        <div className="absolute top-52 right-12 w-1 h-1 rounded-full bg-[#91B8E8] animate-star-twinkle" style={{ animationDuration: '8.2s', animationDelay: '0.8s' }} />
        <div className="absolute top-[380px] left-8 w-1 h-1 rounded-full bg-[#F4EEDC] animate-star-twinkle" style={{ animationDuration: '7.2s', animationDelay: '3.1s' }} />
        <div className="absolute top-[520px] right-1/4 w-1 h-1 rounded-full bg-[#DFAFC8] animate-star-twinkle" style={{ animationDuration: '6.2s', animationDelay: '1.9s' }} />
        <div className="absolute top-[740px] left-16 w-1 h-1 rounded-full bg-[#FFFCE8] animate-star-twinkle" style={{ animationDuration: '7.5s', animationDelay: '2.2s' }} />
        <div className="absolute top-[920px] right-8 w-1 h-1 rounded-full bg-[#A8D2C4] animate-star-twinkle" style={{ animationDuration: '8.5s', animationDelay: '0.5s' }} />
        <div className="absolute bottom-52 left-1/4 w-1 h-1 rounded-full bg-[#B9A9E8] animate-star-twinkle" style={{ animationDuration: '6.8s', animationDelay: '4.0s' }} />
        <div className="absolute bottom-28 right-20 w-1.5 h-1.5 rounded-full bg-[#FFFDF0] animate-star-twinkle" style={{ animationDuration: '7.0s', animationDelay: '1.1s' }} />

        {/* Layer 7: Floating Soft Stardust Specks (Drifting gently) */}
        <div className="absolute top-24 left-1/2 w-1 h-1 rounded-full bg-white/40 blur-[0.4px] animate-dust-float" style={{ animationDuration: '15s', animationDelay: '0s' }} />
        <div className="absolute top-[460px] left-1/4 w-1.5 h-1.5 rounded-full bg-[#B9A9E8]/35 blur-[0.5px] animate-dust-float" style={{ animationDuration: '18s', animationDelay: '5s' }} />
        <div className="absolute top-[820px] right-1/3 w-1 h-1 rounded-full bg-[#A8D2C4]/35 blur-[0.4px] animate-dust-float" style={{ animationDuration: '16s', animationDelay: '8s' }} />

        {/* Layer 8: Soft Vignette Framing the Viewport */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#0D1020]/25 to-[#070914]/75 pointer-events-none" />
      </div>

      {/* =========================================================================
          1. TOP APP BAR & TYPOGRAPHY HIERARCHY
      ========================================================================= */}
      <header className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F5F2FA] font-display">
              Tellie
            </h1>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B9A9E8] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#B9A9E8]" />
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#B9B5C8] font-medium tracking-wide mt-1">
            Nói ra → Được lắng nghe → Tìm hỗ trợ
          </p>
        </div>

        {/* Selected Spirit Companion Quick Badge - Automatically reflects user's custom Fairy (Color + Accessory) */}
        <button
          onClick={() => setActiveTab('profile')}
          className="group flex items-center gap-2.5 py-1.5 pl-2 pr-3.5 rounded-full bg-[#171A35]/80 hover:bg-[#242347]/90 border border-[#B9A9E8]/25 hover:border-[#B9A9E8]/60 transition-all duration-300 active:scale-95 shadow-lg shadow-black/20 backdrop-blur-xl"
          title="Xem thông tin và tùy chỉnh Tinh linh"
        >
          <div className="w-8 h-8 rounded-full bg-[#0D1020]/90 border border-[#B9A9E8]/35 overflow-hidden flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
            <SpiritAvatar
              id={currentSpiritId}
              colorId={userSpirit?.colorId}
              accessory={userSpirit?.accessory}
              size="xs"
              animate={false}
              glow={false}
              showShadow={false}
              className="scale-125 -translate-y-0.5"
            />
          </div>
          <div className="text-left">
            <span className="text-[11px] font-extrabold text-[#F5F2FA] block leading-tight max-w-[85px] truncate">
              {spiritName}
            </span>
            <span className="text-[9px] text-[#A8D2C4] font-medium block leading-none">
              Đang bên bạn
            </span>
          </div>
        </button>
      </header>

      {/* =========================================================================
          2. HERO SECTION — THE VISUAL FOCAL POINT
          - Selected 3D Fairy Spirit presented with generous breathing room
          - Dimensional 3D appearance, soft shadow, subtle floating motion, gentle glow
          - Dreamy twilight ombre sky backdrop
          - Conversational speech bubble with audio voice playback
      ========================================================================= */}
      <section className="relative w-full rounded-[32px] overflow-hidden border border-[#B9A9E8]/30 shadow-[0_20px_50px_rgba(7,9,20,0.6)] flex flex-col justify-between p-6 sm:p-7 bg-gradient-to-b from-[#171A35]/95 via-[#1E1C40]/90 to-[#0D1020]/95 backdrop-blur-2xl">
        {/* Layer 1: Ambient Twilight Ombre & Crescent Moon Glow */}
        <div className="absolute top-0 right-1/4 w-88 h-88 bg-gradient-to-br from-[#B9A9E8]/25 via-[#91B8E8]/15 to-transparent rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br from-[#242347]/60 via-[#171A35]/40 to-transparent rounded-full blur-[80px] pointer-events-none" />

        {/* Luminous Crescent Moon Accent */}
        <div className="absolute top-6 right-6 flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-[#F4EEDC]/10 blur-md absolute" />
          <span className="text-2xl text-[#F4EEDC] opacity-90 drop-shadow-[0_0_12px_rgba(244,238,220,0.7)]">
            🌙
          </span>
        </div>

        {/* Layer 2: Drifting Stardust & Twinkling Particles */}
        <div className="absolute top-12 left-8 text-xs text-[#FFFCE8] opacity-75 animate-ping pointer-events-none">✧</div>
        <div className="absolute top-28 left-1/4 text-[10px] text-[#91B8E8] opacity-70 animate-pulse pointer-events-none">✦</div>
        <div className="absolute top-40 right-14 text-xs text-[#DFAFC8] opacity-65 animate-ping pointer-events-none">⋆</div>
        <div className="absolute top-20 right-1/3 text-[11px] text-[#A8D2C4] opacity-80 animate-pulse pointer-events-none">✧</div>

        {/* Layer 3: Soft Drifting Mist / Cloud Shapes */}
        <div className="absolute bottom-16 -left-12 w-72 h-24 bg-[#242347]/45 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-10 -right-12 w-80 h-28 bg-[#171A35]/55 rounded-full blur-2xl pointer-events-none" />

        {/* Layer 4: Conversational Speech Bubble with Exact Greeting */}
        <div className="relative z-20 max-w-sm mx-auto w-full">
          <div className="p-4 sm:p-4.5 rounded-2xl sm:rounded-3xl bg-[#0D1020]/85 backdrop-blur-2xl border border-white/15 shadow-xl text-left flex items-start justify-between gap-3.5">
            <div className="flex-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#A8D2C4] mb-1 tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A8D2C4] animate-pulse" />
                <span>TELLIE COMPANION</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#F5F2FA] leading-relaxed">
                “{heroGreeting}”
              </p>
            </div>

            {/* Small Voice Speaker Button */}
            <button
              onClick={handleToggleVoice}
              className={`p-2.5 rounded-2xl transition-all duration-300 shrink-0 border ${
                isSpeakingHero
                  ? 'bg-[#B9A9E8] text-[#0D1020] border-[#B9A9E8] shadow-lg shadow-[#B9A9E8]/40 scale-105'
                  : 'bg-white/10 text-[#B9B5C8] border-white/10 hover:text-white hover:bg-white/20 hover:border-white/25 active:scale-95'
              }`}
              title={isSpeakingHero ? 'Dừng đọc' : 'Nghe giọng đọc vỗ về'}
              aria-label="Đọc lời vỗ về"
            >
              {isSpeakingHero ? (
                <VolumeX className="w-4 h-4 animate-pulse" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
          </div>
          {/* Subtle tail pointer */}
          <div className="w-3.5 h-3.5 bg-[#0D1020]/85 border-r border-b border-white/15 transform rotate-45 mx-auto -mt-2 backdrop-blur-2xl" />
        </div>

        {/* Layer 5: LARGE 3D HERO SPIRIT — TAP TO CONNECT WITH INSTANT RADIANT LIGHT WAVES */}
        <div
          onPointerDown={(e) => {
            handleSpiritTouch(e.clientX, e.clientY, e.currentTarget);
          }}
          onClick={(e) => {
            handleSpiritTouch(e.clientX, e.clientY, e.currentTarget);
          }}
          className="relative z-10 flex flex-col items-center justify-center my-auto cursor-pointer group py-4 sm:py-6 select-none overflow-hidden rounded-3xl"
          title="Chạm nhẹ để kết nối cùng Tellie Spirit"
        >
          {/* Instant Light & Radiating Waves Expansion from Tap Point (Zero Delay, No Droplet) */}
          {isLightRadiating && (
            <div
              key={rippleKey}
              className="absolute inset-0 pointer-events-none overflow-hidden z-30"
            >
              {/* Tap Point Center Anchor */}
              <div
                className="absolute"
                style={{
                  left: tapPoint ? `${tapPoint.x}px` : '50%',
                  top: tapPoint ? `${tapPoint.y}px` : '42%',
                  width: 0,
                  height: 0
                }}
              >
                {/* Instant Central Radiant Light Core Bloom (0s delay) */}
                <div className="absolute w-28 h-28 -left-14 -top-14 rounded-full bg-gradient-to-r from-white via-[#B9A9E8]/90 to-[#A8D2C4]/80 shadow-[0_0_35px_rgba(255,255,255,0.95)] animate-instant-light-core pointer-events-none" />

                {/* Instant Radiating Shockwaves (Tỏa sóng lan ra từ điểm chạm) */}
                {/* Wave 1: Pure White & Moonlight Ring (0s Delay) */}
                <div className="absolute w-24 h-24 -left-12 -top-12 rounded-full border-2 border-white/95 shadow-[0_0_24px_rgba(255,255,255,0.9),inset_0_0_14px_rgba(168,210,196,0.6)] animate-instant-wave-1 pointer-events-none" />

                {/* Wave 2: Lavender Ethereal Ring (0.06s Delay) */}
                <div className="absolute w-24 h-24 -left-12 -top-12 rounded-full border-2 border-[#B9A9E8]/85 shadow-[0_0_28px_rgba(185,169,232,0.8),inset_0_0_16px_rgba(185,169,232,0.4)] animate-instant-wave-2 pointer-events-none" />

                {/* Wave 3: Soft Mint Ambient Ring (0.14s Delay) */}
                <div className="absolute w-24 h-24 -left-12 -top-12 rounded-full border border-[#A8D2C4]/75 shadow-[0_0_36px_rgba(168,210,196,0.65)] animate-instant-wave-3 pointer-events-none" />

                {/* Stardust motes scattering with the radiant waves (0s delay) */}
                <div className="absolute text-xs text-[#FFFEE8] animate-spark-scatter" style={{ '--dx': '54px', '--dy': '-48px' } as any}>✦</div>
                <div className="absolute text-xs text-[#B9A9E8] animate-spark-scatter" style={{ '--dx': '-58px', '--dy': '-38px' } as any}>✧</div>
                <div className="absolute text-xs text-[#A8D2C4] animate-spark-scatter" style={{ '--dx': '44px', '--dy': '46px' } as any}>⋆</div>
                <div className="absolute text-xs text-[#F4EEDC] animate-spark-scatter" style={{ '--dx': '-48px', '--dy': '42px' } as any}>✦</div>
              </div>
            </div>
          )}

          {/* Soft multi-layered ambient aura behind Spirit */}
          <div
            className={`absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full pointer-events-none transition-all duration-300 blur-3xl ${
              isLightRadiating ? 'opacity-100 scale-110' : 'opacity-65 group-hover:opacity-90'
            }`}
            style={{
              background: `radial-gradient(circle, ${spiritMeta.accentColor}40 0%, ${spiritMeta.glowColor} 45%, transparent 70%)`
            }}
          />
          <div className="absolute w-44 h-44 rounded-full bg-[#B9A9E8]/20 blur-2xl pointer-events-none" />

          {/* Large Volumetric 3D Character Presentation with Immediate Touch Response */}
          <div className={`transform transition-transform duration-300 group-hover:scale-105 active:scale-95 ${
            isLightRadiating ? 'scale-105' : ''
          }`}>
            <SpiritAvatar
              id={currentSpiritId}
              colorId={userSpirit?.colorId}
              accessory={userSpirit?.accessory}
              size="hero"
              mood="happy"
              animate={true}
              glow={true}
              showShadow={true}
            />
          </div>

          {/* Interactive Tap / Connection State */}
          {isConnected ? (
            <div className="mt-2.5 flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#11242E]/90 border border-[#A8D2C4]/50 text-[11px] text-[#A8D2C4] font-bold backdrop-blur-xl transition-all shadow-lg shadow-[#A8D2C4]/20 animate-fadeIn">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A8D2C4] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#A8D2C4]"></span>
              </span>
              <span>Đã kết nối tâm hồn cùng {spiritName}</span>
              <span className="text-[10px] text-[#A8D2C4]/75">· Chạm nhẹ để vỗ về</span>
            </div>
          ) : (
            <div className="mt-2.5 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#11152A]/85 border border-[#B9A9E8]/25 text-[11px] text-[#DFAFC8] font-semibold backdrop-blur-xl opacity-90 group-hover:opacity-100 group-hover:border-[#DFAFC8]/50 transition-all shadow-md">
              <Heart className="w-3 h-3 fill-current text-[#DFAFC8] animate-pulse" />
              <span>Chạm nhẹ để kết nối cùng {spiritName}</span>
            </div>
          )}
        </div>

        {/* Layer 6: Species and Element Metadata Footer */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-[#858198] pt-3 border-t border-white/10 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#91B8E8]" />
            <span className="text-[#B9B5C8]">{spiritMeta.speciesVi}</span>
          </span>
          <span className="text-[#A8D2C4] italic">{spiritMeta.elementVi}</span>
        </div>
      </section>

      {/* =========================================================================
          3. MOOD CHECK-IN — SOFTLY ILLUMINATED TRANSLUCENT CARDS
      ========================================================================= */}
      <section className="relative rounded-[28px] p-5 sm:p-6 bg-gradient-to-b from-[#171A35]/85 via-[#1B1E3E]/75 to-[#0D1020]/90 border border-white/10 shadow-[0_12px_36px_rgba(7,9,20,0.5)] backdrop-blur-2xl space-y-4">
        {/* Soft background glow pool */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#B9A9E8]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#B9A9E8] uppercase tracking-wider font-extrabold block">
              Ghi nhận cảm xúc
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#F5F2FA] font-display mt-0.5">
              Hôm nay bạn đang cảm thấy thế nào?
            </h2>
          </div>

          {todayMood && (
            <div className="flex items-center gap-2 text-xs bg-[#242347]/90 px-3 py-1.5 rounded-full border border-[#B9A9E8]/35 shadow-md shadow-[#B9A9E8]/15 animate-fadeIn">
              <span className="text-base">{getMoodById(todayMood).icon}</span>
              <span className="font-bold text-[#F5F2FA]">
                {getMoodById(todayMood).labelVi}
              </span>
            </div>
          )}
        </div>

        {/* 8 Emotional State Tiles */}
        <div className="grid grid-cols-4 gap-2.5">
          {MOODS_LIST.map(mood => {
            const isSelected = todayMood === mood.id;
            return (
              <button
                key={mood.id}
                onClick={() => handleSelectMood(mood.id)}
                type="button"
                className={`relative group p-2.5 sm:p-3 rounded-2xl border text-center transition-all duration-300 active:scale-95 overflow-hidden flex flex-col items-center justify-center ${
                  isSelected
                    ? 'bg-[#242347] border-[#B9A9E8] scale-[1.03] shadow-[0_0_20px_rgba(185,169,232,0.35)] ring-2 ring-[#B9A9E8]/70'
                    : 'bg-[#11152A]/75 border-white/8 hover:border-white/20 hover:bg-[#171A35]/90 hover:scale-[1.02]'
                }`}
                style={{
                  boxShadow: isSelected
                    ? `0 0 20px ${mood.color}40, inset 0 1px 1px rgba(255,255,255,0.2)`
                    : undefined
                }}
              >
                {/* Soft glow highlight on active or hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl"
                  style={{
                    background: `radial-gradient(circle at 50% 30%, ${mood.color}25 0%, transparent 70%)`
                  }}
                />

                {isSelected && (
                  <div
                    className="absolute inset-0 pointer-events-none rounded-2xl opacity-40"
                    style={{
                      background: `radial-gradient(circle at 50% 20%, ${mood.color}50 0%, transparent 80%)`
                    }}
                  />
                )}

                <span className="text-2xl sm:text-3xl block mb-1.5 transform transition-transform group-hover:scale-110">
                  {mood.icon}
                </span>
                <span
                  className={`text-[11px] font-bold block truncate max-w-full leading-tight ${
                    isSelected ? 'text-[#F5F2FA]' : 'text-[#B9B5C8]'
                  }`}
                >
                  {mood.labelVi}
                </span>
              </button>
            );
          })}
        </div>

        {/* Optional Note Section */}
        <div className="pt-1">
          {showNoteInput ? (
            <div className="flex items-center gap-2 pt-1 animate-fadeIn">
              <input
                type="text"
                value={moodNote}
                onChange={e => setMoodNote(e.target.value)}
                placeholder="Ghi nhanh một vài dòng cảm xúc hôm nay..."
                className="flex-1 bg-[#11152A]/90 border border-white/15 rounded-2xl px-4 py-2.5 text-xs text-[#F5F2FA] placeholder-[#858198] focus:outline-none focus:border-[#B9A9E8] focus:ring-1 focus:ring-[#B9A9E8]/50 transition-all backdrop-blur-xl"
              />
              <button
                onClick={() => {
                  if (todayMood) {
                    recordMood(todayMood, moodNote.trim() || undefined);
                    setShowNoteInput(false);
                    setMoodNote('');
                  }
                }}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#B9A9E8] to-[#91B8E8] text-[#0D1020] text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[#B9A9E8]/20 flex items-center gap-1.5"
              >
                <span>Lưu</span>
                <Send className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowNoteInput(true)}
              className="text-xs text-[#858198] hover:text-[#B9A9E8] transition-colors flex items-center gap-1.5 font-medium py-1"
            >
              <span className="w-4 h-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[11px] leading-none text-[#B9A9E8]">
                +
              </span>
              <span>Thêm một vài dòng ghi chú cho ngày hôm nay</span>
            </button>
          )}
        </div>
      </section>

      {/* =========================================================================
          FEATURE 6 — VIẾT TÂM SỰ (FEATURE HERO CARD)
          Emotional-writing scene:
          - Softly floating parchment card with luminous abstract script
          - Elegant glowing feather pen with stardust ink trails
          - Gentle lavender ambient glow
          - Communicates: "letting thoughts out safely"
      ========================================================================= */}
      <section
        onClick={() => openModal('writePost')}
        className="relative rounded-[30px] overflow-hidden p-6 sm:p-7 bg-gradient-to-br from-[#1C1F3F]/90 via-[#242347]/85 to-[#161935]/95 border border-[#B9A9E8]/35 shadow-[0_18px_45px_rgba(7,9,20,0.5)] hover:border-[#B9A9E8]/70 hover:shadow-[0_18px_50px_rgba(185,169,232,0.25)] transition-all duration-300 cursor-pointer group active:scale-[0.99] backdrop-blur-2xl"
      >
        {/* Soft Lavender / Moonlight Glow Pool */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#B9A9E8]/18 rounded-full blur-3xl pointer-events-none group-hover:bg-[#B9A9E8]/30 transition-all duration-500" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B9A9E8]/15 border border-[#B9A9E8]/30 text-[#B9A9E8] text-[11px] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NÓI RA BÌNH YÊN</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-[#F5F2FA] font-display">
              Viết Tâm Sự
            </h3>

            <p className="text-xs sm:text-sm text-[#B9B5C8] leading-relaxed max-w-md">
              Trút bỏ mọi gánh nặng tâm trí an toàn và ẩn danh. Bạn có thể chia sẻ cùng vòng tay sinh viên hoặc lưu giữ vỗ về riêng mình.
            </p>

            <div className="pt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#B9A9E8] group-hover:translate-x-1 transition-transform">
              <span>Bắt đầu viết điều muốn nói</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* DEDICATED 3D-STYLE MINIATURE WRITING SCENE */}
          <div className="relative w-44 h-36 sm:w-52 sm:h-40 shrink-0 mx-auto md:mx-0 flex items-center justify-center">
            <svg
              viewBox="0 0 200 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full overflow-visible drop-shadow-[0_10px_25px_rgba(0,0,0,0.4)]"
            >
              <defs>
                {/* Parchment gradient */}
                <linearGradient id="parchmentGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FFFDF7" />
                  <stop offset="60%" stopColor="#F5EFE1" />
                  <stop offset="100%" stopColor="#E9DECB" />
                </linearGradient>
                {/* Feather quill gradient */}
                <linearGradient id="quillGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="35%" stopColor="#E0D5FA" />
                  <stop offset="75%" stopColor="#B9A9E8" />
                  <stop offset="100%" stopColor="#7E68C5" />
                </linearGradient>
                {/* Stardust glow */}
                <radialGradient id="stardustGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#B9A9E8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#B9A9E8" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Luminous aura underneath */}
              <circle cx="100" cy="85" r="60" fill="url(#stardustGlow)" opacity="0.35" filter="blur(14px)" />

              {/* Background letter layer (depth) */}
              <rect
                x="32"
                y="38"
                width="95"
                height="110"
                rx="14"
                transform="rotate(-12 32 38)"
                fill="#161833"
                stroke="#B9A9E8"
                strokeOpacity="0.25"
                strokeWidth="1.2"
              />

              {/* Primary floating parchment paper */}
              <g className="transition-transform duration-500 group-hover:-translate-y-1">
                <rect
                  x="48"
                  y="26"
                  width="100"
                  height="115"
                  rx="16"
                  transform="rotate(6 48 26)"
                  fill="url(#parchmentGrad)"
                  filter="drop-shadow(0 14px 22px rgba(10, 13, 27, 0.6))"
                />
                {/* Soft paper texture folds / corners */}
                <path
                  d="M 132 35 C 138 35, 144 41, 144 47 L 140 134 C 140 138, 134 142, 128 141 L 60 134"
                  stroke="#D3C5AE"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                  opacity="0.6"
                />
                {/* Abstract golden/lavender handwritten lines */}
                <path d="M 64 54 Q 85 52 115 55" stroke="#9E8BB5" strokeWidth="2.4" strokeLinecap="round" opacity="0.85" />
                <path d="M 62 68 Q 90 66 128 70" stroke="#B8A8D0" strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />
                <path d="M 60 82 Q 78 80 102 83" stroke="#B8A8D0" strokeWidth="2.2" strokeLinecap="round" opacity="0.7" />
                <path d="M 58 96 Q 88 94 122 97" stroke="#CBBDE0" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
                <path d="M 56 110 Q 72 109 88 111" stroke="#D9CDEC" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
                {/* Heart seal stamp */}
                <circle cx="126" cy="122" r="8" fill="#E8BCCF" opacity="0.85" />
                <path d="M 123 121 C 123 119 125 118 126 120 C 127 118 129 119 129 121 C 129 123 126 125 126 125 C 126 125 123 123 123 121 Z" fill="#FFFFFF" />
              </g>

              {/* Floating Luminous Feather Quill */}
              <g className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-2">
                {/* Quill Shaft and Vane */}
                <path
                  d="M 122 135 C 132 108, 150 56, 178 22 C 166 40, 160 62, 155 86 C 150 105, 138 126, 122 135 Z"
                  fill="url(#quillGrad)"
                  filter="drop-shadow(0 6px 12px rgba(185, 169, 232, 0.45))"
                />
                {/* Feather inner spine */}
                <path d="M 122 135 Q 146 75 178 22" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
                {/* Golden Quill Nib */}
                <polygon points="122,135 120,142 126,138" fill="#F4EEDC" />
                {/* Ink Stardust trail */}
                <circle cx="118" cy="144" r="2.5" fill="#B9A9E8" className="animate-ping" />
                <circle cx="110" cy="140" r="1.8" fill="#FFFCE8" />
                <circle cx="128" cy="148" r="1.5" fill="#DFAFC8" />
                <circle cx="174" cy="20" r="2.2" fill="#FFFFFF" className="animate-pulse" />
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* =========================================================================
          NIGHT RITUALS SECTION (2 DISTINCT VISUAL SCENES)
          - FEATURE 5: MOOD NIGHT (Large Moon Focal Point)
          - FEATURE 4: TRẠM NĂNG LƯỢNG (Calming Recharge & Crystals)
      ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-[#858198] uppercase tracking-wider">
            Nghi thức đêm & Nạp năng lượng
          </span>
          <span className="text-[11px] text-[#A8D2C4] font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Thư giãn sâu</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* FEATURE 5 — MOOD NIGHT: LARGE SOFT MOON FOCAL POINT SCENE */}
          <div
            onClick={() => openModal('moodNight')}
            className="relative p-6 rounded-[28px] bg-gradient-to-br from-[#1A1A3C]/95 via-[#232148]/90 to-[#12142E]/95 border border-[#B9A9E8]/35 hover:border-[#B9A9E8]/70 transition-all duration-300 cursor-pointer group shadow-[0_14px_35px_rgba(7,9,20,0.45)] hover:shadow-[0_16px_45px_rgba(185,169,232,0.25)] active:scale-[0.98] backdrop-blur-2xl flex flex-col justify-between overflow-hidden"
          >
            {/* Luminous Lunar Glow Pool */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#B9A9E8]/18 rounded-full blur-3xl pointer-events-none group-hover:bg-[#B9A9E8]/28 transition-all" />

            {/* Header info */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#B9A9E8]/15 border border-[#B9A9E8]/30 text-[#B9A9E8] text-[10px] font-bold mb-2">
                <span>NGHI THỨC ĐÊM</span>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-[#F5F2FA] font-display">
                Mood Night
              </h4>
              <p className="text-xs text-[#B9B5C8] mt-1 leading-relaxed">
                Trước khi ngủ, hôm nay lòng bạn đang ở đâu?
              </p>
            </div>

            {/* DEDICATED VISUAL: LARGE SOFT MOON SCENE */}
            <div className="relative w-full h-36 my-3 flex items-center justify-center">
              <svg
                viewBox="0 0 240 140"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full overflow-visible"
              >
                <defs>
                  {/* Moon Volumetric Gradient */}
                  <radialGradient id="moonSphereGrad" cx="35%" cy="30%" r="68%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="40%" stopColor="#FFFBEB" />
                    <stop offset="75%" stopColor="#E2D7F8" />
                    <stop offset="100%" stopColor="#B39EE0" />
                  </radialGradient>
                  {/* Lunar Halo */}
                  <radialGradient id="moonHalo" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFFEEA" stopOpacity="0.45" />
                    <stop offset="55%" stopColor="#B9A9E8" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#B9A9E8" stopOpacity="0" />
                  </radialGradient>
                  {/* Cloud Gradient */}
                  <linearGradient id="cloudGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#242145" stopOpacity="0.85" />
                    <stop offset="50%" stopColor="#373264" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#201C3E" stopOpacity="0.85" />
                  </linearGradient>
                </defs>

                {/* Soft Lunar Halo */}
                <circle cx="120" cy="65" r="62" fill="url(#moonHalo)" filter="blur(12px)" />

                {/* Large Soft Moon Sphere */}
                <circle
                  cx="120"
                  cy="65"
                  r="42"
                  fill="url(#moonSphereGrad)"
                  filter="drop-shadow(0 0 16px rgba(244, 238, 220, 0.45))"
                  className="transition-transform duration-700 group-hover:scale-105"
                />

                {/* Subtle soft craters / lunar maria */}
                <circle cx="106" cy="52" r="7" fill="#CBB8EE" opacity="0.3" />
                <circle cx="132" cy="58" r="9.5" fill="#CBB8EE" opacity="0.25" />
                <circle cx="118" cy="78" r="8" fill="#CBB8EE" opacity="0.28" />

                {/* Drifting Clouds curling gracefully around the moon */}
                <path
                  d="M 60 98 C 60 86, 74 80, 88 84 C 98 76, 118 76, 126 84 C 136 78, 154 78, 162 88 C 174 88, 184 96, 184 106 C 184 116, 172 120, 156 120 L 76 120 C 64 120, 60 110, 60 98 Z"
                  fill="url(#cloudGrad)"
                  stroke="#B9A9E8"
                  strokeWidth="0.8"
                  strokeOpacity="0.3"
                  filter="drop-shadow(0 6px 12px rgba(10, 13, 27, 0.5))"
                />

                {/* Tiny Fairy Spirit Silhouette resting on the cloud */}
                <g transform="translate(136, 68) scale(0.4)">
                  {/* Wing shimmer */}
                  <ellipse cx="14" cy="18" rx="14" ry="8" fill="#FFFFFF" opacity="0.75" />
                  <ellipse cx="32" cy="18" rx="14" ry="8" fill="#FFFFFF" opacity="0.75" />
                  {/* Body */}
                  <ellipse cx="23" cy="26" rx="8" ry="11" fill="#C6EAD9" />
                  <circle cx="23" cy="14" r="7" fill="#F3FBF7" />
                </g>

                {/* Twinkling surrounding stars */}
                <circle cx="48" cy="38" r="1.8" fill="#FFFCE8" className="animate-ping" />
                <circle cx="186" cy="42" r="2.2" fill="#B9A9E8" className="animate-pulse" />
                <circle cx="198" cy="85" r="1.5" fill="#FFFCE8" />
                <circle cx="38" cy="88" r="1.4" fill="#A8D2C4" />
              </svg>
            </div>

            {/* Action CTA */}
            <div className="pt-2 flex items-center justify-between border-t border-white/10">
              <span className="text-xs font-bold text-[#91B8E8] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                <span>Check-in đêm nay</span>
                <ChevronRight className="w-4 h-4" />
              </span>
              <span className="text-[10px] text-[#858198] italic">Tĩnh lặng</span>
            </div>
          </div>

          {/* FEATURE 4 — TRẠM NĂNG LƯỢNG: CALMING RECHARGE & CRYSTAL SCENE */}
          <div
            onClick={() => openModal('energyStation')}
            className="relative p-6 rounded-[28px] bg-gradient-to-br from-[#132328]/95 via-[#18233C]/90 to-[#12172A]/95 border border-[#A8D2C4]/35 hover:border-[#A8D2C4]/70 transition-all duration-300 cursor-pointer group shadow-[0_14px_35px_rgba(7,9,20,0.45)] hover:shadow-[0_16px_45px_rgba(168,210,196,0.25)] active:scale-[0.98] backdrop-blur-2xl flex flex-col justify-between overflow-hidden"
          >
            {/* Luminous Mint Glow Pool */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#A8D2C4]/18 rounded-full blur-3xl pointer-events-none group-hover:bg-[#A8D2C4]/28 transition-all" />

            {/* Header info */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#A8D2C4]/15 border border-[#A8D2C4]/30 text-[#A8D2C4] text-[10px] font-bold mb-2">
                <span>NẠP NĂNG LƯỢNG</span>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-[#F5F2FA] font-display">
                Trạm Năng Lượng
              </h4>
              <p className="text-xs text-[#B9B5C8] mt-1 leading-relaxed">
                Tạm dừng → Hít thở → Nạp lại: Lá bài vỗ về, gợn sóng buông lỏng & thư tương lai.
              </p>
            </div>

            {/* DEDICATED VISUAL: CRYSTALS, PLANTS & RECHARGE LIGHT */}
            <div className="relative w-full h-36 my-3 flex items-center justify-center">
              <svg
                viewBox="0 0 240 140"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full overflow-visible"
              >
                <defs>
                  {/* Crystal Gradient */}
                  <linearGradient id="crystalMain" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                    <stop offset="35%" stopColor="#D4F6EC" stopOpacity="0.9" />
                    <stop offset="70%" stopColor="#7FD2BA" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#3C8D75" stopOpacity="0.85" />
                  </linearGradient>
                  {/* Energy Ripple Glow */}
                  <radialGradient id="rippleGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#A8D2C4" stopOpacity="0.5" />
                    <stop offset="70%" stopColor="#A8D2C4" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#A8D2C4" stopOpacity="0" />
                  </radialGradient>
                  {/* Succulent Petal */}
                  <radialGradient id="succulentGrad" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#E6F9F2" />
                    <stop offset="60%" stopColor="#96D7C2" />
                    <stop offset="100%" stopColor="#4A8F78" />
                  </radialGradient>
                </defs>

                {/* Concentric Energy Breathing Ripples */}
                <ellipse cx="120" cy="98" rx="74" ry="24" fill="url(#rippleGlow)" className="animate-pulse" />
                <ellipse cx="120" cy="98" rx="52" ry="17" stroke="#A8D2C4" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="3 3" />
                <ellipse cx="120" cy="98" rx="34" ry="11" stroke="#A8D2C4" strokeWidth="1.2" strokeOpacity="0.7" />

                {/* Central Floating 3D Healing Crystal Prism */}
                <g className="transition-transform duration-500 group-hover:-translate-y-1.5">
                  {/* Main Prism Facets */}
                  <polygon points="120,24 136,54 120,96 104,54" fill="url(#crystalMain)" filter="drop-shadow(0 0 14px rgba(168, 210, 196, 0.6))" />
                  <polygon points="120,24 136,54 120,96" fill="#FFFFFF" fillOpacity="0.4" />
                  <polygon points="104,54 120,96 120,24" fill="#3C8D75" fillOpacity="0.3" />
                  {/* Crystal facet highlight */}
                  <line x1="120" y1="24" x2="120" y2="96" stroke="#FFFFFF" strokeWidth="1.4" opacity="0.9" />

                  {/* Secondary small flanking crystals */}
                  <polygon points="92,58 102,74 92,94 82,74" fill="url(#crystalMain)" opacity="0.8" />
                  <polygon points="148,58 158,74 148,94 138,74" fill="url(#crystalMain)" opacity="0.8" />
                </g>

                {/* Calming Moonlit Succulent / Night Flora base */}
                <g transform="translate(120, 108)">
                  <ellipse cx="-22" cy="0" rx="14" ry="8" fill="url(#succulentGrad)" transform="rotate(-15)" />
                  <ellipse cx="22" cy="0" rx="14" ry="8" fill="url(#succulentGrad)" transform="rotate(15)" />
                  <ellipse cx="-12" cy="6" rx="12" ry="7" fill="url(#succulentGrad)" transform="rotate(-5)" />
                  <ellipse cx="12" cy="6" rx="12" ry="7" fill="url(#succulentGrad)" transform="rotate(5)" />
                  <circle cx="0" cy="4" r="5" fill="#E6FAF2" />
                </g>

                {/* Floating healing energy sparks */}
                <circle cx="70" cy="46" r="2.2" fill="#A8D2C4" className="animate-ping" />
                <circle cx="170" cy="42" r="2" fill="#FFFCE8" />
                <circle cx="162" cy="80" r="1.6" fill="#A8D2C4" className="animate-pulse" />
                <circle cx="78" cy="82" r="1.5" fill="#E8FAF3" />
              </svg>
            </div>

            {/* Action CTA */}
            <div className="pt-2 flex items-center justify-between border-t border-white/10">
              <span className="text-xs font-bold text-[#A8D2C4] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                <span>Nạp dịu êm</span>
                <ChevronRight className="w-4 h-4" />
              </span>
              <span className="text-[10px] text-[#858198] italic">Hồi phục</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SANCTUARY & RELEASE SECTION
          - FEATURE 1: CHỐN AN TOÀN (Cozy Room, Window, Moonlight, Lamp)
          - LÒ ĐỐT ÁP LỰC (Warm Ember & Paper Release)
      ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-[#858198] uppercase tracking-wider">
            Không gian riêng tư & Buông xả
          </span>
          <span className="text-[11px] text-[#F4EEDC] font-semibold">Bình an</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* FEATURE 1 — CHỐN AN TOÀN: COZY SANCTUARY MINIATURE ROOM SCENE */}
          <div
            onClick={() => openModal('safeSpace')}
            className="relative p-6 rounded-[28px] bg-gradient-to-br from-[#181938]/95 via-[#232044]/90 to-[#14152D]/95 border border-[#F4EEDC]/30 hover:border-[#F4EEDC]/70 transition-all duration-300 cursor-pointer group shadow-[0_14px_35px_rgba(7,9,20,0.45)] hover:shadow-[0_16px_45px_rgba(244,238,220,0.2)] active:scale-[0.98] backdrop-blur-2xl flex flex-col justify-between overflow-hidden"
          >
            {/* Warm Moon Cream Glow Pool */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#F4EEDC]/15 rounded-full blur-3xl pointer-events-none group-hover:bg-[#F4EEDC]/25 transition-all" />

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#F4EEDC]/15 border border-[#F4EEDC]/30 text-[#F4EEDC] text-[10px] font-bold mb-2">
                <span>GÓC BÌNH YÊN</span>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-[#F5F2FA] font-display">
                Chốn An Toàn
              </h4>
              <p className="text-xs text-[#B9B5C8] mt-1 leading-relaxed">
                Một nơi chỉ dành cho bạn khi bạn cần được yên tĩnh.
              </p>
            </div>

            {/* DEDICATED VISUAL: COZY SANCTUARY MINIATURE ROOM SCENE */}
            <div className="relative w-full h-36 my-3 flex items-center justify-center">
              <svg
                viewBox="0 0 240 140"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full overflow-visible"
              >
                <defs>
                  {/* Moonlight beam through window */}
                  <linearGradient id="moonBeam" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFFEEA" stopOpacity="0.45" />
                    <stop offset="40%" stopColor="#FFFEEA" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#FFFEEA" stopOpacity="0" />
                  </linearGradient>
                  {/* Warm Bedside Lamp Glow */}
                  <radialGradient id="lampWarmGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFDE8A" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#FFC857" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#FFB326" stopOpacity="0" />
                  </radialGradient>
                  {/* Room Wall Base */}
                  <linearGradient id="roomFloor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1E1C38" />
                    <stop offset="100%" stopColor="#121326" />
                  </linearGradient>
                </defs>

                {/* Room Floor Plane */}
                <polygon points="20,105 220,105 230,132 10,132" fill="url(#roomFloor)" opacity="0.8" />
                <line x1="20" y1="105" x2="220" y2="105" stroke="#B9A9E8" strokeWidth="0.8" opacity="0.3" />

                {/* Arched Window with Moonlight Sky Outside */}
                <g>
                  {/* Window frame background */}
                  <path
                    d="M 50 100 L 50 48 C 50 32, 66 22, 85 22 C 104 22, 120 32, 120 48 L 120 100 Z"
                    fill="#0A0C1D"
                    stroke="#504B76"
                    strokeWidth="2.5"
                  />
                  {/* Deep starry sky through glass */}
                  <circle cx="74" cy="42" r="1.2" fill="#FFFFFF" />
                  <circle cx="102" cy="38" r="1.5" fill="#FFFCE8" />
                  <circle cx="88" cy="54" r="1" fill="#A8D2C4" />
                  {/* Crescent moon outside window */}
                  <path d="M 94 32 A 6 6 0 0 0 94 44 A 4.5 4.5 0 0 1 94 32" fill="#F4EEDC" />

                  {/* Window mullion grid */}
                  <line x1="85" y1="23" x2="85" y2="100" stroke="#504B76" strokeWidth="1.6" />
                  <line x1="50" y1="62" x2="120" y2="62" stroke="#504B76" strokeWidth="1.6" />

                  {/* Soft Draped Curtain on Window Side */}
                  <path
                    d="M 46 26 C 42 46, 38 72, 44 98 C 48 94, 52 92, 54 84 C 52 68, 50 46, 46 26 Z"
                    fill="#39345D"
                    opacity="0.85"
                  />
                  <path d="M 44 68 Q 48 70 52 68" stroke="#F4EEDC" strokeWidth="1.2" />

                  {/* Moonlight Beam Streaming into the Room */}
                  <polygon points="85,62 120,62 178,118 108,118" fill="url(#moonBeam)" />
                </g>

                {/* Bedside Lamp on Small Table with Warm Cozy Light */}
                <g transform="translate(165, 54)">
                  {/* Warm Light Glow Field */}
                  <circle cx="18" cy="22" r="32" fill="url(#lampWarmGlow)" filter="blur(8px)" />

                  {/* Small Round Bedside Table */}
                  <ellipse cx="18" cy="52" rx="18" ry="6" fill="#3A3358" stroke="#544B7E" strokeWidth="1" />
                  <line x1="18" y1="58" x2="18" y2="76" stroke="#2D2746" strokeWidth="3" />
                  <ellipse cx="18" cy="76" rx="10" ry="3" fill="#201C34" />

                  {/* Lamp Base and Stem */}
                  <line x1="18" y1="36" x2="18" y2="52" stroke="#E6C87C" strokeWidth="2" />
                  {/* Lamp Shade */}
                  <polygon points="9,36 27,36 23,22 13,22" fill="#FFF4D0" stroke="#E6C87C" strokeWidth="1" />
                  <ellipse cx="18" cy="22" rx="5" ry="1.5" fill="#FFFCE8" />
                  {/* Lamp bulb glow point */}
                  <circle cx="18" cy="34" r="2.5" fill="#FFFFFF" />
                </g>

                {/* Cozy Cushion / Blanket & Tiny Succulent */}
                <g>
                  {/* Soft Floor Cushion in the cozy corner */}
                  <ellipse cx="132" cy="112" rx="26" ry="10" fill="#4B3F70" stroke="#685998" strokeWidth="1" />
                  <ellipse cx="130" cy="110" rx="22" ry="7" fill="#5F518B" />

                  {/* Folded warm blanket */}
                  <path
                    d="M 112 110 C 114 105, 126 104, 134 108 C 142 112, 146 116, 138 118 Z"
                    fill="#F4EEDC"
                    opacity="0.85"
                  />

                  {/* Tiny potted plant on window sill */}
                  <rect x="54" y="94" width="8" height="7" rx="1.5" fill="#DFAFC8" />
                  <ellipse cx="58" cy="92" rx="4" ry="2.5" fill="#A8D2C4" />
                  <ellipse cx="58" cy="89" rx="2.5" ry="3" fill="#69B89F" />
                </g>

                {/* Mini Fairy Spirit resting quietly in the room */}
                <g transform="translate(122, 85) scale(0.35)">
                  <ellipse cx="12" cy="18" rx="12" ry="7" fill="#FFFFFF" opacity="0.8" />
                  <ellipse cx="28" cy="18" rx="12" ry="7" fill="#FFFFFF" opacity="0.8" />
                  <ellipse cx="20" cy="24" rx="7" ry="10" fill="#C6EAD9" />
                  <circle cx="20" cy="13" r="6.5" fill="#F3FBF7" />
                </g>
              </svg>
            </div>

            {/* Action CTA */}
            <div className="pt-2 flex items-center justify-between border-t border-white/10">
              <span className="text-xs font-bold text-[#F4EEDC] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                <span>Vào góc an toàn</span>
                <ChevronRight className="w-4 h-4" />
              </span>
              <span className="text-[10px] text-[#858198] italic">Đèn ấm & Thở</span>
            </div>
          </div>

          {/* LÒ ĐỐT ÁP LỰC: WARM EMBER & DISSOLVING PAPER RELEASE */}
          <div
            onClick={() => openModal('pressureFurnace')}
            className="relative p-6 rounded-[28px] bg-gradient-to-br from-[#26161D]/95 via-[#20152B]/90 to-[#121427]/95 border border-[#DF9A7A]/35 hover:border-[#DF9A7A]/70 transition-all duration-300 cursor-pointer group shadow-[0_14px_35px_rgba(7,9,20,0.45)] hover:shadow-[0_16px_45px_rgba(223,154,122,0.2)] active:scale-[0.98] backdrop-blur-2xl flex flex-col justify-between overflow-hidden"
          >
            {/* Warm Ember Glow Pool */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#DF9A7A]/15 rounded-full blur-3xl pointer-events-none group-hover:bg-[#DF9A7A]/25 transition-all" />

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#DF9A7A]/15 border border-[#DF9A7A]/30 text-[#DF9A7A] text-[10px] font-bold mb-2">
                <span>BUÔNG BỎ MUỘN PHIỀN</span>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-[#F5F2FA] font-display">
                Lò Đốt Áp Lực
              </h4>
              <p className="text-xs text-[#B9B5C8] mt-1 leading-relaxed">
                Giấy ngà hòa vào tàn tro và bụi sao ấm áp buông bỏ muộn phiền.
              </p>
            </div>

            {/* DEDICATED VISUAL: WARM HEARTH & EMBERS */}
            <div className="relative w-full h-36 my-3 flex items-center justify-center">
              <svg
                viewBox="0 0 240 140"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full overflow-visible"
              >
                <defs>
                  {/* Warm Flame Gradient */}
                  <linearGradient id="fireGrad" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#DF9A7A" />
                    <stop offset="50%" stopColor="#FFA665" />
                    <stop offset="100%" stopColor="#FFF2B2" />
                  </linearGradient>
                  {/* Ember Glow Pool */}
                  <radialGradient id="hearthGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#DF9A7A" stopOpacity="0.6" />
                    <stop offset="65%" stopColor="#DF9A7A" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#DF9A7A" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Warm Hearth Ambient Glow */}
                <ellipse cx="120" cy="85" rx="60" ry="30" fill="url(#hearthGlow)" filter="blur(10px)" />

                {/* Ceramic / Stone Hearth Bowl */}
                <ellipse cx="120" cy="102" rx="45" ry="14" fill="#1C182A" stroke="#DF9A7A" strokeWidth="1.2" strokeOpacity="0.5" />
                <path d="M 75 102 C 75 118, 165 118, 165 102 Z" fill="#2E1C25" stroke="#DF9A7A" strokeWidth="1" strokeOpacity="0.4" />

                {/* Floating Note dissolving into warm stardust */}
                <g className="transition-transform duration-500 group-hover:-translate-y-2">
                  {/* Parchment slipping into warmth */}
                  <rect
                    x="100"
                    y="45"
                    width="40"
                    height="46"
                    rx="6"
                    transform="rotate(-15 100 45)"
                    fill="#FAF3E6"
                    stroke="#DF9A7A"
                    strokeWidth="1"
                    opacity="0.9"
                  />
                  {/* Abstract worry script */}
                  <line x1="106" y1="56" x2="126" y2="52" stroke="#8C7A6D" strokeWidth="1.4" strokeLinecap="round" />
                  <line x1="104" y1="64" x2="128" y2="58" stroke="#B09F93" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="102" y1="72" x2="122" y2="66" stroke="#C8B8AD" strokeWidth="1" strokeLinecap="round" />
                </g>

                {/* Warm Cozy Flame Licks */}
                <path
                  d="M 120 72 C 126 62, 134 76, 130 88 C 128 92, 114 94, 112 88 C 110 82, 116 78, 120 72 Z"
                  fill="url(#fireGrad)"
                  filter="drop-shadow(0 0 10px #FFA665)"
                  className="animate-pulse"
                />
                <circle cx="120" cy="84" r="4" fill="#FFFFFF" />

                {/* Dissolving glowing stardust embers */}
                <circle cx="138" cy="48" r="2.2" fill="#FFA665" className="animate-ping" />
                <circle cx="146" cy="36" r="1.8" fill="#FFF2B2" />
                <circle cx="94" cy="52" r="1.6" fill="#DF9A7A" />
                <circle cx="152" cy="62" r="2" fill="#FFA665" />
              </svg>
            </div>

            {/* Action CTA */}
            <div className="pt-2 flex items-center justify-between border-t border-white/10">
              <span className="text-xs font-bold text-[#DF9A7A] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                <span>Buông bỏ gánh nặng</span>
                <ChevronRight className="w-4 h-4" />
              </span>
              <span className="text-[10px] text-[#858198] italic">Tàn tro sao</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CONNECTION & ARCHIVE SECTION
          - FEATURE 2: TELLIE MATE & CIRCLE (Soft Constellation Scene)
          - FEATURE 3: TELLIE GARDEN (Miniature 3D Night Garden)
      ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-[#858198] uppercase tracking-wider">
            Kết nối đồng điệu & Lưu trữ trưởng thành
          </span>
          <span className="text-[11px] text-[#B9A9E8] font-semibold">Gắn kết</span>
        </div>

        {/* FEATURE 2 — TELLIE MATE & CIRCLE: SOFT CONSTELLATION SCENE */}
        <div
          onClick={() => setActiveTab('connect')}
          className="relative p-6 sm:p-7 rounded-[30px] bg-gradient-to-br from-[#1A1838]/95 via-[#251E40]/90 to-[#14152F]/95 border border-[#DFAFC8]/35 hover:border-[#DFAFC8]/70 transition-all duration-300 cursor-pointer group shadow-[0_16px_40px_rgba(7,9,20,0.5)] hover:shadow-[0_16px_45px_rgba(223,175,200,0.25)] active:scale-[0.99] backdrop-blur-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden"
        >
          {/* Mist Pink / Lavender Glow Pool */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#DFAFC8]/16 rounded-full blur-3xl pointer-events-none group-hover:bg-[#DFAFC8]/26 transition-all duration-500" />

          <div className="flex-1 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DFAFC8]/15 border border-[#DFAFC8]/30 text-[#DFAFC8] text-[11px] font-bold">
              <span>CHÒM SAO ĐỒNG ĐIỆU</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-[#F5F2FA] font-display">
              Tellie Mate & Circle
            </h3>

            <p className="text-xs sm:text-sm text-[#B9B5C8] leading-relaxed max-w-md">
              Chòm sao tĩnh lặng kết nối những tâm hồn đồng điệu. Tìm người bạn lắng nghe 1-1 hoặc bước vào vòng tròn ấm áp hoàn toàn ẩn danh.
            </p>

            <div className="pt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#DFAFC8] group-hover:translate-x-1 transition-transform">
              <span>Khám phá chòm sao kết nối</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* DEDICATED VISUAL: CONSTELLATION OF SPIRITS FINDING EACH OTHER */}
          <div className="relative w-48 h-36 sm:w-56 sm:h-40 shrink-0 mx-auto md:mx-0 flex items-center justify-center">
            <svg
              viewBox="0 0 220 150"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full overflow-visible"
            >
              <defs>
                {/* Constellation Glow */}
                <radialGradient id="constellationAura" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#DFAFC8" stopOpacity="0.4" />
                  <stop offset="60%" stopColor="#B9A9E8" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#B9A9E8" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Background Starlight Aura */}
              <circle cx="110" cy="75" r="65" fill="url(#constellationAura)" filter="blur(14px)" />

              {/* Glowing Constellation Connecting Lines */}
              <g stroke="#B9A9E8" strokeWidth="1.2" strokeOpacity="0.6" strokeDasharray="3 3">
                <line x1="55" y1="45" x2="110" y2="75" />
                <line x1="110" y1="75" x2="165" y2="50" />
                <line x1="110" y1="75" x2="125" y2="120" />
                <line x1="55" y1="45" x2="75" y2="105" />
                <line x1="75" y1="105" x2="125" y2="120" />
              </g>

              {/* Resonant Energy Waves between Spirits */}
              <circle cx="110" cy="75" r="28" stroke="#DFAFC8" strokeWidth="0.8" strokeOpacity="0.4" className="animate-pulse" />
              <circle cx="110" cy="75" r="44" stroke="#B9A9E8" strokeWidth="0.8" strokeOpacity="0.25" />

              {/* NODE 1: Center Main Fairy Spirit Node */}
              <g transform="translate(110, 75)">
                {/* Luminous Core Ring */}
                <circle cx="0" cy="0" r="14" fill="#242145" stroke="#DFAFC8" strokeWidth="1.5" filter="drop-shadow(0 0 8px #DFAFC8)" />
                {/* Mini Fairy Wings */}
                <ellipse cx="-8" cy="-4" rx="7" ry="4" fill="#FFFFFF" opacity="0.8" />
                <ellipse cx="8" cy="-4" rx="7" ry="4" fill="#FFFFFF" opacity="0.8" />
                {/* Mini Body */}
                <ellipse cx="0" cy="2" rx="4.5" ry="6.5" fill="#EACFDF" />
                <circle cx="0" cy="-4" r="4" fill="#FFFFFF" />
              </g>

              {/* NODE 2: Upper Left Companion Spirit */}
              <g transform="translate(55, 45)">
                <circle cx="0" cy="0" r="11" fill="#1B1E38" stroke="#91B8E8" strokeWidth="1.2" filter="drop-shadow(0 0 6px #91B8E8)" />
                <ellipse cx="-6" cy="-3" rx="5" ry="3" fill="#FFFFFF" opacity="0.8" />
                <ellipse cx="6" cy="-3" rx="5" ry="3" fill="#FFFFFF" opacity="0.8" />
                <ellipse cx="0" cy="1" rx="3.5" ry="5" fill="#BCD9F8" />
                <circle cx="0" cy="-3" r="3" fill="#FFFFFF" />
              </g>

              {/* NODE 3: Upper Right Companion Spirit */}
              <g transform="translate(165, 50)">
                <circle cx="0" cy="0" r="11" fill="#1B1E38" stroke="#B9A9E8" strokeWidth="1.2" filter="drop-shadow(0 0 6px #B9A9E8)" />
                <ellipse cx="-6" cy="-3" rx="5" ry="3" fill="#FFFFFF" opacity="0.8" />
                <ellipse cx="6" cy="-3" rx="5" ry="3" fill="#FFFFFF" opacity="0.8" />
                <ellipse cx="0" cy="1" rx="3.5" ry="5" fill="#D4CBF5" />
                <circle cx="0" cy="-3" r="3" fill="#FFFFFF" />
              </g>

              {/* NODE 4: Lower Companion Spirit */}
              <g transform="translate(125, 120)">
                <circle cx="0" cy="0" r="9.5" fill="#171A35" stroke="#A8D2C4" strokeWidth="1.2" filter="drop-shadow(0 0 6px #A8D2C4)" />
                <ellipse cx="-5" cy="-2.5" rx="4.5" ry="2.5" fill="#FFFFFF" opacity="0.8" />
                <ellipse cx="5" cy="-2.5" rx="4.5" ry="2.5" fill="#FFFFFF" opacity="0.8" />
                <ellipse cx="0" cy="1" rx="3" ry="4.5" fill="#C6EAD9" />
                <circle cx="0" cy="-2.5" r="2.8" fill="#FFFFFF" />
              </g>

              {/* Tiny constellation stars */}
              <circle cx="75" cy="105" r="2" fill="#F4EEDC" className="animate-ping" />
              <circle cx="34" cy="78" r="1.6" fill="#FFFFFF" />
              <circle cx="188" cy="85" r="1.8" fill="#DFAFC8" />
              <circle cx="140" cy="28" r="1.4" fill="#B9A9E8" />
            </svg>
          </div>
        </div>

        {/* FEATURE 3 — TELLIE GARDEN: MINIATURE 3D NIGHT GARDEN SCENE */}
        <div
          onClick={() => setActiveTab('garden')}
          className="relative p-6 sm:p-7 rounded-[30px] bg-gradient-to-br from-[#111F1D]/95 via-[#182C26]/90 to-[#13222E]/95 border border-[#A8D2C4]/35 hover:border-[#A8D2C4]/70 transition-all duration-300 cursor-pointer group shadow-[0_16px_40px_rgba(7,9,20,0.5)] hover:shadow-[0_16px_45px_rgba(168,210,196,0.25)] active:scale-[0.99] backdrop-blur-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden"
        >
          {/* Soft Mint / Night Garden Glow Pool */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#A8D2C4]/18 rounded-full blur-3xl pointer-events-none group-hover:bg-[#A8D2C4]/28 transition-all duration-500" />

          <div className="flex-1 space-y-2">
            <div className="inline-flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#A8D2C4]/15 border border-[#A8D2C4]/30 text-[#A8D2C4] text-[11px] font-bold">
                VƯỜN KỶ NIỆM
              </span>
              <span className="text-[11px] text-[#A8D2C4] bg-[#0E1B19]/80 border border-[#A8D2C4]/25 px-2.5 py-0.5 rounded-full font-bold">
                {gardenPlants.length} mầm sống đã lưu
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-[#F5F2FA] font-display">
              Tellie Garden
            </h3>

            <p className="text-xs sm:text-sm text-[#B9B5C8] leading-relaxed max-w-md">
              “Vườn của những điều bạn muốn lưu giữ.” Mỗi cảm xúc và bước tiến đều là hạt giống lớn lên theo thời gian.
            </p>

            <div className="pt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#A8D2C4] group-hover:translate-x-1 transition-transform">
              <span>Bước vào khu vườn đêm</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* DEDICATED VISUAL: MINIATURE 3D NIGHT GARDEN SCENE */}
          <div className="relative w-48 h-36 sm:w-56 sm:h-40 shrink-0 mx-auto md:mx-0 flex items-center justify-center">
            <svg
              viewBox="0 0 220 150"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full overflow-visible"
            >
              <defs>
                {/* Soil & Mound Gradients */}
                <linearGradient id="gardenSoil" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#223E34" />
                  <stop offset="60%" stopColor="#142620" />
                  <stop offset="100%" stopColor="#0B1713" />
                </linearGradient>
                <linearGradient id="grassMound" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#2F5547" />
                  <stop offset="50%" stopColor="#4A8270" />
                  <stop offset="100%" stopColor="#25473B" />
                </linearGradient>
                {/* Firefly Glow */}
                <radialGradient id="fireflyGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFFCE6" stopOpacity="0.9" />
                  <stop offset="45%" stopColor="#A8D2C4" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#A8D2C4" stopOpacity="0" />
                </radialGradient>
                {/* Flower Blossom Gradient */}
                <radialGradient id="nightBlossom" cx="40%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="40%" stopColor="#E2F7EE" />
                  <stop offset="85%" stopColor="#7FD5B8" />
                  <stop offset="100%" stopColor="#418970" />
                </radialGradient>
              </defs>

              {/* Gentle Night Mist & Soil Mound */}
              <ellipse cx="110" cy="120" rx="95" ry="24" fill="url(#gardenSoil)" />
              <path
                d="M 25 120 C 45 106, 90 102, 110 106 C 135 110, 175 104, 195 120 Z"
                fill="url(#grassMound)"
                stroke="#68AB94"
                strokeWidth="1"
                strokeOpacity="0.3"
              />

              {/* Rounded Garden Stones */}
              <ellipse cx="64" cy="118" rx="10" ry="5.5" fill="#364942" stroke="#4C655C" strokeWidth="0.8" />
              <ellipse cx="78" cy="122" rx="7" ry="4" fill="#283A34" />
              <ellipse cx="168" cy="119" rx="11" ry="6" fill="#364942" stroke="#4C655C" strokeWidth="0.8" />

              {/* Stage 1: Sprout (Hạt giống nảy mầm) */}
              <g transform="translate(56, 102)">
                <path d="M 0 10 Q 2 2 4 0" stroke="#7FD5B8" strokeWidth="1.8" strokeLinecap="round" />
                <ellipse cx="6" cy="-1" rx="3.5" ry="2" fill="#A8D2C4" transform="rotate(25)" />
                <ellipse cx="0" cy="1" rx="3" ry="1.8" fill="#7FD5B8" transform="rotate(-30)" />
              </g>

              {/* Stage 2: Tall leafy growth (Chồi non vươn lên) */}
              <g transform="translate(154, 92)">
                <path d="M 0 20 Q -3 8 0 0" stroke="#5EA890" strokeWidth="2.2" strokeLinecap="round" />
                <ellipse cx="-6" cy="10" rx="6" ry="3.5" fill="#A8D2C4" transform="rotate(-25)" />
                <ellipse cx="6" cy="4" rx="6" ry="3.5" fill="#A8D2C4" transform="rotate(25)" />
                <circle cx="0" cy="-2" r="3" fill="#E6FAF2" />
              </g>

              {/* Stage 3: Glowing Special Night Flower (Hoa đêm rực rỡ) */}
              <g transform="translate(108, 76)">
                {/* Flower Stem */}
                <path d="M 0 38 Q 4 18 0 0" stroke="#68B89E" strokeWidth="2.4" strokeLinecap="round" />
                <ellipse cx="-8" cy="20" rx="8" ry="4.5" fill="#7FD5B8" transform="rotate(-25)" />
                <ellipse cx="8" cy="12" rx="8" ry="4.5" fill="#7FD5B8" transform="rotate(25)" />

                {/* Night Flower Petals */}
                <circle cx="0" cy="-4" r="16" fill="url(#fireflyGlow)" opacity="0.6" />
                <ellipse cx="-6" cy="-6" rx="6" ry="9" fill="url(#nightBlossom)" transform="rotate(-20)" />
                <ellipse cx="6" cy="-6" rx="6" ry="9" fill="url(#nightBlossom)" transform="rotate(20)" />
                <ellipse cx="0" cy="-8" rx="6" ry="10" fill="url(#nightBlossom)" />
                <circle cx="0" cy="-5" r="3.5" fill="#FFFFFF" />
              </g>

              {/* Mini Fairy Spirit floating gently above the garden */}
              <g transform="translate(142, 42) scale(0.38)">
                {/* Wings */}
                <ellipse cx="6" cy="16" rx="15" ry="9" fill="#FFFFFF" opacity="0.85" />
                <ellipse cx="26" cy="16" rx="15" ry="9" fill="#FFFFFF" opacity="0.85" />
                {/* Fairy Body */}
                <ellipse cx="16" cy="24" rx="8" ry="11" fill="#C6EAD9" />
                <circle cx="16" cy="12" r="7" fill="#F3FBF7" />
              </g>

              {/* Fireflies floating softly in the mist */}
              <g>
                <circle cx="78" cy="68" r="4" fill="url(#fireflyGlow)" className="animate-pulse" />
                <circle cx="78" cy="68" r="1.6" fill="#FFFFFF" />

                <circle cx="178" cy="62" r="5" fill="url(#fireflyGlow)" className="animate-ping" />
                <circle cx="178" cy="62" r="2" fill="#FFFFFF" />

                <circle cx="128" cy="98" r="3.5" fill="url(#fireflyGlow)" />
                <circle cx="128" cy="98" r="1.4" fill="#FFFCE6" />
              </g>
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
};
