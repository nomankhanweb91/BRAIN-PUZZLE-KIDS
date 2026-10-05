import React from 'react';
import { X, Sparkles, Heart } from 'lucide-react';
import { ChildProfileName, saveManager } from '../game/SaveManager';
import { WoodenButton } from './WoodenButton';
import { sounds } from '../audio/SoundEngine';

interface ProfileSelectModalProps {
  currentProfile: ChildProfileName;
  onSelectProfile: (name: ChildProfileName) => void;
  onClose?: () => void;
  canDismiss?: boolean;
}

export const ProfileSelectModal: React.FC<ProfileSelectModalProps> = ({
  currentProfile,
  onSelectProfile,
  onClose,
  canDismiss = true,
}) => {
  const handleSelect = (name: ChildProfileName) => {
    sounds.playButtonClick();
    saveManager.setChildProfile(name);
    if (saveManager.getData().settings.voice) {
      sounds.speakVoice(`Hello, ${name}! Welcome to Brain Puzzle Kids!`);
    }
    onSelectProfile(name);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 select-none animate-fadeIn">
      <div className="relative w-full max-w-lg wood-panel border-4 border-amber-950 rounded-3xl shadow-2xl flex flex-col items-center p-6 text-center overflow-hidden">
        {/* Decorative corner wooden studs */}
        <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-amber-950 border border-amber-700" />
        <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-amber-950 border border-amber-700" />
        <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-amber-950 border border-amber-700" />
        <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-amber-950 border border-amber-700" />

        {canDismiss && onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-xl bg-red-800/80 hover:bg-red-700 text-white cursor-pointer transition-transform active:scale-95"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="w-16 h-16 rounded-3xl bg-amber-950/80 border-2 border-amber-700 flex items-center justify-center text-4xl shadow-inner mb-2 animate-gentle-bounce">
          🧩
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-yellow-300 font-['Nunito',sans-serif] text-wood-shadow drop-shadow-md">
          WHO IS PLAYING?
        </h2>
        <p className="text-sm font-bold text-amber-100 mt-1 mb-6">
          Choose your player profile to start puzzle solving!
        </p>

        {/* Profile Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-4">
          {/* Arham Button */}
          <button
            onClick={() => handleSelect('Arham')}
            className={`p-5 rounded-3xl border-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-150 active:scale-95 ${
              currentProfile === 'Arham'
                ? 'wood-btn-blue text-white ring-4 ring-yellow-400 shadow-2xl scale-102'
                : 'wood-panel border-amber-950 hover:border-yellow-400 text-amber-100 shadow-lg hover:scale-102'
            }`}
          >
            <div className="w-20 h-20 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-5xl shadow-inner animate-happy-wiggle">
              👦
            </div>
            <span className="text-2xl font-black font-['Nunito',sans-serif] tracking-wider drop-shadow-md">
              Arham
            </span>
            <span className="text-xs font-bold text-amber-200/90 bg-black/25 px-3 py-0.5 rounded-full">
              {currentProfile === 'Arham' ? '⭐ Active Player' : 'Tap to Play'}
            </span>
          </button>

          {/* Arisha Button */}
          <button
            onClick={() => handleSelect('Arisha')}
            className={`p-5 rounded-3xl border-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-150 active:scale-95 ${
              currentProfile === 'Arisha'
                ? 'wood-btn-purple text-white ring-4 ring-yellow-400 shadow-2xl scale-102'
                : 'wood-panel border-amber-950 hover:border-yellow-400 text-amber-100 shadow-lg hover:scale-102'
            }`}
          >
            <div className="w-20 h-20 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-5xl shadow-inner animate-happy-wiggle">
              👧
            </div>
            <span className="text-2xl font-black font-['Nunito',sans-serif] tracking-wider drop-shadow-md">
              Arisha
            </span>
            <span className="text-xs font-bold text-amber-200/90 bg-black/25 px-3 py-0.5 rounded-full">
              {currentProfile === 'Arisha' ? '⭐ Active Player' : 'Tap to Play'}
            </span>
          </button>
        </div>

        <p className="text-[11px] font-semibold text-amber-300/80 mt-2">
          🔒 Private &amp; offline. Profiles are only stored locally on this device.
        </p>
      </div>
    </div>
  );
};
