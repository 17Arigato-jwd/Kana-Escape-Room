import { RoomData } from '../types/game';

export const ROOMS: RoomData[] = [
  // ==========================================
  // ROOM 1: THE DETECTIVE'S WORKSHOP
  // Target: かぎ (Key 🔑)
  // Unique Games: timed_code, 2048, color_match, snake, pattern_memory, flappy
  // ==========================================
  {
    id: 'room-1',
    number: 1,
    name: "The Detective's Workshop",
    description: "An old retro workspace cluttered with computers, games, and safes. The metal door is locked tight.",
    width: 22,
    height: 16,
    floorType: 'wood',
    targetWord: 'かぎ',
    targetMeaning: 'Key',
    targetIcon: '🔑',
    clueHint: 'A heavy steel door with an embossed golden key emblem. It requires the Japanese word for "Key".',
    requiredKana: ['か', 'ぎ'],
    playerSpawn: { x: 11, y: 11 },
    exitDoor: {
      x: 11,
      y: 2,
      width: 2,
      height: 2,
      targetWord: 'かぎ',
      targetMeaning: 'Key',
      targetIcon: '🔑',
      clueHint: 'Engraved with a golden key symbol 🔑. It will not budge until you craft the word.'
    },
    interactables: [
      {
        id: 'r1_safe',
        name: 'Iron Safe',
        x: 4,
        y: 4,
        width: 2,
        height: 2,
        spriteType: 'safe',
        minigameType: 'timed_code',
        rewardKana: { id: 'k_ka', character: 'か', romaji: 'ka', script: 'hiragana' },
        interactionRadius: 2.2,
        description: 'A heavy metal safe with an electronic keypad blinking a prompt.'
      },
      {
        id: 'r1_arcade',
        name: 'Retro Arcade Machine',
        x: 17,
        y: 4,
        width: 2,
        height: 2,
        spriteType: 'arcade',
        minigameType: '2048',
        rewardKana: { id: 'k_gi', character: 'ぎ', romaji: 'gi', script: 'hiragana' },
        interactionRadius: 2.2,
        description: 'An old-school neon arcade cabinet humming with synthetic chiptune music.'
      },
      {
        id: 'r1_wires',
        name: 'Circuit Box',
        x: 4,
        y: 9,
        width: 2,
        height: 2,
        spriteType: 'switchboard',
        minigameType: 'color_match',
        rewardKana: { id: 'k_mi', character: 'み', romaji: 'mi', script: 'hiragana' },
        interactionRadius: 2.2,
        description: 'A junction panel with disconnected colored power leads.'
      },
      {
        id: 'r1_terrarium',
        name: 'Cyber Terrarium',
        x: 17,
        y: 9,
        width: 2,
        height: 2,
        spriteType: 'terrarium',
        minigameType: 'snake',
        rewardKana: { id: 'k_to', character: 'と', romaji: 'to', script: 'hiragana' },
        interactionRadius: 2.2,
        description: 'A high-tech digital terrarium housing a robotic serpent.'
      },
      {
        id: 'r1_terminal',
        name: 'Workstation Terminal',
        x: 8,
        y: 4,
        width: 2,
        height: 2,
        spriteType: 'terminal',
        minigameType: 'pattern_memory',
        rewardKana: { id: 'k_ne', character: 'ね', romaji: 'ne', script: 'hiragana' },
        interactionRadius: 2.2,
        description: 'A multi-monitor computer display running sequential memory cycles.'
      },
      {
        id: 'r1_glider',
        name: 'Mini Drone Pad',
        x: 14,
        y: 12,
        width: 2,
        height: 2,
        spriteType: 'chest',
        minigameType: 'flappy',
        rewardKana: { id: 'k_ko', character: 'こ', romaji: 'ko', script: 'hiragana' },
        interactionRadius: 2.2,
        description: 'A launch cradle for a pocket glider drone.'
      }
    ],
    decorations: [
      { x: 3, y: 13, type: 'plant', solid: true, width: 1, height: 1 },
      { x: 18, y: 13, type: 'plant', solid: true, width: 1, height: 1 },
      { x: 10, y: 8, type: 'rug', solid: false, width: 4, height: 3 },
      { x: 7, y: 2, type: 'window', solid: false, width: 2, height: 1 },
      { x: 15, y: 2, type: 'window', solid: false, width: 2, height: 1 },
      { x: 2, y: 7, type: 'shelf', solid: true, width: 1, height: 2 },
      { x: 19, y: 7, type: 'shelf', solid: true, width: 1, height: 2 },
    ]
  },

  // ==========================================
  // ROOM 2: THE GRAND ARCHIVE
  // Target: とびら (Door 🚪)
  // Unique Games: sliding_puzzle, wall_breaker, match3, kana_catcher, tic_tac_toe, dots_and_boxes, nuts_and_bolts
  // ==========================================
  {
    id: 'room-2',
    number: 2,
    name: 'The Grand Archive',
    description: 'A mysterious ancient library filled with scrolls, clockwork mechanisms, and stone carvings.',
    width: 24,
    height: 18,
    floorType: 'stone',
    targetWord: 'とびら',
    targetMeaning: 'Door',
    targetIcon: '🚪',
    clueHint: 'A massive carved archway depicting an ornate grand portal. It requires the Japanese word for "Door".',
    requiredKana: ['と', 'び', 'ら'],
    playerSpawn: { x: 12, y: 14 },
    exitDoor: {
      x: 12,
      y: 2,
      width: 2,
      height: 2,
      targetWord: 'とびら',
      targetMeaning: 'Door',
      targetIcon: '🚪',
      clueHint: 'Carved with an intricate ornate gateway symbol 🚪. Unlocked by forming the word.'
    },
    interactables: [
      {
        id: 'r2_bookshelf',
        name: 'Ancient Tome Shelf',
        x: 5,
        y: 4,
        width: 2,
        height: 2,
        spriteType: 'bookshelf',
        minigameType: 'sliding_puzzle',
        rewardKana: { id: 'k_to2', character: 'と', romaji: 'to', script: 'hiragana' },
        interactionRadius: 2.2,
        description: 'A sliding library book catalog mechanism.'
      },
      {
        id: 'r2_clock',
        name: 'Grandfather Chronometer',
        x: 18,
        y: 4,
        width: 2,
        height: 2,
        spriteType: 'clock',
        minigameType: 'wall_breaker',
        rewardKana: { id: 'k_bi', character: 'び', romaji: 'bi', script: 'hiragana' },
        interactionRadius: 2.2,
        description: 'A pendulum clock housing an internal brick security barrier.'
      },
      {
        id: 'r2_lanterns',
        name: 'Elemental Conduit',
        x: 4,
        y: 10,
        width: 2,
        height: 2,
        spriteType: 'switchboard',
        minigameType: 'match3',
        rewardKana: { id: 'k_ra', character: 'ら', romaji: 'ra', script: 'hiragana' },
        interactionRadius: 2.2,
        description: 'A spiritual leyline matrix matching colorful Kana gems.'
      },
      {
        id: 'r2_altar',
        name: 'Shrine Basin',
        x: 12,
        y: 8,
        width: 2,
        height: 2,
        spriteType: 'altar',
        minigameType: 'kana_catcher',
        rewardKana: { id: 'k_na', character: 'な', romaji: 'na', script: 'hiragana' },
        interactionRadius: 2.2,
        description: 'A tranquil stone basin catching falling sakura spirit wisps.'
      },
      {
        id: 'r2_table',
        name: 'Scholars Game Board',
        x: 19,
        y: 10,
        width: 2,
        height: 2,
        spriteType: 'terminal',
        minigameType: 'tic_tac_toe',
        rewardKana: { id: 'k_i', character: 'い', romaji: 'i', script: 'hiragana' },
        interactionRadius: 2.2,
        description: 'An ancient logic table operated by a minimax strategist AI.'
      },
      {
        id: 'r2_crane',
        name: 'Paper Crane Perch',
        x: 17,
        y: 13,
        width: 2,
        height: 2,
        spriteType: 'chest',
        minigameType: 'dots_and_boxes',
        rewardKana: { id: 'k_nu', character: 'ぬ', romaji: 'nu', script: 'hiragana' },
        interactionRadius: 2.2,
        description: 'A geometric grid station challenging players to claim boxes.'
      },
      {
        id: 'r2_basin',
        name: 'Mechanical Lockbox',
        x: 7,
        y: 13,
        width: 2,
        height: 2,
        spriteType: 'safe',
        minigameType: 'nuts_and_bolts',
        rewardKana: { id: 'k_ha', character: 'は', romaji: 'ha', script: 'hiragana' },
        interactionRadius: 2.2,
        description: 'A plate fixture held tight by heavy interlocking bolts.'
      }
    ],
    decorations: [
      { x: 3, y: 15, type: 'plant', solid: true, width: 1, height: 1 },
      { x: 20, y: 15, type: 'plant', solid: true, width: 1, height: 1 },
      { x: 10, y: 11, type: 'rug', solid: false, width: 4, height: 3 },
      { x: 8, y: 2, type: 'window', solid: false, width: 2, height: 1 },
      { x: 16, y: 2, type: 'window', solid: false, width: 2, height: 1 },
      { x: 2, y: 6, type: 'shelf', solid: true, width: 1, height: 3 },
      { x: 21, y: 6, type: 'shelf', solid: true, width: 1, height: 3 },
    ]
  },

  // ==========================================
  // ROOM 3: THE SECRET VAULT GATEWAY
  // Target: でぐち (Exit 🚪)
  // Unique Games: pong, angry_birds, darts, lane_runner, sea_battle, rock_paper_scissors, card_match
  // ==========================================
  {
    id: 'room-3',
    number: 3,
    name: 'The Secret Vault Gateway',
    description: 'The inner sanctum of the escape complex. Beyond this final gateway lies your freedom.',
    width: 26,
    height: 20,
    floorType: 'carpet_tatami',
    targetWord: 'でぐち',
    targetMeaning: 'Exit',
    targetIcon: '🚪',
    clueHint: 'A majestic sealed torii portal marked with the sign of the "Exit". Craft the Japanese word to escape!',
    requiredKana: ['で', 'ぐ', 'ち'],
    playerSpawn: { x: 13, y: 16 },
    exitDoor: {
      x: 13,
      y: 2,
      width: 2,
      height: 2,
      targetWord: 'でぐち',
      targetMeaning: 'Exit',
      targetIcon: '🚪',
      clueHint: 'The final barrier! Marked with the sacred exit symbol 🚪. Unlocks the outside world.'
    },
    interactables: [
      {
        id: 'r3_master_term',
        name: 'Master Core Terminal',
        x: 6,
        y: 5,
        width: 2,
        height: 2,
        spriteType: 'terminal',
        minigameType: 'pong',
        rewardKana: { id: 'k_de', character: 'で', romaji: 'de', script: 'hiragana' },
        interactionRadius: 2.2,
        description: 'High-velocity paddle reflex trial against the master AI core.'
      },
      {
        id: 'r3_launcher',
        name: 'Trajectory Catapult',
        x: 20,
        y: 5,
        width: 2,
        height: 2,
        spriteType: 'arcade',
        minigameType: 'angry_birds',
        rewardKana: { id: 'k_gu', character: 'ぐ', romaji: 'gu', script: 'hiragana' },
        interactionRadius: 2.2,
        description: 'An elastic slingshot artillery cradle targeting vault fortifications.'
      },
      {
        id: 'r3_dartboard',
        name: 'Precision Dart Sensor',
        x: 5,
        y: 11,
        width: 2,
        height: 2,
        spriteType: 'switchboard',
        minigameType: 'darts',
        rewardKana: { id: 'k_chi', character: 'ち', romaji: 'chi', script: 'hiragana' },
        interactionRadius: 2.2,
        description: 'A dual-axis timing slider target racing down from 200 points.'
      },
      {
        id: 'r3_runway',
        name: 'Escape Runway Simulator',
        x: 21,
        y: 11,
        width: 2,
        height: 2,
        spriteType: 'terrarium',
        minigameType: 'lane_runner',
        rewardKana: { id: 'k_ho', character: 'ほ', romaji: 'ho', script: 'hiragana' },
        interactionRadius: 2.2,
        description: 'A 3-lane holographic sprint dodging vault defense barriers.'
      },
      {
        id: 'r3_radar',
        name: 'Naval Sonar Radar',
        x: 7,
        y: 15,
        width: 2,
        height: 2,
        spriteType: 'safe',
        minigameType: 'sea_battle',
        rewardKana: { id: 'k_shi', character: 'し', romaji: 'shi', script: 'hiragana' },
        interactionRadius: 2.2,
        description: 'A naval radar station tracking and sinking cloaked vessels.'
      },
      {
        id: 'r3_janken',
        name: 'Janken Guardian Pedestal',
        x: 13,
        y: 8,
        width: 2,
        height: 2,
        spriteType: 'altar',
        minigameType: 'rock_paper_scissors',
        rewardKana: { id: 'k_mizu_mi', character: 'み', romaji: 'mi', script: 'hiragana' },
        interactionRadius: 2.2,
        description: 'A ceremonial stone guardian challenging you to Janken.'
      },
      {
        id: 'r3_matrix',
        name: 'Pair Memory Array',
        x: 19,
        y: 15,
        width: 2,
        height: 2,
        spriteType: 'chest',
        minigameType: 'card_match',
        rewardKana: { id: 'k_zu', character: 'ず', romaji: 'zu', script: 'hiragana' },
        interactionRadius: 2.2,
        description: 'A grid of holographic cards testing elemental pair recall.'
      }
    ],
    decorations: [
      { x: 3, y: 17, type: 'plant', solid: true, width: 1, height: 1 },
      { x: 22, y: 17, type: 'plant', solid: true, width: 1, height: 1 },
      { x: 11, y: 12, type: 'rug', solid: false, width: 4, height: 3 },
      { x: 8, y: 2, type: 'window', solid: false, width: 2, height: 1 },
      { x: 18, y: 2, type: 'window', solid: false, width: 2, height: 1 },
      { x: 2, y: 7, type: 'shelf', solid: true, width: 1, height: 3 },
      { x: 23, y: 7, type: 'shelf', solid: true, width: 1, height: 3 },
    ]
  }
];
