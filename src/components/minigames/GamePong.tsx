import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../../utils/audio';

interface GamePongProps {
  onSuccess: () => void;
  onFailure?: () => void;
  targetPoints?: number;
}

export const GamePong: React.FC<GamePongProps> = ({ onSuccess, targetPoints = 3 }) => {
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [speedMultiplier, setSpeedMultiplier] = useState(1.0);
  const [exchanges, setExchanges] = useState(0);
  const [won, setWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const targetPointsRef = useRef(targetPoints);
  targetPointsRef.current = targetPoints;

  const stateRef = useRef({
    playerY: 80,
    aiY: 80,
    paddleH: 36,
    paddleW: 6,
    ballX: 130,
    ballY: 100,
    ballVx: -2.0,
    ballVy: 1.2,
    baseSpeed: 2.0,
    hits: 0,
    exchanges: 0,
    playerScore: 0,
    aiScore: 0,
    won: false,
    gameOver: false,
    keys: { up: false, down: false },
  });

  const resetBall = (towardsPlayer: boolean) => {
    const s = stateRef.current;
    s.ballX = 130;
    s.ballY = 100;
    s.hits = 0;
    s.exchanges = 0;
    setExchanges(0);
    const speed = 2.0;
    s.ballVx = towardsPlayer ? -speed : speed;
    s.ballVy = (Math.random() - 0.5) * 2.5;
    setSpeedMultiplier(1.0);
  };

  const restart = () => {
    stateRef.current.playerScore = 0;
    stateRef.current.aiScore = 0;
    stateRef.current.won = false;
    stateRef.current.gameOver = false;
    stateRef.current.exchanges = 0;
    setPlayerScore(0);
    setAiScore(0);
    setExchanges(0);
    setWon(false);
    setGameOver(false);
    resetBall(true);
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

      // Player input
      if (s.keys.up) s.playerY = Math.max(4, s.playerY - 3.5);
      if (s.keys.down) s.playerY = Math.min(200 - s.paddleH - 4, s.playerY + 3.5);

      // AI movement logic: 5% compounding speed reduction per exchange!
      const baseAiSpeed = 2.85;
      const currentAiSpeed = baseAiSpeed * Math.pow(0.95, s.exchanges);

      const aiCenter = s.aiY + s.paddleH / 2;
      const targetAiY = s.ballY + s.ballVy * 4;

      if (aiCenter < targetAiY - 2) {
        s.aiY = Math.min(200 - s.paddleH - 4, s.aiY + currentAiSpeed);
      } else if (aiCenter > targetAiY + 2) {
        s.aiY = Math.max(4, s.aiY - currentAiSpeed);
      }

      if (!s.won && !s.gameOver) {
        s.ballX += s.ballVx;
        s.ballY += s.ballVy;

        // Top/Bottom walls
        if (s.ballY <= 4) {
          s.ballY = 4;
          s.ballVy = Math.abs(s.ballVy);
          sounds.playBlip(400);
        } else if (s.ballY >= 196) {
          s.ballY = 196;
          s.ballVy = -Math.abs(s.ballVy);
          sounds.playBlip(400);
        }

        // Left Paddle (Player) collision
        if (
          s.ballX <= 18 &&
          s.ballX >= 10 &&
          s.ballY >= s.playerY - 2 &&
          s.ballY <= s.playerY + s.paddleH + 2
        ) {
          s.hits += 1;
          // Each exchange between player and AI reduces AI speed by 5% compounding (in background)!
          s.exchanges += 1;
          setExchanges(s.exchanges);

          const factor = 1 + s.hits * 0.1;
          setSpeedMultiplier(factor);

          const offset = (s.ballY - (s.playerY + s.paddleH / 2)) / (s.paddleH / 2);
          s.ballVx = Math.abs(s.baseSpeed * factor);
          s.ballVy = offset * (2.0 * factor);
          sounds.playBlip(620);
        }

        // Right Paddle (AI) collision
        if (
          s.ballX >= 242 &&
          s.ballX <= 250 &&
          s.ballY >= s.aiY - 2 &&
          s.ballY <= s.aiY + s.paddleH + 2
        ) {
          s.hits += 1;
          const factor = 1 + s.hits * 0.1;
          setSpeedMultiplier(factor);

          const offset = (s.ballY - (s.aiY + s.paddleH / 2)) / (s.paddleH / 2);
          s.ballVx = -Math.abs(s.baseSpeed * factor);
          s.ballVy = offset * (2.0 * factor);
          sounds.playBlip(520);
        }

        // Left Out -> AI scores
        if (s.ballX < 0) {
          s.aiScore += 1;
          setAiScore(s.aiScore);
          sounds.playFail();

          if (s.aiScore >= 3) {
            s.gameOver = true;
            setGameOver(true);
          } else {
            resetBall(true);
          }
        }

        // Right Out -> Player scores!
        if (s.ballX > 260) {
          s.playerScore += 1;
          setPlayerScore(s.playerScore);
          sounds.playSuccess();

          if (s.playerScore >= targetPointsRef.current) {
            s.won = true;
            setWon(true);
            setTimeout(() => onSuccessRef.current(), 750);
          } else {
            resetBall(false);
          }
        }
      }

      // Draw Arena
      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, 260, 200);

      // Center Dotted Line
      ctx.strokeStyle = '#1e293b';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(130, 0);
      ctx.lineTo(130, 200);
      ctx.stroke();
      ctx.setLineDash([]);

      // Player Paddle
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(12, s.playerY, s.paddleW, s.paddleH);

      // AI Paddle
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(242, s.aiY, s.paddleW, s.paddleH);

      // Ball
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(s.ballX, s.ballY, 4, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) stateRef.current.keys.up = true;
      if (['ArrowDown', 'KeyS'].includes(e.code)) stateRef.current.keys.down = true;
      if (['Space', 'Enter'].includes(e.code) && gameOver) restart();
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) stateRef.current.keys.up = false;
      if (['ArrowDown', 'KeyS'].includes(e.code)) stateRef.current.keys.down = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameOver]);

  return (
    <div className="flex flex-col items-center select-none font-pixel w-full max-w-xs">
      <div className="flex justify-between items-center w-full mb-2 text-xs">
        <span className="text-cyan-400">YOU: {playerScore}/{targetPoints}</span>
        <span className="text-amber-300 text-[10px] font-mono font-bold tracking-wider">
          SPEED: {speedMultiplier <= 1 ? '1x' : `${speedMultiplier.toFixed(1)}x`}
        </span>
        <span className="text-rose-400">AI: {aiScore}/{targetPoints}</span>
      </div>

      <div className="relative bg-slate-950 p-2 border-4 border-slate-700 shadow-2xl">
        <canvas ref={canvasRef} width={260} height={200} className="block" />

        {won && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center border-2 border-emerald-400 p-4 animate-in fade-in">
            <span className="text-emerald-400 text-sm mb-1 font-bold">★ PONG CHAMPION! ★</span>
            <span className="text-[10px] text-slate-300 mb-3">AI servo speed steadily outpaced!</span>
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
            <span className="text-red-400 text-xs mb-3 font-bold">MATCH LOST</span>
            <button
              onClick={restart}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-[10px] border-2 border-white cursor-pointer"
            >
              TRY AGAIN [SPACE]
            </button>
          </div>
        )}
      </div>

      {/* Touch Controls */}
      <div className="flex gap-4 mt-3">
        <button
          onMouseDown={() => { stateRef.current.keys.up = true; }}
          onMouseUp={() => { stateRef.current.keys.up = false; }}
          onTouchStart={() => { stateRef.current.keys.up = true; }}
          onTouchEnd={() => { stateRef.current.keys.up = false; }}
          className="px-5 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 border border-slate-600 text-xs cursor-pointer"
        >
          ▲ UP
        </button>
        <button
          onMouseDown={() => { stateRef.current.keys.down = true; }}
          onMouseUp={() => { stateRef.current.keys.down = false; }}
          onTouchStart={() => { stateRef.current.keys.down = true; }}
          onTouchEnd={() => { stateRef.current.keys.down = false; }}
          className="px-5 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 border border-slate-600 text-xs cursor-pointer"
        >
          ▼ DOWN
        </button>
      </div>

      <p className="text-[9px] text-slate-400 mt-2 text-center">
        W/S or Up/Down • Ball accelerates on each exchange!
      </p>
    </div>
  );
};
