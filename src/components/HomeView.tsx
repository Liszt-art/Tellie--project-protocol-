import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  Heart,
  Smile,
  Check,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SpiritAvatar } from './SpiritAvatar';
import { getSpiritById } from '../data/spirits';
import { MOODS_LIST, getMoodById } from '../data/moods';
import { getKintsugiMetaByMood } from '../data/kintsugi';
import { KintsugiObjectGraphic } from './KintsugiObjectGraphic';
import { MoodId } from '../types';
import { sound } from '../utils/audio';
import { speechService } from '../utils/speech';

export const HomeView: React.FC = () => {
  const {
    userSpirit,
    feedSpiritLove,
    todayMood,
    recordMood,
    userNickname,
    setActiveTab
  } = useApp();

  const [isSpeakingHero, setIsSpeakingHero] = useState(false);
  const [tapPoint, setTapPoint] = useState<{ x: number; y: number } | null>(null);
  const [isLightRadiating, setIsLightRadiating] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [rippleKey, setRippleKey] = useState(0);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [moodNote, setMoodNote] = useState('');
  
  // Generated cracked object model state
  const [generatedMood, setGeneratedMood] = useState<MoodId | null>(null);
  const [showGeneratedObject, setShowGeneratedObject] = useState(false);
  
  const lastTapRef = React.useRef<number>(0);

  const currentSpiritId = userSpirit ? userSpirit.spiritId : 'fairy';
  const spiritMeta = getSpiritById(currentSpiritId);
  const spiritName = userSpirit?.customName || 'Tellie Spirit';

  const heroGreeting = `Chào ${userNickname || spiritName}, mình là Tellie Spirit. Mình ở đây để lắng nghe và vỗ về bạn.`;

  // Voice synthesis subscriber
  useEffect(() => {
    const unsub = speechService.subscribe((speaking, textId) => {
      if (textId === 'hero-greeting') {
        setIsSpeakingHero(speaking);
      } else if (!speaking) {
        setIsSpeakingHero(false);
      }
    });
    return () => unsub();
  }, []);

  const handleToggleVoice = () => {
    if (isSpeakingHero) {
      speechService.stop();
    } else {
      speechService.speak(heroGreeting, 'hero-greeting');
    }
  };

  // Instant light & wave radiation on tap
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

    sound.playChime(784);
    feedSpiritLove();
    setIsLightRadiating(true);
    setRippleKey(prev => prev + 1);
    setIsConnected(true);

    setTimeout(() => {
      setIsLightRadiating(false);
    }, 1300);
  };

  // Selecting a mood generates cracked ceramic/glass object model
  const handleSelectMood = (moodId: MoodId) => {
    recordMood(moodId, moodNote.trim() || undefined);
    sound.playChime(528);
    setGeneratedMood(moodId);
    setShowGeneratedObject(true);
  };

  const handleGoToJournal = () => {
    sound.playChime(640);
    setShowMoodModal(false);
    setShowGeneratedObject(false);
    setMoodNote('');
    setActiveTab('journal');
  };

  const handleCloseMoodModal = () => {
    setShowMoodModal(false);
    setShowGeneratedObject(false);
    setGeneratedMood(null);
    setMoodNote('');
  };

  return (
    <div className="relative min-h-[72vh] flex flex-col justify-between items-center text-center py-4 animate-fade-in select-none">
      {/* ATMOSPHERIC BACKGROUND BLOOMS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-gradient-to-b from-[#B9A9E8]/15 via-[#91B8E8]/10 to-transparent blur-[80px]" />
        <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-[#FFFEE8]/8 blur-[70px] animate-moon-pulse" />
        <div className="absolute bottom-10 -left-10 w-64 h-64 rounded-full bg-[#A8D2C4]/10 blur-[80px]" />
      </div>

      {/* TOP SPEECH BUBBLE */}
      <div className="w-full max-w-sm mx-auto px-2 pt-2">
        <div className="p-4 rounded-2xl bg-[#0D1020]/90 border border-white/15 shadow-xl flex items-center justify-between gap-3 text-left backdrop-blur-xl">
          <div className="flex-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#A8D2C4] mb-0.5 tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A8D2C4] animate-pulse" />
              <span>TELLIE COMPANION</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-[#FFFFFF] leading-relaxed">
              “{heroGreeting}”
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleVoice}
            className={`p-2.5 rounded-2xl transition-all border shrink-0 ${
              isSpeakingHero
                ? 'bg-[#B9A9E8] text-[#0D1020] border-[#B9A9E8] shadow-lg scale-105'
                : 'bg-white/10 text-[#E2E8F0] border-white/10 hover:text-white hover:bg-white/20'
            }`}
            title="Đọc lời vỗ về"
          >
            {isSpeakingHero ? (
              <VolumeX className="w-4 h-4 animate-pulse" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* CENTERED LIGHTWEIGHT 2D / ANIMATED TELLIE SPIRIT */}
      <div
        onPointerDown={(e) => handleSpiritTouch(e.clientX, e.clientY, e.currentTarget)}
        onClick={(e) => handleSpiritTouch(e.clientX, e.clientY, e.currentTarget)}
        className="relative z-10 flex flex-col items-center justify-center my-auto cursor-pointer group py-6 select-none overflow-hidden rounded-3xl w-full max-w-xs"
        title="Chạm nhẹ để kết nối cùng Tellie Spirit"
      >
        {/* Instant Light Wave Expansion from Tap Point */}
        {isLightRadiating && (
          <div
            key={rippleKey}
            className="absolute inset-0 pointer-events-none overflow-hidden z-30"
          >
            <div
              className="absolute"
              style={{
                left: tapPoint ? `${tapPoint.x}px` : '50%',
                top: tapPoint ? `${tapPoint.y}px` : '45%',
                width: 0,
                height: 0
              }}
            >
              <div className="absolute w-24 h-24 -left-12 -top-12 rounded-full bg-gradient-to-r from-white via-[#B9A9E8]/90 to-[#A8D2C4]/80 shadow-[0_0_35px_rgba(255,255,255,0.95)] animate-instant-light-core pointer-events-none" />
              <div className="absolute w-24 h-24 -left-12 -top-12 rounded-full border-2 border-white/95 shadow-[0_0_24px_rgba(255,255,255,0.9)] animate-instant-wave-1 pointer-events-none" />
              <div className="absolute w-24 h-24 -left-12 -top-12 rounded-full border-2 border-[#B9A9E8]/85 shadow-[0_0_28px_rgba(185,169,232,0.8)] animate-instant-wave-2 pointer-events-none" />
            </div>
          </div>
        )}

        {/* 2D Fairy Spirit Avatar */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
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

        {/* Connection status tag */}
        {isConnected ? (
          <div className="mt-2 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#11242E]/90 border border-[#A8D2C4]/50 text-[11px] text-[#A8D2C4] font-bold backdrop-blur-xl animate-fadeIn">
            <span className="w-2 h-2 rounded-full bg-[#A8D2C4] animate-ping" />
            <span>Đã kết nối tâm hồn cùng {spiritName}</span>
          </div>
        ) : (
          <div className="mt-2 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#11152A]/80 border border-[#B9A9E8]/20 text-[11px] text-[#E2E8F0] font-medium backdrop-blur-xl group-hover:border-[#B9A9E8]/40 transition-all">
            <Heart className="w-3 h-3 text-[#DFAFC8] fill-current animate-pulse" />
            <span>Chạm nhẹ để kết nối cùng {spiritName}</span>
          </div>
        )}
      </div>

      {/* SINGLE PROMINENT PRIMARY CTA BUTTON: "CHECK-IN CẢM XÚC" */}
      <div className="w-full max-w-sm mx-auto px-4 pb-2 z-20">
        <button
          type="button"
          onClick={() => {
            sound.playChime(640);
            setShowMoodModal(true);
          }}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#B9A9E8] via-[#A8D2C4] to-[#91B8E8] text-[#0D0F1D] font-extrabold text-sm sm:text-base tracking-wide shadow-[0_10px_30px_rgba(185,169,232,0.35)] hover:shadow-[0_15px_40px_rgba(185,169,232,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
        >
          <Smile className="w-5 h-5 stroke-[2.5]" />
          <span>Check-in cảm xúc</span>
          {todayMood && (
            <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-black/20 text-[#0D0F1D] font-bold">
              {getMoodById(todayMood).icon}
            </span>
          )}
        </button>

        {todayMood && (
          <p className="text-[11px] text-[#CBD5E1] mt-2 font-medium">
            Hôm nay bạn đang cảm thấy: <span className="text-[#A8D2C4] font-bold">{getMoodById(todayMood).labelVi}</span>
          </p>
        )}
      </div>

      {/* MOOD CHECK-IN & KINTSUGI OBJECT GENERATION MODAL */}
      {showMoodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0D1B]/90 backdrop-blur-2xl animate-fade-in text-left">
          <div className="w-full max-w-md glass-panel rounded-3xl p-6 border border-white/15 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div>
                <span className="text-[10px] text-[#A8D2C4] font-bold uppercase tracking-wider block">
                  {showGeneratedObject ? 'Vật Phẩm Tâm Hồn Kintsugi' : 'Lắng nghe bản thân'}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#FFFFFF] font-display">
                  {showGeneratedObject ? 'Đã sinh ra vật phẩm nứt vỡ' : 'Hôm nay bạn cảm thấy thế nào?'}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseMoodModal}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#B9B5C8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* IF GENERATED OBJECT: SHOW CRACKED MODEL */}
            {showGeneratedObject && generatedMood ? (() => {
              const kintMeta = getKintsugiMetaByMood(generatedMood);
              const moodMeta = getMoodById(generatedMood);

              return (
                <div className="space-y-4 py-1 text-center animate-fade-in">
                  <div className="relative py-4 flex flex-col items-center justify-center">
                    <div className="p-4 rounded-3xl bg-[#0D1129]/80 border border-white/10 shadow-2xl">
                      <KintsugiObjectGraphic
                        objectType={kintMeta.objectType}
                        repairProgress={0}
                        size="hero"
                        showGlow={true}
                      />
                    </div>

                    <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-[11px] font-bold text-amber-300">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>{kintMeta.categoryLabelVi} · Vết nứt nguyên bản</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 px-2">
                    <h4 className="text-base font-extrabold text-white flex items-center justify-center gap-2">
                      <span>{moodMeta.icon}</span>
                      <span>{kintMeta.nameVi}</span>
                    </h4>
                    <p className="text-xs text-[#CBD5E1] leading-relaxed">
                      {kintMeta.descriptionVi}
                    </p>
                    <p className="text-[11px] text-amber-200/90 italic pt-1">
                      “Khi bạn viết hoặc thu âm tâm sự ở tab Nhật Ký, những đường chỉ vàng Kintsugi sẽ lập tức hàn gắn chiếc bình này.”
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={handleGoToJournal}
                      className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 text-[#0D0F1D] font-extrabold text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 fill-current" />
                      <span>Hàn gắn bằng Nhật Ký →</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseMoodModal}
                      className="w-full sm:w-auto py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 text-[#E2E8F0] font-bold text-xs transition-colors"
                    >
                      Lưu vào tâm hồn
                    </button>
                  </div>
                </div>
              );
            })() : (
              /* DEFAULT: 8 MOOD SELECTION GRID */
              <>
                <div className="grid grid-cols-4 gap-2.5">
                  {MOODS_LIST.map(m => {
                    const isSelected = todayMood === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleSelectMood(m.id)}
                        className={`min-h-[70px] p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center active:scale-95 ${
                          isSelected
                            ? 'bg-[#242347] border-[#B9A9E8] ring-2 ring-[#B9A9E8]/60 shadow-lg scale-105'
                            : 'bg-[#11152A] border-white/10 text-[#E2E8F0] hover:border-white/25 hover:bg-[#171A35]'
                        }`}
                      >
                        <span className="text-2xl">{m.icon}</span>
                        <span className="text-[10px] font-bold text-[#FFFFFF] mt-1 truncate max-w-full">
                          {m.labelVi}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Optional Note */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-bold text-[#F5F2FA] uppercase tracking-wider block">
                    Ghi chú ngắn (Tùy chọn):
                  </label>
                  <input
                    type="text"
                    value={moodNote}
                    onChange={e => setMoodNote(e.target.value)}
                    placeholder="VD: Vừa hoàn thành một buổi học, thấy nhẹ nhõm..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#11152A] border border-white/15 text-xs text-[#F5F2FA] placeholder-[#858198] focus:outline-none focus:border-[#B9A9E8]"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
