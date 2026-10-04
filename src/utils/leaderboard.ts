import { CharacterId } from '../types/game';
import { CHARACTERS } from '../data/characters';

export interface LeaderboardEntry {
  id: string;
  runName: string;
  playerName?: string;
  playtimeSeconds: number;
  totalKana: number;
  characterId: CharacterId;
  characterName: string;
  roomsCleared: number;
  craftedWords?: string[];
  timestamp: number;
  formattedDate: string;
}

const LEADERBOARD_STORAGE_KEY = 'kana_escape_runs_leaderboard_v2';
const OLD_STORAGE_KEY = 'kana_escape_leaderboard_v1';

export const getLeaderboard = (): LeaderboardEntry[] => {
  try {
    // Clear out any obsolete fake-name storage from previous version
    if (localStorage.getItem(OLD_STORAGE_KEY)) {
      localStorage.removeItem(OLD_STORAGE_KEY);
    }

    const raw = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return sortLeaderboard(parsed);
    }
  } catch {
    // fallback
  }
  return [];
};

const sortLeaderboard = (entries: LeaderboardEntry[]): LeaderboardEntry[] => {
  return [...entries].sort((a, b) => {
    // Primary sort: fastest escape time (lowest seconds)
    if (a.playtimeSeconds !== b.playtimeSeconds) {
      return a.playtimeSeconds - b.playtimeSeconds;
    }
    // Secondary sort: most Kana discovered
    if (a.totalKana !== b.totalKana) {
      return b.totalKana - a.totalKana;
    }
    // Tertiary: most recent
    return b.timestamp - a.timestamp;
  });
};

export const saveLeaderboardEntry = (params: {
  runName: string;
  playtimeSeconds: number;
  totalKana: number;
  characterId: CharacterId;
  roomsCleared?: number;
  craftedWords?: string[];
}): { entry: LeaderboardEntry; rank: number; allEntries: LeaderboardEntry[] } => {
  const current = getLeaderboard();
  const char = CHARACTERS.find((c) => c.id === params.characterId);
  const characterName = char?.name || 'Explorer';

  const defaultSuggestedName = `Run #${current.length + 1}`;
  const cleanName = params.runName.trim().slice(0, 20) || defaultSuggestedName;

  const now = new Date();
  const formattedDate = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear().toString().slice(-2)}`;

  const newEntry: LeaderboardEntry = {
    id: `run-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    runName: cleanName,
    playerName: cleanName,
    playtimeSeconds: params.playtimeSeconds,
    totalKana: params.totalKana,
    characterId: params.characterId,
    characterName,
    roomsCleared: params.roomsCleared ?? 3,
    craftedWords: params.craftedWords || [],
    timestamp: Date.now(),
    formattedDate,
  };

  const updated = sortLeaderboard([...current, newEntry]).slice(0, 30);

  try {
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  const rank = updated.findIndex((e) => e.id === newEntry.id) + 1;

  return { entry: newEntry, rank: rank > 0 ? rank : updated.length, allEntries: updated };
};

export const clearLeaderboard = (): LeaderboardEntry[] => {
  try {
    localStorage.removeItem(LEADERBOARD_STORAGE_KEY);
    localStorage.removeItem(OLD_STORAGE_KEY);
  } catch {
    // ignore
  }
  return [];
};

export const formatTime = (secs: number): string => {
  const mins = Math.floor(secs / 60);
  const s = secs % 60;
  return `${mins}:${s.toString().padStart(2, '0')}`;
};
