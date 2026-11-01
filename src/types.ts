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

export type FairyColorId = 'gray' | 'mint' | 'lavender' | 'blue' | 'rose' | 'cream' | 'peach' | 'charcoal';
export type FairyAccessory = 'none' | 'bow' | 'wreath' | 'hairpin' | 'glasses';

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

export type ActiveTab = 'home' | 'listen' | 'connect' | 'profile' | 'garden';

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
  | 'spiritSelect';
