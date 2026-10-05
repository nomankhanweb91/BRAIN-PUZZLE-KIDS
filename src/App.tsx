/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ALL_PUZZLES, PuzzleDefinition, GridDifficulty } from './game/PuzzleDatabase';
import { saveManager, ChildProfileName } from './game/SaveManager';
import { sounds } from './audio/SoundEngine';
import { adManager } from './game/AdManager';

import { MainMenu } from './components/MainMenu';
import { TopBar } from './components/TopBar';
import { PuzzleBoard } from './components/PuzzleBoard';
import { PuzzlePacksModal } from './components/PuzzlePacksModal';
import { DailyRewardModal } from './components/DailyRewardModal';
import { AchievementsModal } from './components/AchievementsModal';
import { SettingsModal } from './components/SettingsModal';
import { VictoryModal } from './components/VictoryModal';
import { AdMobModal } from './components/AdMobModal';
import { ProfileSelectModal } from './components/ProfileSelectModal';
import { SparkleEffect } from './components/SparkleEffect';

type GameScreen = 'MENU' | 'GAME';

export default function App() {
  const [screen, setScreen] = useState<GameScreen>('MENU');
  const [currentPuzzle, setCurrentPuzzle] = useState<PuzzleDefinition>(ALL_PUZZLES[0]);
  const [currentDifficulty, setCurrentDifficulty] = useState<GridDifficulty>(3);
  const [isDailyPuzzle, setIsDailyPuzzle] = useState<boolean>(false);

  // Persistence state
  const [childProfile, setChildProfile] = useState<ChildProfileName>(() => saveManager.getChildProfile());
  const [coins, setCoins] = useState<number>(() => saveManager.getData().coins);
  const [totalStars, setTotalStars] = useState<number>(() => saveManager.getTotalStars());
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => saveManager.getData().settings.sound);
  const [musicEnabled, setMusicEnabled] = useState<boolean>(() => saveManager.getData().settings.music);

  // Modals
  const [showProfileModal, setShowProfileModal] = useState<boolean>(() => !saveManager.hasUserSelectedProfile());
  const [showPacksModal, setShowPacksModal] = useState(false);
  const [showDailyRewardModal, setShowDailyRewardModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [adRewardType, setAdRewardType] = useState<'coins' | 'hint'>('coins');

  // In-Game state
  const [victoryStats, setVictoryStats] = useState<{
    stars: number;
    timeSec: number;
    moves: number;
    coinsEarned: number;
  }>({ stars: 3, timeSec: 0, moves: 0, coinsEarned: 50 });

  const [hintTrigger, setHintTrigger] = useState<number>(0);
  const [sparkleBursts, setSparkleBursts] = useState<{ x: number; y: number; count?: number }[]>([]);

  // Sound & Voice sync
  useEffect(() => {
    sounds.setSoundEnabled(soundEnabled);
    sounds.setMusicEnabled(musicEnabled);
    sounds.setVoiceEnabled(saveManager.getData().settings.voice);
    sounds.vibrationEnabled = saveManager.getData().settings.vibration;
  }, [soundEnabled, musicEnabled]);

  // Start cheerful background music on first interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (musicEnabled) {
        sounds.startMusic();
      }
      window.removeEventListener('pointerdown', handleFirstInteraction);
    };
    window.addEventListener('pointerdown', handleFirstInteraction);
    return () => window.removeEventListener('pointerdown', handleFirstInteraction);
  }, [musicEnabled]);

  const triggerSparkle = useCallback((x: number, y: number, count = 20) => {
    setSparkleBursts(prev => [...prev.slice(-4), { x, y, count }]);
  }, []);

  // Launch puzzle
  const startPuzzle = (puzzle: PuzzleDefinition, grid: GridDifficulty, isDaily: boolean = false) => {
    setCurrentPuzzle(puzzle);
    setCurrentDifficulty(grid);
    setIsDailyPuzzle(isDaily);
    setShowPacksModal(false);
    setShowVictoryModal(false);
    setScreen('GAME');
  };

  // Launch daily puzzle (determined by current date hash)
  const startDailyPuzzle = () => {
    const now = new Date();
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
    const puzzleIndex = Math.abs(dayOfYear) % ALL_PUZZLES.length;
    const dailyP = ALL_PUZZLES[puzzleIndex];
    startPuzzle(dailyP, 3, true);
  };

  // Puzzle completed handler
  const handlePuzzleComplete = (stars: number, timeSec: number, moves: number) => {
    // Find next puzzle
    const currIdx = ALL_PUZZLES.findIndex(p => p.id === currentPuzzle.id);
    const nextPuzzle = ALL_PUZZLES[(currIdx + 1) % ALL_PUZZLES.length];

    let coinsEarned = 0;
    if (isDailyPuzzle) {
      saveManager.markDailyPuzzleCompleted();
      coinsEarned = 100 + stars * 15;
    } else {
      const res = saveManager.recordLevelCompletion(currentPuzzle.id, stars, timeSec, moves, nextPuzzle.id);
      coinsEarned = res.coinsEarned;
    }

    setCoins(saveManager.getData().coins);
    setTotalStars(saveManager.getTotalStars());
    setVictoryStats({
      stars,
      timeSec,
      moves,
      coinsEarned,
    });
    setShowVictoryModal(true);

    // Natural ad transition check
    adManager.onPuzzleFinished(() => {
      // Optional friendly ad prompt
    });
  };

  // Next puzzle action
  const handleNextPuzzle = () => {
    setShowVictoryModal(false);
    const currIdx = ALL_PUZZLES.findIndex(p => p.id === currentPuzzle.id);
    const nextP = ALL_PUZZLES[(currIdx + 1) % ALL_PUZZLES.length];
    startPuzzle(nextP, nextP.defaultGrid, false);
  };

  // Replay puzzle
  const handleReplay = () => {
    setShowVictoryModal(false);
    startPuzzle(currentPuzzle, currentDifficulty, isDailyPuzzle);
  };

  // Hint action
  const handleHintClick = () => {
    if (coins < 25) {
      setAdRewardType('hint');
      setShowAdModal(true);
    } else {
      setHintTrigger(prev => prev + 1);
    }
  };

  const spendCoins = (amount: number): boolean => {
    const success = saveManager.spendCoins(amount);
    if (success) {
      setCoins(saveManager.getData().coins);
    }
    return success;
  };

  const handleRewardGranted = (type: 'coins' | 'hint') => {
    if (type === 'coins') {
      saveManager.addCoins(50);
      setCoins(saveManager.getData().coins);
    } else {
      // Free hint executed
      setHintTrigger(prev => prev + 1);
    }
    setShowAdModal(false);
  };

  const dailyRewardStatus = saveManager.checkDailyRewardStatus();

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col bg-amber-950 font-['Fredoka',sans-serif]">
      {/* Visual Sparkle Particle System */}
      <SparkleEffect bursts={sparkleBursts} />

      {/* Screen Routing */}
      {screen === 'MENU' ? (
        <MainMenu
          coins={coins}
          totalStars={totalStars}
          childProfile={childProfile}
          soundEnabled={soundEnabled}
          musicEnabled={musicEnabled}
          onPlay={() => {
            // Pick first uncompleted puzzle or default
            const firstUncompleted = ALL_PUZZLES.find(p => !saveManager.getLevelProgress(p.id));
            startPuzzle(firstUncompleted || ALL_PUZZLES[0], firstUncompleted?.defaultGrid || 3);
          }}
          onDailyPuzzle={startDailyPuzzle}
          onPuzzlePacks={() => setShowPacksModal(true)}
          onRewards={() => setShowDailyRewardModal(true)}
          onAchievements={() => setShowAchievementsModal(true)}
          onSettings={() => setShowSettingsModal(true)}
          onOpenProfileSelect={() => setShowProfileModal(true)}
          onToggleSound={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            saveManager.updateSettings({ sound: next });
          }}
          onToggleMusic={() => {
            const next = !musicEnabled;
            setMusicEnabled(next);
            saveManager.updateSettings({ music: next });
          }}
          hasDailyReward={dailyRewardStatus.canClaim}
        />
      ) : (
        <div className="w-full h-full flex flex-col bg-gradient-to-b from-sky-400 via-sky-300 to-amber-900 overflow-hidden">
          <TopBar
            title={currentPuzzle.title}
            icon={currentPuzzle.icon}
            gridSize={currentDifficulty}
            coins={coins}
            soundEnabled={soundEnabled}
            musicEnabled={musicEnabled}
            onBack={() => setScreen('MENU')}
            onHint={handleHintClick}
            onToggleSound={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              saveManager.updateSettings({ sound: next });
            }}
            onToggleMusic={() => {
              const next = !musicEnabled;
              setMusicEnabled(next);
              saveManager.updateSettings({ music: next });
            }}
            onOpenAdReward={() => {
              setAdRewardType('coins');
              setShowAdModal(true);
            }}
          />

          <PuzzleBoard
            key={`${currentPuzzle.id}_${currentDifficulty}`}
            puzzle={currentPuzzle}
            gridSize={currentDifficulty}
            childName={childProfile}
            onComplete={handlePuzzleComplete}
            onTriggerSparkle={triggerSparkle}
            hintTrigger={hintTrigger}
            canAffordHint={coins >= 25}
            onNeedCoinsForHint={() => {
              setAdRewardType('hint');
              setShowAdModal(true);
            }}
            onSpendCoins={spendCoins}
          />
        </div>
      )}

      {/* Modals */}
      {showProfileModal && (
        <ProfileSelectModal
          currentProfile={childProfile}
          canDismiss={saveManager.hasUserSelectedProfile()}
          onClose={() => setShowProfileModal(false)}
          onSelectProfile={name => {
            setChildProfile(name);
            setShowProfileModal(false);
          }}
        />
      )}

      {showPacksModal && (
        <PuzzlePacksModal
          onClose={() => setShowPacksModal(false)}
          onSelectPuzzle={(puzzle, grid) => startPuzzle(puzzle, grid)}
        />
      )}

      {showDailyRewardModal && (
        <DailyRewardModal
          onClose={() => setShowDailyRewardModal(false)}
          onRewardClaimed={amount => {
            setCoins(saveManager.getData().coins);
          }}
          onTriggerSparkle={triggerSparkle}
        />
      )}

      {showAchievementsModal && (
        <AchievementsModal onClose={() => setShowAchievementsModal(false)} />
      )}

      {showSettingsModal && (
        <SettingsModal
          onClose={() => setShowSettingsModal(false)}
          onSettingsChanged={() => {
            const data = saveManager.getData();
            setChildProfile(data.childProfile);
            setSoundEnabled(data.settings.sound);
            setMusicEnabled(data.settings.music);
          }}
          onResetData={() => {
            const data = saveManager.getData();
            setChildProfile(data.childProfile);
            setCoins(data.coins);
            setTotalStars(0);
          }}
        />
      )}

      {showVictoryModal && (
        <VictoryModal
          puzzleTitle={currentPuzzle.title}
          puzzleIcon={currentPuzzle.icon}
          childName={childProfile}
          stars={victoryStats.stars}
          timeSec={victoryStats.timeSec}
          moves={victoryStats.moves}
          coinsEarned={victoryStats.coinsEarned}
          onNext={handleNextPuzzle}
          onReplay={handleReplay}
          onHome={() => {
            setShowVictoryModal(false);
            setScreen('MENU');
          }}
        />
      )}

      {showAdModal && (
        <AdMobModal
          rewardType={adRewardType}
          onClose={() => setShowAdModal(false)}
          onRewardGranted={handleRewardGranted}
        />
      )}
    </div>
  );
}
