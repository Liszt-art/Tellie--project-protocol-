import React, { useState, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Plus,
  Send,
  X,
  Lock,
  Sparkles,
  ShieldCheck,
  Search,
  Volume2,
  VolumeX,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Post, Comment } from '../types';
import { getMoodById } from '../data/moods';
import { AnonymousBadge } from './AnonymousBadge';
import { sound } from '../utils/audio';
import { speechService } from '../utils/speech';

export const ListenView: React.FC = () => {
  const { posts, toggleReaction, addComment, openModal, userNickname } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'my-posts'>('all');
  const [activeCommentPost, setActiveCommentPost] = useState<Post | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [speakingReplyId, setSpeakingReplyId] = useState<string | null>(null);

  // Subscribe to speech synthesis state
  useEffect(() => {
    const unsub = speechService.subscribe((speaking, textId) => {
      if (speaking && textId?.startsWith('tellie-reply-')) {
        setSpeakingReplyId(textId);
      } else if (!speaking) {
        setSpeakingReplyId(null);
      }
    });
    return () => {
      unsub();
    };
  }, []);

  const handleToggleSpeakReply = (postId: string, message: string) => {
    const id = `tellie-reply-${postId}`;
    if (speakingReplyId === id) {
      speechService.stop();
    } else {
      speechService.speak(message, id);
    }
  };

  // Filter posts: 2 tabs (Tất cả & Tâm sự của tôi)
  const filteredPosts = posts.filter(post => {
    if (post.isPrivate && activeTab !== 'my-posts') {
      return false;
    }
    if (activeTab === 'my-posts' && post.authorNickname !== userNickname) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchHashtags = post.hashtags?.some(h => h.toLowerCase().includes(q.replace(/^#/, '')));
      return (
        post.title.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q) ||
        matchHashtags
      );
    }

    return true;
  });

  const handleSendComment = () => {
    if (!commentInput.trim() || !activeCommentPost) return;
    addComment(activeCommentPost.id, commentInput.trim());
    setCommentInput('');
    const updatedPost = posts.find(p => p.id === activeCommentPost.id);
    if (updatedPost) {
      setActiveCommentPost(updatedPost);
    }
  };

  return (
    <div className="space-y-4 text-left">
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#171A35] border border-[#B9A9E8]/20 text-[#B9A9E8] text-xs font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#A8D2C4]" />
            <span>KHÔNG PHÁN XÉT · HOÀN TOÀN ẨN DANH</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#F5F2FA] font-display">
            Bảng Tâm Sự
          </h1>
          <p className="text-xs text-[#B9B5C8] mt-0.5">
            Lắng nghe và trải lòng cùng các bạn sinh viên trong sự thấu hiểu.
          </p>
        </div>

        {/* Viết tâm sự CTA */}
        <button
          onClick={() => openModal('writePost')}
          className="py-2.5 px-4 rounded-2xl bg-gradient-to-r from-[#B9A9E8] to-[#91B8E8] text-[#0D1020] text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-[#B9A9E8]/20 hover:opacity-95 active:scale-95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Viết tâm sự</span>
        </button>
      </div>

      {/* Search & Topic Tabs */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#858198]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm tâm sự theo từ khóa..."
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-[#11152A] border border-white/5 text-xs text-[#F5F2FA] placeholder-[#858198] focus:outline-none focus:border-[#B9A9E8]"
          />
        </div>

        {/* Filter buttons: Exactly 2 tabs per Requirement 4 */}
        <div className="flex items-center gap-2 pb-1 text-xs">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'my-posts', label: 'Tâm sự của tôi' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                sound.playChime(500);
              }}
              className={`px-4 py-1.5 rounded-xl transition-all border ${
                activeTab === tab.id
                  ? 'bg-[#242347] border-[#B9A9E8] text-[#F5F2FA] font-bold shadow-md shadow-[#B9A9E8]/20'
                  : 'bg-[#11152A]/80 border-white/5 text-[#858198] hover:text-[#B9B5C8]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="p-8 text-center glass-panel rounded-3xl border border-white/5">
            <p className="text-sm text-[#F5F2FA] font-bold">Không có bài viết nào phù hợp.</p>
            <p className="text-xs text-[#858198] mt-1">Hãy là người đầu tiên trải lòng nhé.</p>
            <button
              onClick={() => openModal('writePost')}
              className="mt-3 px-4 py-2 rounded-xl bg-[#B9A9E8] text-[#0D1020] text-xs font-bold"
            >
              Viết tâm sự ngay
            </button>
          </div>
        ) : (
          filteredPosts.map(post => {
            const mood = getMoodById(post.moodId);
            const isSpeakingThisReply = speakingReplyId === `tellie-reply-${post.id}`;

            return (
              <div
                key={post.id}
                className="glass-panel rounded-3xl p-5 border border-white/10 shadow-xl transition-all hover:border-[#B9A9E8]/35 space-y-3.5 relative overflow-hidden"
              >
                {/* Author & Header Metadata */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2.5">
                    <AnonymousBadge id={post.authorSpirit} name={post.authorNickname} size="md" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#F5F2FA]">
                          {post.authorNickname}
                        </span>
                        {post.isPrivate && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-[#A8D2C4] bg-[#A8D2C4]/15 px-2 py-0.5 rounded-md font-semibold">
                            <Lock className="w-2.5 h-2.5" /> Riêng tư
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#858198] flex items-center gap-1.5 flex-wrap mt-0.5">
                        <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                        <span>·</span>
                        <span>{post.categoryLabelVi}</span>
                        {post.hashtags && post.hashtags.length > 0 && (
                          <div className="flex items-center gap-1 flex-wrap">
                            {post.hashtags.map((h, idx) => (
                              <span
                                key={idx}
                                className="text-[#A8D2C4] bg-[#A8D2C4]/15 border border-[#A8D2C4]/25 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                              >
                                #{h.replace(/^#/, '')}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mood Tag */}
                  <div
                    className="flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold border shadow-sm"
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

                {/* Post Content */}
                <div className="relative z-10">
                  <h3 className="text-base font-bold text-[#F5F2FA] leading-snug font-display">
                    {post.title}
                  </h3>
                  <p className="text-xs text-[#B9B5C8] mt-1.5 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>
                </div>

                {/* Tellie Reply Section (Empathetic & Supportive + Voice Synthesis Speaker Button) */}
                {post.tellieReply && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#171A35] via-[#211F42] to-[#1A1A38] border border-[#B9A9E8]/25 flex items-start justify-between gap-3 relative z-10 shadow-sm">
                    <div className="flex items-start gap-2.5 flex-1">
                      <div className="w-7 h-7 rounded-xl bg-[#B9A9E8]/20 border border-[#B9A9E8]/40 flex items-center justify-center shrink-0 mt-0.5 text-[#B9A9E8]">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#B9A9E8]">
                            {post.tellieReply.spiritName}
                          </span>
                          <span className="text-[10px] text-[#A8D2C4] bg-[#A8D2C4]/15 px-2 py-0.2 rounded-md font-semibold">
                            {post.tellieReply.badgeVi}
                          </span>
                        </div>
                        <p className="text-[#F5F2FA]/90 mt-1 leading-relaxed text-[11px] italic">
                          "{post.tellieReply.message}"
                        </p>
                      </div>
                    </div>

                    {/* Small speaker button to read Tellie Reply aloud */}
                    <button
                      onClick={() => handleToggleSpeakReply(post.id, post.tellieReply?.message || '')}
                      className={`p-2 rounded-xl transition-all border shrink-0 ${
                        isSpeakingThisReply
                          ? 'bg-[#B9A9E8] text-[#0D1020] border-[#B9A9E8] shadow-md shadow-[#B9A9E8]/30 scale-105'
                          : 'bg-white/5 text-[#858198] border-white/5 hover:text-white hover:bg-white/10'
                      }`}
                      title={isSpeakingThisReply ? 'Dừng đọc' : 'Đọc lời hồi đáp của Tellie'}
                    >
                      {isSpeakingThisReply ? (
                        <VolumeX className="w-3.5 h-3.5 animate-pulse" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}

                {/* Action Bar: Reactions & Comments */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs relative z-10">
                  {/* Supportive Reaction Button */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleReaction(post.id, 'hug')}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all border ${
                        post.userReacted
                          ? 'bg-[#DFAFC8]/25 border-[#DFAFC8] text-[#DFAFC8] font-bold shadow-sm'
                          : 'bg-[#11152A] border-white/5 text-[#858198] hover:text-[#B9B5C8]'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${post.userReacted ? 'fill-current' : ''}`} />
                      <span>{post.userReacted ? 'Đã gửi ôm' : 'Gửi ôm'}</span>
                      <span className="text-[11px] font-mono ml-0.5">({post.supportiveCount})</span>
                    </button>
                  </div>

                  {/* Comment Drawer Button */}
                  <button
                    onClick={() => {
                      setActiveCommentPost(post);
                      sound.playChime(540);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#11152A] border border-white/5 text-[#858198] hover:text-[#F5F2FA] transition-colors font-medium"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Bình luận</span>
                    <span className="text-[11px] font-mono">({post.comments.length})</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Comment Bottom Sheet strictly conforming to requirements:
          Header: Bình luận
          Input: Bình luận điều gì đó…
          Button: Gửi
      */}
      {activeCommentPost && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#070914]/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#11152A] border-t border-[#B9A9E8]/30 rounded-t-3xl p-5 shadow-2xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Drag Handle */}
            <div className="w-10 h-1 bg-[#858198]/40 rounded-full mx-auto mb-3" />

            {/* Header: Bình luận */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-[#F5F2FA] font-display">
                  Bình luận
                </h3>
                <p className="text-[11px] text-[#858198]">
                  Góp ý chân thành, lắng nghe không phán xét
                </p>
              </div>
              <button
                onClick={() => setActiveCommentPost(null)}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#B9B5C8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2.5 min-h-[160px] max-h-[300px] pr-1">
              {activeCommentPost.comments.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#858198]">
                  Chưa có bình luận nào. Hãy gửi một lời vỗ về ấm áp nhé.
                </div>
              ) : (
                activeCommentPost.comments.map(c => (
                  <div key={c.id} className="p-3 rounded-2xl bg-[#171A35] border border-white/5 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AnonymousBadge id={c.authorAvatar} name={c.authorNickname} size="xs" />
                        <span className="font-semibold text-[#F5F2FA] text-[11px]">
                          {c.authorNickname}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#858198]">
                        {new Date(c.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[#B9B5C8] pl-6 text-xs leading-relaxed">
                      {c.content}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Comment Input strictly: Bình luận điều gì đó… & Gửi */}
            <div className="pt-3 border-t border-white/10 flex items-center gap-2">
              <input
                type="text"
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendComment()}
                placeholder="Bình luận điều gì đó…"
                className="flex-1 bg-[#171A35] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-[#F5F2FA] placeholder-[#858198] focus:outline-none focus:border-[#B9A9E8]"
              />
              <button
                onClick={handleSendComment}
                disabled={!commentInput.trim()}
                className="px-4 py-2.5 rounded-2xl bg-[#B9A9E8] text-[#0D1020] text-xs font-bold hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 flex items-center gap-1"
              >
                <span>Gửi</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
