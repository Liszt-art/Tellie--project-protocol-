import React, { useState } from 'react';
import { X, Sparkles, Feather, Send, Layers } from 'lucide-react';
import { SpiritAvatar } from './SpiritAvatar';
import { useApp } from '../context/AppContext';
import { AFFIRMATION_CARDS } from '../data/initialData';
import { sound } from '../utils/audio';

interface EnergyStationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnergyStationModal: React.FC<EnergyStationModalProps> = ({ isOpen, onClose }) => {
  const { userSpirit } = useApp();
  const [activeActivity, setActiveActivity] = useState<'cards' | 'pond' | 'letter'>('cards');
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [futureLetter, setFutureLetter] = useState('');
  const [letterSaved, setLetterSaved] = useState(false);

  if (!isOpen) return null;

  const currentSpiritId = userSpirit ? userSpirit.spiritId : 'flower';
  const spiritName = userSpirit ? userSpirit.customName : 'Tellie Spirit';

  const currentCard = AFFIRMATION_CARDS[cardIndex];

  const handleNextCard = () => {
    setIsFlipped(false);
    setCardIndex((cardIndex + 1) % AFFIRMATION_CARDS.length);
    sound.playChime(580);
  };

  const handlePondClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { id: Date.now(), x, y };

    setRipples(prev => [...prev.slice(-6), newRipple]);
    sound.playChime(600 + Math.random() * 200);

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 1500);
  };

  const handleSaveFutureLetter = () => {
    if (!futureLetter.trim()) return;
    setLetterSaved(true);
    sound.playChime(720);
    setTimeout(() => {
      setFutureLetter('');
      setLetterSaved(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-[#0D1020]/95 backdrop-blur-2xl overflow-y-auto">
      {/* Blue / Mint / Lavender Glow Backdrop */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-[#91B8E8]/15 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[#A8D2C4]/15 rounded-full blur-[90px] pointer-events-none" />

      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-5 md:p-7 border border-[#A8D2C4]/20 shadow-2xl my-auto text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#858198] hover:text-[#F5F2FA] w-8 h-8 rounded-full flex items-center justify-center bg-white/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#171A35] border border-[#A8D2C4]/30 text-[#A8D2C4] text-xs font-semibold mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TRẠM NĂNG LƯỢNG MẶT TRĂNG</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-[#F5F2FA] font-display">
            Trạm Năng Lượng
          </h2>
          <p className="text-xs text-[#B9B5C8] mt-1">
            Nạp lại dịu êm cùng cây cỏ, ánh trăng và những lời vỗ về.
          </p>
        </div>

        {/* Hero Moonlit Scene with Plants & Spirit */}
        <div className="relative h-32 w-full rounded-2xl bg-gradient-to-r from-[#171A35]/80 via-[#242347]/80 to-[#171A35]/80 border border-[#A8D2C4]/20 flex items-center justify-between px-6 overflow-hidden">
          {/* Gentle Floating Particles */}
          <div className="absolute top-3 left-8 text-xs text-[#91B8E8]/60 animate-ping">✧</div>
          <div className="absolute top-8 right-16 text-xs text-[#A8D2C4]/60 animate-pulse">✦</div>
          <div className="absolute bottom-4 left-1/3 text-xs text-[#B9A9E8]/60">⋆</div>

          <div className="text-left z-10">
            <span className="text-[11px] text-[#A8D2C4] font-medium block">Không gian sạc năng lượng</span>
            <span className="text-sm font-bold text-[#F5F2FA] font-display">
              {spiritName} đang tiếp năng lượng cho bạn
            </span>
          </div>

          <div className="w-24 h-24 relative z-10">
            <SpiritAvatar
              id={currentSpiritId}
              colorId={userSpirit?.colorId}
              accessory={userSpirit?.accessory}
              size="md"
              mood="happy"
              animate={true}
              glow={true}
            />
          </div>
        </div>

        {/* 3 Calming Activity Switches */}
        <div className="grid grid-cols-3 gap-2 my-4">
          <button
            onClick={() => setActiveActivity('cards')}
            className={`py-2 px-1 rounded-xl text-xs font-semibold transition-all border ${
              activeActivity === 'cards'
                ? 'bg-[#242347] border-[#B9A9E8] text-[#F5F2FA]'
                : 'bg-[#11152A] border-white/5 text-[#858198] hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 mx-auto mb-1 text-[#B9A9E8]" />
            <span>Lá bài vỗ về</span>
          </button>

          <button
            onClick={() => setActiveActivity('pond')}
            className={`py-2 px-1 rounded-xl text-xs font-semibold transition-all border ${
              activeActivity === 'pond'
                ? 'bg-[#242347] border-[#A8D2C4] text-[#F5F2FA]'
                : 'bg-[#11152A] border-white/5 text-[#858198] hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 mx-auto mb-1 text-[#A8D2C4]" />
            <span>Chạm thả lỏng</span>
          </button>

          <button
            onClick={() => setActiveActivity('letter')}
            className={`py-2 px-1 rounded-xl text-xs font-semibold transition-all border ${
              activeActivity === 'letter'
                ? 'bg-[#242347] border-[#91B8E8] text-[#F5F2FA]'
                : 'bg-[#11152A] border-white/5 text-[#858198] hover:text-white'
            }`}
          >
            <Feather className="w-3.5 h-3.5 mx-auto mb-1 text-[#91B8E8]" />
            <span>Gửi tương lai</span>
          </button>
        </div>

        {/* Activity Container */}
        <div className="min-h-[190px] flex items-center justify-center">
          {activeActivity === 'cards' && (
            <div className="w-full space-y-3">
              {/* Card visual */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="relative mx-auto max-w-sm p-5 rounded-2xl bg-[#171A35] border border-white/10 hover:border-[#B9A9E8]/40 shadow-xl cursor-pointer text-left transition-all hover:scale-[1.01]"
                style={{
                  boxShadow: `0 8px 30px -4px ${currentCard.color}25`
                }}
              >
                <div className="flex justify-between items-center text-[10px] text-[#858198] mb-2">
                  <span className="uppercase tracking-wider font-semibold" style={{ color: currentCard.color }}>
                    {currentCard.spiritHint}
                  </span>
                  <span>Chạm để lật bài</span>
                </div>
                <h4 className="text-base font-bold text-[#F5F2FA] font-display">
                  {currentCard.title}
                </h4>
                <p className="text-xs text-[#B9B5C8] mt-2 leading-relaxed">
                  {currentCard.body}
                </p>
              </div>

              <div className="flex justify-center gap-2 pt-1">
                <button
                  onClick={handleNextCard}
                  className="px-4 py-2 rounded-xl bg-[#B9A9E8] text-[#0D1020] text-xs font-bold shadow-md hover:opacity-90 active:scale-95 transition-all"
                >
                  Rút lá bài khác
                </button>
              </div>
            </div>
          )}

          {activeActivity === 'pond' && (
            <div className="w-full space-y-2">
              <div
                onClick={handlePondClick}
                className="relative w-full h-44 rounded-2xl bg-[#11152A] border border-[#A8D2C4]/30 overflow-hidden cursor-pointer flex items-center justify-center select-none shadow-inner"
              >
                {/* Concentric ripples */}
                {ripples.map(r => (
                  <div
                    key={r.id}
                    className="absolute rounded-full border border-[#A8D2C4]/70 animate-ping pointer-events-none"
                    style={{
                      left: r.x - 25,
                      top: r.y - 25,
                      width: 50,
                      height: 50
                    }}
                  />
                ))}
                <div className="text-center pointer-events-none">
                  <div className="text-2xl mb-1">💧</div>
                  <p className="text-xs font-medium text-[#F5F2FA]">Chạm nhẹ vào mặt nước đêm</p>
                  <p className="text-[10px] text-[#858198]">Mỗi gợn sóng lan tỏa cuốn trôi bớt một phần căng thẳng</p>
                </div>
              </div>
            </div>
          )}

          {activeActivity === 'letter' && (
            <div className="w-full space-y-2 text-left">
              <textarea
                value={futureLetter}
                onChange={e => setFutureLetter(e.target.value)}
                rows={3}
                placeholder="Gửi một lời khích lệ nhỏ đến chính bạn của tuần sau..."
                className="w-full p-3 rounded-xl bg-[#11152A] border border-white/10 text-xs text-[#F5F2FA] placeholder-[#858198] focus:outline-none focus:border-[#91B8E8]"
              />
              <div className="flex justify-between items-center text-xs">
                <span className="text-[11px] text-[#A8D2C4]">
                  {letterSaved ? '✓ Đã niêm phong vào hộp thời gian!' : ''}
                </span>
                <button
                  onClick={handleSaveFutureLetter}
                  disabled={!futureLetter.trim()}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    futureLetter.trim()
                      ? 'bg-[#91B8E8] text-[#0D1020] hover:opacity-95'
                      : 'bg-white/10 text-white/30'
                  }`}
                >
                  <Send className="w-3 h-3" />
                  <span>Niêm phong thư</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
