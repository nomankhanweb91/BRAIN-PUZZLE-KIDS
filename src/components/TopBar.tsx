import React from 'react';
import { ArrowLeft, Lightbulb, Music, Volume2, VolumeX, Sparkles, Coins } from 'lucide-react';
import { sounds } from '../audio/SoundEngine';
import { WoodenButton } from './WoodenButton';

interface TopBarProps {
  title: string;
  icon: string;
  gridSize: number;
  coins: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onBack: () => void;
  onHint: () => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onOpenAdReward: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  icon,
  gridSize,
  coins,
  soundEnabled,
  musicEnabled,
  onBack,
  onHint,
  onToggleSound,
  onToggleMusic,
  onOpenAdReward,
}) => {
  return (
    <header className="w-full flex items-center justify-between px-3 py-2 bg-gradient-to-b from-amber-800 to-amber-950 border-b-4 border-amber-950 shadow-md text-amber-50 select-none z-30 shrink-0">
      {/* Left zone: Back button & Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <WoodenButton
          variant="red"
          size="sm"
          onClick={onBack}
          aria-label="Back to menu"
          className="!px-3 !py-1.5 shadow-md"
        >
          <ArrowLeft className="w-5 h-5" />
        </WoodenButton>

        <div className="flex items-center gap-2 truncate">
          <span className="text-2xl drop-shadow-md shrink-0">{icon}</span>
          <div className="truncate">
            <h1 className="text-base sm:text-lg font-black text-amber-100 truncate drop-shadow-sm font-['Nunito',sans-serif]">
              {title}
            </h1>
            <span className="text-xs font-semibold text-amber-300">
              {gridSize} × {gridSize} Pieces
            </span>
          </div>
        </div>
      </div>

      {/* Right zone: Hint, Coins, Audio Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Hint Button */}
        <WoodenButton
          variant="purple"
          size="sm"
          onClick={onHint}
          className="!px-3.5 !py-1.5 shadow-md flex items-center gap-1.5"
          title="Use Hint (25 Coins)"
        >
          <Lightbulb className="w-4 h-4 text-yellow-300 fill-yellow-300 animate-pulse" />
          <span className="text-xs font-black hidden sm:inline">HINT</span>
          <span className="text-xs bg-purple-950/60 px-1.5 py-0.5 rounded-full text-yellow-300">
            25🪙
          </span>
        </WoodenButton>

        {/* Coins Counter with + button for rewarded ad */}
        <div
          onClick={onOpenAdReward}
          className="flex items-center gap-1.5 bg-amber-900/90 border-2 border-amber-600 px-3 py-1 rounded-xl shadow-inner cursor-pointer hover:bg-amber-800 transition-colors"
          title="Tap to get Free Bonus Coins!"
        >
          <Coins className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="font-['Nunito',sans-serif] font-black text-sm text-yellow-300 tabular-nums">
            {coins}
          </span>
          <span className="text-xs font-black bg-emerald-600 text-white rounded-md px-1 hover:scale-110 transition-transform">
            +
          </span>
        </div>

        {/* Audio Toggles */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              sounds.playButtonClick();
              onToggleSound();
            }}
            className={`p-2 rounded-xl border-2 transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-amber-700 border-amber-500 text-amber-100 hover:bg-amber-600'
                : 'bg-amber-950 border-amber-900 text-amber-500 opacity-60'
            }`}
            title={soundEnabled ? 'Sound FX On' : 'Sound FX Muted'}
            aria-label="Toggle Sound Effects"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              sounds.playButtonClick();
              onToggleMusic();
            }}
            className={`p-2 rounded-xl border-2 transition-all cursor-pointer ${
              musicEnabled
                ? 'bg-amber-700 border-amber-500 text-amber-100 hover:bg-amber-600'
                : 'bg-amber-950 border-amber-900 text-amber-500 opacity-60'
            }`}
            title={musicEnabled ? 'Music On' : 'Music Muted'}
            aria-label="Toggle Music"
          >
            <Music className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
