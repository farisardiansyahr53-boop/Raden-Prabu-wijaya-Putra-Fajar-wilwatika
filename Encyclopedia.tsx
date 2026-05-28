import React, { useState } from 'react';
import { encyclopediaEntries } from '../data/encyclopedia';
import { EncyclopediaEntry } from '../types';
import { gamelanSynth } from '../utils/gamelanSynth';
import { BookOpen, Users, Shield, Compass, MapPin, Feather, Quote, Info, Search } from 'lucide-react';

interface EncyclopediaProps {
  unlockedList: string[]; // State of unlocked entries
  onClose: () => void;
}

export default function CompanionBook({ unlockedList, onClose }: EncyclopediaProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<EncyclopediaEntry>(encyclopediaEntries[0]);

  const categories = ['Semua', 'Tokoh', 'Budaya', 'Geografi', 'Militer', 'Filosofi'];

  const filteredEntries = encyclopediaEntries.filter(entry => {
    const matchesCategory = selectedCategory === 'Semua' || entry.category === selectedCategory;
    const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          entry.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectEntry = (entry: EncyclopediaEntry) => {
    setSelectedEntry(entry);
    gamelanSynth.playSaron(Math.floor(Math.random() * 5) + 3); // High celestial bell sound on selection
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'Tokoh': return <Users className="w-4 h-4 text-emerald-400" />;
      case 'Militer': return <Shield className="w-4 h-4 text-red-400" />;
      case 'Geografi': return <MapPin className="w-4 h-4 text-amber-400" />;
      case 'Budaya': return <Compass className="w-4 h-4 text-cyan-400" />;
      case 'Filosofi': return <Feather className="w-4 h-4 text-indigo-400" />;
      default: return <BookOpen className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm">
      <div 
        id="encyclopedia-book"
        className="w-full max-w-5xl h-[90vh] rounded-2xl bg-charcoal border border-white/10 text-sand flex flex-col md:flex-row overflow-hidden shadow-2xl relative"
        style={{
          boxShadow: '0 0 40px rgba(242, 125, 38, 0.15)',
        }}
      >
        {/* Top Accent Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-terracotta via-ochre to-terracotta z-10" />

        {/* --- LEFT SIDEBAR: Search, Category Filters, Item List --- */}
        <div className="w-full md:w-[40%] border-r border-white/10 flex flex-col h-[50%] md:h-full bg-charcoal/40 relative">
          <div className="absolute inset-0 pointer-events-none opacity-20 grid-dots" />

          {/* Header & Logo */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-terracotta/10 rounded-lg border border-terracotta/30">
                <BookOpen className="w-5 h-5 text-terracotta" />
              </div>
              <div>
                <h2 className="font-serif text-[15px] sm:text-base tracking-wider text-ochre font-bold">ENSIKLOPEDIA TANAH JAWA</h2>
                <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest text-[#C9A66B]">Budaya &amp; Sejarah Nusantara</p>
              </div>
            </div>
            <button 
              onClick={() => { gamelanSynth.playClick(); onClose(); }}
              className="md:hidden w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-sand/65 hover:text-terracotta"
            >
              ✕
            </button>
          </div>

          {/* Search Box */}
          <div className="p-3 border-b border-white/10 z-10">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 opacity-40 text-sand" />
              <input
                type="text"
                placeholder="Telusuri pusaka, prasasti, tokoh..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-black/20 border border-white/10 hover:border-terracotta/30 focus:border-terracotta focus:outline-none rounded-lg text-xs font-mono text-sand placeholder-sand/35 transition-all"
              />
            </div>
          </div>

          {/* Horizontal list of categories */}
          <div className="p-2 border-b border-white/10 bg-black/10 flex gap-1 overflow-x-auto scrollbar-none scroll-smooth z-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { gamelanSynth.playClick(); setSelectedCategory(cat); }}
                className={`px-3 py-1 text-xs font-serif rounded-full border transition-all whitespace-nowrap active:scale-95 cursor-pointer ${
                  selectedCategory === cat 
                    ? 'bg-terracotta border-terracotta/20 text-white font-bold shadow-lg' 
                    : 'bg-black/30 border-white/5 text-sand/70 hover:border-white/20 hover:text-sand'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* List of Entries */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 z-10">
            {filteredEntries.length === 0 ? (
              <div className="text-center py-12 text-sand/40 text-xs font-mono">
                Tidak ada entri ensiklopedia ditemukan.
              </div>
            ) : (
              filteredEntries.map((entry) => {
                const isSelected = selectedEntry.id === entry.id;
                return (
                  <button
                    key={entry.id}
                    onClick={() => handleSelectEntry(entry)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 group relative overflow-hidden cursor-pointer ${
                      isSelected
                        ? 'bg-terracotta/10 border-terracotta/40 text-sand shadow-md'
                        : 'bg-black/20 border-white/5 hover:border-white/10 hover:bg-black/30 text-sand/70'
                    }`}
                  >
                    {/* Shadow Accent for Selected */}
                    {isSelected && (
                      <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-terracotta to-ochre" />
                    )}
                    
                    <div className={`p-2.5 rounded-lg border transition-all shrink-0 ${
                      isSelected ? 'bg-terracotta/10 border-terracotta/30 text-terracotta' : 'bg-black/40 border-white/5 text-sand/55'
                    }`}>
                      {getCategoryIcon(entry.category)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-[9px] uppercase tracking-wider font-sans text-terracotta font-bold">
                          {entry.category}
                        </span>
                      </div>
                      <h4 className={`text-sm font-serif truncate transition-colors ${
                        isSelected ? 'text-ochre font-bold' : 'text-sand group-hover:text-terracotta'
                      }`}>
                        {entry.title}
                      </h4>
                      <p className="text-[11px] font-sans opacity-55 line-clamp-1 mt-0.5">
                        {entry.description}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* --- RIGHT PANEL: Item Details (Book Reading View) --- */}
        <div id="encyclopedia-details" className="flex-1 h-[50%] md:h-full flex flex-col bg-charcoal relative">
          
          {/* Subtle Wayang Shadow Graphic inside the right panel page */}
          <div className="absolute right-4 bottom-4 w-40 h-40 opacity-5 pointer-events-none text-terracotta select-none flex items-center justify-center">
            <Feather className="w-32 h-32" />
          </div>

          <div className="hidden md:flex p-4 border-b border-white/10 justify-end items-center z-10">
            <button 
              id="close-companion-btn"
              onClick={() => { gamelanSynth.playClick(); onClose(); }}
              className="px-4 py-1.5 rounded-full border border-white/10 hover:border-terracotta text-xs font-serif hover:bg-terracotta/10 text-sand/80 hover:text-terracotta transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              Tutup Kitab ✕
            </button>
          </div>

          {selectedEntry ? (
            <div id="read-pane" className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 flex flex-col justify-between">
              
              <div className="space-y-4">
                {/* Category tag & Source */}
                <div className="flex items-center justify-between text-xs font-mono text-[#C9A66B] border-b border-white/10 pb-2">
                  <span className="px-2.5 py-0.5 rounded bg-terracotta/10 border border-terracotta/20 uppercase tracking-widest text-[9px] font-bold">
                    Kategori: {selectedEntry.category}
                  </span>
                  {selectedEntry.sumber && (
                    <span className="italic block-clamp text-[11px] opacity-75">
                      Sumber: {selectedEntry.sumber}
                    </span>
                  )}
                </div>

                {/* Title */}
                <div>
                  <h3 id="read-title" className="text-2xl md:text-3.5xl font-serif text-ochre tracking-wide font-normal">
                    {selectedEntry.title}
                  </h3>
                  <div className="w-16 h-[2px] bg-gradient-to-r from-terracotta to-transparent mt-2" />
                </div>

                {/* Detailed Description */}
                <p id="read-desc" className="text-sm md:text-base leading-relaxed text-sand/85 font-serif whitespace-pre-line text-justify pt-2 font-light">
                  {selectedEntry.description}
                </p>

                {/* Majestic Quote Plaque */}
                {selectedEntry.quote && (
                  <div id="quote-block" className="relative p-5 rounded-xl bg-gradient-to-br from-[#F27D26]/5 to-[#F27D26]/10 border-l-4 border-terracotta italic p-4 my-4">
                    <Quote className="absolute top-2 left-2 w-8 h-8 text-terracotta/5" />
                    <p className="text-sm md:text-base font-serif text-ochre relative z-10 pl-4 py-2">
                      {selectedEntry.quote}
                    </p>
                  </div>
                )}
              </div>

              {/* Javanese Wisdom Note Footer */}
              <div className="pt-6 border-t border-white/10 flex items-start gap-3 bg-black/10 p-3 rounded-lg text-xs text-sand/60 font-serif">
                <Info className="w-4 h-4 text-[#C9A66B] shrink-0 mt-0.5 animate-none" />
                <span>
                  Informasi ini diangkat dari catatan sejarah, prasasti, dan seni sastra tradisi Mataram Kuno - Majapahit untuk melestarikan khazanah luhur peradaban Nusantara.
                </span>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-sand/30 font-serif space-y-2">
              <BookOpen className="w-12 h-12 text-white/5 animate-none" />
              <span>Silakan pilih item sejarah di sebelah kiri untuk dibaca.</span>
            </div>
          )}

          {/* Physical Close Button at very bottom of screen for Mobile portability */}
          <div className="md:hidden border-t border-white/10 p-3 bg-black/40 z-10">
            <button
              onClick={() => { gamelanSynth.playClick(); onClose(); }}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-terracotta to-ochre text-white font-serif font-bold text-center tracking-wide text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Tutup Ensiklopedia
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
