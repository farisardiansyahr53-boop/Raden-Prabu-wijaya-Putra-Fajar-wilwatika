import React, { useState, useEffect, useRef } from 'react';
import { Chapter, Scene, Choice, FactCard, GameSettings } from '../types';
import { chapters } from '../data/chapters';
import { gamelanSynth } from '../utils/gamelanSynth';
import { BookOpen, Sparkles, Award, ArrowRight, Save, Volume2, VolumeX, Eye, BookOpenCheck, HelpCircle } from 'lucide-react';
import lobbyImg from '../assets/images/fajar_wilwatikta_lobby_1779879384704.png';
import tarikImg from '../assets/images/hutan_tarik_twilight_1779879404558.png';
import victoryImg from '../assets/images/majapahit_fajar_victory_1779879424703.png';

interface StoryEngineProps {
  currentChapterId: string;
  currentSceneId: string;
  settings: GameSettings;
  karma: number;
  wira: number;
  historyLog: string[];
  unlockedChapters: string[];
  onUpdateState: (updates: {
    currentChapterId?: string;
    currentSceneId?: string;
    karma?: number;
    wira?: number;
    historyLog?: string[];
    unlockedChapters?: string[];
  }) => void;
  onExitToMenu: () => void;
}

export default function StoryEngine({
  currentChapterId,
  currentSceneId,
  settings,
  karma,
  wira,
  historyLog,
  unlockedChapters,
  onUpdateState,
  onExitToMenu
}: StoryEngineProps) {
  const chapter = chapters[currentChapterId] || chapters['ch1'];
  const scene: Scene = chapter.scenes[currentSceneId] || chapter.scenes[chapter.startSceneId];

  // Text typewriter animation states
  const [displayedText, setDisplayedText] = useState('');
  const [isTypewriterRunning, setIsTypewriterRunning] = useState(false);
  const textIndexRef = useRef(0);
  const typewriterTimerRef = useRef<any>(null);

  // Popups & states
  const [activeFact, setActiveFact] = useState<FactCard | null>(null);
  const [showFactOverlay, setShowFactOverlay] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isSpeechPlaying, setIsSpeechPlaying] = useState(false);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Map background names to generated image paths
  const getBackgroundImagePath = (bgName?: string) => {
    switch (bgName) {
      case 'fajar_wilwatikta_lobby':
        return lobbyImg;
      case 'hutan_tarik_twilight':
        return tarikImg;
      case 'majapahit_fajar_victory':
        return victoryImg;
      default:
        return tarikImg;
    }
  };

  // Typewriter effect speed configuration
  const getTypewriterSpeed = () => {
    switch (settings.textSpeed) {
      case 'slow': return 40;
      case 'fast': return 5;
      default: return 18; // Normal
    }
  };

  // Speech Synth TTS integration
  const speakSceneText = (textToSpeak: string) => {
    if (!settings.ttsEnabled) return;
    if (!('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // Stop current speech
    } catch (e) {
      console.warn("speechSynthesis cancel failed", e);
    }
    
    // Clean text from bracket descriptions if any
    const cleanText = textToSpeak.replace(/\([^)]*\)/g, "");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    const voices = window.speechSynthesis.getVoices();
    const indonesianVoice = voices.find(v => 
      v.lang.toLowerCase() === 'id-id' || 
      v.lang.toLowerCase().startsWith('id') || 
      v.name.toLowerCase().includes('indonesia')
    );
    
    if (indonesianVoice) {
      utterance.voice = indonesianVoice;
      utterance.lang = indonesianVoice.lang;
    } else {
      utterance.lang = "id-ID";
    }

    utterance.rate = settings.ttsRate || 1.0;
    
    utterance.onstart = () => {
      setIsSpeechPlaying(true);
    };
    utterance.onerror = (e) => {
      console.warn("TTS Playback Error or Interrupted:", e);
      if (activeUtteranceRef.current === utterance) {
        setIsSpeechPlaying(false);
      }
    };
    utterance.onend = () => {
      if (activeUtteranceRef.current === utterance) {
        setIsSpeechPlaying(false);
      }
    };
    
    // Keep reference in a ref to prevent garbage collection!
    activeUtteranceRef.current = utterance;
    
    setIsSpeechPlaying(true);
    window.speechSynthesis.speak(utterance);
    
    // Workaround for Chrome/WebKit where speech gets stuck in queued state:
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  };

  // Launch text animation when scene changes
  useEffect(() => {
    if (!scene) return;

    // Reset typewriter text
    setDisplayedText('');
    setIsTypewriterRunning(true);
    textIndexRef.current = 0;

    // Speak text automatically if TTS enabled
    speakSceneText(scene.text);

    // Audio cue trigger
    triggerAudioCue(scene.audioPrompt);

    // Setup Typewriter Interval
    if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
    
    const speed = getTypewriterSpeed();
    const fullText = scene.text;

    typewriterTimerRef.current = setInterval(() => {
      if (textIndexRef.current < fullText.length) {
        textIndexRef.current += 1;
        setDisplayedText(fullText.substring(0, textIndexRef.current));
      } else {
        clearInterval(typewriterTimerRef.current);
        setIsTypewriterRunning(false);
      }
    }, speed);

    // If there is an historical fact tied to this scene, prime it so the user can open it
    if (scene.faktaSejarah) {
      setActiveFact(scene.faktaSejarah);
      setShowFactOverlay(true);
    } else {
      setShowFactOverlay(false);
    }

    return () => {
      if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
    };
  }, [currentSceneId, currentChapterId]);

  // Audio Cue system
  const triggerAudioCue = (prompt?: string) => {
    switch (prompt) {
      case 'gong':
        gamelanSynth.playGong();
        break;
      case 'tension':
        gamelanSynth.playSaron(1, 0);
        gamelanSynth.playSaron(2, 0.2);
        break;
      case 'gamelan_ambient':
        gamelanSynth.playSaron(4, 0);
        gamelanSynth.playSaron(5, 0.3);
        break;
      case 'drum':
        gamelanSynth.playKendhang();
        break;
      case 'victory':
        gamelanSynth.playGong();
        gamelanSynth.playSaron(4, 0.1);
        gamelanSynth.playSaron(6, 0.25);
        gamelanSynth.playSaron(8, 0.4);
        break;
      case 'forest':
        gamelanSynth.toggleForestAmbient(true);
        break;
      default:
        break;
    }
  };

  // Instant show of typed text
  const handleSkipTypewriter = () => {
    if (isTypewriterRunning) {
      if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
      setDisplayedText(scene.text);
      setIsTypewriterRunning(false);
      gamelanSynth.playClick();
    }
  };

  // Next scene click handler (for scenes with no custom branching options)
  const handleProgressScene = () => {
    if (isTypewriterRunning) {
      handleSkipTypewriter();
      return;
    }

    if (scene.choices && scene.choices.length > 0) {
      // Cannot skip if choices are being displayed
      return;
    }

    gamelanSynth.playClick();

    if (scene.nextSceneId) {
      // Direct jump inside chapter scene list
      if (scene.nextSceneId === 'story_completed') {
        // Special case: end of Chapter 3 (and overall game)
        // Transition handled below
        return;
      }

      // Check if transitioning to the next chapter intro scene
      const nextSceneId = scene.nextSceneId;
      if (nextSceneId === 'ch2_chapter_intro') {
        // Unlock Chapter 2
        const updatedChapters = unlockedChapters.includes('ch2') 
          ? unlockedChapters 
          : [...unlockedChapters, 'ch2'];
        onUpdateState({
          currentChapterId: 'ch2',
          currentSceneId: 'ch2_chapter_intro',
          unlockedChapters: updatedChapters
        });
      } else if (nextSceneId === 'ch3_start_scene') {
        // Unlock Chapter 3
        const updatedChapters = unlockedChapters.includes('ch3') 
          ? unlockedChapters 
          : [...unlockedChapters, 'ch3'];
        onUpdateState({
          currentChapterId: 'ch3',
          currentSceneId: 'ch3_start_scene',
          unlockedChapters: updatedChapters
        });
      } else {
        // Normal scenes
        onUpdateState({
          currentSceneId: nextSceneId
        });
      }
    }
  };

  // Handles a branching decision selection
  const handleSelectChoice = (option: Choice) => {
    gamelanSynth.playKendhang();
    // Play custom bell sounds to represent cosmic alignments
    if (option.gamelanTone) {
      if (option.gamelanTone === 'gong') gamelanSynth.playGong();
      else if (option.gamelanTone === 'slendro') gamelanSynth.playSaron(5);
      else if (option.gamelanTone === 'miring') gamelanSynth.playSaron(3);
      else if (option.gamelanTone === 'kempyang') gamelanSynth.playSaron(7);
    }

    // Apply karmic parameters
    const newKarma = Math.max(0, karma + (option.karmaImpact || 0));
    const newWira = Math.max(0, wira + (option.wiraImpact || 0));
    
    // Add decision to chronic log
    let newHistory = [...historyLog];
    if (option.log) {
      newHistory.push(option.log);
    }

    onUpdateState({
      currentSceneId: option.nextSceneId,
      karma: newKarma,
      wira: newWira,
      historyLog: newHistory
    });
  };

  // Close Fact Card Overlay and trigger a bronze chime sound
  const handleCloseFact = () => {
    setShowFactOverlay(false);
    gamelanSynth.playSaron(8); // Chyme integration click
  };

  // Re-read or replay narration TTS
  const handleReplayTts = () => {
    speakSceneText(scene.text);
  };

  // Determine user alignment personality at the end of Chapter 3
  const evaluateRulerPersonality = () => {
    if (karma > wira + 10) {
      return {
        title: "PRABU WICAKSANA (Raja Suci Sri Kertarajasa)",
        nature: "Kebijaksanaan Rohani (Wisdom-driven)",
        desc: "Langkah kepemimpinan Anda terpaku luhur pada hukum kesejahteraan kawula dan keselarasan kosmik Jawa (Memayu Hayuning Bawana). Sejarah mengenang Anda sebagai ksatria dewa yang mendirikan kemakmuran tani tanpa rintangan amarah perang."
      };
    } else if (wira > karma + 10) {
      return {
        title: "SANG WIRA JAYAWARDHANA (Raja Perkasa Panglima Maritim)",
        nature: "Keberanian Senjata & Keperkasaan Militer",
        desc: "Anda mengutamakan kekuatan panji militer, kesiapan senjata keris pamor, dan penguasaan armada maritim nusa sejati. Majapahit di tangan Anda disegani oleh seluruh dinasti benua merah dan bersiap menjangkau seluruh perairan dunia."
      };
    } else {
      return {
        title: "MAHARAJA SANG PRABU WIJAYA (Raja Agung Fajar Wilwatikta)",
        nature: "Keseimbangan Sastra & Gending",
        desc: "Keseimbangan sempurna dari ketajaman siasat diplomatik (Sastra) dan heroisme perang (Gending). Anda menetapkan kepemimpinan legendaris yang merengkuh segenap pilar perdamaian dan kemakmuran seimbang."
      };
    }
  };

  const personality = evaluateRulerPersonality();

  return (
    <div 
      id="gameplay-area" 
      className="absolute inset-0 bg-charcoal flex flex-col justify-end overflow-hidden select-none"
    >
      {/* Background illustration with zoom transition */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <img 
          src={getBackgroundImagePath(scene?.backgroundUrl)} 
          alt="Cinematic Background" 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-all duration-1000 scale-[1.01] brightness-[0.55]"
        />
        {/* Cinematic dark mask vignette & dot grids */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
        <div className="absolute inset-0 pointer-events-none opacity-20 grid-dots" />
      </div>

      {/* --- UPPER HUD: CHAPTER INFO, STATS, SAVE AND MENU --- */}
      <div className="absolute top-0 inset-x-0 z-20 p-4 bg-gradient-to-b from-charcoal/90 to-transparent flex items-center justify-between text-sand text-xs font-mono">
        {/* Chapter Title Badge */}
        <div className="flex flex-col">
          <span className="text-[10px] text-terracotta font-bold uppercase tracking-widest">{chapter.title}</span>
          <span className="text-xs font-serif text-ochre/90 truncate max-w-[200px] sm:max-w-md">{chapter.subtitle}</span>
        </div>

        {/* HUD Controls */}
        <div className="flex items-center gap-3">
          {/* Quick Stats Screen (Visible on Desktop) */}
          <div className="hidden sm:flex items-center gap-4 bg-charcoal/80 border border-white/10 px-3.5 py-1.5 rounded-full text-[11px]">
            <span className="flex items-center gap-1 text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" /> Karma: {karma}
            </span>
            <span className="flex items-center gap-1 text-red-400">
              <Award className="w-3.5 h-3.5" /> Wira: {wira}
            </span>
          </div>

          {/* TTS Audio toggle reader button */}
          {settings.ttsEnabled && (
            <button
              onClick={handleReplayTts}
              className={`p-2 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                isSpeechPlaying
                  ? 'bg-terracotta/20 border-terracotta text-terracotta'
                  : 'bg-charcoal/80 border-white/10 text-sand/65 hover:text-terracotta'
              }`}
              title="Putar Kembali Suara Narasi"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          )}

          {/* Fact card recap if available on this node */}
          {scene.faktaSejarah && (
            <button 
              id="fact-card-trigger"
              onClick={() => { gamelanSynth.playClick(); setShowFactOverlay(true); }}
              className="py-1.5 px-3 bg-terracotta/10 border border-terracotta/40 hover:border-terracotta rounded text-terracotta text-xs font-serif transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" /> Sejarah Jawa
            </button>
          )}

          {/* Close Game to Menu Button */}
          <button
            onClick={() => { gamelanSynth.playClick(); setShowExitConfirm(true); }}
            className="px-3 py-1.5 rounded bg-charcoal/90 border border-white/10 text-sand/65 hover:text-terracotta hover:border-terracotta/40 transition-all font-serif cursor-pointer"
          >
            Menu Utama
          </button>
        </div>
      </div>

      {/* --- MAIN GAMEPLAY INTERFACE: COMIC BOX & CONTROLS --- */}
      <div 
        onClick={handleProgressScene}
        className={`w-full max-w-4xl mx-auto p-4 sm:p-6 mb-4 relative z-10 select-none ${
          scene.choices && scene.choices.length > 0 ? 'cursor-default' : 'cursor-pointer'
        }`}
      >
        <div 
          id="dialog-bubble" 
          className="w-full rounded-2xl bg-charcoal/90 backdrop-blur-md border border-white/15 p-5 sm:p-6 text-sand shadow-2xl relative overflow-hidden transition-all duration-300"
          style={{
            boxShadow: '0 0 25px rgba(242, 125, 38, 0.08)',
          }}
        >
          {/* Subtle Accent borders at left edge */}
          <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-terracotta via-ochre to-terracotta" />
          
          {/* Character Speaker Crest */}
          {scene.character && (
            <div className="flex items-center justify-between mb-3">
              <span 
                id="speaker-tag" 
                className={`text-xs px-3.5 py-1.5 rounded-lg border font-serif tracking-widest uppercase font-bold ${
                  scene.character === 'Narator' 
                    ? 'bg-charcoal/90 text-ochre/80 border-white/10' 
                    : 'bg-terracotta/15 border-terracotta/30 text-terracotta shadow-md'
                }`}
              >
                {scene.character === 'Narator' ? '📜 Kisah Nawaksara' : `⚔️ ${scene.character}`}
              </span>

              {/* Dynamic blinking cursor indicating typing complete */}
              {!isTypewriterRunning && (!scene.choices || scene.choices.length === 0) && (
                <span className="text-[10px] text-terracotta/50 font-mono animate-pulse flex items-center gap-1 shrink-0 bg-black/40 px-2 py-0.5 rounded font-bold">
                  Ketuk Layar Untuk Lanjut <ArrowRight className="w-3 h-3 text-terracotta" />
                </span>
              )}
            </div>
          )}

          {/* Prose body output with custom formatting for character speak */}
          <div className="min-h-[85px] sm:min-h-[100px] flex items-center">
            <p 
              id="story-typed-text" 
              className={`text-sm sm:text-base leading-relaxed font-serif ${
                scene.character === 'Narator' ? 'italic text-sand/90 font-light' : 'text-sand font-medium'
              }`}
            >
              {displayedText}
              {isTypewriterRunning && <span className="inline-block w-1.5 h-4 bg-terracotta ml-1 animate-pulse" />}
            </p>
          </div>

          {/* --- BRANCHING CHOICES --- */}
          {!isTypewriterRunning && scene.choices && scene.choices.length > 0 && (
            <div id="choices-container" className="mt-5 pt-4 border-t border-white/10 space-y-2.5">
              <p className="text-[11px] font-mono text-ochre/55 uppercase tracking-widest mb-2 font-bold">Tentukan Keputusan Takdir Raden Wijaya:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {scene.choices.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={(e) => {
                      e.stopPropagation(); // Avoid triggering screen click!
                      handleSelectChoice(opt);
                    }}
                    className="w-full text-left p-4 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 hover:bg-black/40 hover:border-terracotta text-sand transition-all text-xs sm:text-sm font-serif leading-relaxed flex items-start gap-3 shadow-md hover:scale-[1.01] hover:shadow-terracotta/5 active:scale-95 duration-200 group relative overflow-hidden cursor-pointer"
                  >
                    <div className="absolute top-0 bottom-0 left-0 w-1 bg-transparent group-hover:bg-terracotta" />
                    
                    <div className="p-1.5 rounded-lg bg-charcoal border border-white/15 text-ochre/80 group-hover:text-terracotta font-bold font-mono shrink-0">
                      ?
                    </div>
                    <span className="flex-1 text-justify pr-2">
                      {opt.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- FAKTA SEJARAH TANAH JAWA PARCHMENT POPUP --- */}
      {showFactOverlay && activeFact && (
        <div id="fact-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div 
            id="fact-parchment"
            className="w-full max-w-lg rounded-2xl bg-charcoal border border-terracotta/30 p-6 sm:p-8 text-sand shadow-2xl relative overflow-hidden"
            style={{
              boxShadow: '0 0 45px rgba(242, 125, 38, 0.15)',
            }}
          >
            {/* Top gold bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-terracotta via-ochre to-terracotta" />
 
            <div className="flex items-center gap-3 mb-5 border-b border-white/10 pb-3">
              <div className="p-2 rounded-xl bg-terracotta/10 border border-terracotta/30 text-terracotta">
                <BookOpenCheck className="w-6 h-6 text-terracotta" />
              </div>
              <div>
                <span className="text-[10px] text-terracotta font-mono tracking-widest uppercase font-bold">📜 {activeFact.topic}</span>
                <h3 className="text-lg font-serif text-ochre font-bold uppercase">{activeFact.title}</h3>
              </div>
            </div>
 
            <div className="space-y-4">
              <p className="text-xs sm:text-sm font-sans leading-relaxed text-sand/80 text-justify">
                {activeFact.content}
              </p>
 
              {activeFact.philosophy && (
                <div className="p-4 rounded-xl bg-[#F27D26]/5 border-l-4 border-terracotta text-sand/90 italic font-serif text-[11px] sm:text-xs">
                  {activeFact.philosophy}
                </div>
              )}
            </div>
 
            <div className="mt-8 pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={handleCloseFact}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-terracotta to-ochre text-white font-serif font-bold text-xs tracking-wide shadow-md hover:brightness-110 active:scale-95 transition-all outline-none cursor-pointer"
              >
                Pahami Sejarah Jawa &amp; Lanjutkan ➔
              </button>
            </div>
          </div>
        </div>
      )}
 
      {/* --- ULTIMATE CORONATION CELEBRATION OVERLAY --- */}
      {currentSceneId === 'story_completed' && (
        <div id="coronation-victory-screen" className="fixed inset-0 z-50 bg-charcoal flex flex-col justify-center items-center p-4 overflow-y-auto">
          {/* Glowing particle rings behind */}
          <div className="absolute w-[600px] h-[600px] bg-terracotta/5 rounded-full filter blur-[120px] pointer-events-none" />
 
          {/* Red-White Pataka Graphic overlay */}
          <div className="absolute top-8 flex gap-2 select-none opacity-25">
            <div className="w-1.5 h-20 bg-terracotta rounded" />
            <div className="w-1.5 h-24 bg-white/20 rounded" />
            <div className="w-1.5 h-28 bg-terracotta rounded" />
            <div className="w-1.5 h-24 bg-white/20 rounded" />
            <div className="w-1.5 h-20 bg-terracotta rounded" />
          </div>
 
          <div className="w-full max-w-xl text-center space-y-6 relative z-10 py-8">
            <div className="inline-block p-4 rounded-full bg-terracotta/10 border-2 border-terracotta mb-2 shadow-lg scale-110">
              <Sparkles className="w-10 h-10 text-terracotta animate-pulse" />
            </div>
 
            <div>
              <p className="text-xs text-terracotta font-mono tracking-[0.25em] uppercase font-bold">PEMIMPIN NUSANTARA TELAH DINOBATKAN</p>
              <h2 className="text-3xl sm:text-4.5xl font-serif text-ochre font-normal tracking-wide mt-2">FAJAR WILWATIKTA</h2>
              <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-terracotta to-transparent mx-auto mt-4" />
            </div>
 
            {/* Evaluation plaque */}
            <div className="p-6 sm:p-8 rounded-2xl bg-black/60 border border-white/10 text-sand space-y-4 shadow-2xl">
              <div>
                <span className="text-[10px] text-terracotta/60 font-mono tracking-widest uppercase block mb-1">Gelar Kepemimpinan Takdir Anda</span>
                <h3 className="text-base sm:text-lg font-serif font-bold text-ochre uppercase underline decoration-terracotta/40 decoration-wavy">
                  {personality.title}
                </h3>
              </div>
 
              <div className="w-12 h-1 bg-terracotta/30 mx-auto" />
 
              <p className="text-xs sm:text-sm font-serif text-justify leading-relaxed text-sand/85 font-light">
                {personality.desc}
              </p>
 
              {/* Score breakdown metrics */}
              <div className="pt-4 border-t border-white/10 flex justify-around text-xs font-mono">
                <div>
                  <span className="block text-terracotta/40 uppercase tracking-widest text-[9px]">Nilai Karsa (Karma)</span>
                  <span className="text-emerald-400 text-sm font-bold">{karma} Poin</span>
                </div>
                <div className="border-r border-white/10 w-px self-stretch" />
                <div>
                  <span className="block text-terracotta/40 uppercase tracking-widest text-[9px]">Nilai Satria (Wira)</span>
                  <span className="text-red-400 text-sm font-bold">{wira} Poin</span>
                </div>
              </div>
            </div>
 
            <p className="text-xs text-sand/40 max-w-md mx-auto italic font-serif">
              &quot;Sembah sungkem para abdi sekalian... Kerajaan Majapahit berkibar lestari menyinari seantero bahari.&quot;
            </p>
 
            <button
              onClick={() => {
                gamelanSynth.playGong();
                onExitToMenu();
              }}
              className="py-3 px-8 rounded-xl bg-gradient-to-r from-terracotta to-ochre text-white font-serif font-bold tracking-wide shadow-lg hover:brightness-110 hover:shadow-terracotta/20 transition-all scale-105 cursor-pointer pb-3"
            >
              Kembali ke Balairung Menu Utama ➔
            </button>
          </div>
        </div>
      )}
 
      {/* --- CONFIRMATION MODAL TO EXIT --- */}
      {showExitConfirm && (
        <div id="exit-confirm" className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90">
          <div className="w-full max-w-sm rounded-xl bg-charcoal border border-white/15 p-6 text-center text-sand relative space-y-4">
            <h3 className="font-serif text-lg text-ochre">Kembali ke Balairung?</h3>
            <p className="text-xs text-sand/60 leading-relaxed font-sans">
              Takdir Raden Wijaya akan otomatis tersimpan secara aman di dalam ingatan lokal browser Anda. Anda dapat melanjutkan babad ini kapan saja.
            </p>
            <div className="pt-3 flex gap-3">
              <button
                onClick={() => {
                  gamelanSynth.playClick();
                  setShowExitConfirm(false);
                }}
                className="flex-1 py-2 rounded bg-white/5 border border-white/10 text-sand/80 hover:bg-white/10 transition-colors text-xs cursor-pointer"
              >
                Tetap Bermain
              </button>
              <button
                onClick={() => {
                  gamelanSynth.playClick();
                  // Stop speech synthesis if playing
                  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                  onExitToMenu();
                }}
                className="flex-1 py-2 rounded bg-terracotta hover:bg-terracotta/80 text-white font-medium transition-colors text-xs cursor-pointer"
              >
                Simpan &amp; Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
