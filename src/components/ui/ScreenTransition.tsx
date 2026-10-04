import React, { useEffect, useRef, useState } from 'react';
import { sounds } from '../../utils/audio';

interface ScreenTransitionProps {
  active: boolean;
  roomName: string;
  roomNumber: number;
  targetIcon?: string;
  onMidpoint: () => void;
  onComplete: () => void;
}

export const ScreenTransition: React.FC<ScreenTransitionProps> = ({
  active,
  roomName,
  roomNumber,
  targetIcon,
  onMidpoint,
  onComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showTitleCard, setShowTitleCard] = useState(false);

  const onMidpointRef = useRef(onMidpoint);
  onMidpointRef.current = onMidpoint;

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!active) {
      setShowTitleCard(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas resolution to window dimensions
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);
    ctx.imageSmoothingEnabled = false;

    sounds.playRoomTransition();

    const BLOCK_SIZE = 20;
    const cols = Math.ceil(width / BLOCK_SIZE);
    const rows = Math.ceil(height / BLOCK_SIZE);
    const totalBlocks = cols * rows;

    // Pre-calculate pseudo-random threshold for each block (0.0 to 1.0)
    const blockThresholds = new Float32Array(totalBlocks);
    for (let i = 0; i < totalBlocks; i++) {
      const c = i % cols;
      const r = Math.floor(i / cols);
      // Combine pseudo-random noise with slight radial diamond factor
      const rand = Math.abs(Math.sin(c * 12.9898 + r * 78.233) * 43758.5453) % 1;
      const distFromCenter = Math.hypot(c - cols / 2, r - rows / 2) / Math.hypot(cols / 2, rows / 2);
      blockThresholds[i] = rand * 0.7 + distFromCenter * 0.3;
    }

    let animId: number;
    const startTime = performance.now();
    const DURATION_OUT = 400; // ms to dissolve to black
    const DURATION_HOLD = 250; // ms to show room title at full black
    const DURATION_IN = 400;  // ms to dissolve away to new room
    let midpointTriggered = false;

    const render = (now: number) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, width, height);

      if (elapsed < DURATION_OUT) {
        // Phase 1: Dissolve OUT to black
        const progress = elapsed / DURATION_OUT;
        ctx.fillStyle = '#0b0914';

        for (let i = 0; i < totalBlocks; i++) {
          if (blockThresholds[i] <= progress * 1.05) {
            const c = i % cols;
            const r = Math.floor(i / cols);
            ctx.fillRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE + 0.5, BLOCK_SIZE + 0.5);
          }
        }
      } else if (elapsed < DURATION_OUT + DURATION_HOLD) {
        // Phase 2: Full Black Screen + Room Title Card
        ctx.fillStyle = '#0b0914';
        ctx.fillRect(0, 0, width, height);

        if (!midpointTriggered) {
          midpointTriggered = true;
          setShowTitleCard(true);
          onMidpointRef.current();
        }
      } else if (elapsed < DURATION_OUT + DURATION_HOLD + DURATION_IN) {
        // Phase 3: Dissolve IN from black to unveil new room
        const inProgress = (elapsed - (DURATION_OUT + DURATION_HOLD)) / DURATION_IN;
        const progress = 1 - inProgress;
        ctx.fillStyle = '#0b0914';

        for (let i = 0; i < totalBlocks; i++) {
          if (blockThresholds[i] <= progress * 1.05) {
            const c = i % cols;
            const r = Math.floor(i / cols);
            ctx.fillRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE + 0.5, BLOCK_SIZE + 0.5);
          }
        }
      } else {
        // Complete
        ctx.clearRect(0, 0, width, height);
        setShowTitleCard(false);
        onCompleteRef.current();
        return;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none select-none flex items-center justify-center">
      {/* Pixel Dissolve Canvas Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Retro Room Title Banner during Midpoint */}
      {showTitleCard && (
        <div className="relative z-10 flex flex-col items-center justify-center p-6 bg-slate-950/80 border-4 border-yellow-400/90 shadow-2xl animate-in zoom-in-95 duration-200">
          <span className="font-pixel text-[11px] text-yellow-400 tracking-widest mb-1">
            ROOM {roomNumber}
          </span>
          <div className="text-4xl my-1">{targetIcon || '⛩️'}</div>
          <h1 className="font-pixel text-base sm:text-lg text-white font-bold tracking-wider mb-2">
            {roomName.toUpperCase()}
          </h1>
          <div className="w-32 h-0.5 bg-yellow-400/60 my-1" />
          <span className="font-pixel text-[9px] text-cyan-300 tracking-widest animate-pulse">
            ENTERING CHAMBER...
          </span>
        </div>
      )}
    </div>
  );
};
