import React, { useState, useEffect } from 'react';
import {
  PenLine,
  Mic,
  MicOff,
  Moon,
  Sparkles,
  ArrowLeft,
  Send,
  Lock,
  Globe,
  Tag,
  Check,
  Calendar,
  Volume2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOODS_LIST, getMoodById } from '../data/moods';
import { getKintsugiMetaByMood } from '../data/kintsugi';
import { KintsugiObjectGraphic } from './KintsugiObjectGraphic';
import { MoodId, Post } from '../types';
import { sound } from '../utils/audio';
import { createSpeechRecognizer } from '../utils/speech';
import { SpiritAvatar } from './SpiritAvatar';

interface JournalViewProps {
  onOpenProfile?: () => void;
}

export const JournalView: React.FC<JournalViewProps> = ({ onOpenProfile }) => {
  const {
    createPost,
    addKintsugiItem,
    todayMood,
    recordMood,
    posts,
    userNickname,
    userSpirit,
    setActiveTab
  } = useApp();

  // Mode: 'overview' | 'writing' | 'moodNight'
  const [mode, setMode] = useState<'overview' | 'writing' | 'moodNight'>('overview');

  // Viết Tâm Sự States
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState<Post['category']>('chung');
  const [selectedMood, setSelectedMood] = useState<MoodId>(todayMood || 'calm');
  const [selectedEmotionTag, setSelectedEmotionTag] = useState<string>('Thanh thản');
  const [customHashtags, setCustomHashtags] = useState<string>('');
  const [isPrivate, setIsPrivate] = useState<boolean>(false);

  // Kintsugi Naming Prompt States
  const [showNamingPrompt, setShowNamingPrompt] = useState(false);
  const [customKintsugiName, setCustomKintsugiName] = useState('');

  // Voice-to-text
  const [isRecording, setIsRecording] = useState(false);
  const [recognizer, setRecognizer] = useState<any>(null);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  // Healed item success state
  const [savedSuccessItem, setSavedSuccessItem] = useState<{ name: string; objectType: any } | null>(null);

  // Dynamic Kintsugi repair progress: 0 to 100% based on content and title length
  const totalChars = (postTitle.trim().length * 1.5) + postContent.trim().length;
  const repairProgress = totalChars === 0 ? 0 : Math.min(100, Math.max(15, Math.round((totalChars / 50) * 100)));
  const isHealedWithGold = repairProgress >= 95;

  // Mood Night States
  const [nightBreathingStep, setNightBreathingStep] = useState<'breathing' | 'selection' | 'done'>('breathing');
  const [breathingText, setBreathingText] = useState('Hít vào thật sâu... Đón nhận sự dịu êm');
  const [nightMood, setNightMood] = useState<MoodId>('calm');
  const [nightThought, setNightThought] = useState('');

  // Categories (Vấn đề)
  const ISSUE_TAGS: Array<{ id: Post['category']; label: string; icon: string }> = [
    { id: 'hoc-tap', label: 'Học tập & Thi cử', icon: '📚' },
    { id: 'gia-dinh', label: 'Gia đình', icon: '🏡' },
    { id: 'tinh-cam', label: 'Tình cảm & Bạn bè', icon: '💌' },
    { id: 'ban-than', label: 'Bản thân & Tương lai', icon: '🌱' },
    { id: 'chung', label: 'Áp lực chung', icon: '✨' }
  ];

  // Emotion Tags (Cảm xúc)
  const EMOTION_TAGS = [
    { id: 'calm', label: 'Thanh thản', icon: '🌿' },
    { id: 'anxious', label: 'Bất an', icon: '🌧️' },
    { id: 'exhausted', label: 'Mệt nhoài', icon: '🔋' },
    { id: 'lost', label: 'Lạc lối', icon: '🌫️' },
    { id: 'heavy', label: 'Nặng lòng', icon: '🪨' },
    { id: 'grateful', label: 'Biết ơn', icon: '🌸' },
    { id: 'hopeful', label: 'Hy vọng', icon: '✨' }
  ];

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (recognizer) {
        try { recognizer.stop(); } catch {}
      }
    };
  }, [recognizer]);

  // Voice dictation toggle
  const handleToggleVoiceDictation = () => {
    if (isRecording) {
      if (recognizer) {
        try { recognizer.stop(); } catch {}
      }
      setIsRecording(false);
      setVoiceNotice(null);
      return;
    }

    const rec = createSpeechRecognizer(
      (transcript: string) => {
        setPostContent(prev => (prev ? `${prev} ${transcript}` : transcript));
      },
      () => {
        setVoiceNotice('Trình duyệt của bạn đang giới hạn mic hoặc chưa hỗ trợ nhận diện giọng nói tiếng Việt.');
        setIsRecording(false);
      },
      () => {
        setIsRecording(false);
      }
    );

    if (!rec) {
      setVoiceNotice('Thiết bị chưa hỗ trợ ghi âm trực tiếp. Bạn hãy nhập bằng bàn phím nhé.');
      return;
    }

    try {
      rec.start();
      setRecognizer(rec);
      setIsRecording(true);
      setVoiceNotice('Đang lắng nghe giọng nói của bạn... Hãy nói tự nhiên và chân thành nhé.');
      sound.playChime(640);
    } catch {
      setVoiceNotice('Không thể bật microphone lúc này.');
    }
  };

  // Prompt user for Kintsugi object custom name before saving
  const handleInitiateSubmit = () => {
    if (!postTitle.trim() || !postContent.trim()) return;
    sound.playChime(640);
    setShowNamingPrompt(true);
  };

  // Submit Viết Tâm Sự & Save Healed Kintsugi Item into Museum
  const handleConfirmSaveKintsugiAndSubmit = (defaultPlaceholder: string) => {
    if (!postTitle.trim() || !postContent.trim()) return;

    setShowNamingPrompt(false);
    sound.playChime(784);

    // Parse hashtags
    const rawTags = customHashtags
      .split(/[\s,]+/)
      .map(t => t.replace(/^#/, '').trim())
      .filter(Boolean);
    if (!rawTags.includes(selectedEmotionTag)) {
      rawTags.push(selectedEmotionTag);
    }

    // 1. Save healed vessel into "Bảo tàng hàn gắn"
    const kintMeta = getKintsugiMetaByMood(selectedMood);
    const finalItemName = customKintsugiName.trim() || defaultPlaceholder;

    addKintsugiItem({
      objectType: kintMeta.objectType,
      objectNameVi: kintMeta.nameVi,
      customName: finalItemName,
      moodId: selectedMood,
      moodLabelVi: selectedEmotionTag,
      originalText: postContent.trim(),
      repairProgress: 100,
      category: postCategory
    });

    // 2. Create post
    createPost({
      title: postTitle.trim(),
      content: postContent.trim(),
      moodId: selectedMood,
      category: postCategory,
      hashtags: rawTags,
      isPrivate
    });

    // 3. Trigger peaceful Kintsugi saved celebration modal
    setSavedSuccessItem({
      name: finalItemName,
      objectType: kintMeta.objectType
    });
  };

  const handleFinishJournal = (goToMuseum = false) => {
    setSavedSuccessItem(null);
    setMode('overview');
    setPostTitle('');
    setPostContent('');
    setCustomHashtags('');
    setCustomKintsugiName('');
    if (goToMuseum && onOpenProfile) {
      onOpenProfile();
    }
  };

  // Start Mood Night Ritual
  const handleStartMoodNight = () => {
    sound.playChime(500);
    setMode('moodNight');
    setNightBreathingStep('breathing');
    setBreathingText('Hít vào thật sâu... Đón nhận sự tĩnh lặng');

    // 3.5 seconds gentle breathing pause
    setTimeout(() => {
      setBreathingText('Thở ra chầm chậm... Buông nhẹ mọi âu lo');
    }, 1800);

    setTimeout(() => {
      setNightBreathingStep('selection');
      sound.playChime(620);
    }, 3600);
  };

  // Complete Mood Night
  const handleCompleteMoodNight = () => {
    recordMood(nightMood, nightThought ? `[Đêm] ${nightThought}` : undefined, true);
    sound.playChime(784);
    setNightBreathingStep('done');

    setTimeout(() => {
      setMode('overview');
      setNightThought('');
      setNightBreathingStep('breathing');
    }, 1600);
  };

  // Current user's posts
  const myPosts = posts.filter(p => p.authorNickname === userNickname);

  // =========================================================================
  // VIEW 1: FULL SCREEN WRITING VIEW (VIẾT TÂM SỰ - NOT A POPUP)
  // =========================================================================
  if (mode === 'writing') {
    return (
      <div className="relative min-h-[85vh] text-left pb-16 animate-fade-in">
        {/* Top Navigation */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <button
            type="button"
            onClick={() => {
              if (isRecording && recognizer) {
                try { recognizer.stop(); } catch {}
              }
              setMode('overview');
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#F5F2FA] transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-[#B9A9E8]" />
            <span>Quay lại nhật ký</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-[#A8D2C4] font-medium bg-[#A8D2C4]/15 px-3 py-1 rounded-full border border-[#A8D2C4]/25">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-amber-200">Hàn gắn Kintsugi</span>
          </div>
        </div>

        <div className="mt-5 space-y-6">
          {/* Header Title */}
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#F5F2FA] font-display">
              Viết Tâm Sự (Trút Bầu Tâm Sự)
            </h2>
            <p className="text-xs sm:text-sm text-[#E2E8F0] mt-1 leading-relaxed">
              Mỗi con chữ bạn trút ra sẽ hóa thành những đường chỉ vàng Kintsugi gắn liền vết nứt và lưu vào Bảo tàng hàn gắn.
            </p>
          </div>

          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#F5F2FA] uppercase tracking-wider">
              Tiêu đề tâm sự
            </label>
            <input
              type="text"
              value={postTitle}
              onChange={e => setPostTitle(e.target.value)}
              placeholder="VD: Một ngày học thi áp lực nhưng có một khoảnh khắc ấm áp..."
              className="w-full px-4 py-3 rounded-2xl bg-[#11152A] border border-white/15 text-sm text-[#F5F2FA] placeholder-[#858198] focus:outline-none focus:border-[#B9A9E8] transition-colors"
            />
          </div>

          {/* KINTSUGI REPAIR MECHANISM CARD - DYNAMIC GOLD SEAM PROGRESS */}
          {(() => {
            const kintMeta = getKintsugiMetaByMood(selectedMood);
            return (
              <div className="p-4 rounded-3xl bg-gradient-to-r from-[#141836] via-[#1F1E3D] to-[#12152F] border border-amber-400/35 shadow-xl flex flex-col sm:flex-row items-center gap-4">
                <div className="shrink-0 flex items-center justify-center p-2 rounded-2xl bg-[#090C1A]/85 border border-amber-400/25 shadow-inner">
                  <KintsugiObjectGraphic
                    objectType={kintMeta.objectType}
                    repairProgress={repairProgress}
                    size="md"
                    showGlow={true}
                  />
                </div>

                <div className="flex-1 text-center sm:text-left space-y-1.5 w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>Kintsugi Hàn Gắn</span>
                      </span>
                      <span className="text-xs font-bold text-white truncate max-w-[140px] sm:max-w-none">
                        {kintMeta.nameVi}
                      </span>
                    </div>
                    <span className="text-xs font-extrabold text-amber-300">
                      {repairProgress}% Chỉ vàng
                    </span>
                  </div>

                  {/* Dynamic Golden Progress Bar */}
                  <div className="w-full h-2.5 rounded-full bg-black/50 overflow-hidden p-0.5 border border-amber-400/25">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-300 to-yellow-200 transition-all duration-300 shadow-[0_0_12px_#F59E0B]"
                      style={{ width: `${repairProgress}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-[#CBD5E1] leading-relaxed">
                    {repairProgress === 0 && 'Hãy viết hoặc thu âm những tâm tư để chỉ vàng Kintsugi bắt đầu lấp đầy vết nứt...'}
                    {repairProgress > 0 && repairProgress < 95 && 'Những vết rạn đang dần được lấp kín bằng những dải vàng lấp lánh...'}
                    {repairProgress >= 95 && '✨ Vết nứt đã được lấp đầy trọn vẹn bằng chỉ vàng Kintsugi quý giá!'}
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Large Expanding Textarea + Prominent Voice-to-Text Button */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#F5F2FA] uppercase tracking-wider">
                Nội dung dòng suy nghĩ
              </label>

              {/* PROMINENT VOICE-TO-TEXT BUTTON (THU ÂM TÂM SỰ) */}
              <button
                type="button"
                onClick={handleToggleVoiceDictation}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-md active:scale-95 border ${
                  isRecording
                    ? 'bg-rose-500 text-white border-rose-400 animate-pulse ring-2 ring-rose-400/50'
                    : 'bg-[#B9A9E8]/20 hover:bg-[#B9A9E8]/30 text-[#E9EDF5] border-[#B9A9E8]/40'
                }`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" />
                    <span>Dừng ghi âm</span>
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                    </span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5 text-[#B9A9E8]" />
                    <span>Thu âm tâm sự (Nói thành lời)</span>
                  </>
                )}
              </button>
            </div>

            {/* Voice Notice Feedback */}
            {voiceNotice && (
              <div className="px-3.5 py-2 rounded-xl bg-[#171A35] border border-[#B9A9E8]/30 text-xs text-[#E2E8F0] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#A8D2C4] shrink-0" />
                <span>{voiceNotice}</span>
              </div>
            )}

            {/* Large Textarea */}
            <textarea
              rows={8}
              value={postContent}
              onChange={e => setPostContent(e.target.value)}
              placeholder="Bạn đang nghĩ gì? Không ai phán xét bạn ở đây. Hãy để những cảm xúc tuôn trào tự nhiên lên trang viết này..."
              className="w-full p-4 rounded-2xl bg-[#11152A] border border-white/15 text-sm text-[#F5F2FA] placeholder-[#858198] focus:outline-none focus:border-[#B9A9E8] transition-colors leading-relaxed resize-y min-h-[180px]"
            />
          </div>

          {/* TAG SELECTION 1: VẤN ĐỀ (CATEGORIES) - Generous Padding for Easy Mobile Tapping */}
          <div className="space-y-2 pt-1">
            <span className="block text-xs font-bold text-[#F5F2FA] uppercase tracking-wider">
              1. Chủ đề / Vấn đề liên quan
            </span>
            <div className="flex flex-wrap gap-2.5">
              {ISSUE_TAGS.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setPostCategory(t.id);
                    sound.playChime(560);
                  }}
                  className={`min-h-[44px] px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all active:scale-95 flex items-center gap-2 ${
                    postCategory === t.id
                      ? 'bg-[#242347] border-[#B9A9E8] text-[#FFFFFF] shadow-lg shadow-[#B9A9E8]/20 ring-1 ring-[#B9A9E8]'
                      : 'bg-[#11152A] border-white/10 text-[#E2E8F0] hover:border-white/25 hover:text-white'
                  }`}
                >
                  <span className="text-base">{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* TAG SELECTION 2: CẢM XÚC (EMOTIONS) - Generous Padding */}
          <div className="space-y-2 pt-1">
            <span className="block text-xs font-bold text-[#F5F2FA] uppercase tracking-wider">
              2. Sắc thái cảm xúc của bạn
            </span>
            <div className="flex flex-wrap gap-2.5">
              {EMOTION_TAGS.map(e => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => {
                    setSelectedEmotionTag(e.label);
                    setSelectedMood(e.id as MoodId);
                    sound.playChime(600);
                  }}
                  className={`min-h-[44px] px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all active:scale-95 flex items-center gap-2 ${
                    selectedEmotionTag === e.label
                      ? 'bg-[#16272E] border-[#A8D2C4] text-[#FFFFFF] shadow-lg shadow-[#A8D2C4]/20 ring-1 ring-[#A8D2C4]'
                      : 'bg-[#11152A] border-white/10 text-[#E2E8F0] hover:border-white/25 hover:text-white'
                  }`}
                >
                  <span className="text-base">{e.icon}</span>
                  <span>{e.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hashtag & Privacy Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#F5F2FA] uppercase tracking-wider mb-1.5">
                Hashtag thêm (Tùy chọn)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={customHashtags}
                  onChange={e => setCustomHashtags(e.target.value)}
                  placeholder="VD: #ueh #doan #apluc"
                  className="w-full px-4 py-3 rounded-2xl bg-[#11152A] border border-white/15 text-xs text-[#F5F2FA] placeholder-[#858198] focus:outline-none focus:border-[#B9A9E8]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#F5F2FA] uppercase tracking-wider mb-1.5">
                Chế độ lưu
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsPrivate(false)}
                  className={`min-h-[44px] px-3 py-2 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    !isPrivate
                      ? 'bg-[#171A35] border-[#B9A9E8] text-[#FFFFFF] shadow-md'
                      : 'bg-[#11152A] border-white/10 text-[#B9B5C8]'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-[#B9A9E8]" />
                  <span>Cộng đồng ẩn danh</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPrivate(true)}
                  className={`min-h-[44px] px-3 py-2 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    isPrivate
                      ? 'bg-[#16272E] border-[#A8D2C4] text-[#FFFFFF] shadow-md'
                      : 'bg-[#11152A] border-white/10 text-[#B9B5C8]'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 text-[#A8D2C4]" />
                  <span>Lưu riêng tư</span>
                </button>
              </div>
            </div>
          </div>

          {/* Primary Submit Button: Gửi & Gieo mầm (Opens Kintsugi Naming Prompt) */}
          <div className="pt-4">
            <button
              type="button"
              disabled={!postTitle.trim() || !postContent.trim()}
              onClick={handleInitiateSubmit}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-[#A8D2C4] text-[#0D0F1D] font-extrabold text-sm tracking-wide shadow-xl shadow-amber-400/20 hover:brightness-105 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
              <span>Gửi & Lưu kỷ vật Kintsugi vào Bảo tàng ✨</span>
            </button>
          </div>
        </div>

        {/* KINTSUGI NAMING PROMPT MODAL */}
        {showNamingPrompt && (() => {
          const kintMeta = getKintsugiMetaByMood(selectedMood);
          const now = new Date();
          const pad = (n: number) => n.toString().padStart(2, '0');
          // Format: [Object Name] • [DD/MM HH:mm] (e.g., "Khối pha lê Lạc lối • 03/11 01:00")
          const defaultPlaceholder = `${kintMeta.nameVi} • ${pad(now.getDate())}/${pad(now.getMonth() + 1)} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0D1B]/90 backdrop-blur-2xl animate-fade-in text-left">
              <div className="w-full max-w-md glass-panel rounded-3xl p-6 border border-amber-400/40 shadow-2xl space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div>
                    <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
                      Bảo tàng hàn gắn Tellie
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-[#FFFFFF] font-display">
                      Đặt tên cho kỷ vật đã được hàn gắn ✨
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowNamingPrompt(false)}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#B9B5C8] hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                {/* Healed Object Visual Preview with 100% gold seams */}
                <div className="py-2 flex flex-col items-center justify-center text-center">
                  <div className="p-3 rounded-2xl bg-[#0B0E23]/90 border border-amber-400/30 shadow-xl">
                    <KintsugiObjectGraphic
                      objectType={kintMeta.objectType}
                      repairProgress={100}
                      size="lg"
                      showGlow={true}
                    />
                  </div>
                  <span className="mt-2 text-xs font-bold text-amber-200">
                    {kintMeta.nameVi} · Đã gắn liền bằng chỉ vàng
                  </span>
                </div>

                {/* Name Fields */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#F5F2FA] uppercase tracking-wider block">
                      Tên kỷ vật (Mặc định hoặc tùy chỉnh):
                    </label>
                    <input
                      type="text"
                      value={customKintsugiName}
                      onChange={e => setCustomKintsugiName(e.target.value)}
                      placeholder={defaultPlaceholder}
                      className="w-full px-4 py-3 rounded-xl bg-[#11152A] border border-amber-400/30 text-sm font-semibold text-[#FFFFFF] placeholder-[#858198] focus:outline-none focus:border-amber-400"
                    />
                    <p className="text-[11px] text-[#A8D2C4]">
                      Tên mặc định gợi ý: <strong>{defaultPlaceholder}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNamingPrompt(false)}
                    className="flex-1 min-h-[44px] py-3 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-[#E2E8F0]"
                  >
                    Chỉnh sửa thêm
                  </button>
                  <button
                    type="button"
                    onClick={() => handleConfirmSaveKintsugiAndSubmit(defaultPlaceholder)}
                    className="flex-1 min-h-[44px] py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 text-[#0D0F1D] font-extrabold text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4 fill-current" />
                    <span>Lưu vào Bảo tàng</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* KINTSUGI HEALED CELEBRATION MODAL (NO SEED / NO GARDEN) */}
        {savedSuccessItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0D1B]/95 backdrop-blur-2xl animate-fade-in text-center">
            <div className="relative w-full max-w-sm glass-panel rounded-3xl p-7 border border-amber-400/40 shadow-2xl space-y-5">
              <div className="py-2 flex flex-col items-center justify-center">
                <div className="p-4 rounded-3xl bg-[#090C1A] border border-amber-400/40 shadow-2xl animate-pulse">
                  <KintsugiObjectGraphic
                    objectType={savedSuccessItem.objectType}
                    repairProgress={100}
                    size="lg"
                    showGlow={true}
                  />
                </div>
                <span className="mt-3 text-xs font-bold text-amber-300 bg-amber-500/15 px-3 py-1 rounded-full border border-amber-400/30">
                  ✨ Đã gắn liền bằng chỉ vàng Kintsugi
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-extrabold text-[#F5F2FA] font-display">
                  Lưu trữ thành công!
                </h3>
                <p className="text-xs text-[#E2E8F0] leading-relaxed">
                  Kỷ vật <strong>&ldquo;{savedSuccessItem.name}&rdquo;</strong> đã được lưu giữ trang trọng trong <strong>Bảo tàng hàn gắn</strong> của bạn.
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleFinishJournal(true)}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-300 text-[#0D0F1D] font-extrabold text-xs shadow-lg hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Xem Bảo tàng hàn gắn</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFinishJournal(false)}
                  className="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-[#CBD5E1]"
                >
                  Quay về Nhật Ký
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: MOOD NIGHT RITUAL (NGHI THỨC ĐÊM)
  // =========================================================================
  if (mode === 'moodNight') {
    return (
      <div className="relative min-h-[85vh] text-center flex flex-col justify-center items-center p-4 animate-fade-in">
        {/* Dimming night background with floating glowing moon and fireflies */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-10 right-1/4 w-72 h-72 rounded-full bg-gradient-to-br from-[#FFFEE8]/15 via-[#B9A9E8]/15 to-transparent blur-3xl animate-moon-pulse" />
          <div className="absolute bottom-12 left-10 text-[#FFFEE8] text-sm animate-ping">✧</div>
          <div className="absolute top-24 left-1/4 text-[#91B8E8] text-xs animate-pulse">✦</div>
          <div className="absolute bottom-32 right-12 text-[#A8D2C4] text-sm animate-ping">⋆</div>
        </div>

        <div className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-[#B9A9E8]/30 shadow-2xl relative space-y-6">
          <button
            type="button"
            onClick={() => setMode('overview')}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#B9B5C8] hover:text-white transition-colors"
          >
            ✕
          </button>

          {/* BREATHING PAUSE STAGE */}
          {nightBreathingStep === 'breathing' && (
            <div className="py-6 space-y-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#B9A9E8]/30 via-[#171A35] to-[#A8D2C4]/20 border border-[#B9A9E8]/50 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(185,169,232,0.4)] animate-pulse">
                <Moon className="w-10 h-10 text-[#F4EEDC]" />
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#A8D2C4] tracking-wider uppercase">
                  Nghi Thức Đêm · Khoảng Lặng
                </span>
                <h3 className="text-lg font-bold text-[#F5F2FA] font-display">
                  {breathingText}
                </h3>
                <p className="text-xs text-[#E2E8F0]">
                  Hãy thả lỏng vai, nhắm mắt lại 3 giây và hít thở thật đều...
                </p>
              </div>
            </div>
          )}

          {/* NIGHT MOOD SELECTION STAGE */}
          {nightBreathingStep === 'selection' && (
            <div className="space-y-5 text-left animate-fade-in">
              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#242347] border border-[#B9A9E8]/30 text-[11px] font-bold text-[#E9EDF5]">
                  <Moon className="w-3.5 h-3.5 text-[#F4EEDC]" />
                  <span>Khép lại một ngày</span>
                </div>
                <h3 className="text-lg font-bold text-[#F5F2FA] font-display">
                  Đêm nay bạn muốn gửi gắm cảm xúc nào?
                </h3>
              </div>

              {/* Mood Grid */}
              <div className="grid grid-cols-4 gap-2">
                {MOODS_LIST.map(m => {
                  const isSel = nightMood === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setNightMood(m.id);
                        sound.playChime(560);
                      }}
                      className={`p-2.5 rounded-2xl border text-center transition-all ${
                        isSel
                          ? 'bg-[#242347] border-[#B9A9E8] ring-2 ring-[#B9A9E8]/60 scale-105'
                          : 'bg-[#11152A] border-white/10 text-[#E2E8F0] hover:border-white/25'
                      }`}
                    >
                      <span className="text-xl block">{m.icon}</span>
                      <span className="text-[10px] font-bold text-[#F5F2FA] mt-1 block truncate">
                        {m.labelVi}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Night Thought Input */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-bold text-[#F5F2FA] uppercase tracking-wider">
                  Một suy nghĩ trước khi chìm vào giấc ngủ:
                </label>
                <textarea
                  rows={3}
                  value={nightThought}
                  onChange={e => setNightThought(e.target.value)}
                  placeholder="Ghi lại một điều bạn muốn buông bỏ hoặc một điều bạn cảm thấy biết ơn hôm nay..."
                  className="w-full p-3 rounded-2xl bg-[#11152A] border border-white/15 text-xs text-[#F5F2FA] placeholder-[#858198] focus:outline-none focus:border-[#B9A9E8]"
                />
              </div>

              <button
                type="button"
                onClick={handleCompleteMoodNight}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#B9A9E8] to-[#A8D2C4] text-[#0D0F1D] font-bold text-xs tracking-wide shadow-lg hover:opacity-95 transition-all"
              >
                Hoàn thành nghi thức đêm ✨
              </button>
            </div>
          )}

          {/* DONE STAGE */}
          {nightBreathingStep === 'done' && (
            <div className="py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#A8D2C4]/20 border border-[#A8D2C4]/50 flex items-center justify-center mx-auto text-[#A8D2C4]">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h3 className="text-lg font-bold text-[#F5F2FA] font-display">
                Chúc bạn một giấc ngủ thật an lành 🌙
              </h3>
              <p className="text-xs text-[#E2E8F0]">
                Tellie luôn ở đây đồng hành cùng bạn mỗi sớm mai thức giấc.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: TAB OVERVIEW (DEFAULT VIEW FOR TAB 2 - NHẬT KÝ)
  // =========================================================================
  return (
    <div className="space-y-6 text-left pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 border border-[#B9A9E8]/25 bg-gradient-to-br from-[#171A35]/90 via-[#1E1C40]/80 to-[#0D1020]/90 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#B9A9E8]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold text-[#A8D2C4] tracking-wider uppercase">
            <span>📖 Nhật Ký Cảm Xúc & Hàn Gắn Kintsugi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F2FA] font-display tracking-tight">
            Nơi Tâm Tư Được Chữa Lành Bằng Chỉ Vàng
          </h2>
          <p className="text-xs sm:text-sm text-[#E2E8F0] max-w-md leading-relaxed">
            Trút bầu tâm sự để hàn gắn những rạn vỡ cảm xúc bằng triết lý Kintsugi, hoặc tham gia nghi thức đêm để vỗ về bản thân sau một ngày dài.
          </p>
        </div>
      </div>

      {/* TWO PRIMARY ACTION CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* CARD 1: VIẾT TÂM SỰ (Trút bầu tâm sự) */}
        <div className="glass-panel rounded-3xl p-5 border border-white/15 shadow-xl hover:border-[#B9A9E8]/50 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#B9A9E8]/20 border border-[#B9A9E8]/30 flex items-center justify-center text-[#B9A9E8] shadow-inner">
              <PenLine className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F5F2FA] font-display">
                Viết Tâm Sự (Trút Bầu Tâm Sự)
              </h3>
              <p className="text-xs text-[#E2E8F0] mt-1 leading-relaxed">
                Viết hoặc thu âm giọng nói. Mỗi câu từ trút ra sẽ là những đường chỉ vàng Kintsugi gắn liền vết nứt và lưu giữ trong Bảo tàng.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playChime(600);
              setMode('writing');
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#B9A9E8] to-[#91B8E8] text-[#0D0F1D] font-extrabold text-xs tracking-wide shadow-md hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <PenLine className="w-4 h-4" />
            <span>Mở trang viết tâm sự</span>
          </button>
        </div>

        {/* CARD 2: MOOD NIGHT (Nghi thức đêm) */}
        <div className="glass-panel rounded-3xl p-5 border border-white/15 shadow-xl hover:border-[#F4EEDC]/40 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#F4EEDC]/15 border border-[#F4EEDC]/30 flex items-center justify-center text-[#F4EEDC] shadow-inner">
              <Moon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F5F2FA] font-display">
                Nghi Thức Đêm (Mood Night)
              </h3>
              <p className="text-xs text-[#E2E8F0] mt-1 leading-relaxed">
                Khoảng lặng bình yên cuối ngày với bài tập thở dịu nhẹ và ghi nhận cảm xúc dưới vầng trăng.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStartMoodNight}
            className="w-full py-3.5 rounded-2xl bg-[#171A35] hover:bg-[#202547] border border-[#F4EEDC]/30 text-[#F5F2FA] font-bold text-xs tracking-wide shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Moon className="w-4 h-4 text-[#F4EEDC]" />
            <span>Bắt đầu nghi thức đêm</span>
          </button>
        </div>
      </div>

      {/* RECENT JOURNAL ENTRIES / REFLECTIONS */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#F5F2FA] uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#A8D2C4]" />
            <span>Những dòng tâm sự gần đây của bạn</span>
          </h3>
          <span className="text-xs text-[#B9B5C8] font-medium">
            {myPosts.length} dòng nhật ký
          </span>
        </div>

        {myPosts.length === 0 ? (
          <div className="glass-panel rounded-3xl p-8 border border-white/10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-[#B9B5C8]">
              ✨
            </div>
            <p className="text-xs text-[#E2E8F0] max-w-xs mx-auto">
              Bạn chưa có dòng tâm sự nào. Hãy bấm "Mở trang viết tâm sự" ở trên để giải tỏa suy nghĩ và hàn gắn tâm hồn nhé.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {myPosts.slice(0, 5).map(post => {
              const moodMeta = getMoodById(post.moodId);
              return (
                <div
                  key={post.id}
                  className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/10 space-y-2 hover:border-[#B9A9E8]/30 transition-all"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#F5F2FA] line-clamp-1">
                      {post.title}
                    </span>
                    <span className="text-[10px] text-[#A8D2C4] bg-[#A8D2C4]/15 px-2.5 py-0.5 rounded-full font-semibold shrink-0">
                      {moodMeta.icon} {moodMeta.labelVi}
                    </span>
                  </div>

                  <p className="text-xs text-[#E2E8F0] leading-relaxed line-clamp-3 whitespace-pre-line">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-[#B9B5C8]">
                    <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                    {post.hashtags && post.hashtags.length > 0 && (
                      <span className="text-[#A8D2C4] font-medium">
                        #{post.hashtags[0]}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
