import React from 'react';
import { RoomData, KanaItem } from '../../types/game';
import { sounds } from '../../utils/audio';
import { getRoomTheme } from '../../utils/theme';

interface HUDProps {
  currentRoom: RoomData;
  inventory: KanaItem[];
  isDoorUnlocked: boolean;
  onOpenInventory: () => void;
  onOpenPauseMenu: () => void;
  onUnlockDoor?: () => void;
  onSelectRoomIndex?: (index: number) => void;
  currentRoomIndex?: number;
}

export const HUD: React.FC<HUDProps> = ({
  currentRoom,
  inventory,
  isDoorUnlocked,
  onOpenInventory,
  onOpenPauseMenu,
  onUnlockDoor,
  onSelectRoomIndex,
  currentRoomIndex = 0,
}) => {
  const theme = getRoomTheme(currentRoom.id);

  return (
    <header className={`w-full max-w-5xl lg:max-w-6xl 2xl:max-w-7xl px-2 sm:px-4 py-1.5 sm:py-2 flex justify-between items-center ${theme.wagaraClass} bg-opacity-95 border-t-2 sm:border-2 ${theme.borderClass} ${theme.pixelBoxClass} font-pixel text-xs text-slate-300 shadow-2xl select-none transition-all`}>
      {/* Room and Clue Indicator */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Chamber & Name */}
        <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-950/90 px-2 sm:px-3 py-1 border border-slate-700 shadow-sm">
          <span className="text-[10px] sm:text-xs text-amber-400 font-pixel">
            ROOM {currentRoom.number}:
          </span>
          <span className="text-white text-[9px] sm:text-[10px] truncate max-w-[140px] sm:max-w-none tracking-wide font-pixel">
            {currentRoom.name}
          </span>
        </div>

        {/* Clue Badge */}
        <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-950/90 px-1.5 sm:px-2.5 py-1 border border-amber-500/60 shadow-sm">
          <span className="text-[9px] sm:text-[10px] text-amber-300 hidden xs:inline font-pixel">
            CLUE:
          </span>
          <span className="text-xs sm:text-sm">{currentRoom.targetIcon}</span>
          {isDoorUnlocked ? (
            <span className="text-[8px] sm:text-[9px] text-emerald-400 font-bold ml-0.5 font-pixel animate-pulse">
              [UNLOCKED ✓]
            </span>
          ) : (
            <span className="text-[8px] text-amber-400/80 font-mono hidden sm:inline">
              [LOCKED]
            </span>
          )}
        </div>
      </div>

      {/* Temporary Test Navigation Controls */}
      <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-950/90 px-1.5 sm:px-2 py-0.5 sm:py-1 border border-amber-500/60 shadow-inner">
        <button
          onClick={() => {
            sounds.playSuccess();
            onUnlockDoor?.();
          }}
          disabled={isDoorUnlocked}
          title="Temporary test control: Unlock this room's exit door immediately"
          className={`px-2 py-1 text-[8px] sm:text-[9px] font-pixel border rounded-xs cursor-pointer flex items-center gap-1 transition-all ${
            isDoorUnlocked
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500 cursor-default'
              : 'bg-amber-600 hover:bg-amber-500 text-yellow-100 border-yellow-300 active:scale-95 animate-pulse'
          }`}
        >
          <span>{isDoorUnlocked ? '✓' : '🔓'}</span>
          <span className="hidden xs:inline">{isDoorUnlocked ? 'DOOR OPEN' : 'UNLOCK DOOR (TEST)'}</span>
          <span className="xs:hidden">{isDoorUnlocked ? 'OPEN' : 'UNLOCK'}</span>
        </button>

        {onSelectRoomIndex && (
          <div className="flex items-center gap-0.5 pl-1 border-l border-slate-700">
            <span className="text-[7px] sm:text-[8px] text-slate-400 font-pixel mr-0.5 hidden sm:inline">WARP:</span>
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                onClick={() => {
                  sounds.playSelect();
                  onSelectRoomIndex(idx);
                }}
                title={`Warp to Room ${idx + 1}`}
                className={`px-1.5 py-0.5 text-[8px] sm:text-[9px] font-pixel border cursor-pointer active:scale-95 ${
                  currentRoomIndex === idx
                    ? 'bg-indigo-600 text-yellow-300 border-yellow-400 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border-slate-700'
                }`}
              >
                R{idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={() => {
            sounds.playSelect();
            onOpenInventory();
          }}
          title="Open Inventory [I]"
          className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-indigo-700 hover:bg-indigo-600 active:bg-indigo-800 text-white border-2 border-indigo-400 text-[9px] sm:text-[10px] cursor-pointer flex items-center gap-1.5 shadow-md active:translate-y-0.5"
        >
          <span className="hidden sm:inline font-pixel">🎒 [I] INVENTORY</span>
          <span className="sm:hidden font-pixel">🎒 BAG</span>
          <span className="bg-yellow-400 text-black px-1 py-0.2 rounded-none text-[8px] sm:text-[9px] font-bold">
            {inventory.length}
          </span>
        </button>

        <button
          onClick={() => {
            sounds.playSelect();
            onOpenPauseMenu();
          }}
          title="Pause [ESC]"
          className="px-2 sm:px-2.5 py-1 sm:py-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-600 text-[9px] sm:text-[10px] cursor-pointer active:translate-y-0.5"
        >
          [ESC]
        </button>
      </div>
    </header>
  );
};
