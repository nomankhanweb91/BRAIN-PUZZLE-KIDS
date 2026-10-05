import React, { useEffect, useState } from 'react';
import { Star, RotateCcw, ArrowRight, Home } from 'lucide-react';
import { WoodenButton } from './WoodenButton';
import { sounds } from '../audio/SoundEngine';
import { ChildProfileName } from '../game/SaveManager';

interface VictoryModalProps {
  puzzleTitle: string;
  puzzleIcon: string;
  childName: ChildProfileName;
  stars: number;
  timeSec: number;
  moves: number;
  coinsEarned: number;
  onNext: () => void;
  onReplay: () => void;
  onHome: () => void;
}

const CONGRATULATION_HEADLINES = [
  (name: string) => `GREAT JOB, ${name.toUpperCase()}!`,
  (name: string) => `AWESOME JOB, ${name.toUpperCase()}!`,
  (name: string) => `FANTASTIC, ${name.toUpperCase()}!`,
  (name: string) => `SUPER SOLVER, ${name.toUpperCase()}!`,
  (name: string) => `WOW, ${name.toUpperCase()}! YOU SOLVED IT!`,
  (name: string) => `BRILLIANT WORK, ${name.toUpperCase()}!`,
];

const CONGRATULATION_SUBTITLES = [
  (name: string) => `You did it! Amazing work, ${name}! ⭐⭐⭐`,
  (name: string) => `You're doing great, ${name}! Fantastic work! ⭐⭐⭐`,
  (name: string) => `Super puzzle solving, ${name}! You're a star! ⭐⭐⭐`,
  (name: string) => `You solved the puzzle with brilliance, ${name}! ⭐⭐⭐`,
];

export const VictoryModal: React.FC<VictoryModalProps> = ({
  puzzleTitle,
  puzzleIcon,
  childName,
  stars,
  timeSec,
  moves,
  coinsEarned,
  onNext,
  onReplay,
  onHome,
}) => {
  const [headline] = useState(() => {
    const fn = CONGRATULATION_HEADLINES[Math.floor(Math.random() * CONGRATULATION_HEADLINES.length)];
    return fn(childName);
  });

  const [subtitle] = useState(() => {
    const fn = CONGRATULATION_SUBTITLES[Math.floor(Math.random() * CONGRATULATION_SUBTITLES.length)];
    return fn(childName);
  });

  useEffect(() => {
    sounds.playVictoryFanfare();

    // Voice congratulations after slight delay so fanfare starts first
    const voiceTimer = setTimeout(() => {
      sounds.speakCongratulations(childName);
    }, 600);

    // Star chimes sequentially
    for (let i = 0; i < stars; i++) {
      setTimeout(() => sounds.playStarEarned(i), 350 + i * 250);
    }

    return () => clearTimeout(voiceTimer);
  }, [stars, childName]);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 select-none animate-fadeIn">
      <div className="relative w-full max-w-lg wood-panel border-4 border-amber-950 rounded-3xl shadow-2xl flex flex-col items-center p-6 text-center overflow-hidden">
        {/* Decorative corner studs */}
        <div className="absolute top-3 left-3 w-3.5 h-3.5 rounded-full bg-amber-950 border border-amber-700" />
        <div className="absolute top-3 right-3 w-3.5 h-3.5 rounded-full bg-amber-950 border border-amber-700" />
        <div className="absolute bottom-3 left-3 w-3.5 h-3.5 rounded-full bg-amber-950 border border-amber-700" />
        <div className="absolute bottom-3 right-3 w-3.5 h-3.5 rounded-full bg-amber-950 border border-amber-700" />

        {/* Celebration Title */}
        <div className="text-4xl mb-1 animate-bounce">
          🎉
        </div>

        {/* Child Avatar & Name Tag */}
        <div className="bg-amber-950/80 border-2 border-yellow-500/80 px-4 py-1 rounded-full flex items-center gap-1.5 mb-2 shadow-md">
          <span className="text-lg">{childName === 'Arham' ? '👦' : '👧'}</span>
          <span className="font-['Nunito',sans-serif] font-black text-xs text-yellow-300 tracking-wider uppercase">
            {childName}
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-yellow-300 font-['Nunito',sans-serif] text-wood-shadow drop-shadow-md">
          {headline}
        </h2>
        <span className="text-xs sm:text-sm font-bold text-amber-200 mt-1 max-w-sm">
          {subtitle}
        </span>
        <span className="text-xs font-semibold text-amber-300/80 mt-0.5">
          {puzzleIcon} {puzzleTitle} Completed!
        </span>

        {/* 3 Stars Container */}
        <div className="flex items-center justify-center gap-3 my-4">
          {[1, 2, 3].map(s => {
            const earned = s <= stars;
            return (
              <div
                key={s}
                style={{ animationDelay: `${s * 220}ms` }}
                className={`transition-transform ${earned ? 'animate-star-pop' : 'opacity-30'}`}
              >
                <Star
                  className={`w-12 h-12 sm:w-16 sm:h-16 ${
                    earned
                      ? 'text-yellow-400 fill-yellow-400 filter drop-shadow-[0_4px_8px_rgba(234,179,8,0.7)]'
                      : 'text-amber-900 fill-amber-950'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Coin Award Banner */}
        <div className="bg-amber-950/80 border-2 border-yellow-500/80 px-6 py-2.5 rounded-2xl flex items-center gap-2.5 shadow-inner mb-4">
          <span className="text-2xl animate-spin">🪙</span>
          <span className="font-['Nunito',sans-serif] font-black text-xl text-yellow-300">
            +{coinsEarned} COINS EARNED!
          </span>
        </div>

        {/* Stats breakdown */}
        <div className="flex items-center gap-6 text-xs sm:text-sm font-black text-amber-200 mb-5">
          <span>⏱️ Time: {timeSec}s</span>
          <span>👆 Moves: {moves}</span>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
          <WoodenButton
            variant="green"
            size="lg"
            icon={<ArrowRight className="w-6 h-6 stroke-[3]" />}
            onClick={onNext}
            className="w-full sm:w-auto !px-8 shadow-xl"
          >
            NEXT PUZZLE
          </WoodenButton>

          <WoodenButton
            variant="blue"
            size="md"
            icon={<RotateCcw className="w-5 h-5" />}
            onClick={onReplay}
            className="w-full sm:w-auto"
          >
            REPLAY
          </WoodenButton>

          <WoodenButton
            variant="primary"
            size="md"
            icon={<Home className="w-5 h-5" />}
            onClick={onHome}
            className="w-full sm:w-auto"
          >
            MENU
          </WoodenButton>
        </div>
      </div>
    </div>
  );
};
