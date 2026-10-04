import React, { useState, useRef } from 'react';
import { sounds } from '../../utils/audio';

interface GameTicTacToeProps {
  onSuccess: () => void;
  onFailure?: () => void;
}

type Cell = 'X' | 'O' | null;

export const GameTicTacToe: React.FC<GameTicTacToeProps> = ({ onSuccess }) => {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [gameCount, setGameCount] = useState(1);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [status, setStatus] = useState<string>('Match 1/5 — Align 3 in a row!');
  const [won, setWon] = useState(false);

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const gameCountRef = useRef(1);

  const checkWinner = (b: Cell[]): 'X' | 'O' | 'draw' | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (const [x, y, z] of lines) {
      if (b[x] && b[x] === b[y] && b[x] === b[z]) {
        return b[x];
      }
    }
    if (b.every((c) => c !== null)) return 'draw';
    return null;
  };

  const aiMove = (currentBoard: Cell[]) => {
    const currentGame = gameCountRef.current;
    const available: number[] = [];
    for (let i = 0; i < 9; i++) {
      if (!currentBoard[i]) available.push(i);
    }
    if (available.length === 0) return;

    let moveIndex = -1;

    // By games 2-5, AI becomes increasingly generous so player is guaranteed to win within 5 games!
    const shouldMakeMistake = currentGame >= 3 || Math.random() < (currentGame * 0.22);

    if (!shouldMakeMistake) {
      // 1. Check if AI can win immediately
      for (const idx of available) {
        currentBoard[idx] = 'O';
        if (checkWinner(currentBoard) === 'O') {
          moveIndex = idx;
          currentBoard[idx] = null;
          break;
        }
        currentBoard[idx] = null;
      }

      // 2. Check if player has 2 in a row to block
      if (moveIndex === -1 && currentGame <= 2) {
        for (const idx of available) {
          currentBoard[idx] = 'X';
          if (checkWinner(currentBoard) === 'X') {
            moveIndex = idx;
            currentBoard[idx] = null;
            break;
          }
          currentBoard[idx] = null;
        }
      }
    }

    // 3. Casual / adventurous flank move (leaves opportunities for player to achieve 3-in-a-row)
    if (moveIndex === -1) {
      // Pick random open position (not blocking center if player wants it)
      const nonCenter = available.filter((idx) => idx !== 4);
      if (currentGame >= 2 && nonCenter.length > 0) {
        moveIndex = nonCenter[Math.floor(Math.random() * nonCenter.length)];
      } else {
        moveIndex = available[Math.floor(Math.random() * available.length)];
      }
    }

    if (moveIndex !== -1) {
      const next = [...currentBoard];
      next[moveIndex] = 'O';
      setBoard(next);
      sounds.playBlip(380);

      const win = checkWinner(next);
      if (win === 'O') {
        setStatus('AI got 3 in a row! Rematching...');
        sounds.playFail();
        setTimeout(handleRematch, 1400);
      } else if (win === 'draw') {
        sounds.playBlip(300);
        setStatus('STALEMATE! Rematching with higher AI opening...');
        setTimeout(handleRematch, 1200);
      } else {
        setIsPlayerTurn(true);
        setStatus('Your Turn (X)');
      }
    }
  };

  const handleCellClick = (index: number) => {
    if (!isPlayerTurn || board[index] || won) return;

    const next = [...board];
    next[index] = 'X';
    setBoard(next);
    sounds.playBlip(560);
    setIsPlayerTurn(false);

    const win = checkWinner(next);
    if (win === 'X') {
      setWon(true);
      setStatus('★ 3 IN A ROW! VICTORY! ★');
      sounds.playSuccess();
      setTimeout(() => onSuccessRef.current(), 750);
    } else if (win === 'draw') {
      sounds.playBlip(300);
      setStatus('STALEMATE! Rematching with higher AI opening...');
      setTimeout(handleRematch, 1200);
    } else {
      setStatus('AI is thinking...');
      setTimeout(() => {
        aiMove(next);
      }, 350);
    }
  };

  const handleRematch = () => {
    const nextGame = Math.min(5, gameCountRef.current + 1);
    gameCountRef.current = nextGame;
    setGameCount(nextGame);
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setStatus(`Match ${nextGame}/5 — Align 3 in a row!`);
  };

  return (
    <div className="flex flex-col items-center select-none font-pixel w-full max-w-xs">
      <div className="flex justify-between items-center w-full mb-2 text-xs">
        <span className="text-cyan-400 font-bold">TIC-TAC-TOE</span>
        <span className="text-amber-300 text-[10px] font-mono bg-amber-950/80 px-2 py-0.5 border border-amber-500">
          MATCH {gameCount}/5
        </span>
        <span className="text-yellow-400 text-[10px]">3-IN-A-ROW</span>
      </div>

      <div className="relative bg-slate-950 p-4 border-4 border-slate-700 shadow-2xl flex flex-col items-center">
        <div className="text-[10px] text-yellow-300 mb-3 h-4 text-center font-bold tracking-wider">
          {status}
        </div>

        <div className="grid grid-cols-3 gap-2 w-56 h-56">
          {board.map((cell, idx) => (
            <button
              key={idx}
              onClick={() => handleCellClick(idx)}
              disabled={!isPlayerTurn || cell !== null || won}
              className={`w-16 h-16 border-2 flex items-center justify-center text-2xl font-bold cursor-pointer transition-all ${
                cell === 'X'
                  ? 'bg-blue-950 border-blue-400 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                  : cell === 'O'
                  ? 'bg-rose-950 border-rose-400 text-rose-300 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                  : 'bg-slate-900 border-slate-700 hover:border-slate-500'
              }`}
            >
              {cell}
            </button>
          ))}
        </div>

        {won && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center border-2 border-emerald-400 p-4 animate-in fade-in z-20">
            <span className="text-emerald-400 text-sm mb-1 font-bold">★ 3 IN A ROW ACHIEVED! ★</span>
            <span className="text-[10px] text-slate-300 mb-3 text-center">
              Decisive victory attained in Match {gameCount}!
            </span>
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
        Draws will rematch. AI opens up tactics so you win within 5 matches!
      </p>
    </div>
  );
};
