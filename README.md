# ⛩️ Kana Escape Room (かな脱出)

> **An open-source retro pixel-art Japanese language learning escape room game created by VCHS Studios using AI.**

🌐 **Live Game**: [https://kana-escape-room.ai.studio/](https://kana-escape-room.ai.studio/)

[![Play Live](https://img.shields.io/badge/Play_Live-kana--escape--room.ai.studio-emerald?style=for-the-badge&logo=googlechrome&logoColor=white)](https://kana-escape-room.ai.studio/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)]
[![React: 19](https://img.shields.io/badge/React-19-blue.svg)]
[![TypeScript: 5](https://img.shields.io/badge/TypeScript-5-blue.svg)]
[![Tailwind: 4](https://img.shields.io/badge/TailwindCSS-v4-cyan.svg)]

---

## 🎮 Overview

**Kana Escape Room** is an interactive, story-driven retro 16-bit RPG escape room designed to teach Japanese Kana (Hiragana & Katakana) and practical vocabulary through engaging game mechanics.

Trapped inside mysterious chambers, you explore retro workshops, ancient archives, and sacred vault gateways. By solving unique arcade trials and puzzles, you discover Kana syllables, combine them at the word-crafting workbench to forge target Japanese key words (such as **かぎ** `[kagi]` *Key*, **とびら** `[tobira]` *Door*, and **でぐち** `[deguchi]` *Exit*), unlock exit gateways, and escape!

---

## ✨ Features

- **3 Progressive Japanese Themed Escape Rooms**:
  - **Room 1: The Cyber Akihabara Workshop (`秋葉原・電脳工房`)** — Retro computing & arcade den with hanging paper Chōchin lanterns, cedar parquet floors, and Ichimatsu checkerboard motifs (*Target: かぎ / Key*).
  - **Room 2: The Grand Ryokan Archive (`古文書院・茶室`)** — Ancient Japanese library with sliding Shoji screen doors, bonsai trees, candle sconces, and Asanoha hemp-leaf motifs (*Target: とびら / Door*).
  - **Room 3: The Sacred Torii Sanctum (`神聖鳥居・月光の神域`)** — Moonlit shrine complex featuring woven Tatami mats, drifting Sakura Fubuki cherry blossoms, and a majestic Vermillion Torii Gate (*Target: でぐち / Exit*).

- **20+ Unique Arcade Minigames & Puzzles**:
  - *Reflex & Timing*: Timed Passcode Decryption, Pong Core Battle, Flappy Kana Glider, Lane Runner Obstacle Dodge.
  - *Classic Retro Arcades*: Snake, 2048, Wall Breaker (Breakout), Trajectory Catapult (Slingshot), Precision Darts.
  - *Logic & Strategy*: Sliding Tile Puzzle, Match-3 Gem Align, Tic-Tac-Toe Minimax, Dots & Boxes Grid, Sea Battle (Battleship), Rock-Paper-Scissors Duel, Memory Sequence Flashing, Card Flip Pair Matching, Mechanical Bolts Disassembly, Falling Kana Basket Catcher, Educational Japanese Color-Matching Wires.

- **Dual-Engine Japanese Pronunciation Audio**:
  - Pre-cached offline native voice audio clips for all Kana syllables, vocabulary words, and colors.
  - Automatic fallback to browser SpeechSynthesis API.
  - Natural acoustic cadence between syllables and words during word crafting, with manual replay buttons.

- **Mobile & Desktop Responsive Engine**:
  - Live aspect ratio switcher supporting **PC 16:9 Widescreen** and **Mobile 3:2** ratios.
  - Toggleable on-screen virtual 8-way D-Pad and action buttons for smartphone and tablet touch gameplay.
  - Maximized playable viewport eliminating dead margins.

- **Dynamic In-Room Kana Shuffle**:
  - Randomizes available reward letters across stations in each chamber per run, ensuring endless replayability while strictly guaranteeing 100% word solvability.

- **Interactive Word Crafter & Japanese Dictionary**:
  - Freely arrange Kana onto crafting slots to discover over 1,500+ recognized Japanese words.
  - Full dictionary metadata display: Hiragana/Katakana script, Kanji equivalents, Romaji pronunciation, English meanings, and icon representations.

- **8-Directional Pixel Character Movement**:
  - Authentic 8-way movement animations (including 3/4 isometric diagonal views: down-left, down-right, up-left, up-right).
  - Grounded walking cadence with weighted vertical step-bobbing.
  - Surface-acoustic footsteps (wood parquet, stone tile, tatami straw) and tactile collision wall bumping sound effects.

- **Subtle Atmospheric Pixel Ambience**:
  - Sakura Fubuki falling cherry blossom petals with organic sine-wave wind sway physics.
  - Hanging paper Chōchin lantern glows, candle wall sconces, and ancient stone lanterns (*Tōrō*).
  - Floating shrine spirit embers (*Hitodama*) and golden dust motes.

- **Named Runs Hall of Fame Leaderboard & Save Data Migration**:
  - Name and record individual escape attempts sorted by fastest escape time and Kana collected.
  - Run Inspector: Click any leaderboard entry to review its full summary and crafted Japanese vocabulary.
  - JSON Save Data Backup & Transfer tool for cross-device migration.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite 8
- **Styling**: Tailwind CSS v4
- **Rendering**: HTML5 2D Canvas (Pixel-art rendering with nearest-neighbor crisp scaling)
- **Audio Engine**: Web Audio API (Synthesized procedural SFX & generative soundscapes)
- **Visual FX**: Canvas Confetti

---

## 🚀 Installation & Running Instructions

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed:
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher (comes with Node.js)

### 1. Clone the Repository

```bash
git clone https://github.com/GVK-007/Kana-Escape-Room.git
cd Kana-Escape-Room
```

### 2. Install Dependencies

Install all required npm packages:

```bash
npm install
```

### 3. Run the Development Server

Start the local Vite dev server:

```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

### 4. Build for Production

To create an optimized production build:

```bash
npm run build
```

The compiled assets will be placed in the `dist/` directory.

### 5. Preview Production Build

To test the production build locally:

```bash
npm run preview
```

### 6. Lint & Type Check

To verify TypeScript types across the codebase:

```bash
npm run lint
```

---

## 🕹️ Controls & Keybindings

| Key / Action | Function |
| :--- | :--- |
| <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> or <kbd>Arrow Keys</kbd> | Move character in 8 directions (supports diagonal movement) |
| <kbd>E</kbd> | Interact with stations, consoles, puzzles, and doors |
| <kbd>I</kbd> | Open Kana Inventory & Word Crafting Workbench |
| <kbd>ESC</kbd> | Pause Menu / Volume Controls / Close modals |

---

## 📁 Project Structure

```
Kana-Escape-Room/
├── public/                 # Static assets & audio
│   ├── audio/              # Pre-cached Japanese pronunciation voice clips
│   └── favicon.svg         # Pixel-art Torii & Key application icon
├── scripts/                # Asset tooling (audio downloader)
├── src/
│   ├── components/
│   │   ├── inventory/      # Word crafting workbench & inventory modal
│   │   ├── minigames/      # 20+ retro arcade & puzzle trial minigames
│   │   └── ui/             # Title screen, leaderboard, HUD, save transfer, modals
│   ├── data/
│   │   ├── characters.ts   # Playable explorers & palettes
│   │   ├── dictionary.ts   # 1,500+ Japanese vocabulary dictionary
│   │   └── rooms.ts        # Room definitions, shuffle engine & puzzle layouts
│   ├── game/
│   │   ├── AtmosphericEffects.ts # Sakura petals, Chōchin lanterns, leaf wisps
│   │   └── GameViewport.tsx      # Canvas game loop, viewport scaling & touch D-pad
│   ├── types/
│   │   └── game.ts         # TypeScript definitions
│   ├── utils/
│   │   ├── audio.ts        # Web Audio synthesizer & Japanese voice pronunciation
│   │   ├── leaderboard.ts  # Run persistence & ranking algorithms
│   │   ├── pixelArt.ts     # Procedural pixel-art sprites (Torii, Tatami, Shoji)
│   │   ├── saveData.ts     # Save data JSON import/export serialization
│   │   ├── theme.ts        # Traditional Wagara motifs & room aesthetic engine
│   │   └── useDeviceMode.ts# Responsive PC 16:9 / Mobile 3:2 layout detector
│   ├── App.tsx             # Main game state controller
│   └── main.tsx            # Application entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 📝 Changelog

### 🌸 Version 1.0.0 — Japanese Club Orientation & Mobile Overhaul

#### ⛩️ Progressive Japanese Aesthetic & Environmental Design
- **Chamber 1: The Cyber Akihabara Workshop (`秋葉原・電脳工房`)**:
  - Retro computing & Dagashiya game den workshop with cedar parquet floors and cyber-brick walls with brass conduits.
  - Traditional **Ichimatsu (市松模様)** checkerboard patterns, ambient cyber scanlines, and warm hanging paper **Chōchin (提灯)** lanterns.
- **Chamber 2: The Grand Ryokan Archive (`古文書院・茶室`)**:
  - Traditional Edo-era library and tea study with mossy stone walkways, Shoji paper screen walls (**障子**), and sliding Kumiko lattice doors with bronze recessed ring pulls.
  - Handcrafted ceramic potted **Bonsai (盆栽)** trees, warm candle sconces, golden dust motes, and **Asanoha (麻の葉模様)** hemp-leaf lattice patterns with drifting green bamboo/tea leaves.
- **Chamber 3: The Sacred Torii Sanctum (`神聖鳥居・月光の神域`)**:
  - Moonlit shrine complex featuring hand-woven **Tatami (畳)** mats with authentic patterned fabric borders (*Tatami-beri*), vermillion lacquer shrine pillars over white plaster, and stone *Tōrō* lanterns.
  - Majestic **Vermillion Torii Gate (鳥居)** adorned with braided **Shimenawa (注連縄)** sacred rope and zigzag white **Shide (紙垂)** paper pendants that unlock into a glowing golden celestial portal.
  - **Sakura Fubuki (桜吹雪)** cherry blossom swirl with dynamic sine-wave wind physics, altar spirit embers (*Hitodama*), and **Seigaiha (青海波模様)** ocean wave motifs.
- **Authentic Japanese Seal Stamps (判子 / Hanko)**:
  - Custom red inkan seals stamped dynamically upon reward collection (`見事` / Splendid!) and chamber clears (`見事`, `合格` / Passed!, `皆伝` / Mastery!).

#### 🔊 Audio & Pronunciation System
- **Offline Voice Audio Library**: Pre-cached voice pronunciations for all Kana syllables, vocabulary words, and colors (`public/audio/`) with automatic fallback to browser SpeechSynthesis.
- **Natural Speech Cadence**: Added deliberate acoustic pauses between syllables and words during word-crafting to eliminate rushed/overlapping audio.
- **Audio Replay Controls**: Dedicated `🔊 Pronunciation` replay buttons in the Kana reward screen, Word Builder, and door clue modals.
- **Reward Chime Fix**: Resolved auto-repeating voice audio during reward celebrations; pronunciation plays once and allows manual replay.

#### 📱 Mobile & Responsive Display System
- **Device Mode Switcher**: Added responsive layout engine supporting both **PC 16:9 Widescreen** and **Mobile 3:2** aspect ratios with live aspect-ratio toggling.
- **Virtual Touch Controls**: Built-in 8-way on-screen D-Pad and responsive action buttons (`[E] ACTION / PLAY`, `🎒 BAG [I]`) with toggleable visibility for smartphones and tablets.
- **Playfield Expansion**: Enlarged minigame viewports and responsive modal scaling, maximizing playable screen real estate on both desktop monitors and mobile devices.

#### 🎮 Replayability & Educational Minigames
- **In-Room Kana Letter Randomization**: Shuffles available reward Kana letters among the interactables within each room per run, ensuring high replayability while strictly preserving 100% solvability for door unlock words (`かぎ`, `とびら`, `でぐち`).
- **Color Matching Wires Overhaul**: Rewrote the circuit box puzzle to teach Japanese colors by pairing English wire leads with Japanese color names (`あか`, `あお`, `みどり`, `きいろ`, `むらさき`), Kanji equivalents, and Romaji pronunciations.
- **Universal Minigame Reset**: Added dedicated `[R] RESET` button to all minigame cabinets to quickly retry puzzles without backing out.

#### 💾 Save Data Backup & Migration
- **Save Transfer Modal**: Added JSON export and import modal accessible from the Title Screen for easy progress backup, restore, and transfer across devices.

#### 🌐 Clean English UI Navigation
- Preserved clean, intuitive English labels, buttons, headers, and HUD badges to ensure effortless navigation for club orientation participants while learning Japanese vocabulary.

---

## 📜 Credits & License

- **Developer**: Created by **VCHS Studios** using AI.
- **License**: Released as an open-source project under the [MIT License](LICENSE).
- **Contributions**: Contributions, bug reports, and suggestions are welcome via GitHub pull requests and issues.
