import React, { useState } from 'react';
import { ArrowLeft, Plus, Sparkles, Sprout, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GardenPlant } from '../types';
import { SpiritAvatar } from './SpiritAvatar';
import { FlowerJournalModal } from './FlowerJournalModal';
import { PlantGraphic, normalizeStage } from './PlantGraphic';
import { sound } from '../utils/audio';

export const TellieGardenView: React.FC = () => {
  const { gardenPlants, userSpirit, openModal, setActiveTab, nurturePlant } = useApp();
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [nurturingPlantId, setNurturingPlantId] = useState<string | null>(null);

  // Maintain selected plant dynamically so it reacts instantly to stage updates
  const selectedPlant = gardenPlants.find(p => p.id === selectedPlantId) || null;

  const currentSpiritId = userSpirit ? userSpirit.spiritId : 'fairy';
  const spiritName = userSpirit?.customName || 'Hilulu';

  const handlePlantClick = (plant: GardenPlant) => {
    sound.playChime(640);
    setSelectedPlantId(plant.id);
  };

  const handleQuickNurture = (e: React.MouseEvent, plantId: string) => {
    e.stopPropagation();
    if (nurturingPlantId) return;

    setNurturingPlantId(plantId);
    sound.playChime(680);

    setTimeout(() => {
      nurturePlant(plantId);
      sound.playChime(820);
    }, 350);

    setTimeout(() => {
      setNurturingPlantId(null);
    }, 1000);
  };

  const getStageLabel = (stage: GardenPlant['currentStage']) => {
    const s = normalizeStage(stage);
    switch (s) {
      case 'seed': return '1. Hạt giống';
      case 'sprout': return '2. Mầm non';
      case 'sapling': return '3. Cây con';
      case 'growing': return '4. Cây đang lớn';
      case 'mature': return '5. Cây trưởng thành';
      case 'special': return '6. Cột mốc đặc biệt';
    }
  };

  return (
    <div className="space-y-4 text-left">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => {
            sound.playChime(440);
            setActiveTab('home');
          }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#171A35]/80 hover:bg-[#1E234D] border border-[#B9A9E8]/20 text-[#B9B5C8] hover:text-[#F5F2FA] text-xs font-semibold transition-all active:scale-95 group shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#B9A9E8] group-hover:-translate-x-0.5 transition-transform" />
          <span>Quay lại Trang chủ</span>
        </button>

        <span className="text-[11px] font-semibold text-[#A8D2C4] bg-[#A8D2C4]/10 px-3 py-1 rounded-full border border-[#A8D2C4]/20">
          {gardenPlants.length} mầm sống đang lớn
        </span>
      </div>

      {/* 1. GARDEN HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#171A35] border border-[#A8D2C4]/30 text-[#A8D2C4] text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KHO KỶ NIỆM BÌNH YÊN</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F2FA] font-display">
            Tellie Garden
          </h1>
          <p className="text-xs sm:text-sm text-[#B9B5C8] font-medium mt-0.5 italic">
            “Vườn của những điều bạn muốn lưu giữ.”
          </p>
        </div>

        <button
          onClick={() => openModal('gardenPlantModal')}
          className="py-2.5 px-4 rounded-2xl bg-gradient-to-r from-[#A8D2C4] via-[#91B8E8] to-[#B9A9E8] text-[#0D1020] text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-[#A8D2C4]/25 hover:opacity-95 active:scale-95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Gieo hạt mầm</span>
        </button>
      </div>

      {/* Philosophy Banner: “Một điều nhỏ mình lưu giữ đang lớn lên cùng mình.” */}
      <div className="p-3.5 rounded-2xl bg-[#11152A]/90 border border-[#A8D2C4]/20 flex items-center gap-2.5 text-xs text-[#F5F2FA] shadow-md">
        <Sprout className="w-4 h-4 text-[#A8D2C4] shrink-0" />
        <span className="italic font-medium">
          “Một điều nhỏ mình lưu giữ đang lớn lên cùng mình.”
        </span>
      </div>

      {/* 2. REAL SOFT 3D MOONLIT GARDEN ENVIRONMENT
          - Layered dark blue/lavender night sky (#0D1020, #11152A, #171A35, #242347)
          - Moonlight beam
          - Subtle mist
          - Grass, soil, stones, bushes, leaves, planting areas
          - Stars, fireflies, gentle glowing plants, soft shadows
          - Foreground, midground, and background depth
          - Selected Spirit (Hilulu) resting peacefully inside the garden
      */}
      <section className="relative w-full rounded-3xl overflow-hidden border border-[#A8D2C4]/30 bg-gradient-to-b from-[#0D1020] via-[#141A33] to-[#0E1520] p-4 sm:p-6 shadow-2xl min-h-[480px] flex flex-col justify-between">

        {/* LAYER 1: Deep Moonlit Night Sky & Lunar Aura */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-gradient-to-b from-[#91B8E8]/15 via-[#B9A9E8]/10 to-transparent rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute top-3 right-6 w-16 h-16 rounded-full bg-[#F4EEDC]/10 blur-xl pointer-events-none" />
        {/* Soft 3D Moon */}
        <div className="absolute top-5 right-7 flex items-center justify-center pointer-events-none select-none">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFFCE8] via-[#F4EEDC] to-[#D5CBAE] shadow-[0_0_24px_rgba(244,238,220,0.6)] flex items-center justify-center opacity-90">
            {/* Crater shadows */}
            <span className="w-2.5 h-2.5 rounded-full bg-[#D5CBAE]/40 absolute top-2 left-2" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#D5CBAE]/30 absolute bottom-2 right-2.5" />
          </div>
        </div>

        {/* LAYER 2: Constellations, Stardust & Drifting Fireflies */}
        <div className="absolute top-10 left-8 text-xs text-[#FFFCE8] opacity-75 animate-ping pointer-events-none">✧</div>
        <div className="absolute top-20 left-1/3 text-xs text-[#A8D2C4] opacity-80 animate-pulse pointer-events-none">✦</div>
        <div className="absolute top-32 right-24 text-xs text-[#F4EEDC] opacity-70 animate-ping pointer-events-none">⋆</div>
        <div className="absolute top-44 left-10 text-xs text-[#B9A9E8] opacity-60 animate-pulse pointer-events-none">✧</div>

        {/* Drifting Fireflies */}
        <div className="absolute bottom-36 right-16 w-2.5 h-2.5 rounded-full bg-[#E8F8B6] blur-[1px] animate-pulse pointer-events-none shadow-[0_0_12px_#E8F8B6]" />
        <div className="absolute bottom-48 left-14 w-2 h-2 rounded-full bg-[#A8D2C4] blur-[0.8px] animate-ping pointer-events-none shadow-[0_0_10px_#A8D2C4]" />
        <div className="absolute top-52 right-1/3 w-1.5 h-1.5 rounded-full bg-[#F4EEDC] blur-[0.6px] animate-pulse pointer-events-none shadow-[0_0_8px_#F4EEDC]" />

        {/* LAYER 3: Soft Midground Mist Waves */}
        <div className="absolute top-24 -left-16 w-80 h-24 bg-[#1C2344]/35 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-36 -right-12 w-80 h-28 bg-[#17223D]/30 rounded-full blur-2xl pointer-events-none" />

        {/* Top Companion Bar: Selected Spirit (Hilulu) naturally inside the Garden */}
        <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/5">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-[#0A0E22]/80 backdrop-blur-md border border-white/10 text-xs shadow-md">
            <span className="w-2 h-2 rounded-full bg-[#A8D2C4] animate-pulse" />
            <span className="text-[#F5F2FA] font-bold">
              {spiritName} đang dạo bước trong vườn
            </span>
          </div>

          {/* 3D Companion Avatar resting naturally */}
          <div className="w-16 h-16 flex items-center justify-center -my-2 drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]">
            <SpiritAvatar
              id={currentSpiritId}
              colorId={userSpirit?.colorId}
              accessory={userSpirit?.accessory}
              size="sm"
              mood="comforting"
              animate={true}
              glow={true}
              showShadow={false}
            />
          </div>
        </div>

        {/* LAYER 4: PLANTING AREAS / PLOTS SHOWCASE */}
        {gardenPlants.length === 0 ? (
          /* EXACT EMPTY STATE REQUIRED:
             “Vườn của bạn vẫn đang chờ những hạt giống đầu tiên.”
             “Trồng một điều bạn muốn lưu lại.”
             Show Hilulu/Fairy Spirit quietly beside the empty garden
          */
          <div className="my-auto text-center py-10 px-4 z-10 space-y-3.5">
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              {/* Soft moonlit empty soil mound */}
              <div className="absolute inset-0 rounded-full bg-[#A8D2C4]/10 blur-xl" />
              <div className="relative w-24 h-24 rounded-full bg-[#11152A]/90 border border-[#A8D2C4]/30 flex flex-col items-center justify-center shadow-inner">
                <PlantGraphic stage="seed" size="sm" animate={false} />
              </div>
              {/* Spirit companion beside the empty plot */}
              <div className="absolute -bottom-2 -right-4 w-12 h-12">
                <SpiritAvatar
                  id={currentSpiritId}
                  colorId={userSpirit?.colorId}
                  accessory={userSpirit?.accessory}
                  size="sm"
                  mood="comforting"
                  animate={true}
                  glow={false}
                />
              </div>
            </div>

            <h3 className="text-base font-bold text-[#F5F2FA] font-display max-w-xs mx-auto leading-snug">
              Vườn của bạn vẫn đang chờ những hạt giống đầu tiên.
            </h3>
            <p className="text-xs text-[#B9B5C8] max-w-xs mx-auto">
              Trồng một điều bạn muốn lưu lại.
            </p>

            <button
              onClick={() => openModal('gardenPlantModal')}
              className="mt-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#A8D2C4] via-[#91B8E8] to-[#B9A9E8] text-[#0D1020] text-xs font-extrabold hover:opacity-95 active:scale-95 transition-all inline-flex items-center gap-1.5 shadow-lg shadow-[#A8D2C4]/20"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Gieo hạt mầm đầu tiên</span>
            </button>
          </div>
        ) : (
          /* Real Night Garden Planting Plots Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-auto py-4 z-10">
            {gardenPlants.map(plant => {
              const isNurturing = nurturingPlantId === plant.id;
              const normStage = normalizeStage(plant.currentStage);
              const isMax = normStage === 'special';

              return (
                <div
                  key={plant.id}
                  onClick={() => handlePlantClick(plant)}
                  className="group relative flex flex-col items-center justify-between p-3 sm:p-3.5 rounded-3xl bg-[#090D1F]/60 hover:bg-[#121A33]/90 border border-white/10 hover:border-[#A8D2C4]/50 backdrop-blur-md cursor-pointer transition-all hover:scale-[1.03] active:scale-95 shadow-xl overflow-hidden"
                >
                  {/* Subtle soil plot glow */}
                  <div
                    className={`absolute bottom-10 w-24 h-6 rounded-full transition-all duration-700 pointer-events-none ${
                      isNurturing
                        ? 'bg-[#A8D2C4]/60 blur-md animate-soil-glow'
                        : 'bg-[#A8D2C4]/10 blur-sm'
                    }`}
                  />

                  {/* 3D Botanical Visual across the 6 stages */}
                  <div
                    className={`h-24 w-full flex items-center justify-center transition-all duration-500 transform ${
                      isNurturing ? 'scale-110 filter drop-shadow(0 0 12px rgba(168,210,196,0.8)) animate-growth' : 'scale-100'
                    }`}
                  >
                    <PlantGraphic
                      stage={plant.currentStage}
                      plantType={plant.plantType || 'leafy'}
                      color={plant.color}
                      size="md"
                      animate={true}
                    />
                  </div>

                  {/* Plant Information */}
                  <div className="mt-1 text-center w-full space-y-0.5">
                    <span className="text-xs font-extrabold text-[#F5F2FA] block truncate font-display">
                      {plant.title}
                    </span>
                    <span className="text-[10px] text-[#A8D2C4] font-semibold block truncate">
                      {getStageLabel(plant.currentStage)}
                    </span>
                  </div>

                  {/* Quick 'Nuôi lớn' Button on Card for easy transformation testing */}
                  {!isMax ? (
                    <button
                      onClick={(e) => handleQuickNurture(e, plant.id)}
                      disabled={isNurturing}
                      className="mt-2.5 w-full py-1.5 px-2 rounded-xl bg-[#A8D2C4]/15 hover:bg-[#A8D2C4]/30 border border-[#A8D2C4]/40 text-[#A8D2C4] text-[10px] font-bold flex items-center justify-center gap-1 transition-all active:scale-95 group/btn"
                    >
                      <Sparkles className="w-3 h-3 group-hover/btn:rotate-12 transition-transform" />
                      <span>{isNurturing ? 'Đang lớn...' : 'Nuôi lớn'}</span>
                    </button>
                  ) : (
                    <div className="mt-2.5 w-full py-1 rounded-xl bg-white/5 border border-white/5 text-[9px] text-[#F4EEDC] font-semibold text-center truncate">
                      ✨ Cột mốc đặc biệt
                    </div>
                  )}

                  {/* Category tag */}
                  <div className="absolute top-2 right-2">
                    <span className="text-[9px] text-[#858198] bg-white/5 px-1.5 py-0.5 rounded-md font-mono">
                      {plant.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* LAYER 5: Foreground Soil Bed, Moss, River Stones, Grass Blades & Leaves */}
        <div className="relative pt-2 z-10">
          <div className="h-7 w-full bg-gradient-to-r from-[#17251E] via-[#243A2F] to-[#17251E] rounded-2xl flex items-center justify-between px-4 sm:px-6 shadow-inner border border-[#2F4A3C]">
            <span className="text-xs select-none">🌿</span>
            <span className="w-4 h-2 bg-[#424A52] rounded-full opacity-60 shadow-sm" />
            <span className="text-xs select-none">🌱</span>
            <span className="w-5 h-2.5 bg-[#343D45] rounded-full opacity-70 shadow-sm" />
            <span className="text-xs select-none">🍃</span>
            <span className="w-3 h-2 bg-[#48535D] rounded-full opacity-50 shadow-sm" />
            <span className="text-xs select-none">🍀</span>
          </div>

          <div className="flex justify-between items-center text-[10px] text-[#858198] mt-2 px-1">
            <span>Chạm vào mầm cây để mở Nhật ký mầm sống</span>
            <span className="font-semibold text-[#A8D2C4]">
              {gardenPlants.length} mầm sống đang lớn lên
            </span>
          </div>
        </div>
      </section>

      {/* PLANT DETAIL MODAL: Nhật ký của một mầm sống */}
      {selectedPlant && (
        <FlowerJournalModal
          plant={selectedPlant}
          onClose={() => setSelectedPlantId(null)}
        />
      )}
    </div>
  );
};
