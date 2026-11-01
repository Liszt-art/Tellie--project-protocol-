import React, { useState } from 'react';
import { Users, UserCheck, Sparkles, Send, ArrowLeft, Heart, Shield, Radio, Moon } from 'lucide-react';
import { SpiritAvatar } from './SpiritAvatar';
import { AnonymousBadge } from './AnonymousBadge';
import { useApp } from '../context/AppContext';
import { sound } from '../utils/audio';

export const ConnectView: React.FC = () => {
  const { userSpirit } = useApp();
  const [section, setSection] = useState<'mate' | 'circle'>('circle');

  // Tellie Mate states
  const [mateTopic, setMateTopic] = useState('deadline');
  const [mateStatus, setMateStatus] = useState<'idle' | 'searching' | 'matched'>('idle');
  const [mateMessages, setMateMessages] = useState<Array<{ sender: 'user' | 'mate'; text: string; time: string }>>([]);
  const [chatInput, setChatInput] = useState('');

  // Tellie Circle states
  const [circleWhisper, setCircleWhisper] = useState('');
  const [circleMessages, setCircleMessages] = useState<Array<{ id: string; author: string; spirit: any; text: string }>>([
    {
      id: '1',
      author: 'Sao Băng #99',
      spirit: 'star',
      text: 'Mọi người đã uống nước ấm chưa? Nhớ chăm sóc cổ họng nhé.'
    },
    {
      id: '2',
      author: 'Mây Phiêu Lãng',
      spirit: 'cloud',
      text: 'Đêm nay mưa bay lất phất, ngồi tĩnh lặng thế này thấy bình yên quá.'
    },
    {
      id: '3',
      author: 'Hạt Mưa Đêm',
      spirit: 'moon',
      text: 'Cố lên nhé các đồng môn, một kỳ thi nữa rồi cũng sẽ qua thôi.'
    }
  ]);

  const currentSpiritId = userSpirit ? userSpirit.spiritId : 'bunny';
  const spiritName = userSpirit?.customName || 'Tinh linh của bạn';

  // Tellie Mate Matching simulation
  const handleStartMatching = () => {
    setMateStatus('searching');
    sound.playChime(520);

    setTimeout(() => {
      setMateStatus('matched');
      sound.playChime(680);
      setMateMessages([
        {
          sender: 'mate',
          text: 'Chào bạn! Mình cũng đang bị deadline đồ án dí sát nút đây. Thấy bạn chọn chủ đề này nên mừng ghê, có người cùng cảnh ngộ!',
          time: 'Vừa xong'
        }
      ]);
    }, 2400);
  };

  const handleSendMateMessage = () => {
    if (!chatInput.trim()) return;
    const userText = chatInput.trim();
    const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    setMateMessages(prev => [...prev, { sender: 'user', text: userText, time: now }]);
    setChatInput('');
    sound.playChime(600);

    setTimeout(() => {
      const replies = [
        'Đúng thật đấy! Mình cũng hay lo trước như vậy, nhưng làm xong rồi mới thấy nhẹ cả người.',
        'Hôm nay bạn đã ôn tập được nhiều chưa? Có gì khó hiểu không?',
        'Nhớ giữ sức khỏe nhé bạn ơi, đừng thức trắng đêm liên tục nha.'
      ];
      const r = replies[Math.floor(Math.random() * replies.length)];
      setMateMessages(prev => [...prev, { sender: 'mate', text: r, time: 'Vừa xong' }]);
      sound.playChime(540);
    }, 1300);
  };

  const handleSendCircleWhisper = () => {
    if (!circleWhisper.trim()) return;
    const newMsg = {
      id: `w-${Date.now()}`,
      author: `${spiritName} (Bạn)`,
      spirit: currentSpiritId,
      text: circleWhisper.trim()
    };
    setCircleMessages(prev => [...prev, newMsg]);
    setCircleWhisper('');
    sound.playChime(640);
  };

  return (
    <div className="space-y-4 text-left">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#171A35] border border-[#B9A9E8]/20 text-[#B9A9E8] text-xs font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>KẾT NỐI BẦU TRỜI ĐÊM</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#F5F2FA] font-display">
          Kết nối
        </h1>
        <p className="text-xs md:text-sm text-[#B9B5C8] mt-0.5">
          Gặp gỡ những người bạn cùng tần số cảm xúc trong không gian an toàn, tôn trọng.
        </p>
      </div>

      {/* Section Switcher: Tellie Circle vs Tellie Mate */}
      <div className="p-1 rounded-2xl bg-[#11152A] border border-white/5 grid grid-cols-2 gap-1 text-xs font-bold">
        <button
          onClick={() => {
            setSection('circle');
            sound.playChime(500);
          }}
          className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
            section === 'circle'
              ? 'bg-[#242347] text-[#F5F2FA] shadow-md border border-[#91B8E8]/35'
              : 'text-[#858198] hover:text-[#B9B5C8]'
          }`}
        >
          <Users className="w-4 h-4 text-[#91B8E8]" />
          <span>Tellie Circle (Vòng tròn sao)</span>
        </button>

        <button
          onClick={() => {
            setSection('mate');
            sound.playChime(500);
          }}
          className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
            section === 'mate'
              ? 'bg-[#242347] text-[#F5F2FA] shadow-md border border-[#B9A9E8]/35'
              : 'text-[#858198] hover:text-[#B9B5C8]'
          }`}
        >
          <UserCheck className="w-4 h-4 text-[#B9A9E8]" />
          <span>Tellie Mate (1 - 1)</span>
        </button>
      </div>

      {/* SECTION 1: TELLIE CIRCLE (Large 3D Spirits, Constellations & Gentle Connection Lines) */}
      {section === 'circle' && (
        <div className="space-y-4">
          {/* Ethereal Constellation Canvas Visual */}
          <div className="relative min-h-[360px] sm:min-h-[400px] w-full rounded-3xl bg-gradient-to-b from-[#0D1024] via-[#161B3B] to-[#0A0D1B] border border-[#91B8E8]/30 overflow-hidden p-5 flex flex-col justify-between shadow-2xl">
            {/* Ambient Celestial Glow & Floating Star Dust */}
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#B9A9E8]/15 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#91B8E8]/12 rounded-full blur-[80px] pointer-events-none" />

            {/* Subtle Moon and Distant Stars */}
            <div className="absolute top-4 right-6 text-xl text-[#F4EEDC] opacity-80 drop-shadow-[0_0_12px_rgba(244,238,220,0.6)] pointer-events-none">
              🌙
            </div>
            <div className="absolute top-10 left-12 text-xs text-[#FFFCE8] opacity-70 animate-ping pointer-events-none">✧</div>
            <div className="absolute bottom-24 right-10 text-xs text-[#A8D2C4] opacity-75 animate-pulse pointer-events-none">✦</div>
            <div className="absolute top-1/2 left-6 text-xs text-[#B9A9E8] opacity-65 animate-ping pointer-events-none">⋆</div>
            <div className="absolute top-20 right-1/3 text-[10px] text-[#F4EEDC] opacity-70 animate-pulse pointer-events-none">✧</div>

            {/* Top Label */}
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-[#F5F2FA] font-display block">
                  Vòng tròn: Đêm muộn khó ngủ
                </span>
                <span className="text-[11px] text-[#B9B5C8]">
                  Những tâm hồn đang tìm thấy nhau trong tĩnh lặng
                </span>
              </div>
              <span className="text-[10px] text-[#A8D2C4] bg-[#A8D2C4]/15 border border-[#A8D2C4]/30 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A8D2C4] animate-pulse" />
                Hiện diện cùng nhau
              </span>
            </div>

            {/* SVG Constellation Connection Lines and Starlight Web */}
            <div className="relative z-10 flex-1 my-3 min-h-[220px]">
              <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                <defs>
                  <linearGradient id="constellationLine" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#B9A9E8" stopOpacity="0.5" />
                    <stop offset="50%" stopColor="#91B8E8" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#A8D2C4" stopOpacity="0.5" />
                  </linearGradient>
                </defs>
                {/* Primary Ring Constellation Links */}
                <line x1="50%" y1="18%" x2="18%" y2="34%" stroke="url(#constellationLine)" strokeWidth="1.4" strokeDasharray="3 4" opacity="0.75" />
                <line x1="50%" y1="18%" x2="82%" y2="30%" stroke="url(#constellationLine)" strokeWidth="1.4" strokeDasharray="3 4" opacity="0.75" />
                <line x1="82%" y1="30%" x2="74%" y2="74%" stroke="url(#constellationLine)" strokeWidth="1.4" strokeDasharray="3 4" opacity="0.75" />
                <line x1="74%" y1="74%" x2="30%" y2="72%" stroke="url(#constellationLine)" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.85" />
                <line x1="30%" y1="72%" x2="18%" y2="34%" stroke="url(#constellationLine)" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.85" />

                {/* Secondary Resonant Harmony Links */}
                <line x1="50%" y1="18%" x2="30%" y2="72%" stroke="rgba(223, 175, 200, 0.3)" strokeWidth="1" strokeDasharray="2 3" />
                <line x1="50%" y1="18%" x2="74%" y2="74%" stroke="rgba(168, 210, 196, 0.3)" strokeWidth="1" strokeDasharray="2 3" />

                {/* Starlight intersection dots */}
                <circle cx="50%" cy="18%" r="2" fill="#FFFFFF" opacity="0.9" />
                <circle cx="18%" cy="34%" r="2" fill="#FFFFFF" opacity="0.9" />
                <circle cx="82%" cy="30%" r="2" fill="#FFFFFF" opacity="0.9" />
                <circle cx="74%" cy="74%" r="2" fill="#FFFFFF" opacity="0.9" />
                <circle cx="30%" cy="72%" r="2.5" fill="#FFFFFF" opacity="1" />
              </svg>

              {/* NODE 1: Trăng Khuya (Top Center) */}
              <div className="absolute top-[18%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group">
                <div className="relative">
                  <div className="absolute -inset-1.5 rounded-full bg-[#B9A9E8]/20 blur-sm group-hover:bg-[#B9A9E8]/40 transition-all" />
                  <AnonymousBadge type="moon" size="sm" className="relative z-10" />
                </div>
                <span className="mt-1.5 px-2 py-0.5 rounded-full bg-[#0D1022]/85 border border-[#B9A9E8]/25 text-[10px] font-semibold text-[#B9A9E8] shadow-sm backdrop-blur-md whitespace-nowrap">
                  Trăng Khuya
                </span>
              </div>

              {/* NODE 2: Sao Băng #99 (Upper Left) */}
              <div className="absolute top-[34%] left-[18%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group">
                <div className="relative">
                  <div className="absolute -inset-1.5 rounded-full bg-[#F4EEDC]/20 blur-sm group-hover:bg-[#F4EEDC]/40 transition-all" />
                  <AnonymousBadge type="star" size="sm" className="relative z-10" />
                </div>
                <span className="mt-1.5 px-2 py-0.5 rounded-full bg-[#0D1022]/85 border border-[#F4EEDC]/25 text-[10px] font-semibold text-[#F4EEDC] shadow-sm backdrop-blur-md whitespace-nowrap">
                  Sao Băng #99
                </span>
              </div>

              {/* NODE 3: Mây Phiêu Lãng (Upper Right) */}
              <div className="absolute top-[30%] left-[82%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group">
                <div className="relative">
                  <div className="absolute -inset-1.5 rounded-full bg-[#91B8E8]/20 blur-sm group-hover:bg-[#91B8E8]/40 transition-all" />
                  <AnonymousBadge type="cloud" size="sm" className="relative z-10" />
                </div>
                <span className="mt-1.5 px-2 py-0.5 rounded-full bg-[#0D1022]/85 border border-[#91B8E8]/25 text-[10px] font-semibold text-[#91B8E8] shadow-sm backdrop-blur-md whitespace-nowrap">
                  Mây Phiêu Lãng
                </span>
              </div>

              {/* NODE 4: Nấm Rừng Nhỏ (Lower Right) */}
              <div className="absolute top-[74%] left-[74%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group">
                <div className="relative">
                  <div className="absolute -inset-1.5 rounded-full bg-[#A8D2C4]/20 blur-sm group-hover:bg-[#A8D2C4]/40 transition-all" />
                  <AnonymousBadge type="leaf" size="sm" className="relative z-10" />
                </div>
                <span className="mt-1.5 px-2 py-0.5 rounded-full bg-[#0D1022]/85 border border-[#A8D2C4]/25 text-[10px] font-semibold text-[#A8D2C4] shadow-sm backdrop-blur-md whitespace-nowrap">
                  Nấm Rừng Nhỏ
                </span>
              </div>

              {/* NODE 5: User Node - Hilulu (Bạn) (Lower Left Anchor - Featured) */}
              <div className="absolute top-[72%] left-[30%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group">
                {/* Concentric Breathing Resonance Rings */}
                <div className="relative flex items-center justify-center">
                  <span className="absolute -inset-3 rounded-full border border-[#DFAFC8]/30 animate-pulse pointer-events-none" />
                  <span className="absolute -inset-1.5 rounded-full bg-[#DFAFC8]/25 blur-sm" />
                  <AnonymousBadge type="flower" size="md" className="relative z-10 ring-2 ring-[#DFAFC8]/70 shadow-lg glow-rose" />
                </div>
                <span className="mt-2 px-2.5 py-0.5 rounded-full bg-[#241E38]/95 border border-[#DFAFC8]/50 text-[10px] font-bold text-[#FDF2F8] shadow-md backdrop-blur-md whitespace-nowrap flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DFAFC8] animate-pulse" />
                  <span>{spiritName} (Bạn)</span>
                </span>
              </div>
            </div>

            {/* Bottom Emotional Message */}
            <div className="relative z-10 text-center space-y-0.5 pt-2 border-t border-white/10">
              <span className="text-xs font-bold text-[#F5F2FA] font-display block">
                “Những tâm hồn đang tìm thấy nhau.”
              </span>
              <p className="text-[11px] text-[#B9B5C8] italic">
                Đường ánh sao nối liền những tâm tư. Lặng yên cùng nhau cũng là một sự chữa lành.
              </p>
            </div>
          </div>

          {/* Gentle Whispers Feed */}
          <div className="glass-panel rounded-3xl p-5 border border-white/10 space-y-3.5 shadow-xl">
            <h4 className="text-xs font-bold text-[#F5F2FA] font-display flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#B9A9E8]" />
              <span>Lời thì thầm trong vòng tròn chòm sao</span>
            </h4>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1 text-xs">
              {circleMessages.map(msg => (
                <div key={msg.id} className="p-3 rounded-2xl bg-[#11152A] border border-white/5 flex items-start gap-2.5">
                  <AnonymousBadge id={msg.spirit} name={msg.author} size="xs" className="mt-0.5" />
                  <div>
                    <span className="font-bold text-[11px] text-[#F5F2FA]">{msg.author}: </span>
                    <span className="text-[#B9B5C8] leading-relaxed">{msg.text}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Send gentle whisper */}
            <div className="pt-2 border-t border-white/10 flex items-center gap-2">
              <input
                type="text"
                value={circleWhisper}
                onChange={e => setCircleWhisper(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendCircleWhisper()}
                placeholder="Gửi một lời thì thầm vỗ về vào vòng tròn..."
                className="flex-1 bg-[#11152A] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-[#F5F2FA] placeholder-[#858198] focus:outline-none focus:border-[#91B8E8]"
              />
              <button
                onClick={handleSendCircleWhisper}
                className="px-4 py-2.5 rounded-2xl bg-[#91B8E8] text-[#0D1020] text-xs font-bold hover:opacity-90"
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: TELLIE MATE (1-on-1 Peer Friendship & Support, NOT Dating) */}
      {section === 'mate' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-[#171A35] border border-white/10 flex items-center gap-2.5 text-xs text-[#B9B5C8]">
            <Shield className="w-4 h-4 text-[#A8D2C4] shrink-0" />
            <span>
              Tellie Mate là không gian <strong>kết nối bạn bè và đồng cảm học đường</strong>. Tuyệt đối không phải ứng dụng hẹn hò.
            </span>
          </div>

          {mateStatus === 'idle' && (
            <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-[#B9A9E8]/10 border border-[#B9A9E8]/30 flex items-center justify-center mx-auto text-[#B9A9E8]">
                <UserCheck className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#F5F2FA] font-display">
                  Ghép đôi bạn lắng nghe ẩn danh
                </h3>
                <p className="text-xs text-[#B9B5C8] mt-1 max-w-sm mx-auto">
                  Hệ thống sẽ kết nối bạn với một sinh viên khác có cùng chủ đề trăn trở đêm nay.
                </p>
              </div>

              {/* Topic Selector */}
              <div className="text-left space-y-2 pt-2">
                <label className="text-xs font-bold text-[#858198] uppercase tracking-wider block">
                  Chọn chủ đề bạn muốn sẻ chia:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'deadline', label: 'Áp lực thi cử & Deadline', icon: '📚' },
                    { id: 'homesick', label: 'Sinh viên xa nhà', icon: '🏡' },
                    { id: 'overthinking', label: 'Overthinking đêm muộn', icon: '🌙' },
                    { id: 'career', label: 'Định hướng tương lai', icon: '🧭' }
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setMateTopic(t.id)}
                      className={`p-3 rounded-2xl border text-left text-xs transition-all ${
                        mateTopic === t.id
                          ? 'bg-[#242347] border-[#B9A9E8] text-[#F5F2FA] font-bold shadow-md'
                          : 'bg-[#11152A] border-white/5 text-[#858198]'
                      }`}
                    >
                      <span className="text-base mr-1.5">{t.icon}</span>
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleStartMatching}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#B9A9E8] to-[#91B8E8] text-[#0D1020] font-bold text-xs tracking-wide shadow-lg shadow-[#B9A9E8]/20 hover:opacity-95 active:scale-95 transition-all mt-2"
              >
                Bắt đầu tìm người bạn lắng nghe
              </button>
            </div>
          )}

          {mateStatus === 'searching' && (
            <div className="glass-panel rounded-3xl p-8 text-center space-y-5">
              <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-[#B9A9E8]/30 animate-ping" />
                <div className="absolute inset-4 rounded-full border border-[#91B8E8]/40 animate-pulse" />
                <SpiritAvatar
                  id={currentSpiritId}
                  colorId={userSpirit?.colorId}
                  accessory={userSpirit?.accessory}
                  size="md"
                  mood="calm"
                  animate={true}
                  glow={true}
                  showShadow={false}
                />
              </div>

              <div>
                <h3 className="text-base font-bold text-[#F5F2FA] font-display">
                  Đang tìm kiếm vì sao đồng điệu...
                </h3>
                <p className="text-xs text-[#858198] mt-1">
                  Đang quét trong mạng lưới các bạn sinh viên trực tuyến...
                </p>
              </div>

              <button
                onClick={() => setMateStatus('idle')}
                className="px-4 py-2 rounded-xl bg-white/5 text-xs text-[#858198] hover:text-white"
              >
                Hủy tìm kiếm
              </button>
            </div>
          )}

          {mateStatus === 'matched' && (
            <div className="glass-panel rounded-3xl p-4 border border-white/10 space-y-3">
              {/* Partner Banner */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <AnonymousBadge type="cloud" name="Bạn Cú Mèo #342" size="sm" />
                  <div>
                    <h4 className="text-xs font-bold text-[#F5F2FA]">Bạn Cú Mèo #342</h4>
                    <span className="text-[10px] text-[#A8D2C4]">Đang trực tuyến · Đồng cảm</span>
                  </div>
                </div>

                <button
                  onClick={() => setMateStatus('idle')}
                  className="text-xs text-[#858198] hover:text-white px-2.5 py-1 rounded-lg bg-white/5"
                >
                  Rời phòng
                </button>
              </div>

              {/* Chat Message Box */}
              <div className="h-64 overflow-y-auto space-y-2.5 pr-1 text-xs">
                {mateMessages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl ${
                        m.sender === 'user'
                          ? 'bg-[#B9A9E8] text-[#0D1020] font-medium rounded-br-xs'
                          : 'bg-[#171A35] text-[#F5F2FA] border border-white/10 rounded-bl-xs'
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[10px] text-[#858198] mt-0.5 px-1">{m.time}</span>
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
                  placeholder="Gửi tin nhắn chia sẻ..."
                  className="flex-1 bg-[#11152A] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-[#F5F2FA] placeholder-[#858198] focus:outline-none focus:border-[#B9A9E8]"
                />
                <button
                  onClick={handleSendMateMessage}
                  className="w-9 h-9 rounded-2xl bg-[#B9A9E8] text-[#0D1020] flex items-center justify-center font-bold"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
