import React from 'react';
import { GameSettings } from '../types';
import { gamelanSynth } from '../utils/gamelanSynth';
import { Volume1, Volume2, VolumeX, Check, RotateCcw, HelpCircle, ToggleLeft, ToggleRight } from 'lucide-react';

interface SettingsProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onResetGame: () => void;
  onClose: () => void;
}

export default function Settings({ settings, onUpdateSettings, onResetGame, onClose }: SettingsProps) {
  const handleBgmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onUpdateSettings({ bgmVolume: val });
    gamelanSynth.setVolumes(val, settings.sfxVolume);
    gamelanSynth.playClick();
  };

  const handleSfxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onUpdateSettings({ sfxVolume: val });
    gamelanSynth.setVolumes(settings.bgmVolume, val);
    gamelanSynth.playSaron(5); // Play sfx cue
  };

  const handleTtsToggle = () => {
    const newVal = !settings.ttsEnabled;
    onUpdateSettings({ ttsEnabled: newVal });
    gamelanSynth.playClick();
    if (newVal) {
      // Announce
      if ('speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
        } catch (e) {
          console.warn(e);
        }
        const utter = new SpeechSynthesisUtterance("Suara narator diaktifkan.");
        
        const voices = window.speechSynthesis.getVoices();
        const indonesianVoice = voices.find(v => 
          v.lang.toLowerCase() === 'id-id' || 
          v.lang.toLowerCase().startsWith('id') || 
          v.name.toLowerCase().includes('indonesia')
        );
        
        if (indonesianVoice) {
          utter.voice = indonesianVoice;
          utter.lang = indonesianVoice.lang;
        } else {
          utter.lang = "id-ID";
        }
        
        utter.rate = settings.ttsRate;
        
        // Prevent garbage collection cutoff bug:
        (window as any)._settingsTtsUtterance = utter;
        
        window.speechSynthesis.speak(utter);
        
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      }
    }
  };

  const handleTtsRateChange = (rate: number) => {
    onUpdateSettings({ ttsRate: rate });
    gamelanSynth.playClick();
  };

  const handleTextSpeedChange = (speed: 'slow' | 'normal' | 'fast') => {
    onUpdateSettings({ textSpeed: speed });
    gamelanSynth.playClick();
  };

  return (
    <div id="settings-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div 
        id="settings-panel" 
        className="w-full max-w-xl mx-auto rounded-2xl bg-charcoal border border-white/15 p-6 sm:p-8 text-sand shadow-2xl relative overflow-hidden"
        style={{
          boxShadow: '0 0 30px rgba(242, 125, 38, 0.15)',
        }}
      >
        {/* Decorative Javanese Ornaments */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-terracotta via-ochre to-terracotta" />
        <div className="absolute -top-12 -left-12 w-24 h-24 rounded-full border border-terracotta/10 pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-24 h-24 rounded-full border border-terracotta/10 pointer-events-none" />

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-terracotta/10 border border-terracotta/30">
              <RotateCcw className="w-5 h-5 text-terracotta animate-none" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif text-ochre tracking-wide font-normal">PENGATURAN SUARA &amp; TEKS</h2>
              <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest text-[#C9A66B]">Babad Wilwatikta Nusantara</p>
            </div>
          </div>
          <button 
            id="close-settings-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-white/10 hover:border-terracotta flex items-center justify-center hover:bg-terracotta/10 transition-all text-sand/60 hover:text-sand cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Volume BGM */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2 font-serif text-sand/90"><Volume2 className="w-4 h-4 text-terracotta" /> Musik Ambiens Gamelan</span>
              <span className="text-terracotta font-mono text-xs">{Math.round(settings.bgmVolume * 100)}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05" 
              value={settings.bgmVolume} 
              onChange={handleBgmChange}
              className="w-full accent-terracotta bg-[#18110c] rounded-lg h-2 cursor-pointer" 
            />
          </div>

          {/* Volume SFX */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2 font-serif text-sand/90"><Volume1 className="w-4 h-4 text-terracotta" /> Efek Klik &amp; Saron (SFX)</span>
              <span className="text-terracotta font-mono text-xs">{Math.round(settings.sfxVolume * 100)}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05" 
              value={settings.sfxVolume} 
              onChange={handleSfxChange}
              className="w-full accent-terracotta bg-[#18110c] rounded-lg h-2 cursor-pointer" 
            />
          </div>

          {/* TTS Narrator */}
          <div className="p-4 rounded-xl bg-black/15 border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-serif font-bold text-ochre flex items-center gap-1.5">
                  Suara Narator Otomatis (TTS)
                </h3>
                <p className="text-xs text-sand/50 font-sans leading-relaxed mt-0.5">Membaca dialog menggunakan Web Speech Synthesis Indonesia</p>
              </div>
              <button 
                id="toggle-tts-btn"
                onClick={handleTtsToggle}
                className="text-terracotta hover:brightness-110 focus:outline-none cursor-pointer"
              >
                {settings.ttsEnabled ? (
                  <ToggleRight className="w-10 h-10 text-terracotta animate-none" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-white/30 animate-none animate-none" />
                )}
              </button>
            </div>

            {settings.ttsEnabled && (
              <div className="pt-2 border-t border-white/10 flex items-center gap-4 text-xs justify-between">
                <span className="text-sand/55 font-sans">Kecepatan Suara:</span>
                <div className="flex gap-2">
                  {[0.8, 1.0, 1.25].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handleTtsRateChange(rate)}
                      className={`px-2.5 py-1 rounded border transition-all font-mono text-[11px] cursor-pointer ${
                        settings.ttsRate === rate
                          ? 'bg-terracotta/20 text-[#F27D26] border-terracotta/40 font-bold'
                          : 'bg-[#1a100a] border-white/5 text-sand/50 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {rate === 1.0 ? 'Normal (1x)' : `${rate}x`}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Text Reading Speed */}
          <div className="space-y-2">
            <span className="text-xs sm:text-sm font-serif text-sand/95">Kecepatan Animasi Teks Cerita</span>
            <div className="grid grid-cols-3 gap-2">
              {(['slow', 'normal', 'fast'] as const).map((spd) => (
                <button
                  key={spd}
                  onClick={() => handleTextSpeedChange(spd)}
                  className={`py-2 px-3 rounded-lg border transition-all text-xs font-serif cursor-pointer ${
                    settings.textSpeed === spd
                      ? 'bg-terracotta/20 text-[#F27D26] border-terracotta/40 font-bold'
                      : 'bg-[#18110c] border-white/5 text-sand/55 hover:border-white/20 hover:text-sand'
                  }`}
                >
                  {spd === 'slow' && 'Lambat (Syahdu)'}
                  {spd === 'normal' && 'Sedang'}
                  {spd === 'fast' && 'Instan (Cepat)'}
                </button>
              ))}
            </div>
          </div>

          {/* Hard Reset */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xs sm:text-sm text-red-400 font-serif font-bold">Reset Riwayat Kerajaan</h3>
              <p className="text-xs text-sand/50 font-sans mt-0.5">Menghapus poin karsa, karma, dan ingatan peradaban yang tersimpan offline.</p>
            </div>
            <button
              id="reset-game-btn"
              onClick={onResetGame}
              className="py-2 px-4 rounded-lg bg-red-950/20 hover:bg-red-900/30 border border-red-500/20 hover:border-red-500/40 text-red-300 text-xs font-mono transition-all self-start sm:self-center cursor-pointer"
            >
              Hapus Semua Data
            </button>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-white/10 flex justify-end">
          <button
            id="close-settings-footer-btn"
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-terracotta to-ochre text-white font-serif font-bold text-xs tracking-wide shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer pb-2.5"
          >
            <Check className="w-4 h-4 text-white" /> Simpan Pengaturan
          </button>
        </div>
      </div>
    </div>
  );
}
