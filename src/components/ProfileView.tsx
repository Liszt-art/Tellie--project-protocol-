import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  Lock,
  Edit3,
  RotateCcw,
  Check,
  ChevronRight,
  TrendingUp,
  Settings,
  Info,
  Heart
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getSpiritById } from '../data/spirits';
import { MOODS_LIST, getMoodById } from '../data/moods';
import { SpiritAvatar } from './SpiritAvatar';
import { MoodEntry } from '../types';
import { sound } from '../utils/audio';

export const ProfileView: React.FC = () => {
  const {
    userSpirit,
    updateSpiritName,
    moodHistory,
    posts,
    gardenPlants,
    burnedPapers,
    openModal,
    resetAllData,
    userNickname,
    setUserNickname
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'timeline' | 'board' | 'private' | 'settings'>('timeline');
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(userSpirit?.customName || '');
  const [selectedDayMood, setSelectedDayMood] = useState<MoodEntry | null>(null);

  const currentSpiritId = userSpirit ? userSpirit.spiritId : 'fairy';
  const spiritMeta = getSpiritById(currentSpiritId);
  const spiritName = userSpirit?.customName || 'Hilulu';

  // Private posts
  const privatePosts = posts.filter(p => p.isPrivate);

  const handleSaveName = () => {
    if (!editedName.trim()) return;
    updateSpiritName(editedName.trim());
    setIsEditingName(false);
  };

  const daysInMonth = 31;
  const monthName = 'Tháng 10, 2026';

  const moodByDay = (day: number) => {
    return moodHistory.find(m => {
      const d = new Date(m.timestamp);
      return d.getDate() === day;
    });
  };

  return (
    <div className="space-y-5 text-left">
      {/* 1. TOP PROFILE SECTION — MAJOR VISUAL UPGRADE
          - Larger 3D selected Spirit
          - Custom Spirit name with inline rename
          - Soft atmospheric background & glow
          - Meaningful statistics
          - Not like a social media profile
      */}
      <section className="relative rounded-3xl p-6 border border-[#B9A9E8]/25 shadow-2xl overflow-hidden bg-gradient-to-b from-[#141836] via-[#1A1F42] to-[#10132B]">
        {/* Luminous aura behind spirit */}
        <div
          className="absolute -right-10 -top-10 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-50"
          style={{ background: spiritMeta.glowColor }}
        />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 z-10 relative">
          {/* Larger 3D Selected Spirit */}
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl bg-[#171A35]/60 border border-white/10 flex items-center justify-center p-2 shrink-0 shadow-2xl glow-lavender">
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

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-bold text-[#858198] tracking-wider uppercase">
                {userNickname}
              </span>
              <span className="text-[10px] text-[#A8D2C4] bg-[#A8D2C4]/15 border border-[#A8D2C4]/25 px-2.5 py-0.5 rounded-full font-semibold">
                Đồng hành thân thiết
              </span>
            </div>

            {/* Custom Spirit Name Display / Editing */}
            <div className="mt-1 flex items-center justify-center sm:justify-start gap-2">
              {isEditingName ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={editedName}
                    onChange={e => setEditedName(e.target.value)}
                    className="bg-[#11152A] border border-[#B9A9E8] rounded-xl px-3 py-1 text-sm font-bold text-[#F5F2FA] focus:outline-none"
                    maxLength={20}
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-1.5 bg-[#B9A9E8] text-[#0D1020] rounded-xl"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F2FA] font-display">
                    {spiritName}
                  </h2>
                  <button
                    onClick={() => {
                      setEditedName(spiritName);
                      setIsEditingName(true);
                    }}
                    className="text-[#858198] hover:text-[#B9A9E8] transition-colors p-1"
                    title="Đổi tên tinh linh"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            <p className="text-xs text-[#B9B5C8] mt-0.5">
              {spiritMeta.speciesVi} · {spiritMeta.titleVi} · {spiritMeta.elementVi}
            </p>

            <button
              onClick={() => openModal('spiritSelect')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B9A9E8] hover:underline mt-2.5"
            >
              <span>Chọn hoặc đổi tinh linh khác</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Meaningful Emotional Wellness Statistics */}
        <div className="grid grid-cols-3 gap-2.5 mt-5 pt-5 border-t border-white/10 text-center">
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-xl font-extrabold text-[#F5F2FA] font-display">
              {moodHistory.length}
            </span>
            <span className="text-[10px] font-semibold text-[#858198] block mt-0.5">Khoảnh khắc soi chiếu</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-xl font-extrabold text-[#A8D2C4] font-display">
              {gardenPlants.length}
            </span>
            <span className="text-[10px] font-semibold text-[#858198] block mt-0.5">Kỷ niệm đã ươm mầm</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-xl font-extrabold text-[#DFAFC8] font-display">
              {burnedPapers.length}
            </span>
            <span className="text-[10px] font-semibold text-[#858198] block mt-0.5">Gánh nặng đã buông</span>
          </div>
        </div>
      </section>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {[
          { id: 'timeline', label: 'Dòng Chảy Cảm Xúc', icon: TrendingUp },
          { id: 'board', label: 'Mood Board', icon: Calendar },
          { id: 'private', label: 'Ký ức riêng tư', icon: Lock },
          { id: 'settings', label: 'Cài đặt', icon: Settings }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id as any);
                sound.playChime(500);
              }}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                activeSubTab === tab.id
                  ? 'bg-[#242347] border-[#B9A9E8] text-[#F5F2FA] font-bold shadow-md'
                  : 'bg-[#11152A] border-white/5 text-[#858198] hover:text-[#B9B5C8]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. DÒNG CHẢY CẢM XÚC: Visual Emotional Timeline & Line Graph */}
      {activeSubTab === 'timeline' && (() => {
        // Emotional valence scale 1-5
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
          <div className="glass-panel rounded-3xl p-5 border border-white/10 space-y-5 shadow-xl">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#F5F2FA] font-display flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#A8D2C4]" />
                    <span>Biểu Đồ & Dòng Chảy Cảm Xúc</span>
                  </h3>
                  <p className="text-xs text-[#B9B5C8] mt-0.5">
                    Theo dõi nhịp điệu và sự chuyển hóa cảm xúc theo dòng thời gian.
                  </p>
                </div>
                <span className="text-[10px] text-[#A8D2C4] bg-[#A8D2C4]/15 border border-[#A8D2C4]/25 px-2.5 py-1 rounded-full font-semibold">
                  8 ghi nhận gần nhất
                </span>
              </div>
            </div>

            {/* SOFT LINE GRAPH COMPONENT */}
            <div className="relative rounded-2xl p-3.5 bg-gradient-to-b from-[#11152A]/90 to-[#0D1020]/90 border border-white/10 shadow-inner overflow-hidden">
              <div className="flex items-center justify-between text-[10px] font-semibold text-[#858198] mb-1 px-1">
                <span>Tươi sáng / Nhẹ nhõm</span>
                <span>Bình ổn</span>
                <span>Cần vỗ về / Nghỉ ngơi</span>
              </div>

              <div className="w-full overflow-x-auto">
                <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-36 overflow-visible">
                  <defs>
                    {/* Area Gradient Under Curve */}
                    <linearGradient id="emotionAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#B9A9E8" stopOpacity="0.38" />
                      <stop offset="60%" stopColor="#91B8E8" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#0D1020" stopOpacity="0.0" />
                    </linearGradient>

                    {/* Smooth Neon Line Gradient */}
                    <linearGradient id="emotionLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#A8D2C4" />
                      <stop offset="50%" stopColor="#B9A9E8" />
                      <stop offset="100%" stopColor="#DFAFC8" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Guide Grid Lines */}
                  <line x1={padX} y1={padY} x2={svgW - padX} y2={padY} stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                  <line x1={padX} y1={svgH / 2} x2={svgW - padX} y2={svgH / 2} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                  <line x1={padX} y1={svgH - padY} x2={svgW - padX} y2={svgH - padY} stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />

                  {/* Gradient Fill Under Curve */}
                  {areaD && (
                    <path d={areaD} fill="url(#emotionAreaGrad)" />
                  )}

                  {/* Curved Emotion Line */}
                  {pathD && (
                    <path
                      d={pathD}
                      fill="none"
                      stroke="url(#emotionLineGrad)"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="drop-shadow(0 2px 8px rgba(185,169,232,0.5))"
                    />
                  )}

                  {/* Circular Node Points with Mood Icons */}
                  {points.map((pt, idx) => {
                    const m = getMoodById(pt.entry.moodId);
                    return (
                      <g key={pt.entry.id || idx} className="cursor-pointer group">
                        {/* Glow halo */}
                        <circle cx={pt.x} cy={pt.y} r="8" fill={m.color} opacity="0.25" className="animate-pulse" />
                        {/* White rim border */}
                        <circle cx={pt.x} cy={pt.y} r="5" fill="#0D1020" stroke={m.color} strokeWidth="2.5" />
                        <circle cx={pt.x} cy={pt.y} r="2" fill="#FFFFFF" />

                        {/* Date label at bottom */}
                        <text
                          x={pt.x}
                          y={svgH - 2}
                          textAnchor="middle"
                          fill="#858198"
                          fontSize="9"
                          fontWeight="600"
                        >
                          {new Date(pt.entry.timestamp).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Gentle takeaway summary */}
              <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-[#B9B5C8]">
                <span className="italic text-[#A8D2C4]">
                  ✦ Cảm xúc như những gợn sóng biển đêm, tự nhiên lên xuống và luôn có điểm cân bằng.
                </span>
                <span className="text-[10px] text-[#858198]">
                  Cập nhật: Hôm nay
                </span>
              </div>
            </div>

            {/* TIMELINE LIST ENTRIES */}
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[#B9A9E8] before:via-[#91B8E8] before:to-transparent">
              {moodHistory.slice(0, 8).map(entry => {
                const m = getMoodById(entry.moodId);
                return (
                  <div key={entry.id} className="relative group">
                    <div
                      className="absolute -left-6 top-1.5 w-4 h-4 rounded-full border-2 border-[#0D1020] flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: m.color }}
                    />

                    <div className="p-3.5 rounded-2xl bg-[#11152A] border border-white/5 text-xs space-y-1 hover:border-white/20 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">{m.icon}</span>
                          <span className="font-bold text-[#F5F2FA]">{m.labelVi}</span>
                          {entry.isNightRitual && (
                            <span className="text-[10px] text-[#B9A9E8] bg-[#B9A9E8]/10 px-1.5 py-0.5 rounded-md font-semibold">
                              Mood Night
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#858198]">
                          {new Date(entry.timestamp).toLocaleDateString('vi-VN')} {new Date(entry.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {entry.note ? (
                        <p className="text-[#B9B5C8] text-xs leading-relaxed italic pl-1">
                          "{entry.note}"
                        </p>
                      ) : (
                        <p className="text-[#858198] text-[11px] pl-1">
                          {m.quoteVi}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* 3. MOOD BOARD: Monthly Visual Calendar */}
      {activeSubTab === 'board' && (
        <div className="glass-panel rounded-3xl p-5 border border-white/10 space-y-4 shadow-xl">
          <div>
            <h3 className="text-base font-bold text-[#F5F2FA] font-display">
              Mood Board · {monthName}
            </h3>
            <p className="text-xs text-[#B9B5C8] mt-0.5">
              Bản đồ bầu trời cảm xúc trong tháng của bạn.
            </p>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
            {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(d => (
              <span key={d} className="text-[11px] font-bold text-[#858198] py-1">
                {d}
              </span>
            ))}

            <div /><div /><div /><div />

            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const entry = moodByDay(day);
              const m = entry ? getMoodById(entry.moodId) : null;

              return (
                <button
                  key={day}
                  onClick={() => {
                    if (entry) {
                      setSelectedDayMood(entry);
                      sound.playChime(560);
                    }
                  }}
                  className={`aspect-square rounded-xl p-1 flex flex-col items-center justify-between border transition-all ${
                    m
                      ? 'border-transparent text-[#F5F2FA] font-bold shadow-sm'
                      : 'bg-[#11152A]/50 border-white/5 text-[#858198]'
                  } ${day === 30 ? 'ring-2 ring-[#B9A9E8]' : ''}`}
                  style={{
                    backgroundColor: m ? `${m.color}35` : undefined
                  }}
                >
                  <span className="text-[10px]">{day}</span>
                  {m ? (
                    <span className="text-xs">{m.icon}</span>
                  ) : (
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Day Inspection Card */}
          {selectedDayMood && (
            <div className="p-3.5 rounded-2xl bg-[#171A35] border border-[#B9A9E8]/30 space-y-1.5 text-xs animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{getMoodById(selectedDayMood.moodId).icon}</span>
                  <span className="font-bold text-[#F5F2FA]">
                    {getMoodById(selectedDayMood.moodId).labelVi}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedDayMood(null)}
                  className="text-[11px] text-[#858198] hover:text-white"
                >
                  Đóng
                </button>
              </div>
              <p className="text-xs text-[#B9B5C8]">
                {selectedDayMood.note || 'Không có ghi chú thêm.'}
              </p>
              <span className="text-[10px] text-[#858198] block">
                Thời gian: {new Date(selectedDayMood.timestamp).toLocaleString('vi-VN')}
              </span>
            </div>
          )}

          {/* Mood Legend strictly without medical diagnosis disclaimer */}
          <div className="pt-2 border-t border-white/5">
            <span className="text-[10px] text-[#858198] uppercase tracking-wider block mb-2 font-bold">
              Bảng màu cảm xúc
            </span>
            <div className="grid grid-cols-4 gap-1.5 text-[11px]">
              {MOODS_LIST.map(mood => (
                <div key={mood.id} className="flex items-center gap-1.5 text-[#B9B5C8]">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: mood.color }} />
                  <span className="truncate">{mood.labelVi}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 rounded-xl bg-white/5 text-[11px] text-[#858198] flex items-start gap-2">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#B9A9E8]" />
              <span>
                <strong>Lưu ý:</strong> Tellie là dự án Design Thinking hỗ trợ nâng cao sức khỏe cảm xúc cho sinh viên. Biểu đồ cảm xúc này mang tính chất tự soi chiếu bản thân, không phải kết luận hoặc chẩn đoán y khoa.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. KÝ ỨC RIÊNG TƯ */}
      {activeSubTab === 'private' && (
        <div className="glass-panel rounded-3xl p-5 border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#F5F2FA] font-display">
                Góc Riêng Tư Của Bạn
              </h3>
              <p className="text-xs text-[#B9B5C8] mt-0.5">
                Các bài viết bạn đã chọn "Lưu riêng tư" và những tờ giấy buông bỏ được giữ kín.
              </p>
            </div>
            <Lock className="w-4 h-4 text-[#A8D2C4]" />
          </div>

          <div className="space-y-3">
            {privatePosts.length === 0 && burnedPapers.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#858198]">
                Chưa có ghi chú riêng tư nào. Khi viết tâm sự hoặc đốt áp lực, bạn có thể chọn "Lưu riêng tư".
              </div>
            ) : (
              <>
                {privatePosts.map(p => (
                  <div key={p.id} className="p-3.5 rounded-2xl bg-[#11152A] border border-white/10 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#F5F2FA]">{p.title}</span>
                      <span className="text-[10px] text-[#858198]">
                        {new Date(p.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <p className="text-xs text-[#B9B5C8] leading-relaxed">{p.content}</p>
                  </div>
                ))}

                {burnedPapers.map(b => (
                  <div key={b.id} className="p-3.5 rounded-2xl bg-[#171A35] border border-[#F4EEDC]/20 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#F4EEDC]">🔥 {b.title}</span>
                      <span className="text-[10px] text-[#858198]">
                        {new Date(b.burnedAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <p className="text-xs text-[#B9B5C8] italic">"{b.content}"</p>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {/* 5. CÀI ĐẶT & THIẾT LẬP */}
      {activeSubTab === 'settings' && (
        <div className="glass-panel rounded-3xl p-5 border border-white/10 space-y-4 text-xs shadow-xl">
          <div>
            <h3 className="text-base font-bold text-[#F5F2FA] font-display">
              Cài đặt & Dữ liệu
            </h3>
            <p className="text-xs text-[#B9B5C8] mt-0.5">
              Tùy chỉnh biệt danh và quản lý dữ liệu nguyên mẫu trên thiết bị của bạn.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-[#858198] uppercase tracking-wider mb-1">
                Biệt danh ẩn danh trong trường
              </label>
              <input
                type="text"
                value={userNickname}
                onChange={e => setUserNickname(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#11152A] border border-white/10 text-xs text-[#F5F2FA] focus:outline-none focus:border-[#B9A9E8]"
              />
            </div>

            <div className="pt-3 border-t border-white/5 space-y-2">
              <span className="block text-[11px] font-bold text-[#858198] uppercase tracking-wider">
                Về TELLIE Prototype
              </span>
              <p className="text-[#B9B5C8] leading-relaxed">
                Phiên bản dự án Design Thinking cho sinh viên đại học. Toàn bộ thông tin được lưu trữ cục bộ trong localStorage của trình duyệt, không chia sẻ cho bên thứ ba.
              </p>
            </div>

            <div className="pt-3 border-t border-white/5">
              <button
                onClick={() => {
                  if (confirm('Bạn có chắc chắn muốn đặt lại dữ liệu nguyên mẫu về ban đầu?')) {
                    resetAllData();
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 font-bold hover:bg-rose-900/40 transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Đặt lại toàn bộ dữ liệu mẫu</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
