import React, { useState, useEffect } from 'react';
import { GameSettings, GameState } from './types';
import Lobby from './components/Lobby';
import StoryEngine from './components/StoryEngine';
import CompanionBook from './components/Encyclopedia';
import Gallery from './components/Gallery';
import Settings from './components/Settings';
import { gamelanSynth } from './utils/gamelanSynth';
import { Sparkles, BookOpen, Settings as SettingsIcon, Image as ImageIcon } from 'lucide-react';

const STORAGE_STATE_KEY = 'wilwatikta_game_state_v1';
const STORAGE_SETTINGS_KEY = 'wilwatikta_game_settings_v1';

const defaultSettings: GameSettings = {
  bgmVolume: 0.45,
  sfxVolume: 0.60,
  ttsEnabled: true,
  ttsRate: 1.0,
  textSpeed: 'normal'
};

const defaultState: GameState = {
  currentChapterId: 'ch1',
  currentSceneId: 'ch1_scene_start',
  unlockedChapters: ['ch1'],
  karma: 15, // Starting values representing wisdom
  wira: 15,  // Starting values representing valour
  historyLog: [],
  unlockedEncyclopedia: ['raden_wijaya', 'hutan_tarik'] // Pre-unlocked foundational facts
};

export default function App() {
  // Current screen mode: 'lobby' | 'game'
  const [screen, setScreen] = useState<'lobby' | 'game'>('lobby');

  const [gameState, setGameState] = useState<GameState>(defaultState);
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);

  // Overlay management
  const [isEncyclopediaOpen, setIsEncyclopediaOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load state and settings from LocalStorage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_SETTINGS_KEY);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        gamelanSynth.setVolumes(parsed.bgmVolume, parsed.sfxVolume);
      } else {
        localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(defaultSettings));
        gamelanSynth.setVolumes(defaultSettings.bgmVolume, defaultSettings.sfxVolume);
      }

      const savedState = localStorage.getItem(STORAGE_STATE_KEY);
      if (savedState) {
        setGameState(JSON.parse(savedState));
      }
    } catch (e) {
      console.error("Local storage load failed", e);
    }

    // Modern browser gesture unlock for Web Audio API:
    const handleGesture = () => {
      gamelanSynth.startBGM();
    };
    window.addEventListener('click', handleGesture, { once: true });
    window.addEventListener('touchstart', handleGesture, { once: true });
    return () => {
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
    };
  }, []);

  // Update Game State with auto-save to LocalStorage
  const updateGameState = (updates: Partial<GameState>) => {
    setGameState((prev) => {
      const next = { ...prev, ...updates, saveDate: new Date().toISOString() };
      try {
        localStorage.setItem(STORAGE_STATE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error("Saving state to localstorage failed", e);
      }
      return next;
    });
  };

  // Update Settings with auto-save to LocalStorage
  const updateSettings = (updates: Partial<GameSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(next));
      } catch (e) {
        console.error("Saving settings to localstorage failed", e);
      }
      return next;
    });
  };

  // Check if player has an active save they can resume playing
  const hasSavedGame = gameState.currentSceneId !== 'ch1_scene_start' || gameState.historyLog.length > 0;

  // Custom dialogue popups for perfect sandboxed iframe compatibility:
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    type: 'alert' | 'confirm';
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    type: 'alert',
    title: '',
    message: ''
  });

  const showAlert = (title: string, message: string) => {
    setDialog({
      isOpen: true,
      type: 'alert',
      title,
      message
    });
  };

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setDialog({
      isOpen: true,
      type: 'confirm',
      title,
      message,
      onConfirm
    });
  };

  // New game sequence starts
  const handleStartNewGame = () => {
    if (hasSavedGame) {
      showConfirm(
        "Mulai Takdir Baru?",
        "Memulai perjalanan baru akan menghapus seluruh catatan takdir kerajaan Anda sebelumnya. Apakah Anda yakin?",
        () => {
          updateGameState(defaultState);
          setScreen('game');
          gamelanSynth.playGong();
        }
      );
    } else {
      updateGameState(defaultState);
      setScreen('game');
      gamelanSynth.playGong();
    }
  };

  // Resume standard playthrough game sequence
  const handleContinueGame = () => {
    setScreen('game');
  };

  // Hard Reset playthrough data
  const handleResetGame = () => {
    showConfirm(
      "Reset Riwayat Kerajaan?",
      "Apakah Anda yakin ingin mengulang seluruh takdir Raden Wijaya dari fajar pertama? Semua simpanan akan hilang.",
      () => {
        localStorage.removeItem(STORAGE_STATE_KEY);
        setGameState(defaultState);
        setIsSettingsOpen(false);
        gamelanSynth.playGong();
        showAlert(
          "Data Berhasil Dihapus",
          "Semua catatan takdir berharga Raden Wijaya berhasil dihilangkan dari dalam memori browser offline Anda."
        );
      }
    );
  };

  return (
    <div className="relative w-full h-[100vh] bg-charcoal text-sand flex flex-col font-serif select-none antialiased">
      
      {/* 1. LOBBY VIEW MOUNTING */}
      {screen === 'lobby' ? (
        <Lobby
          hasSavedGame={hasSavedGame}
          settings={settings}
          onStartNewGame={handleStartNewGame}
          onContinueGame={handleContinueGame}
          onOpenEncyclopedia={() => setIsEncyclopediaOpen(true)}
          onOpenGallery={() => setIsGalleryOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      ) : (
        /* 2. STORY DIALOG SCREEN MOUNTING */
        <StoryEngine
          currentChapterId={gameState.currentChapterId}
          currentSceneId={gameState.currentSceneId}
          settings={settings}
          karma={gameState.karma}
          wira={gameState.wira}
          historyLog={gameState.historyLog}
          unlockedChapters={gameState.unlockedChapters}
          onUpdateState={updateGameState}
          onExitToMenu={() => setScreen('lobby')}
        />
      )}

      {/* --- C. SEPARATE COMPONENT MODALS OVERLAYS --- */}

      {/* Encyclopedia Overlay */}
      {isEncyclopediaOpen && (
        <CompanionBook
          unlockedList={gameState.unlockedEncyclopedia}
          onClose={() => setIsEncyclopediaOpen(false)}
        />
      )}

      {/* Story Gallery & logs Overlay */}
      {isGalleryOpen && (
        <Gallery
          karmaPoints={gameState.karma}
          wiraPoints={gameState.wira}
          historyLog={gameState.historyLog}
          unlockedList={gameState.unlockedChapters}
          onClose={() => setIsGalleryOpen(false)}
        />
      )}

      {/* Game Settings Overlay */}
      {isSettingsOpen && (
        <Settings
          settings={settings}
          onUpdateSettings={updateSettings}
          onResetGame={handleResetGame}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* Custom Dialog Modal */}
      {dialog.isOpen && (
        <div id="custom-dialog-overlay" className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xs">
          <div 
            id="custom-dialog-panel"
            className="w-full max-w-sm rounded-xl bg-charcoal border border-white/15 p-6 text-center text-sand space-y-4"
            style={{ boxShadow: '0 0 30px rgba(242, 125, 38, 0.15)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-terracotta via-ochre to-terracotta" />
            <h3 id="dialog-title" className="font-serif text-lg text-ochre font-bold uppercase">{dialog.title}</h3>
            <p id="dialog-message" className="text-xs text-sand/65 leading-relaxed font-sans">{dialog.message}</p>
            <div className="pt-2 flex gap-3">
              {dialog.type === 'confirm' ? (
                <>
                  <button
                    id="dialog-cancel-btn"
                    onClick={() => {
                      gamelanSynth.playClick();
                      setDialog(d => ({ ...d, isOpen: false }));
                    }}
                    className="flex-1 py-2 rounded bg-white/5 border border-white/10 text-sand/80 hover:bg-white/10 transition-colors text-xs cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    id="dialog-confirm-btn"
                    onClick={() => {
                      gamelanSynth.playClick();
                      setDialog(d => ({ ...d, isOpen: false }));
                      if (dialog.onConfirm) dialog.onConfirm();
                    }}
                    className="flex-1 py-2 rounded bg-terracotta hover:brightness-110 text-white font-serif font-bold tracking-wider transition-colors text-xs cursor-pointer"
                  >
                    Yakin
                  </button>
                </>
              ) : (
                <button
                  id="dialog-ok-btn"
                  onClick={() => {
                    gamelanSynth.playClick();
                    setDialog(d => ({ ...d, isOpen: false }));
                  }}
                  className="w-full py-2 rounded bg-terracotta hover:brightness-110 text-white font-serif font-bold tracking-wider transition-colors text-xs cursor-pointer"
                >
                  Paham
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
