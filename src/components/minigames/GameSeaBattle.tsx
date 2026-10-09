import React, { useState, useRef } from 'react';
import { sounds } from '../../utils/audio';

interface GameSeaBattleProps {
  onSuccess: () => void;
  onFailure?: () => void;
}

const GRID_SIZE = 5;

interface ShipDef {
  id: string;
  name: string;
  size: number;
  color: string;
}

const SHIPS_DEF: ShipDef[] = [
  { id: 'battleship', name: 'Battleship', size: 4, color: '#38bdf8' },
  { id: 'cruiser', name: 'Cruiser', size: 3, color: '#a855f7' },
  { id: 'patrol', name: 'Patrol Boat', size: 2, color: '#f59e0b' },
];

export const GameSeaBattle: React.FC<GameSeaBattleProps> = ({ onSuccess }) => {
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const [phase, setPhase] = useState<'DEPLOY' | 'BATTLE'>('DEPLOY');

  // Player ship placements: shipId -> cellIndices[]
  const [playerPlacements, setPlayerPlacements] = useState<Record<string, number[]>>(() =>
    generateRandomFleet()
  );

  // Active ship placement selection during DEPLOY
  const [selectedShipId, setSelectedShipId] = useState<string>('battleship');
  const [orientation, setOrientation] = useState<'H' | 'V'>('H');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // AI Ships stored with per-ship coordinates
  const [aiPlacements, setAiPlacements] = useState<Record<string, number[]>>(() =>
    generateRandomFleet()
  );

  const [playerAttacks, setPlayerAttacks] = useState<Record<number, 'hit' | 'miss'>>({});
  const [aiAttacks, setAiAttacks] = useState<Record<number, 'hit' | 'miss'>>({});

  const [status, setStatus] = useState<string>(
    'Arrange your 3 warships (Sizes 4, 3, 2), then launch battle!'
  );
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);
  const [won, setWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Helper: flatten all player ship coords into a Set
  const getPlayerOccupiedCells = (): Set<number> => {
    const set = new Set<number>();
    Object.values(playerPlacements).forEach((coords) => coords.forEach((c) => set.add(c)));
    return set;
  };

  // Helper: flatten all AI ship coords into a Set
  const getAiOccupiedCells = (): Set<number> => {
    const set = new Set<number>();
    Object.values(aiPlacements).forEach((coords) => coords.forEach((c) => set.add(c)));
    return set;
  };

  // Check if an AI ship is fully sunk
  const isAiShipSunk = (shipId: string): boolean => {
    const coords = aiPlacements[shipId];
    if (!coords || coords.length === 0) return false;
    return coords.every((c) => playerAttacks[c] === 'hit');
  };

  // Check if a player ship is fully sunk
  const isPlayerShipSunk = (shipId: string): boolean => {
    const coords = playerPlacements[shipId];
    if (!coords || coords.length === 0) return false;
    return coords.every((c) => aiAttacks[c] === 'hit');
  };

  // Generate a valid random fleet for 5x5 grid
  function generateRandomFleet(): Record<string, number[]> {
    const result: Record<string, number[]> = {};
    const occupied = new Set<number>();

    for (const ship of SHIPS_DEF) {
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < 300) {
        attempts++;
        const horiz = Math.random() > 0.5;
        const maxR = horiz ? GRID_SIZE : GRID_SIZE - ship.size;
        const maxC = horiz ? GRID_SIZE - ship.size : GRID_SIZE;
        const r = Math.floor(Math.random() * maxR);
        const c = Math.floor(Math.random() * maxC);

        const coords: number[] = [];
        let collision = false;

        for (let i = 0; i < ship.size; i++) {
          const cr = horiz ? r : r + i;
          const cc = horiz ? c + i : c;
          const idx = cr * GRID_SIZE + cc;
          if (occupied.has(idx)) {
            collision = true;
            break;
          }
          coords.push(idx);
        }

        if (!collision) {
          coords.forEach((coord) => occupied.add(coord));
          result[ship.id] = coords;
          placed = true;
        }
      }
    }
    return result;
  }

  // Calculate coordinates for a proposed ship placement
  const getProposedCoords = (startIdx: number, size: number, horiz: boolean): number[] | null => {
    const r = Math.floor(startIdx / GRID_SIZE);
    const c = startIdx % GRID_SIZE;

    if (horiz && c + size > GRID_SIZE) return null;
    if (!horiz && r + size > GRID_SIZE) return null;

    const coords: number[] = [];
    for (let i = 0; i < size; i++) {
      const cr = horiz ? r : r + i;
      const cc = horiz ? c + i : c;
      coords.push(cr * GRID_SIZE + cc);
    }
    return coords;
  };

  // Check if proposed coords collide with other ships (excluding currently placed version of same ship)
  const isPlacementValid = (shipId: string, coords: number[]): boolean => {
    const otherOccupied = new Set<number>();
    Object.entries(playerPlacements).forEach(([id, list]) => {
      if (id !== shipId) {
        list.forEach((c) => otherOccupied.add(c));
      }
    });

    return coords.every((c) => !otherOccupied.has(c));
  };

  // Manual placement click
  const handleDeployCellClick = (idx: number) => {
    if (phase !== 'DEPLOY') return;
    const curShip = SHIPS_DEF.find((s) => s.id === selectedShipId);
    if (!curShip) return;

    const coords = getProposedCoords(idx, curShip.size, orientation === 'H');
    if (!coords || !isPlacementValid(curShip.id, coords)) {
      sounds.playFail();
      setStatus(`Cannot place ${curShip.name} here (out of bounds or overlapping)!`);
      return;
    }

    sounds.playSelect();
    const nextPlacements = { ...playerPlacements, [curShip.id]: coords };
    setPlayerPlacements(nextPlacements);

    // Auto-advance to next ship if available
    const curIdx = SHIPS_DEF.findIndex((s) => s.id === selectedShipId);
    if (curIdx < SHIPS_DEF.length - 1) {
      setSelectedShipId(SHIPS_DEF[curIdx + 1].id);
    }

    setStatus(`${curShip.name} positioned!`);
  };

  const handleRandomizeFleet = () => {
    sounds.playSelect();
    const f = generateRandomFleet();
    setPlayerPlacements(f);
    setStatus('Fleet randomly positioned on 5x5 grid! Ready for battle.');
  };

  const handleStartBattle = () => {
    const allPlaced = SHIPS_DEF.every(
      (s) => playerPlacements[s.id] && playerPlacements[s.id].length === s.size
    );
    if (!allPlaced) {
      sounds.playFail();
      setStatus('Please place all 3 ships before starting battle!');
      return;
    }

    sounds.playKanaObtained();
    setPhase('BATTLE');
    setStatus('RADAR ACTIVE: Click coordinates on the enemy grid to fire!');
  };

  // Player attacks AI cell
  const handlePlayerAttack = (index: number) => {
    if (phase !== 'BATTLE' || !isPlayerTurn || playerAttacks[index] || won || gameOver) return;

    const aiSet = getAiOccupiedCells();
    const isHit = aiSet.has(index);
    const nextAttacks = { ...playerAttacks, [index]: isHit ? ('hit' as const) : ('miss' as const) };
    setPlayerAttacks(nextAttacks);

    if (isHit) {
      // Find which AI ship was hit
      const hitShip = SHIPS_DEF.find((s) => aiPlacements[s.id]?.includes(index));
      const wasAlreadySunk =
        hitShip && aiPlacements[hitShip.id]?.every((coord) => playerAttacks[coord] === 'hit');
      const isNowSunk =
        hitShip && aiPlacements[hitShip.id]?.every((coord) => nextAttacks[coord] === 'hit');

      if (hitShip && isNowSunk && !wasAlreadySunk) {
        // ENTIRE SHIP FULLY SUNK! Play retro explosion sound!
        sounds.playExplosion();
        setStatus(`💥 BOOM! ENEMY ${hitShip.name.toUpperCase()} (SIZE ${hitShip.size}) SUNK!`);
      } else {
        sounds.playKanaObtained();
        setStatus(`DIRECT HIT AT ${getCoordLabel(index)}!`);
      }

      const totalHits = Object.values(nextAttacks).filter((v) => v === 'hit').length;
      if (totalHits >= 9) {
        setWon(true);
        sounds.playSuccess();
        setTimeout(() => onSuccessRef.current(), 750);
        return;
      }
    } else {
      sounds.playBlip(320);
      setStatus(`Torpedo missed at ${getCoordLabel(index)}. Enemy responding...`);
    }

    setIsPlayerTurn(false);
    setTimeout(aiTurn, 650);
  };

  // AI fires torpedo
  const aiTurn = () => {
    if (won || gameOver) return;

    const playerSet = getPlayerOccupiedCells();
    const untargeted: number[] = [];
    for (let i = 0; i < 25; i++) {
      if (!aiAttacks[i]) untargeted.push(i);
    }

    if (untargeted.length === 0) return;

    // AI hunting logic
    let targetIdx = -1;
    const hitIndices = Object.entries(aiAttacks)
      .filter(([, res]) => res === 'hit')
      .map(([idx]) => Number(idx));

    for (const h of hitIndices) {
      const neighbors = [h - 1, h + 1, h - GRID_SIZE, h + GRID_SIZE].filter(
        (n) => n >= 0 && n < 25 && untargeted.includes(n)
      );
      if (neighbors.length > 0) {
        targetIdx = neighbors[Math.floor(Math.random() * neighbors.length)];
        break;
      }
    }

    if (targetIdx === -1) {
      targetIdx = untargeted[Math.floor(Math.random() * untargeted.length)];
    }

    const isHit = playerSet.has(targetIdx);
    const nextAiAttacks = { ...aiAttacks, [targetIdx]: isHit ? ('hit' as const) : ('miss' as const) };
    setAiAttacks(nextAiAttacks);

    if (isHit) {
      const hitShip = SHIPS_DEF.find((s) => playerPlacements[s.id]?.includes(targetIdx));
      const wasAlreadySunk =
        hitShip && playerPlacements[hitShip.id]?.every((coord) => aiAttacks[coord] === 'hit');
      const isNowSunk =
        hitShip && playerPlacements[hitShip.id]?.every((coord) => nextAiAttacks[coord] === 'hit');

      if (hitShip && isNowSunk && !wasAlreadySunk) {
        sounds.playExplosion();
        setStatus(`💥 ENEMY SUNK YOUR ${hitShip.name.toUpperCase()}!`);
      } else {
        sounds.playFail();
        setStatus(`ENEMY HIT YOUR SHIP AT ${getCoordLabel(targetIdx)}!`);
      }

      const totalAiHits = Object.values(nextAiAttacks).filter((v) => v === 'hit').length;
      if (totalAiHits >= 9) {
        setGameOver(true);
        return;
      }
    } else {
      sounds.playBlip(300);
      setStatus(`Enemy missed! Your turn: choose target.`);
    }

    setIsPlayerTurn(true);
  };

  const getCoordLabel = (idx: number) => {
    const col = String.fromCharCode(65 + (idx % GRID_SIZE));
    const row = Math.floor(idx / GRID_SIZE) + 1;
    return `${col}${row}`;
  };

  const restartAll = () => {
    const newPlayer = generateRandomFleet();
    setPlayerPlacements(newPlayer);
    const newAi = generateRandomFleet();
    setAiPlacements(newAi);
    setPlayerAttacks({});
    setAiAttacks({});
    setPhase('DEPLOY');
    setStatus('Arrange your 3 warships (Sizes 4, 3, 2), then launch battle!');
    setIsPlayerTurn(true);
    setWon(false);
    setGameOver(false);
  };

  const playerSet = getPlayerOccupiedCells();
  const playerHits = Object.values(playerAttacks).filter((v) => v === 'hit').length;
  const aiHits = Object.values(aiAttacks).filter((v) => v === 'hit').length;

  // Active hover preview calculation during DEPLOY
  const curShip = SHIPS_DEF.find((s) => s.id === selectedShipId);
  const hoverCoords =
    phase === 'DEPLOY' && hoverIndex !== null && curShip
      ? getProposedCoords(hoverIndex, curShip.size, orientation === 'H')
      : null;
  const hoverValid = hoverCoords && curShip ? isPlacementValid(curShip.id, hoverCoords) : false;

  return (
    <div className="flex flex-col items-center select-none font-pixel w-full max-w-[640px]">
      {/* Header */}
      <div className="flex justify-between items-center w-full mb-2 text-xs sm:text-sm">
        <span className="text-cyan-400 font-bold">YOUR FLEET ({9 - aiHits}/9)</span>
        <span className="text-amber-400 text-[10px] sm:text-xs tracking-wider font-mono">5×5 NAVAL GRID</span>
        <span className="text-rose-400 font-bold">ENEMY RADAR ({9 - playerHits}/9)</span>
      </div>

      <div className="relative bg-slate-950 p-3 sm:p-5 border-4 border-slate-700 shadow-2xl flex flex-col items-center w-full">
        {/* Status Line */}
        <div className="text-xs sm:text-sm text-yellow-300 mb-3 h-5 text-center font-bold tracking-wider">
          {status}
        </div>

        {/* Dual 5x5 Grids side-by-side or stacked on mobile */}
        <div className="flex flex-col sm:flex-row justify-around items-center w-full gap-4 sm:gap-6 mb-3">
          {/* PLAYER FLEET (5x5) */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-cyan-400 mb-1.5 font-bold">
              {phase === 'DEPLOY' ? 'ARRANGE (CLICK TO PLACE)' : 'YOUR DEFENSE'}
            </span>
            <div className="grid grid-cols-5 gap-1.5 bg-slate-900 border border-slate-700 p-2 rounded">
              {Array.from({ length: 25 }).map((_, idx) => {
                const hasShip = playerSet.has(idx);
                const attack = aiAttacks[idx];
                const isHovered = hoverCoords?.includes(idx);

                // Check if the ship on this cell is fully sunk (grey it out!)
                const shipOnCell = SHIPS_DEF.find((s) => playerPlacements[s.id]?.includes(idx));
                const sunk = shipOnCell ? isPlayerShipSunk(shipOnCell.id) : false;

                return (
                  <button
                    key={idx}
                    onClick={() => handleDeployCellClick(idx)}
                    onMouseEnter={() => setHoverIndex(idx)}
                    onMouseLeave={() => setHoverIndex(null)}
                    disabled={phase !== 'DEPLOY'}
                    className={`w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 border flex items-center justify-center text-sm sm:text-base font-bold transition-all relative rounded-[2px] ${
                      phase === 'DEPLOY'
                        ? isHovered
                          ? hoverValid
                            ? 'bg-emerald-500/80 border-emerald-300 text-black cursor-pointer'
                            : 'bg-rose-500/80 border-rose-300 text-black cursor-not-allowed'
                          : hasShip
                          ? 'bg-cyan-800 border-cyan-400 text-cyan-200 cursor-pointer shadow-inner'
                          : 'bg-slate-950 border-slate-800 hover:border-cyan-400/50 cursor-pointer'
                        : sunk
                        ? 'bg-slate-700/80 border-slate-600 text-slate-400 grayscale opacity-75'
                        : attack === 'hit'
                        ? 'bg-rose-600 border-yellow-300 text-white shadow-md'
                        : attack === 'miss'
                        ? 'bg-slate-800 border-slate-600 text-slate-400'
                        : hasShip
                        ? 'bg-cyan-900 border-cyan-600 text-cyan-200'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    {sunk ? '⚓' : attack === 'hit' ? '💥' : attack === 'miss' ? '•' : hasShip ? '■' : ''}
                  </button>
                );
              })}
            </div>

            {/* Player Fleet Status (Greyed out when sunk) */}
            <div className="flex gap-1.5 mt-2 justify-center w-full">
              {SHIPS_DEF.map((s) => {
                const sunk = isPlayerShipSunk(s.id);
                return (
                  <div
                    key={s.id}
                    className={`px-1.5 py-0.5 border text-[9px] sm:text-[10px] font-mono font-bold transition-all rounded-[2px] ${
                      sunk
                        ? 'bg-slate-900/80 border-slate-700 text-slate-500 opacity-40 grayscale line-through'
                        : 'bg-cyan-950 border-cyan-600 text-cyan-300'
                    }`}
                  >
                    {s.name[0]}:{s.size}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ENEMY TARGET RADAR (5x5) */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-rose-400 mb-1.5 font-bold">ENEMY RADAR (5×5)</span>
            <div className="grid grid-cols-5 gap-1.5 bg-slate-900 border border-slate-700 p-2 rounded">
              {Array.from({ length: 25 }).map((_, idx) => {
                const attack = playerAttacks[idx];
                const isClickable = phase === 'BATTLE' && isPlayerTurn && !attack && !won && !gameOver;

                // Check if this cell belongs to an enemy ship that is fully sunk (grey it out!)
                const enemyShipOnCell = SHIPS_DEF.find((s) => aiPlacements[s.id]?.includes(idx));
                const sunk = enemyShipOnCell ? isAiShipSunk(enemyShipOnCell.id) : false;

                return (
                  <button
                    key={idx}
                    onClick={() => handlePlayerAttack(idx)}
                    disabled={!isClickable}
                    className={`w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 border flex items-center justify-center text-sm sm:text-base font-bold transition-all rounded-[2px] ${
                      sunk
                        ? 'bg-slate-700/90 border-slate-500 text-slate-400 grayscale shadow-none'
                        : attack === 'hit'
                        ? 'bg-rose-600 border-yellow-300 text-white shadow-md animate-pulse'
                        : attack === 'miss'
                        ? 'bg-slate-800 border-slate-600 text-slate-400'
                        : isClickable
                        ? 'bg-slate-950 hover:bg-slate-800 border-slate-800 hover:border-rose-400 cursor-crosshair active:scale-95'
                        : 'bg-slate-950 border-slate-900 cursor-not-allowed opacity-60'
                    }`}
                  >
                    {sunk ? '⚓' : attack === 'hit' ? '💥' : attack === 'miss' ? '•' : ''}
                  </button>
                );
              })}
            </div>

            {/* Enemy Fleet Status (Greyed out when sunk) */}
            <div className="flex gap-1.5 mt-2 justify-center w-full">
              {SHIPS_DEF.map((s) => {
                const sunk = isAiShipSunk(s.id);
                return (
                  <div
                    key={s.id}
                    className={`px-1.5 py-0.5 border text-[9px] sm:text-[10px] font-mono font-bold transition-all rounded-[2px] ${
                      sunk
                        ? 'bg-slate-900/80 border-slate-700 text-slate-500 opacity-40 grayscale line-through'
                        : 'bg-rose-950 border-rose-600 text-rose-300'
                    }`}
                  >
                    {s.name[0]}:{s.size}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Ship Placement Toolbar in DEPLOY Phase */}
        {phase === 'DEPLOY' && (
          <div className="w-full bg-slate-900/90 border border-slate-700 p-2 flex flex-col gap-1.5 mt-1">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-slate-300">SELECT SHIP TO PLACE:</span>
              <button
                onClick={() => {
                  sounds.playBlip(440);
                  setOrientation((o) => (o === 'H' ? 'V' : 'H'));
                }}
                className="px-2 py-0.5 bg-indigo-900 border border-indigo-400 text-indigo-200 cursor-pointer text-[9px] active:scale-95 font-bold"
              >
                ROTATE: {orientation === 'H' ? 'HORIZONTAL ➔' : 'VERTICAL ⬇'}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1">
              {SHIPS_DEF.map((ship) => {
                const isSelected = selectedShipId === ship.id;
                const isPlaced = !!playerPlacements[ship.id];

                return (
                  <button
                    key={ship.id}
                    onClick={() => {
                      sounds.playSelect();
                      setSelectedShipId(ship.id);
                    }}
                    className={`p-1 border flex flex-col items-center justify-center text-[9px] cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow ring-1 ring-cyan-400'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <span className="font-bold">{ship.name}</span>
                    <span className="text-[8px] text-amber-300">
                      {'■ '.repeat(ship.size)} ({ship.size})
                    </span>
                    {isPlaced && <span className="text-[7px] text-emerald-400">✓ PLACED</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Won Overlay */}
        {won && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center border-2 border-emerald-400 p-4 animate-in fade-in z-20">
            <span className="text-emerald-400 text-sm mb-1 font-bold">★ ENEMY FLEET DESTROYED! ★</span>
            <span className="text-[10px] text-slate-300 mb-3">All 3 enemy warships sunk!</span>
            <button
              onClick={() => onSuccessRef.current()}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold border-2 border-white cursor-pointer shadow-lg"
            >
              CLAIM REWARD NOW
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameOver && !won && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center border-2 border-red-500 p-4 z-20">
            <span className="text-red-400 text-xs mb-3 font-bold">YOUR FLEET WAS DECIMATED</span>
            <button
              onClick={restartAll}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-[10px] border-2 border-white cursor-pointer"
            >
              RETRY BATTLE
            </button>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex gap-3 mt-2.5 w-full justify-center">
        {phase === 'DEPLOY' ? (
          <>
            <button
              onClick={handleRandomizeFleet}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border-2 border-slate-600 text-xs cursor-pointer active:bg-slate-600"
            >
              RANDOMIZE
            </button>
            <button
              onClick={handleStartBattle}
              className="px-5 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs border-2 border-white cursor-pointer active:translate-y-0.5 shadow-md"
            >
              START BATTLE ➔
            </button>
          </>
        ) : (
          <button
            onClick={restartAll}
            className="px-4 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] border border-slate-600 cursor-pointer"
          >
            RESTART FLEET
          </button>
        )}
      </div>

      <p className="text-[9px] text-slate-400 mt-2 text-center">
        Deep explosions trigger when a ship is fully sunk • Sunk ships are greyed out!
      </p>
    </div>
  );
};
