import React, { useEffect, useState } from 'react';
import { Play, Calendar, Grid, Gift, Settings, Award, Volume2, VolumeX, Music, User } from 'lucide-react';
import { WoodenButton } from './WoodenButton';
import { sounds } from '../audio/SoundEngine';
import { ChildProfileName } from '../game/SaveManager';

interface MainMenuProps {
  coins: number;
  totalStars: number;
  childProfile: ChildProfileName;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onPlay: () => void;
  onDailyPuzzle: () => void;
  onPuzzlePacks: () => void;
  onRewards: () => void;
  onAchievements: () => void;
  onSettings: () => void;
  onOpenProfileSelect: () => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  hasDailyReward: boolean;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  coins,
  totalStars,
  childProfile,
  soundEnabled,
  musicEnabled,
  onPlay,
  onDailyPuzzle,
  onPuzzlePacks,
  onRewards,
  onAchievements,
  onSettings,
  onOpenProfileSelect,
  onToggleSound,
  onToggleMusic,
  hasDailyReward,
}) => {
  // Mascots blinking state
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none touch-none bg-gradient-to-b from-sky-300 via-sky-200 to-emerald-200">
      {/* Background Animated Clouds */}
      <div className="absolute top-6 left-0 w-36 h-14 bg-white/80 rounded-full blur-[1px] animate-cloud-slow pointer-events-none" />
      <div className="absolute top-16 left-0 w-48 h-18 bg-white/70 rounded-full blur-[1px] animate-cloud-fast pointer-events-none" />

      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between p-3 sm:p-5 z-20">
        {/* Left: Coins & Stars badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 bg-amber-900/80 border-2 border-amber-500/80 px-3 sm:px-3.5 py-1.5 rounded-2xl shadow-lg text-amber-50">
            <span className="text-xl">🪙</span>
            <span className="font-['Nunito',sans-serif] font-black text-base sm:text-lg text-yellow-300 tabular-nums">
              {coins}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-amber-900/80 border-2 border-amber-500/80 px-2.5 sm:px-3 py-1.5 rounded-2xl shadow-lg text-amber-50">
            <span className="text-xl text-yellow-400">⭐</span>
            <span className="font-['Nunito',sans-serif] font-black text-base sm:text-lg text-amber-100 tabular-nums">
              {totalStars}
            </span>
          </div>
        </div>

        {/* Right: Profile Selector, Audio Toggles, Settings */}
        <div className="flex items-center gap-2">
          {/* Child Profile Button */}
          <button
            onClick={onOpenProfileSelect}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border-2 font-['Nunito',sans-serif] font-black text-xs sm:text-sm cursor-pointer transition-transform active:scale-95 shadow-lg ${
              childProfile === 'Arham'
                ? 'bg-sky-600 hover:bg-sky-500 border-sky-300 text-white'
                : 'bg-purple-600 hover:bg-purple-500 border-purple-300 text-white'
            }`}
            title="Switch Player Profile"
          >
            <span className="text-lg">{childProfile === 'Arham' ? '👦' : '👧'}</span>
            <span>{childProfile}</span>
          </button>

          <button
            onClick={onToggleSound}
            className="p-2.5 rounded-2xl bg-amber-900/80 border-2 border-amber-500 text-amber-100 hover:bg-amber-800 transition-transform active:scale-95 cursor-pointer shadow-lg"
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-amber-400" />}
          </button>

          <button
            onClick={onToggleMusic}
            className="p-2.5 rounded-2xl bg-amber-900/80 border-2 border-amber-500 text-amber-100 hover:bg-amber-800 transition-transform active:scale-95 cursor-pointer shadow-lg"
            title={musicEnabled ? 'Mute Music' : 'Enable Music'}
          >
            <Music className="w-5 h-5" />
          </button>

          <button
            onClick={onSettings}
            className="p-2.5 rounded-2xl bg-amber-900/80 border-2 border-amber-500 text-amber-100 hover:bg-amber-800 transition-transform active:scale-95 cursor-pointer shadow-lg"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Center Area: Welcome Banner, Title and Playful Mascot Characters */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 px-4">
        {/* Child Personalization Welcome Banner */}
        <div className="bg-amber-950/85 border-2 border-amber-600 px-4 py-1.5 rounded-full shadow-lg mb-2 flex items-center gap-2 animate-fadeIn">
          <span className="text-base">{childProfile === 'Arham' ? '👦' : '👧'}</span>
          <span className="font-['Nunito',sans-serif] font-black text-xs sm:text-sm text-yellow-300 tracking-wide uppercase">
            WELCOME BACK, {childProfile}! 🧠
          </span>
        </div>

        {/* Title Wooden Plaque */}
        <div className="relative mb-2 sm:mb-4 animate-gentle-bounce">
          <div className="wood-panel px-6 sm:px-12 py-3 sm:py-4 rounded-3xl border-4 border-amber-950 shadow-2xl flex flex-col items-center">
            <span className="text-xs sm:text-sm font-black tracking-widest text-amber-200 uppercase drop-shadow">
              Kids Educational Jigsaw
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-yellow-300 font-['Nunito',sans-serif] tracking-wider text-wood-shadow drop-shadow-md">
              BRAIN PUZZLE KIDS
            </h1>
          </div>
          {/* Decorative wooden studs/bolts */}
          <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-amber-950 border border-amber-700" />
          <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-amber-950 border border-amber-700" />
          <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-amber-950 border border-amber-700" />
          <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-amber-950 border border-amber-700" />
        </div>

        {/* Mascot Characters Preview (Ellie Elephant & Leo Lion waving) */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 my-1 sm:my-2">
          {/* Ellie Elephant */}
          <div className="flex flex-col items-center animate-happy-wiggle">
            <div className="text-5xl sm:text-6xl drop-shadow-lg filter transition-transform hover:scale-110">
              {isBlinking ? '😴' : '🐘'}
            </div>
            <span className="text-xs font-black text-amber-950 bg-white/70 px-2 py-0.5 rounded-full mt-1">
              Ellie
            </span>
          </div>

          {/* Leo Lion */}
          <div className="flex flex-col items-center animate-gentle-bounce">
            <div className="text-5xl sm:text-6xl drop-shadow-lg filter transition-transform hover:scale-110">
              {isBlinking ? '😌' : '🦁'}
            </div>
            <span className="text-xs font-black text-amber-950 bg-white/70 px-2 py-0.5 rounded-full mt-1">
              Leo
            </span>
          </div>

          {/* Pip Panda */}
          <div className="hidden sm:flex flex-col items-center animate-happy-wiggle">
            <div className="text-5xl sm:text-6xl drop-shadow-lg filter transition-transform hover:scale-110">
              {isBlinking ? '😉' : '🐼'}
            </div>
            <span className="text-xs font-black text-amber-950 bg-white/70 px-2 py-0.5 rounded-full mt-1">
              Pip
            </span>
          </div>
        </div>

        {/* Primary Action Buttons Container */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-2 sm:mt-4 w-full max-w-xl justify-center">
          <WoodenButton
            variant="green"
            size="xl"
            icon={<Play className="w-8 h-8 fill-white" />}
            onClick={onPlay}
            className="w-full sm:w-auto !px-10 shadow-2xl animate-pulse hover:animate-none"
          >
            PLAY
          </WoodenButton>

          <WoodenButton
            variant="blue"
            size="lg"
            icon={<Calendar className="w-6 h-6" />}
            onClick={onDailyPuzzle}
            className="w-full sm:w-auto shadow-xl"
          >
            DAILY PUZZLE
          </WoodenButton>

          <WoodenButton
            variant="primary"
            size="lg"
            icon={<Grid className="w-6 h-6" />}
            onClick={onPuzzlePacks}
            className="w-full sm:w-auto shadow-xl"
          >
            PUZZLE PACKS
          </WoodenButton>
        </div>

        {/* Secondary Buttons Row */}
        <div className="flex items-center gap-3 mt-3 justify-center">
          <WoodenButton
            variant="purple"
            size="md"
            icon={<Gift className="w-5 h-5" />}
            onClick={onRewards}
            className="relative shadow-lg"
          >
            REWARDS
            {hasDailyReward && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border border-white"></span>
              </span>
            )}
          </WoodenButton>

          <WoodenButton
            variant="primary"
            size="md"
            icon={<Award className="w-5 h-5 text-amber-900" />}
            onClick={onAchievements}
            className="shadow-lg"
          >
            AWARDS
          </WoodenButton>
        </div>
      </div>

      {/* Bottom Rolling Green Grass and Daisies */}
      <div className="relative w-full h-14 sm:h-20 bg-gradient-to-t from-emerald-700 via-emerald-600 to-green-500 border-t-4 border-emerald-800 shadow-2xl flex items-center justify-around z-20 px-4">
        <span className="text-xl animate-bounce">🌼</span>
        <span className="text-xl">🌸</span>
        <span className="text-xs sm:text-sm font-black text-emerald-100/90 font-['Nunito',sans-serif]">
          50+ Kid-Friendly Jigsaw Puzzles • Safe &amp; 100% Offline
        </span>
        <span className="text-xl">🌺</span>
        <span className="text-xl animate-bounce">🌻</span>
      </div>
    </div>
  );
};
