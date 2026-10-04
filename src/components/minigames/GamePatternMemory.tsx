import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sounds } from '../../utils/audio';

interface GamePatternMemoryProps {
  onSuccess: () => void;
  onFailure?: () => void;
  totalStages?: number;
}

export const GamePatternMemory: React.FC<GamePatternMemoryProps> = ({ onSuccess, totalStages = 5 }) => {
  const [stage, setStage] = useState(1);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [isShowingPattern, setIsShowingPattern] = useState(false);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const seqRef = useRef<number[]>([]);

  // Generate sequence for current stage
  const startStage = useCallback((currentStage: number) => {
    setIsShowingPattern(true);
    setPlayerInput([]);

    // Build random sequence of length currentStage
    const newSeq: number[] = [];
    for (let i = 0; i < currentStage; i++) {
      newSeq.push(Math.floor(Math.random() * 9) + 1);
    }
    setSequence(newSeq);
    seqRef.current = newSeq;

    // Flash sequence with timing that gets progressively faster on each stage!
    const flashSpeed = Math.max(180, 580 - (currentStage - 1) * 85);
    const activeDuration = Math.max(100, Math.floor(flashSpeed * 0.6));

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < newSeq.length) {
        const btn = newSeq[idx];
        setActiveButton(btn);
        sounds.playBlip(320 + btn * 50);

        setTimeout(() => {
          setActiveButton(null);
        }, activeDuration);

        idx++;
      } else {
        clearInterval(interval);
        setIsShowingPattern(false);
      }
    }, flashSpeed);
  }, []);

  useEffect(() => {
    startStage(stage);
  }, [stage, startStage]);

  const handleButtonClick = (num: number) => {
    if (isShowingPattern || gameOver || won) return;

    sounds.playBlip(320 + num * 50);
    setActiveButton(num);
    setTimeout(() => setActiveButton(null), 200);

    const nextInput = [...playerInput, num];
    setPlayerInput(nextInput);

    const stepIndex = nextInput.length - 1;
    if (seqRef.current[stepIndex] !== num) {
      // Wrong button
      sounds.playFail();
      setGameOver(true);
      return;
    }

    // Check if stage complete
    if (nextInput.length === seqRef.current.length) {
      sounds.playSelect();
      if (stage >= totalStages) {
        setWon(true);
        sounds.playSuccess();
        setTimeout(() => onSuccess(), 750);
      } else {
        setTimeout(() => {
          setStage((s) => s + 1);
        }, 600);
      }
    }
  };

  const retry = () => {
    setGameOver(false);
    setStage(1);
    startStage(1);
  };

  return (
    <div className="flex flex-col items-center select-none font-pixel w-full max-w-xs">
      <div className="flex justify-between items-center w-full mb-3 text-xs">
        <span className="text-amber-400">MEMORY MATRIX</span>
        <span className="text-emerald-400">STAGE {stage}/{totalStages}</span>
      </div>

      <div className="relative bg-slate-950 p-4 border-4 border-slate-700 shadow-2xl flex flex-col items-center">
        <div className="text-[10px] text-slate-400 mb-3 text-center">
          {isShowingPattern ? (
            <span className="text-cyan-400 animate-pulse">WATCH THE SEQUENCE...</span>
          ) : (
            <span className="text-emerald-400">YOUR TURN! REPEAT PATTERN</span>
          )}
        </div>

        {/* 3x3 Grid Buttons */}
        <div className="grid grid-cols-3 gap-3 w-56 h-56">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
            const isActive = activeButton === num;
            return (
              <button
                key={num}
                disabled={isShowingPattern || gameOver || won}
                onClick={() => handleButtonClick(num)}
                className={`w-16 h-16 border-4 flex items-center justify-center text-lg font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-yellow-400 text-black border-white scale-95 shadow-[0_0_15px_rgba(250,204,21,0.9)]'
                    : 'bg-slate-800 text-slate-300 border-slate-600 hover:border-slate-400 active:scale-95'
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>

        {won && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center border-2 border-emerald-400 p-4">
            <span className="text-emerald-400 text-sm mb-2">PATTERN COMPLETE!</span>
            <span className="text-xs text-slate-300">Granting Kana reward...</span>
          </div>
        )}

        {gameOver && !won && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center border-2 border-red-500 p-4">
            <span className="text-red-400 text-sm mb-2">WRONG SEQUENCE!</span>
            <button
              onClick={retry}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-[10px] border-2 border-white cursor-pointer active:translate-y-0.5"
            >
              RESTART FROM STAGE 1
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-1.5 mt-3">
        {Array.from({ length: totalStages }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 border ${
              i + 1 < stage || won
                ? 'bg-emerald-400 border-emerald-300'
                : i + 1 === stage
                ? 'bg-yellow-400 border-yellow-200 animate-pulse'
                : 'bg-slate-800 border-slate-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
