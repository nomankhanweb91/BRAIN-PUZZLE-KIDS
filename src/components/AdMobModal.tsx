import React, { useState, useEffect } from 'react';
import { X, Play, Coins, Lightbulb, ShieldCheck, CheckCircle } from 'lucide-react';
import { ADMOB_TEST_CONFIG } from '../game/AdManager';
import { WoodenButton } from './WoodenButton';
import { sounds } from '../audio/SoundEngine';

interface AdMobModalProps {
  rewardType: 'coins' | 'hint';
  onClose: () => void;
  onRewardGranted: (type: 'coins' | 'hint') => void;
}

const FUN_ANIMAL_FACTS = [
  { animal: '🐘 Elephant', fact: 'Elephants are the only animals that cannot jump, but they have wonderful memories!' },
  { animal: '🦁 Lion', fact: 'A lion’s roar can be heard from 5 miles (8 km) away across the savanna!' },
  { animal: '🐼 Panda', fact: 'Baby pandas are as small as a stick of butter when they are born!' },
  { animal: '🦒 Giraffe', fact: 'Giraffes have blue-purple tongues that can be up to 18 inches long!' },
  { animal: '🐬 Dolphin', fact: 'Dolphins sleep with one eye open and give each other unique names!' },
];

export const AdMobModal: React.FC<AdMobModalProps> = ({ rewardType, onClose, onRewardGranted }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(5);
  const [factIndex] = useState(() => Math.floor(Math.random() * FUN_ANIMAL_FACTS.length));

  useEffect(() => {
    if (!isPlaying) return;
    if (secondsRemaining <= 0) {
      sounds.playCoinEarned();
      onRewardGranted(rewardType);
      return;
    }

    const timer = setTimeout(() => {
      setSecondsRemaining(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isPlaying, secondsRemaining, onRewardGranted, rewardType]);

  const startAd = () => {
    setIsPlaying(true);
    setSecondsRemaining(5);
  };

  const selectedFact = FUN_ANIMAL_FACTS[factIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 select-none">
      <div className="relative w-full max-w-lg wood-panel border-4 border-amber-950 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-center">
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 bg-amber-950/70 border-b-2 border-amber-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">📺</span>
            <span className="font-['Nunito',sans-serif] font-black text-yellow-300 text-sm sm:text-base">
              Google AdMob (Test Ad Unit)
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-red-800/80 hover:bg-red-700 text-white cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ad Body */}
        <div className="p-5 flex flex-col items-center">
          {/* Families Policy Banner */}
          <div className="bg-emerald-950/60 border border-emerald-800 rounded-xl px-3 py-1.5 flex items-center gap-1.5 text-[11px] text-emerald-200 mb-4 w-full justify-center">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Google Play Families Policy &amp; COPPA Child-Directed Mode</span>
          </div>

          {!isPlaying ? (
            <>
              <div className="w-20 h-20 rounded-3xl bg-amber-950/80 border-2 border-amber-700 flex items-center justify-center text-4xl shadow-inner my-2">
                {rewardType === 'coins' ? '🪙' : '💡'}
              </div>

              <h3 className="text-xl font-black text-amber-100 font-['Nunito',sans-serif] mt-2 mb-1">
                {rewardType === 'coins' ? 'Watch Fun Video for +50 Free Coins?' : 'Watch Fun Video for 1 Free Hint?'}
              </h3>
              <p className="text-xs text-amber-200/90 font-medium mb-5 max-w-xs">
                A short, friendly 5-second animal learning clip to reward your brain!
              </p>

              <WoodenButton
                variant="green"
                size="lg"
                icon={<Play className="w-5 h-5 fill-white" />}
                onClick={startAd}
                className="w-full sm:w-auto !px-8 shadow-xl"
              >
                WATCH VIDEO
              </WoodenButton>
            </>
          ) : secondsRemaining > 0 ? (
            <div className="w-full flex flex-col items-center py-4">
              <span className="text-xs font-black bg-amber-950 px-3 py-1 rounded-full text-yellow-300 border border-amber-700 mb-3">
                Reward in {secondsRemaining}s...
              </span>

              {/* Kid-friendly Animal fact presentation */}
              <div className="w-full bg-amber-950/80 border-2 border-amber-700 rounded-2xl p-4 flex flex-col items-center">
                <span className="text-3xl mb-2 animate-bounce">
                  {selectedFact.animal.split(' ')[0]}
                </span>
                <span className="font-['Nunito',sans-serif] font-black text-amber-100 text-sm mb-1">
                  Fun Animal Fact
                </span>
                <p className="text-xs text-amber-200 leading-relaxed font-semibold">
                  {selectedFact.fact}
                </p>
              </div>

              <div className="w-full bg-amber-950 rounded-full h-2.5 mt-4 overflow-hidden border border-amber-800">
                <div
                  className="bg-emerald-400 h-full transition-all duration-1000 ease-linear"
                  style={{ width: `${((5 - secondsRemaining) / 5) * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="py-6 flex flex-col items-center">
              <CheckCircle className="w-16 h-16 text-emerald-400 mb-2 animate-bounce" />
              <h3 className="text-2xl font-black text-yellow-300 font-['Nunito',sans-serif]">
                Reward Granted!
              </h3>
              <span className="text-sm font-bold text-amber-100 mt-1">
                {rewardType === 'coins' ? '+50 Coins Added!' : '1 Free Hint Ready!'}
              </span>
            </div>
          )}

          {/* Test Ad Unit Details */}
          <div className="mt-4 pt-3 border-t border-amber-900/60 w-full text-[10px] text-amber-400/80 font-mono">
            Test Ad ID: {ADMOB_TEST_CONFIG.REWARDED_ID}
          </div>
        </div>
      </div>
    </div>
  );
};
