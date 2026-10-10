import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../../utils/audio';

interface GameWallBreakerProps {
  onSuccess: () => void;
  onFailure?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export const GameWallBreaker: React.FC<GameWallBreakerProps> = ({ onSuccess }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [bricksLeft, setBricksLeft] = useState(24);
  const [speedVal, setSpeedVal] = useState('1.0x');
  const [won, setWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const particlesRef = useRef<Particle[]>([]);

  const stateRef = useRef({
    paddleX: 108,
    paddleW: 44,
    ballX: 130,
    ballY: 140,
    ballVx: 1.8,
    ballVy: -2.0,
    speedFactor: 1.0,
    score: 0,
    started: false,
    won: false,
    gameOver: false,
    bricks: [] as { x: number; y: number; w: number; h: number; color: string; alive: boolean }[],
    keys: { left: false, right: false },
  });

  const spawnParticles = (x: number, y: number, color: string) => {
    for (let i = 0; i < 18; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = (Math.random() * 0.8 + 0.3) * 4.0;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        life: 0,
        maxLife: 20 + Math.random() * 12,
        color,
        size: Math.random() * 3 + 2,
      });
    }
  };

  const initBricks = () => {
    const bricks = [];
    const rows = 4;
    const cols = 6;
    const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        bricks.push({
          x: 16 + c * 38,
          y: 20 + r * 14,
          w: 34,
          h: 10,
          color: colors[r],
          alive: true,
        });
      }
    }
    return bricks;
  };

  const restart = () => {
    stateRef.current = {
      paddleX: 108,
      paddleW: 44,
      ballX: 130,
      ballY: 140,
      ballVx: 1.8,
      ballVy: -2.0,
      speedFactor: 1.0,
      score: 0,
      started: false,
      won: false,
      gameOver: false,
      bricks: initBricks(),
      keys: { left: false, right: false },
    };
    particlesRef.current = [];
    setScore(0);
    setBricksLeft(24);
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

    const loop = () => {
      const s = stateRef.current;

      // Allow paddle to move faster as the ball moves faster!
      const pSpeed = 3.8 * Math.sqrt(s.speedFactor);
      if (s.keys.left) s.paddleX = Math.max(4, s.paddleX - pSpeed);
      if (s.keys.right) s.paddleX = Math.min(260 - s.paddleW - 4, s.paddleX + pSpeed);

      if (s.started && !s.gameOver && !s.won) {
        s.ballX += s.ballVx;
        s.ballY += s.ballVy;

        // Bounce walls
        if (s.ballX <= 4 || s.ballX >= 256) {
          s.ballVx = -s.ballVx;
          sounds.playBlip(400);
        }
        if (s.ballY <= 4) {
          s.ballVy = -s.ballVy;
          sounds.playBlip(400);
        }

        // Bounce paddle
        if (
          s.ballY >= 170 &&
          s.ballY <= 178 &&
          s.ballX >= s.paddleX &&
          s.ballX <= s.paddleX + s.paddleW
        ) {
          s.ballVy = -Math.abs(s.ballVy);
          const offset = (s.ballX - (s.paddleX + s.paddleW / 2)) / (s.paddleW / 2);
          s.ballVx = offset * (2.2 * s.speedFactor);
          sounds.playBlip(520);
        }

        // NO EXTRA LIVES: If ball drops below paddle, IMMEDIATE GAME OVER!
        if (s.ballY > 195) {
          s.gameOver = true;
          setGameOver(true);
          sounds.playFail();
        }

        // Check brick collisions
        for (const b of s.bricks) {
          if (b.alive) {
            if (
              s.ballX >= b.x &&
              s.ballX <= b.x + b.w &&
              s.ballY >= b.y &&
              s.ballY <= b.y + b.h
            ) {
              b.alive = false;
              s.ballVy = -s.ballVy;
              s.score += 10;
              setScore(s.score);

              // PROGRESSIVE SPEED DIFFICULTY: Gentler scaling (+1.5% compound) capped at 1.45x for high playability
              const prevSpeed = s.speedFactor;
              s.speedFactor = Math.min(1.45, s.speedFactor * 1.015);
              const speedRatio = s.speedFactor / prevSpeed;
              s.ballVx *= speedRatio;
              s.ballVy *= speedRatio;
              setSpeedVal(`${s.speedFactor.toFixed(1)}x`);

              // Particle explosion effect!
              spawnParticles(b.x + b.w / 2, b.y + b.h / 2, b.color);
              sounds.playBlip(680);
              break;
            }
          }
        }

        // Win condition: All bricks must be eliminated!
        const remaining = s.bricks.filter((b) => b.alive).length;
        setBricksLeft(remaining);
        if (remaining === 0) {
          s.won = true;
          setWon(true);
          sounds.playSuccess();
          setTimeout(() => onSuccessRef.current(), 750);
        }
      }

      // Draw Arena
      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, 260, 200);

      // Draw Bricks
      for (const b of s.bricks) {
        if (b.alive) {
          ctx.fillStyle = b.color;
          ctx.fillRect(b.x, b.y, b.w, b.h);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.fillRect(b.x + 1, b.y + 1, b.w - 2, 2);
        }
      }

      // Draw Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life += 1;

        const alpha = Math.max(0, 1 - p.life / p.maxLife);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        ctx.globalAlpha = 1.0;

        if (p.life >= p.maxLife) {
          particlesRef.current.splice(i, 1);
        }
      }

      // Paddle
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(s.paddleX, 174, s.paddleW, 8);
      ctx.fillStyle = '#bae6fd';
      ctx.fillRect(s.paddleX + 2, 175, s.paddleW - 4, 2);

      // Ball with prominent glow during particle explosions
      const hasParticles = particlesRef.current.length > 0;
      if (hasParticles) {
        // High visibility radiant halo
        ctx.save();
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 18;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(s.ballX, s.ballY, 7.5, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(s.ballX, s.ballY, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(s.ballX, s.ballY, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(s.ballX - 1, s.ballY - 1, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const restartRef = useRef(restart);
  restartRef.current = restart;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) stateRef.current.keys.left = true;
      if (['ArrowRight', 'KeyD'].includes(e.code)) stateRef.current.keys.right = true;
      if (['Space', 'Enter'].includes(e.code)) {
        e.preventDefault();
        if (stateRef.current.gameOver && !stateRef.current.won) {
          restartRef.current();
        } else {
          stateRef.current.started = true;
        }
      }
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
    <div className="flex flex-col items-center select-none font-pixel w-full max-w-[580px]">
      <div className="flex justify-between items-center w-full mb-2 text-xs sm:text-sm px-1">
        <span className="text-amber-400 font-bold">SCORE: {score}</span>
        <span className="text-cyan-400 font-mono text-[10px] sm:text-xs font-bold">BRICKS LEFT: {bricksLeft}/24</span>
        <span className="text-yellow-400 font-mono text-[10px] sm:text-xs">SPEED: {speedVal}</span>
        <span className="text-rose-400 text-[10px] sm:text-xs font-mono">1 LIFE</span>
      </div>

      <div
        onClick={() => { stateRef.current.started = true; }}
        className="relative border-4 border-slate-700 shadow-2xl bg-black cursor-pointer touch-none w-full flex justify-center overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          width={260}
          height={200}
          className="pixelated block touch-none w-full max-w-[560px] aspect-[260/200] object-contain"
          onTouchStart={(e) => {
            stateRef.current.started = true;
            if (e.touches[0] && canvasRef.current) {
              const rect = canvasRef.current.getBoundingClientRect();
              const scaleX = canvasRef.current.width / rect.width;
              const x = (e.touches[0].clientX - rect.left) * scaleX;
              stateRef.current.paddleX = Math.max(4, Math.min(260 - stateRef.current.paddleW - 4, x - stateRef.current.paddleW / 2));
            }
          }}
          onTouchMove={(e) => {
            if (e.touches[0] && canvasRef.current) {
              const rect = canvasRef.current.getBoundingClientRect();
              const scaleX = canvasRef.current.width / rect.width;
              const x = (e.touches[0].clientX - rect.left) * scaleX;
              stateRef.current.paddleX = Math.max(4, Math.min(260 - stateRef.current.paddleW - 4, x - stateRef.current.paddleW / 2));
            }
          }}
          onMouseMove={(e) => {
            if (e.buttons === 1 && canvasRef.current) {
              const rect = canvasRef.current.getBoundingClientRect();
              const scaleX = canvasRef.current.width / rect.width;
              const x = (e.clientX - rect.left) * scaleX;
              stateRef.current.paddleX = Math.max(4, Math.min(260 - stateRef.current.paddleW - 4, x - stateRef.current.paddleW / 2));
            }
          }}
        />

        {won && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center border-2 border-emerald-400 p-4 animate-in fade-in">
            <span className="text-emerald-400 text-sm sm:text-base mb-1 font-bold">★ WALL BREACHED! ★</span>
            <span className="text-xs text-slate-300 mb-3">All security bricks shattered!</span>
            <button
              onClick={() => onSuccessRef.current()}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs sm:text-sm font-bold border-2 border-white cursor-pointer active:translate-y-0.5 shadow-lg"
            >
              CLAIM REWARD NOW
            </button>
          </div>
        )}

        {gameOver && !won && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center border-2 border-red-500 p-4">
            <span className="text-red-400 text-sm sm:text-base mb-1 font-bold">BALL DROPPED!</span>
            <span className="text-[10px] text-slate-300 mb-3">Single-life challenge. Ball accelerates on every hit.</span>
            <button
              onClick={restart}
              className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs border-2 border-white cursor-pointer active:translate-y-0.5"
            >
              TRY AGAIN [SPACE]
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-3 w-full justify-center">
        <button
          onClick={() => { stateRef.current.paddleX = Math.max(4, stateRef.current.paddleX - 25); }}
          className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border-2 border-slate-600 text-xs sm:text-sm cursor-pointer active:bg-slate-600"
        >
          ◀ LEFT
        </button>
        <button
          onClick={() => { stateRef.current.started = true; }}
          className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs sm:text-sm border-2 border-white cursor-pointer active:translate-y-0.5"
        >
          LAUNCH [SPACE]
        </button>
        <button
          onClick={() => { stateRef.current.paddleX = Math.min(212, stateRef.current.paddleX + 25); }}
          className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border-2 border-slate-600 text-xs sm:text-sm cursor-pointer active:bg-slate-600"
        >
          RIGHT ▶
        </button>
      </div>
      <p className="text-[10px] sm:text-xs text-slate-400 mt-2 text-center">
        No extra lives • Every brick hit increases ball velocity!
      </p>
    </div>
  );
};
