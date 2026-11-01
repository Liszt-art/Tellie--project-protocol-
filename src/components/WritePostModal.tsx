import React, { useState, useEffect } from 'react';
import { X, Send, Lock, Sparkles, Mic, MicOff, AlertCircle } from 'lucide-react';
import { MOODS_LIST } from '../data/moods';
import { MoodId, Post } from '../types';
import { useApp } from '../context/AppContext';
import { sound } from '../utils/audio';
import { createSpeechRecognizer } from '../utils/speech';

interface WritePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WritePostModal: React.FC<WritePostModalProps> = ({ isOpen, onClose }) => {
  const { createPost, todayMood } = useApp();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hashtagInput, setHashtagInput] = useState('');
  const [selectedMood, setSelectedMood] = useState<MoodId>(todayMood || 'calm');
  const [category, setCategory] = useState<Post['category']>('chung');

  // Speech Recognition state
  const [isRecording, setIsRecording] = useState(false);
  const [recognizer, setRecognizer] = useState<any>(null);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      if (recognizer) {
        try { recognizer.stop(); } catch {}
      }
      setIsRecording(false);
      setVoiceNotice(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
        setContent(prev => (prev ? `${prev} ${transcript}` : transcript));
      },
      (err: string) => {
        setVoiceNotice('Trình duyệt của bạn đang giới hạn microphone hoặc chưa hỗ trợ nhận diện giọng nói tiếng Việt.');
        setIsRecording(false);
      },
      () => {
        setIsRecording(false);
      }
    );

    if (!rec) {
      setVoiceNotice('Trình duyệt chưa hỗ trợ ghi âm trực tiếp. Bạn hãy gõ phím nhé.');
      return;
    }

    try {
      rec.start();
      setRecognizer(rec);
      setIsRecording(true);
      setVoiceNotice('Đang lắng nghe giọng nói của bạn... Hãy nói tự nhiên nhé.');
      sound.playChime(640);
    } catch {
      setVoiceNotice('Không thể khởi động microphone lúc này.');
    }
  };

  const handleSubmit = (isPrivate: boolean) => {
    if (!title.trim() || !content.trim()) return;

    const parsedHashtags = hashtagInput
      .split(/[\s,]+/)
      .map(tag => tag.trim().replace(/^#/, ''))
      .filter(Boolean);

    createPost({
      title: title.trim(),
      content: content.trim(),
      moodId: selectedMood,
      category,
      hashtags: parsedHashtags,
      isPrivate
    });

    setTitle('');
    setContent('');
    setHashtagInput('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-[#0A0D1B]/95 backdrop-blur-2xl overflow-y-auto">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-5 md:p-7 border border-[#B9A9E8]/25 shadow-2xl my-auto text-left">
        <div className="flex items-center justify-between mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#171A35] border border-[#B9A9E8]/20 text-[#B9A9E8] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KHÔNG GIAN NÓI RA</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#B9B5C8] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-[#F5F2FA] font-display">
          Viết Tâm Sự
        </h2>
        <p className="text-xs text-[#B9B5C8] mt-1">
          Hoàn toàn ẩn danh. Bạn có thể chọn chia sẻ cùng cộng đồng hoặc cất giữ riêng cho mình.
        </p>

        <div className="space-y-3.5 mt-4">
          {/* Mood Selector */}
          <div>
            <label className="block text-xs font-bold text-[#858198] uppercase tracking-wider mb-2">
              Tâm trạng lúc này
            </label>
            <div className="grid grid-cols-4 gap-2">
              {MOODS_LIST.slice(0, 4).concat(MOODS_LIST.slice(4, 8)).map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setSelectedMood(m.id);
                    sound.playChime(480);
                  }}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    selectedMood === m.id
                      ? 'bg-[#242347] border-[#B9A9E8] text-[#F5F2FA] font-bold shadow-md ring-1 ring-[#B9A9E8]'
                      : 'bg-[#11152A] border-white/5 text-[#858198] hover:text-[#B9B5C8]'
                  }`}
                >
                  <span className="text-base block">{m.icon}</span>
                  <span className="text-[11px] font-medium block truncate mt-0.5">{m.labelVi}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-[#858198] uppercase tracking-wider mb-2">
              Chủ đề
            </label>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {[
                { id: 'hoc-tap', label: 'Học tập & Tương lai' },
                { id: 'gia-dinh', label: 'Gia đình & Xa nhà' },
                { id: 'tinh-cam', label: 'Tình cảm & Bạn bè' },
                { id: 'ban-than', label: 'Bản thân' },
                { id: 'chung', label: 'Khác' }
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id as any)}
                  className={`px-3 py-1.5 rounded-xl border transition-colors ${
                    category === cat.id
                      ? 'bg-[#B9A9E8]/20 border-[#B9A9E8] text-[#F5F2FA] font-semibold'
                      : 'bg-[#11152A] border-white/5 text-[#858198]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-[#858198] uppercase tracking-wider mb-1.5">
              Tiêu đề
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Một câu tóm gọn nỗi lòng của bạn..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#11152A] border border-white/10 text-xs text-[#F5F2FA] placeholder-[#858198] focus:outline-none focus:border-[#B9A9E8]"
            />
          </div>

          {/* Content with Voice Dictation Button */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[#858198] uppercase tracking-wider">
                Nội dung tâm sự
              </label>

              {/* Voice-to-Text Microphone Button */}
              <button
                type="button"
                onClick={handleToggleVoiceDictation}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all border ${
                  isRecording
                    ? 'bg-rose-500/20 border-rose-400 text-rose-300 animate-pulse'
                    : 'bg-white/5 border-white/10 text-[#B9B5C8] hover:text-white'
                }`}
                title="Đọc bằng giọng nói để nhập liệu"
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5 text-rose-400" /> : <Mic className="w-3.5 h-3.5 text-[#B9A9E8]" />}
                <span>{isRecording ? 'Đang ghi âm...' : 'Nói để viết'}</span>
              </button>
            </div>

            {voiceNotice && (
              <div className="mb-2 p-2 rounded-xl bg-[#171A35] border border-white/10 text-[11px] text-[#A8D2C4] flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{voiceNotice}</span>
              </div>
            )}

            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={5}
              placeholder="Cứ tự nhiên viết ra hoặc bật micro để trải lòng. Nơi đây không có ai phán xét bạn..."
              className="w-full p-4 rounded-xl bg-[#11152A] border border-white/10 text-xs text-[#F5F2FA] placeholder-[#858198] focus:outline-none focus:border-[#B9A9E8] leading-relaxed resize-none"
            />
          </div>

          {/* Hashtags */}
          <div>
            <label className="block text-xs font-bold text-[#858198] uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Hashtag chủ đề</span>
              <span className="text-[10px] text-[#A8D2C4] font-normal">Cách nhau bằng dấu cách hoặc dấu phẩy</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8D2C4] font-bold text-xs">#</span>
              <input
                type="text"
                value={hashtagInput}
                onChange={e => setHashtagInput(e.target.value)}
                placeholder="apluc, thicu, xanha, canbang, overthinking..."
                className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#11152A] border border-white/10 text-xs text-[#F5F2FA] placeholder-[#858198] focus:outline-none focus:border-[#A8D2C4]"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons: Đăng tâm sự AND Lưu riêng tư */}
        <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={!title.trim() || !content.trim()}
            className="py-3 px-4 rounded-2xl bg-[#171A35] hover:bg-[#242347] border border-white/10 text-xs font-bold text-[#F5F2FA] flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-40"
          >
            <Lock className="w-3.5 h-3.5 text-[#B9A9E8]" />
            <span>Lưu riêng tư</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={!title.trim() || !content.trim()}
            className="py-3 px-4 rounded-2xl bg-gradient-to-r from-[#B9A9E8] to-[#91B8E8] text-[#0D1020] text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-[#B9A9E8]/20 disabled:opacity-40"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Đăng tâm sự</span>
          </button>
        </div>
      </div>
    </div>
  );
};
