export type SpiritId = 'cloud' | 'bunny' | 'moon' | 'flower' | 'star' | 'mushroom' | 'fairy';

export interface SpiritMetadata {
  id: SpiritId;
  nameDefault: string;
  speciesVi: string;
  titleVi: string;
  descriptionVi: string;
  personalityVi: string;
  quoteVi: string;
  accentColor: string;
  glowColor: string;
  elementVi: string;
}

export type FairyColorId = 
  | 'pink_powder'    // 1. Hồng phấn — #F4B8D4
  | 'lavender'       // 2. Tím lavender — #C9B6F2
  | 'baby_blue'      // 3. Xanh baby — #AFCDF5
  | 'mint'           // 4. Xanh mint — #B8E3D5
  | 'night_blue'     // 5. Xanh đêm — #7183B8
  | 'pastel_peach'   // 6. Đào pastel — #F6C5B0
  | 'cream_yellow'   // 7. Vàng kem — #F3DFA5
  | 'pearl_white'    // 8. Trắng ngọc trai — #E9EDF5
  // Backward compatibility aliases
  | 'gray'
  | 'rose'
  | 'blue'
  | 'cream'
  | 'peach'
  | 'charcoal';

export type FairyAccessory = 
  | 'none'
  | 'ribbon_bow'       // 1. 🎀 Nơ ruy-băng
  | 'butterfly_clip'   // 2. 🦋 Kẹp tóc bướm
  | 'small_wreath'     // 3. 🌸 Vòng hoa nhỏ
  | 'vine_clip'        // 4. 🌿 Kẹp lá dây leo
  | 'moon_clip'        // 5. 🌙 Kẹp mặt trăng
  | 'star_clip'        // 6. ⭐ Kẹp ngôi sao
  | 'flower_crown'     // 7. 👑 Vương miện hoa
  | 'crystal_tiara'    // 8. 💎 Tiara pha lê
  | 'light_halo'       // 9. ✨ Halo ánh sáng
  | 'lavender_flower'  // 10. 🌿 Hoa lavender cài tóc
  | 'butterfly_perch'  // 11. 🦋 Bướm đậu trên tóc
  | 'mushroom_clip'    // 12. 🍄 Kẹp nấm nhỏ
  | 'leaf_wreath'      // 13. 🌿 Vòng lá
  | 'seashell_clip'    // 14. 🐚 Kẹp vỏ sò
  | 'pearls'           // 15. 🤍 Ngọc trai quanh tóc
  | 'glasses'          // 16. 👓 Kính tròn
  // Backward compatibility aliases
  | 'bow'
  | 'wreath'
  | 'hairpin';

export interface UserSpirit {
  spiritId: SpiritId;
  customName: string;
  selectedAt: string;
  happiness: number;
  colorId?: FairyColorId;
  accessory?: FairyAccessory;
}

export type MoodId = 
  | 'calm'
  | 'heavy'
  | 'lost'
  | 'exhausted'
  | 'hopeful'
  | 'anxious'
  | 'grateful'
  | 'tender';

export interface MoodMeta {
  id: MoodId;
  labelVi: string;
  englishLabel: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  quoteVi: string;
}

export interface MoodEntry {
  id: string;
  moodId: MoodId;
  note?: string;
  timestamp: string; // ISO string
  isNightRitual?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  authorNickname: string;
  authorAvatar: SpiritId;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  authorNickname: string;
  authorSpirit: SpiritId;
  title: string;
  content: string;
  moodId: MoodId;
  category: 'hoc-tap' | 'gia-dinh' | 'tinh-cam' | 'ban-than' | 'chung';
  categoryLabelVi: string;
  hashtags?: string[];
  supportiveCount: number;
  userReacted?: boolean;
  userReactionType?: 'hug' | 'listen' | 'relate';
  comments: Comment[];
  createdAt: string;
  isPrivate: boolean;
  tellieReply?: {
    spiritName: string;
    message: string;
    badgeVi: string;
  };
}

export type GrowthStage = 
  | 'seed'       // 1. Hạt giống
  | 'sprout'     // 2. Mầm non
  | 'sapling'    // 3. Cây con
  | 'growing'    // 4. Cây đang lớn
  | 'mature'     // 5. Cây trưởng thành
  | 'special'    // 6. Cột mốc đặc biệt
  | 'bud'        // Alias for sapling/growing
  | 'blooming'   // Alias for mature
  | 'celestial'; // Alias for special

export interface GrowthHistoryItem {
  stage: GrowthStage;
  date: string;
  note?: string;
}

export interface GardenPlant {
  id: string;
  title: string;
  note: string;
  category: string;
  plantType?: 'leafy' | 'bush' | 'flower' | 'clover' | 'tree';
  flowerType?: string;
  flowerNameVi?: string;
  plantNameVi?: string;
  plantedAt: string;
  currentStage: GrowthStage;
  history: GrowthHistoryItem[];
  color: string;
}

export interface BurnedPaper {
  id: string;
  title?: string;
  content: string;
  burnedAt: string;
  keptPrivate: boolean;
}

export type KintsugiObjectType =
  | 'glass_jar'       // Lo âu -> Lọ thủy tinh nứt vỡ
  | 'tea_cup'         // Mệt mỏi -> Tách trà gốm nứt
  | 'star_crystal'    // Lạc lối -> Tinh thể sao pha lê vỡ
  | 'ceramic_vase'    // Nặng lòng -> Bình gốm đất nung nứt
  | 'porcelain_bowl'  // Thanh thản -> Bát sứ ngọc sen
  | 'sun_plate'       // Hy vọng -> Đĩa gốm ánh dương
  | 'heart_gem'       // Biết ơn -> Khối ngọc trái tim
  | 'ceramic_bell';   // Dịu êm -> Chuông gió gốm

export interface KintsugiItem {
  id: string;
  objectType: KintsugiObjectType;
  objectNameVi: string;
  customName: string;
  moodId: MoodId;
  moodLabelVi: string;
  timestamp: string; // ISO string
  dateFormatted: string; // e.g. "03/11 21:30"
  originalText: string;
  repairProgress: number; // 0 to 100 (100 = healed with gold seams)
  category?: string;
}

export type ActiveTab = 
  | 'home' 
  | 'journal' 
  | 'zen' 
  | 'community' 
  | 'profile' 
  | 'listen' 
  | 'connect' 
  | 'garden';

export type ActiveModal = 
  | null 
  | 'sos' 
  | 'writePost' 
  | 'pressureFurnace' 
  | 'energyStation' 
  | 'moodNight' 
  | 'safeSpace' 
  | 'tellieMate' 
  | 'gardenPlantModal'
  | 'tellieGarden'
  | 'spiritSelect'
  | 'moodCheckIn';
