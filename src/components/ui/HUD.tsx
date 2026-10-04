import React from 'react';
import { RoomData, KanaItem } from '../../types/game';
import { sounds } from '../../utils/audio';

interface HUDProps {
  currentRoom: RoomData;
  inventory: KanaItem[];
  isDoorUnlocked: boolean;
  onOpenInventory: () => void;
  onOpenPauseMenu: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  currentRoom,
  inventory,
  isDoorUnlocked,
  onOpenInventory,
  onOpenPauseMenu,
}) => {
  return (
    <div className="w-full max-w-4xl px-3 py-2 flex justify-between items-center bg-[#131224]/90 border-t-2 sm:border-2 border-slate-700/80 font-pixel text-xs text-slate-300 shadow-xl select-none">
      {/* Room and Clue Indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 border border-slate-700">
          <span className="text-[10px] text-amber-400">ROOM {currentRoom.number}:</span>
          <span className="text-white text-[10px] truncate max-w-[140px] sm:max-w-none">
            {currentRoom.name}
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 border border-amber-600/60">
          <span className="text-[10px] text-amber-300">CLUE:</span>
          <span className="text-sm">{currentRoom.targetIcon}</span>
          {isDoorUnlocked && (
            <span className="text-[9px] text-emerald-400 font-bold ml-1 animate-pulse">
              [UNLOCKED ✓]
            </span>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            sounds.playSelect();
            onOpenInventory();
          }}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white border-2 border-indigo-300 text-[10px] cursor-pointer flex items-center gap-1.5 shadow"
        >
          <span>🎒 [I] INVENTORY</span>
          <span className="bg-yellow-400 text-black px-1 rounded-none text-[9px] font-bold">
            {inventory.length}
          </span>
        </button>

        <button
          onClick={() => {
            sounds.playSelect();
            onOpenPauseMenu();
          }}
          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-300 border border-slate-600 text-[10px] cursor-pointer"
        >
          [ESC]
        </button>
      </div>
    </div>
  );
};
