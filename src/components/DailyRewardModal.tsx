import React from 'react';
import { X, Gift, Check, Sparkles } from 'lucide-react';
import { saveManager } from '../game/SaveManager';
import { sounds } from '../audio/SoundEngine';
import { WoodenButton } from './WoodenButton';

interface DailyRewardModalProps {
  onClose: () => void;
  onRewardClaimed: (coinsEarned: number) => void;
  onTriggerSparkle: (x: number, y: number) => void;
}

export const DailyRewardModal: React.FC<DailyRewardModalProps> = ({
  onClose,
  onRewardClaimed,
  onTriggerSparkle,
}) => {
  const status = saveManager.checkDailyRewardStatus();
  const childName = saveManager.getChildProfile();
  const rewardScale = [25, 40, 50, 75, 100, 150, 300];

  const handleClaim = (e: React.MouseEvent) => {
    const res = saveManager.claimDailyReward();
    if (res) {
      sounds.playDailyReward();
      onTriggerSparkle(e.clientX, e.clientY);
      onRewardClaimed(res.coins);
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 select-none">
      <div className="relative w-full max-w-2xl wood-panel border-4 border-amber-950 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-amber-950/60 border-b-2 border-amber-800">
          <div className="flex items-center gap-2">
            <Gift className="w-6 h-6 text-yellow-300" />
            <h2 className="text-xl sm:text-2xl font-black text-yellow-300 font-['Nunito',sans-serif]">
              {childName}'s Daily Gifts
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-red-800/80 hover:bg-red-700 text-white border border-red-950 cursor-pointer shadow-md"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 7-Day Grid */}
        <div className="p-4 sm:p-6 flex-1 flex flex-col items-center">
          <p className="text-center text-amber-100 font-bold text-sm mb-4">
            Welcome back, {childName}! Collect your special daily puzzle coins! 🎁
          </p>

          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5 sm:gap-3 w-full mb-6">
            {rewardScale.map((coins, idx) => {
              const dayNum = idx + 1;
              const isPast = dayNum < status.currentDay || (!status.canClaim && dayNum === status.currentDay);
              const isToday = dayNum === status.currentDay && status.canClaim;
              const isFuture = dayNum > status.currentDay;

              return (
                <div
                  key={dayNum}
                  className={`relative rounded-2xl p-2.5 flex flex-col items-center justify-between border-2 transition-all ${
                    isToday
                      ? 'bg-gradient-to-b from-yellow-400 to-amber-500 border-yellow-200 shadow-xl scale-105 animate-pulse'
                      : isPast
                      ? 'bg-amber-950/80 border-amber-900 opacity-70'
                      : 'bg-amber-900/60 border-amber-700'
                  }`}
                >
                  <span className={`text-xs font-black ${isToday ? 'text-amber-950' : 'text-amber-200'}`}>
                    Day {dayNum}
                  </span>

                  <div className="my-2 text-2xl">
                    {dayNum === 7 ? '🎁' : '🪙'}
                  </div>

                  <span className={`text-xs font-black ${isToday ? 'text-amber-950' : 'text-yellow-300'}`}>
                    +{coins}
                  </span>

                  {isPast && (
                    <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Claim Button */}
          {status.canClaim ? (
            <WoodenButton
              variant="green"
              size="lg"
              onClick={handleClaim}
              icon={<Sparkles className="w-6 h-6 fill-white" />}
              className="shadow-2xl animate-bounce"
            >
              CLAIM DAY {status.currentDay} ({status.nextRewardCoins} COINS)
            </WoodenButton>
          ) : (
            <div className="bg-amber-950/80 border-2 border-amber-800 px-6 py-3 rounded-2xl text-center">
              <span className="font-['Nunito',sans-serif] font-black text-amber-300 text-sm">
                ✅ Already claimed today! Next reward unlocks tomorrow.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
