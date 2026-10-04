import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../../utils/audio';

interface GameKanaCatcherProps {
  onSuccess: () => void;
  onFailure?: () => void;
  targetCount?: number;
}

export const GameKanaCatcher: React.FC<GameKanaCatcherProps> = ({ onSuccess, targetCount = 15 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [caught, setCaught] = useState(0);
  const [won, setWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const targetCountRef = useRef(targetCount);
  targetCountRef.current = targetCount;

  const stateRef = useRef({
    basketX: 110,
    items: [] as { x: number; y: number; speed: number; char: string; color: string }[],
    caught: 0,
    won: false,
    gameOver: false,
    keys: { left: false, right: false },
  });

  const restart = () => {
    stateRef.current = {
      basketX: 110,
      items: [],
      caught: 0,
      won: false,
      gameOver: false,
      keys: { left: false, right: false },
    };
    setCaught(0);
    setWon(false);
    setGameOver(false);
  };

  useEffect(() => {
    restart();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    let animId: number;
    let spawnTimer = 0;
    const colors = ['#f472b6', '#38bdf8', '#fbbf24', '#a78bfa', '#34d399'];
    const kanaSymbols = ['あ', 'い', 'う', 'え', 'お'];

    const loop = () => {
      const state = stateRef.current;

      // Input movement
      if (state.keys.left) state.basketX = Math.max(10, state.basketX - 4.2);
      if (state.keys.right) state.basketX = Math.min(205, state.basketX + 4.2);

      // Spawn falling spirit wisps
      spawnTimer++;
      // Spawn interval accelerates with score
      const intervalThreshold = Math.max(22, 45 - state.caught * 1.5);

      if (spawnTimer > intervalThreshold && !state.won && !state.gameOver) {
        spawnTimer = 0;
        // Progressive speed: accelerates from 2.0 up to 4.8!
        const baseSpd = 2.0 + state.caught * 0.18;
        state.items.push({
          x: Math.floor(Math.random() * 200) + 20,
          y: -10,
          speed: baseSpd + Math.random() * 0.6,
          char: kanaSymbols[Math.floor(Math.random() * kanaSymbols.length)],
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }

      // Update falling items
      if (!state.won && !state.gameOver) {
        for (let i = state.items.length - 1; i >= 0; i--) {
          const item = state.items[i];
          item.y += item.speed;

          // Check Catch (basin at y: 165, width: 44)
          if (
            item.y >= 155 &&
            item.y <= 175 &&
            item.x >= state.basketX - 10 &&
            item.x <= state.basketX + 44
          ) {
            state.items.splice(i, 1);
            state.caught++;
            setCaught(state.caught);
            sounds.playKanaObtained();

            if (state.caught >= targetCountRef.current) {
              state.won = true;
              setWon(true);
              sounds.playSuccess();
              setTimeout(() => onSuccessRef.current(), 750);
            }
            continue;
          }

          // Strict Condition: MISSING A SINGLE SPIRIT RESULTS IN FAILURE!
          if (item.y > 185) {
            state.gameOver = true;
            setGameOver(true);
            sounds.playFail();
            break;
          }
        }
      }

      // Render
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 260, 200);

      // Background sacred pool ripple lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let y = 30; y < 190; y += 25) {
        ctx.beginPath();
        ctx.moveTo(10, y);
        ctx.lineTo(250, y);
        ctx.stroke();
      }

      // Draw Falling Spirits
      for (const item of state.items) {
        ctx.fillStyle = item.color;
        // Spirit wisp orb
        ctx.beginPath();
        ctx.arc(item.x, item.y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(item.x - 2, item.y - 2, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Kanji character inside
        ctx.fillStyle = '#000000';
        ctx.font = '8px monospace';
        ctx.fillText(item.char, item.x - 3.5, item.y + 3);
      }

      // Draw Shrine Basin (Player Catcher)
      ctx.fillStyle = '#475569';
      ctx.fillRect(state.basketX, 168, 44, 14);
      // Sacred water inside basin
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(state.basketX + 3, 169, 38, 5);
      // Vermilion rim
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(state.basketX, 166, 44, 2);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) stateRef.current.keys.left = true;
      if (['ArrowRight', 'KeyD'].includes(e.code)) stateRef.current.keys.right = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) stateRef.current.keys.left = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) stateRef.current.keys.right = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="flex flex-col items-center select-none font-pixel w-full max-w-xs">
      <div className="flex justify-between items-center w-full mb-2 text-xs">
        <span className="text-emerald-400">SPIRITS: {caught}/{targetCount}</span>
        <span className="text-rose-400 text-[10px] font-mono">0 MISSES ALLOWED</span>
      </div>

      <div className="relative border-4 border-slate-700 shadow-2xl bg-black">
        <canvas ref={canvasRef} width={260} height={200} className="pixelated block" />

        {won && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center border-2 border-emerald-400 p-4 animate-in fade-in">
            <span className="text-emerald-400 text-sm mb-1 font-bold">★ 15 SPIRITS CONSECRATED! ★</span>
            <span className="text-[10px] text-slate-300 mb-3">Flawless sacred basin collection!</span>
            <button
              onClick={() => onSuccessRef.current()}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold border-2 border-white cursor-pointer shadow-lg"
            >
              CLAIM REWARD NOW
            </button>
          </div>
        )}

        {gameOver && !won && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center border-2 border-red-500 p-4">
            <span className="text-red-400 text-xs mb-1 font-bold">SPIRIT TOUCHED GROUND!</span>
            <span className="text-[9px] text-slate-300 mb-3">Catch all 15 spirits without dropping one.</span>
            <button
              onClick={restart}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-[10px] border-2 border-white cursor-pointer"
            >
              TRY AGAIN
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-3 w-full justify-center">
        <button
          onClick={() => { stateRef.current.basketX = Math.max(10, stateRef.current.basketX - 25); }}
          className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border-2 border-slate-600 text-xs cursor-pointer active:bg-slate-600"
        >
          ◀ LEFT
        </button>
        <button
          onClick={() => { stateRef.current.basketX = Math.min(205, stateRef.current.basketX + 25); }}
          className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border-2 border-slate-600 text-xs cursor-pointer active:bg-slate-600"
        >
          RIGHT ▶
        </button>
      </div>
      <p className="text-[9px] text-slate-400 mt-2 text-center">
        Catch 15 falling spirits in the basin. Every single spirit must be caught!
      </p>
    </div>
  );
};
