import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../../utils/audio';

interface GameSlidingPuzzleProps {
  onSuccess: () => void;
  onFailure?: () => void;
}

export const GameSlidingPuzzle: React.FC<GameSlidingPuzzleProps> = ({ onSuccess }) => {
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const [tiles, setTiles] = useState<number[]>(() => generateSolvableShuffle());
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [hintIndex, setHintIndex] = useState<number | null>(null);
  const [hintCooldown, setHintCooldown] = useState(0);

  // Generate challenging randomized but 100% solvable shuffle
  function generateSolvableShuffle(): number[] {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
    let emptyIdx = 15;
    let prevIdx = -1;

    // Perform 45 random valid moves from solved state
    for (let step = 0; step < 45; step++) {
      const row = Math.floor(emptyIdx / 4);
      const col = emptyIdx % 4;
      const neighbors: number[] = [];

      if (row > 0) neighbors.push(emptyIdx - 4);
      if (row < 3) neighbors.push(emptyIdx + 4);
      if (col > 0) neighbors.push(emptyIdx - 1);
      if (col < 3) neighbors.push(emptyIdx + 1);

      // Avoid immediately undoing previous move
      const valid = neighbors.filter((n) => n !== prevIdx);
      const chosen = valid[Math.floor(Math.random() * valid.length)] ?? neighbors[0];

      arr[emptyIdx] = arr[chosen];
      arr[chosen] = 0;
      prevIdx = emptyIdx;
      emptyIdx = chosen;
    }
    return arr;
  }

  const checkWin = (arr: number[]) => {
    for (let i = 0; i < 15; i++) {
      if (arr[i] !== i + 1) return false;
    }
    return arr[15] === 0;
  };

  const handleTileClick = (index: number) => {
    if (won) return;
    const emptyIndex = tiles.indexOf(0);
    const row = Math.floor(index / 4);
    const col = index % 4;
    const emptyRow = Math.floor(emptyIndex / 4);
    const emptyCol = emptyIndex % 4;

    const isAdjacent = Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1;

    if (isAdjacent) {
      sounds.playBlip(480);
      const next = [...tiles];
      next[emptyIndex] = tiles[index];
      next[index] = 0;
      setTiles(next);
      setMoves((m) => m + 1);
      setHintIndex(null); // clear hint once moved

      if (checkWin(next)) {
        setWon(true);
        sounds.playSuccess();
        setTimeout(() => onSuccessRef.current(), 750);
      }
    }
  };

  // 15s Cooldown Timer
  useEffect(() => {
    if (hintCooldown <= 0) return;
    const timer = setInterval(() => {
      setHintCooldown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [hintCooldown]);

  // Hint calculation: finds adjacent tile that minimizes total Manhattan distance
  const handleGetHint = () => {
    if (hintCooldown > 0 || won) return;
    sounds.playSelect();

    const emptyIdx = tiles.indexOf(0);
    const row = Math.floor(emptyIdx / 4);
    const col = emptyIdx % 4;
    const neighbors: number[] = [];

    if (row > 0) neighbors.push(emptyIdx - 4);
    if (row < 3) neighbors.push(emptyIdx + 4);
    if (col > 0) neighbors.push(emptyIdx - 1);
    if (col < 3) neighbors.push(emptyIdx + 1);

    const getManhattan = (arr: number[]) => {
      let dist = 0;
      for (let i = 0; i < 16; i++) {
        const val = arr[i];
        if (val === 0) continue;
        const targetR = Math.floor((val - 1) / 4);
        const targetC = (val - 1) % 4;
        const curR = Math.floor(i / 4);
        const curC = i % 4;
        dist += Math.abs(curR - targetR) + Math.abs(curC - targetC);
      }
      return dist;
    };

    let bestNeighbor = neighbors[0];
    let bestDist = Infinity;

    for (const n of neighbors) {
      const test = [...tiles];
      test[emptyIdx] = test[n];
      test[n] = 0;
      const d = getManhattan(test);
      if (d < bestDist) {
        bestDist = d;
        bestNeighbor = n;
      }
    }

    setHintIndex(bestNeighbor);
    setHintCooldown(15);
  };

  return (
    <div className="flex flex-col items-center select-none font-pixel w-full max-w-xs">
      <div className="flex justify-between items-center w-full mb-2 text-xs">
        <span className="text-amber-400">MOVES: {moves}</span>
        <button
          onClick={handleGetHint}
          disabled={hintCooldown > 0 || won}
          className={`px-3 py-1 border text-[10px] cursor-pointer transition-all ${
            hintCooldown > 0
              ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
              : 'bg-cyan-900/60 hover:bg-cyan-700 text-cyan-300 border-cyan-500 shadow-sm'
          }`}
        >
          {hintCooldown > 0 ? `HINT (${hintCooldown}s)` : '💡 HINT'}
        </button>
      </div>

      <div className="bg-slate-950 p-3 border-4 border-slate-700 shadow-2xl relative">
        <div className="grid grid-cols-4 gap-1.5 w-60 h-60 bg-slate-900 border border-slate-800 p-1.5">
          {tiles.map((val, idx) => {
            const isEmpty = val === 0;
            const isHint = hintIndex === idx;

            return (
              <button
                key={idx}
                onClick={() => handleTileClick(idx)}
                disabled={isEmpty || won}
                className={`w-13 h-13 border-2 flex items-center justify-center font-bold text-sm transition-all cursor-pointer relative ${
                  isEmpty
                    ? 'bg-slate-950/60 border-slate-800'
                    : isHint
                    ? 'bg-yellow-500 border-white text-black scale-105 ring-2 ring-cyan-400 z-10 animate-bounce'
                    : 'bg-indigo-900 hover:bg-indigo-800 active:scale-95 border-indigo-400 text-yellow-300 shadow-md'
                }`}
              >
                {!isEmpty && val}
              </button>
            );
          })}
        </div>

        {won && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center border-2 border-emerald-400 p-4 animate-in fade-in">
            <span className="text-emerald-400 text-sm mb-1 font-bold">★ TOME SHELF SOLVED! ★</span>
            <span className="text-[10px] text-slate-300 mb-3">All 15 tiles ordered into alignment!</span>
            <button
              onClick={() => onSuccessRef.current()}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold border-2 border-white cursor-pointer shadow-lg"
            >
              CLAIM REWARD NOW
            </button>
          </div>
        )}
      </div>

      <p className="text-[9px] text-slate-400 mt-2 text-center">
        Randomized 15-puzzle • Slide tiles into order 1 to 15 • Use 💡 Hint if stuck!
      </p>
    </div>
  );
};
