import React, { useState, useEffect, useCallback, useRef } from 'react';
import { sounds } from '../../utils/audio';

interface Game2048Props {
  onSuccess: () => void;
  onFailure?: () => void;
}

const TARGET_TILE = 256;
const TILE_SIZE = 48;
const GAP = 8;

interface TileItem {
  id: number;
  val: number;
  r: number;
  c: number;
  merged?: boolean;
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

let nextTileId = 1;

export const Game2048: React.FC<Game2048Props> = ({ onSuccess }) => {
  const [tiles, setTiles] = useState<TileItem[]>(() => initTiles());
  const [score, setScore] = useState(0);
  const [won, setWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  function initTiles(): TileItem[] {
    const list: TileItem[] = [];
    const occupied = new Set<string>();

    const addOne = () => {
      const empty: { r: number; c: number }[] = [];
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (!occupied.has(`${r},${c}`)) empty.push({ r, c });
        }
      }
      if (empty.length === 0) return;
      const pick = empty[Math.floor(Math.random() * empty.length)];
      occupied.add(`${pick.r},${pick.c}`);
      list.push({
        id: nextTileId++,
        val: Math.random() < 0.9 ? 2 : 4,
        r: pick.r,
        c: pick.c,
      });
    };

    addOne();
    addOne();
    return list;
  }

  const maxTile = tiles.reduce((max, t) => Math.max(max, t.val), 0);

  const spawnParticles = (x: number, y: number, color: string, count = 12, speed = 3.5) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = (Math.random() * 0.7 + 0.3) * speed;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        life: 0,
        maxLife: 20 + Math.random() * 15,
        color,
        size: Math.random() * 3 + 2,
      });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const loop = () => {
      ctx.clearRect(0, 0, 240, 240);

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

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    if (won) return;
    if (maxTile >= TARGET_TILE) {
      setWon(true);
      sounds.playSuccess();
      const timer = setTimeout(() => {
        onSuccess();
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [maxTile, won, onSuccess]);

  const move = useCallback(
    (dir: 'up' | 'down' | 'left' | 'right') => {
      if (won || gameOver) return;

      setTiles((prevTiles) => {
        // Build 4x4 matrix of tile objects
        const grid: (TileItem | null)[][] = Array(4)
          .fill(null)
          .map(() => Array(4).fill(null));

        prevTiles.forEach((t) => {
          grid[t.r][t.c] = { ...t, merged: false };
        });

        let changed = false;
        let addedScore = 0;
        const newTiles: TileItem[] = [];

        // Slide logic along lines
        const isHorizontal = dir === 'left' || dir === 'right';
        const isReverse = dir === 'right' || dir === 'down';

        for (let i = 0; i < 4; i++) {
          const line: (TileItem | null)[] = [];
          for (let j = 0; j < 4; j++) {
            const r = isHorizontal ? i : j;
            const c = isHorizontal ? j : i;
            line.push(grid[r][c]);
          }

          if (isReverse) line.reverse();

          // Compact line
          const filtered = line.filter((x): x is TileItem => x !== null);
          const compact: TileItem[] = [];

          let idx = 0;
          while (idx < filtered.length) {
            const current = filtered[idx];
            const next = filtered[idx + 1];

            if (next && current.val === next.val) {
              // Merge!
              const mergedVal = current.val * 2;
              addedScore += mergedVal;
              compact.push({
                ...current,
                val: mergedVal,
                merged: true,
              });
              idx += 2; // consumed both
            } else {
              compact.push(current);
              idx += 1;
            }
          }

          // Assign back coordinates
          for (let pos = 0; pos < compact.length; pos++) {
            const item = compact[pos];
            const targetPos = isReverse ? 3 - pos : pos;
            const targetR = isHorizontal ? i : targetPos;
            const targetC = isHorizontal ? targetPos : i;

            if (item.r !== targetR || item.c !== targetC || item.merged) {
              changed = true;
            }

            if (item.merged) {
              // Spawn merge particles
              const px = targetC * (TILE_SIZE + GAP) + TILE_SIZE / 2;
              const py = targetR * (TILE_SIZE + GAP) + TILE_SIZE / 2;
              spawnParticles(px, py, '#facc15', 18, 4.2);
              sounds.playKanaObtained();
            }

            newTiles.push({
              ...item,
              r: targetR,
              c: targetC,
            });
          }
        }

        if (changed) {
          // Add 1 random new tile in open slot
          const occupied = new Set(newTiles.map((t) => `${t.r},${t.c}`));
          const emptySlots: { r: number; c: number }[] = [];
          for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
              if (!occupied.has(`${r},${c}`)) emptySlots.push({ r, c });
            }
          }

          if (emptySlots.length > 0) {
            const pick = emptySlots[Math.floor(Math.random() * emptySlots.length)];
            newTiles.push({
              id: nextTileId++,
              val: Math.random() < 0.9 ? 2 : 4,
              r: pick.r,
              c: pick.c,
            });
          }

          setScore((s) => s + addedScore);
          sounds.playSelect();
        } else {
          // Wall impact sparks
          sounds.playBlip(320);
          if (dir === 'left') spawnParticles(10, 116, '#ef4444', 10, 2.5);
          if (dir === 'right') spawnParticles(222, 116, '#ef4444', 10, 2.5);
          if (dir === 'up') spawnParticles(116, 10, '#ef4444', 10, 2.5);
          if (dir === 'down') spawnParticles(116, 222, '#ef4444', 10, 2.5);
        }

        // Check Game Over
        if (newTiles.length === 16) {
          let canMove = false;
          const boardMap: number[][] = Array(4)
            .fill(0)
            .map(() => Array(4).fill(0));
          newTiles.forEach((t) => {
            boardMap[t.r][t.c] = t.val;
          });

          for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
              if (r < 3 && boardMap[r][c] === boardMap[r + 1][c]) canMove = true;
              if (c < 3 && boardMap[r][c] === boardMap[r][c + 1]) canMove = true;
            }
          }
          if (!canMove) {
            setGameOver(true);
            sounds.playFail();
          }
        }

        return newTiles;
      });
    },
    [won, gameOver]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        move('up');
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        move('down');
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        move('left');
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        move('right');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  const getTileStyle = (val: number) => {
    switch (val) {
      case 2:
        return 'bg-[#eee4da] text-[#776e65]';
      case 4:
        return 'bg-[#ede0c8] text-[#776e65]';
      case 8:
        return 'bg-[#f2b179] text-[#f9f6f2] shadow-sm';
      case 16:
        return 'bg-[#f59563] text-[#f9f6f2] shadow-md';
      case 32:
        return 'bg-[#f67c5f] text-[#f9f6f2] shadow-md';
      case 64:
        return 'bg-[#f65e3b] text-[#f9f6f2] shadow-lg';
      case 128:
        return 'bg-[#edcf72] text-[#f9f6f2] text-sm shadow-[0_0_12px_rgba(237,207,114,0.6)]';
      case 256:
        return 'bg-[#edcc61] text-[#f9f6f2] text-sm shadow-[0_0_18px_rgba(237,204,97,0.9)] animate-pulse';
      default:
        return 'bg-[#3c3a32] text-[#f9f6f2] text-xs';
    }
  };

  const restart = () => {
    setTiles(initTiles());
    setScore(0);
    setWon(false);
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center select-none font-pixel w-full max-w-xs">
      <div className="flex justify-between items-center w-full mb-2 text-xs">
        <span className="text-amber-400">SCORE: {score}</span>
        <span className="text-yellow-300 font-mono text-[10px]">GOAL: {TARGET_TILE} TILE</span>
        <span className="text-cyan-400">MAX: {maxTile}</span>
      </div>

      <div className="relative bg-[#bbada0] p-2 rounded-lg border-4 border-slate-700 shadow-2xl">
        <canvas
          ref={canvasRef}
          width={232}
          height={232}
          className="absolute inset-0 pointer-events-none z-30"
        />

        {/* 4x4 Background Grid Slots */}
        <div className="relative w-[232px] h-[232px] bg-[#cdc1b4] p-2 rounded-md overflow-hidden">
          {Array.from({ length: 16 }).map((_, i) => {
            const r = Math.floor(i / 4);
            const c = i % 4;
            return (
              <div
                key={i}
                className="absolute w-12 h-12 rounded bg-[#cdc1b4]/40"
                style={{
                  left: `${c * (TILE_SIZE + GAP)}px`,
                  top: `${r * (TILE_SIZE + GAP)}px`,
                }}
              />
            );
          })}

          {/* Active Sliding Numbered Blocks */}
          {tiles.map((tile) => (
            <div
              key={tile.id}
              className={`absolute w-12 h-12 rounded flex items-center justify-center font-bold text-base shadow-sm ${getTileStyle(
                tile.val
              )}`}
              style={{
                transform: `translate(${tile.c * (TILE_SIZE + GAP)}px, ${tile.r * (TILE_SIZE + GAP)}px)`,
                transition: 'transform 130ms cubic-bezier(0.25, 1, 0.5, 1)',
              }}
            >
              {tile.val}
            </div>
          ))}
        </div>

        {won && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center rounded-lg border-2 border-emerald-400 p-4 animate-in fade-in z-40">
            <span className="text-emerald-400 text-sm mb-1 font-bold">★ 256 TILE FORGED! ★</span>
            <span className="text-[10px] text-slate-300 mb-3">Mathematical synthesis complete!</span>
            <button
              onClick={() => onSuccess()}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold border-2 border-white cursor-pointer shadow-lg"
            >
              CLAIM REWARD NOW
            </button>
          </div>
        )}

        {gameOver && !won && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center rounded-lg border-2 border-red-500 p-4 z-40">
            <span className="text-red-400 text-xs mb-3">NO MOVES REMAINING</span>
            <button
              onClick={restart}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-[10px] border-2 border-white cursor-pointer"
            >
              TRY AGAIN
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-1.5 mt-3 w-44">
        <div />
        <button
          onClick={() => move('up')}
          className="p-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 border border-slate-600 text-xs cursor-pointer flex justify-center"
        >
          ▲
        </button>
        <div />
        <button
          onClick={() => move('left')}
          className="p-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 border border-slate-600 text-xs cursor-pointer flex justify-center"
        >
          ◀
        </button>
        <button
          onClick={() => move('down')}
          className="p-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 border border-slate-600 text-xs cursor-pointer flex justify-center"
        >
          ▼
        </button>
        <button
          onClick={() => move('right')}
          className="p-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 border border-slate-600 text-xs cursor-pointer flex justify-center"
        >
          ▶
        </button>
      </div>
      <p className="text-[9px] text-slate-400 mt-2 text-center">
        Arrow Keys [W/A/S/D] • True sliding block animations • Reach 256!
      </p>
    </div>
  );
};
