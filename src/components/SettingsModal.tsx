import React, { useState } from 'react';
import { X, Volume2, Music, Smartphone, Globe, RotateCcw, ShieldCheck, UserCheck, MessageSquare } from 'lucide-react';
import { saveManager, ChildProfileName } from '../game/SaveManager';
import { sounds } from '../audio/SoundEngine';
import { WoodenButton } from './WoodenButton';

interface SettingsModalProps {
  onClose: () => void;
  onSettingsChanged: () => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  onSettingsChanged,
  onResetData,
}) => {
  const data = saveManager.getData();
  const settings = data.settings;
  const childProfile = data.childProfile;
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const toggleSound = () => {
    const updated = !settings.sound;
    saveManager.updateSettings({ sound: updated });
    sounds.setSoundEnabled(updated);
    onSettingsChanged();
  };

  const toggleMusic = () => {
    const updated = !settings.music;
    saveManager.updateSettings({ music: updated });
    sounds.setMusicEnabled(updated);
    onSettingsChanged();
  };

  const toggleVoice = () => {
    const updated = !settings.voice;
    saveManager.updateSettings({ voice: updated });
    sounds.setVoiceEnabled(updated);
    onSettingsChanged();
  };

  const toggleVibration = () => {
    const updated = !settings.vibration;
    saveManager.updateSettings({ vibration: updated });
    sounds.vibrationEnabled = updated;
    onSettingsChanged();
  };

  const selectChild = (name: ChildProfileName) => {
    saveManager.setChildProfile(name);
    if (settings.voice) {
      sounds.speakVoice(`Hello, ${name}!`);
    }
    onSettingsChanged();
  };

  const setLanguage = (lang: 'en' | 'hi') => {
    saveManager.updateSettings({ language: lang });
    onSettingsChanged();
  };

  const handleConfirmReset = () => {
    saveManager.resetAllProgress();
    onResetData();
    setShowConfirmReset(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 select-none">
      <div className="relative w-full max-w-xl wood-panel border-4 border-amber-950 rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-amber-950/60 border-b-2 border-amber-800">
          <h2 className="text-xl sm:text-2xl font-black text-yellow-300 font-['Nunito',sans-serif]">
            Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-red-800/80 hover:bg-red-700 text-white border border-red-950 cursor-pointer shadow-md"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 flex-1 flex flex-col gap-3.5 overflow-y-auto">
          {/* Child Profile Switcher */}
          <div className="bg-amber-950/70 p-4 rounded-2xl border-2 border-amber-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="flex items-center gap-2.5 font-black text-amber-100 text-sm sm:text-base font-['Nunito',sans-serif]">
              <UserCheck className="w-5 h-5 text-yellow-300" />
              Active Player
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => selectChild('Arham')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-black text-xs sm:text-sm cursor-pointer border-2 transition-all ${
                  childProfile === 'Arham'
                    ? 'bg-sky-600 border-sky-300 text-white shadow-md scale-105'
                    : 'bg-amber-900 border-amber-800 text-amber-200'
                }`}
              >
                <span>👦</span>
                <span>Arham</span>
              </button>
              <button
                onClick={() => selectChild('Arisha')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-black text-xs sm:text-sm cursor-pointer border-2 transition-all ${
                  childProfile === 'Arisha'
                    ? 'bg-purple-600 border-purple-300 text-white shadow-md scale-105'
                    : 'bg-amber-900 border-amber-800 text-amber-200'
                }`}
              >
                <span>👧</span>
                <span>Arisha</span>
              </button>
            </div>
          </div>

          {/* Audio Controls */}
          <div className="bg-amber-950/60 p-4 rounded-2xl border border-amber-800 flex flex-col gap-3">
            {/* Sound FX */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2.5 font-black text-amber-100 text-sm sm:text-base font-['Nunito',sans-serif]">
                <Volume2 className="w-5 h-5 text-amber-300" />
                Sound Effects
              </span>
              <button
                onClick={toggleSound}
                className={`px-4 py-1.5 rounded-xl font-black text-xs sm:text-sm cursor-pointer transition-all border-2 ${
                  settings.sound
                    ? 'bg-emerald-600 border-emerald-400 text-white shadow-md'
                    : 'bg-amber-900 border-amber-800 text-amber-400'
                }`}
              >
                {settings.sound ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Music */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2.5 font-black text-amber-100 text-sm sm:text-base font-['Nunito',sans-serif]">
                <Music className="w-5 h-5 text-amber-300" />
                Playful Music
              </span>
              <button
                onClick={toggleMusic}
                className={`px-4 py-1.5 rounded-xl font-black text-xs sm:text-sm cursor-pointer transition-all border-2 ${
                  settings.music
                    ? 'bg-emerald-600 border-emerald-400 text-white shadow-md'
                    : 'bg-amber-900 border-amber-800 text-amber-400'
                }`}
              >
                {settings.music ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Voice Congratulations */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2.5 font-black text-amber-100 text-sm sm:text-base font-['Nunito',sans-serif]">
                <MessageSquare className="w-5 h-5 text-amber-300" />
                Voice Cheer
              </span>
              <button
                onClick={toggleVoice}
                className={`px-4 py-1.5 rounded-xl font-black text-xs sm:text-sm cursor-pointer transition-all border-2 ${
                  settings.voice
                    ? 'bg-emerald-600 border-emerald-400 text-white shadow-md'
                    : 'bg-amber-900 border-amber-800 text-amber-400'
                }`}
              >
                {settings.voice ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Vibration */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2.5 font-black text-amber-100 text-sm sm:text-base font-['Nunito',sans-serif]">
                <Smartphone className="w-5 h-5 text-amber-300" />
                Touch Vibration
              </span>
              <button
                onClick={toggleVibration}
                className={`px-4 py-1.5 rounded-xl font-black text-xs sm:text-sm cursor-pointer transition-all border-2 ${
                  settings.vibration
                    ? 'bg-emerald-600 border-emerald-400 text-white shadow-md'
                    : 'bg-amber-900 border-amber-800 text-amber-400'
                }`}
              >
                {settings.vibration ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Language selector */}
          <div className="bg-amber-950/60 p-4 rounded-2xl border border-amber-800 flex items-center justify-between">
            <span className="flex items-center gap-2.5 font-black text-amber-100 text-sm sm:text-base font-['Nunito',sans-serif]">
              <Globe className="w-5 h-5 text-amber-300" />
              Language
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-xl font-black text-xs cursor-pointer border ${
                  settings.language === 'en'
                    ? 'bg-yellow-400 text-amber-950 border-amber-600 shadow'
                    : 'bg-amber-900 text-amber-200 border-amber-800'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1.5 rounded-xl font-black text-xs cursor-pointer border ${
                  settings.language === 'hi'
                    ? 'bg-yellow-400 text-amber-950 border-amber-600 shadow'
                    : 'bg-amber-900 text-amber-200 border-amber-800'
                }`}
              >
                हिन्दी (Hindi)
              </button>
            </div>
          </div>

          {/* Child Safety & Privacy Info */}
          <div className="bg-emerald-950/60 border border-emerald-800 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-200">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-black text-white block mb-0.5">Child-Safe Offline Game</span>
              Only first names (Arham &amp; Arisha) are stored locally on this device. No microphone, camera, or personal data collected. Fully compliant with Google Play Families Policy.
            </div>
          </div>

          {/* Reset progress */}
          {showConfirmReset ? (
            <div className="bg-red-950/80 border-2 border-red-700 p-3.5 rounded-2xl flex flex-col items-center gap-2.5">
              <span className="text-red-200 font-bold text-xs text-center">
                Are you sure you want to reset all stars, coins, and levels?
              </span>
              <div className="flex items-center gap-3">
                <WoodenButton variant="red" size="sm" onClick={handleConfirmReset}>
                  Yes, Reset
                </WoodenButton>
                <WoodenButton variant="primary" size="sm" onClick={() => setShowConfirmReset(false)}>
                  Cancel
                </WoodenButton>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmReset(true)}
              className="text-amber-400 hover:text-amber-200 text-xs font-bold flex items-center justify-center gap-1.5 py-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Game Progress
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
