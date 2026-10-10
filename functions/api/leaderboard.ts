export interface LeaderboardEntry {
  id: string;
  runName: string;
  playerName?: string;
  playtimeSeconds: number;
  totalKana: number;
  characterId: string;
  characterName: string;
  roomsCleared: number;
  craftedWords?: string[];
  timestamp: number;
  formattedDate: string;
}

interface Env {
  LEADERBOARD_KV?: {
    get: (key: string, type?: 'text' | 'json') => Promise<any>;
    put: (key: string, value: string) => Promise<void>;
  };
}

// In-memory global fallback cache across warm edge nodes if KV is not yet bound
let memoryLeaderboard: LeaderboardEntry[] = [];

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
};

export const onRequestGet = async (context: { env: Env }) => {
  try {
    let entries: LeaderboardEntry[] = [];
    if (context.env?.LEADERBOARD_KV) {
      const data = await context.env.LEADERBOARD_KV.get('global_leaderboard', 'json');
      if (Array.isArray(data)) {
        entries = data;
      }
    } else {
      entries = memoryLeaderboard;
    }

    return new Response(JSON.stringify(entries), {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Server error', entries: [] }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const newEntry: LeaderboardEntry = await context.request.json();

    if (!newEntry || !newEntry.id || typeof newEntry.playtimeSeconds !== 'number') {
      return new Response(JSON.stringify({ error: 'Invalid entry payload' }), {
        status: 400,
        headers: CORS_HEADERS,
      });
    }

    let entries: LeaderboardEntry[] = [];
    if (context.env?.LEADERBOARD_KV) {
      const data = await context.env.LEADERBOARD_KV.get('global_leaderboard', 'json');
      if (Array.isArray(data)) {
        entries = data;
      }
    } else {
      entries = memoryLeaderboard;
    }

    // Deduplicate and upsert
    const existingIndex = entries.findIndex((e) => e.id === newEntry.id);
    if (existingIndex >= 0) {
      entries[existingIndex] = newEntry;
    } else {
      entries.push(newEntry);
    }

    // Sort: lowest playtime first (fastest escape), then highest kana
    entries.sort((a, b) => {
      if (a.playtimeSeconds !== b.playtimeSeconds) {
        return a.playtimeSeconds - b.playtimeSeconds;
      }
      if (a.totalKana !== b.totalKana) {
        return (b.totalKana || 0) - (a.totalKana || 0);
      }
      return b.timestamp - a.timestamp;
    });

    // Keep top 50 runs
    entries = entries.slice(0, 50);

    if (context.env?.LEADERBOARD_KV) {
      await context.env.LEADERBOARD_KV.put('global_leaderboard', JSON.stringify(entries));
    } else {
      memoryLeaderboard = entries;
    }

    return new Response(JSON.stringify({ success: true, allEntries: entries }), {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to save entry' }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
};

export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
};
