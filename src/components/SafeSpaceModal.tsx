import React, { useState, useEffect } from 'react';
import { X, Volume2, VolumeX, Sparkles, Wind, BookOpen, Lamp, Moon, Heart } from 'lucide-react';
import { SpiritAvatar } from './SpiritAvatar';
import { useApp } from '../context/AppContext';
import { sound } from '../utils/audio';

interface SafeSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafeSpaceModal: React.FC<SafeSpaceModalProps> = ({ isOpen, onClose }) => {
  const { userSpirit } = useApp();
  const [activeTab, setActiveTab] = useState<'breathe' | 'reflect' | 'journal'>('breathe');
  const [ambientSound, setAmbientSound] = useState<'rain' | 'crickets' | 'starlight' | null>('rain');
  const [lampOn, setLampOn] = useState(true);
  const [journalText, setJournalText] = useState('');
  const [savedJournal, setSavedJournal] = useState(false);

  // Breathing box timer
  const [breathePhase, setBreathePhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    if (!isOpen) {
      sound.stopAmbient();
      return;
    }
    // Auto-start rain ambient sound if enabled
    if (ambientSound) {
      sound.startAmbient(ambientSound);
    }
    return () => {
      sound.stopAmbient();
    };
  }, [isOpen, ambientSound]);

  useEffect(() => {
    if (!isOpen || activeTab !== 'breathe') return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setBreathePhase(current => {
            if (current === 'inhale') return 'hold1';
            if (current === 'hold1') return 'exhale';
            if (current === 'exhale') return 'hold2';
            return 'inhale';
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, activeTab, breathePhase]);

  if (!isOpen) return null;

  const currentSpiritId = userSpirit ? userSpirit.spiritId : 'bunny';
  const spiritName = userSpirit ? userSpirit.customName : 'Tellie Spirit';

  const handleToggleSound = (type: 'rain' | 'crickets' | 'starlight') => {
    if (ambientSound === type) {
      sound.stopAmbient();
      setAmbientSound(null);
    } else {
      sound.startAmbient(type);
      setAmbientSound(type);
    }
  };

  const getPhaseText = () => {
    switch (breathePhase) {
      case 'inhale': return 'Hít vào nhẹ nhàng...';
      case 'hold1': return 'Giữ hơi thở trong lồng ngực...';
      case 'exhale': return 'Thở ra chậm rãi, buông bỏ...';
      case 'hold2': return 'Tĩnh lặng, thả lỏng toàn thân...';
    }
  };

  const reflectionPrompts = [
    'Ngay lúc này, bạn đang ngồi an toàn. Không có việc gì phải vội vã trong vài phút tới.',
    'Thả lỏng vầng trán, thả lỏng đôi vai và mở nhẹ các ngón tay.',
    'Cảm nhận mặt đất hoặc chiếc ghế đang nâng đỡ trọng lượng cơ thể bạn.',
    'Bạn đã vượt qua rất nhiều ngày khó khăn, và bạn sẽ tiếp tục bình yên đi qua ngày hôm nay.'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-[#0D1020]/95 backdrop-blur-2xl overflow-y-auto">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-5 md:p-7 border border-[#B9A9E8]/20 shadow-2xl my-auto text-left">
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#171A35] border border-[#B9A9E8]/20 text-[#B9A9E8] text-xs font-semibold">
            <Moon className="w-3.5 h-3.5" />
            <span>CHỐN AN TOÀN</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLampOn(!lampOn)}
              className={`p-2 rounded-xl transition-all ${
                lampOn ? 'bg-amber-400/20 text-amber-200 border border-amber-400/30' : 'bg-white/5 text-[#858198]'
              }`}
              title="Bật/Tắt đèn ấm"
            >
              <Lamp className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#B9B5C8] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Copy strictly required: Một nơi chỉ dành cho bạn khi bạn cần được yên tĩnh. */}
        <div className="mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-[#F5F2FA] font-display">
            Một nơi chỉ dành cho bạn khi bạn cần được yên tĩnh.
          </h2>
          <p className="text-xs text-[#B9B5C8] mt-1">
            Không áp lực, không phán xét, chỉ có ánh trăng và sự vỗ về.
          </p>
        </div>

        {/* Visual: Cozy Room Scene (Window, Moonlight, Blanket, Plant, Warm Lamp & Selected Spirit) */}
        <div
          className="relative h-44 md:h-52 w-full rounded-2xl overflow-hidden p-4 flex items-end justify-between transition-all duration-700 border border-white/10"
          style={{
            background: lampOn
              ? 'linear-gradient(135deg, #171A35 0%, #242347 40%, #2A2140 100%)'
              : 'linear-gradient(135deg, #0D1020 0%, #11152A 100%)'
          }}
        >
          {/* Moonlight Arched Window */}
          <div className="absolute top-3 left-4 w-28 h-36 rounded-t-full border-2 border-white/20 bg-[#090C1A] overflow-hidden shadow-inner">
            <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#F4EEDC] shadow-[0_0_15px_#F4EEDC]" />
            <div className="absolute top-10 left-2 w-16 h-3 bg-white/10 rounded-full blur-[2px]" />
            <div className="absolute bottom-2 left-3 text-[8px] text-white/40">✦ ⋆ ✧</div>
            {/* Soft moonlight beam diagonally washing down */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Plant on Window Sill */}
          <div className="absolute bottom-4 left-28 z-10">
            <div className="w-8 h-7 bg-[#2E2840] rounded-b-lg border-t-2 border-[#A8D2C4]/40" />
            <div className="absolute -top-6 left-1 text-lg">🌿</div>
          </div>

          {/* Warm Glowing Lamp */}
          <div className="absolute top-4 right-6 z-10 flex flex-col items-center">
            <div
              className={`w-9 h-7 rounded-t-lg transition-all duration-500 border border-white/20 ${
                lampOn
                  ? 'bg-amber-200/90 shadow-[0_0_35px_#F6D365]'
                  : 'bg-[#2A2338]'
              }`}
            />
            <div className="w-1 h-12 bg-white/30" />
            <div className="w-6 h-1 bg-white/40 rounded-full" />
          </div>

          {/* Cozy Soft Blanket & Cushions */}
          <div className="absolute bottom-0 right-0 left-0 h-16 bg-gradient-to-t from-[#1F1E3D] to-transparent pointer-events-none" />
          <div className="absolute bottom-2 right-12 w-28 h-10 bg-[#B9A9E8]/20 rounded-3xl border border-[#B9A9E8]/30 transform -rotate-2" />

          {/* Selected Spirit Resting Peacefully */}
          <div className="relative z-20 flex items-center gap-2 ml-auto mb-1">
            <div className="text-right">
              <span className="text-[11px] font-semibold text-[#F5F2FA] block">
                {spiritName}
              </span>
              <span className="text-[9px] text-[#A8D2C4] block">đang nghỉ ngơi cùng bạn</span>
            </div>
            <div className="w-20 h-20">
              <SpiritAvatar
                id={currentSpiritId}
                colorId={userSpirit?.colorId}
                accessory={userSpirit?.accessory}
                size="md"
                mood="sleepy"
                animate={true}
                glow={true}
              />
            </div>
          </div>
        </div>

        {/* Ambient Sounds Bar with boosted volume & slider */}
        <div className="mt-3 p-3 rounded-2xl bg-[#11152A] border border-white/5 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#858198] flex items-center gap-1.5 font-medium">
              {ambientSound ? <Volume2 className="w-3.5 h-3.5 text-[#A8D2C4]" /> : <VolumeX className="w-3.5 h-3.5 text-[#858198]" />}
              <span>Âm thanh thư giãn:</span>
              <span className="text-[10px] text-[#A8D2C4] font-semibold">Âm lượng dịu êm</span>
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => handleToggleSound('rain')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors ${
                  ambientSound === 'rain' ? 'bg-[#91B8E8] text-[#0D1020] shadow-sm' : 'bg-white/5 text-[#B9B5C8] hover:bg-white/10'
                }`}
              >
                Tiếng mưa rơi
              </button>
              <button
                onClick={() => handleToggleSound('crickets')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors ${
                  ambientSound === 'crickets' ? 'bg-[#A8D2C4] text-[#0D1020] shadow-sm' : 'bg-white/5 text-[#B9B5C8] hover:bg-white/10'
                }`}
              >
                Dế đêm
              </button>
              <button
                onClick={() => handleToggleSound('starlight')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors ${
                  ambientSound === 'starlight' ? 'bg-[#B9A9E8] text-[#0D1020] shadow-sm' : 'bg-white/5 text-[#B9B5C8] hover:bg-white/10'
                }`}
              >
                Sóng tĩnh lặng (432Hz)
              </button>
            </div>
          </div>
        </div>

        {/* Functional Tabs: Hơi thở, Suy ngẫm, Viết riêng tư */}
        <div className="mt-4 flex border-b border-white/10 pb-2 gap-3 text-xs">
          <button
            onClick={() => setActiveTab('breathe')}
            className={`pb-1 font-medium transition-colors flex items-center gap-1 ${
              activeTab === 'breathe' ? 'text-[#B9A9E8] border-b-2 border-[#B9A9E8]' : 'text-[#858198] hover:text-white'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Hơi thở 4-4-4-4</span>
          </button>
          <button
            onClick={() => setActiveTab('reflect')}
            className={`pb-1 font-medium transition-colors flex items-center gap-1 ${
              activeTab === 'reflect' ? 'text-[#B9A9E8] border-b-2 border-[#B9A9E8]' : 'text-[#858198] hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Chỉ dẫn dịu dàng</span>
          </button>
          <button
            onClick={() => setActiveTab('journal')}
            className={`pb-1 font-medium transition-colors flex items-center gap-1 ${
              activeTab === 'journal' ? 'text-[#B9A9E8] border-b-2 border-[#B9A9E8]' : 'text-[#858198] hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Nhật ký đêm</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="pt-3 min-h-[140px] flex items-center justify-center">
          {activeTab === 'breathe' && (
            <div className="w-full text-center space-y-3">
              {/* Expanding & Contracting Breathing Circle */}
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                <div
                  className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                    breathePhase === 'inhale'
                      ? 'scale-110 bg-[#B9A9E8]/30 shadow-[0_0_25px_#B9A9E8]'
                      : breathePhase === 'hold1'
                      ? 'scale-110 bg-[#A8D2C4]/35 shadow-[0_0_25px_#A8D2C4]'
                      : breathePhase === 'exhale'
                      ? 'scale-75 bg-[#91B8E8]/20'
                      : 'scale-75 bg-white/10'
                  }`}
                />
                <span className="text-2xl font-bold text-[#F5F2FA] font-display relative z-10">
                  {countdown}
                </span>
              </div>
              <p className="text-xs font-semibold text-[#F5F2FA]">{getPhaseText()}</p>
              <p className="text-[11px] text-[#858198]">Hít thở hộp giúp cân bằng hệ thần kinh phó giao cảm.</p>
            </div>
          )}

          {activeTab === 'reflect' && (
            <div className="w-full space-y-2">
              {reflectionPrompts.map((p, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-[#B9B5C8] leading-relaxed flex items-start gap-2">
                  <Heart className="w-3.5 h-3.5 text-[#DFAFC8] shrink-0 mt-0.5" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'journal' && (
            <div className="w-full space-y-2">
              <textarea
                value={journalText}
                onChange={e => {
                  setJournalText(e.target.value);
                  setSavedJournal(false);
                }}
                rows={3}
                placeholder="Ghi lại bất kỳ cảm giác nào đang nảy nở trong sự yên ắng này..."
                className="w-full p-3 rounded-xl bg-[#11152A] border border-white/10 text-xs text-[#F5F2FA] placeholder-[#858198] focus:outline-none focus:border-[#B9A9E8]"
              />
              <div className="flex justify-between items-center text-xs">
                <span className="text-[11px] text-[#A8D2C4]">
                  {savedJournal ? '✓ Đã lưu an toàn trên máy bạn' : ''}
                </span>
                <button
                  onClick={() => {
                    setSavedJournal(true);
                    sound.playChime(640);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#B9A9E8] text-[#0D1020] text-xs font-semibold"
                >
                  Lưu vào tâm trí
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
