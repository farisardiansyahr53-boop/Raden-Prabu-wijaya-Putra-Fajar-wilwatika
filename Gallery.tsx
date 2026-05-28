import React, { useState } from 'react';
import { gamelanSynth } from '../utils/gamelanSynth';
import { Image as ImageIcon, Sparkles, Award, Calendar, Eye, Compass, CalendarRange, Star, ArrowLeft } from 'lucide-react';
import lobbyImg from '../assets/images/fajar_wilwatikta_lobby_1779879384704.png';
import tarikImg from '../assets/images/hutan_tarik_twilight_1779879404558.png';
import victoryImg from '../assets/images/majapahit_fajar_victory_1779879424703.png';

interface GalleryProps {
  karmaPoints: number;
  wiraPoints: number;
  historyLog: string[];
  unlockedList: string[]; // unlocked chapters
  onClose: () => void;
}

export default function Gallery({ karmaPoints, wiraPoints, historyLog, unlockedList, onClose }: GalleryProps) {
  const [activeTab, setActiveTab] = useState<'visual' | 'logs'>('visual');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Background configurations mapping to our real generated assets
  const galleryImages = [
    {
      id: 'lobby',
      title: 'Fajar Wilwatikta (Lobby)',
      desc: 'Adegan fajar keemasan menyambut kelahiran takdir baru di tanah Jawa. Melambangkan harapan luhur yang sirna dari Singasari lalu terbit kembali di Majapahit.',
      src: lobbyImg,
      tag: 'Suasana'
    },
    {
      id: 'hutan_tarik',
      title: 'Babat Alas Tarik (Chapter 1-2)',
      desc: 'Hutan lebat wingit tepi Sungai Brantas yang menjadi lumbung pembibitan imperium Majapahit. Di tempat ini keteguhan mental para pengikut diuji oleh belantara purba.',
      src: tarikImg,
      tag: 'Perjuangan'
    },
    {
      id: 'coronation',
      title: 'Puncak Kejayaan Wilwatikta (Chapter 3)',
      desc: 'Latar penobatan Sang Kertarajasa Jayawardhana di hadapan panji dwiwarna Gula Kelapa. Kemenangan mutlak atas invasi asing Mongol dan faksi pengkhianat.',
      src: victoryImg,
      tag: 'Kedaulatan'
    }
  ];

  const handleShowImage = (src: string) => {
    setSelectedImage(src);
    gamelanSynth.playSaron(6); // Play high tone
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm animate-none">
      <div 
        id="gallery-frame"
        className="w-full max-w-4xl h-[85vh] rounded-2xl bg-charcoal border border-white/10 text-sand flex flex-col overflow-hidden relative shadow-2xl"
        style={{
          boxShadow: '0 0 45px rgba(242, 125, 38, 0.15)',
        }}
      >
        {/* Top Gold Border Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-terracotta via-ochre to-terracotta" />
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-terracotta/10 border border-terracotta/20">
              <ImageIcon className="w-5 h-5 text-terracotta" />
            </div>
            <div>
              <h2 className="text-xl font-serif text-ochre tracking-wide uppercase font-bold">GALERI CERITA &amp; LOG TAKDIR</h2>
              <p className="text-xs text-[#C9A66B] font-mono uppercase tracking-widest">Babad Perjalanan Raden Prabu Wijaya Putra</p>
            </div>
          </div>
          <button 
            onClick={() => { gamelanSynth.playClick(); onClose(); }}
            className="px-4 py-1.5 rounded-full border border-white/10 text-sand/75 hover:text-terracotta hover:border-terracotta/40 text-xs font-serif transition-colors self-end sm:self-center cursor-pointer bg-white/5"
          >
            Tutup Galeri ✕
          </button>
        </div>

        {/* Stats segment (Wira & Karma points) */}
        <div className="px-5 py-3.5 bg-black/20 border-b border-white/10 flex flex-wrap gap-4 items-center justify-around">
          
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/30">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] text-sand/40 font-mono tracking-wider uppercase">Poin Karma (Kebijaksanaan)</p>
              <h4 className="text-sm font-serif font-bold text-emerald-400">{karmaPoints} / 100</h4>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-red-500/10 ring-1 ring-red-500/30">
              <Award className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <p className="text-[10px] text-sand/40 font-mono tracking-wider uppercase">Poin Wira (Keberanian Ksatria)</p>
              <h4 className="text-sm font-serif font-bold text-red-400">{wiraPoints} / 100</h4>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-cyan-500/10 ring-1 ring-cyan-500/30">
              <Compass className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <p className="text-[10px] text-sand/40 font-mono tracking-wider uppercase">Persentase Takdir Terbuka</p>
              <h4 className="text-sm font-serif font-bold text-cyan-400">
                {Math.min(100, Math.round(((unlockedList.length || 1) / 3) * 100))}%
              </h4>
            </div>
          </div>
        </div>

        {/* Tabs picker */}
        <div className="flex border-b border-white/10 bg-black/10 text-xs">
          <button 
            onClick={() => { gamelanSynth.playClick(); setActiveTab('visual'); }}
            className={`flex-1 py-3 text-center font-serif text-sm transition-all border-b-2 cursor-pointer hover:bg-white/5 ${
              activeTab === 'visual' 
                ? 'border-terracotta text-terracotta bg-white/5 font-bold' 
                : 'border-transparent text-sand/60 hover:text-sand'
            }`}
          >
            Seni Ilustrasi Nusantara
          </button>
          <button 
            onClick={() => { gamelanSynth.playClick(); setActiveTab('logs'); }}
            className={`flex-1 py-3 text-center font-serif text-sm transition-all border-b-2 cursor-pointer hover:bg-white/5 ${
              activeTab === 'logs' 
                ? 'border-terracotta text-terracotta bg-white/5 font-bold' 
                : 'border-transparent text-sand/60 hover:text-sand'
            }`}
          >
            Lembaran Takdir Kerajaan (Pilihan Anda)
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-5 pb-8 min-h-0 bg-charcoal/40 relative">
          <div className="absolute inset-0 pointer-events-none opacity-10 grid-dots z-0" />
          
          <div className="relative z-10">
            {activeTab === 'visual' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {galleryImages.map((img) => (
                  <div 
                    key={img.id}
                    className="rounded-xl border border-white/5 bg-black/35 overflow-hidden hover:border-terracotta/30 hover:shadow-lg transition-all group flex flex-col"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-black/50">
                      <img
                        src={img.src}
                        alt={img.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 object-center"
                      />
                      <div className="absolute top-2 left-2 bg-[#0a0502]/85 border border-terracotta/20 px-2 py-0.5 rounded text-[10px] uppercase font-mono text-ochre">
                        {img.tag}
                      </div>
                      {/* Hover Eye Overlay */}
                      <button 
                        onClick={() => handleShowImage(img.src)}
                        className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-ochre text-xs font-serif cursor-pointer"
                      >
                        <Eye className="w-4 h-4 text-ochre" /> Lihat Seni ➔
                      </button>
                    </div>
                    
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <h3 className="text-sm font-serif text-ochre font-bold group-hover:text-terracotta transition-colors">
                        {img.title}
                      </h3>
                      <p className="text-xs text-sand/60 mt-1.5 leading-relaxed font-sans line-clamp-3">
                        {img.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'logs' && (
              <div className="max-w-2xl mx-auto space-y-4">
                <h3 className="font-serif text-base text-ochre flex items-center gap-2">
                  <Star className="w-4 h-4 text-terracotta" /> Keputusan Kerajaan Anda
                </h3>
                
                {historyLog.length === 0 ? (
                  <div className="p-8 rounded-xl bg-black/20 border border-white/10 text-center text-sand/30 text-xs font-mono py-12 leading-relaxed">
                    Kitab ramalan belum mencatat takdir pilihan Anda. Ketuk tombol &quot;Mulai Perjalanan&quot; di menu utama untuk menorehkan keputusan Anda seumur hidup.
                  </div>
                ) : (
                  <div className="relative border-l-2 border-terracotta/20 pl-4 sm:pl-6 ml-3 space-y-5">
                    {historyLog.map((log, index) => (
                      <div key={index} className="relative group">
                        {/* Tree node dot */}
                        <div className="absolute -left-[25px] sm:-left-[33px] top-1.5 w-3 h-3 rounded-full bg-terracotta border border-charcoal group-hover:scale-125 transition-transform" />
                        
                        <div className="p-4 rounded-xl bg-black/20 border border-white/5 hover:border-terracotta/25 transition-colors space-y-1.5">
                          <div className="flex justify-between items-center text-[9px] font-mono text-terracotta/55 uppercase font-bold tracking-widest">
                            <span>Keputusan Kunci #{index + 1}</span>
                            <span className="flex items-center gap-1">Tercatat</span>
                          </div>
                          <p className="text-xs sm:text-sm font-serif text-sand leading-relaxed">
                            {log}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* FULLSCREEN POPUP IMAGE VIEWER */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/95 z-[60] flex flex-col justify-center items-center p-4">
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 px-4 py-2 rounded-full border border-white/10 text-sand font-serif text-xs hover:bg-white/5 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Galeri
            </button>
            <div className="max-w-4xl max-h-[80vh] overflow-hidden rounded-xl border border-white/10 bg-black relative flex items-center justify-center">
              <img 
                src={selectedImage} 
                alt="Selected Fullscreen View" 
                referrerPolicy="no-referrer"
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
