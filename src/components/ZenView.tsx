import React, { useState, useEffect } from 'react';
import {
  Flame,
  Scissors,
  CircleDot,
  ArrowDown,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Wind,
  Heart,
  Feather,
  Layers,
  ChevronRight,
  ShieldAlert,
  Play,
  Pause,
  Moon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sound } from '../utils/audio';
import { AFFIRMATION_CARDS } from '../data/initialData';

export const ZenView: React.FC = () => {
  const { burnPaper, openModal } = useApp();

  // Lò Đốt Áp Lực State
  const [paperContent, setPaperContent] = useState('');
  const [burnStage, setBurnStage] = useState<'writing' | 'burning' | 'revealed'>('writing');
  const [burnMethod, setBurnMethod] = useState<'tear' | 'crumple' | 'toss'>('toss');
  const [burnProgress, setBurnProgress] = useState(0);

  // Chốn An Toàn Tab: 'breathe' | 'sounds' | 'grounding'
  const [safeSpaceTab, setSafeSpaceTab] = useState<'breathe' | 'sounds' | 'grounding'>('breathe');

  // Bài tập thở 4-4-4 State
  const [breathePattern, setBreathePattern] = useState<'4-4-4' | '4-4-4-4'>('4-4-4');
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(true);
  const [breathePhase, setBreathePhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [breatheSeconds, setBreatheSeconds] = useState<number>(4);
  const [breatheCycleCount, setBreatheCycleCount] = useState<number>(0);

  // Safe Space Ambient Sound State
  const [activeSound, setActiveSound] = useState<'rain' | 'crickets' | 'starlight' | null>(null);
  const [soundVolume, setSoundVolume] = useState<number>(0.6);

  // Energy Station Quick Affirmation
  const [cardIdx, setCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Grounding Step in Zen
  const [groundingStep, setGroundingStep] = useState(0);
  const GROUNDING_STEPS = [
    { count: '5', label: 'Nhìn thấy 5 đồ vật quanh bạn (màu sắc, hình dạng)' },
    { count: '4', label: 'Chạm vào 4 kết cấu (mặt bàn, sợi vải, tóc, sàn nhà)' },
    { count: '3', label: 'Lắng nghe 3 âm thanh nhỏ trong không gian' },
    { count: '2', label: 'Cảm nhận 2 mùi hương thoảng nhẹ' },
    { count: '1', label: 'Nhận biết 1 vị trong miệng hoặc hít một hơi sâu' }
  ];

  // Breathing Box Timer Effect
  useEffect(() => {
    if (safeSpaceTab !== 'breathe' || !isBreathingActive) return;

    const interval = setInterval(() => {
      setBreatheSeconds(prev => {
        if (prev <= 1) {
          setBreathePhase(current => {
            if (current === 'inhale') {
              sound.playChime(640);
              return 'hold';
            }
            if (current === 'hold') {
              sound.playChime(520);
              return 'exhale';
            }
            if (current === 'exhale') {
              if (breathePattern === '4-4-4') {
                setBreatheCycleCount(c => c + 1);
                sound.playChime(784);
                return 'inhale';
              } else {
                sound.playChime(460);
                return 'rest';
              }
            }
            // rest phase in 4-4-4-4
            setBreatheCycleCount(c => c + 1);
            sound.playChime(784);
            return 'inhale';
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [safeSpaceTab, isBreathingActive, breathePattern]);

  // Stop sound when unmounted
  useEffect(() => {
    return () => {
      sound.stopAmbient();
    };
  }, []);

  // Handle Burn Action
  const handleStartBurn = (method: 'tear' | 'crumple' | 'toss') => {
    if (!paperContent.trim()) return;
    setBurnMethod(method);
    setBurnStage('burning');
    sound.playBurnSound();

    let progress = 0;
    const interval = setInterval(() => {
      progress += 9;
      setBurnProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          burnPaper(paperContent, 'Nỗi niềm buông bỏ', false);
          setBurnStage('revealed');
          sound.playChime(720);
        }, 500);
      }
    }, 180);
  };

  const handleResetBurner = () => {
    setPaperContent('');
    setBurnStage('writing');
    setBurnProgress(0);
  };

  // Sound handler
  const handleToggleSound = (type: 'rain' | 'crickets' | 'starlight') => {
    if (activeSound === type) {
      sound.stopAmbient();
      setActiveSound(null);
    } else {
      sound.startAmbient(type);
      setActiveSound(type);
      sound.setAmbientVolume(soundVolume);
    }
  };

  const handleVolumeChange = (newVal: number) => {
    setSoundVolume(newVal);
    sound.setAmbientVolume(newVal);
  };
  const getBreathePhaseInfo = () => {
    switch (breathePhase) {
      case 'inhale':
        return {
          title: 'Hít vào nhẹ nhàng',
          sub: 'Hít vào sâu bằng mũi, đong đầy sự an yên (4s)',
          color: '#B9A9E8',
          bg: 'bg-[#B9A9E8]/25',
          border: 'border-[#B9A9E8]',
          badgeText: 'HÍT VÀO · 4S',
          scale: 'scale-125',
          shadow: 'shadow-[0_0_35px_rgba(185,169,232,0.55)]'
        };
      case 'hold':
        return {
          title: 'Giữ hơi thở êm đềm',
          sub: 'Cảm nhận sự tĩnh lặng và vững vàng trong ngực (4s)',
          color: '#A8D2C4',
          bg: 'bg-[#A8D2C4]/30',
          border: 'border-[#A8D2C4]',
          badgeText: 'GIỮ HƠI · 4S',
          scale: 'scale-125',
          shadow: 'shadow-[0_0_35px_rgba(168,210,196,0.6)]'
        };
      case 'exhale':
        return {
          title: 'Thở ra chậm rãi',
          sub: 'Thở ra nhẹ qua môi, buông lỏng mọi âu lo (4s)',
          color: '#91B8E8',
          bg: 'bg-[#91B8E8]/20',
          border: 'border-[#91B8E8]',
          badgeText: 'THỞ RA · 4S',
          scale: 'scale-90',
          shadow: 'shadow-[0_0_20px_rgba(145,184,232,0.35)]'
        };
      case 'rest':
        return {
          title: 'Tĩnh lặng thả lỏng',
          sub: 'Thả lỏng đôi vai, chuẩn bị cho chu kỳ tiếp theo (4s)',
          color: '#F4EEDC',
          bg: 'bg-[#F4EEDC]/15',
          border: 'border-[#F4EEDC]',
          badgeText: 'NGHỈ TĨNH · 4S',
          scale: 'scale-90',
          shadow: 'shadow-[0_0_20px_rgba(244,238,220,0.3)]'
        };
    }
  };

  return (
    <div className="space-y-8 text-left pb-16 animate-fade-in">
      {/* 1. Header Banner */}
      <div className="rounded-3xl p-6 border border-[#B9A9E8]/25 bg-gradient-to-br from-[#171A35]/90 via-[#1E1C40]/80 to-[#0D1020]/90 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#A8D2C4]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold text-[#A8D2C4] tracking-wider uppercase">
            <span>🕯️ Chốn Bình Yên & Nạp Năng Lượng</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F2FA] font-display tracking-tight">
            Không Gian Zen Tĩnh Lặng
          </h2>
          <p className="text-xs sm:text-sm text-[#E2E8F0] max-w-md leading-relaxed">
            Thả trôi áp lực vào lò thiêu rụi, lắng nghe thanh âm thiên nhiên và tái tạo lại nguồn năng lượng an lành.
          </p>
        </div>
      </div>

      {/* =========================================================================
          2. LÒ ĐỐT ÁP LỰC (STRESS BURNER)
          Light-colored "Trang giấy", 3 destruction options, animations
      ========================================================================= */}
      <section className="glass-panel rounded-3xl p-5 sm:p-7 border border-orange-500/25 shadow-2xl relative overflow-hidden space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#F5F2FA] font-display">
                Lò Đốt Áp Lực (Stress Burner)
              </h3>
              <p className="text-xs text-[#E2E8F0]">
                Viết mọi âu lo lên trang giấy và chọn cách đưa vào lò để buông bỏ.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-orange-300 bg-orange-950/60 border border-orange-500/30 px-3 py-1 rounded-full">
            Thực tế ảo hóa
          </span>
        </div>

        {/* WRITING STAGE: LIGHT-COLORED TRANG GIẤY */}
        {burnStage === 'writing' && (
          <div className="space-y-4">
            <div className="relative rounded-2xl bg-[#FFFDF5] p-5 shadow-2xl border border-[#E8DEC9] text-[#2C2723] overflow-hidden">
              {/* Paper line texture background */}
              <div
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                  backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #E5DCBF 28px)'
                }}
              />
              <div className="relative z-10 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#8C827A] border-b border-[#E8DEC9] pb-2">
                  <span>Trang giấy trút bầu tâm sự</span>
                  <span>{paperContent.length} ký tự</span>
                </div>
                <textarea
                  rows={5}
                  value={paperContent}
                  onChange={e => setPaperContent(e.target.value)}
                  placeholder="Ghi ra điều làm bạn bức bối, mệt mỏi, bất công, hay nỗi sợ hãi lớn nhất lúc này... Không ai thấy trang giấy này ngoài bạn."
                  className="w-full bg-transparent text-sm text-[#1A1816] placeholder-[#8C827A] focus:outline-none resize-none leading-7 font-medium"
                />
              </div>
            </div>

            {/* MINIATURE STONE KILN PREVIEW */}
            <div className="relative w-40 h-32 mx-auto flex items-center justify-center">
              <svg viewBox="0 0 160 140" fill="none" className="w-full h-full overflow-visible">
                <defs>
                  <radialGradient id="zenHearthGlow" cx="50%" cy="60%" r="60%">
                    <stop offset="0%" stopColor="#FFA048" />
                    <stop offset="50%" stopColor="#EA580C" />
                    <stop offset="90%" stopColor="#431407" />
                  </radialGradient>
                  <linearGradient id="zenKilnStone" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3F395B" />
                    <stop offset="100%" stopColor="#171528" />
                  </linearGradient>
                </defs>
                <path d="M 68 18 L 92 18 L 88 45 L 72 45 Z" fill="url(#zenKilnStone)" stroke="#534B76" strokeWidth="1.5" />
                <ellipse cx="80" cy="18" rx="12" ry="3.5" fill="#534B76" />
                <path d="M 78 14 Q 74 6 82 2 Q 86 -4 80 -10" stroke="rgba(244, 238, 220, 0.4)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                <path
                  d="M 32 120 C 26 80 44 45 80 45 C 116 45 134 80 128 120 C 120 128 40 128 32 120 Z"
                  fill="url(#zenKilnStone)"
                  stroke="#534B76"
                  strokeWidth="2"
                />
                <path d="M 52 122 C 52 86 108 86 108 122 Z" fill="url(#zenHearthGlow)" stroke="#FFedd5" strokeWidth="1.5" />
                <g className="animate-pulse">
                  <path d="M 68 120 Q 80 92 84 104 Q 92 88 94 120 Z" fill="#FDE047" opacity="0.9" />
                  <path d="M 74 120 Q 80 100 82 108 Q 86 98 88 120 Z" fill="#FFFFFF" />
                  <circle cx="80" cy="115" r="16" fill="#F97316" opacity="0.4" filter="blur(4px)" />
                </g>
                <rect x="24" y="120" width="112" height="12" rx="4" fill="#1C1A2E" stroke="#534B76" strokeWidth="1.5" />
              </svg>
            </div>

            {/* 3 DESTRUCTION OPTIONS */}
            <div className="space-y-2 pt-1">
              <span className="block text-xs font-bold text-[#F5F2FA] uppercase tracking-wider">
                Chọn cách tiêu hủy áp lực:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* 1. Xé vụn giấy */}
                <button
                  type="button"
                  disabled={!paperContent.trim()}
                  onClick={() => handleStartBurn('tear')}
                  className="min-h-[48px] p-3 rounded-2xl bg-[#171A35] hover:bg-[#242347] border border-orange-400/30 hover:border-orange-400/60 transition-all text-left group disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-3 active:scale-95 shadow-md"
                >
                  <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Scissors className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#F5F2FA] group-hover:text-orange-300">
                      Xé vụn giấy
                    </span>
                    <span className="text-[10px] text-[#E2E8F0] block leading-tight">
                      Xé thành từng mảnh thả vào lò
                    </span>
                  </div>
                </button>

                {/* 2. Vo tròn giấy */}
                <button
                  type="button"
                  disabled={!paperContent.trim()}
                  onClick={() => handleStartBurn('crumple')}
                  className="min-h-[48px] p-3 rounded-2xl bg-[#171A35] hover:bg-[#242347] border border-amber-400/30 hover:border-amber-400/60 transition-all text-left group disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-3 active:scale-95 shadow-md"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <CircleDot className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#F5F2FA] group-hover:text-amber-300">
                      Vo tròn giấy
                    </span>
                    <span className="text-[10px] text-[#E2E8F0] block leading-tight">
                      Vo thành viên ném vào lò
                    </span>
                  </div>
                </button>

                {/* 3. Ném trực tiếp */}
                <button
                  type="button"
                  disabled={!paperContent.trim()}
                  onClick={() => handleStartBurn('toss')}
                  className="min-h-[48px] p-3 rounded-2xl bg-[#171A35] hover:bg-[#242347] border border-rose-400/30 hover:border-rose-400/60 transition-all text-left group disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-3 active:scale-95 shadow-md"
                >
                  <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <ArrowDown className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#F5F2FA] group-hover:text-rose-300">
                      Ném trực tiếp
                    </span>
                    <span className="text-[10px] text-[#E2E8F0] block leading-tight">
                      Đưa thẳng tờ giấy vào ngọn lửa
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* BURNING ANIMATION STAGE */}
        {burnStage === 'burning' && (
          <div className="py-6 space-y-5 text-center">
            <div className="relative w-72 h-64 mx-auto flex flex-col items-center justify-center overflow-hidden">
              <div className="relative w-full h-36 flex items-center justify-center">
                {burnMethod === 'tear' && (
                  <div className="flex gap-2.5">
                    {[0, 1, 2].map(i => (
                      <div
                        key={i}
                        className="w-12 h-24 bg-[#FFFDF5] rounded shadow-xl border border-[#E8DEC9] p-1.5 transition-all duration-300"
                        style={{
                          transform: `translateY(${burnProgress * 0.8}px) rotate(${(i - 1) * (20 + burnProgress * 0.3)}deg) scale(${Math.max(0.1, 1 - burnProgress * 0.01)})`,
                          opacity: Math.max(0, 1 - burnProgress * 0.012),
                          filter: `brightness(${1 + burnProgress * 0.015})`
                        }}
                      />
                    ))}
                  </div>
                )}

                {burnMethod === 'crumple' && (
                  <div
                    className="w-18 h-18 bg-gradient-to-br from-[#FFFDF5] to-[#D5C7AF] rounded-full shadow-2xl border border-[#A39A8B] transition-all duration-300 flex items-center justify-center text-[10px] font-bold text-[#524B42]"
                    style={{
                      transform: `translateY(${burnProgress * 0.8}px) rotate(${burnProgress * 6}deg) scale(${Math.max(0.2, 1 - burnProgress * 0.009)})`,
                      opacity: Math.max(0, 1 - burnProgress * 0.012)
                    }}
                  >
                    Áp lực
                  </div>
                )}

                {burnMethod === 'toss' && (
                  <div
                    className="w-44 h-28 bg-[#FFFDF5] p-3 rounded-xl shadow-2xl border border-[#E8DEC9] text-[10px] text-[#524B42] italic transition-all duration-300"
                    style={{
                      transform: `translateY(${burnProgress * 0.8}px) scale(${Math.max(0.1, 1 - burnProgress * 0.01)})`,
                      opacity: Math.max(0, 1 - burnProgress * 0.012)
                    }}
                  >
                    "{paperContent.slice(0, 40)}..."
                  </div>
                )}

                {/* Stardust Embers */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="text-orange-400 text-lg animate-ping">✦</div>
                  <div className="text-amber-300 text-sm animate-pulse ml-10">✧</div>
                  <div className="text-[#F4EEDC] text-xs animate-ping -ml-12">⋆</div>
                </div>
              </div>

              <div className="text-xs text-orange-300 font-bold animate-pulse">
                Ngọn lửa đang hóa giải áp lực: {burnProgress}%
              </div>
            </div>
          </div>
        )}

        {/* REVEALED STAGE */}
        {burnStage === 'revealed' && (
          <div className="py-6 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center mx-auto text-orange-400">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-[#F5F2FA] font-display">
                Áp lực đã tan thành mây khói ✨
              </h4>
              <p className="text-xs text-[#E2E8F0] mt-1 max-w-sm mx-auto leading-relaxed">
                Bạn đã dũng cảm đối diện và buông bỏ gánh nặng này. Hãy thả lỏng và đón nhận một khởi đầu nhẹ nhõm hơn.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetBurner}
              className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-[#F5F2FA] transition-all flex items-center gap-2 mx-auto"
            >
              <RotateCcw className="w-4 h-4 text-orange-400" />
              <span>Đốt thêm một áp lực khác</span>
            </button>
          </div>
        )}
      </section>

      {/* =========================================================================
          3. CHỐN AN TOÀN & TRẠM NĂNG LƯỢNG (CLEAN CARDS WITH GENEROUS WHITESPACE)
      ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* CARD 1: CHỐN AN TOÀN (SAFE SPACE - BÀI TẬP THỞ 4-4-4, ÂM THANH & GROUNDING) */}
        <div className="glass-panel rounded-3xl p-6 border border-white/15 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-300 uppercase">
                <Wind className="w-3 h-3" />
                <span>Chốn An Toàn</span>
              </div>
              <h3 className="text-lg font-bold text-[#F5F2FA] font-display">
                Bài Tập Thở 4-4-4 & Thả Lỏng
              </h3>
            </div>

            {/* Quick button to open full Safe Space modal */}
            <button
              type="button"
              onClick={() => openModal('safeSpace')}
              className="text-[11px] font-bold text-emerald-300 hover:text-white px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-1.5 shrink-0"
              title="Mở phòng Chốn An Toàn toàn màn hình"
            >
              <Moon className="w-3.5 h-3.5 text-amber-300" />
              <span>Phòng an toàn</span>
            </button>
          </div>

          {/* Sub-tabs inside Chốn An Toàn */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0F1326] border border-white/10">
            <button
              type="button"
              onClick={() => {
                setSafeSpaceTab('breathe');
                sound.playChime(520);
              }}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                safeSpaceTab === 'breathe'
                  ? 'bg-emerald-950/70 border border-emerald-400 text-emerald-200 shadow-md'
                  : 'text-[#E2E8F0] hover:text-white'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              <span>Thở 4-4-4</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSafeSpaceTab('sounds');
                sound.playChime(520);
              }}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                safeSpaceTab === 'sounds'
                  ? 'bg-emerald-950/70 border border-emerald-400 text-emerald-200 shadow-md'
                  : 'text-[#E2E8F0] hover:text-white'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Âm thanh</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSafeSpaceTab('grounding');
                sound.playChime(520);
              }}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                safeSpaceTab === 'grounding'
                  ? 'bg-emerald-950/70 border border-emerald-400 text-emerald-200 shadow-md'
                  : 'text-[#E2E8F0] hover:text-white'
              }`}
            >
              <span>5-4-3-2-1</span>
            </button>
          </div>

          {/* =========================================================================
              SUB-TAB A: BÀI TẬP THỞ 4-4-4 (FEATURED)
          ========================================================================= */}
          {safeSpaceTab === 'breathe' && (
            <div className="space-y-4 pt-1 animate-fade-in text-center">
              {/* Pattern Selector Pill */}
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setBreathePattern('4-4-4');
                    setBreathePhase('inhale');
                    setBreatheSeconds(4);
                    sound.playChime(560);
                  }}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all ${
                    breathePattern === '4-4-4'
                      ? 'bg-emerald-900/50 border-emerald-400 text-emerald-200 shadow-sm'
                      : 'bg-white/5 border-white/10 text-[#CBD5E1]'
                  }`}
                >
                  Thở 4-4-4 (Hít 4s · Giữ 4s · Thở 4s)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBreathePattern('4-4-4-4');
                    setBreathePhase('inhale');
                    setBreatheSeconds(4);
                    sound.playChime(560);
                  }}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all ${
                    breathePattern === '4-4-4-4'
                      ? 'bg-emerald-900/50 border-emerald-400 text-emerald-200 shadow-sm'
                      : 'bg-white/5 border-white/10 text-[#CBD5E1]'
                  }`}
                >
                  Hộp 4-4-4-4
                </button>
              </div>

              {/* EXPANDING & CONTRACTING BREATHING ORB */}
              <div className="relative w-36 h-36 mx-auto flex items-center justify-center my-2">
                {/* Outermost breathing aura ring */}
                <div
                  className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                    breathePhase === 'inhale'
                      ? 'scale-125 bg-[#B9A9E8]/20 blur-md ring-2 ring-[#B9A9E8]/40'
                      : breathePhase === 'hold'
                      ? 'scale-125 bg-[#A8D2C4]/25 blur-md ring-2 ring-[#A8D2C4]/50'
                      : 'scale-90 bg-[#91B8E8]/15 blur-sm ring-1 ring-white/10'
                  }`}
                />

                {/* Inner Glowing Center Orb */}
                <div
                  className={`w-28 h-28 rounded-full border-2 transition-all duration-1000 flex flex-col items-center justify-center relative z-10 ${
                    getBreathePhaseInfo().bg
                  } ${getBreathePhaseInfo().border} ${getBreathePhaseInfo().shadow} ${getBreathePhaseInfo().scale}`}
                >
                  {/* Countdown number */}
                  <span className="text-3xl font-extrabold text-[#FFFFFF] font-display tracking-tight">
                    {breatheSeconds}
                  </span>
                  <span className="text-[10px] font-extrabold tracking-wider uppercase mt-0.5" style={{ color: getBreathePhaseInfo().color }}>
                    {breathePhase === 'inhale' ? 'HÍT VÀO' : breathePhase === 'hold' ? 'GIỮ HƠI' : breathePhase === 'exhale' ? 'THỞ RA' : 'TĨNH LẶNG'}
                  </span>
                </div>
              </div>

              {/* Direct Phase Guidance */}
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#FFFFFF]">
                  {getBreathePhaseInfo().title}
                </h4>
                <p className="text-xs text-[#E2E8F0] leading-relaxed max-w-xs mx-auto">
                  {getBreathePhaseInfo().sub}
                </p>
              </div>

              {/* Action Controls & Cycle Counter */}
              <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsBreathingActive(!isBreathingActive);
                      sound.playChime(isBreathingActive ? 420 : 640);
                    }}
                    className={`min-h-[38px] px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isBreathingActive
                        ? 'bg-white/10 border-white/15 text-[#FFFFFF] hover:bg-white/20'
                        : 'bg-emerald-600 border-emerald-500 text-[#0D0F1D] shadow-md'
                    }`}
                  >
                    {isBreathingActive ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>Tạm dừng</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Bắt đầu thở</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBreathePhase('inhale');
                      setBreatheSeconds(4);
                      sound.playChime(500);
                    }}
                    className="min-h-[38px] p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#CBD5E1] hover:text-white border border-white/10"
                    title="Đặt lại chu kỳ"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="text-[11px] font-semibold text-[#A8D2C4] bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  Chu kỳ: {breatheCycleCount}
                </span>
              </div>
            </div>
          )}

          {/* =========================================================================
              SUB-TAB B: ÂM THANH THIÊN NHIÊN (KÈM THANH KÉO TĂNG GIẢM ÂM LƯỢNG)
          ========================================================================= */}
          {safeSpaceTab === 'sounds' && (
            <div className="space-y-4 pt-1 animate-fade-in">
              <p className="text-xs text-[#E2E8F0] leading-relaxed">
                Bật âm thanh thiên nhiên êm dịu để giải tỏa căng thẳng khi học bài hoặc trước khi ngủ.
              </p>

              {/* 3 Sound Selectors */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'rain', label: 'Mưa đêm', icon: '🌧️' },
                  { id: 'crickets', label: 'Côn trùng', icon: '🦗' },
                  { id: 'starlight', label: 'Chuông gió', icon: '✨' }
                ].map(s => {
                  const isPlaying = activeSound === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleToggleSound(s.id as any)}
                      className={`min-h-[50px] p-2.5 rounded-2xl border text-center transition-all ${
                        isPlaying
                          ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400/40 shadow-lg scale-102'
                          : 'bg-[#11152A] border-white/10 text-[#E2E8F0] hover:border-white/25'
                      }`}
                    >
                      <span className="text-lg block">{s.icon}</span>
                      <span className="text-[11px] font-bold block mt-1">{s.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* THANH KÉO TĂNG GIẢM ÂM LƯỢNG (VOLUME SLIDER) */}
              <div className="p-4 rounded-2xl bg-[#11152A] border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#F5F2FA] flex items-center gap-2">
                    {soundVolume === 0 || !activeSound ? (
                      <VolumeX className="w-4 h-4 text-[#858198]" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-emerald-300" />
                    )}
                    <span>Âm lượng âm thanh thư giãn</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-500/30">
                    {activeSound ? `${Math.round(soundVolume * 100)}%` : 'Đang tắt'}
                  </span>
                </div>

                {/* Slider Input with Quick Mute/Max buttons */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (soundVolume > 0) {
                        handleVolumeChange(0);
                      } else {
                        handleVolumeChange(0.6);
                        if (!activeSound) handleToggleSound('rain');
                      }
                    }}
                    className="p-1 rounded-lg text-[#CBD5E1] hover:text-white transition-colors"
                    title={soundVolume === 0 ? 'Bật âm lượng' : 'Tắt tiếng'}
                  >
                    {soundVolume === 0 || !activeSound ? (
                      <VolumeX className="w-4 h-4 text-rose-400" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </button>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={Math.round(soundVolume * 100)}
                    onChange={(e) => {
                      const val = Number(e.target.value) / 100;
                      handleVolumeChange(val);
                      if (!activeSound && val > 0) {
                        handleToggleSound('rain');
                      }
                    }}
                    className="flex-1 h-2 bg-[#242347] rounded-lg appearance-none cursor-pointer accent-emerald-400"
                    aria-label="Thanh kéo tăng giảm âm lượng"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      handleVolumeChange(1);
                      if (!activeSound) handleToggleSound('rain');
                    }}
                    className="text-[10px] font-bold text-[#CBD5E1] hover:text-white px-2 py-1 rounded-md bg-white/5 border border-white/10"
                    title="Đặt âm lượng tối đa"
                  >
                    100%
                  </button>
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#CBD5E1]">
                  <span>0% (Tĩnh lặng)</span>
                  <span>50% (Dịu êm)</span>
                  <span>100% (Rõ nét)</span>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              SUB-TAB C: BÀI TẬP TIẾP ĐẤT 5-4-3-2-1
          ========================================================================= */}
          {safeSpaceTab === 'grounding' && (
            <div className="space-y-3 pt-1 animate-fade-in">
              <span className="block text-xs font-bold text-[#F5F2FA] uppercase tracking-wider">
                Bài tập tiếp đất 5-4-3-2-1
              </span>
              <div className="p-3.5 rounded-2xl bg-[#11152A] border border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0">
                    {GROUNDING_STEPS[groundingStep].count}
                  </span>
                  <span className="text-xs text-[#F5F2FA] leading-snug">
                    {GROUNDING_STEPS[groundingStep].label}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setGroundingStep((groundingStep + 1) % GROUNDING_STEPS.length)}
                  className="text-[11px] font-bold text-emerald-300 hover:text-white px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 shrink-0"
                >
                  Bước tiếp
                </button>
              </div>
            </div>
          )}
        </div>

        {/* CARD 2: TRẠM NĂNG LƯỢNG (AFFIRMATIONS & RECHARGE) */}
        <div className="glass-panel rounded-3xl p-6 border border-white/15 shadow-xl space-y-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B9A9E8]/10 border border-[#B9A9E8]/20 text-[10px] font-bold text-[#B9A9E8] uppercase">
              <Sparkles className="w-3 h-3" />
              <span>Trạm Năng Lượng</span>
            </div>
            <h3 className="text-lg font-bold text-[#F5F2FA] font-display">
              Thẻ Khẳng Định Tích Cực
            </h3>
            <p className="text-xs text-[#E2E8F0] leading-relaxed">
              Mỗi ngày một thông điệp tiếp thêm dũng khí và lòng trắc ẩn cho chính bạn.
            </p>
          </div>

          {/* Interactive Affirmation Card */}
          <div
            onClick={() => {
              setIsFlipped(!isFlipped);
              sound.playChime(640);
            }}
            className="cursor-pointer min-h-[140px] rounded-2xl bg-gradient-to-br from-[#171A35] via-[#211F42] to-[#12162E] border border-[#B9A9E8]/30 p-5 shadow-xl flex flex-col justify-between hover:border-[#B9A9E8]/60 transition-all select-none active:scale-[0.99]"
          >
            <div className="flex items-center justify-between text-[11px] text-[#A8D2C4] font-bold">
              <span>{AFFIRMATION_CARDS[cardIdx].title}</span>
              <span className="text-xs">Chạm để {isFlipped ? 'lật lại' : 'xem lời nhắn'} ↺</span>
            </div>

            <p className="text-sm font-semibold text-[#F5F2FA] my-2 leading-relaxed italic">
              “{isFlipped ? AFFIRMATION_CARDS[cardIdx].spiritHint : AFFIRMATION_CARDS[cardIdx].body}”
            </p>

            <span className="text-[10px] text-[#B9B5C8]">
              {AFFIRMATION_CARDS[cardIdx].spiritHint}
            </span>
          </div>

          {/* Next Card Button */}
          <button
            type="button"
            onClick={() => {
              setIsFlipped(false);
              setCardIdx((cardIdx + 1) % AFFIRMATION_CARDS.length);
              sound.playChime(580);
            }}
            className="w-full py-3 rounded-2xl bg-[#171A35] hover:bg-[#202547] border border-[#B9A9E8]/30 text-xs font-bold text-[#F5F2FA] transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B9A9E8]" />
            <span>Rút thông điệp tiếp theo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
