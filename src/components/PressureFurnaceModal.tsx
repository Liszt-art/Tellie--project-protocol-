import React, { useState } from 'react';
import { Flame, X, Sparkles, Lock, Trash2, RotateCcw, Scissors, CircleDot, ArrowDown } from 'lucide-react';
import { SpiritAvatar } from './SpiritAvatar';
import { useApp } from '../context/AppContext';
import { sound } from '../utils/audio';

interface PressureFurnaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Stage = 'writing' | 'burning' | 'revealed';
type BurnMethod = 'tear' | 'crumple' | 'toss';

export const PressureFurnaceModal: React.FC<PressureFurnaceModalProps> = ({ isOpen, onClose }) => {
  const { userSpirit, burnPaper } = useApp();
  const [content, setContent] = useState('');
  const [stage, setStage] = useState<Stage>('writing');
  const [burnMethod, setBurnMethod] = useState<BurnMethod>('toss');
  const [burnProgress, setBurnProgress] = useState(0);

  if (!isOpen) return null;

  const handleStartBurn = (method: BurnMethod) => {
    if (!content.trim()) return;
    setBurnMethod(method);
    setStage('burning');
    sound.playBurnSound();

    let progress = 0;
    const interval = setInterval(() => {
      progress += 8;
      setBurnProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setStage('revealed');
        }, 600);
      }
    }, 200);
  };

  const handleKeepPrivate = () => {
    burnPaper(content, 'Nỗi lòng đã buông', true);
    sound.playChime(600);
    handleReset();
    onClose();
  };

  const handleDeletePermanent = () => {
    burnPaper(content, 'Nỗi lòng đã buông', false);
    sound.playChime(520);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setContent('');
    setStage('writing');
    setBurnProgress(0);
  };

  const currentSpiritId = userSpirit ? userSpirit.spiritId : 'fairy';
  const spiritName = userSpirit ? userSpirit.customName : 'Fairy';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0A0D1B]/95 backdrop-blur-2xl overflow-y-auto">
      {/* Warm Ambient Glow reacting to burning */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${
          stage === 'burning' ? 'opacity-90' : stage === 'revealed' ? 'opacity-60' : 'opacity-25'
        }`}
        style={{
          background: 'radial-gradient(circle at center, rgba(251, 146, 60, 0.2) 0%, rgba(185, 169, 232, 0.08) 50%, transparent 80%)'
        }}
      />

      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-5 sm:p-7 border border-[#F4EEDC]/25 shadow-2xl my-auto text-center max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#858198] hover:text-[#F5F2FA] w-8 h-8 rounded-full flex items-center justify-center bg-white/5 transition-colors z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {stage === 'writing' && (
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4EEDC]/10 border border-[#F4EEDC]/20 text-[#F4EEDC] text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400 animate-pulse" />
              <span>LÒ ĐỐT ÁP LỰC</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#F5F2FA] font-display">
              Có điều gì đang làm bạn nặng lòng?
            </h2>
            <p className="text-xs text-[#B9B5C8] max-w-xs mx-auto">
              Viết tất cả những bực bội, bất an, áp lực hay giận dữ vào trang giấy này để đưa vào lò đốt giải tỏa.
            </p>

            {/* Warm Parchment Paper for Writing */}
            <div className="relative mx-auto max-w-md p-5 sm:p-6 rounded-2xl bg-[#F8F5EC] text-[#2D2A26] shadow-xl border border-[#E8DEC9] text-left transform rotate-[-0.5deg]">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#A39A8B] font-mono border-b border-[#E8DEC9] pb-2 mb-2">
                <span>Trang giấy trút bầu tâm sự</span>
                <span className="text-[#DF9A7A] font-bold">Kín đáo</span>
              </div>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={5}
                placeholder="Ví dụ: Mình rất mệt vì kỳ thi này... Mình thấy bất an về năng lực bản thân... Mình giận vì bị hiểu lầm..."
                className="w-full bg-transparent resize-none border-none outline-none font-['Plus_Jakarta_Sans',sans-serif] text-xs sm:text-sm text-[#242220] placeholder-[#A39A8B] leading-relaxed"
              />
              <div className="flex justify-between items-center pt-2 text-[11px] text-[#8C8272] border-t border-[#E8DEC9]">
                <span>Chỉ một mình bạn nhìn thấy</span>
                <span>{content.length} ký tự</span>
              </div>
            </div>

            {/* MINIATURE VISUAL FURNACE PREVIEW */}
            <div className="relative w-44 h-36 mx-auto flex items-center justify-center my-1">
              <svg viewBox="0 0 160 140" fill="none" className="w-full h-full overflow-visible">
                <defs>
                  <radialGradient id="hearthGlow" cx="50%" cy="60%" r="60%">
                    <stop offset="0%" stopColor="#FFA048" />
                    <stop offset="40%" stopColor="#EA580C" />
                    <stop offset="80%" stopColor="#9A3412" />
                    <stop offset="100%" stopColor="#431407" />
                  </radialGradient>
                  <linearGradient id="kilnStone" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3F395B" />
                    <stop offset="50%" stopColor="#25213B" />
                    <stop offset="100%" stopColor="#171528" />
                  </linearGradient>
                </defs>

                {/* Chimney */}
                <path d="M 68 18 L 92 18 L 88 45 L 72 45 Z" fill="url(#kilnStone)" stroke="#534B76" strokeWidth="1.5" />
                <ellipse cx="80" cy="18" rx="12" ry="3.5" fill="#534B76" />
                {/* Gentle smoke curls */}
                <path d="M 78 14 Q 74 6 82 2 Q 86 -4 80 -10" stroke="rgba(244, 238, 220, 0.4)" strokeWidth="1.8" fill="none" strokeLinecap="round" />

                {/* Furnace Dome Body */}
                <path
                  d="M 32 120 C 26 80 44 45 80 45 C 116 45 134 80 128 120 C 120 128 40 128 32 120 Z"
                  fill="url(#kilnStone)"
                  stroke="#534B76"
                  strokeWidth="2"
                />

                {/* Stone Textures */}
                <path d="M 46 68 Q 60 64 74 68" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" fill="none" />
                <path d="M 86 68 Q 100 64 114 68" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" fill="none" />
                <path d="M 40 95 Q 54 90 60 96" stroke="rgba(255,255,255,0.1)" strokeWidth="1.2" fill="none" />
                <path d="M 100 96 Q 108 90 120 95" stroke="rgba(255,255,255,0.1)" strokeWidth="1.2" fill="none" />

                {/* Arched Hearth Mouth (Fire chamber) */}
                <path
                  d="M 52 122 C 52 86 108 86 108 122 Z"
                  fill="url(#hearthGlow)"
                  stroke="#FFedd5"
                  strokeWidth="1.5"
                />

                {/* Glowing Embers & Flames Inside */}
                <g className="animate-pulse">
                  <path d="M 68 120 Q 80 92 84 104 Q 92 88 94 120 Z" fill="#FDE047" opacity="0.9" />
                  <path d="M 74 120 Q 80 100 82 108 Q 86 98 88 120 Z" fill="#FFFFFF" />
                  <circle cx="80" cy="115" r="18" fill="#F97316" opacity="0.4" filter="blur(4px)" />
                </g>

                {/* Base Hearth Stones */}
                <rect x="24" y="120" width="112" height="12" rx="4" fill="#1C1A2E" stroke="#534B76" strokeWidth="1.5" />
              </svg>
            </div>

            {/* THREE CHOICE ACTION BUTTONS PER REQUIREMENT 6 */}
            <div className="space-y-2 pt-1">
              <p className="text-xs font-bold text-[#F4EEDC] uppercase tracking-wider">
                Chọn cách đưa giấy vào lò đốt:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Choice 1: Xé giấy rồi bỏ vào lò */}
                <button
                  type="button"
                  onClick={() => handleStartBurn('tear')}
                  disabled={!content.trim()}
                  className="p-3 rounded-2xl bg-[#171A35] hover:bg-[#242347] border border-orange-400/30 hover:border-orange-400/60 transition-all text-left group disabled:opacity-40 disabled:cursor-not-allowed flex sm:flex-col items-center sm:items-start gap-2.5 shadow-md active:scale-95"
                >
                  <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Scissors className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#F5F2FA] group-hover:text-orange-300">
                      Xé vụn giấy
                    </span>
                    <span className="text-[10px] text-[#B9B5C8] block leading-tight">
                      Xé rời từng mảnh rồi thả vào lò
                    </span>
                  </div>
                </button>

                {/* Choice 2: Vo giấy thành viên rồi ném vào lò */}
                <button
                  type="button"
                  onClick={() => handleStartBurn('crumple')}
                  disabled={!content.trim()}
                  className="p-3 rounded-2xl bg-[#171A35] hover:bg-[#242347] border border-amber-400/30 hover:border-amber-400/60 transition-all text-left group disabled:opacity-40 disabled:cursor-not-allowed flex sm:flex-col items-center sm:items-start gap-2.5 shadow-md active:scale-95"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <CircleDot className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#F5F2FA] group-hover:text-amber-300">
                      Vo tròn giấy
                    </span>
                    <span className="text-[10px] text-[#B9B5C8] block leading-tight">
                      Vo thành viên rồi ném vào lò
                    </span>
                  </div>
                </button>

                {/* Choice 3: Ném trực tiếp tờ giấy vào lò */}
                <button
                  type="button"
                  onClick={() => handleStartBurn('toss')}
                  disabled={!content.trim()}
                  className="p-3 rounded-2xl bg-[#171A35] hover:bg-[#242347] border border-rose-400/30 hover:border-rose-400/60 transition-all text-left group disabled:opacity-40 disabled:cursor-not-allowed flex sm:flex-col items-center sm:items-start gap-2.5 shadow-md active:scale-95"
                >
                  <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#F5F2FA] group-hover:text-rose-300">
                      Ném trực tiếp
                    </span>
                    <span className="text-[10px] text-[#B9B5C8] block leading-tight">
                      Ném thẳng cả tờ vào ngọn lửa
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {stage === 'burning' && (
          <div className="py-6 space-y-5">
            <div className="relative w-72 h-72 mx-auto flex flex-col items-center justify-center overflow-hidden">
              {/* ANIMATED FALLING / BURNING PAPER BASED ON SELECTED METHOD */}
              <div className="relative w-full h-44 flex items-center justify-center">
                {burnMethod === 'tear' && (
                  /* 3 Shredded Strips Diving into Furnace */
                  <div className="flex gap-2.5">
                    {[0, 1, 2].map(i => (
                      <div
                        key={i}
                        className="w-12 h-28 bg-[#F8F5EC] rounded-md shadow-xl border border-[#E8DEC9] text-[8px] text-[#524B42] p-1.5 overflow-hidden transition-all duration-300"
                        style={{
                          transform: `translateY(${burnProgress * 0.9}px) rotate(${(i - 1) * (15 + burnProgress * 0.3)}deg) scale(${Math.max(0.1, 1 - burnProgress * 0.009)})`,
                          opacity: Math.max(0, 1 - burnProgress * 0.012),
                          filter: `brightness(${1 + burnProgress * 0.015})`
                        }}
                      >
                        <div className="space-y-1">
                          <div className="h-1 bg-[#2D2A26]/20 rounded" />
                          <div className="h-1 bg-[#2D2A26]/20 rounded" />
                          <div className="h-1 bg-[#2D2A26]/20 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {burnMethod === 'crumple' && (
                  /* Crumpled Paper Ball Arching into Furnace */
                  <div
                    className="w-20 h-20 bg-gradient-to-br from-[#F8F5EC] via-[#E8DEC9] to-[#D5C7AF] rounded-full shadow-2xl border border-[#A39A8B] transition-all duration-300 flex items-center justify-center"
                    style={{
                      transform: `translateY(${burnProgress * 0.9}px) rotate(${burnProgress * 5}deg) scale(${Math.max(0.2, 1 - burnProgress * 0.008)})`,
                      opacity: Math.max(0, 1 - burnProgress * 0.011),
                      filter: `brightness(${1 + burnProgress * 0.015})`
                    }}
                  >
                    <span className="text-[9px] text-[#524B42] font-mono">✦ áp lực ✦</span>
                  </div>
                )}

                {burnMethod === 'toss' && (
                  /* Whole Sheet Gliding into Furnace */
                  <div
                    className="w-48 h-32 bg-[#F8F5EC] p-3 rounded-xl shadow-2xl border border-[#E8DEC9] text-[9px] text-[#524B42] italic transition-all duration-300 relative overflow-hidden"
                    style={{
                      transform: `translateY(${burnProgress * 0.9}px) rotate(${burnProgress * 0.25}deg) scale(${Math.max(0.1, 1 - burnProgress * 0.009)})`,
                      opacity: Math.max(0, 1 - burnProgress * 0.011),
                      filter: `brightness(${1 + burnProgress * 0.015})`
                    }}
                  >
                    <p className="line-clamp-2">"{content}"</p>
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `linear-gradient(to top, rgba(249, 115, 22, ${burnProgress * 0.015}) 0%, transparent 80%)`
                      }}
                    />
                  </div>
                )}

                {/* Stardust Embers Dissipating into Floating Lights */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="text-orange-300 text-lg animate-ping" style={{ transform: 'translate(-30px, -20px)' }}>✦</div>
                  <div className="text-amber-200 text-sm animate-pulse" style={{ transform: 'translate(40px, -40px)' }}>✧</div>
                  <div className="text-[#F4EEDC] text-xs animate-ping" style={{ transform: 'translate(10px, -60px)' }}>⋆</div>
                  <div className="text-[#B9A9E8] text-sm animate-pulse" style={{ transform: 'translate(-40px, -70px)' }}>✧</div>
                </div>
              </div>

              {/* Glowing Furnace Base */}
              <div className="relative w-36 h-28 -mt-6">
                <svg viewBox="0 0 160 140" fill="none" className="w-full h-full overflow-visible">
                  <path d="M 32 120 C 26 80 44 45 80 45 C 116 45 134 80 128 120 Z" fill="#25213B" stroke="#F97316" strokeWidth="2" />
                  <path d="M 52 122 C 52 86 108 86 108 122 Z" fill="#EA580C" />
                  <g className="animate-pulse">
                    <circle cx="80" cy="105" r="24" fill="#FDE047" opacity="0.8" filter="blur(6px)" />
                  </g>
                </svg>
              </div>
            </div>

            <div className="w-48 mx-auto bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-400 via-amber-300 to-[#F4EEDC] h-full transition-all duration-300 rounded-full"
                style={{ width: `${burnProgress}%` }}
              />
            </div>
            <p className="text-xs text-[#F4EEDC] animate-pulse font-medium">
              Ngọn lửa đang hóa giải mọi gánh nặng thành những đốm sáng bụi sao...
            </p>
          </div>
        )}

        {stage === 'revealed' && (
          <div className="py-5 space-y-4 animate-fadeIn">
            {/* Step 7: Spirit appears with warm comforting embrace */}
            <div className="relative flex justify-center items-center">
              <div className="w-40 h-40 rounded-full bg-[#F4EEDC]/10 flex items-center justify-center p-2 glow-lavender">
                <SpiritAvatar
                  id={currentSpiritId}
                  colorId={userSpirit?.colorId}
                  accessory={userSpirit?.accessory}
                  size="xl"
                  mood="comforting"
                  glow={true}
                />
              </div>
            </div>

            {/* Exactly required: Bạn vừa đặt xuống một phần gánh nặng. */}
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold text-[#F5F2FA] font-display">
                Bạn vừa đặt xuống một phần gánh nặng.
              </h3>
              <p className="text-xs text-[#B9B5C8] max-w-sm mx-auto leading-relaxed">
                {spiritName} đã ở đây và chứng kiến bạn buông tay. Mọi bực bội và mỏi mệt đã tan biến vào hư không. Trái tim bạn giờ đây đã nhẹ nhõm và tự do.
              </p>
            </div>

            {/* Required Options: Giữ riêng tư OR Xóa */}
            <div className="pt-3 grid grid-cols-2 gap-3 max-w-sm mx-auto">
              <button
                onClick={handleKeepPrivate}
                className="py-3 px-4 rounded-2xl bg-[#171A35] hover:bg-[#242347] border border-[#B9A9E8]/30 text-xs font-semibold text-[#F5F2FA] transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md"
              >
                <Lock className="w-3.5 h-3.5 text-[#B9A9E8]" />
                <span>Lưu riêng tư</span>
              </button>

              <button
                onClick={handleDeletePermanent}
                className="py-3 px-4 rounded-2xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/30 text-xs font-semibold text-rose-200 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-300" />
                <span>Xóa hoàn toàn</span>
              </button>
            </div>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs text-[#858198] hover:text-[#B9B5C8] mt-2 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Đốt tiếp áp lực khác</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
