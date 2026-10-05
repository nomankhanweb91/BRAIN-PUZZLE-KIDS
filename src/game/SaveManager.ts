/**
 * SaveManager: Persistent Offline Storage for Brain Puzzle Kids
 * Safely persists progress, stars, coins, settings, achievements, daily streaks.
 */

export interface LevelProgress {
  stars: number;
  bestTime: number; // in seconds
  moves: number;
  completedAt: number;
}

export type ChildProfileName = 'Arham' | 'Arisha';

export interface GameSettings {
  music: boolean;
  sound: boolean;
  voice: boolean;
  vibration: boolean;
  language: 'en' | 'hi';
}

export interface DailyRewardState {
  lastClaimDate: string; // YYYY-MM-DD
  streak: number; // 1 to 7
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  rewardCoins: number;
  unlocked: boolean;
  unlockedAt?: number;
}

export interface GameSaveData {
  version: number;
  childProfile: ChildProfileName;
  hasSelectedProfile: boolean;
  coins: number;
  completedLevels: Record<string, LevelProgress>;
  unlockedLevels: string[];
  settings: GameSettings;
  dailyReward: DailyRewardState;
  dailyPuzzleCompletedDate: string;
  achievements: Record<string, boolean>;
}

const STORAGE_KEY = 'brain_puzzle_kids_save_v1';

export const INITIAL_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'first_puzzle',
    title: 'First Puzzle',
    description: 'Complete your very first puzzle!',
    icon: '🧩',
    rewardCoins: 50,
    unlocked: false,
  },
  {
    id: 'puzzle_master',
    title: 'Puzzle Master',
    description: 'Complete 10 different puzzles.',
    icon: '🏆',
    rewardCoins: 100,
    unlocked: false,
  },
  {
    id: 'super_brain',
    title: 'Super Brain',
    description: 'Complete 30 puzzles with brilliance.',
    icon: '🧠',
    rewardCoins: 250,
    unlocked: false,
  },
  {
    id: 'perfect_player',
    title: 'Perfect Player',
    description: 'Earn 3 stars on 10 puzzles.',
    icon: '⭐',
    rewardCoins: 150,
    unlocked: false,
  },
  {
    id: 'daily_champion',
    title: 'Daily Champion',
    description: 'Complete 3 daily puzzles.',
    icon: '📅',
    rewardCoins: 200,
    unlocked: false,
  },
  {
    id: 'speedy_solver',
    title: 'Speedy Solver',
    description: 'Complete any puzzle in under 30 seconds!',
    icon: '⚡',
    rewardCoins: 75,
    unlocked: false,
  },
  {
    id: 'rich_kid',
    title: 'Coin Collector',
    description: 'Collect 500 total coins in your wooden bank!',
    icon: '🪙',
    rewardCoins: 100,
    unlocked: false,
  },
];

const DEFAULT_SAVE_DATA: GameSaveData = {
  version: 1,
  childProfile: 'Arham',
  hasSelectedProfile: false,
  coins: 100, // warm welcoming starting balance for children
  completedLevels: {},
  unlockedLevels: ['animal_1', 'fruit_1', 'vehicle_1', 'nature_1', 'dino_1'], // Initial unlocked puzzles
  settings: {
    music: true,
    sound: true,
    voice: true,
    vibration: true,
    language: 'en',
  },
  dailyReward: {
    lastClaimDate: '',
    streak: 0,
  },
  dailyPuzzleCompletedDate: '',
  achievements: {},
};

class SaveManager {
  private data: GameSaveData = { ...DEFAULT_SAVE_DATA };

  constructor() {
    this.load();
  }

  public load(): GameSaveData {
    if (typeof window === 'undefined') return DEFAULT_SAVE_DATA;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          this.data = {
            ...DEFAULT_SAVE_DATA,
            ...parsed,
            childProfile: (parsed.childProfile === 'Arisha' ? 'Arisha' : 'Arham') as ChildProfileName,
            hasSelectedProfile: Boolean(parsed.hasSelectedProfile),
            settings: { ...DEFAULT_SAVE_DATA.settings, ...(parsed.settings || {}) },
            dailyReward: { ...DEFAULT_SAVE_DATA.dailyReward, ...(parsed.dailyReward || {}) },
            achievements: { ...(parsed.achievements || {}) },
            completedLevels: { ...(parsed.completedLevels || {}) },
            unlockedLevels: Array.isArray(parsed.unlockedLevels) && parsed.unlockedLevels.length > 0
              ? parsed.unlockedLevels
              : DEFAULT_SAVE_DATA.unlockedLevels,
          };
          return this.data;
        }
      }
    } catch (e) {
      console.warn('Corrupted save data detected, restoring safe defaults.', e);
    }
    this.data = { ...DEFAULT_SAVE_DATA };
    this.save();
    return this.data;
  }

  public save(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  public getData(): GameSaveData {
    return this.data;
  }

  public getChildProfile(): ChildProfileName {
    return this.data.childProfile || 'Arham';
  }

  public setChildProfile(name: ChildProfileName): void {
    this.data.childProfile = name;
    this.data.hasSelectedProfile = true;
    this.save();
  }

  public hasUserSelectedProfile(): boolean {
    return Boolean(this.data.hasSelectedProfile);
  }

  public addCoins(amount: number): number {
    this.data.coins = Math.max(0, this.data.coins + amount);
    this.save();
    return this.data.coins;
  }

  public spendCoins(amount: number): boolean {
    if (this.data.coins >= amount) {
      this.data.coins -= amount;
      this.save();
      return true;
    }
    return false;
  }

  public isLevelUnlocked(levelId: string): boolean {
    return this.data.unlockedLevels.includes(levelId);
  }

  public unlockLevel(levelId: string): void {
    if (!this.data.unlockedLevels.includes(levelId)) {
      this.data.unlockedLevels.push(levelId);
      this.save();
    }
  }

  public recordLevelCompletion(levelId: string, stars: number, timeSec: number, moves: number, nextLevelId?: string): { coinsEarned: number, isNewRecord: boolean } {
    const prev = this.data.completedLevels[levelId];
    const isFirstTime = !prev;
    const bestStars = Math.max(stars, prev?.stars || 0);
    const bestTime = prev ? Math.min(prev.bestTime, timeSec) : timeSec;
    const bestMoves = prev ? Math.min(prev.moves, moves) : moves;

    this.data.completedLevels[levelId] = {
      stars: bestStars,
      bestTime,
      moves: bestMoves,
      completedAt: Date.now(),
    };

    // Calculate coin reward
    let coinsEarned = stars * 15;
    if (isFirstTime) {
      coinsEarned += 25; // First completion bonus
    }
    this.addCoins(coinsEarned);

    // Unlock next level if provided
    if (nextLevelId) {
      this.unlockLevel(nextLevelId);
    }

    // Check achievements
    this.checkAchievements();

    this.save();
    return { coinsEarned, isNewRecord: isFirstTime || stars > (prev?.stars || 0) };
  }

  public getLevelProgress(levelId: string): LevelProgress | undefined {
    return this.data.completedLevels[levelId];
  }

  public getTotalStars(): number {
    return Object.values(this.data.completedLevels).reduce((acc, curr) => acc + (curr.stars || 0), 0);
  }

  public getCompletedCount(): number {
    return Object.keys(this.data.completedLevels).length;
  }

  public updateSettings(settings: Partial<GameSettings>): GameSettings {
    this.data.settings = { ...this.data.settings, ...settings };
    this.save();
    return this.data.settings;
  }

  public checkDailyRewardStatus(): { canClaim: boolean; currentDay: number; nextRewardCoins: number } {
    const today = new Date().toISOString().slice(0, 10);
    const { lastClaimDate, streak } = this.data.dailyReward;

    const rewardScale = [25, 40, 50, 75, 100, 150, 300]; // 7 days

    if (!lastClaimDate) {
      return { canClaim: true, currentDay: 1, nextRewardCoins: rewardScale[0] };
    }

    const last = new Date(lastClaimDate);
    const now = new Date(today);
    const diffDays = Math.round((now.getTime() - last.getTime()) / (1000 * 3600 * 24));

    if (diffDays === 0) {
      // Already claimed today
      const currentDay = Math.min(7, Math.max(1, streak));
      return { canClaim: false, currentDay, nextRewardCoins: rewardScale[currentDay - 1] };
    } else if (diffDays === 1) {
      // Consecutive day!
      const nextDay = streak >= 7 ? 1 : streak + 1;
      return { canClaim: true, currentDay: nextDay, nextRewardCoins: rewardScale[nextDay - 1] };
    } else {
      // Streak broken, reset to day 1
      return { canClaim: true, currentDay: 1, nextRewardCoins: rewardScale[0] };
    }
  }

  public claimDailyReward(): { coins: number; day: number } | null {
    const status = this.checkDailyRewardStatus();
    if (!status.canClaim) return null;

    const today = new Date().toISOString().slice(0, 10);
    this.data.dailyReward = {
      lastClaimDate: today,
      streak: status.currentDay,
    };
    this.addCoins(status.nextRewardCoins);
    this.save();
    return { coins: status.nextRewardCoins, day: status.currentDay };
  }

  public isDailyPuzzleCompletedToday(): boolean {
    const today = new Date().toISOString().slice(0, 10);
    return this.data.dailyPuzzleCompletedDate === today;
  }

  public markDailyPuzzleCompleted(): void {
    const today = new Date().toISOString().slice(0, 10);
    this.data.dailyPuzzleCompletedDate = today;
    this.addCoins(100); // 100 coin bonus for daily puzzle
    this.save();
  }

  public checkAchievements(): string[] {
    const newlyUnlocked: string[] = [];
    const completedCount = this.getCompletedCount();
    const threeStarCount = Object.values(this.data.completedLevels).filter(l => l.stars >= 3).length;

    const unlock = (id: string, reward: number) => {
      if (!this.data.achievements[id]) {
        this.data.achievements[id] = true;
        this.addCoins(reward);
        newlyUnlocked.push(id);
      }
    };

    if (completedCount >= 1) unlock('first_puzzle', 50);
    if (completedCount >= 10) unlock('puzzle_master', 100);
    if (completedCount >= 30) unlock('super_brain', 250);
    if (threeStarCount >= 10) unlock('perfect_player', 150);
    if (this.data.coins >= 500) unlock('rich_kid', 100);

    if (newlyUnlocked.length > 0) {
      this.save();
    }
    return newlyUnlocked;
  }

  public resetAllProgress(): void {
    this.data = { ...DEFAULT_SAVE_DATA };
    this.save();
  }
}

export const saveManager = new SaveManager();
