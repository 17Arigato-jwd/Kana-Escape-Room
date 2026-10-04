import React, { useState } from 'react';
import { LeaderboardEntry, formatTime, clearLeaderboard } from '../../utils/leaderboard';
import { RunDetailsModal } from './RunDetailsModal';
import { sounds } from '../../utils/audio';

interface LeaderboardViewProps {
  entries: LeaderboardEntry[];
  highlightId?: string;
  onRefresh?: (newEntries: LeaderboardEntry[]) => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  entries,
  highlightId,
  onRefresh,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [inspectingRun, setInspectingRun] = useState<{ entry: LeaderboardEntry; rank: number } | null>(null);

  const handleReset = () => {
    const fresh = clearLeaderboard();
    sounds.playFail();
    setShowClearConfirm(false);
    if (onRefresh) onRefresh(fresh);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Table Container */}
      <div className="w-full bg-slate-950 border-2 border-slate-700 rounded-sm overflow-hidden shadow-xl">
        {/* Table Header */}
        <div className="grid grid-cols-12 bg-slate-900 border-b border-slate-800 text-[9px] sm:text-[10px] font-pixel text-amber-400 py-2 px-2 text-center">
          <span className="col-span-2 text-left">RANK</span>
          <span className="col-span-4 text-left">RUN NAME</span>
          <span className="col-span-2 text-center">CHAR</span>
          <span className="col-span-2 text-center">KANA</span>
          <span className="col-span-2 text-right">TIME</span>
        </div>

        {/* Entries List */}
        <div className="max-h-60 sm:max-h-68 overflow-y-auto divide-y divide-slate-900/80 font-pixel">
          {entries.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center gap-2">
              <span className="text-2xl">📜</span>
              <span className="font-pixel text-xs text-yellow-300">NO RUNS RECORDED YET</span>
              <span className="font-pixel text-[9px] text-slate-400 max-w-xs">
                Escape through the exit door and name your run to establish your records!
              </span>
            </div>
          ) : (
            entries.map((entry, idx) => {
              const rank = idx + 1;
              const isHighlight = entry.id === highlightId;
              const displayName = entry.runName || entry.playerName || `Run #${rank}`;

              const medal =
                rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;

              return (
                <div
                  key={entry.id}
                  onClick={() => {
                    sounds.playSelect();
                    setInspectingRun({ entry, rank });
                  }}
                  title="Click to view run summary and created words"
                  className={`grid grid-cols-12 items-center text-[10px] sm:text-xs py-2 px-2 transition-all cursor-pointer select-none group ${
                    isHighlight
                      ? 'bg-amber-500/25 text-yellow-300 ring-2 ring-yellow-400 font-bold hover:bg-amber-500/35'
                      : rank === 1
                      ? 'bg-yellow-950/20 text-yellow-200 hover:bg-yellow-950/40'
                      : rank === 2
                      ? 'bg-slate-800/40 text-slate-200 hover:bg-slate-800/60'
                      : rank === 3
                      ? 'bg-amber-950/20 text-amber-200 hover:bg-amber-950/40'
                      : 'text-slate-300 hover:bg-slate-900/80 hover:text-white'
                  }`}
                >
                  {/* Rank */}
                  <div className="col-span-2 text-left font-bold flex items-center gap-1">
                    <span className="text-xs sm:text-sm">{medal}</span>
                  </div>

                  {/* Run Name */}
                  <div className="col-span-4 text-left truncate flex items-center gap-1">
                    <span className="tracking-wide group-hover:underline" title={displayName}>
                      {displayName}
                    </span>
                    {isHighlight && (
                      <span className="text-[7px] bg-yellow-400 text-black px-1 rounded-xs font-sans font-bold shrink-0">
                        NEW
                      </span>
                    )}
                  </div>

                  {/* Character */}
                  <div className="col-span-2 text-center truncate text-[9px] text-cyan-300">
                    {entry.characterName}
                  </div>

                  {/* Kana Count */}
                  <div className="col-span-2 text-center text-[10px] font-mono text-emerald-400">
                    {entry.totalKana}
                  </div>

                  {/* Escape Time */}
                  <div className="col-span-2 text-right font-mono font-bold text-yellow-300 flex items-center justify-end gap-1">
                    <span>{formatTime(entry.playtimeSeconds)}</span>
                    <span className="text-[8px] text-slate-500 group-hover:text-amber-400 opacity-60 group-hover:opacity-100">
                      ➔
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Sub-footer options & Helper hint */}
      <div className="w-full flex justify-between items-center text-[9px] font-pixel text-slate-400 mt-2 px-1">
        <span className="text-amber-400/90">💡 Click any run to inspect summary &amp; words</span>
        {entries.length > 0 && (
          !showClearConfirm ? (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-slate-500 hover:text-red-400 transition-colors cursor-pointer underline"
            >
              Clear Records
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-rose-400">Clear all records?</span>
              <button
                onClick={handleReset}
                className="text-rose-400 hover:text-rose-300 font-bold underline cursor-pointer"
              >
                YES
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                NO
              </button>
            </div>
          )
        )}
      </div>

      {/* Run Details Modal */}
      {inspectingRun && (
        <RunDetailsModal
          entry={inspectingRun.entry}
          rank={inspectingRun.rank}
          onClose={() => setInspectingRun(null)}
        />
      )}
    </div>
  );
};
