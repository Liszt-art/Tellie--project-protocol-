import { MoodId, KintsugiObjectType, KintsugiItem } from '../types';

export interface KintsugiObjectMeta {
  objectType: KintsugiObjectType;
  nameVi: string;
  categoryLabelVi: string;
  moodId: MoodId;
  descriptionVi: string;
  vibeVi: string;
  material: 'glass' | 'ceramic' | 'crystal' | 'porcelain';
  primaryColor: string;
  crackPattern: string;
}

export const KINTSUGI_OBJECT_MAP: Record<MoodId, KintsugiObjectMeta> = {
  anxious: {
    objectType: 'glass_jar',
    nameVi: 'Lọ thủy tinh Lo âu',
    categoryLabelVi: 'Thủy tinh mỏng manh',
    moodId: 'anxious',
    descriptionVi: 'Lọ thủy tinh trong suốt mang những vết nứt chằng chịt do dồn nén âu lo.',
    vibeVi: 'Bất an & Bồn chồn',
    material: 'glass',
    primaryColor: '#93C5FD',
    crackPattern: 'fissure'
  },
  exhausted: {
    objectType: 'tea_cup',
    nameVi: 'Tách trà gốm Mệt nhoài',
    categoryLabelVi: 'Gốm mộc nứt mẻ',
    moodId: 'exhausted',
    descriptionVi: 'Tách trà gốm tráng men mộc có vết rạn sâu sau những ngày dài cạn kiệt sức lực.',
    vibeVi: 'Mệt mỏi & Cần ngơi nghỉ',
    material: 'ceramic',
    primaryColor: '#FCA5A5',
    crackPattern: 'deep'
  },
  lost: {
    objectType: 'star_crystal',
    nameVi: 'Khối pha lê Lạc lối',
    categoryLabelVi: 'Pha lê vỡ góc',
    moodId: 'lost',
    descriptionVi: 'Tinh thể pha lê đa giác bị vỡ một góc giữa sương mù mờ mịt.',
    vibeVi: 'Lạc lõng & Chông chênh',
    material: 'crystal',
    primaryColor: '#C4B5FD',
    crackPattern: 'faceted'
  },
  heavy: {
    objectType: 'ceramic_vase',
    nameVi: 'Bình đất nung Nặng lòng',
    categoryLabelVi: 'Gốm đất nung cổ',
    moodId: 'heavy',
    descriptionVi: 'Chiếc bình đất nung nặng trĩu mang vết nứt ngang vì gánh nặng tâm lý chưa trút bỏ.',
    vibeVi: 'Nặng nề & Trĩu tâm tư',
    material: 'ceramic',
    primaryColor: '#FDBA74',
    crackPattern: 'horizontal'
  },
  calm: {
    objectType: 'porcelain_bowl',
    nameVi: 'Bát sứ ngọc Thanh thản',
    categoryLabelVi: 'Sứ ngọc sen men bóng',
    moodId: 'calm',
    descriptionVi: 'Bát sứ ngọc men xanh ngọc bích, những vết rạn nhỏ được bao bọc trong sự dịu dàng.',
    vibeVi: 'Bình yên & Tự tại',
    material: 'porcelain',
    primaryColor: '#86EFAC',
    crackPattern: 'gentle'
  },
  hopeful: {
    objectType: 'sun_plate',
    nameVi: 'Đĩa gốm ánh dương Hy vọng',
    categoryLabelVi: 'Gốm men vàng ấm áp',
    moodId: 'hopeful',
    descriptionVi: 'Đĩa gốm tròn mang những vết nứt hướng tâm như tia nắng sớm mai chiếu qua khe cửa.',
    vibeVi: 'Ấm áp & Tin tưởng',
    material: 'ceramic',
    primaryColor: '#FDE047',
    crackPattern: 'radial'
  },
  grateful: {
    objectType: 'heart_gem',
    nameVi: 'Khối ngọc Biết ơn',
    categoryLabelVi: 'Ngọc thạch trái tim',
    moodId: 'grateful',
    descriptionVi: 'Khối ngọc hồng trái tim với vết rạn đã được hàn kín bằng lòng trắc ẩn.',
    vibeVi: 'Ấm lòng & Biết ơn',
    material: 'crystal',
    primaryColor: '#F472B6',
    crackPattern: 'heart'
  },
  tender: {
    objectType: 'ceramic_bell',
    nameVi: 'Chuông gió gốm Dịu êm',
    categoryLabelVi: 'Gốm chuông ngân',
    moodId: 'tender',
    descriptionVi: 'Chiếc chuông gốm đón gió, vết nứt nhẹ rung lên những âm thanh chữa lành.',
    vibeVi: 'Dịu dàng & Vỗ về',
    material: 'ceramic',
    primaryColor: '#DDD6FE',
    crackPattern: 'wave'
  }
};

export const getKintsugiMetaByMood = (moodId: MoodId): KintsugiObjectMeta => {
  return KINTSUGI_OBJECT_MAP[moodId] || KINTSUGI_OBJECT_MAP.calm;
};

export const getKintsugiMetaByType = (type: KintsugiObjectType): KintsugiObjectMeta => {
  const found = Object.values(KINTSUGI_OBJECT_MAP).find(item => item.objectType === type);
  return found || KINTSUGI_OBJECT_MAP.anxious;
};

export const INITIAL_KINTSUGI_ITEMS: KintsugiItem[] = [
  {
    id: 'kint-init-1',
    objectType: 'glass_jar',
    objectNameVi: 'Lọ thủy tinh Lo âu',
    customName: 'Đêm thức chuẩn bị thi giữa kỳ',
    moodId: 'anxious',
    moodLabelVi: 'Lo âu',
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
    dateFormatted: '01/11 22:15',
    originalText: 'Mình cảm thấy quá tải với 4 bài tiểu luận cùng lúc. Nhưng sau khi viết ra hết, mình thở đều hơn và nhận ra bản thân đã cố gắng rất nhiều.',
    repairProgress: 100,
    category: 'hoc-tap'
  },
  {
    id: 'kint-init-2',
    objectType: 'tea_cup',
    objectNameVi: 'Tách trà gốm Mệt nhoài',
    customName: 'Những ngày lạc lõng nơi giảng đường',
    moodId: 'exhausted',
    moodLabelVi: 'Mệt mỏi',
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
    dateFormatted: '03/11 20:30',
    originalText: 'Cả ngày dài học và chạy xe ngoài mưa. Mình tự pha cho mình một tách trà ấm, cho phép mình nghỉ ngơi mà không còn dằn vặt.',
    repairProgress: 100,
    category: 'ban-than'
  }
];
