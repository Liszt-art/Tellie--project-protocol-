import React, { useState } from 'react';
import { HeartHandshake, Stethoscope, PhoneCall, X, ShieldAlert, ArrowLeft, Send } from 'lucide-react';
import { sound } from '../utils/audio';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SosModal: React.FC<SosModalProps> = ({ isOpen, onClose }) => {
  const [activeChoice, setActiveChoice] = useState<'companion' | 'specialist' | 'emergency' | null>(null);
  
  // Interactive mock chat for "Người đồng hành"
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'companion'; text: string; time: string }>>([
    {
      sender: 'companion',
      text: 'Chào bạn, mình là Minh Thảo - sinh viên năm 4 ngành Tâm lý học và là tình nguyện viên đồng hành của Tellie. Mình ở đây để lắng nghe bạn hoàn toàn không phán xét. Bạn đang cảm thấy thế nào lúc này?',
      time: 'Vừa xong'
    }
  ]);
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const userMsg = inputText.trim();
    const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    
    setMessages(prev => [...prev, { sender: 'user', text: userMsg, time: now }]);
    setInputText('');
    sound.playChime(600);

    setTimeout(() => {
      const companionResponses = [
        'Mình nghe bạn rồi. Cảm giác đó thực sự rất khó khăn, nhưng bạn đã rất kiên cường khi đi qua ngày hôm nay.',
        'Bạn hãy hít một hơi thật sâu cùng mình nhé. Bạn không một mình đâu, mình vẫn đang ở đây cùng bạn.',
        'Cứ từ từ nói ra nhé, không có điều gì là quá ngốc nghếch hay sai trái khi bạn đang tổn thương cả.'
      ];
      const resp = companionResponses[Math.floor(Math.random() * companionResponses.length)];
      setMessages(prev => [...prev, { sender: 'companion', text: resp, time: 'Vừa xong' }]);
      sound.playChime(520);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D1020]/95 backdrop-blur-2xl overflow-y-auto">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-6 md:p-8 border border-[#B9A9E8]/20 shadow-2xl my-auto text-left">
        
        {/* Header Controls */}
        <div className="flex items-center justify-between mb-4">
          {activeChoice ? (
            <button
              onClick={() => setActiveChoice(null)}
              className="inline-flex items-center gap-1.5 text-xs text-[#B9B5C8] hover:text-white px-2.5 py-1.5 rounded-lg bg-white/5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại các lựa chọn</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-400/30 text-rose-300 text-xs font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>HỖ TRỢ & ĐỒNG HÀNH</span>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#B9B5C8] hover:text-white transition-colors"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title strictly required: Bạn không cần phải tự mình vượt qua. */}
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-[#F5F2FA] font-display">
            Bạn không cần phải tự mình vượt qua.
          </h2>
          <p className="text-xs md:text-sm text-[#B9B5C8] mt-1.5 leading-relaxed">
            Dù khó khăn đến đâu, luôn có những đôi tai và vòng tay sẵn sàng ở bên cạnh bạn.
          </p>
        </div>

        {/* 3 Choices in EXACT ORDER: 1. Người đồng hành, 2. Chuyên gia, 3. Hỗ trợ khẩn cấp */}
        {!activeChoice ? (
          <div className="space-y-3.5">
            {/* 1. Người đồng hành */}
            <div
              onClick={() => {
                setActiveChoice('companion');
                sound.playChime(560);
              }}
              className="p-4 rounded-2xl bg-[#171A35]/90 border border-[#B9A9E8]/20 hover:border-[#B9A9E8]/50 hover:bg-[#242347] transition-all cursor-pointer group shadow-sm"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#B9A9E8]/15 border border-[#B9A9E8]/30 flex items-center justify-center text-[#B9A9E8] shrink-0 group-hover:scale-105 transition-transform">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-[#F5F2FA] font-display">
                      1. Người đồng hành
                    </h3>
                    <span className="text-[11px] text-[#A8D2C4] font-medium">Trò chuyện ngay</span>
                  </div>
                  <p className="text-xs text-[#B9B5C8] mt-1 leading-relaxed">
                    Sinh viên tâm lý được đào tạo và giám sát chuyên môn. Lắng nghe, chia sẻ và đồng hành như một người bạn thân thiết.
                  </p>
                  <p className="text-[10px] text-[#858198] mt-2 italic">
                    Chỉ dành cho lắng nghe & đồng hành cảm xúc · Không đưa ra kết luận y khoa
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Chuyên gia */}
            <div
              onClick={() => {
                setActiveChoice('specialist');
                sound.playChime(560);
              }}
              className="p-4 rounded-2xl bg-[#171A35]/90 border border-[#91B8E8]/20 hover:border-[#91B8E8]/50 hover:bg-[#242347] transition-all cursor-pointer group shadow-sm"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#91B8E8]/15 border border-[#91B8E8]/30 flex items-center justify-center text-[#91B8E8] shrink-0 group-hover:scale-105 transition-transform">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-[#F5F2FA] font-display">
                      2. Chuyên gia
                    </h3>
                    <span className="text-[11px] text-[#91B8E8] font-medium">Xem thông tin</span>
                  </div>
                  <p className="text-xs text-[#B9B5C8] mt-1 leading-relaxed">
                    Chuyên gia tâm lý, cán bộ tham vấn học đường và bác sĩ chuyên khoa tâm thần có chứng chỉ hành nghề.
                  </p>
                  <p className="text-[10px] text-[#858198] mt-2 italic">
                    Tham vấn chuyên sâu 1-1 · Hỗ trợ bảo mật thông tin học sinh - sinh viên
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Hỗ trợ khẩn cấp */}
            <div
              onClick={() => {
                setActiveChoice('emergency');
                sound.playChime(560);
              }}
              className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 hover:border-rose-400 hover:bg-rose-950/50 transition-all cursor-pointer group shadow-sm"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-300 shrink-0 group-hover:scale-105 transition-transform">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-[#F5F2FA] font-display">
                      3. Hỗ trợ khẩn cấp
                    </h3>
                    <span className="text-[11px] text-rose-300 font-medium">Tổng đài 24/7</span>
                  </div>
                  <p className="text-xs text-[#B9B5C8] mt-1 leading-relaxed">
                    Các đường dây nóng bảo vệ thanh thiếu niên và cấp cứu y tế quốc gia hoạt động 24/7 khi bạn hoặc người thân gặp nguy hiểm tức thì.
                  </p>
                  <p className="text-[10px] text-rose-300/80 mt-2 font-medium">
                    Gọi miễn phí cước · Hỗ trợ khẩn cấp 24/7
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : activeChoice === 'companion' ? (
          /* Companion Chat Screen */
          <div className="flex flex-col h-[380px] bg-[#11152A] rounded-2xl p-3 border border-white/10">
            <div className="flex items-center gap-2 pb-2.5 border-b border-white/10">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-xs font-semibold text-[#F5F2FA]">Người đồng hành: Minh Thảo (UEH Psychology)</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1 text-xs">
              {messages.map((m, idx) => (
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
                  <span className="text-[10px] text-[#858198] mt-1 px-1">{m.time}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                placeholder="Chia sẻ điều bạn đang trăn trở..."
                className="flex-1 bg-[#171A35] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F5F2FA] placeholder-[#858198] focus:outline-none focus:border-[#B9A9E8]"
              />
              <button
                onClick={handleSendMessage}
                className="w-8 h-8 rounded-xl bg-[#B9A9E8] text-[#0D1020] flex items-center justify-center font-bold hover:opacity-90 active:scale-95 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : activeChoice === 'specialist' ? (
          /* Specialist Information */
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            <div className="p-3.5 rounded-2xl bg-[#11152A] border border-white/10">
              <h4 className="text-sm font-bold text-[#F5F2FA]">Trung tâm Tham vấn Tâm lý Học đường UEH</h4>
              <p className="text-xs text-[#B9B5C8] mt-1">Dành cho sinh viên cần hỗ trợ chuyên sâu về lo âu học đường, hướng nghiệp và khủng hoảng tâm lý.</p>
              <div className="mt-2 text-xs text-[#91B8E8]">Email: tuvantamly@ueh.edu.vn (Đặt lịch hẹn trước)</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#11152A] border border-white/10">
              <h4 className="text-sm font-bold text-[#F5F2FA]">Bệnh viện & Khoa Tâm thần - ĐH Y Dược</h4>
              <p className="text-xs text-[#B9B5C8] mt-1">Khám và điều trị chuyên khoa cho các trường hợp trầm cảm, rối loạn giấc ngủ kéo dài hoặc rối loạn lo âu nghiêm trọng.</p>
              <div className="mt-2 text-xs text-[#91B8E8]">Địa chỉ liên hệ: Cơ sở y tế chuyên khoa được chứng nhận</div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 text-[11px] text-[#858198]">
              Lưu ý: Mọi buổi tham vấn chuyên gia đều tuân thủ nguyên tắc bảo mật thông tin cá nhân theo quy định y đức.
            </div>
          </div>
        ) : (
          /* Emergency Contacts */
          <div className="space-y-3">
            <a
              href="tel:111"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 hover:bg-rose-900/40 transition-colors"
            >
              <div>
                <div className="text-sm font-bold text-white">Tổng đài Quốc gia 111</div>
                <div className="text-xs text-rose-200">Bảo vệ trẻ em và thanh thiếu niên (Miễn phí 24/7)</div>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-rose-500 text-white font-bold text-xs">Gọi 111</span>
            </a>

            <a
              href="tel:115"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 hover:bg-rose-900/40 transition-colors"
            >
              <div>
                <div className="text-sm font-bold text-white">Cấp cứu Y tế 115</div>
                <div className="text-xs text-rose-200">Cứu hộ khẩn cấp tai nạn và tình trạng nguy hiểm tính mạng</div>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-rose-500 text-white font-bold text-xs">Gọi 115</span>
            </a>

            <a
              href="tel:0963061414"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-[#171A35] border border-white/10 hover:bg-[#242347] transition-colors"
            >
              <div>
                <div className="text-sm font-bold text-[#F5F2FA]">Đường dây nóng Ngày Mai</div>
                <div className="text-xs text-[#B9B5C8]">Hỗ trợ lắng nghe người có ý định tự hại & trầm cảm: 096 306 1414</div>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-[#B9A9E8] text-[#0D1020] font-bold text-xs">Gọi ngay</span>
            </a>
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-[#F5F2FA] transition-colors"
          >
            Đã hiểu, quay lại Tellie
          </button>
        </div>
      </div>
    </div>
  );
};
