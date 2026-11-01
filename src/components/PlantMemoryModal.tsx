import React, { useState } from 'react';
import { X, Sparkles, Sprout } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GardenPlant } from '../types';
import { PlantGraphic } from './PlantGraphic';

interface PlantMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlantMemoryModal: React.FC<PlantMemoryModalProps> = ({ isOpen, onClose }) => {
  const { plantMemory } = useApp();
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('Bản thân');
  const [plantType, setPlantType] = useState<GardenPlant['plantType']>('leafy');

  if (!isOpen) return null;

  const plantVarieties: Array<{
    type: GardenPlant['plantType'];
    nameVi: string;
    desc: string;
    color: string;
  }> = [
    {
      type: 'leafy',
      nameVi: 'Cây Lá Xanh',
      desc: 'Tán lá thanh mát lớn lên theo từng nhịp sống kiên trì',
      color: '#A8D2C4'
    },
    {
      type: 'bush',
      nameVi: 'Cây Bụi Đêm',
      desc: 'Bền bỉ, sum suê đong đầy những khoảnh khắc đời thường',
      color: '#91B8E8'
    },
    {
      type: 'flower',
      nameVi: 'Hoa Trăng Đêm',
      desc: 'Nở rộ dịu dàng khi chạm đến những cột mốc ý nghĩa',
      color: '#DFAFC8'
    },
    {
      type: 'clover',
      nameVi: 'Cỏ Sao Kỳ Diệu',
      desc: 'Mộc mạc, tượng trưng cho niềm tin và sự may mắn nhỏ bé',
      color: '#F4EEDC'
    },
    {
      type: 'tree',
      nameVi: 'Cây Cổ Thụ Nhỏ',
      desc: 'Vững chãi, gốc rễ bám sâu nâng đỡ tâm hồn bạn',
      color: '#B9A9E8'
    }
  ];

  const handlePlant = () => {
    if (!title.trim()) return;
    const chosen = plantVarieties.find(v => v.type === plantType) || plantVarieties[0];

    plantMemory({
      title: title.trim(),
      note: note.trim() || 'Một hạt mầm được gieo trong đêm tĩnh lặng.',
      category,
      plantType: chosen.type,
      plantNameVi: chosen.nameVi,
      color: chosen.color
    });

    setTitle('');
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0A0D1B]/95 backdrop-blur-2xl overflow-y-auto">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-5 sm:p-7 border border-[#A8D2C4]/25 shadow-2xl my-auto text-left">
        <div className="flex items-center justify-between mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#171A35] border border-[#A8D2C4]/30 text-[#A8D2C4] text-xs font-semibold">
            <Sprout className="w-3.5 h-3.5" />
            <span>GIEO HẠT GIỐNG VÀO VƯỜN</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#B9B5C8] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-[#F5F2FA] font-display">
          Trồng một điều bạn muốn lưu lại
        </h2>
        <p className="text-xs text-[#B9B5C8] mt-1">
          Một bước ngoặt, một cột mốc nhỏ, hay một kỷ niệm đẹp bạn muốn để nó cùng lớn lên theo thời gian.
        </p>

        {/* Visual Seed Preview sitting in Soil */}
        <div className="my-3 p-3 rounded-2xl bg-[#11152A] border border-white/5 flex items-center justify-center gap-4">
          <div className="w-14 h-14 flex items-center justify-center">
            <PlantGraphic stage="seed" size="md" animate={false} />
          </div>
          <div className="text-xs text-[#B9B5C8]">
            <span className="font-bold text-[#F5F2FA] block font-display">
              Bắt đầu từ Hạt giống
            </span>
            <span>Hạt giống sẽ hiện diện trong vườn và dần chuyển hóa qua từng giai đoạn trưởng thành.</span>
          </div>
        </div>

        <div className="space-y-3 mt-3">
          <div>
            <label className="block text-xs font-bold text-[#858198] uppercase tracking-wider mb-1.5">
              Tên điều bạn muốn ghi nhớ
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ví dụ: Vượt qua kỳ thi, dám nói lời từ chối, bữa cơm ấm cùng mẹ..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#11152A] border border-white/10 text-xs text-[#F5F2FA] placeholder-[#858198] focus:outline-none focus:border-[#A8D2C4]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#858198] uppercase tracking-wider mb-1.5">
              Lời nhắn gửi cho mầm sống này
            </label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={2}
              placeholder="Bạn cảm thấy thế nào khi làm được điều này?..."
              className="w-full p-3 rounded-xl bg-[#11152A] border border-white/10 text-xs text-[#F5F2FA] placeholder-[#858198] focus:outline-none focus:border-[#A8D2C4] resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#858198] uppercase tracking-wider mb-2">
              Dáng dấp cây bạn muốn mầm sống phát triển thành
            </label>
            <div className="grid grid-cols-2 gap-2">
              {plantVarieties.map(item => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setPlantType(item.type)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    plantType === item.type
                      ? 'bg-[#242347] border-[#A8D2C4] shadow-md ring-1 ring-[#A8D2C4]'
                      : 'bg-[#11152A] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-bold text-[#F5F2FA]">{item.nameVi}</span>
                  </div>
                  <p className="text-[10px] text-[#858198] mt-1 line-clamp-1">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handlePlant}
          disabled={!title.trim()}
          className="w-full mt-4 py-3 px-6 rounded-2xl bg-gradient-to-r from-[#A8D2C4] to-[#91B8E8] text-[#0D1020] font-bold text-xs tracking-wide shadow-lg shadow-[#A8D2C4]/20 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-40"
        >
          <Sparkles className="w-4 h-4" />
          <span>Gieo hạt giống vào vườn đêm</span>
        </button>
      </div>
    </div>
  );
};
