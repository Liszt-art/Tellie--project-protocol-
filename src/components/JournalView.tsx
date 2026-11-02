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
import { MoodId, Post } from '../types';
import { sound } from '../utils/audio';
import { createSpeechRecognizer } from '../utils/speech';
import { SpiritAvatar } from './SpiritAvatar';

interface JournalViewProps {
  onRedirectToGarden?: () => void;
}

export const JournalView: React.FC<JournalViewProps> = ({ onRedirectToGarden }) => {
  const {
    createPost,
    plantMemory,
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

  // Voice-to-text
  const [isRecording, setIsRecording] = useState(false);
  const [recognizer, setRecognizer] = useState<any>(null);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  // Dropping seed animation state
  const [isDroppingSeed, setIsDroppingSeed] = useState(false);
  const [seedStage, setSeedStage] = useState<'falling' | 'planted' | 'redirecting'>('falling');

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

  // Submit Viết Tâm Sự & Gieo Hạt
  const handleSubmitPost = () => {
    if (!postTitle.trim() || !postContent.trim()) return;

    sound.playChime(660);
    setIsDroppingSeed(true);
    setSeedStage('falling');

    // Parse hashtags
    const rawTags = customHashtags
      .split(/[\s,]+/)
      .map(t => t.replace(/^#/, '').trim())
      .filter(Boolean);
    if (!rawTags.includes(selectedEmotionTag)) {
      rawTags.push(selectedEmotionTag);
    }

    // 1. Create post
    createPost({
      title: postTitle.trim(),
      content: postContent.trim(),
      moodId: selectedMood,
      category: postCategory,
      hashtags: rawTags,
      isPrivate
    });

    // 2. Plant memory seed into garden
    plantMemory({
      title: postTitle.trim(),
      note: postContent.trim().slice(0, 100),
      category: postCategory,
      plantType: 'flower',
      flowerNameVi: `Mầm hoa ${selectedEmotionTag}`,
      color: '#A8D2C4'
    });

    // Seed animation sequence
    setTimeout(() => {
      setSeedStage('planted');
      sound.playChime(820);
    }, 1200);

    setTimeout(() => {
      setSeedStage('redirecting');
    }, 2200);

    setTimeout(() => {
      setIsDroppingSeed(false);
      setMode('overview');
      setPostTitle('');
      setPostContent('');
      setCustomHashtags('');

      // Auto-redirect to Tellie Garden in Tab 4 (Community)
      if (onRedirectToGarden) {
        onRedirectToGarden();
      } else {
        setActiveTab('community');
      }
    }, 2800);
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
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gieo hạt tâm sự</span>
          </div>
        </div>

        <div className="mt-5 space-y-6">
          {/* Header Title */}
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#F5F2FA] font-display">
              Viết Tâm Sự & Gieo Hạt
            </h2>
            <p className="text-xs sm:text-sm text-[#E2E8F0] mt-1 leading-relaxed">
              Những điều bạn viết hôm nay sẽ trở thành một mầm hoa được nuôi dưỡng trong Khu vườn Tellie.
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

          {/* Primary Submit Button: Gửi & Gieo mầm */}
          <div className="pt-4">
            <button
              type="button"
              disabled={!postTitle.trim() || !postContent.trim()}
              onClick={handleSubmitPost}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#B9A9E8] via-[#A8D2C4] to-[#91B8E8] text-[#0D0F1D] font-extrabold text-sm tracking-wide shadow-xl shadow-[#B9A9E8]/20 hover:opacity-95 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
              <span>Gửi & Gieo mầm hạt giống vào Vườn Tellie 🌱</span>
            </button>
          </div>
        </div>

        {/* DROPPING SEED ANIMATION MODAL OVERLAY */}
        {isDroppingSeed && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0D1B]/95 backdrop-blur-2xl animate-fade-in text-center">
            <div className="relative w-full max-w-sm glass-panel rounded-3xl p-8 border border-[#A8D2C4]/30 shadow-2xl space-y-6">
              {/* Seed Falling Visual */}
              <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
                {/* Soft ground aura */}
                <div className="absolute bottom-4 w-32 h-10 rounded-full bg-[#A8D2C4]/20 blur-xl pointer-events-none" />

                {/* Animated Falling Seed */}
                <div
                  className={`w-14 h-14 rounded-full bg-gradient-to-br from-[#FFFEE8] via-[#A8D2C4] to-[#719B8E] shadow-[0_0_35px_rgba(168,210,196,0.9)] flex items-center justify-center text-xl transition-all duration-1000 ${
                    seedStage === 'falling'
                      ? '-translate-y-16 scale-90 opacity-90'
                      : 'translate-y-6 scale-110 opacity-100 ring-4 ring-[#A8D2C4]/50'
                  }`}
                >
                  🌱
                </div>

                {/* Sparkling Embers */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="text-[#FFFEE8] text-sm animate-ping absolute top-4 left-6">✧</div>
                  <div className="text-[#A8D2C4] text-xs animate-pulse absolute top-10 right-8">✦</div>
                  <div className="text-[#B9A9E8] text-sm animate-ping absolute bottom-8 left-10">⋆</div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#F5F2FA] font-display">
                  {seedStage === 'falling' && 'Đang gieo mầm tâm tư...'}
                  {seedStage === 'planted' && 'Hạt giống đã bén rễ vào đất ấm! ✨'}
                  {seedStage === 'redirecting' && 'Đang đưa bạn đến Khu Vườn Tellie...'}
                </h3>
                <p className="text-xs text-[#E2E8F0] leading-relaxed max-w-xs mx-auto">
                  Tâm sự của bạn được nâng niu an toàn. Một mầm cây mới vừa được đơm chồi trong khu vườn cảm xúc.
                </p>
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
            <span>📖 Nhật Ký Cảm Xúc & Gieo Mầm</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F2FA] font-display tracking-tight">
            Nơi Tâm Tư Hóa Thành Hạt Mầm
          </h2>
          <p className="text-xs sm:text-sm text-[#E2E8F0] max-w-md leading-relaxed">
            Viết ra những trăn trở hoặc tham gia nghi thức đêm để vỗ về tâm hồn sau một ngày dài học tập.
          </p>
        </div>
      </div>

      {/* TWO PRIMARY ACTION CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* CARD 1: VIẾT TÂM SỰ (Gieo mầm hạt giống) */}
        <div className="glass-panel rounded-3xl p-5 border border-white/15 shadow-xl hover:border-[#B9A9E8]/50 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#B9A9E8]/20 border border-[#B9A9E8]/30 flex items-center justify-center text-[#B9A9E8] shadow-inner">
              <PenLine className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F5F2FA] font-display">
                Viết Tâm Sự (Gieo Hạt)
              </h3>
              <p className="text-xs text-[#E2E8F0] mt-1 leading-relaxed">
                Viết hoặc thu âm giọng nói. Mỗi bài viết sẽ được gieo thành một hạt giống hoa trong Khu Vườn Tellie.
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
            <span>Những mầm tâm sự gần đây của bạn</span>
          </h3>
          <span className="text-xs text-[#B9B5C8] font-medium">
            {myPosts.length} dòng nhật ký
          </span>
        </div>

        {myPosts.length === 0 ? (
          <div className="glass-panel rounded-3xl p-8 border border-white/10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-[#B9B5C8]">
              🌱
            </div>
            <p className="text-xs text-[#E2E8F0] max-w-xs mx-auto">
              Bạn chưa có dòng tâm sự nào được gieo. Hãy bấm "Mở trang viết tâm sự" ở trên để giải tỏa suy nghĩ nhé.
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
