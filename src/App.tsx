/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, MessageSquare, Users, User, AlertCircle } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { HomeView } from './components/HomeView';
import { ListenView } from './components/ListenView';
import { ConnectView } from './components/ConnectView';
import { ProfileView } from './components/ProfileView';
import { SpiritSelectionModal } from './components/SpiritSelectionModal';
import { SosModal } from './components/SosModal';
import { PressureFurnaceModal } from './components/PressureFurnaceModal';
import { SafeSpaceModal } from './components/SafeSpaceModal';
import { MoodNightModal } from './components/MoodNightModal';
import { EnergyStationModal } from './components/EnergyStationModal';
import { WritePostModal } from './components/WritePostModal';
import { PlantMemoryModal } from './components/PlantMemoryModal';
import { TellieGardenView } from './components/TellieGardenView';
import { TellieGardenModal } from './components/TellieGardenModal';
import { sound } from './utils/audio';

function AppContent() {
  const {
    activeTab,
    setActiveTab,
    activeModal,
    openModal,
    closeModal,
    userSpirit
  } = useApp();

  const handleTabChange = (tab: any) => {
    sound.playChime(500);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#070914] text-[#F5F2FA] flex flex-col justify-between selection:bg-[#B9A9E8]/30 selection:text-white overflow-x-hidden">
      {/* =========================================================================
          HEALING STARRY NIGHT SKY (BẦU TRỜI ĐÊM ĐẦY SAO)
          Layered celestial atmosphere:
          - Deep cosmic night gradient (#060815 -> #0C1028 -> #151838)
          - Multiple layers of gentle twinkling stars & stardust
          - Soft nebulas and moonlight haze
          - 100% low-contrast so all UI text and cards remain crystal clear
      ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
        {/* Layer 1: Cosmic Night Gradient Base */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#060815] via-[#0D1129] via-50%-[#13173B] to-[#070914] opacity-95" />

        {/* Layer 2: Soft Atmospheric Nebulas & Moonlit Blooms */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[650px] h-[550px] bg-gradient-to-b from-[#B9A9E8]/10 via-[#91B8E8]/08 to-transparent rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -left-36 w-[500px] h-[500px] bg-gradient-to-tr from-[#1B234C]/40 via-[#231E48]/30 to-transparent rounded-full blur-[120px]" />
        <div className="absolute top-2/3 -right-36 w-[550px] h-[550px] bg-gradient-to-bl from-[#2A204C]/35 via-[#182042]/30 to-transparent rounded-full blur-[130px]" />

        {/* Layer 3: Whispering Night Clouds */}
        <div className="absolute top-16 left-0 right-0 h-44 bg-gradient-to-r from-transparent via-[#1B1F44]/20 to-transparent blur-3xl" />
        <div className="absolute bottom-40 left-0 right-0 h-40 bg-gradient-to-l from-transparent via-[#141C38]/25 to-transparent blur-3xl" />

        {/* Layer 4: Expansive Healing Star Field (Pinpoint Stars, Glowing Starlets & Twinkles) */}
        {/* Upper Sky Stars */}
        <div className="absolute top-8 left-12 w-1.5 h-1.5 rounded-full bg-[#FFFCE8] shadow-[0_0_8px_#FFFCE8] animate-star-twinkle" style={{ animationDuration: '4.5s', animationDelay: '0.1s' }} />
        <div className="absolute top-14 right-20 w-1 h-1 rounded-full bg-[#B9A9E8] shadow-[0_0_6px_#B9A9E8] animate-star-twinkle" style={{ animationDuration: '6s', animationDelay: '1.2s' }} />
        <div className="absolute top-24 left-1/4 w-1.5 h-1.5 rounded-full bg-[#91B8E8] shadow-[0_0_8px_#91B8E8] animate-star-twinkle" style={{ animationDuration: '5.2s', animationDelay: '2.4s' }} />
        <div className="absolute top-32 right-1/3 w-1 h-1 rounded-full bg-[#FFFDF0] animate-star-twinkle" style={{ animationDuration: '7s', animationDelay: '0.5s' }} />
        <div className="absolute top-44 left-16 w-1 h-1 rounded-full bg-[#A8D2C4] shadow-[0_0_6px_#A8D2C4] animate-star-twinkle" style={{ animationDuration: '5.8s', animationDelay: '3.1s' }} />
        <div className="absolute top-52 right-14 w-2 h-2 rounded-full bg-[#FFFEEB] shadow-[0_0_10px_#FFFEEB] animate-star-twinkle" style={{ animationDuration: '6.4s', animationDelay: '1.8s' }} />

        {/* Mid Sky Stars */}
        <div className="absolute top-[320px] left-8 w-1 h-1 rounded-full bg-[#DFAFC8] animate-star-twinkle" style={{ animationDuration: '6.2s', animationDelay: '2.0s' }} />
        <div className="absolute top-[360px] right-24 w-1.5 h-1.5 rounded-full bg-[#FFFCE8] shadow-[0_0_8px_#FFFCE8] animate-star-twinkle" style={{ animationDuration: '5.5s', animationDelay: '0.7s' }} />
        <div className="absolute top-[440px] left-1/3 w-1 h-1 rounded-full bg-[#91B8E8] animate-star-twinkle" style={{ animationDuration: '7.2s', animationDelay: '3.6s' }} />
        <div className="absolute top-[520px] right-10 w-1.5 h-1.5 rounded-full bg-[#B9A9E8] shadow-[0_0_6px_#B9A9E8] animate-star-twinkle" style={{ animationDuration: '4.8s', animationDelay: '1.5s' }} />
        <div className="absolute top-[600px] left-20 w-1 h-1 rounded-full bg-[#A8D2C4] animate-star-twinkle" style={{ animationDuration: '6.6s', animationDelay: '2.8s' }} />
        <div className="absolute top-[680px] right-1/4 w-1.5 h-1.5 rounded-full bg-[#FFFDF0] animate-star-twinkle" style={{ animationDuration: '5.0s', animationDelay: '0.2s' }} />

        {/* Lower Sky Stars */}
        <div className="absolute bottom-72 left-10 w-1 h-1 rounded-full bg-[#FFFCE8] animate-star-twinkle" style={{ animationDuration: '6.8s', animationDelay: '2.2s' }} />
        <div className="absolute bottom-52 right-16 w-1.5 h-1.5 rounded-full bg-[#91B8E8] shadow-[0_0_6px_#91B8E8] animate-star-twinkle" style={{ animationDuration: '5.4s', animationDelay: '1.0s' }} />
        <div className="absolute bottom-36 left-1/4 w-1 h-1 rounded-full bg-[#B9A9E8] animate-star-twinkle" style={{ animationDuration: '7.5s', animationDelay: '3.3s' }} />
        <div className="absolute bottom-20 right-1/3 w-1.5 h-1.5 rounded-full bg-[#FFFDF0] shadow-[0_0_8px_#FFFDF0] animate-star-twinkle" style={{ animationDuration: '4.2s', animationDelay: '0.4s' }} />

        {/* Star Sparkle Icons (✦ ✧ ⋆) Floating Peacefully */}
        <div className="absolute top-10 right-28 text-[11px] text-[#FFF9E6]/60 animate-star-twinkle" style={{ animationDuration: '7s' }}>✦</div>
        <div className="absolute top-28 left-10 text-[10px] text-[#B9A9E8]/55 animate-star-twinkle" style={{ animationDuration: '5.5s' }}>✧</div>
        <div className="absolute top-72 right-12 text-[11px] text-[#A8D2C4]/50 animate-star-twinkle" style={{ animationDuration: '8s' }}>⋆</div>
        <div className="absolute top-[480px] left-14 text-[12px] text-[#91B8E8]/50 animate-star-twinkle" style={{ animationDuration: '6.5s' }}>✧</div>
        <div className="absolute top-[720px] right-20 text-[10px] text-[#DFAFC8]/50 animate-star-twinkle" style={{ animationDuration: '7.2s' }}>✦</div>
        <div className="absolute bottom-44 left-16 text-[11px] text-[#F4EEDC]/55 animate-star-twinkle" style={{ animationDuration: '6s' }}>⋆</div>

        {/* Layer 5: Gentle Celestial Stardust Motes */}
        <div className="absolute top-1/4 left-1/2 w-1 h-1 rounded-full bg-white/35 blur-[0.4px] animate-dust-float" style={{ animationDuration: '16s', animationDelay: '0s' }} />
        <div className="absolute top-2/3 right-1/3 w-1.5 h-1.5 rounded-full bg-[#B9A9E8]/30 blur-[0.5px] animate-dust-float" style={{ animationDuration: '19s', animationDelay: '4s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 rounded-full bg-[#A8D2C4]/30 blur-[0.4px] animate-dust-float" style={{ animationDuration: '14s', animationDelay: '8s' }} />
      </div>

      {/* Main Content Area - Responsive mobile-first canvas */}
      <main className="relative z-10 w-full max-w-lg mx-auto px-4 pt-3 pb-24 flex-1">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'listen' && <ListenView />}
        {activeTab === 'connect' && <ConnectView />}
        {activeTab === 'profile' && <ProfileView />}
        {activeTab === 'garden' && <TellieGardenView />}
      </main>

      {/* Persistent Floating SOS Button with Pulsing Aura */}
      <aside aria-label="Hỗ trợ khẩn cấp" className="fixed right-4 bottom-20 z-40">
        <button
          onClick={() => openModal('sos')}
          className="group relative flex items-center gap-2 pl-3.5 pr-4 py-2.5 rounded-full bg-gradient-to-r from-rose-950 via-[#2C1929] to-[#1E1736] border border-rose-500/40 text-rose-200 font-extrabold text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all glow-rose"
          title="Hỗ trợ tâm lý khẩn cấp và kết nối người đồng hành"
        >
          {/* Pulsing Aura */}
          <span className="absolute -inset-1 rounded-full bg-rose-500/25 blur-md animate-pulse pointer-events-none" />
          <AlertCircle className="w-4 h-4 text-rose-400 group-hover:rotate-12 transition-transform relative z-10" />
          <span className="relative z-10 tracking-wider">SOS</span>
        </button>
      </aside>

      {/* Fixed Bottom Tab Bar: 4 Bottom Tabs
          1. Trang chủ
          2. Lắng nghe
          3. Kết nối
          4. Cá nhân
      */}
      <nav
        aria-label="Điều hướng chính"
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#0A0D1B]/90 backdrop-blur-2xl border-t border-[#B9A9E8]/15 shadow-2xl"
      >
        <div className="max-w-lg mx-auto grid grid-cols-4 h-16 px-2">
          {/* Tab 1: Trang chủ */}
          <button
            onClick={() => handleTabChange('home')}
            className={`flex flex-col items-center justify-center transition-all ${
              activeTab === 'home'
                ? 'text-[#B9A9E8]'
                : 'text-[#858198] hover:text-[#B9B5C8]'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${activeTab === 'home' ? 'bg-[#171A35]' : ''}`}>
              <Home className="w-5 h-5" />
            </div>
            <span className={`text-[10px] tracking-tight mt-0.5 ${activeTab === 'home' ? 'font-bold text-[#F5F2FA]' : 'font-medium'}`}>
              Trang chủ
            </span>
          </button>

          {/* Tab 2: Lắng nghe */}
          <button
            onClick={() => handleTabChange('listen')}
            className={`flex flex-col items-center justify-center transition-all ${
              activeTab === 'listen'
                ? 'text-[#B9A9E8]'
                : 'text-[#858198] hover:text-[#B9B5C8]'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${activeTab === 'listen' ? 'bg-[#171A35]' : ''}`}>
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className={`text-[10px] tracking-tight mt-0.5 ${activeTab === 'listen' ? 'font-bold text-[#F5F2FA]' : 'font-medium'}`}>
              Lắng nghe
            </span>
          </button>

          {/* Tab 3: Kết nối */}
          <button
            onClick={() => handleTabChange('connect')}
            className={`flex flex-col items-center justify-center transition-all ${
              activeTab === 'connect'
                ? 'text-[#B9A9E8]'
                : 'text-[#858198] hover:text-[#B9B5C8]'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${activeTab === 'connect' ? 'bg-[#171A35]' : ''}`}>
              <Users className="w-5 h-5" />
            </div>
            <span className={`text-[10px] tracking-tight mt-0.5 ${activeTab === 'connect' ? 'font-bold text-[#F5F2FA]' : 'font-medium'}`}>
              Kết nối
            </span>
          </button>

          {/* Tab 4: Cá nhân */}
          <button
            onClick={() => handleTabChange('profile')}
            className={`flex flex-col items-center justify-center transition-all ${
              activeTab === 'profile'
                ? 'text-[#B9A9E8]'
                : 'text-[#858198] hover:text-[#B9B5C8]'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-[#171A35]' : ''}`}>
              <User className="w-5 h-5" />
            </div>
            <span className={`text-[10px] tracking-tight mt-0.5 ${activeTab === 'profile' ? 'font-bold text-[#F5F2FA]' : 'font-medium'}`}>
              Cá nhân
            </span>
          </button>
        </div>
      </nav>

      {/* MODALS */}
      {/* 1. Spirit Selection Modal */}
      <SpiritSelectionModal
        isOpen={!userSpirit || activeModal === 'spiritSelect'}
        isInitialSetup={!userSpirit}
        onClose={closeModal}
      />

      {/* 2. SOS Support Modal */}
      <SosModal
        isOpen={activeModal === 'sos'}
        onClose={closeModal}
      />

      {/* 3. Lò Đốt Áp Lực */}
      <PressureFurnaceModal
        isOpen={activeModal === 'pressureFurnace'}
        onClose={closeModal}
      />

      {/* 4. Chốn An Toàn */}
      <SafeSpaceModal
        isOpen={activeModal === 'safeSpace'}
        onClose={closeModal}
      />

      {/* 5. Mood Night */}
      <MoodNightModal
        isOpen={activeModal === 'moodNight'}
        onClose={closeModal}
      />

      {/* 6. Trạm Năng Lượng */}
      <EnergyStationModal
        isOpen={activeModal === 'energyStation'}
        onClose={closeModal}
      />

      {/* 7. Viết Tâm Sự */}
      <WritePostModal
        isOpen={activeModal === 'writePost'}
        onClose={closeModal}
      />

      {/* 8. Plant Memory Modal */}
      <PlantMemoryModal
        isOpen={activeModal === 'gardenPlantModal'}
        onClose={closeModal}
      />

      {/* 9. Tellie Garden Modal */}
      <TellieGardenModal
        isOpen={activeModal === 'tellieGarden'}
        onClose={closeModal}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
