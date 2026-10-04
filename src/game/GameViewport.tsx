import React, { useEffect, useRef, useState, useCallback } from 'react';
import { RoomData, CharacterId, InteractableObject } from '../types/game';
import {
  getCharacterSprite,
  CharacterDirection,
  getFloorTile,
  getWallTile,
  getDoorSprite,
  getInteractableSprite,
  getDecorationSprite,
} from '../utils/pixelArt';
import { sounds } from '../utils/audio';
import { AtmosphericSystem } from './AtmosphericEffects';

interface GameViewportProps {
  room: RoomData;
  characterId: CharacterId;
  isDoorUnlocked: boolean;
  completedMinigames: string[];
  isLocked?: boolean;
  onInteract: (obj: InteractableObject) => void;
  onInteractDoor: () => void;
  onOpenInventory: () => void;
  onOpenPauseMenu: () => void;
  onDebugUnlockDoor?: () => void;
  onDebugGiveKana?: () => void;
}

const TILE_SIZE = 16;
const SCALE = 2.5; // Pixel zoom factor
const PLAYER_SPEED = 2.0; // Balanced 16-pixel tile walking pace

export const GameViewport: React.FC<GameViewportProps> = ({
  room,
  characterId,
  isDoorUnlocked,
  completedMinigames,
  isLocked = false,
  onInteract,
  onInteractDoor,
  onOpenInventory,
  onOpenPauseMenu,
  onDebugUnlockDoor,
  onDebugGiveKana,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Player position in pixels (relative to room)
  const playerRef = useRef({
    x: room.playerSpawn.x * TILE_SIZE,
    y: room.playerSpawn.y * TILE_SIZE,
    dir: 'down' as CharacterDirection,
    moving: false,
    frame: 0,
    animTimer: 0,
    stepTimer: 0,
    bumpCooldown: 0,
  });

  const [nearbyInteractable, setNearbyInteractable] = useState<InteractableObject | null>(null);
  const [isNearDoor, setIsNearDoor] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  const keysRef = useRef<Record<string, boolean>>({});
  const atmosphereRef = useRef<AtmosphericSystem>(new AtmosphericSystem());

  // Reset player position and atmospheric effects when room changes
  useEffect(() => {
    playerRef.current.x = room.playerSpawn.x * TILE_SIZE;
    playerRef.current.y = room.playerSpawn.y * TILE_SIZE;
    playerRef.current.dir = 'down';
    atmosphereRef.current.init(room.id, room.width, room.height, TILE_SIZE);
  }, [room]);

  // When locked (minigame or modal active), clear keys and stop movement
  useEffect(() => {
    if (isLocked) {
      keysRef.current = {};
      playerRef.current.moving = false;
      playerRef.current.frame = 0;
      setNearbyInteractable(null);
      setIsNearDoor(false);
    }
  }, [isLocked]);

  // Key listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLocked) {
        keysRef.current = {};
        return;
      }

      keysRef.current[e.code] = true;

      if (e.code === 'KeyE') {
        e.preventDefault();
        if (isNearDoor) {
          onInteractDoor();
        } else if (nearbyInteractable) {
          onInteract(nearbyInteractable);
        }
      } else if (e.code === 'KeyI') {
        e.preventDefault();
        onOpenInventory();
      } else if (e.code === 'F1') {
        e.preventDefault();
        setDebugMode((d) => !d);
      } else if (e.code === 'F3' && onDebugGiveKana) {
        e.preventDefault();
        onDebugGiveKana();
      } else if (e.code === 'F4' && onDebugUnlockDoor) {
        e.preventDefault();
        onDebugUnlockDoor();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (isLocked) {
        keysRef.current = {};
        return;
      }
      keysRef.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isLocked, isNearDoor, nearbyInteractable, onInteract, onInteractDoor, onOpenInventory, onOpenPauseMenu, onDebugGiveKana, onDebugUnlockDoor]);

  // Check collision with solid environmental objects & walls
  const isSolid = useCallback((px: number, py: number): boolean => {
    // Player collision bounding box (12px wide, 8px high centered at player's feet)
    const box = {
      x1: px + 2,
      x2: px + 14,
      y1: py + 16,
      y2: py + 23,
    };

    // Boundary walls (room tiles)
    const minTileX = 1;
    const maxTileX = room.width - 2;
    const minTileY = 2; // wall depth
    const maxTileY = room.height - 2;

    if (
      box.x1 < minTileX * TILE_SIZE ||
      box.x2 > (maxTileX + 1) * TILE_SIZE ||
      box.y1 < minTileY * TILE_SIZE ||
      box.y2 > (maxTileY + 1) * TILE_SIZE
    ) {
      return true;
    }

    // Door collision (if closed)
    if (!isDoorUnlocked) {
      const doorBox = {
        x1: room.exitDoor.x * TILE_SIZE,
        x2: (room.exitDoor.x + room.exitDoor.width) * TILE_SIZE,
        y1: room.exitDoor.y * TILE_SIZE,
        y2: (room.exitDoor.y + room.exitDoor.height) * TILE_SIZE,
      };
      if (
        box.x1 < doorBox.x2 &&
        box.x2 > doorBox.x1 &&
        box.y1 < doorBox.y2 &&
        box.y2 > doorBox.y1
      ) {
        return true;
      }
    }

    // Interactable solid collision boxes
    for (const obj of room.interactables) {
      const objBox = {
        x1: obj.x * TILE_SIZE + 2,
        x2: (obj.x + obj.width) * TILE_SIZE - 2,
        y1: obj.y * TILE_SIZE + 6,
        y2: (obj.y + obj.height) * TILE_SIZE,
      };
      if (
        box.x1 < objBox.x2 &&
        box.x2 > objBox.x1 &&
        box.y1 < objBox.y2 &&
        box.y2 > objBox.y1
      ) {
        return true;
      }
    }

    // Solid decorations
    for (const deco of room.decorations) {
      if (deco.solid) {
        const decoW = (deco.width || 1) * TILE_SIZE;
        const decoH = (deco.height || 1) * TILE_SIZE;
        const dBox = {
          x1: deco.x * TILE_SIZE,
          x2: deco.x * TILE_SIZE + decoW,
          y1: deco.y * TILE_SIZE + 4,
          y2: deco.y * TILE_SIZE + decoH,
        };
        if (
          box.x1 < dBox.x2 &&
          box.x2 > dBox.x1 &&
          box.y1 < dBox.y2 &&
          box.y2 > dBox.y1
        ) {
          return true;
        }
      }
    }

    return false;
  }, [room, isDoorUnlocked]);

  // Offscreen pre-rendered background canvas for 60 FPS performance
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const bg = document.createElement('canvas');
    bg.width = room.width * TILE_SIZE;
    bg.height = room.height * TILE_SIZE;
    const bgCtx = bg.getContext('2d');
    if (!bgCtx) return;
    bgCtx.imageSmoothingEnabled = false;

    // 1. Draw Floor Tiles
    for (let ty = 0; ty < room.height; ty++) {
      for (let tx = 0; tx < room.width; tx++) {
        if (tx > 0 && tx < room.width - 1 && ty > 1 && ty < room.height - 1) {
          const floorTile = getFloorTile(room.floorType, (tx + ty) % 2);
          bgCtx.drawImage(floorTile, tx * TILE_SIZE, ty * TILE_SIZE);
        }
      }
    }

    // 2. Draw Floor Rugs & Under-decorations
    for (const deco of room.decorations) {
      if (!deco.solid && deco.type === 'rug') {
        const w = (deco.width || 3) * TILE_SIZE;
        const h = (deco.height || 2) * TILE_SIZE;
        bgCtx.fillStyle = '#7c2d12';
        bgCtx.fillRect(deco.x * TILE_SIZE, deco.y * TILE_SIZE, w, h);
        bgCtx.fillStyle = '#b45309';
        bgCtx.strokeRect(deco.x * TILE_SIZE + 1.5, deco.y * TILE_SIZE + 1.5, w - 3, h - 3);
        bgCtx.fillStyle = '#fef08a';
        bgCtx.fillRect(deco.x * TILE_SIZE + w / 2 - 4, deco.y * TILE_SIZE + h / 2 - 4, 8, 8);
      }
    }

    // 3. Draw North Walls & Windows
    for (let tx = 0; tx < room.width; tx++) {
      bgCtx.drawImage(getWallTile(true), tx * TILE_SIZE, 0);
      bgCtx.drawImage(getWallTile(false), tx * TILE_SIZE, TILE_SIZE);
    }

    // Draw East & West Wall boundaries
    for (let ty = 2; ty < room.height; ty++) {
      bgCtx.drawImage(getWallTile(false), 0, ty * TILE_SIZE);
      bgCtx.drawImage(getWallTile(false), (room.width - 1) * TILE_SIZE, ty * TILE_SIZE);
    }
    // Draw South Wall boundary
    for (let tx = 0; tx < room.width; tx++) {
      bgCtx.drawImage(getWallTile(false), tx * TILE_SIZE, (room.height - 1) * TILE_SIZE);
    }

    bgCanvasRef.current = bg;
  }, [room]);

  // Main Render & Game Loop
  useEffect(() => {
    if (isLocked) {
      // Free 100% of browser rendering threads when minigame or pause menu is active!
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    let animId: number;

    const gameLoop = () => {
      const player = playerRef.current;
      const keys = keysRef.current;

      // Calculate Movement input
      let dx = 0;
      let dy = 0;

      if (!isLocked) {
        if (keys['ArrowUp'] || keys['KeyW']) dy -= 1;
        if (keys['ArrowDown'] || keys['KeyS']) dy += 1;
        if (keys['ArrowLeft'] || keys['KeyA']) dx -= 1;
        if (keys['ArrowRight'] || keys['KeyD']) dx += 1;

        if (dx !== 0 && dy !== 0) {
          // Normalize diagonal speed
          dx *= 0.7071;
          dy *= 0.7071;
        }
      }

      const isMoving = !isLocked && (dx !== 0 || dy !== 0);
      player.moving = isMoving;

      if (player.bumpCooldown > 0) {
        player.bumpCooldown -= 1;
      }

      if (isMoving) {
        // 8-directional facing angle: supports diagonal walking!
        if (dx !== 0 && dy !== 0) {
          if (dy > 0 && dx < 0) player.dir = 'down-left';
          else if (dy > 0 && dx > 0) player.dir = 'down-right';
          else if (dy < 0 && dx < 0) player.dir = 'up-left';
          else if (dy < 0 && dx > 0) player.dir = 'up-right';
        } else if (dx !== 0) {
          player.dir = dx > 0 ? 'right' : 'left';
        } else if (dy !== 0) {
          player.dir = dy > 0 ? 'down' : 'up';
        }

        // Step cadence: subtle shift between push-off (frames 0, 2) and plant (frames 1, 3)
        const stepPulse = player.frame % 2 === 0 ? 1.10 : 0.90;
        const currentSpeed = PLAYER_SPEED * stepPulse;

        // Apply movement with axis slide
        const nextX = player.x + dx * currentSpeed;
        const nextY = player.y + dy * currentSpeed;

        let movedX = false;
        let movedY = false;

        if (!isSolid(nextX, player.y)) {
          player.x = nextX;
          movedX = true;
        }
        if (!isSolid(player.x, nextY)) {
          player.y = nextY;
          movedY = true;
        }

        // Bumping sound: triggered when pushing into an impassable obstacle/wall
        const blockedX = dx !== 0 && !movedX;
        const blockedY = dy !== 0 && !movedY;
        const isBumping = (!movedX && !movedY) || (dx !== 0 && dy === 0 && blockedX) || (dy !== 0 && dx === 0 && blockedY);

        if (isBumping && player.bumpCooldown <= 0) {
          sounds.playBump();
          player.bumpCooldown = 18; // ~300ms cooldown for crisp impact feel
        }

        // Only animate stride if character actually displaced
        if (movedX || movedY) {
          player.animTimer += 1;
          if (player.animTimer >= 7) {
            player.animTimer = 0;
            const nextStep = (player.frame + 1) % 4;
            player.frame = nextStep;

            // Trigger footstep sound precisely on foot contact down-steps (1 and 3)
            if (nextStep === 1 || nextStep === 3) {
              sounds.playFootstep(room.floorType);
            }
          }
        } else {
          // Standing against an obstacle: halt feet on neutral ground
          player.moving = false;
          player.frame = 0;
          player.animTimer = 0;
        }
      } else {
        // Idle breathing bob
        player.animTimer += 1;
        if (player.animTimer > 25) {
          player.animTimer = 0;
          player.frame = (player.frame + 1) % 2;
        }
      }

      // Check Nearby Interactions (only if not locked)
      if (!isLocked) {
        const playerCenterX = player.x + 8;
        const playerCenterY = player.y + 16;

        // Door distance
        const doorCenterX = (room.exitDoor.x + room.exitDoor.width / 2) * TILE_SIZE;
        const doorCenterY = (room.exitDoor.y + room.exitDoor.height / 2) * TILE_SIZE;
        const distToDoor = Math.hypot(playerCenterX - doorCenterX, playerCenterY - doorCenterY);
        const nearDoorNow = distToDoor < 34;
        setIsNearDoor(nearDoorNow);

        // Interactables distance
        let closestObj: InteractableObject | null = null;
        let minObjDist = Infinity;

        for (const obj of room.interactables) {
          const objCenterX = (obj.x + obj.width / 2) * TILE_SIZE;
          const objCenterY = (obj.y + obj.height / 2) * TILE_SIZE;
          const dist = Math.hypot(playerCenterX - objCenterX, playerCenterY - objCenterY);
          const radiusPx = obj.interactionRadius * TILE_SIZE;

          if (dist < radiusPx && dist < minObjDist) {
            minObjDist = dist;
            closestObj = obj;
          }
        }
        setNearbyInteractable(closestObj);
      } else {
        setIsNearDoor(false);
        setNearbyInteractable(null);
      }

      // Update atmospheric particle simulation
      atmosphereRef.current.update();

      // --- RENDERING ---
      // Clear
      ctx.fillStyle = '#0a0914';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      // Center camera on player
      const viewW = canvas.width / SCALE;
      const viewH = canvas.height / SCALE;
      const camX = Math.round(player.x + 8 - viewW / 2);
      const camY = Math.round(player.y + 12 - viewH / 2);

      // Clamp camera to room boundaries
      const maxCamX = Math.max(0, room.width * TILE_SIZE - viewW);
      const maxCamY = Math.max(0, room.height * TILE_SIZE - viewH);
      const clampedCamX = Math.max(0, Math.min(camX, maxCamX));
      const clampedCamY = Math.max(0, Math.min(camY, maxCamY));

      ctx.scale(SCALE, SCALE);
      ctx.translate(-clampedCamX, -clampedCamY);

      // 1. Draw Pre-rendered Room Background in 1 lightning-fast call!
      if (bgCanvasRef.current) {
        ctx.drawImage(bgCanvasRef.current, 0, 0);
      }

      // 1b. Ambient warm floor glow from candles & lanterns
      atmosphereRef.current.drawFloorGlow(ctx, TILE_SIZE);

      // 1c. Wall Candle Sconces, Shrine Lanterns & Blinking Terminal LEDs
      atmosphereRef.current.drawCandlesAndLanterns(ctx, TILE_SIZE);

      // 2. Draw Door
      const doorSprite = getDoorSprite(isDoorUnlocked, room.exitDoor.targetIcon);
      ctx.drawImage(doorSprite, room.exitDoor.x * TILE_SIZE, (room.exitDoor.y - 1) * TILE_SIZE);

      // 3. Y-SORTED OBJECTS & CHARACTERS
      interface RenderEntity {
        y: number;
        render: () => void;
      }
      const renderList: RenderEntity[] = [];

      // Add Player
      renderList.push({
        y: player.y + 20,
        render: () => {
          const charSprite = getCharacterSprite(characterId, player.dir, player.frame, player.moving);
          ctx.drawImage(charSprite, Math.round(player.x), Math.round(player.y));
        },
      });

      // Add Interactables
      for (const obj of room.interactables) {
        const isCompleted = completedMinigames.includes(obj.id);
        renderList.push({
          y: (obj.y + obj.height) * TILE_SIZE,
          render: () => {
            const propSprite = getInteractableSprite(obj.spriteType, obj.minigameType);
            ctx.drawImage(propSprite, obj.x * TILE_SIZE, obj.y * TILE_SIZE);

            // Completed checkmark indicator floating
            if (isCompleted) {
              ctx.fillStyle = '#22c55e';
              ctx.fillRect(obj.x * TILE_SIZE + 10, obj.y * TILE_SIZE - 4, 12, 10);
              ctx.fillStyle = '#ffffff';
              ctx.font = '8px sans-serif';
              ctx.fillText('✓', obj.x * TILE_SIZE + 12, obj.y * TILE_SIZE + 4);
            }
          },
        });
      }

      // Add Solid Decorations (Plants, Shelves)
      for (const deco of room.decorations) {
        if (deco.solid) {
          const w = (deco.width || 1) * TILE_SIZE;
          const h = (deco.height || 1) * TILE_SIZE;
          renderList.push({
            y: deco.y * TILE_SIZE + h,
            render: () => {
              const decoSprite = getDecorationSprite(deco.type);
              ctx.drawImage(decoSprite, deco.x * TILE_SIZE, deco.y * TILE_SIZE, w, h);
            },
          });
        }
      }

      // Sort by Y and draw
      renderList.sort((a, b) => a.y - b.y);
      for (const item of renderList) {
        item.render();
      }

      // 4. Foreground Atmospheric Particles (Floating dust motes, Sakura petals, altar embers)
      atmosphereRef.current.drawAtmosphere(ctx);

      // 5. Debug overlay
      if (debugMode) {
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
        ctx.lineWidth = 1;
        // Player feet box
        ctx.strokeRect(player.x + 2, player.y + 16, 12, 7);

        // Object boxes
        for (const obj of room.interactables) {
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
          ctx.strokeRect(obj.x * TILE_SIZE, obj.y * TILE_SIZE, obj.width * TILE_SIZE, obj.height * TILE_SIZE);
          // Radius
          ctx.strokeStyle = 'rgba(234, 179, 8, 0.4)';
          ctx.beginPath();
          ctx.arc(
            (obj.x + obj.width / 2) * TILE_SIZE,
            (obj.y + obj.height / 2) * TILE_SIZE,
            obj.interactionRadius * TILE_SIZE,
            0,
            Math.PI * 2
          );
          ctx.stroke();
        }
      }

      ctx.restore();

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [room, characterId, isDoorUnlocked, completedMinigames, isLocked, debugMode, isSolid]);

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-4xl bg-black border-4 border-slate-800 shadow-2xl overflow-hidden">
      <canvas
        ref={canvasRef}
        width={720}
        height={480}
        className="w-full aspect-[3/2] pixelated block cursor-default"
      />

      {/* Floating Pixel Interaction Prompt */}
      {!isLocked && isNearDoor && (
        <div className="absolute top-8 bg-black/90 border-2 border-yellow-400 pixel-box-gold px-4 py-2 flex items-center gap-2 animate-bounce">
          <span className="font-pixel text-xs text-yellow-300">
            {isDoorUnlocked ? '[E] OPEN DOOR' : '[E] EXAMINE DOOR'}
          </span>
          <span className="text-sm">{room.targetIcon}</span>
        </div>
      )}

      {!isLocked && nearbyInteractable && !isNearDoor && (
        <div className="absolute top-8 bg-black/90 border-2 border-cyan-400 pixel-box px-4 py-2 flex items-center gap-2 animate-bounce">
          <span className="font-pixel text-xs text-cyan-300">
            [E] INTERACT WITH {nearbyInteractable.name.toUpperCase()}
          </span>
          <span className="font-kana text-sm text-yellow-400 font-bold bg-indigo-950 px-1 border border-indigo-400">
            {nearbyInteractable.rewardKana.character}
          </span>
        </div>
      )}

      {/* Controls Bar at bottom of screen */}
      {!isLocked && (
        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[10px] font-pixel text-slate-400 bg-black/70 px-3 py-1 border border-slate-700/60 pointer-events-none">
          <span>Arrow Keys / WASD = Move</span>
          <span>[E] = Interact</span>
          <span>[I] = Word Builder</span>
          <span>[ESC] = Pause</span>
        </div>
      )}

      {/* Debug Keys Indicator */}
      {debugMode && (
        <div className="absolute top-2 left-2 bg-red-950/90 border border-red-500 text-red-200 text-[9px] font-mono p-2">
          <div>[DEBUG MODE ACTIVE]</div>
          <div>F1: Toggle Collision Boxes</div>
          <div>F3: Give All Kana</div>
          <div>F4: Unlock Door</div>
        </div>
      )}
    </div>
  );
};
