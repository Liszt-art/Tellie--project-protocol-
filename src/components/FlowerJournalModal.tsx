import React, { useState } from 'react';
import { X, Calendar, Sparkles, Check, ArrowDown } from 'lucide-react';
import { GardenPlant } from '../types';
import { useApp } from '../context/AppContext';
import { PlantGraphic, normalizeStage } from './PlantGraphic';
import { sound } from '../utils/audio';

interface FlowerJournalModalProps {
  plant: GardenPlant | null;
  onClose: () => void;
}

interface StageStep {
  key: 'seed' | 'sprout' | 'sapling' | 'growing' | 'mature' | 'special';
  label: string;
  description: string;
}

const STAGES: StageStep[] = [
  { key: 'seed', label: 'Hạt giống', description: 'Hạt mầm nhỏ bé nằm yên ả trong lòng đất ẩm' },
  { key: 'sprout', label: 'Mầm non', description: 'Mầm xanh hé nhú lên đón nhận sương đêm' },
  { key: 'sapling', label: 'Cây con', description: 'Đâm chồi những chiếc lá non đầu tiên kiên cường' },
  { key: 'growing', label: 'Cây đang lớn', description: 'Vươn cao rõ nét với nhiều tầng lá xanh tươi' },
  { key: 'mature', label: 'Cây trưởng thành', description: 'Tán cây sum suê đong đầy kỷ niệm năm tháng' },
  { key: 'special', label: 'Cột mốc đặc biệt', description: 'Tỏa ánh sáng diệu kỳ vĩnh hằng trong tâm hồn' }
];

export const FlowerJournalModal: React.FC<FlowerJournalModalProps> = ({ plant, onClose }) => {
  const { nurturePlant, userSpirit } = useApp();
  const [isNurturing, setIsNurturing] = useState(false);
  const [showSparks, setShowSparks] = useState(false);

  if (!plant) return null;

  const currentNormStage = normalizeStage(plant.currentStage);
  const currentStageIndex = STAGES.findIndex(s => s.key === currentNormStage);
  const isMaxStage = currentStageIndex >= STAGES.length - 1;
  const spiritName = userSpirit?.customName || 'Hilulu';

  // Growth Interaction: Nuôi lớn
  const handleNuoiLon = () => {
    if (isMaxStage || isNurturing) return;

    setIsNurturing(true);
    setShowSparks(true);
    sound.playChime(680);

    setTimeout(() => {
      nurturePlant(plant.id);
      sound.playChime(820);
    }, 400);

    setTimeout(() => {
      setIsNurturing(false);
    }, 1100);

    setTimeout(() => {
      setShowSparks(false);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0A0D1B]/95 backdrop-blur-2xl overflow-y-auto">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-5 sm:p-7 border border-[#A8D2C4]/30 shadow-2xl my-auto text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Đóng nhật ký"
          className="absolute top-4 right-4 text-[#858198] hover:text-[#F5F2FA] w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header: Nhật ký của một mầm sống */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#171A35] border border-[#A8D2C4]/30 text-[#A8D2C4] text-[11px] font-bold tracking-wide mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KỶ NIỆM ĐANG LỚN LÊN</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#F5F2FA] font-display">
            Nhật ký của một mầm sống
          </h2>
          <p className="text-xs text-[#B9B5C8] mt-0.5">
            {plant.plantNameVi || plant.flowerNameVi || 'Mầm cây an yên'} · {plant.category}
          </p>
        </div>

        {/* HERO VISUAL: Plant Showcase with Soil Glow, Particles, and Growth Animation */}
        <div
          className="relative h-48 sm:h-52 rounded-2xl flex flex-col items-center justify-center overflow-hidden mb-4 border border-white/10 transition-all duration-700 bg-gradient-to-b from-[#11152A] via-[#141B33] to-[#0D1220]"
        >
          {/* Subtle Ambient Moonlight Bloom */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              background: `radial-gradient(circle at 50% 40%, ${plant.color}35 0%, transparent 75%)`
            }}
          />

          {/* Animated Soil Glow when Nuôi Lớn is active */}
          <div
            className={`absolute bottom-4 w-40 h-10 rounded-full transition-all duration-700 pointer-events-none ${
              isNurturing
                ? 'bg-[#A8D2C4]/60 blur-xl scale-125 animate-soil-glow'
                : 'bg-[#A8D2C4]/15 blur-lg scale-100'
            }`}
          />

          {/* Floating Stardust / Firefly Sparks */}
          {showSparks && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <span className="absolute bottom-10 left-1/4 text-sm text-[#FFFCE8] animate-ping">✧</span>
              <span className="absolute bottom-16 right-1/4 text-sm text-[#A8D2C4] animate-pulse">✦</span>
              <span className="absolute bottom-24 left-1/3 text-xs text-[#F4EEDC] animate-ping">⋆</span>
              <span className="absolute bottom-20 right-1/3 text-xs text-[#B9A9E8] animate-pulse">✧</span>
              <span className="absolute bottom-8 left-1/2 text-base text-[#91B8E8] animate-ping">✦</span>
            </div>
          )}

          {/* Subtle Background Stars */}
          <div className="absolute top-4 left-6 text-xs text-[#FFFCE8] opacity-50 animate-pulse pointer-events-none">✧</div>
          <div className="absolute top-6 right-8 text-xs text-[#A8D2C4] opacity-60 animate-ping pointer-events-none">✦</div>

          {/* Plant Graphic with visible unfolding / growing transition */}
          <div
            className={`transition-all duration-500 transform ${
              isNurturing ? 'scale-110 filter drop-shadow(0 0 16px rgba(168,210,196,0.8)) animate-growth' : 'scale-100'
            }`}
          >
            <PlantGraphic
              stage={plant.currentStage}
              plantType={plant.plantType || 'leafy'}
              color={plant.color}
              size="hero"
              animate={true}
            />
          </div>

          {/* Current Stage Badge */}
          <div className="absolute bottom-2 inset-x-0 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D1020]/80 border border-white/10 text-xs font-bold text-[#F5F2FA] backdrop-blur-md font-display shadow-md">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: plant.color }} />
              <span>Giai đoạn hiện tại: {STAGES[currentStageIndex]?.label}</span>
            </span>
          </div>
        </div>

        {/* Growth Interaction Button: Nuôi lớn */}
        <div className="mb-4">
          {!isMaxStage ? (
            <button
              onClick={handleNuoiLon}
              disabled={isNurturing}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#A8D2C4] via-[#91B8E8] to-[#B9A9E8] text-[#0D1020] text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-[#A8D2C4]/25 hover:opacity-95 active:scale-95 transition-all group"
            >
              <Sparkles className="w-4 h-4 text-[#0D1020] group-hover:rotate-12 transition-transform" />
              <span>{isNurturing ? 'Đang lớn dần...' : 'Nuôi lớn'}</span>
              <span className="text-xs font-bold opacity-80">
                (Lên {STAGES[currentStageIndex + 1]?.label})
              </span>
            </button>
          ) : (
            <div className="p-3 rounded-2xl bg-[#A8D2C4]/15 border border-[#A8D2C4]/30 text-center">
              <span className="text-xs text-[#F4EEDC] font-semibold flex items-center justify-center gap-1.5">
                <span>✨</span>
                <span>Kỷ niệm này đã trở thành Cột mốc đặc biệt tỏa sáng vĩnh cửu.</span>
              </span>
            </div>
          )}
        </div>

        {/* Memory Details: Title, Note, Date */}
        <div className="space-y-2.5 p-3.5 rounded-2xl bg-[#11152A]/90 border border-white/5 text-xs mb-4">
          <div>
            <span className="text-[10px] text-[#858198] font-bold uppercase tracking-wider block">
              Điều bạn đã lưu giữ
            </span>
            <h3 className="text-sm font-extrabold text-[#F5F2FA] mt-0.5 font-display">
              {plant.title}
            </h3>
          </div>

          <div>
            <span className="text-[10px] text-[#858198] font-bold uppercase tracking-wider block">
              Ý nghĩa gửi gắm
            </span>
            <p className="text-xs text-[#B9B5C8] mt-0.5 leading-relaxed italic">
              "{plant.note}"
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-[#858198] pt-1.5 border-t border-white/5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Ngày gieo mầm: {new Date(plant.plantedAt).toLocaleDateString('vi-VN')}</span>
          </div>
        </div>

        {/* VISUAL GROWTH TIMELINE
            Hạt giống ↓ Mầm non ↓ Cây con ↓ Cây đang lớn ↓ Cây trưởng thành ↓ Cột mốc đặc biệt
            Show a small visual plant at every stage and clearly highlight the current stage!
        */}
        <div className="pt-2 border-t border-white/10">
          <span className="text-[11px] font-bold text-[#858198] uppercase tracking-wider block mb-2.5">
            Hành trình lớn lên của mầm sống
          </span>

          <div className="space-y-1.5">
            {STAGES.map((s, idx) => {
              const isCurrent = s.key === currentNormStage;
              const isPassed = idx < currentStageIndex;
              const isFuture = idx > currentStageIndex;

              return (
                <React.Fragment key={s.key}>
                  <div
                    className={`flex items-center gap-3 p-2.5 rounded-2xl transition-all ${
                      isCurrent
                        ? 'bg-[#A8D2C4]/20 border border-[#A8D2C4] shadow-lg shadow-[#A8D2C4]/20 ring-1 ring-[#A8D2C4]/40 scale-[1.02]'
                        : isPassed
                        ? 'bg-white/5 border border-white/5 opacity-80'
                        : 'opacity-40 border border-transparent'
                    }`}
                  >
                    {/* Small visual plant at every stage */}
                    <div className="w-9 h-9 flex items-center justify-center shrink-0 rounded-xl bg-[#0D1020]/60 border border-white/5">
                      <PlantGraphic
                        stage={s.key}
                        plantType={plant.plantType || 'leafy'}
                        color={plant.color}
                        size="sm"
                        animate={isCurrent}
                      />
                    </div>

                    {/* Stage Label & Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold font-display ${
                            isCurrent ? 'text-[#F5F2FA]' : isPassed ? 'text-[#B9B5C8]' : 'text-[#858198]'
                          }`}
                        >
                          {s.label}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] text-[#0D1020] bg-[#A8D2C4] px-2 py-0.2 rounded-full font-extrabold uppercase">
                            Hiện tại
                          </span>
                        )}
                        {isPassed && (
                          <Check className="w-3.5 h-3.5 text-[#A8D2C4] ml-auto shrink-0" />
                        )}
                      </div>
                      <p className="text-[10px] text-[#858198] truncate mt-0.5">
                        {s.description}
                      </p>
                    </div>
                  </div>

                  {/* Connecting Arrow ↓ between stages */}
                  {idx < STAGES.length - 1 && (
                    <div className="flex justify-center my-0.5">
                      <ArrowDown
                        className={`w-3.5 h-3.5 ${
                          idx < currentStageIndex ? 'text-[#A8D2C4]' : 'text-white/20'
                        }`}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
