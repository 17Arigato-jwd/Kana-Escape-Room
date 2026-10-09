import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sounds } from '../../utils/audio';

interface GameTimedCodeProps {
  onSuccess: () => void;
  onFailure?: () => void;
  codeLength?: number;
}

export const GameTimedCode: React.FC<GameTimedCodeProps> = ({ onSuccess, codeLength = 4 }) => {
  const [targetCode, setTargetCode] = useState<string>('');
  const [enteredCode, setEnteredCode] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(12);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);

  const generateCode = useCallback(() => {
    let res = '';
    for (let i = 0; i < codeLength; i++) {
      res += Math.floor(Math.random() * 10).toString();
    }
    return res;
  }, [codeLength]);

  const restart = useCallback(() => {
    const newCode = generateCode();
    setTargetCode(newCode);
    setEnteredCode('');
    setTimeLeft(12);
    setGameOver(false);
    setWon(false);
  }, [generateCode]);

  useEffect(() => {
    restart();
  }, [restart]);

  // Timer countdown
  useEffect(() => {
    if (gameOver || won) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameOver(true);
          sounds.playFail();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameOver, won]);

  const enterDigit = useCallback((d: string) => {
    if (gameOver || won) return;
    if (enteredCode.length >= codeLength) return;

    sounds.playBlip(480 + parseInt(d, 10) * 30);
    const next = enteredCode + d;
    setEnteredCode(next);

    if (next.length === codeLength) {
      if (next === targetCode) {
        setWon(true);
        sounds.playSuccess();
        setTimeout(() => onSuccess(), 700);
      } else {
        sounds.playFail();
        setTimeout(() => {
          setEnteredCode('');
        }, 350);
      }
    }
  }, [gameOver, won, enteredCode, codeLength, targetCode, onSuccess]);

  const backspace = () => {
    if (gameOver || won) return;
    sounds.playBlip(300);
    setEnteredCode((c) => c.slice(0, -1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        enterDigit(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        backspace();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enterDigit]);

  return (
    <div className="flex flex-col items-center select-none font-pixel w-full max-w-[460px]">
      <div className="flex justify-between items-center w-full mb-2 text-xs sm:text-sm">
        <span className="text-amber-400 font-bold">KEYPAD LOCK</span>
        <span className={`font-bold ${timeLeft <= 4 ? 'text-red-400 animate-pulse' : 'text-slate-300'}`}>
          TIME: {timeLeft}s
        </span>
      </div>

      {/* Timer Bar */}
      <div className="w-full bg-slate-800 h-2.5 mb-3 border border-slate-700">
        <div
          className={`h-full transition-all duration-1000 ${
            timeLeft <= 4 ? 'bg-red-500' : 'bg-emerald-400'
          }`}
          style={{ width: `${(timeLeft / 12) * 100}%` }}
        />
      </div>

      <div className="relative bg-slate-950 p-4 sm:p-6 border-4 border-slate-700 shadow-2xl w-full flex flex-col items-center">
        {/* Code Displays */}
        <div className="bg-slate-900 border-2 border-slate-800 p-3 w-full text-center mb-3">
          <div className="text-[11px] sm:text-xs text-slate-400 mb-1">TARGET CODE:</div>
          <div className="text-2xl sm:text-3xl tracking-widest text-emerald-400 font-bold font-mono">
            {targetCode.split('').join(' ')}
          </div>
        </div>

        <div className="bg-slate-900 border-2 border-slate-700 p-3 w-full text-center mb-4">
          <div className="text-[11px] sm:text-xs text-slate-400 mb-1">ENTERED:</div>
          <div className="text-2xl sm:text-3xl tracking-widest text-yellow-300 font-bold font-mono h-8 sm:h-9">
            {enteredCode ? enteredCode.split('').join(' ') : '— — — —'}
          </div>
        </div>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 w-64 sm:w-72 mb-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => enterDigit(digit)}
              className="h-12 sm:h-14 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 border-2 border-slate-600 text-base sm:text-lg font-bold cursor-pointer rounded"
            >
              {digit}
            </button>
          ))}
          <button
            onClick={backspace}
            className="h-12 sm:h-14 bg-rose-900/60 hover:bg-rose-800 text-rose-300 border-2 border-rose-700 text-xs sm:text-sm font-bold cursor-pointer rounded"
          >
            DEL
          </button>
          <button
            onClick={() => enterDigit('0')}
            className="h-12 sm:h-14 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 border-2 border-slate-600 text-base sm:text-lg font-bold cursor-pointer rounded"
          >
            0
          </button>
          <button
            onClick={() => setEnteredCode('')}
            className="h-12 sm:h-14 bg-slate-800 hover:bg-slate-700 text-slate-400 border-2 border-slate-600 text-xs sm:text-sm font-bold cursor-pointer rounded"
          >
            CLR
          </button>
        </div>

        {won && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center border-2 border-emerald-400 p-4">
            <span className="text-emerald-400 text-base sm:text-lg mb-2 font-bold">CODE ACCEPTED!</span>
            <span className="text-xs sm:text-sm text-slate-300">Dispensing Kana reward...</span>
          </div>
        )}

        {gameOver && !won && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center border-2 border-red-500 p-4">
            <span className="text-red-400 text-base sm:text-lg mb-2 font-bold">TIME EXPIRED!</span>
            <button
              onClick={restart}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold border-2 border-white cursor-pointer active:translate-y-0.5"
            >
              TRY AGAIN
            </button>
          </div>
        )}
      </div>

      <p className="text-[11px] sm:text-xs text-slate-400 mt-2">Use Keyboard Numbers or Click Buttons</p>
    </div>
  );
};
