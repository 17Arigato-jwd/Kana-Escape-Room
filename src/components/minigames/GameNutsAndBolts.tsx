import React, { useState, useRef } from 'react';
import { sounds } from '../../utils/audio';

interface GameNutsAndBoltsProps {
  onSuccess: () => void;
  onFailure?: () => void;
}

const MAX_CAPACITY = 3;

const COLORS: Record<string, { bg: string; border: string; name: string }> = {
  R: { bg: '#ef4444', border: '#b91c1c', name: 'RED' },
  B: { bg: '#3b82f6', border: '#1d4ed8', name: 'BLUE' },
  G: { bg: '#10b981', border: '#047857', name: 'GREEN' },
  Y: { bg: '#eab308', border: '#a16207', name: 'YELLOW' },
};

export const GameNutsAndBolts: React.FC<GameNutsAndBoltsProps> = ({ onSuccess }) => {
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const [bolts, setBolts] = useState<string[][]>(() => initBolts());
  const [selectedBoltIdx, setSelectedBoltIdx] = useState<number | null>(null);
  const [won, setWon] = useState(false);
  const [moves, setMoves] = useState(0);

  function initBolts(): string[][] {
    return [
      ['R', 'B', 'G'], // Bolt 0
      ['B', 'G', 'R'], // Bolt 1
      ['G', 'R', 'B'], // Bolt 2
      [],              // Bolt 3 (Empty)
      [],              // Bolt 4 (Empty)
    ];
  }

  const checkWin = (currentBolts: string[][]): boolean => {
    for (const bolt of currentBolts) {
      if (bolt.length === 0) continue;
      if (bolt.length !== MAX_CAPACITY) return false;
      const firstColor = bolt[0];
      if (!bolt.every((c) => c === firstColor)) return false;
    }
    return true;
  };

  // Helper: Count consecutive same-color nuts at top of a bolt
  const getTopSameColorCount = (bolt: string[]): number => {
    if (bolt.length === 0) return 0;
    const topColor = bolt[bolt.length - 1];
    let count = 0;
    for (let i = bolt.length - 1; i >= 0; i--) {
      if (bolt[i] === topColor) count++;
      else break;
    }
    return count;
  };

  const handleBoltClick = (boltIdx: number) => {
    if (won) return;

    if (selectedBoltIdx === null) {
      // Pick up top group of matching nuts
      if (bolts[boltIdx].length > 0) {
        sounds.playBlip(540);
        setSelectedBoltIdx(boltIdx);
      }
    } else {
      if (selectedBoltIdx === boltIdx) {
        // Deselect
        sounds.playBlip(320);
        setSelectedBoltIdx(null);
        return;
      }

      const sourceBolt = bolts[selectedBoltIdx];
      const targetBolt = bolts[boltIdx];

      if (sourceBolt.length === 0) {
        setSelectedBoltIdx(null);
        return;
      }

      const nutColor = sourceBolt[sourceBolt.length - 1];
      const topCount = getTopSameColorCount(sourceBolt);
      const targetCapacity = MAX_CAPACITY - targetBolt.length;

      // Can move if target is empty OR top of target matches the nut color
      const canAcceptColor = targetBolt.length === 0 || targetBolt[targetBolt.length - 1] === nutColor;

      if (canAcceptColor && targetCapacity > 0) {
        // Transfer all consecutive matching nuts that fit together!
        const countToMove = Math.min(topCount, targetCapacity);
        sounds.playSelect();

        const transferredNuts = Array(countToMove).fill(nutColor);

        const nextBolts = bolts.map((b, i) => {
          if (i === selectedBoltIdx) return b.slice(0, b.length - countToMove);
          if (i === boltIdx) return [...b, ...transferredNuts];
          return [...b];
        });

        setBolts(nextBolts);
        setSelectedBoltIdx(null);
        setMoves((m) => m + 1);

        if (checkWin(nextBolts)) {
          setWon(true);
          sounds.playSuccess();
          setTimeout(() => onSuccessRef.current(), 750);
        }
        return;
      }

      // Invalid move
      sounds.playFail();
      setSelectedBoltIdx(null);
    }
  };

  const restart = () => {
    setBolts(initBolts());
    setSelectedBoltIdx(null);
    setMoves(0);
    setWon(false);
  };

  return (
    <div className="flex flex-col items-center select-none font-pixel w-full max-w-sm">
      <div className="flex justify-between items-center w-full mb-2 text-xs">
        <span className="text-amber-400">MOVES: {moves}</span>
        <span className="text-cyan-400 text-[10px]">MATCHED NUTS MOVE TOGETHER</span>
        <button
          onClick={restart}
          className="text-slate-400 hover:text-white underline cursor-pointer text-[10px]"
        >
          RESET
        </button>
      </div>

      <div className="bg-slate-950 p-4 border-4 border-slate-700 shadow-2xl w-full flex flex-col items-center relative">
        {/* Bolts Arena */}
        <div className="flex justify-around items-end w-full h-44 bg-slate-900 border-2 border-slate-800 p-3 pt-6 rounded-md">
          {bolts.map((bolt, idx) => {
            const isSelected = selectedBoltIdx === idx;
            const topSameCount = getTopSameColorCount(bolt);

            return (
              <button
                key={idx}
                onClick={() => handleBoltClick(idx)}
                className={`relative flex flex-col-reverse items-center w-12 h-36 cursor-pointer group transition-all ${
                  isSelected ? 'scale-105' : ''
                }`}
              >
                {/* Vertical Steel Rod / Bolt */}
                <div className="absolute top-2 bottom-0 w-3 bg-slate-600 border border-slate-400 rounded-t-sm shadow-inner" />

                {/* Base mount */}
                <div className="w-10 h-3 bg-slate-700 border border-slate-500 rounded-sm z-10" />

                {/* Stacked Hex Nuts */}
                {bolt.map((colorKey, nutIdx) => {
                  const c = COLORS[colorKey];
                  // If selected, ALL consecutive top nuts of the same color lift up together!
                  const isLifted = isSelected && nutIdx >= bolt.length - topSameCount;

                  return (
                    <div
                      key={nutIdx}
                      className={`w-9 h-7 rounded-sm border-2 flex items-center justify-center font-bold text-[9px] text-white shadow-md z-20 transition-all duration-150 ${
                        isLifted ? '-translate-y-5 ring-2 ring-yellow-300' : ''
                      }`}
                      style={{
                        backgroundColor: c.bg,
                        borderColor: c.border,
                      }}
                    >
                      <div className="w-3 h-3 rounded-full bg-slate-900/60 border border-white/40" />
                    </div>
                  );
                })}

                {/* Selection Arrow */}
                {isSelected && (
                  <div className="absolute -top-4 text-yellow-400 text-xs animate-bounce font-bold">
                    ▼
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {won && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center border-2 border-emerald-400 p-4 animate-in fade-in z-30">
            <span className="text-emerald-400 text-sm mb-1 font-bold">★ NUTS SORTED! ★</span>
            <span className="text-[10px] text-slate-300 mb-3">All bolts categorized by pure color!</span>
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
        Stacked nuts of the same color lift and move together as a single block!
      </p>
    </div>
  );
};
