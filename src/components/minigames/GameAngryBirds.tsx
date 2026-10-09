import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sounds } from '../../utils/audio';

interface GameAngryBirdsProps {
  onSuccess: () => void;
  onFailure?: () => void;
}

export const GameAngryBirds: React.FC<GameAngryBirdsProps> = ({ onSuccess }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [shotsLeft, setShotsLeft] = useState(3);
  const [targetsLeft, setTargetsLeft] = useState(3);
  const [won, setWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const stateRef = useRef({
    slingX: 50,
    slingY: 135,
    dragging: false,
    dragX: 50,
    dragY: 135,
    projectile: { x: 50, y: 135, vx: 0, vy: 0, active: false },
    targets: [
      { x: 190, y: 140, w: 16, h: 20, alive: true },
      { x: 215, y: 120, w: 16, h: 40, alive: true },
      { x: 240, y: 130, w: 16, h: 30, alive: true },
    ],
    shots: 3,
    won: false,
    gameOver: false,
  });

  const restart = () => {
    stateRef.current = {
      slingX: 50,
      slingY: 135,
      dragging: false,
      dragX: 50,
      dragY: 135,
      projectile: { x: 50, y: 135, vx: 0, vy: 0, active: false },
      targets: [
        { x: 190, y: 140, w: 16, h: 20, alive: true },
        { x: 215, y: 120, w: 16, h: 40, alive: true },
        { x: 240, y: 130, w: 16, h: 30, alive: true },
      ],
      shots: 3,
      won: false,
      gameOver: false,
    };
    setShotsLeft(3);
    setTargetsLeft(3);
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
    const gravity = 0.22;

    const loop = () => {
      const s = stateRef.current;
      const p = s.projectile;

      // Update projectile physics
      if (p.active) {
        p.vy += gravity;
        p.x += p.vx;
        p.y += p.vy;

        // Check target collision
        for (const t of s.targets) {
          if (t.alive) {
            if (p.x >= t.x && p.x <= t.x + t.w && p.y >= t.y && p.y <= t.y + t.h) {
              t.alive = false;
              sounds.playKanaObtained();
              const remaining = s.targets.filter((x) => x.alive).length;
              setTargetsLeft(remaining);

              if (remaining === 0) {
                s.won = true;
                setWon(true);
                sounds.playSuccess();
                setTimeout(() => onSuccessRef.current(), 750);
              }
            }
          }
        }

        // Ground / offscreen
        if (p.y > 175 || p.x > 270) {
          p.active = false;
          p.x = s.slingX;
          p.y = s.slingY;
          s.shots -= 1;
          setShotsLeft(s.shots);

          const remaining = s.targets.filter((x) => x.alive).length;
          if (remaining > 0 && s.shots <= 0) {
            s.gameOver = true;
            setGameOver(true);
            sounds.playFail();
          }
        }
      }

      // Render
      ctx.fillStyle = '#1e1b4b'; // Night landscape
      ctx.fillRect(0, 0, 260, 200);

      // Ground
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 175, 260, 25);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(0, 175, 260, 2);

      // Slingshot frame
      ctx.fillStyle = '#78350f';
      ctx.fillRect(48, 140, 6, 35);
      ctx.fillRect(40, 130, 8, 12);
      ctx.fillRect(54, 130, 8, 12);

      // Slingshot elastic band
      if (s.dragging) {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(42, 132);
        ctx.lineTo(s.dragX, s.dragY);
        ctx.lineTo(58, 132);
        ctx.stroke();

        // Trajectory preview dots
        const pVx = (s.slingX - s.dragX) * 0.18;
        const pVy = (s.slingY - s.dragY) * 0.18;
        ctx.fillStyle = 'rgba(254, 240, 138, 0.6)';
        for (let i = 1; i <= 6; i++) {
          const predX = s.slingX + pVx * i * 3;
          const predY = s.slingY + pVy * i * 3 + 0.5 * gravity * Math.pow(i * 3, 2);
          ctx.fillRect(predX, predY, 2, 2);
        }
      }

      // Fortress Targets
      for (const t of s.targets) {
        if (t.alive) {
          ctx.fillStyle = '#b45309'; // Wood block
          ctx.fillRect(t.x, t.y, t.w, t.h);
          ctx.fillStyle = '#ef4444'; // Red target gem
          ctx.fillRect(t.x + 3, t.y + 4, t.w - 6, t.h - 8);
        }
      }

      // Projectile (Red bird/orb)
      const px = p.active ? p.x : s.dragging ? s.dragX : s.slingX;
      const py = p.active ? p.y : s.dragging ? s.dragY : s.slingY;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(px + 1, py - 2, 3, 3); // beak

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const updateDragFromCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mx = (clientX - rect.left) * scaleX;
    const my = (clientY - rect.top) * scaleY;

    // Constrain pull distance
    const dx = mx - stateRef.current.slingX;
    const dy = my - stateRef.current.slingY;
    const dist = Math.hypot(dx, dy);
    const maxDist = 40;

    if (dist > maxDist) {
      stateRef.current.dragX = stateRef.current.slingX + (dx / dist) * maxDist;
      stateRef.current.dragY = stateRef.current.slingY + (dy / dist) * maxDist;
    } else {
      stateRef.current.dragX = mx;
      stateRef.current.dragY = my;
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (stateRef.current.projectile.active || won || gameOver) return;
    stateRef.current.dragging = true;
    updateDragFromCoords(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (stateRef.current.projectile.active || won || gameOver) return;
    const touch = e.touches[0];
    if (!touch) return;
    stateRef.current.dragging = true;
    updateDragFromCoords(touch.clientX, touch.clientY);
  };

  const handleRelease = useCallback(() => {
    const s = stateRef.current;
    if (!s.dragging) return;
    s.dragging = false;

    // Launch
    const pVx = (s.slingX - s.dragX) * 0.18;
    const pVy = (s.slingY - s.dragY) * 0.18;

    s.projectile.x = s.slingX;
    s.projectile.y = s.slingY;
    s.projectile.vx = pVx;
    s.projectile.vy = pVy;
    s.projectile.active = true;
    sounds.playBlip(620);
  }, []);

  // Global window listeners so releasing outside canvas launches cleanly
  useEffect(() => {
    const onWindowMove = (e: MouseEvent) => {
      if (stateRef.current.dragging) {
        updateDragFromCoords(e.clientX, e.clientY);
      }
    };
    const onWindowTouchMove = (e: TouchEvent) => {
      if (stateRef.current.dragging && e.touches[0]) {
        updateDragFromCoords(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onWindowUp = () => {
      if (stateRef.current.dragging) {
        handleRelease();
      }
    };

    window.addEventListener('mousemove', onWindowMove);
    window.addEventListener('mouseup', onWindowUp);
    window.addEventListener('touchmove', onWindowTouchMove, { passive: true });
    window.addEventListener('touchend', onWindowUp);
    window.addEventListener('touchcancel', onWindowUp);

    return () => {
      window.removeEventListener('mousemove', onWindowMove);
      window.removeEventListener('mouseup', onWindowUp);
      window.removeEventListener('touchmove', onWindowTouchMove);
      window.removeEventListener('touchend', onWindowUp);
      window.removeEventListener('touchcancel', onWindowUp);
    };
  }, [handleRelease]);

  return (
    <div className="flex flex-col items-center select-none font-pixel w-full max-w-[580px]">
      <div className="flex justify-between items-center w-full mb-2 text-xs sm:text-sm px-1">
        <span className="text-cyan-400 font-bold">AMMO: {'🔴'.repeat(shotsLeft)}</span>
        <span className="text-rose-400 font-bold">TARGETS: {targetsLeft}</span>
      </div>

      <div className="relative border-4 border-slate-700 shadow-2xl bg-black cursor-crosshair touch-none w-full flex justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          width={260}
          height={200}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className="pixelated block touch-none w-full max-w-[560px] aspect-[260/200] object-contain"
        />

        {won && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center border-2 border-emerald-400 p-4 animate-in fade-in">
            <span className="text-emerald-400 text-sm sm:text-base mb-1 font-bold">★ FORTRESS TOPPLED! ★</span>
            <span className="text-xs text-slate-300 mb-3">All target blocks obliterated!</span>
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
            <span className="text-red-400 text-sm sm:text-base mb-3 font-bold">OUT OF SHOTS</span>
            <button
              onClick={restart}
              className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs border-2 border-white cursor-pointer active:translate-y-0.5"
            >
              TRY AGAIN
            </button>
          </div>
        )}
      </div>

      <p className="text-[10px] sm:text-xs text-slate-400 mt-2 text-center">
        Click and drag back the slingshot to aim trajectory, release to fire!
      </p>
    </div>
  );
};
