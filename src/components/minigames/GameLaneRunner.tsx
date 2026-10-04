import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../../utils/audio';

interface GameLaneRunnerProps {
  onSuccess: () => void;
  onFailure?: () => void;
  targetMeters?: number;
}

export const GameLaneRunner: React.FC<GameLaneRunnerProps> = ({ onSuccess, targetMeters = 250 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [distance, setDistance] = useState(0);
  const [speedVal, setSpeedVal] = useState('1.0x');
  const [won, setWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const targetMetersRef = useRef(targetMeters);
  targetMetersRef.current = targetMeters;

  const stateRef = useRef({
    lane: 1, // 0: Left, 1: Center, 2: Right
    targetLane: 1,
    laneX: [45, 125, 205],
    currentX: 125,
    distance: 0,
    obstacles: [] as { lane: number; y: number; type: 'barrier' | 'spike' }[],
    won: false,
    gameOver: false,
  });

  const changeLane = (dir: -1 | 1) => {
    const s = stateRef.current;
    if (s.won || s.gameOver) return;
    const next = Math.max(0, Math.min(2, s.lane + dir));
    if (next !== s.lane) {
      s.lane = next;
      sounds.playBlip(540);
    }
  };

  const restart = () => {
    stateRef.current = {
      lane: 1,
      targetLane: 1,
      laneX: [45, 125, 205],
      currentX: 125,
      distance: 0,
      obstacles: [
        { lane: 0, y: -40, type: 'barrier' },
        { lane: 2, y: -120, type: 'barrier' },
      ],
      won: false,
      gameOver: false,
    };
    setDistance(0);
    setSpeedVal('1.0x');
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
    let spawnCounter = 0;

    const loop = () => {
      const s = stateRef.current;

      if (!s.won && !s.gameOver) {
        // Progressively faster speed: starts at 3.2, ramps up to 7.8!
        const progress = Math.min(1, s.distance / targetMetersRef.current);
        const currentSpeed = 3.2 + progress * 4.6;
        s.distance += 0.2 + progress * 0.25;

        setDistance(Math.floor(s.distance));
        setSpeedVal(`${(currentSpeed / 3.2).toFixed(1)}x`);

        // Smooth lane interpolation
        const targetX = s.laneX[s.lane];
        s.currentX += (targetX - s.currentX) * 0.35;

        // Progressive obstacle spawn interval
        spawnCounter += 1;
        const spawnThreshold = Math.max(18, Math.floor(40 - progress * 20));
        if (spawnCounter > spawnThreshold) {
          spawnCounter = 0;
          const randomLane = Math.floor(Math.random() * 3);
          s.obstacles.push({
            lane: randomLane,
            y: -25,
            type: Math.random() > 0.5 ? 'barrier' : 'spike',
          });
        }

        // Update obstacles
        for (let i = s.obstacles.length - 1; i >= 0; i--) {
          const obs = s.obstacles[i];
          obs.y += currentSpeed;

          // Check collision with player at y: 155
          if (obs.y >= 138 && obs.y <= 168 && s.lane === obs.lane) {
            s.gameOver = true;
            setGameOver(true);
            sounds.playFail();
          }

          if (obs.y > 215) {
            s.obstacles.splice(i, 1);
          }
        }

        // Win check
        if (s.distance >= targetMetersRef.current) {
          s.won = true;
          setWon(true);
          sounds.playSuccess();
          setTimeout(() => onSuccessRef.current(), 750);
        }
      }

      // Draw 3-lane track
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 260, 200);

      // Track perspective lanes
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(20, 0, 220, 200);

      // Lane dividers
      ctx.strokeStyle = '#e2e8f0';
      ctx.setLineDash([8, 8]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(90, 0);
      ctx.lineTo(90, 200);
      ctx.moveTo(170, 0);
      ctx.lineTo(170, 200);
      ctx.stroke();
      ctx.setLineDash([]);

      // Obstacles
      for (const obs of s.obstacles) {
        const ox = s.laneX[obs.lane] - 16;
        ctx.fillStyle = obs.type === 'barrier' ? '#ef4444' : '#f97316';
        ctx.fillRect(ox, obs.y, 32, 14);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(ox + 4, obs.y + 2, 6, 10);
        ctx.fillRect(ox + 22, obs.y + 2, 6, 10);
      }

      // Player Runner
      const px = s.currentX - 10;
      ctx.fillStyle = '#38bdf8'; // Blue runner
      ctx.fillRect(px, 155, 20, 22);
      ctx.fillStyle = '#facc15'; // Yellow hair
      ctx.fillRect(px + 2, 153, 16, 6);
      ctx.fillStyle = '#ef4444'; // Shoes
      ctx.fillRect(px + 2, 175, 6, 4);
      ctx.fillRect(px + 12, 175, 6, 4);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) changeLane(-1);
      if (['ArrowRight', 'KeyD'].includes(e.code)) changeLane(1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col items-center select-none font-pixel w-full max-w-xs">
      <div className="flex justify-between items-center w-full mb-2 text-xs">
        <span className="text-cyan-400">DISTANCE: {distance}m / {targetMeters}m</span>
        <span className="text-yellow-400 font-mono text-[10px]">SPEED: {speedVal}</span>
      </div>

      <div className="relative border-4 border-slate-700 shadow-2xl bg-black">
        <canvas ref={canvasRef} width={260} height={200} className="pixelated block" />

        {won && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center border-2 border-emerald-400 p-4 animate-in fade-in">
            <span className="text-emerald-400 text-sm mb-1 font-bold">★ RUNWAY CONQUERED! ★</span>
            <span className="text-[10px] text-slate-300 mb-3">Survived the 250m hyper-acceleration sprint!</span>
            <button
              onClick={() => onSuccessRef.current()}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold border-2 border-white cursor-pointer"
            >
              CLAIM REWARD NOW
            </button>
          </div>
        )}

        {gameOver && !won && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center border-2 border-red-500 p-4">
            <span className="text-red-400 text-xs mb-3">COLLISION DETECTED</span>
            <button
              onClick={restart}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-[10px] border-2 border-white cursor-pointer"
            >
              RESTART RUN
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-3 w-full justify-center">
        <button
          onClick={() => changeLane(-1)}
          className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border-2 border-slate-600 text-xs cursor-pointer active:bg-slate-600"
        >
          ◀ LEFT LANE
        </button>
        <button
          onClick={() => changeLane(1)}
          className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border-2 border-slate-600 text-xs cursor-pointer active:bg-slate-600"
        >
          RIGHT LANE ▶
        </button>
      </div>
      <p className="text-[9px] text-slate-400 mt-2">Corridor accelerates progressively! Reach 250m to escape.</p>
    </div>
  );
};
