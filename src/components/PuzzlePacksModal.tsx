import React, { useState } from 'react';
import { X, Lock, Star } from 'lucide-react';
import { ALL_PUZZLES, CATEGORIES_CONFIG, PuzzleCategory, PuzzleDefinition, GridDifficulty } from '../game/PuzzleDatabase';
import { saveManager } from '../game/SaveManager';
import { WoodenButton } from './WoodenButton';

interface PuzzlePacksModalProps {
  onClose: () => void;
  onSelectPuzzle: (puzzle: PuzzleDefinition, grid: GridDifficulty) => void;
}

export const PuzzlePacksModal: React.FC<PuzzlePacksModalProps> = ({ onClose, onSelectPuzzle }) => {
  const [selectedCategory, setSelectedCategory] = useState<PuzzleCategory>('animals');
  const [selectedDifficulty, setSelectedDifficulty] = useState<GridDifficulty>(3);

  const categoryPuzzles = ALL_PUZZLES.filter(p => p.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 select-none">
      <div className="relative w-full max-w-4xl max-h-[92vh] wood-panel border-4 border-amber-950 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 bg-amber-950/60 border-b-2 border-amber-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧩</span>
            <h2 className="text-xl sm:text-2xl font-black text-yellow-300 font-['Nunito',sans-serif]">
              Puzzle Packs ({ALL_PUZZLES.length} Puzzles)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-red-800/80 hover:bg-red-700 text-white border border-red-950 cursor-pointer shadow-md transition-transform active:scale-95"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs & Difficulty Selector */}
        <div className="p-3 sm:p-4 bg-amber-900/40 border-b border-amber-800/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {CATEGORIES_CONFIG.map(cat => {
              const active = cat.id === selectedCategory;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-black text-xs sm:text-sm whitespace-nowrap cursor-pointer transition-all ${
                    active
                      ? 'bg-amber-400 text-amber-950 shadow-md scale-105 border-2 border-amber-600'
                      : 'bg-amber-950/70 text-amber-200 hover:bg-amber-900 border border-amber-800'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Difficulty selector (2x2 to 6x6) */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto bg-amber-950/80 p-1 rounded-xl border border-amber-800">
            <span className="text-xs font-bold text-amber-300 pl-2 pr-1">Pieces:</span>
            {([2, 3, 4, 5, 6] as GridDifficulty[]).map(diff => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-1 rounded-lg text-xs font-black cursor-pointer transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-yellow-400 text-amber-950 shadow'
                    : 'text-amber-200 hover:text-white'
                }`}
              >
                {diff}×{diff}
              </button>
            ))}
          </div>
        </div>

        {/* Puzzles Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {categoryPuzzles.map((puzzle, index) => {
            const unlocked = saveManager.isLevelUnlocked(puzzle.id) || index === 0;
            const progress = saveManager.getLevelProgress(puzzle.id);
            const stars = progress?.stars || 0;

            return (
              <div
                key={puzzle.id}
                onClick={() => {
                  if (unlocked) {
                    onSelectPuzzle(puzzle, selectedDifficulty);
                  }
                }}
                className={`relative rounded-2xl p-3 flex flex-col items-center justify-between border-2 transition-all ${
                  unlocked
                    ? 'bg-gradient-to-b from-amber-800/80 to-amber-950/90 border-amber-600 shadow-md hover:scale-102 hover:border-yellow-400 cursor-pointer'
                    : 'bg-amber-950/60 border-amber-900/60 opacity-60 cursor-not-allowed'
                }`}
              >
                {/* Puzzle Icon */}
                <div className="w-16 h-16 rounded-2xl bg-amber-900/50 border border-amber-700/60 flex items-center justify-center text-4xl shadow-inner my-1">
                  {puzzle.icon}
                </div>

                {/* Title */}
                <span className="text-center font-black text-amber-100 text-sm mt-1 truncate w-full font-['Nunito',sans-serif]">
                  {puzzle.title}
                </span>

                {/* Stars or Lock status */}
                <div className="flex items-center gap-1 mt-2">
                  {unlocked ? (
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3].map(s => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= stars
                              ? 'text-yellow-400 fill-yellow-400 drop-shadow'
                              : 'text-amber-900 fill-amber-950'
                          }`}
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                      <Lock className="w-3.5 h-3.5" /> Locked
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
