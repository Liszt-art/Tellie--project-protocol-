import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SpiritId,
  FairyColorId,
  FairyAccessory,
  UserSpirit,
  MoodId,
  MoodEntry,
  Post,
  Comment,
  GardenPlant,
  BurnedPaper,
  GrowthStage,
  ActiveTab,
  ActiveModal
} from '../types';
import { INITIAL_POSTS, INITIAL_MOOD_HISTORY, INITIAL_GARDEN_PLANTS } from '../data/initialData';
import { sound } from '../utils/audio';

interface AppContextType {
  // Navigation & Modals
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeModal: ActiveModal;
  openModal: (modal: ActiveModal) => void;
  closeModal: () => void;

  // Spirit
  userSpirit: UserSpirit | null;
  setUserSpiritData: (spiritId: SpiritId, customName: string, colorId?: FairyColorId, accessory?: FairyAccessory) => void;
  customizeFairy: (params: { customName?: string; colorId?: FairyColorId; accessory?: FairyAccessory }) => void;
  updateSpiritName: (newName: string) => void;
  feedSpiritLove: () => void;

  // Moods
  todayMood: MoodId | null;
  moodHistory: MoodEntry[];
  recordMood: (moodId: MoodId, note?: string, isNightRitual?: boolean) => void;

  // Community & Journal Posts
  posts: Post[];
  createPost: (params: {
    title: string;
    content: string;
    moodId: MoodId;
    category?: Post['category'];
    hashtags?: string[];
    isPrivate: boolean;
  }) => void;
  toggleReaction: (postId: string, reactionType?: 'hug' | 'listen' | 'relate') => void;
  addComment: (postId: string, content: string) => void;

  // Garden
  gardenPlants: GardenPlant[];
  plantMemory: (params: {
    title: string;
    note: string;
    category: string;
    plantType?: GardenPlant['plantType'];
    flowerType?: string;
    flowerNameVi?: string;
    plantNameVi?: string;
    color: string;
  }) => void;
  nurturePlant: (plantId: string, note?: string) => void;

  // Pressure Furnace
  burnedPapers: BurnedPaper[];
  burnPaper: (content: string, title?: string, keepPrivate?: boolean) => void;

  // User info & Reset
  userNickname: string;
  setUserNickname: (name: string) => void;
  resetAllData: () => void;

  // Onboarding
  hasCompletedOnboarding: boolean;
  completeOnboarding: (userName: string, colorId: FairyColorId, accessory: FairyAccessory) => void;
  resetOnboarding: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER_SPIRIT: 'tellie_user_spirit_v1',
  MOOD_HISTORY: 'tellie_mood_history_v1',
  TODAY_MOOD: 'tellie_today_mood_v1',
  POSTS: 'tellie_posts_v1',
  GARDEN_PLANTS: 'tellie_garden_plants_v1',
  BURNED_PAPERS: 'tellie_burned_papers_v1',
  USER_NICKNAME: 'tellie_nickname_v1',
  ONBOARDING_COMPLETED: 'tellie_onboarding_completed_v1'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  // 0. Onboarding state
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED) === 'true';
    } catch {
      return false;
    }
  });

  // 1. Spirit state (Always named "Tellie Spirit")
  const [userSpirit, setUserSpirit] = useState<UserSpirit | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_SPIRIT);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          spiritId: 'fairy',
          colorId: parsed.colorId || 'pearl_white',
          accessory: parsed.accessory || 'none',
          customName: 'Tellie Spirit'
        };
      }
      return {
        spiritId: 'fairy',
        customName: 'Tellie Spirit',
        colorId: 'pearl_white',
        accessory: 'none',
        selectedAt: new Date().toISOString(),
        happiness: 100
      };
    } catch {
      return {
        spiritId: 'fairy',
        customName: 'Tellie Spirit',
        colorId: 'pearl_white',
        accessory: 'none',
        selectedAt: new Date().toISOString(),
        happiness: 100
      };
    }
  });

  // 2. Mood state
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MOOD_HISTORY);
      return saved ? JSON.parse(saved) : INITIAL_MOOD_HISTORY;
    } catch {
      return INITIAL_MOOD_HISTORY;
    }
  });

  const [todayMood, setTodayMood] = useState<MoodId | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TODAY_MOOD);
      return (saved as MoodId) || 'tender';
    } catch {
      return 'tender';
    }
  });

  // 3. Posts state
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.POSTS);
      return saved ? JSON.parse(saved) : INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });

  // 4. Garden plants
  const [gardenPlants, setGardenPlants] = useState<GardenPlant[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GARDEN_PLANTS);
      return saved ? JSON.parse(saved) : INITIAL_GARDEN_PLANTS;
    } catch {
      return INITIAL_GARDEN_PLANTS;
    }
  });

  // 5. Burned papers
  const [burnedPapers, setBurnedPapers] = useState<BurnedPaper[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BURNED_PAPERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 6. User nickname
  const [userNickname, setUserNicknameState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_NICKNAME);
      return saved || 'Bạn Ẩn Danh #68';
    } catch {
      return 'Bạn Ẩn Danh #68';
    }
  });

  // Save to localStorage whenever state updates
  useEffect(() => {
    if (userSpirit) {
      localStorage.setItem(STORAGE_KEYS.USER_SPIRIT, JSON.stringify(userSpirit));
    }
  }, [userSpirit]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MOOD_HISTORY, JSON.stringify(moodHistory));
  }, [moodHistory]);

  useEffect(() => {
    if (todayMood) {
      localStorage.setItem(STORAGE_KEYS.TODAY_MOOD, todayMood);
    }
  }, [todayMood]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GARDEN_PLANTS, JSON.stringify(gardenPlants));
  }, [gardenPlants]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BURNED_PAPERS, JSON.stringify(burnedPapers));
  }, [burnedPapers]);

  const setUserNickname = (name: string) => {
    setUserNicknameState(name);
    localStorage.setItem(STORAGE_KEYS.USER_NICKNAME, name);
  };

  const openModal = (modal: ActiveModal) => {
    sound.playChime(580);
    setActiveModal(modal);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  // Onboarding actions
  const completeOnboarding = (userName: string, colorId: FairyColorId, accessory: FairyAccessory) => {
    const finalUserName = userName.trim() || 'Bạn Mới';
    setUserNickname(finalUserName);

    const finalSpirit: UserSpirit = {
      spiritId: 'fairy',
      customName: 'Tellie Spirit',
      colorId,
      accessory,
      selectedAt: new Date().toISOString(),
      happiness: 100
    };
    setUserSpirit(finalSpirit);
    localStorage.setItem(STORAGE_KEYS.USER_SPIRIT, JSON.stringify(finalSpirit));

    localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
    setHasCompletedOnboarding(true);
    setActiveTab('home');
    sound.playChime(784);
  };

  const resetOnboarding = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
      localStorage.removeItem(STORAGE_KEYS.USER_NICKNAME);
      localStorage.removeItem(STORAGE_KEYS.USER_SPIRIT);
    } catch {}

    const defaultSpirit: UserSpirit = {
      spiritId: 'fairy',
      customName: 'Tellie Spirit',
      colorId: 'pearl_white',
      accessory: 'none',
      selectedAt: new Date().toISOString(),
      happiness: 100
    };
    setUserSpirit(defaultSpirit);
    setUserNicknameState('');
    setHasCompletedOnboarding(false);
    setActiveTab('home');
    sound.playChime(520);
  };

  // Spirit actions (Tellie Spirit is always named "Tellie Spirit")
  const setUserSpiritData = (
    _spiritId: SpiritId = 'fairy',
    _customName?: string,
    colorId: FairyColorId = 'pearl_white',
    accessory: FairyAccessory = 'none'
  ) => {
    const newSpirit: UserSpirit = {
      spiritId: 'fairy',
      customName: 'Tellie Spirit',
      colorId,
      accessory,
      selectedAt: new Date().toISOString(),
      happiness: 100
    };
    setUserSpirit(newSpirit);
    sound.playChime(640);
  };

  const customizeFairy = ({
    colorId,
    accessory
  }: {
    customName?: string;
    colorId?: FairyColorId;
    accessory?: FairyAccessory;
  }) => {
    setUserSpirit(prev => {
      const base: UserSpirit = prev || {
        spiritId: 'fairy',
        customName: 'Tellie Spirit',
        colorId: 'pearl_white',
        accessory: 'none',
        selectedAt: new Date().toISOString(),
        happiness: 100
      };
      return {
        ...base,
        customName: 'Tellie Spirit',
        colorId: colorId !== undefined ? colorId : base.colorId || 'pearl_white',
        accessory: accessory !== undefined ? accessory : base.accessory || 'none'
      };
    });
    sound.playChime(640);
  };

  const updateSpiritName = (_newName: string) => {
    if (!userSpirit) return;
    const updated = { ...userSpirit, customName: 'Tellie Spirit' };
    setUserSpirit(updated);
    sound.playChime(520);
  };

  const feedSpiritLove = () => {
    if (!userSpirit) return;
    setUserSpirit(prev => prev ? { ...prev, happiness: Math.min(100, prev.happiness + 5) } : null);
    sound.playChime(720);
  };

  // Mood Actions
  const recordMood = (moodId: MoodId, note?: string, isNightRitual = false) => {
    const newEntry: MoodEntry = {
      id: `m-${Date.now()}`,
      moodId,
      note,
      timestamp: new Date().toISOString(),
      isNightRitual
    };
    setTodayMood(moodId);
    setMoodHistory(prev => [newEntry, ...prev]);
    sound.playChime(528);
  };

  // Community & Journal actions
  const createPost = ({
    title,
    content,
    moodId,
    category = 'chung',
    hashtags = [],
    isPrivate
  }: {
    title: string;
    content: string;
    moodId: MoodId;
    category?: Post['category'];
    hashtags?: string[];
    isPrivate: boolean;
  }) => {
    const categoryLabels: Record<string, string> = {
      'hoc-tap': 'Học tập & Tương lai',
      'gia-dinh': 'Gia đình & Xa nhà',
      'tinh-cam': 'Tình cảm & Bạn bè',
      'ban-than': 'Bản thân & Cảm xúc',
      'chung': 'Tâm sự chung'
    };

    // Reflective prototype Tellie Reply
    const prototypeTellieReplies = [
      'Cảm ơn bạn đã dũng cảm mở lòng nói ra điều này. Dù con đường phía trước có ra sao, mong bạn nhớ rằng những cảm xúc của bạn luôn xứng đáng được tôn trọng và vỗ về.',
      'Lắng nghe câu chuyện của bạn khiến Tellie cảm thấy muốn gửi đến bạn một cái ôm thật ấm. Đừng quên hít một hơi thật sâu và thả lỏng vai nhé.',
      'Có những giai đoạn cuộc sống như một đêm mù sương. Cảm ơn bạn vì đã bước thêm một bước hôm nay. Bạn không hề đơn độc đâu.',
      'Đặt xuống thành lời là cách dịu dàng nhất để xoa dịu trái tim. Tellie và các bạn sinh viên ở đây luôn lắng nghe bạn không phán xét.'
    ];
    const randomReply = prototypeTellieReplies[Math.floor(Math.random() * prototypeTellieReplies.length)];

    const newPost: Post = {
      id: `post-${Date.now()}`,
      authorNickname: userNickname,
      authorSpirit: userSpirit ? userSpirit.spiritId : 'fairy',
      title,
      content,
      moodId,
      category,
      categoryLabelVi: categoryLabels[category] || 'Tâm sự',
      hashtags: hashtags.filter(Boolean),
      supportiveCount: 0,
      userReacted: false,
      createdAt: new Date().toISOString(),
      isPrivate,
      comments: [],
      tellieReply: {
        spiritName: userSpirit?.customName ? userSpirit.customName : 'Fairy',
        badgeVi: 'Lời nhắn từ Tellie',
        message: randomReply
      }
    };

    setPosts(prev => [newPost, ...prev]);
    sound.playChime(660);
  };

  const toggleReaction = (postId: string, reactionType: 'hug' | 'listen' | 'relate' = 'hug') => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const wasReacted = p.userReacted;
          return {
            ...p,
            userReacted: !wasReacted,
            userReactionType: !wasReacted ? reactionType : undefined,
            supportiveCount: wasReacted ? Math.max(0, p.supportiveCount - 1) : p.supportiveCount + 1
          };
        }
        return p;
      })
    );
    sound.playChime(490);
  };

  const addComment = (postId: string, content: string) => {
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      postId,
      authorNickname: userNickname,
      authorAvatar: userSpirit ? userSpirit.spiritId : 'cloud',
      content,
      createdAt: new Date().toISOString()
    };

    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, newComment]
          };
        }
        return p;
      })
    );
    sound.playChime(600);
  };

  // Garden actions
  const plantMemory = ({
    title,
    note,
    category,
    plantType = 'leafy',
    flowerType,
    flowerNameVi,
    plantNameVi,
    color
  }: {
    title: string;
    note: string;
    category: string;
    plantType?: GardenPlant['plantType'];
    flowerType?: string;
    flowerNameVi?: string;
    plantNameVi?: string;
    color: string;
  }) => {
    const newPlant: GardenPlant = {
      id: `plant-${Date.now()}`,
      title,
      note,
      category,
      plantType,
      flowerType: flowerType || 'lotus',
      flowerNameVi: flowerNameVi || plantNameVi || 'Mầm cây an yên',
      plantNameVi: plantNameVi || flowerNameVi || 'Mầm cây an yên',
      color,
      plantedAt: new Date().toISOString(),
      currentStage: 'seed',
      history: [
        {
          stage: 'seed',
          date: new Date().toLocaleDateString('vi-VN'),
          note: 'Gieo hạt mầm đầu tiên vào lòng đất ấm'
        }
      ]
    };

    setGardenPlants(prev => [newPlant, ...prev]);
    sound.playChime(700);
  };

  const nurturePlant = (plantId: string, nurtureNote?: string) => {
    const stageOrder: GrowthStage[] = ['seed', 'sprout', 'sapling', 'growing', 'mature', 'special'];
    
    // Stage notes mapping for gentle reflection
    const stageDefaultNotes: Record<string, string> = {
      'sprout': 'Mầm non xanh tươi nhú lên từ hạt giống',
      'sapling': 'Cây con đâm những chiếc lá non đầu tiên',
      'growing': 'Cây đang lớn vươn mình đón sương đêm',
      'mature': 'Cây trưởng thành sum suê vững chãi',
      'special': 'Cột mốc đặc biệt tỏa ánh sáng diệu kỳ'
    };

    setGardenPlants(prev =>
      prev.map(p => {
        if (p.id === plantId) {
          // Normalize legacy stages
          let normalizedCurrent = p.currentStage;
          if (normalizedCurrent === 'bud') normalizedCurrent = 'sapling';
          if (normalizedCurrent === 'blooming') normalizedCurrent = 'mature';
          if (normalizedCurrent === 'celestial') normalizedCurrent = 'special';

          const curIndex = stageOrder.indexOf(normalizedCurrent as GrowthStage);
          if (curIndex >= 0 && curIndex < stageOrder.length - 1) {
            const nextStage = stageOrder[curIndex + 1];
            return {
              ...p,
              currentStage: nextStage,
              history: [
                ...p.history,
                {
                  stage: nextStage,
                  date: new Date().toLocaleDateString('vi-VN'),
                  note: nurtureNote || stageDefaultNotes[nextStage] || 'Nuôi dưỡng cùng suy ngẫm yêu thương'
                }
              ]
            };
          }
        }
        return p;
      })
    );
    sound.playChime(760);
  };

  // Pressure furnace
  const burnPaper = (content: string, title?: string, keepPrivate = false) => {
    sound.playBurnSound();
    if (keepPrivate) {
      const item: BurnedPaper = {
        id: `burn-${Date.now()}`,
        title: title || 'Nỗi lòng đã buông',
        content,
        burnedAt: new Date().toISOString(),
        keptPrivate: true
      };
      setBurnedPapers(prev => [item, ...prev]);
    }
  };

  // Prototype Reset
  const resetAllData = () => {
    localStorage.clear();
    setUserSpirit(null);
    setMoodHistory(INITIAL_MOOD_HISTORY);
    setTodayMood('calm');
    setPosts(INITIAL_POSTS);
    setGardenPlants(INITIAL_GARDEN_PLANTS);
    setBurnedPapers([]);
    setUserNickname('Bạn Ẩn Danh #68');
    sound.playChime(440);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        activeModal,
        openModal,
        closeModal,
        userSpirit,
        setUserSpiritData,
        customizeFairy,
        updateSpiritName,
        feedSpiritLove,
        todayMood,
        moodHistory,
        recordMood,
        posts,
        createPost,
        toggleReaction,
        addComment,
        gardenPlants,
        plantMemory,
        nurturePlant,
        burnedPapers,
        burnPaper,
        userNickname,
        setUserNickname,
        resetAllData,
        hasCompletedOnboarding,
        completeOnboarding,
        resetOnboarding
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
