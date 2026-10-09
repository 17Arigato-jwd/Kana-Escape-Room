import React, { useEffect, useRef } from 'react';
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
  const hasPlayedRef = useRef(false);
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  useEffect(() => {
    // Only play audio and fire confetti once on initial appearance
    if (!hasPlayedRef.current) {
      hasPlayedRef.current = true;
      sounds.playKanaObtained();
      const speakTimer = setTimeout(() => {
        sounds.speakJapanese(kana.character);
      }, 320);

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

      return () => {
        clearTimeout(speakTimer);
      };
    }
  }, [kana.character]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'Escape' || e.code === 'KeyE' || e.code === 'Space') {
        onDismissRef.current();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4">
      <div className="relative bg-[#18162b] border-4 border-yellow-400 pixel-box-gold p-6 sm:p-8 max-w-sm sm:max-w-md w-full shadow-2xl flex flex-col items-center text-center gap-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Japanese Red Hanko Stamp (印鑑 - 見事!) */}
        <div className="absolute top-4 right-4 w-12 h-12 hanko-stamp text-xs tracking-tighter select-none animate-in zoom-in-50 duration-300">
          見事
        </div>

        <span className="font-pixel text-xs sm:text-sm text-yellow-300 tracking-widest animate-pulse">
          ★ KANA OBTAINED! ★
        </span>

        {/* Big Kana character card */}
        <div className="relative w-28 sm:w-32 h-32 sm:h-36 bg-indigo-950 border-4 border-yellow-400 flex flex-col items-center justify-center shadow-[0_0_25px_rgba(250,204,21,0.5)] my-1">
          <span className="font-kana text-6xl font-bold text-yellow-300 filter drop-shadow">
            {kana.character}
          </span>
          <span className="font-mono text-sm text-cyan-300 font-bold mt-1">
            [{kana.romaji}]
          </span>
        </div>

        {/* Clear manual replay button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            sounds.playSelect();
            sounds.speakJapanese(kana.character);
          }}
          title="Replay Japanese pronunciation"
          className="flex items-center gap-2 px-3.5 py-1.5 bg-indigo-950 hover:bg-indigo-800 text-yellow-300 text-xs font-pixel rounded border-2 border-yellow-400/80 cursor-pointer shadow-md transition-all active:scale-95"
        >
          <span className="text-sm">🔊</span>
          <span>REPLAY PRONUNCIATION</span>
        </button>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-slate-200 font-sans">
            Character added to your <strong className="text-yellow-300">Inventory</strong>!
          </span>
          <span className="text-[10px] text-slate-400 font-pixel mt-0.5">
            Press [I] anytime to craft Japanese words
          </span>
        </div>

        <button
          onClick={() => {
            sounds.playSelect();
            onDismiss();
          }}
          className="mt-2 px-8 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-pixel text-xs border-2 border-white cursor-pointer active:translate-y-0.5 shadow-lg font-bold"
        >
          [ENTER] COLLECT
        </button>
      </div>
    </div>
  );
};
