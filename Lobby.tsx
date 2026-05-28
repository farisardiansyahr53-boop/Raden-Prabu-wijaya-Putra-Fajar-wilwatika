import React, { useState, useEffect } from 'react';
import { GameSettings, GameState } from '../types';
import { gamelanSynth } from '../utils/gamelanSynth';
import { Play, RotateCcw, BookOpen, Image as ImageIcon, Settings as SettingsIcon, HelpCircle, Volume2, Sparkles, Feather } from 'lucide-react';
import lobbyImg from '../assets/images/fajar_wilwatikta_lobby_1779879384704.png';

interface LobbyProps {
  hasSavedGame: boolean;
  settings: GameSettings;
  onStartNewGame: () => void;
  onContinueGame: () => void;
  onOpenEncyclopedia: () => void;
  onOpenGallery: () => void;
  onOpenSettings: () => void;
}

export default function Lobby({
  hasSavedGame,
  settings,
  onStartNewGame,
  onContinueGame,
  onOpenEncyclopedia,
  onOpenGallery,
  onOpenSettings
}: LobbyProps) {
  // Cinematic Flow state: 'prologue' | 'title_reveal' | 'menu'
  const [cinematicStep, setCinematicStep] = useState<'prologue' | 'reveal' | 'menu'>(hasSavedGame ? 'menu' : 'prologue');
  const [prologueText, setPrologueText] = useState<'welcome' | 'name' | 'subtitle' | 'none'>('none');
  const [showTentang, setShowTentang] = useState(false);

  // SVG Particle generator (golden floating embers)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    // Generate lovely golden glowing particles for background atmosphere
    const plist = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5,
      duration: Math.random() * 6 + 6
    }));
    setParticles(plist);
  }, []);

  // Trigger procedural Javanese background music looping
  useEffect(() => {
    // Start ambient BGM
    gamelanSynth.startBGM();
    return () => {
      // Keep BGM playing during gameplay, so do not stop unless desired
    };
  }, []);

  // Run the beautiful Opening Cinematic Sequencer
  useEffect(() => {
    if (cinematicStep !== 'prologue') return;

    let timer1: any, timer2: any, timer3: any, timer4: any;

    // TTS narration function
    const playTtsNarration = () => {
      if (!('speechSynthesis' in window)) return;
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        console.warn(e);
      }
      const text = "Di tanah Jawa yang masih terpecah... sebuah takdir besar mulai terukir dalam sejarah.";
      const utter = new SpeechSynthesisUtterance(text);
      
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
      
      utter.rate = 0.95;
      
      // Prevent grabage collection cutoff bug:
      (window as any)._lobbyUtterance = utter;
      
      window.speechSynthesis.speak(utter);
      
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    };

    // Step A: "SELAMAT DATANG" typing
    timer1 = setTimeout(() => {
      setPrologueText('welcome');
      gamelanSynth.playSaron(5); // Soft bell sound
      playTtsNarration();
    }, 1500);

    // Step B: "RADEN PRABU WIJAYA PUTRA" typing
    timer2 = setTimeout(() => {
      setPrologueText('name');
      gamelanSynth.playSaron(3);
    }, 3800);

    // Step C: "FAJAR WILWATIKTA" typing
    timer3 = setTimeout(() => {
      setPrologueText('subtitle');
      gamelanSynth.playGong(); // Majestic gong sound on ultimate title reveal!
    }, 5500);

    // Step D: Transition from cinematic title text directly into Main Menu
    timer4 = setTimeout(() => {
      setCinematicStep('menu');
    }, 9500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [cinematicStep]);

  const handleSkipCinematic = () => {
    // Stop TTS if skip is pressed
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setCinematicStep('menu');
    gamelanSynth.playClick();
    gamelanSynth.playGong();
  };

  const handleMenuClick = (callback: () => void) => {
    gamelanSynth.playClick();
    gamelanSynth.playSaron(4);
    callback();
  };

  return (
    <div id="main-lobby-container" className="relative w-full h-[100vh] immersive-background overflow-hidden flex flex-col justify-between select-none text-sand">
      
      {/* Immersive UI Background accents & grid dots */}
      <div className="absolute inset-0 pointer-events-none opacity-30 grid-dots z-0" />
      <div className="absolute bottom-0 left-0 w-full h-[300px] pointer-events-none bg-gradient-to-t from-terracotta/10 to-transparent z-0" />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-terracotta opacity-10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-0 right-0 p-12 pointer-events-none z-0">
        <div className="w-32 h-32 border border-ochre/30 rounded-full flex items-center justify-center">
          <div className="w-24 h-24 border border-ochre/20 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-1 h-1 bg-terracotta rounded-full"></div>
          </div>
        </div>
      </div>

      {/* 1. BACKGROUND CINEMATIC: Majestic Sunrise with glowing dust */}
      <div className="absolute inset-0 z-0">
        <img 
          src={lobbyImg}
          alt="Ancient Java Golden Fajar"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover brightness-[0.35] transition-all duration-1000"
        />
        {/* Soft Moving Fog Layer */}
        <div className="absolute inset-0 bg-charcoal/40 backdrop-blur-[0.5px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />

        {/* Animated Golden Embers (using terracotta color for Immersive UI) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="w-full h-full">
            {particles.map((p) => (
              <circle
                key={p.id}
                cx={`${p.x}%`}
                cy={`${p.y}%`}
                r={p.size}
                fill="#F27D26"
                className="animate-pulse"
                style={{
                  opacity: 0.2,
                  animation: `pulse ${p.duration * 0.4}s infinite ease-in-out`,
                  animationDelay: `${p.delay}s`,
                  filter: 'blur(1px)'
                }}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* --- A. OPENING CINEMATIC OVERLAY --- */}
      {cinematicStep === 'prologue' && (
        <div id="opening-cinematic-mask" className="absolute inset-0 z-30 bg-black/90 flex flex-col justify-center items-center p-4">
          
          <button 
            id="skip-cinematic-btn"
            onClick={handleSkipCinematic}
            className="absolute top-6 right-6 px-4 py-1.5 rounded-full border border-amber-500/30 text-amber-500/70 hover:text-amber-300 hover:border-amber-400 font-serif text-xs transition-all tracking-wider font-bold"
          >
            Lewati Cinematic ✕
          </button>

          <div className="text-center space-y-4 max-w-xl">
            {/* Typing Paragraph welcomes */}
            <div className="space-y-2">
              <p className={`text-xs uppercase tracking-[0.4em] font-mono transition-all duration-1000 ${
                prologueText === 'welcome' || prologueText === 'name' || prologueText === 'subtitle' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              } text-amber-500`}>
                Selamat Datang di Babad Nusantara
              </p>
              
              <h1 className={`text-3xl sm:text-4.5xl font-serif tracking-widest leading-snug transition-all duration-1200 ${
                prologueText === 'name' || prologueText === 'subtitle' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              } text-amber-100`}>
                RADEN WIJAYA PUTRA
              </h1>

              <div className={`w-28 h-0.5 bg-amber-500/50 mx-auto my-3 transition-transform duration-1000 ${
                prologueText === 'subtitle' ? 'scale-x-100' : 'scale-x-0'
              }`} />

              <h2 className={`text-xl sm:text-2xl font-serif tracking-[0.25em] text-yellow-500 transition-all duration-1500 ${
                prologueText === 'subtitle' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
              }`}>
                FAJAR WILWATIKTA
              </h2>
            </div>

            {/* Cinematic narration caption subbed */}
            <div className="pt-10">
              <p className="text-xs sm:text-sm font-serif italic text-amber-100/40 leading-relaxed max-w-md mx-auto animate-pulse">
                &quot;Di tanah Jawa yang masih terpecah... sebuah takdir besar mulai terukir dalam sejarah.&quot;
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- B. MAIN LOBBY NAVIGATION MENU --- */}
      <header className="z-10 p-6 flex justify-between items-center bg-gradient-to-b from-stone-950/50 to-transparent">
        <div className="flex items-center gap-2">
          <Feather className="w-5 h-5 text-amber-500" />
          <span className="font-mono text-[9px] sm:text-[10px] text-amber-400 font-bold uppercase tracking-[0.2em] decoration-double decoration-amber-500">
            Awal Mulanya Majapahit (1293 M)
          </span>
        </div>
        
        {/* Simple play indicator chime */}
        <div className="flex items-center gap-1.5 text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded text-[10px] font-mono">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping shrink-0" />
          <span>Gamelan BGM: Aktif</span>
        </div>
      </header>

      {/* Main Core branding */}
      <main className="z-10 w-full max-w-5xl mx-auto px-6 py-4 flex flex-col items-center justify-center flex-1 space-y-6 sm:space-y-10">
        
        <div className="text-center space-y-2 select-none">
          <div className="flex items-center justify-center gap-4 mb-2 opacity-75">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-terracotta"></div>
            <span className="text-[10px] tracking-[0.4em] uppercase font-sans font-bold text-terracotta">Wilwatikta Chronicles</span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-terracotta"></div>
          </div>
          <h1 id="lobby-title-h1" className="text-4xl sm:text-6xl font-light tracking-tighter leading-none mb-1 text-sand glow-title">
            RADEN PRABU <br/> <span className="font-black text-5xl sm:text-7xl">WIJAYA PUTRA</span>
          </h1>
          <p id="lobby-subtitle" className="text-lg sm:text-2xl font-serif italic tracking-[0.2em] opacity-80 text-ochre uppercase glow-text-gold">Fajar Wilwatikta</p>
          <p className="text-xs sm:text-sm text-terracotta/40 font-serif tracking-[0.35em] pl-1 pt-1">
            ꦥꦿꦧꦸꦮꦶꦗꦪꦥꦸꦠꦿꦥ꦳ꦗꦂꦮꦶꦭ꧀ꦮꦠꦶꦏ꧀ꦠ
          </p>
        </div>

        {/* --- NAVIGATION BUTTON PANELS (Immersive columns layout) --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 w-full gap-6 md:gap-8 mt-2 md:mt-4 z-10 max-w-5xl">
          
          {/* Left Column: Encyclopedia Preview card */}
          <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
            <div className="p-6 rounded-xl backdrop-blur-md border border-white/10 bg-white/5 shadow-xl select-none flex flex-col justify-between h-full md:min-h-[280px]">
              <div>
                <h3 className="text-[11px] uppercase tracking-widest text-terracotta mb-3 font-sans font-bold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-terracotta"></span>
                  Ensiklopedia Tanah Jawa
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-sand/80 font-serif mb-4">
                  &quot;Wilwatikta, atau Majapahit, lahir dari abu Kerajaan Singasari. Sebuah fajar baru yang akan menyatukan Nusantara di bawah panji Surya Majapahit.&quot;
                </p>
              </div>
              <div className="flex justify-between items-center mt-auto">
                <button 
                  onClick={() => handleMenuClick(onOpenEncyclopedia)}
                  className="text-[10px] uppercase tracking-widest text-ochre hover:text-terracotta font-sans font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  Buka Kitab ➔
                </button>
                <div className="w-12 h-[1px] bg-white/20"></div>
              </div>
            </div>
          </div>

          {/* Center Column: Core action buttons */}
          <div className="col-span-12 md:col-span-4 flex flex-col items-center justify-center gap-3">
            
            {/* CONTINUE */}
            {hasSavedGame && (
              <button
                id="btn-continue-journey"
                onClick={() => handleMenuClick(onContinueGame)}
                className="group w-full py-4 text-center border border-white/25 backdrop-blur-xl relative overflow-hidden transition-all duration-300 hover:border-terracotta bg-black/50 text-sand hover:text-terracotta font-serif font-bold text-sm tracking-[0.3em] uppercase cursor-pointer"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 bg-terracotta rounded-full animate-ping" />
                  Lanjutkan Takdir
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
            )}

            {/* MULAI PERJALANAN */}
            <button
              id="btn-start-adventure"
              onClick={() => {
                handleMenuClick(onStartNewGame);
              }}
              className="group w-full py-4 text-center border border-white/25 backdrop-blur-xl relative overflow-hidden transition-all duration-300 hover:border-terracotta bg-black/50 text-sand hover:text-terracotta font-serif font-bold text-sm tracking-[0.3em] uppercase cursor-pointer animate-none"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-ochre group-hover:text-terracotta transition-transform group-hover:rotate-12" />
                {hasSavedGame ? 'Mulai Ulang' : 'Mulai Perjalanan'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>

            {/* GALLERY */}
            <button
              id="btn-open-gallery"
              onClick={() => handleMenuClick(onOpenGallery)}
              className="w-full py-3 text-center border border-white/5 backdrop-blur-md text-xs tracking-[0.3em] font-medium uppercase text-sand/80 hover:text-sand hover:opacity-100 hover:bg-white/5 transition-all cursor-pointer"
            >
              Galeri Ceritera &amp; Logs
            </button>

            {/* SETTINGS */}
            <button
              id="btn-open-settings"
              onClick={() => handleMenuClick(onOpenSettings)}
              className="w-full py-3 text-center border border-white/5 backdrop-blur-md text-xs tracking-[0.3em] font-medium uppercase text-sand/80 hover:text-sand hover:opacity-100 hover:bg-white/5 transition-all cursor-pointer"
            >
              Pengaturan Suara
            </button>

            {/* ABOUT */}
            <button
              id="btn-open-about"
              onClick={() => { gamelanSynth.playClick(); setShowTentang(true); }}
              className="w-full py-3 text-center border border-white/5 backdrop-blur-md text-xs tracking-[0.3em] font-medium uppercase text-sand/80 hover:text-sand hover:opacity-100 hover:bg-white/5 transition-all cursor-pointer"
            >
              Tentang Babad
            </button>
          </div>

          {/* Right Column: Historical info quote block */}
          <div className="col-span-12 md:col-span-4 flex flex-col justify-between items-center md:items-end text-center md:text-right h-full">
            <div className="space-y-4 md:pt-4">
              <div className="text-[11px] uppercase tracking-widest text-[#C9A66B] font-sans font-bold">Arsip Narasi Nusantara</div>
              <div className="text-xs leading-loose text-sand/65 italic font-serif">
                &quot;Di tanah Jawa yang masih terpecah...<br/>
                sebuah takdir besar mulai terukir<br/>
                dalam lembaran sejarah emas.&quot;
              </div>
              <div className="mt-4 flex justify-center md:justify-end">
                <div 
                  onClick={() => { gamelanSynth.playClick(); setShowTentang(true); }}
                  className="w-14 h-14 border-2 border-white/10 rounded-sm flex items-center justify-center rotate-45 group hover:border-[#F27D26] transition-colors cursor-pointer"
                >
                  <div className="-rotate-45 text-[10px] tracking-tighter text-sand/45 group-hover:text-terracotta transition-colors uppercase font-mono">INFO</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Lobby Footer and credit */}
      <footer className="z-10 w-full max-w-5xl mx-auto px-8 pb-8 pt-4 bg-gradient-to-t from-charcoal to-transparent">
        <div className="w-full flex flex-col sm:flex-row justify-between items-center sm:items-end border-t border-white/10 pt-6 gap-4">
          <div className="flex gap-8 text-left">
            <div className="space-y-1">
              <div className="text-[9px] uppercase tracking-[0.2em] opacity-45 font-sans animate-none">Versi Sistem</div>
              <div className="text-[10px] tracking-widest font-mono text-ochre">v1.2.9-WILWATIKTA</div>
            </div>
            <div className="space-y-1">
              <div className="text-[9px] uppercase tracking-[0.2em] opacity-45 font-sans">Penyimpanan Lokal</div>
              <div className="text-[10px] tracking-widest font-mono text-emerald-400">CONNECTED.SYNC</div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
               <div className="text-[9px] uppercase tracking-widest opacity-45 mb-1 font-sans">Aksara Jawa Modern</div>
               <div className="text-sm tracking-[0.3em] text-ochre font-serif">ꦩꦗꦥꦲꦶꦠ꧀</div>
            </div>
            <div className="h-8 w-[1px] bg-white/20 hidden sm:block"></div>
            <div className="text-[10px] uppercase tracking-[0.3em] font-sans font-black text-terracotta">Indie AAA Cinematic</div>
          </div>
        </div>
      </footer>

      {/* --- C. TENTANG MODAL OVERLAY --- */}
      {showTentang && (
        <div id="about-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div 
            id="about-card"
            className="w-full max-w-lg rounded-2xl bg-charcoal border border-white/10 p-6 sm:p-8 text-sand shadow-2xl relative overflow-hidden"
            style={{ boxShadow: '0 0 35px rgba(242, 125, 38, 0.1)' }}
          >
            {/* Top gold line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-terracotta via-ochre to-terracotta" />

            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
              <h3 className="font-serif text-lg text-ochre tracking-wide uppercase font-bold">Babad Wilwatikta - Tentang Game</h3>
              <button 
                onClick={() => { gamelanSynth.playClick(); setShowTentang(false); }}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-sand hover:border-white/20 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-serif leading-relaxed text-sand/80 text-justify">
              <p>
                <strong>“RADEN PRABU WIJAYA PUTRA: FAJAR WILWATIKTA”</strong> adalah sebuah mahakarya game novel visual interaktif yang diangkat untuk mengenang perjuangan luhur <strong>Raden Wijaya (Sang Gramawijaya)</strong> dalam merintis berdirinya imperium terbesar Nusantara, <strong>Kerajaan Majapahit</strong>.
              </p>
              
              <p>
                Dari abu kehancuran Singasari, pembabatan rimba liar Hutan Tarik (Wilwatikta) hingga gempuran diplomasi legendaris mengusir bala armada agung Kekhanan Yuan Mongol (Tartar), game ini memandirikan kesetiaan ksatria dan kebijaksanaan kepemimpinan spiritual Jawa asli.
              </p>

              <div id="tech-credits" className="p-4 rounded-xl bg-black/20 border border-white/5 font-mono text-[10px] text-sand/70 space-y-1.5">
                <p className="text-ochre font-serif font-bold text-center border-b border-white/10 pb-1 text-xs mb-1.5 tracking-wider uppercase">Pilar Arsitektur Game (AAA Indie)</p>
                <p>• <strong>Visual Khas</strong>: AI Artistic Concept Art bertemakan siluet wayang &amp; fajar berkabut keemasan Jawa.</p>
                <p>• <strong>Mesin Suara</strong>: Web Audio API Procedural Synthesizer, memainkan alunan gamelan metalis Slendro sakral offline.</p>
                <p>• <strong>Aksesibilitas</strong>: Narasi otomatis menggunakan teknologi Web Speech Synthesis Synthesis API.</p>
                <p>• <strong>Portabilitas</strong>: Sepenuhnya offline-capable berbasis LocalStorage save system.</p>
              </div>

              <p className="text-[10px] text-center text-sand/40 italic mt-4 pt-1 border-t border-white/10">
                Penyusun Sejarah &amp; Kerangka Narasi Nusantara Raya • Versi 1.0.0
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => { gamelanSynth.playClick(); setShowTentang(false); }}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-terracotta to-ochre text-white font-serif font-bold text-xs tracking-wider transition-colors hover:brightness-110 active:scale-95 shadow cursor-pointer"
              >
                Kembali Ke Balairung
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
