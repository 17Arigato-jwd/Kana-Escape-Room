import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { InteractableObject } from '../../types/game';
import { sounds } from '../../utils/audio';

// Lazy-load every minigame dynamically only when its modal is opened
const Game2048 = React.lazy(() => import('./Game2048').then((m) => ({ default: m.Game2048 })));
const GameSnake = React.lazy(() => import('./GameSnake').then((m) => ({ default: m.GameSnake })));
const GameFlappy = React.lazy(() => import('./GameFlappy').then((m) => ({ default: m.GameFlappy })));
const GameColorMatch = React.lazy(() => import('./GameColorMatch').then((m) => ({ default: m.GameColorMatch })));
const GameTimedCode = React.lazy(() => import('./GameTimedCode').then((m) => ({ default: m.GameTimedCode })));
const GamePatternMemory = React.lazy(() => import('./GamePatternMemory').then((m) => ({ default: m.GamePatternMemory })));
const GameKanaCatcher = React.lazy(() => import('./GameKanaCatcher').then((m) => ({ default: m.GameKanaCatcher })));
const GameWallBreaker = React.lazy(() => import('./GameWallBreaker').then((m) => ({ default: m.GameWallBreaker })));
const GameTicTacToe = React.lazy(() => import('./GameTicTacToe').then((m) => ({ default: m.GameTicTacToe })));
const GamePong = React.lazy(() => import('./GamePong').then((m) => ({ default: m.GamePong })));
const GameMatch3 = React.lazy(() => import('./GameMatch3').then((m) => ({ default: m.GameMatch3 })));
const GameNutsAndBolts = React.lazy(() => import('./GameNutsAndBolts').then((m) => ({ default: m.GameNutsAndBolts })));
const GameSlidingPuzzle = React.lazy(() => import('./GameSlidingPuzzle').then((m) => ({ default: m.GameSlidingPuzzle })));
const GameLaneRunner = React.lazy(() => import('./GameLaneRunner').then((m) => ({ default: m.GameLaneRunner })));
const GameRockPaperScissors = React.lazy(() => import('./GameRockPaperScissors').then((m) => ({ default: m.GameRockPaperScissors })));
const GameSeaBattle = React.lazy(() => import('./GameSeaBattle').then((m) => ({ default: m.GameSeaBattle })));
const GameDarts = React.lazy(() => import('./GameDarts').then((m) => ({ default: m.GameDarts })));
const GameAngryBirds = React.lazy(() => import('./GameAngryBirds').then((m) => ({ default: m.GameAngryBirds })));
const GameDotsAndBoxes = React.lazy(() => import('./GameDotsAndBoxes').then((m) => ({ default: m.GameDotsAndBoxes })));
const GameCardMatch = React.lazy(() => import('./GameCardMatch').then((m) => ({ default: m.GameCardMatch })));

interface MiniGameModalProps {
  interactable: InteractableObject;
  onSuccess: () => void;
  onClose: () => void;
}

export const MiniGameModal: React.FC<MiniGameModalProps> = ({
  interactable,
  onSuccess,
  onClose,
}) => {
  // Universal minigame reset key
  const [resetKey, setResetKey] = useState(0);

  const handleReset = useCallback(() => {
    sounds.playSelect();
    setResetKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        sounds.playSelect();
        onClose();
      } else if (e.code === 'KeyR' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Universal R reset key for any active minigame
        const target = e.target as HTMLElement | null;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        handleReset();
      }
    };
    // Use capture phase so Esc and R are intercepted reliably
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [onClose, handleReset]);

  const renderGame = () => {
    switch (interactable.minigameType) {
      case '2048':
        return <Game2048 onSuccess={onSuccess} />;
      case 'snake':
        return <GameSnake onSuccess={onSuccess} />;
      case 'flappy':
        return <GameFlappy onSuccess={onSuccess} />;
      case 'color_match':
        return <GameColorMatch onSuccess={onSuccess} />;
      case 'timed_code':
        return <GameTimedCode onSuccess={onSuccess} />;
      case 'pattern_memory':
        return <GamePatternMemory onSuccess={onSuccess} />;
      case 'kana_catcher':
        return <GameKanaCatcher onSuccess={onSuccess} />;
      case 'wall_breaker':
        return <GameWallBreaker onSuccess={onSuccess} />;
      case 'tic_tac_toe':
        return <GameTicTacToe onSuccess={onSuccess} />;
      case 'pong':
        return <GamePong onSuccess={onSuccess} />;
      case 'match3':
        return <GameMatch3 onSuccess={onSuccess} />;
      case 'nuts_and_bolts':
        return <GameNutsAndBolts onSuccess={onSuccess} />;
      case 'sliding_puzzle':
        return <GameSlidingPuzzle onSuccess={onSuccess} />;
      case 'lane_runner':
        return <GameLaneRunner onSuccess={onSuccess} />;
      case 'rock_paper_scissors':
        return <GameRockPaperScissors onSuccess={onSuccess} />;
      case 'sea_battle':
        return <GameSeaBattle onSuccess={onSuccess} />;
      case 'darts':
        return <GameDarts onSuccess={onSuccess} />;
      case 'angry_birds':
        return <GameAngryBirds onSuccess={onSuccess} />;
      case 'dots_and_boxes':
        return <GameDotsAndBoxes onSuccess={onSuccess} />;
      case 'card_match':
        return <GameCardMatch onSuccess={onSuccess} />;
      default:
        return <div className="text-white">Unknown Game</div>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-2 sm:p-4">
      <div className="relative bg-[#1a192f] border-4 border-[#3b3a58] pixel-box p-4 sm:p-6 max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl w-full flex flex-col items-center shadow-2xl max-h-[96vh] overflow-y-auto">
        {/* Cabinet Header */}
        <div className="flex justify-between items-center w-full pb-3 border-b-2 border-slate-700/80 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-none animate-ping" />
            <h2 className="font-pixel text-xs sm:text-sm text-yellow-400 tracking-wider">
              {interactable.name.toUpperCase()}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {/* Universal R Reset Button */}
            <button
              onClick={handleReset}
              title="Reset minigame [R]"
              className="font-pixel text-[10px] sm:text-xs px-2.5 py-1 bg-amber-950/70 hover:bg-amber-800 text-amber-200 border-2 border-amber-500/80 cursor-pointer active:translate-y-0.5 flex items-center gap-1 shadow-sm"
            >
              <span>↻</span>
              <span>[R] RESET</span>
            </button>
            <button
              onClick={() => {
                sounds.playSelect();
                onClose();
              }}
              title="Exit minigame [ESC]"
              className="font-pixel text-[10px] sm:text-xs px-2.5 py-1 bg-rose-900/60 hover:bg-rose-700 text-rose-200 border-2 border-rose-500 cursor-pointer active:translate-y-0.5"
            >
              [ESC]
            </button>
          </div>
        </div>

        {/* Reward Badge Banner */}
        <div className="bg-slate-950/90 border-2 border-amber-500/60 px-4 py-1.5 mb-4 flex items-center gap-3 shadow-inner">
          <span className="font-pixel text-[10px] text-amber-300">POTENTIAL REWARD:</span>
          <div className="flex items-center gap-1.5">
            <span className="font-kana text-xl font-bold text-amber-400 bg-amber-950/90 px-2.5 py-0.5 border border-amber-500">
              {interactable.rewardKana.character}
            </span>
            <span className="font-mono text-xs text-amber-200">
              ({interactable.rewardKana.romaji})
            </span>
          </div>
        </div>

        {/* Active Minigame with Suspense loading fallback and Universal Reset Key */}
        <div className="w-full flex justify-center py-1 min-h-[340px] sm:min-h-[420px] items-center">
          <Suspense
            key={resetKey}
            fallback={
              <div className="flex flex-col items-center justify-center p-8 gap-2">
                <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                <span className="font-pixel text-[10px] text-yellow-400 tracking-widest animate-pulse">
                  INITIALIZING MODULE...
                </span>
              </div>
            }
          >
            {renderGame()}
          </Suspense>
        </div>

        {/* Footer controls reminder */}
        <div className="mt-4 pt-3 border-t border-slate-800 w-full flex justify-between items-center text-[10px] font-pixel text-slate-400">
          <span>{interactable.description}</span>
          <span className="text-slate-500">[R] reset minigame • [ESC] exit</span>
        </div>
      </div>
    </div>
  );
};
