import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Users,
  UserCheck,
  Sprout,
  Heart,
  MessageCircle,
  Sparkles,
  Send,
  X,
  Shield,
  ShieldAlert,
  AlertTriangle,
  LogOut,
  Search,
  Volume2,
  VolumeX,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Post, Comment } from '../types';
import { getMoodById } from '../data/moods';
import { AnonymousBadge } from './AnonymousBadge';
import { TellieGardenView } from './TellieGardenView';
import { sound } from '../utils/audio';
import { speechService } from '../utils/speech';

interface CommunityViewProps {
  initialSubTab?: 'feed' | 'circle' | 'mate' | 'garden';
}

export const CommunityView: React.FC<CommunityViewProps> = ({ initialSubTab = 'feed' }) => {
  const {
    posts,
    toggleReaction,
    addComment,
    userNickname,
    userSpirit,
    openModal
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'feed' | 'circle' | 'mate' | 'garden'>(initialSubTab);

  // Sync if initialSubTab prop changes
  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  // Feed States
  const [feedFilter, setFeedFilter] = useState<'all' | 'my-posts'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCommentPost, setActiveCommentPost] = useState<Post | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [speakingReplyId, setSpeakingReplyId] = useState<string | null>(null);

  // Tellie Circle States
  const [circleWhisper, setCircleWhisper] = useState('');
  const [circleMessages, setCircleMessages] = useState<Array<{ id: string; author: string; spirit: any; text: string }>>([
    {
      id: '1',
      author: 'Sao Băng #99',
      spirit: 'star',
      text: 'Mọi người đã uống nước ấm chưa? Đêm nay học bài nhớ chợp mắt 15 phút nhé.'
    },
    {
      id: '2',
      author: 'Mây Phiêu Lãng',
      spirit: 'cloud',
      text: 'Đêm nay thành phố mưa bay lất phất, ngồi tĩnh lặng thế này thấy bình yên quá.'
    },
    {
      id: '3',
      author: 'Nấm Rừng Nhỏ',
      spirit: 'moon',
      text: 'Cố lên nhé các đồng môn, một mùa thi nữa rồi cũng sẽ vượt qua thôi!'
    }
  ]);

  // Tellie Mate States
  const [mateTopic, setMateTopic] = useState('deadline');
  const [mateStatus, setMateStatus] = useState<'idle' | 'searching' | 'matched'>('idle');
  const [mateMessages, setMateMessages] = useState<Array<{ sender: 'user' | 'mate'; text: string; time: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showEndMatchConfirm, setShowEndMatchConfirm] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  const spiritName = userSpirit?.customName || 'Tellie Spirit';

  // Speech subscriber
  useEffect(() => {
    const unsub = speechService.subscribe((speaking, textId) => {
      if (speaking && textId?.startsWith('tellie-reply-')) {
        setSpeakingReplyId(textId);
      } else if (!speaking) {
        setSpeakingReplyId(null);
      }
    });
    return () => unsub();
  }, []);

  const handleToggleSpeakReply = (postId: string, message: string) => {
    const id = `tellie-reply-${postId}`;
    if (speakingReplyId === id) {
      speechService.stop();
    } else {
      speechService.speak(message, id);
    }
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    if (post.isPrivate && feedFilter !== 'my-posts') return false;
    if (feedFilter === 'my-posts' && post.authorNickname !== userNickname) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchContent = post.content.toLowerCase().includes(q);
      const matchTag = post.hashtags?.some(t => t.toLowerCase().includes(q));
      return matchTitle || matchContent || matchTag;
    }
    return true;
  });

  // Handle Comment
  const handleSendComment = () => {
    if (!commentInput.trim() || !activeCommentPost) return;
    addComment(activeCommentPost.id, commentInput.trim());
    setCommentInput('');
    sound.playChime(600);
  };

  // Handle Circle Whisper
  const handleSendCircleWhisper = () => {
    if (!circleWhisper.trim()) return;
    const newMsg = {
      id: Date.now().toString(),
      author: `${userNickname} (Bạn)`,
      spirit: 'flower',
      text: circleWhisper.trim()
    };
    setCircleMessages(prev => [newMsg, ...prev]);
    setCircleWhisper('');
    sound.playChime(650);
  };

  // Tellie Mate Matching
  const handleStartMatching = () => {
    setMateStatus('searching');
    sound.playChime(520);
    setTimeout(() => {
      setMateStatus('matched');
      sound.playChime(680);
      setMateMessages([
        {
          sender: 'mate',
          text: 'Chào bạn! Mình cũng đang chịu áp lực đồ án tuần này đây. Thật may vì có một nơi an toàn để trò chuyện cùng bạn!',
          time: 'Vừa xong'
        }
      ]);
    }, 2200);
  };

  const handleSendMateMessage = () => {
    if (!chatInput.trim()) return;
    const userText = chatInput.trim();
    const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    setMateMessages(prev => [...prev, { sender: 'user', text: userText, time: now }]);
    setChatInput('');
    sound.playChime(600);

    // Simulated empathetic reply
    setTimeout(() => {
      setMateMessages(prev => [
        ...prev,
        {
          sender: 'mate',
          text: 'Mình hiểu cảm giác đó... Cảm ơn bạn đã sẻ chia thật lòng. Đừng quá khắt khe với bản thân nhé!',
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      sound.playChime(560);
    }, 2000);
  };

  const handleEndMatch = () => {
    setShowEndMatchConfirm(false);
    setMateStatus('idle');
    setMateMessages([]);
    sound.playChime(480);
  };

  const handleReportMate = () => {
    setReportSuccess(true);
    sound.playChime(500);
    setTimeout(() => {
      setReportSuccess(false);
      setShowReportModal(false);
      setMateStatus('idle');
      setMateMessages([]);
    }, 1800);
  };

  return (
    <div className="space-y-6 text-left pb-16 animate-fade-in">
      {/* 4 SUB-TABS SEGMENTED NAVIGATOR */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0F1326] border border-white/10 overflow-x-auto no-scrollbar shadow-lg">
        {[
          { id: 'feed', label: 'Bảng Tâm Sự', icon: MessageSquare },
          { id: 'circle', label: 'Tellie Circle', icon: Users },
          { id: 'mate', label: 'Tellie Mate', icon: UserCheck },
          { id: 'garden', label: 'Tellie Garden', icon: Sprout }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                sound.playChime(520);
                setActiveSubTab(tab.id as any);
              }}
              className={`flex-1 min-h-[44px] px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center justify-center gap-2 ${
                isActive
                  ? 'bg-gradient-to-r from-[#B9A9E8] to-[#91B8E8] text-[#0D0F1D] shadow-md scale-[1.02]'
                  : 'text-[#E2E8F0] hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          SUB-TAB 1: BẢNG TÂM SỰ (FEED)
          - High-contrast white/light gray text
          - HIDE all numerical reaction/comment counts (only show icons)
          - Anonymous emotion badges
          - 2 filter tabs: "Tất cả" & "Tâm sự của tôi"
      ========================================================================= */}
      {activeSubTab === 'feed' && (
        <div className="space-y-5 animate-fade-in">
          {/* Header & Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFeedFilter('all')}
                className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                  feedFilter === 'all'
                    ? 'bg-[#242347] border-[#B9A9E8] text-white shadow-md'
                    : 'bg-[#11152A] border-white/10 text-[#E2E8F0]'
                }`}
              >
                Tất cả tâm sự
              </button>
              <button
                type="button"
                onClick={() => setFeedFilter('my-posts')}
                className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                  feedFilter === 'my-posts'
                    ? 'bg-[#242347] border-[#B9A9E8] text-white shadow-md'
                    : 'bg-[#11152A] border-white/10 text-[#E2E8F0]'
                }`}
              >
                Tâm sự của tôi
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="w-3.5 h-3.5 text-[#B9B5C8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Tìm từ khóa, hashtag..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#11152A] border border-white/15 text-xs text-[#F5F2FA] placeholder-[#858198] focus:outline-none focus:border-[#B9A9E8]"
              />
            </div>
          </div>

          {/* Posts Feed */}
          {filteredPosts.length === 0 ? (
            <div className="glass-panel rounded-3xl p-10 border border-white/10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-[#B9B5C8]">
                💭
              </div>
              <h4 className="text-sm font-bold text-[#F5F2FA]">Chưa có bài viết nào</h4>
              <p className="text-xs text-[#E2E8F0]">
                Hãy là người đầu tiên gieo mầm tâm sự trong tab Nhật Ký nhé.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map(post => {
                const mood = getMoodById(post.moodId);
                const isSpeakingThisReply = speakingReplyId === `tellie-reply-${post.id}`;

                return (
                  <article
                    key={post.id}
                    className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/15 shadow-xl hover:border-[#B9A9E8]/35 transition-all space-y-4 text-left"
                  >
                    {/* Header: Anonymous Badge + Author + Mood Tag */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <AnonymousBadge
                          id={post.authorSpirit}
                          name={post.authorNickname}
                          size="md"
                        />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs sm:text-sm font-extrabold text-[#FFFFFF]">
                              {post.authorNickname}
                            </span>
                            <span className="text-[10px] text-[#A8D2C4] font-medium bg-[#A8D2C4]/15 px-2 py-0.5 rounded-full border border-[#A8D2C4]/25">
                              {post.categoryLabelVi}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mt-1 text-[11px] text-[#CBD5E1]">
                            <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                            {post.hashtags && post.hashtags.length > 0 && (
                              <span className="text-[#A8D2C4] font-semibold">
                                #{post.hashtags[0].replace(/^#/, '')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Mood Tag */}
                      <div
                        className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border shadow-sm shrink-0"
                        style={{
                          backgroundColor: mood.bgColor,
                          borderColor: mood.borderColor,
                          color: mood.color
                        }}
                      >
                        <span>{mood.icon}</span>
                        <span className="text-[11px]">{mood.labelVi}</span>
                      </div>
                    </div>

                    {/* High-Contrast Post Content */}
                    <div className="space-y-1.5">
                      <h3 className="text-base sm:text-lg font-bold text-[#FFFFFF] leading-snug font-display">
                        {post.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#F1F5F9] leading-relaxed whitespace-pre-line font-normal">
                        {post.content}
                      </p>
                    </div>

                    {/* Tellie Reply Section */}
                    {post.tellieReply && (
                      <div className="p-3.5 rounded-2xl bg-[#171A35] border border-[#B9A9E8]/30 flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5 flex-1">
                          <div className="w-7 h-7 rounded-xl bg-[#B9A9E8]/20 border border-[#B9A9E8]/40 flex items-center justify-center shrink-0 mt-0.5 text-[#B9A9E8]">
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#E9EDF5]">
                                {post.tellieReply.spiritName}
                              </span>
                              <span className="text-[10px] text-[#A8D2C4] bg-[#A8D2C4]/20 px-2 py-0.5 rounded-md font-semibold">
                                {post.tellieReply.badgeVi}
                              </span>
                            </div>
                            <p className="text-[#F8FAFC] mt-1 leading-relaxed text-xs italic">
                              "{post.tellieReply.message}"
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleSpeakReply(post.id, post.tellieReply?.message || '')}
                          className={`p-2 rounded-xl transition-all border shrink-0 ${
                            isSpeakingThisReply
                              ? 'bg-[#B9A9E8] text-[#0D1020] border-[#B9A9E8] shadow-md scale-105'
                              : 'bg-white/5 text-[#E2E8F0] border-white/10 hover:text-white'
                          }`}
                          title="Đọc lời vỗ về"
                        >
                          {isSpeakingThisReply ? (
                            <VolumeX className="w-3.5 h-3.5 animate-pulse" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}

                    {/* Action Bar: HIDE ALL NUMERICAL COUNTS (Only Icons + Text) */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                      {/* Gửi ôm: NO NUMBER */}
                      <button
                        type="button"
                        onClick={() => toggleReaction(post.id, 'hug')}
                        className={`min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all border active:scale-95 ${
                          post.userReacted
                            ? 'bg-[#DFAFC8]/30 border-[#DFAFC8] text-[#FFFFFF] font-bold shadow-sm ring-1 ring-[#DFAFC8]'
                            : 'bg-[#11152A] border-white/10 text-[#E2E8F0] hover:text-white hover:border-white/20'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${post.userReacted ? 'fill-[#DFAFC8] text-[#DFAFC8]' : 'text-[#DFAFC8]'}`} />
                        <span>{post.userReacted ? 'Đã gửi ôm' : 'Gửi ôm'}</span>
                      </button>

                      {/* Bình luận: NO NUMBER */}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCommentPost(post);
                          sound.playChime(540);
                        }}
                        className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#11152A] border border-white/10 text-[#E2E8F0] hover:text-white hover:border-white/20 transition-all font-semibold active:scale-95"
                      >
                        <MessageCircle className="w-4 h-4 text-[#91B8E8]" />
                        <span>Bình luận</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Comment Drawer Modal */}
          {activeCommentPost && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0D1B]/90 backdrop-blur-2xl">
              <div className="w-full max-w-lg glass-panel rounded-3xl p-6 border border-white/15 shadow-2xl space-y-4 text-left max-h-[85vh] flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h4 className="text-sm font-bold text-[#F5F2FA]">
                    Bình luận ({activeCommentPost.comments.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() => setActiveCommentPost(null)}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#B9B5C8] hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                  {activeCommentPost.comments.length === 0 ? (
                    <div className="text-center py-6 text-[#858198]">
                      Chưa có lời sẻ chia nào. Hãy để lại vài lời vỗ về nhé.
                    </div>
                  ) : (
                    activeCommentPost.comments.map(c => (
                      <div key={c.id} className="p-3 rounded-2xl bg-[#11152A] border border-white/10 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#F5F2FA]">{c.authorNickname}</span>
                          <span className="text-[10px] text-[#858198]">
                            {new Date(c.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        <p className="text-[#E2E8F0] leading-relaxed">{c.content}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center gap-2">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={e => setCommentInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendComment()}
                    placeholder="Viết lời động viên ấm áp..."
                    className="flex-1 px-4 py-3 rounded-2xl bg-[#11152A] border border-white/15 text-xs text-[#F5F2FA] placeholder-[#858198] focus:outline-none focus:border-[#B9A9E8]"
                  />
                  <button
                    type="button"
                    onClick={handleSendComment}
                    className="px-4 py-3 rounded-2xl bg-[#B9A9E8] text-[#0D1020] font-bold text-xs hover:opacity-90 active:scale-95 transition-all"
                  >
                    Gửi
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 2: TELLIE CIRCLE (NODE GRAPH CONSTELLATION)
          - Node Graph visualization: small peer group of 3-5 connected members
          - Constellation lines, soft glow, no clustered full mascot bodies
      ========================================================================= */}
      {activeSubTab === 'circle' && (
        <div className="space-y-6 animate-fade-in">
          {/* Constellation Canvas Card */}
          <div className="relative rounded-3xl p-6 sm:p-7 border border-[#B9A9E8]/25 shadow-2xl overflow-hidden bg-gradient-to-b from-[#141836] via-[#1A1D3D] to-[#0D1020]">
            <div className="relative z-10 text-center space-y-1 mb-4">
              <span className="text-[11px] font-bold text-[#A8D2C4] uppercase tracking-wider">
                Vòng tròn kết nối đồng điệu
              </span>
              <h3 className="text-xl font-extrabold text-[#F5F2FA] font-display">
                Tellie Circle · Mạng Lưới Vì Sao
              </h3>
              <p className="text-xs text-[#E2E8F0] max-w-sm mx-auto">
                Nhóm nhỏ 3-5 bạn sinh viên cùng chia sẻ một không gian bình an, không đánh giá.
              </p>
            </div>

            {/* Constellation Canvas with Connecting Lines */}
            <div className="relative w-full h-72 sm:h-80 mx-auto overflow-hidden rounded-2xl border border-white/5 bg-[#090C19]/80">
              {/* SVG Connecting Constellation Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                {/* Lines between nodes */}
                <line x1="22%" y1="26%" x2="50%" y2="18%" stroke="rgba(185, 169, 232, 0.45)" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="50%" y1="18%" x2="78%" y2="34%" stroke="rgba(145, 184, 232, 0.45)" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="78%" y1="34%" x2="68%" y2="72%" stroke="rgba(168, 210, 196, 0.45)" strokeWidth="1.5" />
                <line x1="68%" y1="72%" x2="32%" y2="74%" stroke="rgba(223, 175, 200, 0.55)" strokeWidth="2" />
                <line x1="32%" y1="74%" x2="22%" y2="26%" stroke="rgba(185, 169, 232, 0.45)" strokeWidth="1.5" />
                <line x1="32%" y1="74%" x2="50%" y2="18%" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1" strokeDasharray="4 4" />
              </svg>

              {/* NODE 1: Sao Băng #99 */}
              <div className="absolute top-[26%] left-[22%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <AnonymousBadge type="star" size="md" className="ring-2 ring-[#B9A9E8]/40 shadow-lg" />
                <span className="mt-1.5 px-2 py-0.5 rounded-full bg-[#11152A] border border-white/10 text-[10px] font-bold text-[#E2E8F0]">
                  Sao Băng #99
                </span>
              </div>

              {/* NODE 2: Trăng Khuya */}
              <div className="absolute top-[18%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <AnonymousBadge type="moon" size="md" className="ring-2 ring-[#FFFEE8]/40 shadow-lg" />
                <span className="mt-1.5 px-2 py-0.5 rounded-full bg-[#11152A] border border-white/10 text-[10px] font-bold text-[#E2E8F0]">
                  Trăng Khuya
                </span>
              </div>

              {/* NODE 3: Mây Phiêu Lãng */}
              <div className="absolute top-[34%] left-[78%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <AnonymousBadge type="cloud" size="md" className="ring-2 ring-[#91B8E8]/40 shadow-lg" />
                <span className="mt-1.5 px-2 py-0.5 rounded-full bg-[#11152A] border border-white/10 text-[10px] font-bold text-[#E2E8F0]">
                  Mây Phiêu Lãng
                </span>
              </div>

              {/* NODE 4: Nấm Rừng Nhỏ */}
              <div className="absolute top-[72%] left-[68%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <AnonymousBadge type="crystal" size="md" className="ring-2 ring-[#A8D2C4]/40 shadow-lg" />
                <span className="mt-1.5 px-2 py-0.5 rounded-full bg-[#11152A] border border-white/10 text-[10px] font-bold text-[#E2E8F0]">
                  Nấm Rừng Nhỏ
                </span>
              </div>

              {/* NODE 5: User's Node (Bạn) - Prominent and glowing */}
              <div className="absolute top-[74%] left-[32%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="relative flex items-center justify-center">
                  <span className="absolute -inset-3 rounded-full border border-[#DFAFC8]/40 animate-pulse" />
                  <AnonymousBadge type="flower" size="md" className="ring-4 ring-[#DFAFC8]/70 shadow-2xl" />
                </div>
                <span className="mt-1.5 px-2.5 py-0.5 rounded-full bg-[#241E38] border border-[#DFAFC8]/50 text-[10px] font-extrabold text-[#FFFFFF] shadow-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DFAFC8] animate-pulse" />
                  <span>{spiritName} (Bạn)</span>
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 text-center">
              <span className="text-xs font-bold text-[#F5F2FA]">
                “Những tâm hồn đang tìm thấy nhau.”
              </span>
            </div>
          </div>

          {/* Gentle Whispers Feed */}
          <div className="glass-panel rounded-3xl p-5 border border-white/15 space-y-4 shadow-xl">
            <h4 className="text-xs font-bold text-[#F5F2FA] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#B9A9E8]" />
              <span>Lời thì thầm trong vòng tròn</span>
            </h4>

            <div className="space-y-2.5 max-h-44 overflow-y-auto pr-1 text-xs">
              {circleMessages.map(msg => (
                <div key={msg.id} className="p-3.5 rounded-2xl bg-[#11152A] border border-white/10 flex items-start gap-3">
                  <AnonymousBadge id={msg.spirit} name={msg.author} size="xs" className="mt-0.5 shrink-0" />
                  <div>
                    <span className="font-extrabold text-[#F5F2FA] text-xs">{msg.author}: </span>
                    <span className="text-[#E2E8F0] leading-relaxed text-xs">{msg.text}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center gap-2">
              <input
                type="text"
                value={circleWhisper}
                onChange={e => setCircleWhisper(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendCircleWhisper()}
                placeholder="Gửi một lời thì thầm vỗ về vào vòng tròn..."
                className="flex-1 px-4 py-3 rounded-2xl bg-[#11152A] border border-white/15 text-xs text-[#F5F2FA] placeholder-[#858198] focus:outline-none focus:border-[#91B8E8]"
              />
              <button
                type="button"
                onClick={handleSendCircleWhisper}
                className="px-4 py-3 rounded-2xl bg-[#91B8E8] text-[#0D1020] text-xs font-bold hover:opacity-90 transition-all"
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 3: TELLIE MATE (1-ON-1 MATCHING)
          - Separated from Node Graph
          - Clean 1-on-1 matching/chat interface
          - MANDATORY: Prominent "End Match" and "Report" buttons for user safety
      ========================================================================= */}
      {activeSubTab === 'mate' && (
        <div className="space-y-5 animate-fade-in">
          {/* Safety Notice */}
          <div className="p-3.5 rounded-2xl bg-[#171A35] border border-[#A8D2C4]/30 flex items-center gap-2.5 text-xs text-[#E2E8F0]">
            <Shield className="w-4 h-4 text-[#A8D2C4] shrink-0" />
            <span>
              Tellie Mate là không gian <strong>đồng hành và lắng nghe ẩn danh</strong>. Tuyệt đối không phục vụ mục đích hẹn hò.
            </span>
          </div>

          {/* IDLE STATE: TOPIC SELECTOR & START BUTTON */}
          {mateStatus === 'idle' && (
            <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/15 space-y-5 text-center">
              <div className="w-16 h-16 rounded-3xl bg-[#B9A9E8]/20 border border-[#B9A9E8]/40 flex items-center justify-center mx-auto text-[#B9A9E8] shadow-inner">
                <UserCheck className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-[#F5F2FA] font-display">
                  Ghép Đôi Bạn Lắng Nghe Ẩn Danh (1-on-1)
                </h3>
                <p className="text-xs text-[#E2E8F0] mt-1 max-w-sm mx-auto leading-relaxed">
                  Hệ thống kết nối bạn với một sinh viên khác có chung trăn trở để sẻ chia an toàn.
                </p>
              </div>

              <div className="space-y-2 text-left pt-2">
                <label className="text-xs font-bold text-[#F5F2FA] uppercase tracking-wider block">
                  Chọn chủ đề muốn sẻ chia đêm nay:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'deadline', label: 'Áp lực thi cử & Deadline', icon: '📚' },
                    { id: 'homesick', label: 'Sinh viên xa nhà & Cô đơn', icon: '🏡' },
                    { id: 'overthinking', label: 'Overthinking đêm muộn', icon: '🌙' },
                    { id: 'career', label: 'Định hướng & Thực tập', icon: '🧭' }
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setMateTopic(t.id)}
                      className={`min-h-[48px] p-3 rounded-2xl border text-left text-xs transition-all flex items-center gap-2.5 ${
                        mateTopic === t.id
                          ? 'bg-[#242347] border-[#B9A9E8] text-[#FFFFFF] font-bold shadow-lg ring-1 ring-[#B9A9E8]'
                          : 'bg-[#11152A] border-white/10 text-[#E2E8F0] hover:border-white/20'
                      }`}
                    >
                      <span className="text-lg">{t.icon}</span>
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleStartMatching}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#B9A9E8] to-[#91B8E8] text-[#0D0F1D] font-extrabold text-sm tracking-wide shadow-xl hover:opacity-95 active:scale-98 transition-all"
              >
                Bắt đầu tìm bạn đồng hành
              </button>
            </div>
          )}

          {/* SEARCHING STATE */}
          {mateStatus === 'searching' && (
            <div className="glass-panel rounded-3xl p-8 text-center space-y-6">
              <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-[#B9A9E8]/30 animate-ping" />
                <div className="absolute inset-4 rounded-full border border-[#91B8E8]/40 animate-pulse" />
                <span className="text-3xl">✨</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#F5F2FA] font-display">
                  Đang tìm kiếm người bạn đồng cảm...
                </h3>
                <p className="text-xs text-[#E2E8F0]">
                  Đang kết nối cùng các bạn sinh viên trực tuyến...
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMateStatus('idle')}
                className="px-5 py-2 rounded-xl bg-white/10 text-xs text-[#E2E8F0] hover:text-white"
              >
                Hủy tìm kiếm
              </button>
            </div>
          )}

          {/* MATCHED STATE: 1-ON-1 CHAT WITH MANDATORY SAFETY BUTTONS */}
          {mateStatus === 'matched' && (
            <div className="glass-panel rounded-3xl p-5 border border-white/15 space-y-4">
              {/* MANDATORY SAFETY ACTION BAR (TOP OF CHAT) */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <AnonymousBadge type="cloud" name="Bạn Cú Mèo #342" size="sm" />
                  <div>
                    <h4 className="text-xs font-bold text-[#F5F2FA]">Bạn Cú Mèo #342</h4>
                    <span className="text-[10px] text-[#A8D2C4] font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A8D2C4] animate-pulse" />
                      <span>Đang trực tuyến · Đồng cảm</span>
                    </span>
                  </div>
                </div>

                {/* MANDATORY PROMINENT SAFETY BUTTONS: END MATCH & REPORT */}
                <div className="flex items-center gap-2">
                  {/* PROMINENT REPORT BUTTON */}
                  <button
                    type="button"
                    onClick={() => setShowReportModal(true)}
                    className="min-h-[36px] px-3 py-1.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                    title="Báo cáo vi phạm hoặc quấy rối"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Báo cáo</span>
                  </button>

                  {/* PROMINENT END MATCH BUTTON */}
                  <button
                    type="button"
                    onClick={() => setShowEndMatchConfirm(true)}
                    className="min-h-[36px] px-3 py-1.5 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500/40 text-rose-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                    title="Kết thúc kết nối ngay lập tức"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Kết thúc</span>
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="h-64 overflow-y-auto space-y-3 pr-1 text-xs">
                {mateMessages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-gradient-to-r from-[#B9A9E8] to-[#91B8E8] text-[#0D1020] font-semibold rounded-br-none shadow-md'
                          : 'bg-[#171A35] text-[#F8FAFC] border border-white/10 rounded-bl-none shadow-sm'
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[10px] text-[#CBD5E1] mt-0.5 px-1">{m.time}</span>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="pt-2 border-t border-white/10 flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMateMessage()}
                  placeholder="Gửi tin nhắn chia sẻ cùng bạn..."
                  className="flex-1 px-4 py-3 rounded-2xl bg-[#11152A] border border-white/15 text-xs text-[#F5F2FA] placeholder-[#858198] focus:outline-none focus:border-[#B9A9E8]"
                />
                <button
                  type="button"
                  onClick={handleSendMateMessage}
                  className="w-10 h-10 rounded-2xl bg-[#B9A9E8] text-[#0D1020] flex items-center justify-center font-bold active:scale-95 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* CONFIRMATION MODAL: END MATCH */}
          {showEndMatchConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
              <div className="w-full max-w-sm rounded-3xl bg-[#11152A] border border-rose-500/30 p-6 text-center space-y-4 shadow-2xl">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                  <LogOut className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#F5F2FA]">Kết thúc phiên trò chuyện?</h4>
                  <p className="text-xs text-[#E2E8F0] mt-1.5 leading-relaxed">
                    Hành động này sẽ đóng phòng chat và ngắt kết nối an toàn ngay lập tức.
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEndMatchConfirm(false)}
                    className="flex-1 py-2.5 rounded-xl bg-white/10 text-xs font-semibold text-[#E2E8F0]"
                  >
                    Ở lại
                  </button>
                  <button
                    type="button"
                    onClick={handleEndMatch}
                    className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg"
                  >
                    Xác nhận kết thúc
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CONFIRMATION MODAL: REPORT */}
          {showReportModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
              <div className="w-full max-w-sm rounded-3xl bg-[#11152A] border border-amber-500/30 p-6 text-center space-y-4 shadow-2xl">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#F5F2FA]">Báo cáo an toàn</h4>
                  <p className="text-xs text-[#E2E8F0] mt-1.5 leading-relaxed">
                    Bạn cảm thấy không an toàn hoặc phát hiện hành vi độc hại? Chúng tôi sẽ ngắt kết nối và bảo vệ bạn.
                  </p>
                </div>

                {reportSuccess ? (
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                    ✓ Đã ghi nhận báo cáo. Bạn đã được đưa về nơi an toàn.
                  </div>
                ) : (
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowReportModal(false)}
                      className="flex-1 py-2.5 rounded-xl bg-white/10 text-xs font-semibold text-[#E2E8F0]"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="button"
                      onClick={handleReportMate}
                      className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-[#0D1020] font-bold text-xs shadow-lg"
                    >
                      Gửi báo cáo & Rời phòng
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 4: TELLIE GARDEN (SEAMLESSLY LINKED FROM TAB 2)
      ========================================================================= */}
      {activeSubTab === 'garden' && (
        <div className="animate-fade-in">
          <TellieGardenView />
        </div>
      )}
    </div>
  );
};
