import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  Lock,
  Unlock,
  Edit3,
  RotateCcw,
  Check,
  ChevronRight,
  TrendingUp,
  Settings,
  Info,
  Heart,
  ArrowLeft,
  X,
  AlertTriangle,
  KeyRound,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getSpiritById } from '../data/spirits';
import { MOODS_LIST, getMoodById } from '../data/moods';
import { SpiritAvatar } from './SpiritAvatar';
import { KintsugiObjectGraphic } from './KintsugiObjectGraphic';
import { MoodEntry, KintsugiItem, MoodId } from '../types';
import { sound } from '../utils/audio';

interface ProfileViewProps {
  onClose?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onClose }) => {
  const {
    userSpirit,
    todayMood,
    moodHistory,
    posts,
    burnedPapers,
    kintsugiItems,
    renameKintsugiItem,
    openModal,
    resetAllData,
    resetOnboarding,
    userNickname,
    setUserNickname
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'kintsugi' | 'weekly' | 'moodboard'>('kintsugi');
  const [selectedMonthDay, setSelectedMonthDay] = useState<number>(3);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempNickname, setTempNickname] = useState(userNickname || '');

  // Kintsugi Museum Rename Modal State
  const [editingKintsugiItem, setEditingKintsugiItem] = useState<KintsugiItem | null>(null);
  const [newKintsugiName, setNewKintsugiName] = useState('');

  // Password-protected Private Memories state
  const [isPrivateUnlocked, setIsPrivateUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Strict 2-Step Confirmation for Reset LocalStorage (requires typing "XOA")
  const [resetModalStep, setResetModalStep] = useState<0 | 1 | 2>(0);
  const [confirmXoaText, setConfirmXoaText] = useState('');

  // Testing Reset Onboarding state
  const [showOnboardingResetConfirm, setShowOnboardingResetConfirm] = useState(false);

  const currentSpiritId = userSpirit ? userSpirit.spiritId : 'fairy';
  const spiritMeta = getSpiritById(currentSpiritId);
  const spiritName = userSpirit?.customName || 'Tellie Spirit';

  const privatePosts = posts.filter(p => p.isPrivate);

  const handleSaveNickname = () => {
    if (!tempNickname.trim()) return;
    setUserNickname(tempNickname.trim());
    setIsEditingName(false);
    sound.playChime(640);
  };

  // Verify PIN for Private Memories
  const handleUnlockPrivate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // Default PIN: 1234
    if (pinInput.trim() === '1234' || pinInput.trim() === '0000') {
      setIsPrivateUnlocked(true);
      setPinError('');
      sound.playChime(784);
    } else {
      setPinError('Mã PIN không chính xác (Gợi ý mã mẫu: 1234)');
      sound.playChime(320);
    }
  };

  return (
    <div className="relative min-h-[90vh] space-y-6 text-left pb-20 animate-fade-in">
      {/* 1. TOP HEADER WITH BACK BUTTON & SETTINGS */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <button
          type="button"
          onClick={() => {
            sound.playChime(500);
            if (onClose) onClose();
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#F5F2FA] transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-[#B9A9E8]" />
          <span>Quay lại trang chính</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              sound.playChime(500);
              setShowSettingsModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#CBD5E1] hover:text-white transition-all border border-white/10"
            title="Cài đặt & Dữ liệu thiết bị"
          >
            <Settings className="w-3.5 h-3.5 text-[#B9A9E8]" />
            <span className="hidden sm:inline">Cài đặt & Dữ liệu</span>
          </button>

          <span className="text-xs font-extrabold text-[#A8D2C4] uppercase tracking-wider bg-[#A8D2C4]/15 px-3 py-1 rounded-full border border-[#A8D2C4]/25">
            Hồ Sơ
          </span>
        </div>
      </div>

      {/* 2. TOP PROFILE HERO CARD */}
      <section className="relative rounded-3xl p-6 border border-[#B9A9E8]/25 shadow-2xl overflow-hidden bg-gradient-to-b from-[#141836] via-[#1A1F42] to-[#10132B]">
        <div
          className="absolute -right-10 -top-10 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-40"
          style={{ background: spiritMeta.glowColor }}
        />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 z-10 relative">
          {/* Avatar Tellie Spirit */}
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-[#171A35]/80 border border-white/10 flex items-center justify-center p-2 shrink-0 shadow-2xl">
            <SpiritAvatar
              id={currentSpiritId}
              colorId={userSpirit?.colorId}
              accessory={userSpirit?.accessory}
              size="lg"
              mood="happy"
              animate={true}
              glow={true}
              showShadow={true}
            />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            {/* User Name with Edit */}
            <div className="flex items-center justify-center sm:justify-start gap-2">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tempNickname}
                    onChange={e => setTempNickname(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-[#11152A] border border-[#B9A9E8] text-sm font-bold text-white focus:outline-none"
                    placeholder="Nhập tên của bạn"
                    maxLength={25}
                  />
                  <button
                    type="button"
                    onClick={handleSaveNickname}
                    className="p-1.5 rounded-xl bg-[#B9A9E8] text-[#0D1020]"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#FFFFFF] font-display">
                    {userNickname || 'Bạn'}
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setTempNickname(userNickname || '');
                      setIsEditingName(true);
                    }}
                    className="p-1.5 text-[#B9B5C8] hover:text-white rounded-lg hover:bg-white/5"
                    title="Đổi tên của bạn"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <p className="text-xs text-[#E2E8F0]">
              Linh vật đồng hành: <strong className="text-[#A8D2C4]">{spiritName}</strong>
            </p>

            {/* Custom Tellie Spirit Options Button */}
            <button
              type="button"
              onClick={() => {
                sound.playChime(600);
                openModal('spiritSelect');
              }}
              className="min-h-[40px] inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#242347] hover:bg-[#322f5e] border border-[#B9A9E8]/40 text-xs font-bold text-[#FFFFFF] transition-all shadow-md active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B9A9E8]" />
              <span>Tùy biến diện mạo Tellie Spirit (Màu & Phụ kiện)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. PROFILE SUB-NAVIGATION (3 DISTINCT SUB-TABS) */}
      <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[#0F1326] border border-white/10 shadow-lg">
        {[
          { id: 'kintsugi', label: 'Bảo tàng hàn gắn', icon: Sparkles },
          { id: 'weekly', label: 'Biểu đồ cảm xúc', icon: TrendingUp },
          { id: 'moodboard', label: 'Mood Board', icon: Calendar }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveSubTab(tab.id as any);
                sound.playChime(500);
              }}
              className={`min-h-[44px] px-2 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                isActive
                  ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-[#0D0F1D] shadow-md font-extrabold scale-[1.02]'
                  : 'text-[#E2E8F0] hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          SECTION 0: BẢO TÀNG HÀN GẮN (KINTSUGI MUSEUM)
      ========================================================================= */}
      {activeSubTab === 'kintsugi' && (
        <div className="space-y-6 animate-fade-in text-left">
          {/* Header Banner */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-[#171633] via-[#211E42] to-[#141836] border border-amber-400/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-[11px] font-extrabold text-amber-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>TRIẾT LÝ KINTSUGI NHẬT BẢN</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white font-display">
                Bảo Tàng Hàn Gắn Tâm Hồn
              </h3>
              <p className="text-xs text-[#CBD5E1] max-w-md leading-relaxed">
                Những vết nứt không cần che giấu. Khi được hàn gắn bằng chỉ vàng trắc ẩn và sự thấu hiểu, chúng trở thành phần độc bản đẹp nhất của bạn.
              </p>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-black/40 border border-amber-400/30 text-center shrink-0">
              <span className="text-[10px] uppercase font-bold text-amber-300 block">Kỷ vật đã lưu</span>
              <span className="text-2xl font-extrabold text-white font-display">
                {kintsugiItems.length}
              </span>
            </div>
          </div>

          {/* Kintsugi Gallery Items */}
          {kintsugiItems.length === 0 ? (
            <div className="p-10 rounded-3xl bg-[#11152A] border border-white/10 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-300">
                <Sparkles className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-white">Chưa có kỷ vật nào được lưu trữ</h4>
              <p className="text-xs text-[#CBD5E1] max-w-sm mx-auto">
                Khi bạn check-in cảm xúc ở Home hoặc viết tâm sự ở Nhật Ký, những chiếc bình nứt vỡ sẽ được hàn gắn và trưng bày tại đây.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {kintsugiItems.map(item => (
                <div
                  key={item.id}
                  className="group relative p-5 rounded-3xl bg-[#11152A] border border-amber-400/25 hover:border-amber-400/50 shadow-xl transition-all flex flex-col justify-between space-y-4"
                >
                  {/* Top: Graphic & Name */}
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 p-3 rounded-2xl bg-[#090C1A] border border-amber-400/20 shadow-inner flex items-center justify-center group-hover:scale-105 transition-transform">
                      <KintsugiObjectGraphic
                        objectType={item.objectType}
                        repairProgress={item.repairProgress}
                        size="md"
                        showGlow={true}
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-400/20 truncate">
                          {item.moodLabelVi}
                        </span>

                        {/* RENAME BUTTON */}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingKintsugiItem(item);
                            setNewKintsugiName(item.customName);
                            sound.playChime(600);
                          }}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-[#CBD5E1] hover:text-white transition-colors"
                          title="Đổi tên kỷ vật này"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                        </button>
                      </div>

                      <h4 className="text-sm font-extrabold text-white leading-tight break-words">
                        {item.customName}
                      </h4>

                      <div className="flex items-center gap-1.5 text-[11px] text-[#94A3B8]">
                        <Calendar className="w-3 h-3 text-[#A8D2C4]" />
                        <span>{item.dateFormatted}</span>
                      </div>
                    </div>
                  </div>

                  {/* Original Entry Text */}
                  {item.originalText && (
                    <div className="p-3 rounded-2xl bg-[#0B0D1F] border border-white/5">
                      <p className="text-xs text-[#E2E8F0] line-clamp-3 leading-relaxed italic">
                        “{item.originalText}”
                      </p>
                    </div>
                  )}

                  {/* Bottom Footer Badge */}
                  <div className="pt-1 flex items-center justify-between border-t border-white/5 text-[11px]">
                    <span className="text-[#A8D2C4] font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-300 fill-current" />
                      <span>Chỉ vàng Kintsugi 100%</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingKintsugiItem(item);
                        setNewKintsugiName(item.customName);
                        sound.playChime(600);
                      }}
                      className="text-xs font-bold text-amber-300 hover:text-amber-200 underline"
                    >
                      Đổi tên
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 2: [BIỂU ĐỒ CẢM XÚC] (WEEKLY EMOTION CHART - 7-DAY FLUCTUATION)
      ========================================================================= */}
      {activeSubTab === 'weekly' && (() => {
        // 7 days of current week (Thứ 2 to Chủ Nhật)
        const WEEK_DAYS = [
          { dayVi: 'Thứ Hai', shortDay: 'T2', dateStr: '27/10', moodId: 'calm' as MoodId, valence: 4, note: 'Khởi đầu tuần mới bình yên với tách trà ấm' },
          { dayVi: 'Thứ Ba', shortDay: 'T3', dateStr: '28/10', moodId: 'heavy' as MoodId, valence: 2, note: 'Áp lực bài kiểm tra xác suất khó hơn dự kiến' },
          { dayVi: 'Thứ Tư', shortDay: 'T4', dateStr: '29/10', moodId: 'anxious' as MoodId, valence: 2, note: 'Họp nhóm đồ án đến tận đêm muộn' },
          { dayVi: 'Thứ Năm', shortDay: 'T5', dateStr: '30/10', moodId: 'lost' as MoodId, valence: 3, note: 'Trăn trở về định hướng thực tập và tương lai' },
          { dayVi: 'Thứ Sáu', shortDay: 'T6', dateStr: '31/10', moodId: 'tender' as MoodId, valence: 4, note: 'Được bạn cùng phòng mua chè an ủi ấm áp' },
          { dayVi: 'Thứ Bảy', shortDay: 'T7', dateStr: '01/11', moodId: 'hopeful' as MoodId, valence: 5, note: 'Hoàn thành bản thảo bài nghiên cứu đầu tay' },
          { dayVi: 'Chủ Nhật', shortDay: 'CN', dateStr: '02/11', moodId: 'grateful' as MoodId, valence: 5, note: 'Dành cả ngày nghỉ ngơi trọn vẹn, nạp lại năng lượng' }
        ];

        const svgW = 460;
        const svgH = 150;
        const padX = 35;
        const padY = 25;

        const points = WEEK_DAYS.map((day, idx) => {
          const x = padX + (idx / 6) * (svgW - padX * 2);
          const y = padY + (1 - (day.valence - 1) / 4) * (svgH - padY * 2);
          return { ...day, x, y };
        });

        const pathD = points.reduce((acc, pt, i, arr) => {
          if (i === 0) return `M ${pt.x} ${pt.y}`;
          const prev = arr[i - 1];
          const cx = (prev.x + pt.x) / 2;
          return `${acc} C ${cx} ${prev.y}, ${cx} ${pt.y}, ${pt.x} ${pt.y}`;
        }, '');

        const areaD = `${pathD} L ${points[6].x} ${svgH - 8} L ${points[0].x} ${svgH - 8} Z`;

        return (
          <div className="space-y-6 animate-fade-in text-left">
            {/* Header info */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-[#171A35] via-[#211E42] to-[#141836] border border-[#B9A9E8]/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B9A9E8]/20 border border-[#B9A9E8]/30 text-[11px] font-extrabold text-[#B9A9E8]">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>BIỂU ĐỒ CẢM XÚC TUẦN NÀY (7 NGÀY)</span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white font-display">
                  Đường Cong Biến Thiên Cảm Xúc
                </h3>
                <p className="text-xs text-[#CBD5E1] max-w-md leading-relaxed">
                  Theo dõi nhịp điệu tâm trạng từ Thứ Hai đến Chủ Nhật để nhận diện những áp lực và cân bằng cuộc sống sinh viên.
                </p>
              </div>

              <div className="px-4 py-2.5 rounded-2xl bg-black/40 border border-[#B9A9E8]/30 text-center shrink-0">
                <span className="text-[10px] uppercase font-bold text-[#A8D2C4] block">Chỉ số tuần</span>
                <span className="text-2xl font-extrabold text-white font-display">
                  3.7<span className="text-xs text-[#CBD5E1] font-normal"> / 5.0</span>
                </span>
                <span className="text-[10px] text-emerald-300 font-semibold block mt-0.5">Dần hồi phục ✨</span>
              </div>
            </div>

            {/* 7-Day SVG Line Chart */}
            <div className="glass-panel rounded-3xl p-5 border border-white/15 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#F5F2FA] uppercase tracking-wider">
                  Biến thiên 7 ngày (27/10 – 02/11)
                </span>
                <span className="text-[11px] text-[#A8D2C4] bg-[#A8D2C4]/15 px-2.5 py-0.5 rounded-full font-semibold">
                  Chu kỳ 7 ngày hiện tại
                </span>
              </div>

              <div className="rounded-2xl bg-[#090C19]/90 border border-white/10 p-3 overflow-x-auto">
                <svg viewBox={`0 0 ${svgW} ${svgH + 15}`} className="w-full h-44 overflow-visible">
                  <defs>
                    <linearGradient id="weeklyAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#B9A9E8" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#A8D2C4" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="weeklyLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#B9A9E8" />
                      <stop offset="50%" stopColor="#91B8E8" />
                      <stop offset="100%" stopColor="#A8D2C4" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid guide lines */}
                  <line x1={padX} y1={padY} x2={svgW - padX} y2={padY} stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                  <line x1={padX} y1={padY + (svgH - padY * 2) * 0.5} x2={svgW - padX} y2={padY + (svgH - padY * 2) * 0.5} stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                  <line x1={padX} y1={svgH - padY} x2={svgW - padX} y2={svgH - padY} stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />

                  {/* Shaded Area & Curved Line */}
                  <path d={areaD} fill="url(#weeklyAreaGrad)" />
                  <path d={pathD} fill="none" stroke="url(#weeklyLineGrad)" strokeWidth="3" strokeLinecap="round" />

                  {/* 7 Daily Points */}
                  {points.map((pt, idx) => {
                    const mood = getMoodById(pt.moodId);
                    return (
                      <g key={idx} className="cursor-pointer">
                        <circle cx={pt.x} cy={pt.y} r="10" fill="#171A35" stroke={mood.color} strokeWidth="2.5" />
                        <circle cx={pt.x} cy={pt.y} r="4" fill="#FFFFFF" />
                        <text x={pt.x} y={svgH} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#F5F2FA">
                          {pt.shortDay}
                        </text>
                        <text x={pt.x} y={svgH + 11} textAnchor="middle" fontSize="9" fill="#94A3B8">
                          {pt.dateStr}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* 7 Day Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2">
                {WEEK_DAYS.map((d, i) => {
                  const m = getMoodById(d.moodId);
                  return (
                    <div
                      key={i}
                      className="p-2.5 rounded-2xl bg-[#11152A] border border-white/10 hover:border-[#B9A9E8]/40 transition-all text-center space-y-1"
                    >
                      <div className="text-[10px] text-[#94A3B8] font-bold">{d.shortDay} · {d.dateStr}</div>
                      <div className="text-xl">{m.icon}</div>
                      <div className="text-[11px] font-bold text-white truncate" style={{ color: m.color }}>{m.labelVi}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Weekly Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-[#11152A] border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#CBD5E1]">Điểm cân bằng</span>
                <h4 className="text-base font-extrabold text-white">3.7 / 5.0</h4>
                <p className="text-[11px] text-[#A8D2C4]">Xu hướng tích cực vào cuối tuần</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#11152A] border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#CBD5E1]">Ngày an yên nhất</span>
                <h4 className="text-base font-extrabold text-white">Chủ Nhật (02/11)</h4>
                <p className="text-[11px] text-[#A8D2C4]">Biết ơn & tĩnh lặng trọn vẹn</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#11152A] border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#CBD5E1]">Tâm trạng chủ đạo</span>
                <h4 className="text-base font-extrabold text-white">Thanh thản</h4>
                <p className="text-[11px] text-[#A8D2C4]">Xuất hiện nhiều nhất trong tuần</p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* =========================================================================
          SUB-TAB 3: [MOOD BOARD] (MONTHLY OVERVIEW - 30/31-DAY CALENDAR GRID)
      ========================================================================= */}
      {activeSubTab === 'moodboard' && (() => {
        const DAYS_COUNT = 30; // November has 30 days
        const NOVEMBER_MOOD_MAP: Record<number, { moodId: MoodId; note?: string }> = {
          1: { moodId: 'hopeful', note: 'Bản thảo bài nghiên cứu đầu tay đã nộp' },
          2: { moodId: 'grateful', note: 'Chủ Nhật thảnh thơi, nấu ăn cùng bạn bè' },
          3: { moodId: todayMood || 'calm', note: 'Hôm nay: Trút bầu tâm sự và gắn liền chỉ vàng' },
          5: { moodId: 'tender', note: 'Nhận được thư viết tay từ người thân' },
          7: { moodId: 'calm', note: 'Buổi chiều đọc sách bên ban công' },
          9: { moodId: 'heavy', note: 'Áp lực thuyết trình môn kinh tế vi mô' },
          10: { moodId: 'anxious', note: 'Lo lắng về kết quả xét tuyển học bổng' },
          12: { moodId: 'calm', note: 'Đi bộ buổi tối quanh hồ đá mát rượi' },
          14: { moodId: 'grateful', note: 'Bạn bè bất ngờ chúc mừng sinh nhật' },
          16: { moodId: 'hopeful', note: 'Được giảng viên khen ngợi ý tưởng nghiên cứu' },
          18: { moodId: 'exhausted', note: 'Thức trắng đêm chạy deadline đồ án cuối kỳ' },
          19: { moodId: 'lost', note: 'Tự hỏi con đường sự nghiệp phía trước' },
          21: { moodId: 'tender', note: 'Uống ly cacao nóng ngày trở gió' },
          23: { moodId: 'calm', note: 'Ngủ đủ 8 tiếng sau chuỗi ngày mệt mỏi' },
          25: { moodId: 'hopeful', note: 'Nhận được email phỏng vấn thực tập' },
          27: { moodId: 'anxious', note: 'Chuẩn bị trang phục cho buổi phỏng vấn' },
          28: { moodId: 'grateful', note: 'Phỏng vấn suôn sẻ hơn kỳ vọng rất nhiều' },
          30: { moodId: 'calm', note: 'Khép lại một tháng nhiều thăng trầm trong bình an' }
        };

        const selectedDayData = NOVEMBER_MOOD_MAP[selectedMonthDay];
        const selectedDayMood = selectedDayData ? getMoodById(selectedDayData.moodId) : null;

        return (
          <div className="space-y-6 animate-fade-in text-left">
            {/* Header Banner */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-[#171633] via-[#211E42] to-[#141836] border border-[#B9A9E8]/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B9A9E8]/20 border border-[#B9A9E8]/30 text-[11px] font-extrabold text-[#B9A9E8]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>MOOD BOARD · TỔNG QUAN THÁNG</span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white font-display">
                  Ma Trận Màu Cảm Xúc Tháng 11
                </h3>
                <p className="text-xs text-[#CBD5E1] max-w-md leading-relaxed">
                  Lưới lịch 30 ngày mã hóa màu sắc. Mỗi ô phản ánh trạng thái tâm hồn để bạn nhìn nhận toàn cảnh cảm xúc trong cả tháng.
                </p>
              </div>

              <div className="px-4 py-2.5 rounded-2xl bg-black/40 border border-[#B9A9E8]/30 text-center shrink-0">
                <span className="text-[10px] uppercase font-bold text-[#A8D2C4] block">Ngày đã ghi</span>
                <span className="text-2xl font-extrabold text-white font-display">
                  {Object.keys(NOVEMBER_MOOD_MAP).length} / 30
                </span>
                <span className="text-[10px] text-amber-300 font-semibold block mt-0.5">Tháng 11 · 2026</span>
              </div>
            </div>

            {/* 30-Day Calendar Matrix Card */}
            <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/15 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>📅 Bảng màu tâm trạng (30 Ngày)</span>
                </h4>
                <span className="text-xs text-[#CBD5E1]">Bấm vào ngày để xem chi tiết</span>
              </div>

              {/* Day of week headers */}
              <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-bold text-[#A8D2C4] pb-1 border-b border-white/10">
                <span>T2</span>
                <span>T3</span>
                <span>T4</span>
                <span>T5</span>
                <span>T6</span>
                <span>T7</span>
                <span>CN</span>
              </div>

              {/* 30 Day Cells Grid */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {Array.from({ length: DAYS_COUNT }, (_, i) => i + 1).map(day => {
                  const entry = NOVEMBER_MOOD_MAP[day];
                  const mood = entry ? getMoodById(entry.moodId) : null;
                  const isSelected = selectedMonthDay === day;
                  const isToday = day === 3;

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        setSelectedMonthDay(day);
                        sound.playChime(entry ? 620 : 450);
                      }}
                      className={`relative min-h-[52px] sm:min-h-[58px] p-1.5 rounded-2xl border transition-all flex flex-col items-center justify-between ${
                        isSelected
                          ? 'ring-2 ring-amber-400 bg-[#242347] border-amber-400/80 scale-105 shadow-lg z-10'
                          : entry
                          ? 'bg-[#11152A] border-white/15 hover:border-white/30'
                          : 'bg-[#0A0D1B]/60 border-white/5 hover:bg-white/5'
                      }`}
                      style={{
                        backgroundColor: entry && !isSelected ? `${mood?.bgColor}33` : undefined,
                        borderColor: entry && !isSelected ? `${mood?.borderColor}66` : undefined
                      }}
                    >
                      {/* Day number & today marker */}
                      <div className="w-full flex items-center justify-between">
                        <span className={`text-[10px] font-bold ${isToday ? 'text-amber-300 font-extrabold' : 'text-[#CBD5E1]'}`}>
                          {day}
                        </span>
                        {isToday && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" title="Hôm nay" />
                        )}
                      </div>

                      {/* Mood Indicator / Icon */}
                      {entry && mood ? (
                        <div className="flex flex-col items-center">
                          <span className="text-base leading-none drop-shadow">{mood.icon}</span>
                          <span
                            className="w-1.5 h-1.5 rounded-full mt-1"
                            style={{ backgroundColor: mood.color, boxShadow: `0 0 6px ${mood.color}` }}
                          />
                        </div>
                      ) : (
                        <span className="text-[11px] text-white/20 pb-1">·</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Selected Day Preview Card */}
              <div className="p-4 rounded-2xl bg-[#090C19] border border-amber-400/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">
                      Ngày {selectedMonthDay} tháng 11, 2026
                    </span>
                    {selectedMonthDay === 3 && (
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full">
                        Hôm nay
                      </span>
                    )}
                  </div>
                  {selectedDayMood && (
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-bold border"
                      style={{
                        backgroundColor: selectedDayMood.bgColor,
                        borderColor: selectedDayMood.borderColor,
                        color: selectedDayMood.color
                      }}
                    >
                      {selectedDayMood.icon} {selectedDayMood.labelVi}
                    </span>
                  )}
                </div>

                {selectedDayData ? (
                  <p className="text-xs text-[#E2E8F0] leading-relaxed italic">
                    “{selectedDayData.note || 'Cảm xúc đã được ghi nhận trong ngày.'}”
                  </p>
                ) : (
                  <p className="text-xs text-[#94A3B8] italic">
                    Ngày này chưa có lượt check-in nào. Hãy thực hiện check-in mỗi ngày ở tab Home hoặc Nhật Ký nhé.
                  </p>
                )}
              </div>
            </div>

            {/* Monthly Mood Distribution Breakdown */}
            <div className="glass-panel rounded-3xl p-5 border border-white/15 space-y-4 shadow-xl">
              <h4 className="text-xs font-bold text-[#F5F2FA] uppercase tracking-wider">
                Phân bố tỷ lệ cảm xúc trong tháng
              </h4>

              <div className="space-y-2.5">
                {[
                  { label: 'Thanh thản & Dịu êm', percent: 38, color: '#A8D2C4', icon: '🌿' },
                  { label: 'Hy vọng & Biết ơn', percent: 30, color: '#FFFEE8', icon: '✨' },
                  { label: 'Bất an & Nặng lòng', percent: 20, color: '#91B8E8', icon: '🌧️' },
                  { label: 'Lạc lối & Mệt nhoài', percent: 12, color: '#DFAFC8', icon: '🔋' }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-1.5 text-white">
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </span>
                      <span style={{ color: item.color }}>{item.percent}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* SETTINGS & DATA MODAL (ACCESSIBLE FROM TOP HEADER BUTTON) */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0D1B]/90 backdrop-blur-2xl animate-fade-in text-left">
          <div className="w-full max-w-md glass-panel rounded-3xl p-6 border border-white/15 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#B9A9E8]" />
                <h3 className="text-base font-bold text-white">Cài Đặt & Dữ Liệu Thiết Bị</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#B9B5C8] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Reset LocalStorage Section */}
              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-2">
                <span className="text-xs font-bold text-rose-300 uppercase tracking-wider block">
                  Dọn dẹp và đặt lại
                </span>
                <p className="text-xs text-[#CBD5E1] leading-relaxed">
                  Xóa toàn bộ nhật ký, kỷ vật hàn gắn, lịch sử cảm xúc và thiết lập cá nhân được lưu trên trình duyệt này.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    sound.playChime(480);
                    setShowSettingsModal(false);
                    setResetModalStep(1);
                  }}
                  className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-rose-950/60 hover:bg-rose-900/70 border border-rose-500/50 text-rose-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <RotateCcw className="w-4 h-4 text-rose-400" />
                  <span>Đặt lại dữ liệu ứng dụng (Reset LocalStorage)</span>
                </button>
              </div>

              {/* Reset Onboarding Section */}
              <div className="p-4 rounded-2xl bg-[#171A35] border border-white/10 space-y-2">
                <span className="text-xs font-bold text-[#A8D2C4] uppercase tracking-wider block">
                  Trải nghiệm người dùng
                </span>
                <p className="text-xs text-[#CBD5E1] leading-relaxed">
                  Bắt đầu lại màn hình chào mừng và tùy biến lại diện mạo ban đầu của Tellie Spirit.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    sound.playChime(500);
                    setShowSettingsModal(false);
                    setShowOnboardingResetConfirm(true);
                  }}
                  className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#202547] hover:bg-[#2a305e] border border-[#B9A9E8]/30 text-xs font-semibold text-[#D4CBE5] hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#B9A9E8]" />
                  <span>Đặt lại trải nghiệm onboarding</span>
                </button>
              </div>

              {/* Private Memories (PIN Protected) */}
              <div className="p-4 rounded-2xl bg-[#11152A] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#A8D2C4]" />
                    <span>Ký ức riêng tư</span>
                  </span>
                  {isPrivateUnlocked && (
                    <button
                      type="button"
                      onClick={() => setIsPrivateUnlocked(false)}
                      className="text-[11px] text-[#CBD5E1] hover:text-white underline"
                    >
                      Khóa lại
                    </button>
                  )}
                </div>

                {!isPrivateUnlocked ? (
                  <form onSubmit={handleUnlockPrivate} className="space-y-2">
                    <p className="text-[11px] text-[#CBD5E1]">
                      Nhập mã PIN để mở khóa (Mã mẫu: <strong>1234</strong>)
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="password"
                        value={pinInput}
                        onChange={e => setPinInput(e.target.value)}
                        placeholder="PIN 4 số"
                        maxLength={6}
                        className="flex-1 px-3 py-2 rounded-xl bg-[#090C1A] border border-white/20 text-xs text-center tracking-widest text-white focus:outline-none focus:border-[#B9A9E8]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-[#B9A9E8] text-[#0D1020] text-xs font-bold"
                      >
                        Mở
                      </button>
                    </div>
                    {pinError && <p className="text-[11px] text-rose-300">{pinError}</p>}
                  </form>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {privatePosts.length === 0 ? (
                      <p className="text-[11px] text-[#94A3B8]">Chưa có bài viết riêng tư nào.</p>
                    ) : (
                      privatePosts.map(p => (
                        <div key={p.id} className="p-2.5 rounded-xl bg-[#090C1A] border border-white/10 text-xs space-y-1">
                          <span className="font-bold text-white block">{p.title}</span>
                          <p className="text-[#CBD5E1] text-[11px] line-clamp-2">{p.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. DÀNH CHO THỬ NGHIỆM (TESTING ONBOARDING RESET) */}
      <div className="pt-6 border-t border-white/10 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold text-[#CBD5E1] tracking-wider uppercase mb-2">
          <span>Dành cho thử nghiệm</span>
        </div>
        <p className="text-xs text-[#CBD5E1] max-w-xs mx-auto mb-3">
          Kiểm tra lại toàn bộ quy trình onboarding từ màn hình Chào bạn ✨ đến tùy biến Tellie Spirit.
        </p>
        <button
          type="button"
          onClick={() => {
            sound.playChime(500);
            setShowOnboardingResetConfirm(true);
          }}
          className="min-h-[44px] px-4 py-2.5 rounded-2xl bg-[#171A35] hover:bg-[#202547] border border-[#B9A9E8]/30 hover:border-[#B9A9E8]/60 text-xs font-semibold text-[#D4CBE5] hover:text-white transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 mx-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#B9A9E8]" />
          <span>Đặt lại trải nghiệm onboarding</span>
        </button>
      </div>

      {/* =========================================================================
          STRICT 2-STEP CONFIRMATION MODAL FOR RESET LOCALSTORAGE
      ========================================================================= */}
      {resetModalStep > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in text-center">
          <div className="w-full max-w-md rounded-3xl bg-[#11152A] border border-rose-500/40 p-6 shadow-2xl space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            {/* STEP 1 OF 2 */}
            {resetModalStep === 1 && (
              <div className="space-y-3">
                <span className="text-[11px] font-extrabold text-rose-400 uppercase tracking-wider bg-rose-950/60 px-3 py-1 rounded-full border border-rose-500/30">
                  Bước 1/2 · Cảnh Báo
                </span>
                <h4 className="text-base sm:text-lg font-bold text-[#FFFFFF]">
                  Xác nhận đặt lại toàn bộ dữ liệu?
                </h4>
                <p className="text-xs text-[#E2E8F0] leading-relaxed">
                  Thao tác này sẽ xóa sạch nhật ký, các mầm cây trong Vườn Tellie, lịch sử cảm xúc và thiết lập cá nhân được lưu trên máy của bạn.
                </p>

                <div className="flex items-center gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setResetModalStep(0);
                      setConfirmXoaText('');
                    }}
                    className="flex-1 min-h-[44px] py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-[#E2E8F0]"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playChime(520);
                      setConfirmXoaText('');
                      setResetModalStep(2);
                    }}
                    className="flex-1 min-h-[44px] py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-[#0D1020] font-bold text-xs shadow-md"
                  >
                    Tiếp tục sang Bước 2 →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 OF 2: STRICT REQUIREMENT TYPING "XOA" */}
            {resetModalStep === 2 && (
              <div className="space-y-3.5">
                <span className="text-[11px] font-extrabold text-rose-300 uppercase tracking-wider bg-rose-950/80 px-3 py-1 rounded-full border border-rose-500/50">
                  Bước 2/2 · Xác Nhận Nghiêm Ngặt
                </span>
                <h4 className="text-base sm:text-lg font-extrabold text-white">
                  Bạn có thực sự chắc chắn không?
                </h4>
                <p className="text-xs text-rose-200 leading-relaxed font-medium">
                  Dữ liệu sau khi xóa sẽ <strong>KHÔNG THỂ PHỤC HỒI</strong>. Để phòng ngừa xóa nhầm, hãy nhập chính xác chữ <strong>XOA</strong> vào ô bên dưới:
                </p>

                {/* REQUIREMENT: TYPE "XOA" */}
                <div className="space-y-1 pt-1">
                  <input
                    type="text"
                    value={confirmXoaText}
                    onChange={e => setConfirmXoaText(e.target.value.toUpperCase())}
                    placeholder="Gõ XOA để mở khóa..."
                    className="w-full px-4 py-3 rounded-xl bg-[#090C1A] border-2 border-rose-500/60 text-center font-extrabold text-sm text-rose-300 placeholder-rose-400/40 uppercase tracking-widest focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/40"
                    maxLength={10}
                    autoFocus
                  />
                  {confirmXoaText.trim().toUpperCase() !== 'XOA' && (
                    <span className="text-[11px] text-rose-300/80 block text-center">
                      (Nút xác nhận sẽ mở khóa khi bạn nhập đúng &ldquo;XOA&rdquo;)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setResetModalStep(0);
                      setConfirmXoaText('');
                    }}
                    className="flex-1 min-h-[44px] py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-[#E2E8F0]"
                  >
                    Giữ lại dữ liệu
                  </button>
                  <button
                    type="button"
                    disabled={confirmXoaText.trim().toUpperCase() !== 'XOA'}
                    onClick={() => {
                      resetAllData();
                      setResetModalStep(0);
                      setConfirmXoaText('');
                      sound.playChime(420);
                      if (onClose) onClose();
                    }}
                    className="flex-1 min-h-[44px] py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:bg-rose-950/60 disabled:text-rose-400/40 disabled:cursor-not-allowed text-white font-extrabold text-xs shadow-xl active:scale-95 transition-all"
                  >
                    Xác nhận xóa vĩnh viễn
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* KINTSUGI ITEM RENAME MODAL */}
      {editingKintsugiItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in text-left">
          <div className="w-full max-w-sm rounded-3xl bg-[#11152A] border border-amber-400/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <h4 className="text-sm font-extrabold text-white">Đổi tên kỷ vật hàn gắn</h4>
              </div>
              <button
                type="button"
                onClick={() => setEditingKintsugiItem(null)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#B9B5C8] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="py-2 flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-[#090C1A] border border-amber-400/20 shrink-0">
                <KintsugiObjectGraphic
                  objectType={editingKintsugiItem.objectType}
                  repairProgress={100}
                  size="sm"
                  showGlow={false}
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-amber-300 font-bold block">{editingKintsugiItem.moodLabelVi}</span>
                <span className="text-xs text-[#CBD5E1] block truncate">{editingKintsugiItem.dateFormatted}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#F5F2FA] uppercase tracking-wider block">
                Tên hiển thị mới:
              </label>
              <input
                type="text"
                value={newKintsugiName}
                onChange={e => setNewKintsugiName(e.target.value)}
                placeholder="Nhập tên kỷ vật..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#090C1A] border border-amber-400/40 text-xs font-bold text-white focus:outline-none focus:border-amber-300"
                maxLength={40}
                autoFocus
              />
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setEditingKintsugiItem(null)}
                className="flex-1 min-h-[42px] py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-[#E2E8F0]"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={!newKintsugiName.trim()}
                onClick={() => {
                  renameKintsugiItem(editingKintsugiItem.id, newKintsugiName.trim());
                  setEditingKintsugiItem(null);
                  setNewKintsugiName('');
                }}
                className="flex-1 min-h-[42px] py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 disabled:opacity-50 text-[#0D1020] font-extrabold text-xs shadow-md active:scale-95"
              >
                Lưu tên mới ✨
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION FOR RESET ONBOARDING */}
      {showOnboardingResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-[#11152A] border border-white/15 p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#B9A9E8]/15 border border-[#B9A9E8]/30 flex items-center justify-center mx-auto text-[#B9A9E8]">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-base font-bold text-[#F5F2FA] font-display">
                Xác nhận đặt lại
              </h4>
              <p className="text-sm text-[#D4CBE5] leading-relaxed font-medium">
                Bạn có muốn bắt đầu lại trải nghiệm từ đầu không?
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowOnboardingResetConfirm(false)}
                className="flex-1 min-h-[44px] py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-[#B9B5C8] transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowOnboardingResetConfirm(false);
                  resetOnboarding();
                  if (onClose) onClose();
                }}
                className="flex-1 min-h-[44px] py-2.5 rounded-xl bg-gradient-to-r from-[#B9A9E8] to-[#A8D2C4] hover:opacity-95 text-xs font-bold text-[#0D0F1D] shadow-lg transition-transform active:scale-95"
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
