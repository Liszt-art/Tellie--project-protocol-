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
import { MoodEntry } from '../types';
import { sound } from '../utils/audio';

interface ProfileViewProps {
  onClose?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onClose }) => {
  const {
    userSpirit,
    moodHistory,
    posts,
    burnedPapers,
    openModal,
    resetAllData,
    resetOnboarding,
    userNickname,
    setUserNickname
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'timeline' | 'private' | 'settings'>('timeline');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempNickname, setTempNickname] = useState(userNickname || '');

  // Password-protected Private Memories state
  const [isPrivateUnlocked, setIsPrivateUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Strict 2-Step Confirmation for Reset LocalStorage
  const [resetModalStep, setResetModalStep] = useState<0 | 1 | 2>(0);

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
      {/* 1. TOP HEADER WITH BACK BUTTON */}
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

        <span className="text-xs font-extrabold text-[#A8D2C4] uppercase tracking-wider bg-[#A8D2C4]/15 px-3 py-1 rounded-full border border-[#A8D2C4]/25">
          Hồ Sơ Cá Nhân
        </span>
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

      {/* 3. PROFILE SUB-NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'timeline', label: 'Biểu đồ cảm xúc (Mood Board)', icon: TrendingUp },
          { id: 'private', label: 'Ký ức riêng tư', icon: Lock },
          { id: 'settings', label: 'Cài đặt & Dữ liệu', icon: Settings }
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
              className={`min-h-[42px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-[#242347] border border-[#B9A9E8] text-white shadow-md'
                  : 'text-[#E2E8F0] hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          SECTION A: MOOD BOARD CHARTS & LINE GRAPH
      ========================================================================= */}
      {activeSubTab === 'timeline' && (() => {
        const MOOD_VALENCE: Record<string, number> = {
          hopeful: 5,
          grateful: 5,
          calm: 4,
          tender: 4,
          lost: 3,
          anxious: 2,
          heavy: 2,
          exhausted: 1
        };

        const recentEntriesChronological = [...moodHistory.slice(0, 8)].reverse();
        const svgW = 460;
        const svgH = 140;
        const padX = 35;
        const padY = 22;

        const points = recentEntriesChronological.map((entry, idx) => {
          const x = padX + (idx / Math.max(1, recentEntriesChronological.length - 1)) * (svgW - padX * 2);
          const valence = MOOD_VALENCE[entry.moodId] || 3;
          const y = padY + (1 - (valence - 1) / 4) * (svgH - padY * 2);
          return { x, y, entry, valence };
        });

        const pathD = points.reduce((acc, pt, i, arr) => {
          if (i === 0) return `M ${pt.x} ${pt.y}`;
          const prev = arr[i - 1];
          const cx = (prev.x + pt.x) / 2;
          return `${acc} C ${cx} ${prev.y}, ${cx} ${pt.y}, ${pt.x} ${pt.y}`;
        }, '');

        const areaD = points.length > 0
          ? `${pathD} L ${points[points.length - 1].x} ${svgH - 8} L ${points[0].x} ${svgH - 8} Z`
          : '';

        return (
          <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/15 space-y-6 shadow-xl">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#FFFFFF] font-display flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#A8D2C4]" />
                <span>Biểu Đồ Theo Dõi Cảm Xúc Theo Thời Gian</span>
              </h3>
              <p className="text-xs text-[#E2E8F0] mt-1 leading-relaxed">
                Biểu đồ đường cong ghi lại nhịp điệu biến chuyển của tâm tư để bạn thấu hiểu chính mình.
              </p>
            </div>

            {/* SVG Line Graph */}
            <div className="rounded-2xl bg-[#090C19]/90 border border-white/10 p-4 overflow-x-auto">
              <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-36 overflow-visible">
                <defs>
                  <linearGradient id="profileAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#B9A9E8" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#A8D2C4" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="profileLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#B9A9E8" />
                    <stop offset="50%" stopColor="#91B8E8" />
                    <stop offset="100%" stopColor="#A8D2C4" />
                  </linearGradient>
                </defs>

                {/* Horizontal reference grids */}
                <line x1={padX} y1={padY} x2={svgW - padX} y2={padY} stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                <line x1={padX} y1={svgH / 2} x2={svgW - padX} y2={svgH / 2} stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                <line x1={padX} y1={svgH - padY} x2={svgW - padX} y2={svgH - padY} stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />

                {/* Shaded Area & Curved Line */}
                {areaD && <path d={areaD} fill="url(#profileAreaGrad)" />}
                {pathD && <path d={pathD} fill="none" stroke="url(#profileLineGrad)" strokeWidth="3" strokeLinecap="round" />}

                {/* Mood Points */}
                {points.map((pt, idx) => {
                  const moodMeta = getMoodById(pt.entry.moodId);
                  return (
                    <g key={idx} className="cursor-pointer">
                      <circle cx={pt.x} cy={pt.y} r="8" fill="#171A35" stroke={moodMeta.color} strokeWidth="2.5" />
                      <circle cx={pt.x} cy={pt.y} r="3" fill="#FFFFFF" />
                      <text x={pt.x} y={svgH - 2} textAnchor="middle" fontSize="9" fill="#CBD5E1">
                        {new Date(pt.entry.timestamp).getDate()}/{new Date(pt.entry.timestamp).getMonth() + 1}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Mood Legend Grid */}
            <div className="grid grid-cols-4 gap-2 text-xs">
              {MOODS_LIST.map(m => (
                <div key={m.id} className="p-2 rounded-xl bg-[#11152A] border border-white/5 flex items-center gap-2">
                  <span className="text-base">{m.icon}</span>
                  <span className="text-[#F1F5F9] font-medium truncate">{m.labelVi}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* =========================================================================
          SECTION B: PASSWORD-PROTECTED PRIVATE MEMORIES
      ========================================================================= */}
      {activeSubTab === 'private' && (
        <div className="glass-panel rounded-3xl p-6 border border-white/15 space-y-5 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#FFFFFF] font-display flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#A8D2C4]" />
                <span>Ký Ức Riêng Tư (Được Khóa Mật Khẩu)</span>
              </h3>
              <p className="text-xs text-[#E2E8F0] mt-1">
                Không gian bảo mật tuyệt đối cho những trăn trở bạn chỉ muốn giữ cho riêng mình.
              </p>
            </div>
            {isPrivateUnlocked && (
              <button
                type="button"
                onClick={() => setIsPrivateUnlocked(false)}
                className="text-xs text-[#CBD5E1] hover:text-white px-3 py-1.5 rounded-xl bg-white/5 border border-white/10"
              >
                Khóa lại 🔒
              </button>
            )}
          </div>

          {/* LOCKED STATE: PIN INPUT REQUIRED */}
          {!isPrivateUnlocked ? (
            <div className="py-8 max-w-sm mx-auto text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#B9A9E8]/20 border border-[#B9A9E8]/40 flex items-center justify-center mx-auto text-[#B9A9E8] shadow-inner">
                <KeyRound className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-base font-bold text-[#F5F2FA]">
                  Nhập mã PIN để mở khóa
                </h4>
                <p className="text-xs text-[#CBD5E1] mt-1">
                  Mã PIN bảo vệ góc tâm sự cá nhân (Gợi ý mã thử nghiệm: <strong>1234</strong>)
                </p>
              </div>

              <form onSubmit={handleUnlockPrivate} className="space-y-3">
                <input
                  type="password"
                  value={pinInput}
                  onChange={e => setPinInput(e.target.value)}
                  placeholder="Nhập mã PIN 4 số"
                  maxLength={6}
                  className="w-full text-center tracking-[8px] text-lg px-4 py-3 rounded-2xl bg-[#11152A] border border-white/20 text-white focus:outline-none focus:border-[#B9A9E8]"
                />

                {pinError && (
                  <p className="text-xs text-rose-300 font-semibold">{pinError}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#B9A9E8] to-[#A8D2C4] text-[#0D0F1D] font-bold text-xs tracking-wide shadow-md active:scale-95 transition-all"
                >
                  Mở khóa ký ức
                </button>
              </form>
            </div>
          ) : (
            /* UNLOCKED STATE: SHOW PRIVATE POSTS & BURNED PAPERS */
            <div className="space-y-4 animate-fade-in">
              {privatePosts.length === 0 && burnedPapers.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#CBD5E1]">
                  Chưa có dòng ký ức riêng tư nào. Khi viết tâm sự bạn có thể chọn "Lưu riêng tư".
                </div>
              ) : (
                <div className="space-y-3">
                  {privatePosts.map(p => (
                    <div key={p.id} className="p-4 rounded-2xl bg-[#11152A] border border-white/10 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#FFFFFF] text-sm">{p.title}</span>
                        <span className="text-[11px] text-[#A8D2C4]">
                          {new Date(p.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <p className="text-xs text-[#E2E8F0] leading-relaxed whitespace-pre-line">{p.content}</p>
                    </div>
                  ))}

                  {burnedPapers.map(b => (
                    <div key={b.id} className="p-4 rounded-2xl bg-[#171A35] border border-orange-500/30 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-orange-300 text-xs">🔥 {b.title || 'Áp lực đã buông bỏ'}</span>
                        <span className="text-[11px] text-[#CBD5E1]">
                          {new Date(b.burnedAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <p className="text-xs text-[#E2E8F0] italic">"{b.content}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SECTION C: SETTINGS & STRICT 2-STEP CONFIRMATION FOR RESET LOCALSTORAGE
      ========================================================================= */}
      {activeSubTab === 'settings' && (
        <div className="glass-panel rounded-3xl p-6 border border-white/15 space-y-6 shadow-xl">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#FFFFFF] font-display">
              Cài Đặt & Dữ Liệu Thiết Bị
            </h3>
            <p className="text-xs text-[#E2E8F0] mt-1">
              Quản lý dữ liệu lưu trữ trên trình duyệt của bạn một cách an toàn.
            </p>
          </div>

          <div className="space-y-3 pt-2 border-t border-white/10">
            <span className="text-xs font-bold text-[#F5F2FA] uppercase tracking-wider block">
              Dọn dẹp và đặt lại
            </span>

            {/* RESET LOCALSTORAGE BUTTON (TRIGGERS STRICT 2-STEP PROMPT) */}
            <button
              type="button"
              onClick={() => {
                sound.playChime(480);
                setResetModalStep(1);
              }}
              className="w-full min-h-[48px] py-3 px-4 rounded-2xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/40 text-rose-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <RotateCcw className="w-4 h-4 text-rose-400" />
              <span>Đặt lại dữ liệu ứng dụng (Reset LocalStorage)</span>
            </button>
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
                    onClick={() => setResetModalStep(0)}
                    className="flex-1 min-h-[44px] py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-[#E2E8F0]"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playChime(520);
                      setResetModalStep(2);
                    }}
                    className="flex-1 min-h-[44px] py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-[#0D1020] font-bold text-xs shadow-md"
                  >
                    Tiếp tục sang Bước 2 →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 OF 2 */}
            {resetModalStep === 2 && (
              <div className="space-y-3">
                <span className="text-[11px] font-extrabold text-rose-300 uppercase tracking-wider bg-rose-950/80 px-3 py-1 rounded-full border border-rose-500/50">
                  Bước 2/2 · Xác Nhận Lần Cuối
                </span>
                <h4 className="text-base sm:text-lg font-extrabold text-white">
                  Bạn có thực sự chắc chắn không?
                </h4>
                <p className="text-xs text-rose-200 leading-relaxed font-medium">
                  Dữ liệu sau khi xóa sẽ <strong>KHÔNG THỂ PHỤC HỒI</strong>. Bạn sẽ bắt đầu lại như một người dùng hoàn toàn mới.
                </p>

                <div className="flex items-center gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => setResetModalStep(0)}
                    className="flex-1 min-h-[44px] py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-[#E2E8F0]"
                  >
                    Giữ lại dữ liệu
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resetAllData();
                      setResetModalStep(0);
                      sound.playChime(420);
                      if (onClose) onClose();
                    }}
                    className="flex-1 min-h-[44px] py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-xl active:scale-95"
                  >
                    Xác nhận xóa vĩnh viễn
                  </button>
                </div>
              </div>
            )}
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
