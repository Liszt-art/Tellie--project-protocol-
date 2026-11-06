/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Home,
  BookOpen,
  Wind,
  Users,
  ShieldAlert,
  LifeBuoy
} from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { HomeView } from './components/HomeView';
import { JournalView } from './components/JournalView';
import { ZenView } from './components/ZenView';
import { CommunityView } from './components/CommunityView';
import { ProfileView } from './components/ProfileView';
import { SpiritSelectionModal } from './components/SpiritSelectionModal';
import { SosModal } from './components/SosModal';
import { SpiritAvatar } from './components/SpiritAvatar';
import { sound } from './utils/audio';

function AppContent() {
  const {
    activeTab,
    setActiveTab,
    activeModal,
    openModal,
    closeModal,
    userSpirit,
    userNickname,
    hasCompletedOnboarding
  } = useApp();

  // Full-Screen Profile View State (Triggered by Top Right Avatar)
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Tab 4 Community sub-tab controller
  const [communitySubTab, setCommunitySubTab] = useState<'feed' | 'circle' | 'mate'>('feed');

  const currentSpiritId = userSpirit ? userSpirit.spiritId : 'fairy';
  const spiritName = userSpirit?.customName || 'Tellie Spirit';

  const handleTabChange = (tab: 'home' | 'journal' | 'zen' | 'community') => {
    sound.playChime(500);
    setIsProfileOpen(false);
    setActiveTab(tab as any);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#070914] text-[#F5F2FA] flex flex-col justify-between selection:bg-[#B9A9E8]/30 selection:text-white overflow-x-hidden">
      {/* =========================================================================
          HEALING STARRY NIGHT SKY (BẦU TRỜI ĐÊM ĐẦY SAO)
          Layered celestial atmosphere with deep contrast & gentle twinkling
      ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#060815] via-[#0D1129] via-50%-[#13173B] to-[#070914] opacity-95" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[650px] h-[550px] bg-gradient-to-b from-[#B9A9E8]/10 via-[#91B8E8]/08 to-transparent rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -left-36 w-[500px] h-[500px] bg-gradient-to-tr from-[#1B234C]/40 via-[#231E48]/30 to-transparent rounded-full blur-[120px]" />
        <div className="absolute top-2/3 -right-36 w-[550px] h-[550px] bg-gradient-to-bl from-[#2A204C]/35 via-[#182042]/30 to-transparent rounded-full blur-[130px]" />

        {/* Twinkling Stars */}
        <div className="absolute top-8 left-12 w-1.5 h-1.5 rounded-full bg-[#FFFCE8] shadow-[0_0_8px_#FFFCE8] animate-star-twinkle" style={{ animationDuration: '4.5s' }} />
        <div className="absolute top-14 right-20 w-1 h-1 rounded-full bg-[#B9A9E8] shadow-[0_0_6px_#B9A9E8] animate-star-twinkle" style={{ animationDuration: '6s', animationDelay: '1.2s' }} />
        <div className="absolute top-24 left-1/4 w-1.5 h-1.5 rounded-full bg-[#91B8E8] shadow-[0_0_8px_#91B8E8] animate-star-twinkle" style={{ animationDuration: '5.2s', animationDelay: '2.4s' }} />
        <div className="absolute top-[360px] right-24 w-1.5 h-1.5 rounded-full bg-[#FFFCE8] animate-star-twinkle" style={{ animationDuration: '5.5s' }} />
        <div className="absolute top-[520px] left-10 w-1.5 h-1.5 rounded-full bg-[#B9A9E8] animate-star-twinkle" style={{ animationDuration: '4.8s' }} />
        <div className="absolute bottom-52 right-16 w-1.5 h-1.5 rounded-full bg-[#91B8E8] animate-star-twinkle" style={{ animationDuration: '5.4s' }} />
        <div className="absolute top-10 right-28 text-[11px] text-[#FFF9E6]/60 animate-star-twinkle">✦</div>
        <div className="absolute top-28 left-10 text-[10px] text-[#B9A9E8]/55 animate-star-twinkle">✧</div>
      </div>

      {/* =========================================================================
          TOP APP BAR: LOGO & TOP-RIGHT AVATAR
      ========================================================================= */}
      <header className="relative z-30 w-full max-w-lg mx-auto px-4 pt-3 pb-2 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FFFFFF] font-display">
              Tellie
            </h1>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B9A9E8] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B9A9E8]" />
            </span>
          </div>
          <p className="text-[11px] text-[#CBD5E1] font-medium tracking-wide">
            Không gian an toàn cho sức khỏe cảm xúc
          </p>
        </div>

        {/* TOP RIGHT AVATAR: CLICKING OPENS FULL-SCREEN PROFILE VIEW (NO DROPDOWN) */}
        <button
          type="button"
          onClick={() => {
            sound.playChime(560);
            setIsProfileOpen(!isProfileOpen);
          }}
          className="group flex items-center gap-2 py-1.5 pl-2 pr-3.5 rounded-full bg-[#171A35]/90 hover:bg-[#242347] border border-[#B9A9E8]/30 hover:border-[#B9A9E8]/60 transition-all shadow-lg active:scale-95"
          title="Mở trang Hồ sơ cá nhân"
        >
          <div className="w-8 h-8 rounded-full bg-[#0D1020] border border-[#B9A9E8]/40 overflow-hidden flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
            <SpiritAvatar
              id={currentSpiritId}
              colorId={userSpirit?.colorId}
              accessory={userSpirit?.accessory}
              size="xs"
              animate={false}
              glow={false}
              showShadow={false}
              className="scale-125 -translate-y-0.5"
            />
          </div>
          <div className="text-left">
            <span className="text-[11px] font-extrabold text-[#FFFFFF] block leading-tight max-w-[85px] truncate">
              {userNickname || spiritName}
            </span>
            <span className="text-[9px] text-[#A8D2C4] font-medium block leading-none">
              Hồ sơ ✨
            </span>
          </div>
        </button>
      </header>

      {/* =========================================================================
          MAIN CONTENT AREA
      ========================================================================= */}
      <main className="relative z-10 w-full max-w-lg mx-auto px-4 pt-2 pb-24 flex-1">
        {/* If Profile View is open, render Full-Screen Profile View */}
        {isProfileOpen ? (
          <ProfileView onClose={() => setIsProfileOpen(false)} />
        ) : (
          /* Otherwise render only the active tab */
          <>
            {(activeTab === 'home' || !activeTab) && <HomeView />}
            {activeTab === 'journal' && <JournalView onOpenProfile={() => setIsProfileOpen(true)} />}
            {activeTab === 'zen' && <ZenView />}
            {activeTab === 'community' && <CommunityView initialSubTab={communitySubTab} />}

            {/* Backwards compatibility for legacy tabs */}
            {activeTab === 'listen' && <CommunityView initialSubTab="feed" />}
            {activeTab === 'connect' && <CommunityView initialSubTab="circle" />}
            {activeTab === 'profile' && <ProfileView onClose={() => setActiveTab('home')} />}
          </>
        )}
      </main>

      {/* =========================================================================
          HIGHLY VISIBLE FLOATING SOS BUTTON (FIXED ON ALL SCREENS)
          Pastel red/orange shield or lifebuoy icon
      ========================================================================= */}
      <aside aria-label="Hỗ trợ khẩn cấp" className="fixed right-4 bottom-20 z-40">
        <button
          type="button"
          onClick={() => {
            sound.playChime(450);
            openModal('sos');
          }}
          className="group relative flex items-center gap-2 pl-3.5 pr-4 py-3 rounded-full bg-gradient-to-r from-[#F43F5E] via-[#FB7185] to-[#F97316] text-[#0D0F1D] font-extrabold text-xs shadow-[0_8px_25px_rgba(244,63,94,0.45)] hover:shadow-[0_12px_32px_rgba(244,63,94,0.65)] hover:scale-105 active:scale-95 transition-all border border-white/30"
          title="Hỗ trợ tâm lý khẩn cấp và đường dây nóng 24/7"
        >
          {/* Subtle Outer Pulsing Wave */}
          <span className="absolute -inset-1 rounded-full bg-rose-500/35 blur-md animate-pulse pointer-events-none" />
          <LifeBuoy className="w-4 h-4 text-[#0D0F1D] group-hover:rotate-45 transition-transform relative z-10 stroke-[2.5]" />
          <span className="relative z-10 tracking-wider">HỖ TRỢ SOS</span>
        </button>
      </aside>

      {/* =========================================================================
          FIXED BOTTOM NAVIGATION BAR: 4 DISTINCT TABS
          1. [Home]
          2. [Nhật Ký]
          3. [Zen]
          4. [Cộng Đồng]
      ========================================================================= */}
      <nav
        aria-label="Điều hướng chính"
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#0A0D1B]/95 backdrop-blur-2xl border-t border-[#B9A9E8]/20 shadow-2xl"
      >
        <div className="max-w-lg mx-auto grid grid-cols-4 h-16 px-2">
          {/* TAB 1: [Home] */}
          <button
            type="button"
            onClick={() => handleTabChange('home')}
            className={`min-h-[48px] flex flex-col items-center justify-center transition-all ${
              !isProfileOpen && activeTab === 'home'
                ? 'text-[#B9A9E8]'
                : 'text-[#CBD5E1] hover:text-white'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${!isProfileOpen && activeTab === 'home' ? 'bg-[#171A35]' : ''}`}>
              <Home className="w-5 h-5" />
            </div>
            <span className={`text-[10px] tracking-tight mt-0.5 ${!isProfileOpen && activeTab === 'home' ? 'font-bold text-[#FFFFFF]' : 'font-medium'}`}>
              Home
            </span>
          </button>

          {/* TAB 2: [Nhật Ký] */}
          <button
            type="button"
            onClick={() => handleTabChange('journal')}
            className={`min-h-[48px] flex flex-col items-center justify-center transition-all ${
              !isProfileOpen && activeTab === 'journal'
                ? 'text-[#B9A9E8]'
                : 'text-[#CBD5E1] hover:text-white'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${!isProfileOpen && activeTab === 'journal' ? 'bg-[#171A35]' : ''}`}>
              <BookOpen className="w-5 h-5" />
            </div>
            <span className={`text-[10px] tracking-tight mt-0.5 ${!isProfileOpen && activeTab === 'journal' ? 'font-bold text-[#FFFFFF]' : 'font-medium'}`}>
              Nhật Ký
            </span>
          </button>

          {/* TAB 3: [Zen] */}
          <button
            type="button"
            onClick={() => handleTabChange('zen')}
            className={`min-h-[48px] flex flex-col items-center justify-center transition-all ${
              !isProfileOpen && activeTab === 'zen'
                ? 'text-[#B9A9E8]'
                : 'text-[#CBD5E1] hover:text-white'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${!isProfileOpen && activeTab === 'zen' ? 'bg-[#171A35]' : ''}`}>
              <Wind className="w-5 h-5" />
            </div>
            <span className={`text-[10px] tracking-tight mt-0.5 ${!isProfileOpen && activeTab === 'zen' ? 'font-bold text-[#FFFFFF]' : 'font-medium'}`}>
              Zen
            </span>
          </button>

          {/* TAB 4: [Cộng Đồng] */}
          <button
            type="button"
            onClick={() => handleTabChange('community')}
            className={`min-h-[48px] flex flex-col items-center justify-center transition-all ${
              !isProfileOpen && (activeTab === 'community' || activeTab === 'listen' || activeTab === 'connect' || activeTab === 'garden')
                ? 'text-[#B9A9E8]'
                : 'text-[#CBD5E1] hover:text-white'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${!isProfileOpen && (activeTab === 'community' || activeTab === 'listen' || activeTab === 'connect' || activeTab === 'garden') ? 'bg-[#171A35]' : ''}`}>
              <Users className="w-5 h-5" />
            </div>
            <span className={`text-[10px] tracking-tight mt-0.5 ${!isProfileOpen && (activeTab === 'community' || activeTab === 'listen' || activeTab === 'connect' || activeTab === 'garden') ? 'font-bold text-[#FFFFFF]' : 'font-medium'}`}>
              Cộng Đồng
            </span>
          </button>
        </div>
      </nav>

      {/* =========================================================================
          GLOBAL MODALS
      ========================================================================= */}
      {/* 1. Spirit Selection & Onboarding Wizard */}
      <SpiritSelectionModal
        isOpen={!hasCompletedOnboarding || activeModal === 'spiritSelect'}
        isInitialSetup={!hasCompletedOnboarding}
        onClose={closeModal}
      />

      {/* 2. SOS Support Modal with Emergency Hotlines (111, 115, Ngày Mai, UEH) */}
      <SosModal
        isOpen={activeModal === 'sos'}
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
