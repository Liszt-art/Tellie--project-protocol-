import { MoodMeta, MoodId } from '../types';

export const MOODS_LIST: MoodMeta[] = [
  {
    id: 'calm',
    labelVi: 'Bình yên',
    englishLabel: 'Calm & Peaceful',
    color: '#91B8E8',
    bgColor: 'rgba(145, 184, 232, 0.15)',
    borderColor: 'rgba(145, 184, 232, 0.4)',
    icon: '🌊',
    quoteVi: 'Mặt hồ tâm trí phẳng lặng, bạn cảm nhận được từng nhịp thở thong dong.'
  },
  {
    id: 'heavy',
    labelVi: 'Nặng trĩu',
    englishLabel: 'Heavy-hearted',
    color: '#B9A9E8',
    bgColor: 'rgba(185, 169, 232, 0.15)',
    borderColor: 'rgba(185, 169, 232, 0.4)',
    icon: '🌧️',
    quoteVi: 'Có những ngày gánh nặng vô hình như đá tảng, hãy cho phép mình được nghỉ chân.'
  },
  {
    id: 'lost',
    labelVi: 'Lạc lõng',
    englishLabel: 'Lost & Drifting',
    color: '#DFAFC8',
    bgColor: 'rgba(223, 175, 200, 0.15)',
    borderColor: 'rgba(223, 175, 200, 0.4)',
    icon: '🌫️',
    quoteVi: 'Giữa đám đông vội vã, bạn thấy mình như cánh buồm trôi xa. Đừng sợ, bạn không cô đơn.'
  },
  {
    id: 'exhausted',
    labelVi: 'Mệt mỏi',
    englishLabel: 'Exhausted',
    color: '#858198',
    bgColor: 'rgba(133, 129, 152, 0.18)',
    borderColor: 'rgba(133, 129, 152, 0.4)',
    icon: '🍂',
    quoteVi: 'Năng lượng cạn kiệt sau những chuỗi ngày chạy đua. Đêm nay, chỉ cần ngủ một giấc thật sâu.'
  },
  {
    id: 'anxious',
    labelVi: 'Bất an',
    englishLabel: 'Anxious & Overthinking',
    color: '#E0A899',
    bgColor: 'rgba(224, 168, 153, 0.15)',
    borderColor: 'rgba(224, 168, 153, 0.4)',
    icon: '⚡',
    quoteVi: 'Những câu hỏi không lời đáp quay cuồng trong đầu. Hãy đặt tay lên ngực và thở đều nào.'
  },
  {
    id: 'hopeful',
    labelVi: 'Hy vọng',
    englishLabel: 'Hopeful & Warm',
    color: '#F4EEDC',
    bgColor: 'rgba(244, 238, 220, 0.15)',
    borderColor: 'rgba(244, 238, 220, 0.4)',
    icon: '✨',
    quoteVi: 'Một tia sáng le lói dẫn lối. Ngày mai có thể sẽ nhẹ nhàng hơn hôm nay một chút.'
  },
  {
    id: 'tender',
    labelVi: 'Dịu lại',
    englishLabel: 'Tender & Healing',
    color: '#A8D2C4',
    bgColor: 'rgba(168, 210, 196, 0.15)',
    borderColor: 'rgba(168, 210, 196, 0.4)',
    icon: '🌱',
    quoteVi: 'Vết thương bắt đầu lành lại, lòng bạn mở ra với sự bao dung dành cho chính mình.'
  },
  {
    id: 'grateful',
    labelVi: 'Biết ơn',
    englishLabel: 'Grateful',
    color: '#DFB0DE',
    bgColor: 'rgba(223, 176, 222, 0.15)',
    borderColor: 'rgba(223, 176, 222, 0.4)',
    icon: '🌸',
    quoteVi: 'Trân trọng vì mình vẫn ở đây, trân trọng một tách trà ấm hay một tin nhắn vỗ về.'
  }
];

export const getMoodById = (id: MoodId): MoodMeta => {
  return MOODS_LIST.find(m => m.id === id) || MOODS_LIST[0];
};
