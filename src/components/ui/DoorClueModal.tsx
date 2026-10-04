import React, { useEffect } from 'react';
import { ExitDoor } from '../../types/game';
import { sounds } from '../../utils/audio';

interface DoorClueModalProps {
  door: ExitDoor;
  isUnlocked: boolean;
  onOpenDoor: () => void;
  onClose: () => void;
}

export const DoorClueModal: React.FC<DoorClueModalProps> = ({
  door,
  isUnlocked,
  onOpenDoor,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.code === 'KeyE') {
        if (isUnlocked) {
          onOpenDoor();
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isUnlocked, onOpenDoor, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
      <div className="relative bg-[#1a192f] border-4 border-[#424068] pixel-box p-6 max-w-md w-full shadow-2xl flex flex-col items-center text-center gap-4">
        {/* Door Icon Badge */}
        <div className="w-20 h-20 bg-slate-900 border-4 border-yellow-400/80 flex items-center justify-center text-5xl shadow-[0_0_20px_rgba(250,204,21,0.25)]">
          {door.targetIcon}
        </div>

        <h3 className="font-pixel text-sm text-yellow-400">
          {isUnlocked ? 'EXIT GATEWAY UNLOCKED!' : 'LOCKED EXIT DOOR'}
        </h3>

        {isUnlocked ? (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-emerald-300 font-sans">
              The exit mechanism hums with power! The correct Japanese word has dissolved the seal.
            </p>
            <p className="text-xs text-yellow-200 font-pixel mt-2">
              Ready to proceed through the door?
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {door.clueHint}
            </p>
            <div className="bg-slate-900/90 border-2 border-amber-500/40 p-3">
              <span className="font-pixel text-[10px] text-amber-300 block mb-1">
                SEAL CLUE:
              </span>
              <span className="text-xs text-slate-300">
                You must craft the Japanese word for <strong className="text-white">"{door.targetMeaning}"</strong> in your inventory to unlock this door.
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-pixel">
              Explore the room, beat minigames to collect Kana, and press [I] to craft words!
            </p>
          </div>
        )}

        <div className="flex gap-4 mt-2">
          {isUnlocked ? (
            <button
              onClick={() => {
                sounds.playDoorOpen();
                onOpenDoor();
              }}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-pixel text-xs border-2 border-white cursor-pointer active:translate-y-0.5 shadow-lg"
            >
              [E] PASS THROUGH DOOR
            </button>
          ) : (
            <button
              onClick={() => {
                sounds.playSelect();
                onClose();
              }}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-pixel text-xs border-2 border-slate-500 cursor-pointer active:translate-y-0.5"
            >
              [OK] UNDERSTOOD
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
