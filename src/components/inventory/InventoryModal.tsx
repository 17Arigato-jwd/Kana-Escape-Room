import React, { useState, useRef, useEffect } from 'react';
import { KanaItem, RoomData, JapaneseWord } from '../../types/game';
import { lookupJapaneseWord } from '../../data/dictionary';
import { sounds } from '../../utils/audio';
import { getRoomTheme } from '../../utils/theme';

interface InventoryModalProps {
  inventory: KanaItem[];
  currentRoom: RoomData;
  craftedWords: string[];
  isDoorUnlocked: boolean;
  onUnlockDoor: () => void;
  onClose: () => void;
  onWordCrafted?: (word: string) => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  inventory,
  currentRoom,
  craftedWords,
  isDoorUnlocked,
  onUnlockDoor,
  onClose,
  onWordCrafted,
}) => {
  const theme = getRoomTheme(currentRoom.id);
  // 4 building slots
  const [slots, setSlots] = useState<(KanaItem | null)[]>([null, null, null, null]);
  const [hoveredKana, setHoveredKana] = useState<KanaItem | null>(null);

  const wordAppraiseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const speechTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastEvaluatedWordRef = useRef<string>('');

  // Cleanup pending audio timers on unmount
  useEffect(() => {
    return () => {
      if (wordAppraiseTimerRef.current) clearTimeout(wordAppraiseTimerRef.current);
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    };
  }, []);

  // Formed word string
  const currentWordStr = slots
    .filter((s): s is KanaItem => s !== null)
    .map((s) => s.character)
    .join('');

  const wordData: JapaneseWord | null = currentWordStr ? lookupJapaneseWord(currentWordStr) : null;
  const isTargetWord = wordData && wordData.word === currentRoom.targetWord;

  // Add kana to next available slot
  const handleKanaClick = (item: KanaItem) => {
    sounds.playSelect();
    sounds.speakJapanese(item.character);
    const firstEmptyIndex = slots.findIndex((s) => s === null);
    if (firstEmptyIndex !== -1) {
      const nextSlots = [...slots];
      nextSlots[firstEmptyIndex] = item;
      setSlots(nextSlots);
      checkWord(nextSlots);
    }
  };

  // Remove kana from slot
  const handleSlotClick = (index: number) => {
    if (slots[index] === null) return;
    if (wordAppraiseTimerRef.current) {
      clearTimeout(wordAppraiseTimerRef.current);
      wordAppraiseTimerRef.current = null;
    }
    if (speechTimerRef.current) {
      clearTimeout(speechTimerRef.current);
      speechTimerRef.current = null;
    }
    lastEvaluatedWordRef.current = '';
    sounds.playBlip(320);
    const nextSlots = [...slots];
    nextSlots[index] = null;
    setSlots(nextSlots);
    checkWord(nextSlots);
  };

  // Clear all slots
  const handleClear = () => {
    if (wordAppraiseTimerRef.current) {
      clearTimeout(wordAppraiseTimerRef.current);
      wordAppraiseTimerRef.current = null;
    }
    if (speechTimerRef.current) {
      clearTimeout(speechTimerRef.current);
      speechTimerRef.current = null;
    }
    lastEvaluatedWordRef.current = '';
    sounds.playBlip(260);
    setSlots([null, null, null, null]);
  };

  // Check word validity and room target match with natural breathing delay
  const checkWord = (currentSlots: (KanaItem | null)[]) => {
    // Clear any pending evaluation timers so rapid clicking doesn't queue duplicate sounds
    if (wordAppraiseTimerRef.current) {
      clearTimeout(wordAppraiseTimerRef.current);
      wordAppraiseTimerRef.current = null;
    }
    if (speechTimerRef.current) {
      clearTimeout(speechTimerRef.current);
      speechTimerRef.current = null;
    }

    const word = currentSlots
      .filter((s): s is KanaItem => s !== null)
      .map((s) => s.character)
      .join('');

    if (!word) {
      lastEvaluatedWordRef.current = '';
      return;
    }

    // Don't re-trigger appraisal fanfare if word didn't change
    if (word === lastEvaluatedWordRef.current) return;

    if (word === currentRoom.targetWord && !isDoorUnlocked) {
      lastEvaluatedWordRef.current = word;
      // 950ms natural breathing delay: allows the placed syllable (duration ~500ms) to conclude cleanly
      wordAppraiseTimerRef.current = setTimeout(() => {
        sounds.playDoorUnlock();
        // Give door unlock sound 380ms before pronouncing the full completed word
        speechTimerRef.current = setTimeout(() => {
          sounds.speakJapanese(word);
        }, 380);
        onUnlockDoor();
        if (onWordCrafted) onWordCrafted(word);
      }, 950);
    } else if (lookupJapaneseWord(word)) {
      lastEvaluatedWordRef.current = word;
      // 950ms natural breathing delay: allows the placed syllable to conclude cleanly
      wordAppraiseTimerRef.current = setTimeout(() => {
        sounds.playKanaObtained();
        speechTimerRef.current = setTimeout(() => {
          sounds.speakJapanese(word);
        }, 340);
        if (onWordCrafted) onWordCrafted(word);
      }, 950);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, item: KanaItem, sourceSlotIndex?: number) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ item, sourceSlotIndex }));
  };

  const handleDropOnSlot = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      const item: KanaItem = data.item;
      const sourceIndex: number | undefined = data.sourceSlotIndex;

      sounds.playSelect();
      const nextSlots = [...slots];

      if (sourceIndex !== undefined) {
        // Swap slots
        const temp = nextSlots[targetIndex];
        nextSlots[targetIndex] = item;
        nextSlots[sourceIndex] = temp;
      } else {
        nextSlots[targetIndex] = item;
      }

      setSlots(nextSlots);
      checkWord(nextSlots);
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-2 sm:p-4">
      <div className={`relative bg-[#161528] border-4 ${theme.borderClass} ${theme.pixelBoxClass} p-3.5 sm:p-6 max-w-2xl lg:max-w-3xl xl:max-w-4xl w-full shadow-2xl flex flex-col gap-4 sm:gap-6 max-h-[94vh] overflow-y-auto`}>
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b-2 border-slate-700/80">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xl">🎒</span>
            <h2 className="font-pixel text-xs sm:text-sm text-yellow-400 tracking-wider">
              INVENTORY & WORD CRAFTER
            </h2>
          </div>
          <button
            onClick={() => {
              sounds.playSelect();
              onClose();
            }}
            className="font-pixel text-[10px] sm:text-xs px-2.5 py-1 bg-rose-900/60 hover:bg-rose-700 text-rose-200 border-2 border-rose-500 cursor-pointer active:translate-y-0.5"
          >
            [X] CLOSE
          </button>
        </div>

        {/* Room Clue Reminder */}
        <div className="bg-slate-950/90 border-2 border-amber-500/50 p-2.5 sm:p-3 flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xl sm:text-2xl">{currentRoom.targetIcon}</span>
            <div>
              <div className="font-pixel text-[10px] text-amber-300">DOOR CLUE IN ROOM:</div>
              <div className="text-[11px] sm:text-xs text-slate-300 font-sans">{currentRoom.clueHint}</div>
            </div>
          </div>
          {isDoorUnlocked && (
            <div className="font-pixel text-[10px] text-emerald-400 bg-emerald-950/90 px-2 py-1 border border-emerald-500 shrink-0">
              ✓ DOOR UNLOCKED
            </div>
          )}
        </div>

        {/* SECTION A: COLLECTED KANA */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="font-pixel text-xs text-cyan-300">
              COLLECTED KANA ({inventory.length})
            </span>
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-pixel">
              Tap or drag to slot
            </span>
          </div>

          <div className="bg-slate-950 p-2.5 sm:p-3 border-2 border-slate-700 min-h-[80px] flex flex-wrap gap-2 sm:gap-2.5 items-center">
            {inventory.length === 0 ? (
              <span className="font-pixel text-[10px] sm:text-xs text-slate-500 italic p-2">
                No Kana collected yet. Complete minigames in the room!
              </span>
            ) : (
              inventory.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  onClick={() => handleKanaClick(item)}
                  onMouseEnter={() => setHoveredKana(item)}
                  onMouseLeave={() => setHoveredKana(null)}
                  className="w-11 sm:w-13 h-12 sm:h-14 bg-indigo-950/90 hover:bg-indigo-900 border-2 border-indigo-500/80 hover:border-yellow-400 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing transition-all hover:scale-105 active:scale-95 shadow-md group relative"
                >
                  <span className="font-kana text-xl sm:text-2xl font-bold text-yellow-300 group-hover:text-yellow-200">
                    {item.character}
                  </span>
                  <span className="font-mono text-[8px] sm:text-[9px] text-indigo-300 font-bold">
                    {item.romaji}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Hover Tooltip Details */}
          <div className="h-5 text-xs text-slate-400 font-mono flex items-center gap-2">
            {hoveredKana ? (
              <>
                <span className="text-yellow-400 font-bold">{hoveredKana.character}</span>
                <span>• Script: {hoveredKana.script}</span>
                <span>• Romaji: [{hoveredKana.romaji}]</span>
              </>
            ) : (
              <span className="text-slate-600 text-[10px]">Tap character to add to builder & pronounce</span>
            )}
          </div>
        </div>

        {/* SECTION B: WORD BUILDER */}
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-700/80">
          <div className="flex justify-between items-center">
            <span className="font-pixel text-xs text-amber-300">
              WORD BUILDER (SLOTS)
            </span>
            <button
              onClick={handleClear}
              className="font-pixel text-[9px] sm:text-[10px] px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 cursor-pointer"
            >
              CLEAR SLOTS
            </button>
          </div>

          {/* Slots */}
          <div className="flex justify-center gap-2 sm:gap-4 py-2">
            {slots.map((slotItem, index) => (
              <div
                key={index}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDropOnSlot(e, index)}
                onClick={() => handleSlotClick(index)}
                className={`w-14 sm:w-16 h-16 sm:h-18 border-2 sm:border-3 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  slotItem
                    ? 'bg-slate-900 border-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.3)] hover:border-red-400'
                    : 'bg-slate-950/80 border-dashed border-slate-600 hover:border-slate-400'
                }`}
              >
                {slotItem ? (
                  <>
                    <span className="font-kana text-3xl font-bold text-yellow-300">
                      {slotItem.character}
                    </span>
                    <span className="font-mono text-[10px] text-yellow-100 font-semibold">
                      {slotItem.romaji}
                    </span>
                    <span className="text-[8px] text-slate-400 mt-0.5">Click to remove</span>
                  </>
                ) : (
                  <span className="font-pixel text-[10px] text-slate-600">SLOT {index + 1}</span>
                )}
              </div>
            ))}
          </div>

          {/* Word Evaluation Output Card */}
          <div className="min-h-[90px] flex items-center justify-center">
            {currentWordStr.length === 0 ? (
              <div className="text-center text-slate-500 font-pixel text-xs py-3">
                Place Kana into the slots above to form Japanese words!
              </div>
            ) : wordData ? (
              <div
                className={`w-full p-4 border-2 flex items-center justify-between transition-all ${
                  isTargetWord
                    ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 shadow-[0_0_18px_rgba(52,211,153,0.3)]'
                    : 'bg-indigo-950/70 border-indigo-400 text-indigo-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl filter drop-shadow">{wordData.icon}</span>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-kana text-2xl font-bold text-yellow-300">
                        {wordData.word}
                      </span>
                      {wordData.kanji && (
                        <span className="font-kana text-lg text-slate-300">
                          ({wordData.kanji})
                        </span>
                      )}
                      <span className="font-mono text-sm text-cyan-300 font-bold">
                        [{wordData.romaji}]
                      </span>
                      <button
                        onClick={() => sounds.speakJapanese(wordData.word)}
                        title="Pronounce word"
                        className="px-2 py-0.5 bg-indigo-900/80 hover:bg-indigo-800 text-yellow-300 border border-yellow-400/60 rounded text-xs cursor-pointer ml-1"
                      >
                        🔊
                      </button>
                    </div>
                    <div className="text-sm font-semibold text-white mt-0.5">
                      Meaning: {wordData.meaning} ({wordData.type})
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {isTargetWord ? (
                    <div className="flex flex-col items-end">
                      <span className="font-pixel text-xs text-yellow-300 font-bold animate-bounce">
                        ★ MATCHES DOOR TARGET! ★
                      </span>
                      <span className="text-xs text-emerald-300 font-sans mt-1">
                        The exit door has unlocked!
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-end">
                      <span className="font-pixel text-[10px] text-indigo-300">
                        ✓ VALID JAPANESE WORD
                      </span>
                      <span className="text-xs text-slate-400 font-sans mt-1">
                        Not the exit clue. Keep experimenting!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full p-4 bg-rose-950/40 border-2 border-rose-800 text-rose-300 flex items-center justify-center gap-3">
                <span className="text-lg">❓</span>
                <span className="font-pixel text-xs">
                  "{currentWordStr}" is not a recognized word in the dictionary.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="flex justify-between items-center text-[10px] font-pixel text-slate-500 pt-2 border-t border-slate-800">
          <span>Target Word: {currentRoom.targetMeaning} ({currentRoom.targetIcon})</span>
          <span>Press [I] or [ESC] to return to room</span>
        </div>
      </div>
    </div>
  );
};
