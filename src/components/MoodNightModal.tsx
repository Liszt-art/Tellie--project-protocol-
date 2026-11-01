import React, { useState } from 'react';
import { X, Moon, Sparkles, Cloud, Check } from 'lucide-react';
import { SpiritAvatar } from './SpiritAvatar';
import { useApp } from '../context/AppContext';
import { MOODS_LIST } from '../data/moods';
import { MoodId } from '../types';
import { sound } from '../utils/audio';

interface MoodNightModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MoodNightModal: React.FC<MoodNightModalProps> = ({ isOpen, onClose }) => {
  const { userSpirit, recordMood } = useApp();
  const [selectedMood, setSelectedMood] = useState<MoodId>('calm');
  const [nightThought, setNightThought] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const currentSpiritId = userSpirit ? userSpirit.spiritId : 'moon';
  const spiritName = userSpirit ? userSpirit.customName : 'Tellie Spirit';

  const handleCheckIn = () => {
    recordMood(selectedMood, nightThought ? `[Đêm] ${nightThought}` : undefined, true);
    sound.playChime(528);
    setIsCompleted(true);

    setTimeout(() => {
      setTimeout(() => {
        setIsCompleted(false);
        setNightThought('');
        onClose();
      }, 1800);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D1020]/95 backdrop-blur-2xl overflow-y-auto">
      {/* Night Sky Stars and Clouds Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-12 w-1.5 h-1.5 rounded-full bg-white opacity-80 animate-ping" />
        <div className="absolute top-24 right-20 w-2 h-2 rounded-full bg-[#F4EEDC] opacity-70" />
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 rounded-full bg-[#B9A9E8] opacity-60" />
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#171A35]/50 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-6 md:p-8 border border-[#B9A9E8]/20 shadow-2xl my-auto text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#858198] hover:text-[#F5F2FA] w-8 h-8 rounded-full flex items-center justify-center bg-white/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {!isCompleted ? (
          <div className="space-y-4">
            {/* Moon, Stars, Clouds & Selected Spirit Stage */}
            <div className="relative py-2 flex flex-col items-center justify-center">
              <div className="relative w-36 h-36 flex items-center justify-center">
                {/* Moon Crest Backdrop */}
                <div className="absolute top-1 right-2 text-2xl text-[#F4EEDC]/80 animate-pulse">
                  🌙
                </div>
                {/* Fluffy clouds */}
                <div className="absolute -bottom-2 -left-4 text-xl text-[#91B8E8]/40">
                  ☁️
                </div>
                <div className="absolute -bottom-1 -right-2 text-lg text-[#91B8E8]/40">
                  ☁️
                </div>
                <SpiritAvatar
                  id={currentSpiritId}
                  colorId={userSpirit?.colorId}
                  accessory={userSpirit?.accessory}
                  size="lg"
                  mood="sleepy"
                  glow={true}
                />
              </div>
            </div>

            {/* Title strictly required: Trước khi ngủ, hôm nay lòng bạn đang ở đâu? */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#171A35] border border-[#B9A9E8]/20 text-[#B9A9E8] text-[11px] font-semibold">
                <Moon className="w-3 h-3" />
                <span>RITUAL ĐÊM MUỘN</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[#F5F2FA] font-display">
                Trước khi ngủ, hôm nay lòng bạn đang ở đâu?
              </h2>
              <p className="text-xs text-[#B9B5C8] max-w-xs mx-auto">
                Một khoảnh khắc lắng lại để nhận diện tâm trạng và chúc bản thân một đêm an lành.
              </p>
            </div>

            {/* Constellation Mood Grid */}
            <div className="grid grid-cols-4 gap-2 pt-2">
              {MOODS_LIST.map(mood => {
                const isSelected = mood.id === selectedMood;
                return (
                  <button
                    key={mood.id}
                    onClick={() => {
                      setSelectedMood(mood.id);
                      sound.playChime(480);
                    }}
                    type="button"
                    className={`p-2 rounded-2xl flex flex-col items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-[#242347] border-[#B9A9E8] scale-105 shadow-md shadow-[#B9A9E8]/20'
                        : 'bg-[#11152A]/80 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <span className="text-xl mb-1">{mood.icon}</span>
                    <span className="text-xs font-semibold text-[#F5F2FA]">
                      {mood.labelVi}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Optional Night Note */}
            <div className="pt-2 text-left">
              <input
                type="text"
                value={nightThought}
                onChange={e => setNightThought(e.target.value)}
                placeholder="Một điều bạn muốn gác lại đêm nay (tùy chọn)..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#11152A] border border-white/10 text-xs text-[#F5F2FA] placeholder-[#858198] focus:outline-none focus:border-[#B9A9E8]"
              />
            </div>

            {/* CTA strictly required: Check-in đêm nay */}
            <button
              onClick={handleCheckIn}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#B9A9E8] via-[#91B8E8] to-[#DFAFC8] text-[#0D1020] font-bold text-sm tracking-wide shadow-xl shadow-[#B9A9E8]/20 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>Check-in đêm nay</span>
            </button>
          </div>
        ) : (
          /* Completion blessing state */
          <div className="py-8 space-y-4 animate-breathe">
            <div className="w-16 h-16 rounded-full bg-[#B9A9E8]/20 border border-[#B9A9E8]/40 mx-auto flex items-center justify-center text-[#B9A9E8]">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h3 className="text-xl font-bold text-[#F5F2FA] font-display">
              Đêm nay, chúc bạn ngủ thật ngoan
            </h3>
            <p className="text-xs text-[#B9B5C8] max-w-xs mx-auto leading-relaxed">
              {spiritName} đã cất giữ cảm xúc của bạn vào một vì sao nhỏ. Hãy buông lỏng cơ thể và để giấc mơ đưa bạn về chốn bình yên.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
