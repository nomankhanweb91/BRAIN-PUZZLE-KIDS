import React from 'react';
import { X, Trophy, CheckCircle2 } from 'lucide-react';
import { INITIAL_ACHIEVEMENTS } from '../game/SaveManager';
import { saveManager } from '../game/SaveManager';

interface AchievementsModalProps {
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ onClose }) => {
  const data = saveManager.getData();
  const achievements = INITIAL_ACHIEVEMENTS.map(ach => ({
    ...ach,
    unlocked: !!data.achievements[ach.id],
  }));

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 select-none">
      <div className="relative w-full max-w-2xl max-h-[88vh] wood-panel border-4 border-amber-950 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-amber-950/60 border-b-2 border-amber-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-300" />
            <h2 className="text-xl sm:text-2xl font-black text-yellow-300 font-['Nunito',sans-serif]">
              Awards &amp; Trophies ({unlockedCount}/{achievements.length})
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

        {/* List of achievements */}
        <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-3">
          {achievements.map(ach => (
            <div
              key={ach.id}
              className={`p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 transition-all ${
                ach.unlocked
                  ? 'bg-gradient-to-r from-amber-800/90 to-amber-900/90 border-yellow-400 shadow-md'
                  : 'bg-amber-950/60 border-amber-900/80 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-950/70 border border-amber-700 flex items-center justify-center text-2xl shadow-inner shrink-0">
                  {ach.icon}
                </div>
                <div>
                  <h3 className="font-['Nunito',sans-serif] font-black text-amber-100 text-base">
                    {ach.title}
                  </h3>
                  <p className="text-xs text-amber-200/90 font-medium">
                    {ach.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-black bg-amber-950 px-2.5 py-1 rounded-xl text-yellow-300 border border-amber-700">
                  +{ach.rewardCoins} 🪙
                </span>
                {ach.unlocked ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-950 shrink-0" />
                ) : (
                  <span className="text-xs text-amber-400 font-bold">In progress</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
