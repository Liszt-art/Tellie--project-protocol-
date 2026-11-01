import React, { useState, useEffect } from 'react';
import { FairyColorId, FairyAccessory } from '../types';
import { SpiritAvatar } from './SpiritAvatar';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, Check, Palette, Crown, Heart } from 'lucide-react';
import { sound } from '../utils/audio';

interface SpiritSelectionProps {
  isOpen: boolean;
  isInitialSetup?: boolean;
  onClose?: () => void;
}

const FAIRY_COLORS: { id: FairyColorId; label: string; bg: string; dot: string }[] = [
  { id: 'gray', label: 'Xám êm dịu (Mặc định)', bg: 'bg-[#9CA3AF]/20 border-[#9CA3AF]', dot: '#9CA3AF' },
  { id: 'mint', label: 'Xanh bạc hà', bg: 'bg-[#A8D2C4]/20 border-[#A8D2C4]', dot: '#A8D2C4' },
  { id: 'lavender', label: 'Tím nguyệt quế', bg: 'bg-[#B9A9E8]/20 border-[#B9A9E8]', dot: '#B9A9E8' },
  { id: 'blue', label: 'Xanh sương đêm', bg: 'bg-[#91B8E8]/20 border-[#91B8E8]', dot: '#91B8E8' },
  { id: 'rose', label: 'Hồng thạch anh', bg: 'bg-[#F5C6DF]/20 border-[#F5C6DF]', dot: '#F5C6DF' },
  { id: 'cream', label: 'Trăng ngà ấm', bg: 'bg-[#F4EEDC]/20 border-[#F4EEDC]', dot: '#F4EEDC' },
  { id: 'peach', label: 'Cam đào mơ', bg: 'bg-[#FDD5C2]/20 border-[#FDD5C2]', dot: '#FDD5C2' },
  { id: 'charcoal', label: 'Than ánh bạc', bg: 'bg-[#64748B]/20 border-[#64748B]', dot: '#64748B' }
];

const FAIRY_ACCESSORIES: { id: FairyAccessory; label: string; icon: string; desc: string }[] = [
  { id: 'none', label: 'Không phụ kiện', icon: '✨', desc: 'Mộc mạc & thuần khiết' },
  { id: 'bow', label: 'Nơ xinh xắn', icon: '🎀', desc: 'Nơ ruy băng hoa hồng' },
  { id: 'wreath', label: 'Vòng hoa nở', icon: '🌸', desc: 'Vương miện hoa cỏ đêm' },
  { id: 'hairpin', label: 'Kẹp tóc sao', icon: '⭐', desc: 'Kẹp ánh sao pha lê' },
  { id: 'glasses', label: 'Kính tròn', icon: '👓', desc: 'Kính gọng vàng tri thức' }
];

export const SpiritSelectionModal: React.FC<SpiritSelectionProps> = ({
  isOpen,
  isInitialSetup = false,
  onClose
}) => {
  const { userSpirit, setUserSpiritData } = useApp();

  // Name: never hardcode "Hilulu". Default to existing customized name or empty for setup
  const [customName, setCustomName] = useState<string>(
    userSpirit && userSpirit.customName && userSpirit.customName !== 'Hilulu' ? userSpirit.customName : ''
  );
  // Default color is neutral gray
  const [selectedColor, setSelectedColor] = useState<FairyColorId>(
    userSpirit?.colorId || 'gray'
  );
  // Default accessory is none
  const [selectedAccessory, setSelectedAccessory] = useState<FairyAccessory>(
    userSpirit?.accessory || 'none'
  );
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (isOpen && userSpirit) {
      if (userSpirit.customName && userSpirit.customName !== 'Hilulu') {
        setCustomName(userSpirit.customName);
      }
      if (userSpirit.colorId) {
        setSelectedColor(userSpirit.colorId);
      }
      if (userSpirit.accessory) {
        setSelectedAccessory(userSpirit.accessory);
      }
    }
  }, [isOpen, userSpirit]);

  if (!isOpen) return null;

  const handleSelectColor = (c: FairyColorId) => {
    setSelectedColor(c);
    sound.playChime(600);
  };

  const handleSelectAccessory = (a: FairyAccessory) => {
    setSelectedAccessory(a);
    sound.playChime(640);
  };

  const handleConfirm = () => {
    const finalName = customName.trim() || 'Fairy Bé Nhỏ';
    setUserSpiritData('fairy', finalName, selectedColor, selectedAccessory);
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0A0D1B]/95 backdrop-blur-2xl overflow-y-auto">
      {/* Layered Dreamy Night Sky & Atmospheric Mist */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#B9A9E8]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-[#91B8E8]/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating Stardust Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-16 text-[#F4EEDC]/70 text-xs animate-ping">✧</div>
        <div className="absolute top-36 right-20 text-[#B9A9E8]/60 text-sm animate-pulse">✦</div>
        <div className="absolute bottom-32 left-1/3 text-[#A8D2C4]/60 text-xs animate-ping">⋆</div>
        <div className="absolute top-1/2 right-12 text-[#91B8E8]/60 text-xs animate-pulse">✧</div>
      </div>

      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-5 sm:p-7 border border-[#B9A9E8]/25 shadow-2xl text-center my-auto max-h-[92vh] overflow-y-auto">
        {/* Close button only if not initial setup */}
        {!isInitialSetup && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#858198] hover:text-[#F5F2FA] p-2 rounded-full transition-colors"
          >
            ✕
          </button>
        )}

        {/* Required Headers: TELLIE SPIRIT & Tinh linh của bạn */}
        <div className="mb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#171A35] border border-[#B9A9E8]/20 text-[#B9A9E8] text-xs font-semibold tracking-wide mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NGƯỜI BẠN ĐỒNG HÀNH ẨN DANH</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F5F2FA] font-display">
            TELLIE FAIRY SPIRIT
          </h1>
          <p className="text-xs sm:text-sm text-[#B9B5C8] font-medium mt-0.5">
            Tự do tạo hình và đặt tên cho Tinh linh đồng hành của bạn
          </p>
        </div>

        {/* LIVE HERO PREVIEW OF FAIRY SPIRIT */}
        <div className="relative py-2 flex flex-col items-center justify-center">
          <div
            className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center rounded-full transition-all duration-500"
            style={{
              background: 'radial-gradient(circle at 50% 60%, rgba(185, 169, 232, 0.25) 0%, transparent 70%)'
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

          <div className="mt-1 space-y-0.5">
            <span className="text-base sm:text-lg font-bold text-[#F5F2FA] font-display block">
              {customName.trim() || 'Fairy Bé Nhỏ'}
            </span>
            <span className="text-xs text-[#A8D2C4] font-medium block">
              Fairy Spirit · Có cánh phát sáng
            </span>
          </div>
        </div>

        {/* SECTION 1: ĐẶT TÊN CHO FAIRY */}
        <div className="text-left mt-4 pt-3 border-t border-white/10">
          <label className="block text-xs sm:text-sm font-bold text-[#F5F2FA] mb-1.5 font-display flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-[#F5C6DF]" />
            <span>1. Tự đặt tên cho Fairy của bạn:</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={customName}
              onChange={e => {
                setCustomName(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="Nhập tên bạn muốn gọi (ví dụ: Luna, Sương, Bé Nhỏ, Ánh Sao...)"
              maxLength={24}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#11152A] border border-[#B9A9E8]/30 text-[#F5F2FA] placeholder-[#858198] focus:outline-none focus:border-[#B9A9E8] focus:ring-2 focus:ring-[#B9A9E8]/25 transition-all text-xs sm:text-sm font-medium"
            />
          </div>
          {errorMsg && (
            <p className="text-xs text-[#DFAFC8] mt-1 font-medium">
              {errorMsg}
            </p>
          )}
        </div>

        {/* SECTION 2: CHỌN MÀU SẮC CHO FAIRY */}
        <div className="text-left mt-4">
          <label className="block text-xs sm:text-sm font-bold text-[#F5F2FA] mb-2 font-display flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-[#A8D2C4]" />
            <span>2. Chọn màu sắc cho Fairy:</span>
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
            {FAIRY_COLORS.map(c => {
              const isSelected = selectedColor === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelectColor(c.id)}
                  className={`relative p-2 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all border text-left ${
                    isSelected
                      ? 'bg-[#242347] border-[#B9A9E8] shadow-lg shadow-[#B9A9E8]/25 ring-2 ring-[#B9A9E8]/60 scale-102'
                      : 'bg-[#11152A]/90 border-white/10 hover:border-white/20 hover:bg-[#171A35]'
                  }`}
                >
                  <div
                    className="w-5 h-5 rounded-full shadow-inner flex items-center justify-center border border-white/20"
                    style={{ backgroundColor: c.dot }}
                  >
                    {isSelected && <Check className="w-3 h-3 text-[#0D1020] stroke-[3]" />}
                  </div>
                  <span className={`text-[10px] font-semibold text-center leading-tight line-clamp-1 ${
                    isSelected ? 'text-[#F5F2FA]' : 'text-[#858198]'
                  }`}>
                    {c.label.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: CHỌN PHỤ KIỆN CHO FAIRY */}
        <div className="text-left mt-4">
          <label className="block text-xs sm:text-sm font-bold text-[#F5F2FA] mb-2 font-display flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5 text-[#FBBF24]" />
            <span>3. Chọn phụ kiện trang trí:</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {FAIRY_ACCESSORIES.map(acc => {
              const isSelected = selectedAccessory === acc.id;
              return (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => handleSelectAccessory(acc.id)}
                  className={`p-2 rounded-xl flex items-center gap-2 transition-all border text-left ${
                    isSelected
                      ? 'bg-[#242347] border-[#B9A9E8] shadow-md shadow-[#B9A9E8]/20 ring-2 ring-[#B9A9E8]/60'
                      : 'bg-[#11152A]/90 border-white/10 hover:border-white/20 hover:bg-[#171A35]'
                  }`}
                >
                  <span className="text-lg">{acc.icon}</span>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold truncate ${isSelected ? 'text-[#F5F2FA]' : 'text-[#B9B5C8]'}`}>
                      {acc.label}
                    </p>
                    <p className="text-[10px] text-[#858198] truncate">
                      {acc.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleConfirm}
          className="w-full mt-5 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#B9A9E8] via-[#91B8E8] to-[#A8D2C4] text-[#0D1020] font-extrabold text-sm tracking-wide shadow-xl shadow-[#B9A9E8]/25 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span>Lưu Fairy & Kết nối</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>

        <p className="text-[11px] text-[#858198] mt-2">
          Bạn có thể thay đổi màu sắc, tên và phụ kiện bất kỳ lúc nào tại mục Cá nhân.
        </p>
      </div>
    </div>
  );
};
