import React, { useState, useEffect } from 'react';
import { FairyColorId, FairyAccessory } from '../types';
import { SpiritAvatar } from './SpiritAvatar';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, Check, Heart, User, Sparkle } from 'lucide-react';
import { sound } from '../utils/audio';

interface SpiritSelectionProps {
  isOpen: boolean;
  isInitialSetup?: boolean;
  onClose?: () => void;
}

// 8 BẢNG MÀU PASTEL / DREAMY THEO YÊU CẦU
export const FAIRY_COLORS: { id: FairyColorId; label: string; hex: string }[] = [
  { id: 'pink_powder', label: 'Hồng phấn', hex: '#F4B8D4' },
  { id: 'lavender', label: 'Tím lavender', hex: '#C9B6F2' },
  { id: 'baby_blue', label: 'Xanh baby', hex: '#AFCDF5' },
  { id: 'mint', label: 'Xanh mint', hex: '#B8E3D5' },
  { id: 'night_blue', label: 'Xanh đêm', hex: '#7183B8' },
  { id: 'pastel_peach', label: 'Đào pastel', hex: '#F6C5B0' },
  { id: 'cream_yellow', label: 'Vàng kem', hex: '#F3DFA5' },
  { id: 'pearl_white', label: 'Trắng ngọc trai', hex: '#E9EDF5' }
];

// 16 BỘ PHỤ KIỆN FAIRYCORE THEO YÊU CẦU
export const FAIRY_ACCESSORIES: { id: FairyAccessory; label: string; icon: string }[] = [
  { id: 'ribbon_bow', label: 'Nơ ruy-băng', icon: '🎀' },
  { id: 'butterfly_clip', label: 'Kẹp tóc bướm', icon: '🦋' },
  { id: 'small_wreath', label: 'Vòng hoa nhỏ', icon: '🌸' },
  { id: 'vine_clip', label: 'Kẹp lá dây leo', icon: '🌿' },
  { id: 'moon_clip', label: 'Kẹp mặt trăng', icon: '🌙' },
  { id: 'star_clip', label: 'Kẹp ngôi sao', icon: '⭐' },
  { id: 'flower_crown', label: 'Vương miện hoa', icon: '👑' },
  { id: 'crystal_tiara', label: 'Tiara pha lê', icon: '💎' },
  { id: 'light_halo', label: 'Halo ánh sáng', icon: '✨' },
  { id: 'lavender_flower', label: 'Hoa lavender cài tóc', icon: '🌿' },
  { id: 'butterfly_perch', label: 'Bướm đậu trên tóc', icon: '🦋' },
  { id: 'mushroom_clip', label: 'Kẹp nấm nhỏ', icon: '🍄' },
  { id: 'leaf_wreath', label: 'Vòng lá', icon: '🌿' },
  { id: 'seashell_clip', label: 'Kẹp vỏ sò', icon: '🐚' },
  { id: 'pearls', label: 'Ngọc trai quanh tóc', icon: '🤍' },
  { id: 'glasses', label: 'Kính tròn', icon: '👓' }
];

export const SpiritSelectionModal: React.FC<SpiritSelectionProps> = ({
  isOpen,
  isInitialSetup = false,
  onClose
}) => {
  const { userSpirit, userNickname, completeOnboarding, customizeFairy } = useApp();

  // Onboarding steps: 1 = Welcome, 2 = Enter Name, 3 = Customize Tellie Spirit
  const [step, setStep] = useState<number>(isInitialSetup ? 1 : 3);
  const [userNameInput, setUserNameInput] = useState<string>(userNickname || '');
  const [nameError, setNameError] = useState<string>('');

  // Selected appearance for Tellie Spirit
  const [selectedColor, setSelectedColor] = useState<FairyColorId>(
    userSpirit?.colorId || 'pearl_white'
  );
  const [selectedAccessory, setSelectedAccessory] = useState<FairyAccessory>(
    userSpirit?.accessory || 'ribbon_bow'
  );

  // Sync state whenever modal opens or userSpirit changes
  useEffect(() => {
    if (isOpen) {
      if (isInitialSetup) {
        setStep(1);
      } else {
        setStep(3);
      }
      if (userNickname) {
        setUserNameInput(userNickname);
      }
      if (userSpirit?.colorId) {
        setSelectedColor(userSpirit.colorId);
      }
      if (userSpirit?.accessory) {
        setSelectedAccessory(userSpirit.accessory);
      }
    }
  }, [isOpen, isInitialSetup, userNickname, userSpirit]);

  if (!isOpen) return null;

  const handleStartWelcome = () => {
    sound.playChime(580);
    setStep(2);
  };

  const handleContinueName = () => {
    const trimmed = userNameInput.trim();
    if (!trimmed) {
      setNameError('Vui lòng cho Tellie biết tên của bạn nhé ✨');
      return;
    }
    setNameError('');
    sound.playChime(640);
    setStep(3);
  };

  const handleSelectColor = (c: FairyColorId) => {
    setSelectedColor(c);
    sound.playChime(620);
  };

  const handleSelectAccessory = (a: FairyAccessory) => {
    setSelectedAccessory(a);
    sound.playChime(660);
  };

  const handleFinishOnboarding = () => {
    sound.playChime(784);
    if (isInitialSetup) {
      completeOnboarding(userNameInput.trim() || 'Bạn Mới', selectedColor, selectedAccessory);
    } else {
      customizeFairy({
        colorId: selectedColor,
        accessory: selectedAccessory
      });
      if (onClose) {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#070914]/95 backdrop-blur-3xl overflow-y-auto selection:bg-[#B9A9E8]/30">
      {/* Background celestial ambient light & nebulas */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] bg-gradient-to-b from-[#B9A9E8]/18 via-[#91B8E8]/12 to-transparent rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[420px] h-[420px] bg-gradient-to-t from-[#A8D2C4]/15 via-[#B9A9E8]/10 to-transparent rounded-full blur-[110px] pointer-events-none" />

      {/* Floating Stardust Motifs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-16 left-12 text-[#FFFCE8]/70 text-xs animate-star-twinkle">✦</div>
        <div className="absolute top-32 right-16 text-[#B9A9E8]/65 text-sm animate-star-twinkle" style={{ animationDelay: '1.2s' }}>✧</div>
        <div className="absolute bottom-28 left-1/4 text-[#A8D2C4]/60 text-xs animate-star-twinkle" style={{ animationDelay: '2s' }}>⋆</div>
        <div className="absolute top-1/2 right-10 text-[#F4EEDC]/65 text-xs animate-star-twinkle" style={{ animationDelay: '0.8s' }}>✧</div>
      </div>

      <div className="relative w-full max-w-lg rounded-[32px] p-6 sm:p-8 border border-[#B9A9E8]/25 bg-gradient-to-b from-[#171A35]/95 via-[#1E1C40]/90 to-[#0D1020]/95 shadow-[0_24px_60px_rgba(7,9,20,0.7)] text-center my-auto max-h-[92vh] overflow-y-auto backdrop-blur-2xl">
        {/* Close button ONLY if user is tweaking appearance from Profile (not during initial onboarding) */}
        {!isInitialSetup && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#858198] hover:text-[#F5F2FA] p-2 rounded-full transition-colors z-20"
            title="Đóng"
          >
            ✕
          </button>
        )}

        {/* =========================================================================
            MÀN 1: MÀN WELCOME
            “Chào bạn ✨”
            “Mình là Tellie. Rất vui được gặp bạn!”
            Nút: “Bắt đầu ✨”
        ========================================================================= */}
        {step === 1 && (
          <div className="space-y-6 py-4 animate-fadeIn">
            {/* Glowing Tellie Spirit Mascot Presence */}
            <div className="relative py-2 flex flex-col items-center justify-center">
              <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-full flex items-center justify-center bg-gradient-to-b from-[#B9A9E8]/20 via-[#91B8E8]/10 to-transparent p-4 filter drop-shadow-[0_12px_30px_rgba(185,169,232,0.35)]">
                <SpiritAvatar
                  id="fairy"
                  colorId="pearl_white"
                  accessory="ribbon_bow"
                  size="hero"
                  mood="happy"
                  animate={true}
                  glow={true}
                  showShadow={true}
                />
              </div>
            </div>

            {/* Exactly Required Welcome Text */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F5F2FA] font-display">
                Chào bạn ✨
              </h1>
              <p className="text-base sm:text-lg text-[#B9B5C8] font-medium leading-relaxed max-w-sm mx-auto">
                Mình là Tellie. Rất vui được gặp bạn!
              </p>
            </div>

            {/* Exactly Required Button: “Bắt đầu ✨” */}
            <div className="pt-4">
              <button
                onClick={handleStartWelcome}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#B9A9E8] via-[#91B8E8] to-[#A8D2C4] text-[#0D1020] font-extrabold text-base tracking-wide shadow-xl shadow-[#B9A9E8]/30 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>Bắt đầu ✨</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            MÀN 2: MÀN NHẬP TÊN NGƯỜI DÙNG
            “Bạn tên gì?”
            Ô để người dùng nhập tên.
            Nút: “Tiếp tục”
            CHỈ hỏi tên người dùng. KHÔNG hỏi email, tài khoản hoặc thông tin cá nhân.
        ========================================================================= */}
        {step === 2 && (
          <div className="space-y-6 py-6 animate-fadeIn text-left">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#242347] border border-[#B9A9E8]/30 mx-auto flex items-center justify-center text-[#B9A9E8] shadow-lg shadow-[#B9A9E8]/20">
                <User className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F5F2FA] font-display">
                Bạn tên gì?
              </h2>
              <p className="text-xs sm:text-sm text-[#B9B5C8]">
                Tellie sẽ dùng tên này để trò chuyện và lắng nghe bạn.
              </p>
            </div>

            {/* Input field for user name */}
            <div className="space-y-2 pt-2">
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  value={userNameInput}
                  onChange={e => {
                    setUserNameInput(e.target.value);
                    if (nameError) setNameError('');
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleContinueName();
                    }
                  }}
                  placeholder="Nhập tên của bạn..."
                  maxLength={30}
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#0D1020]/90 border border-[#B9A9E8]/40 text-[#F5F2FA] placeholder-[#858198] focus:outline-none focus:border-[#B9A9E8] focus:ring-2 focus:ring-[#B9A9E8]/30 transition-all text-sm font-semibold shadow-inner"
                />
              </div>
              {nameError && (
                <p className="text-xs text-[#F4B8D4] font-medium animate-fadeIn">
                  {nameError}
                </p>
              )}
            </div>

            {/* Exactly Required Button: “Tiếp tục” */}
            <div className="pt-4">
              <button
                onClick={handleContinueName}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#B9A9E8] via-[#91B8E8] to-[#A8D2C4] text-[#0D1020] font-extrabold text-base tracking-wide shadow-xl shadow-[#B9A9E8]/30 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>Tiếp tục</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            MÀN 3: MÀN TẠO DIỆN MẠO CHO TELLIE SPIRIT
            - Tellie Spirit là Fairy mặc định của app.
            - KHÔNG cho người dùng đặt tên Fairy. Tên Fairy luôn là: “Tellie Spirit”.
            - Tiêu đề: “Hãy chọn diện mạo cho Tellie Spirit ✨”
            - Preview lớn ở giữa thay đổi ngay lập tức theo màu + phụ kiện.
            - 8 màu pastel/dreamy có tên tiếng Việt rõ ràng.
            - 16 phụ kiện Fairycore trong grid nhỏ dễ bấm trên điện thoại.
            - Nút hoàn tất: “Bắt đầu cùng Tellie ✨”
        ========================================================================= */}
        {step === 3 && (
          <div className="space-y-5 animate-fadeIn">
            {/* Header: Exactly Required Title */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#171A35] border border-[#B9A9E8]/20 text-[#A8D2C4] text-xs font-bold tracking-wide mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>TELLIE SPIRIT · NGƯỜI BẠN ĐỒNG HÀNH</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#F5F2FA] font-display">
                Hãy chọn diện mạo cho Tellie Spirit ✨
              </h2>
            </div>

            {/* Tellie Spirit Preview lớn ở giữa */}
            <div className="relative py-1 flex flex-col items-center justify-center">
              <div
                className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center rounded-full transition-all duration-300"
                style={{
                  background: 'radial-gradient(circle at 50% 55%, rgba(185, 169, 232, 0.22) 0%, transparent 70%)'
                }}
              >
                <SpiritAvatar
                  id="fairy"
                  colorId={selectedColor}
                  accessory={selectedAccessory}
                  size="hero"
                  mood="happy"
                  animate={true}
                  glow={true}
                  showShadow={true}
                />
              </div>

              {/* Tên Fairy luôn là Tellie Spirit */}
              <div className="mt-1">
                <span className="text-base font-extrabold text-[#F5F2FA] font-display block">
                  Tellie Spirit
                </span>
                <span className="text-[11px] text-[#A8D2C4] font-medium block">
                  Fairy Spirit · Đang bên bạn
                </span>
              </div>
            </div>

            {/* CHỌN MÀU: 8 màu pastel/dreamy có tên tiếng Việt rõ ràng */}
            <div className="text-left pt-2 border-t border-white/10">
              <label className="block text-xs sm:text-sm font-bold text-[#F5F2FA] mb-2 font-display flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#F4B8D4]" />
                <span>Chọn màu sắc cho Tellie Spirit:</span>
              </label>

              <div className="grid grid-cols-4 gap-2">
                {FAIRY_COLORS.map(c => {
                  const isSelected = selectedColor === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectColor(c.id)}
                      className={`relative p-2 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all border text-left active:scale-95 ${
                        isSelected
                          ? 'bg-[#242347] border-[#B9A9E8] shadow-lg shadow-[#B9A9E8]/25 ring-2 ring-[#B9A9E8]/70 scale-[1.02]'
                          : 'bg-[#11152A]/90 border-white/10 hover:border-white/20 hover:bg-[#171A35]'
                      }`}
                      title={c.label}
                    >
                      <div
                        className="w-6 h-6 rounded-full shadow-md flex items-center justify-center border border-white/30"
                        style={{ backgroundColor: c.hex }}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#0D1020] stroke-[3.5]" />}
                      </div>
                      <span className={`text-[10px] font-bold text-center leading-tight line-clamp-1 ${
                        isSelected ? 'text-[#F5F2FA]' : 'text-[#858198]'
                      }`}>
                        {c.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CHỌN PHỤ KIỆN: 16 phụ kiện Fairycore */}
            <div className="text-left pt-2 border-t border-white/10">
              <label className="block text-xs sm:text-sm font-bold text-[#F5F2FA] mb-2 font-display flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#B9A9E8]" />
                <span>Chọn phụ kiện Fairycore (16 món):</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                {FAIRY_ACCESSORIES.map(acc => {
                  const isSelected = selectedAccessory === acc.id;
                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handleSelectAccessory(acc.id)}
                      className={`p-2 rounded-xl flex items-center gap-2 transition-all border text-left active:scale-95 ${
                        isSelected
                          ? 'bg-[#242347] border-[#B9A9E8] shadow-md shadow-[#B9A9E8]/25 ring-2 ring-[#B9A9E8]/70'
                          : 'bg-[#11152A]/90 border-white/10 hover:border-white/20 hover:bg-[#171A35]'
                      }`}
                      title={acc.label}
                    >
                      <span className="text-base sm:text-lg shrink-0">{acc.icon}</span>
                      <span className={`text-[11px] font-bold truncate leading-tight ${
                        isSelected ? 'text-[#F5F2FA]' : 'text-[#B9B5C8]'
                      }`}>
                        {acc.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Exactly Required Button: “Bắt đầu cùng Tellie ✨” */}
            <div className="pt-3">
              <button
                onClick={handleFinishOnboarding}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#B9A9E8] via-[#91B8E8] to-[#A8D2C4] text-[#0D1020] font-extrabold text-sm sm:text-base tracking-wide shadow-xl shadow-[#B9A9E8]/30 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>Bắt đầu cùng Tellie ✨</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
