/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FactCard {
  title: string;
  topic: string;
  content: string;
  philosophy: string;
}

export interface Choice {
  id: string;
  text: string;
  nextSceneId: string;
  gamelanTone?: 'gong' | 'slendro' | 'miring' | 'kempyang';
  karmaImpact?: number; // Spirit of wisdom
  wiraImpact?: number; // Valour
  log?: string; // History log entry
}

export interface Scene {
  id: string;
  character?: string;
  avatar?: string;
  text: string;
  backgroundUrl?: string;
  bgClass?: string; // Custom visual transitions
  audioPrompt?: 'gong' | 'gamelan_ambient' | 'tension' | 'forest' | 'victory' | 'click' | 'drum';
  faktaSejarah?: FactCard;
  choices?: Choice[];
  nextSceneId?: string; // If no choices, click to progress to this scene
}

export interface Chapter {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  startSceneId: string;
  scenes: Record<string, Scene>;
}

export interface EncyclopediaEntry {
  id: string;
  title: string;
  category: 'Tokoh' | 'Budaya' | 'Geografi' | 'Militer' | 'Filosofi';
  description: string;
  quote?: string;
  sumber?: string;
}

export interface GameState {
  currentChapterId: string;
  currentSceneId: string;
  unlockedChapters: string[];
  karma: number; // Spirit of wisdom
  wira: number; // Valour
  historyLog: string[];
  unlockedEncyclopedia: string[];
  saveDate?: string;
}

export interface GameSettings {
  bgmVolume: number; // 0 to 1
  sfxVolume: number; // 0 to 1
  ttsEnabled: boolean;
  ttsRate: number; // 0.5 to 2
  textSpeed: 'slow' | 'normal' | 'fast'; // ms per char or speed animation
}
