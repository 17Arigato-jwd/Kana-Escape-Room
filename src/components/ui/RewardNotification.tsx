import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { KanaItem } from '../../types/game';
import { sounds } from '../../utils/audio';

interface RewardNotificationProps {
  kana: KanaItem;
  onDismiss: () => void;
}

export const RewardNotification: React.FC<RewardNotificationProps> = ({
  kana,
  onDismiss,
}) => {
  useEffect(() => {
    sounds.playKanaObtained();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#facc15', '#38bdf8', '#4ade80', '#f472b6']
      });
    } catch {
      // ignore
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'Escape' || e.code === 'KeyE' || e.code === 'Space') {
        onDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onDismiss]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
      <div className="relative bg-[#1c192f] border-4 border-yellow-400 pixel-box-gold p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center gap-4 animate-in fade-in zoom-in-95 duration-200">
        <span className="font-pixel text-xs text-yellow-300 tracking-widest animate-pulse">
          ★ KANA OBTAINED! ★
        </span>

        {/* Big Kana character card */}
        <div className="w-28 h-32 bg-indigo-950 border-4 border-yellow-400 flex flex-col items-center justify-center shadow-[0_0_25px_rgba(250,204,21,0.5)] my-2">
          <span className="font-kana text-6xl font-bold text-yellow-300 filter drop-shadow">
            {kana.character}
          </span>
          <span className="font-mono text-sm text-cyan-300 font-bold mt-1">
            [{kana.romaji}]
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-slate-200 font-sans">
            Character added to your <strong className="text-yellow-300">Inventory</strong>!
          </span>
          <span className="text-[10px] text-slate-400 font-pixel mt-1">
            Press [I] anytime to craft Japanese words
          </span>
        </div>

        <button
          onClick={() => {
            sounds.playSelect();
            onDismiss();
          }}
          className="mt-2 px-8 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-pixel text-xs border-2 border-white cursor-pointer active:translate-y-0.5 shadow-lg"
        >
          [ENTER] COLLECT
        </button>
      </div>
    </div>
  );
};
