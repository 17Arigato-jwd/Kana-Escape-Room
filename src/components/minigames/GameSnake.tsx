import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sounds } from '../../utils/audio';

interface GameSnakeProps {
  onSuccess: () => void;
  onFailure?: () => void;
  targetFood?: number;
}

const GRID_SIZE = 12;

export const GameSnake: React.FC<GameSnakeProps> = ({ onSuccess, targetFood = 10 }) => {
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([
    { x: 5, y: 6 },
    { x: 4, y: 6 },
    { x: 3, y: 6 }
  ]);
  const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const [food, setFood] = useState<{ x: number; y: number }>({ x: 8, y: 6 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const dirRef = useRef(direction);
  dirRef.current = direction;

  const spawnFood = (currentSnake: { x: number; y: number }[]) => {
    let newPos: { x: number; y: number };
    while (true) {
      newPos = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      const onSnake = currentSnake.some((s) => s.x === newPos.x && s.y === newPos.y);
      if (!onSnake) break;
    }
    return newPos;
  };

  const restart = () => {
    setWon(false);
    setGameOver(false);
    setScore(0);
    const initialSnake = [
      { x: 5, y: 6 },
      { x: 4, y: 6 },
      { x: 3, y: 6 }
    ];
    setSnake(initialSnake);
    setDirection('RIGHT');
    setFood(spawnFood(initialSnake));
  };

  // Dedicated win trigger
  useEffect(() => {
    if (won) return;
    if (score >= targetFood) {
      setWon(true);
      sounds.playSuccess();
      const timer = setTimeout(() => {
        onSuccess();
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [score, targetFood, won, onSuccess]);

  const changeDirection = useCallback((newDir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    const cur = dirRef.current;
    if (newDir === 'UP' && cur !== 'DOWN') setDirection('UP');
    if (newDir === 'DOWN' && cur !== 'UP') setDirection('DOWN');
    if (newDir === 'LEFT' && cur !== 'RIGHT') setDirection('LEFT');
    if (newDir === 'RIGHT' && cur !== 'LEFT') setDirection('RIGHT');
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        changeDirection('UP');
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        changeDirection('DOWN');
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        changeDirection('LEFT');
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        changeDirection('RIGHT');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeDirection]);

  // Main game tick
  useEffect(() => {
    if (gameOver || won) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };
        const curDir = dirRef.current;

        if (curDir === 'UP') head.y -= 1;
        if (curDir === 'DOWN') head.y += 1;
        if (curDir === 'LEFT') head.x -= 1;
        if (curDir === 'RIGHT') head.x += 1;

        // Check Wall Collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true);
          sounds.playFail();
          return prevSnake;
        }

        // Check Self Collision
        if (prevSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          sounds.playFail();
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Check Food
        if (head.x === food.x && head.y === food.y) {
          sounds.playBlip(620);
          setScore((s) => s + 1);
          setFood(spawnFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, Math.max(110, 145 - score * 2.5));

    return () => clearInterval(interval);
  }, [gameOver, won, food, score]);

  return (
    <div className="flex flex-col items-center select-none font-pixel">
      <div className="flex justify-between items-center w-72 mb-2 text-xs">
        <span className="text-emerald-400">APPLES: {score}/{targetFood}</span>
        <span className="text-amber-300 text-[10px]">FEED SERPENT</span>
      </div>

      <div className="relative bg-slate-950 p-2 border-4 border-slate-700 shadow-2xl">
        <div
          className="grid gap-0.5 bg-slate-900 border-2 border-slate-800"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1.25rem)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1.25rem)`
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
            const x = idx % GRID_SIZE;
            const y = Math.floor(idx / GRID_SIZE);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isBody = snake.slice(1).some((s) => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={idx}
                className={`w-5 h-5 flex items-center justify-center ${
                  isHead
                    ? 'bg-emerald-400 border border-white'
                    : isBody
                    ? 'bg-emerald-600 border border-emerald-500'
                    : isFood
                    ? 'bg-red-500 rounded-full animate-pulse border border-yellow-300'
                    : (x + y) % 2 === 0
                    ? 'bg-slate-900'
                    : 'bg-slate-850'
                }`}
              >
                {isHead && <div className="w-1 h-1 bg-black rounded-full" />}
              </div>
            );
          })}
        </div>

        {won && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center border-2 border-emerald-400 p-3 animate-in fade-in duration-200">
            <span className="text-emerald-400 text-sm mb-1 font-bold">★ SERPENT SATED! ★</span>
            <span className="text-[10px] text-slate-300 mb-3">Collected {score} apples!</span>
            <button
              onClick={() => onSuccess()}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold border-2 border-white cursor-pointer active:translate-y-0.5 shadow-lg"
            >
              CLAIM REWARD NOW
            </button>
          </div>
        )}

        {gameOver && !won && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center border-2 border-red-500">
            <span className="text-red-400 text-xs mb-3">SERPENT CRASHED!</span>
            <button
              onClick={restart}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-[10px] border-2 border-white cursor-pointer active:translate-y-0.5"
            >
              RESTART
            </button>
          </div>
        )}
      </div>

      {/* D-Pad Buttons */}
      <div className="mt-3 flex flex-col items-center gap-1">
        <button
          onClick={() => changeDirection('UP')}
          className="w-12 h-8 bg-slate-800 hover:bg-slate-700 text-slate-200 border-2 border-slate-600 text-xs cursor-pointer active:bg-slate-600"
        >
          ▲
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => changeDirection('LEFT')}
            className="w-12 h-8 bg-slate-800 hover:bg-slate-700 text-slate-200 border-2 border-slate-600 text-xs cursor-pointer active:bg-slate-600"
          >
            ◀
          </button>
          <button
            onClick={() => changeDirection('DOWN')}
            className="w-12 h-8 bg-slate-800 hover:bg-slate-700 text-slate-200 border-2 border-slate-600 text-xs cursor-pointer active:bg-slate-600"
          >
            ▼
          </button>
          <button
            onClick={() => changeDirection('RIGHT')}
            className="w-12 h-8 bg-slate-800 hover:bg-slate-700 text-slate-200 border-2 border-slate-600 text-xs cursor-pointer active:bg-slate-600"
          >
            ▶
          </button>
        </div>
      </div>
      <p className="text-[10px] text-slate-400 mt-2">Arrow Keys / WASD or D-Pad</p>
    </div>
  );
};
