import React, { useEffect } from 'react';
import { RoomData } from '../../types/game';
import { sounds } from '../../utils/audio';
import { getRoomTheme } from '../../utils/theme';

interface RoomVictoryModalProps {
  room: RoomData;
  collectedKanaCount: number;
  onProceed: () => void;
}

export const RoomVictoryModal: React.FC<RoomVictoryModalProps> = ({
  room,
  collectedKanaCount,
  onProceed,
}) => {
  const theme = getRoomTheme(room.id);

  useEffect(() => {
    sounds.playDoorOpen();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.code === 'KeyE' || e.code === 'Space') {
        onProceed();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onProceed]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xs p-4">
      <div className={`relative bg-[#17162b] border-4 ${theme.borderClass} ${theme.pixelBoxClass} p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center gap-5 animate-in fade-in zoom-in-95 duration-200`}>
        {/* Authentic Japanese Hanko Seal Stamp */}
        <div className="absolute top-4 right-4 w-12 h-12 hanko-stamp text-xs tracking-tighter select-none animate-in zoom-in-50 duration-300">
          {theme.hankoText}
        </div>

        <span className="font-pixel text-xs text-emerald-400 tracking-widest">
          ROOM {room.number} ESCAPED!
        </span>

        <div className="text-5xl my-1">{room.targetIcon}</div>

        <h2 className="font-pixel text-base text-yellow-400">
          {room.name.toUpperCase()}
        </h2>

        {/* Word Solved Card */}
        <div className="bg-slate-950 border-2 border-slate-700 p-4 w-full flex flex-col items-center gap-1 shadow-inner">
          <span className="text-[10px] text-slate-400 font-pixel">KEYWORD SOLVED:</span>
          <span className="font-kana text-4xl font-bold text-yellow-300 tracking-wider">
            {room.targetWord}
          </span>
          <span className="text-sm font-semibold text-emerald-300 font-sans">
            "{room.targetMeaning}"
          </span>
        </div>

        <div className="flex justify-around w-full text-xs font-pixel text-slate-400 py-1">
          <span>Kana Collected: <strong className="text-yellow-400">{collectedKanaCount}</strong></span>
          <span>Room Status: <strong className="text-emerald-400">CLEARED</strong></span>
        </div>

        <button
          onClick={() => {
            sounds.playSelect();
            onProceed();
          }}
          className="mt-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-pixel text-xs border-2 border-white cursor-pointer active:translate-y-0.5 shadow-lg"
        >
          [ENTER] ENTER NEXT ROOM ➔
        </button>
      </div>
    </div>
  );
};
