// Atmospheric ambient effects: floating dust motes, sakura petals, flickering candles & lanterns

export interface AmbientParticle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
  baseAlpha: number;
  phase: number;
  phaseSpeed: number;
  color: string;
  type: 'mote' | 'sakura' | 'ember';
  swayAmp?: number;
  rot?: number;
}

export interface CandleLight {
  x: number; // tile x
  y: number; // tile y
  radius: number; // in pixels
  color: string;
  type: 'candle' | 'shrine_lantern' | 'terminal_led';
  flickerSpeed: number;
  flickerOffset: number;
}

export class AtmosphericSystem {
  private particles: AmbientParticle[] = [];
  private candles: CandleLight[] = [];
  private roomId: string = '';
  private widthPx: number = 0;
  private heightPx: number = 0;
  private tick: number = 0;

  public init(roomId: string, roomWidthTiles: number, roomHeightTiles: number, tileSize: number = 16) {
    this.roomId = roomId;
    this.widthPx = roomWidthTiles * tileSize;
    this.heightPx = roomHeightTiles * tileSize;
    this.tick = 0;
    this.particles = [];
    this.candles = [];

    // Setup room-specific candle and lantern locations
    if (roomId === 'room-1') {
      // Detective's Workshop: Blinking terminal status LEDs and warm desk lamps
      this.candles = [
        { x: 3, y: 2, radius: 24, color: 'rgba(56, 189, 248, 0.12)', type: 'terminal_led', flickerSpeed: 0.05, flickerOffset: 0 },
        { x: 19, y: 2, radius: 28, color: 'rgba(250, 204, 21, 0.15)', type: 'candle', flickerSpeed: 0.07, flickerOffset: 1.5 },
        { x: 9, y: 3.8, radius: 22, color: 'rgba(34, 197, 94, 0.10)', type: 'terminal_led', flickerSpeed: 0.08, flickerOffset: 3.2 },
        { x: 18, y: 8.8, radius: 24, color: 'rgba(168, 85, 247, 0.12)', type: 'terminal_led', flickerSpeed: 0.06, flickerOffset: 2.1 },
      ];

      // Subtle atmospheric dust motes floating in sunbeams
      const count = 32;
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.widthPx,
          y: Math.random() * this.heightPx,
          size: Math.random() > 0.7 ? 2 : 1,
          vx: (Math.random() - 0.45) * 0.18,
          vy: -0.08 - Math.random() * 0.12,
          alpha: 0.2 + Math.random() * 0.5,
          baseAlpha: 0.2 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
          phaseSpeed: 0.02 + Math.random() * 0.03,
          color: Math.random() > 0.4 ? '#fef08a' : '#bae6fd',
          type: 'mote',
        });
      }
    } else if (roomId === 'room-2') {
      // The Grand Archive: Ancient library wall sconces with flickering candles & glowing golden motes
      this.candles = [
        { x: 5, y: 1.6, radius: 36, color: 'rgba(245, 158, 11, 0.22)', type: 'candle', flickerSpeed: 0.09, flickerOffset: 0.5 },
        { x: 19, y: 1.6, radius: 36, color: 'rgba(245, 158, 11, 0.22)', type: 'candle', flickerSpeed: 0.08, flickerOffset: 2.7 },
        { x: 12, y: 7.6, radius: 32, color: 'rgba(251, 191, 36, 0.25)', type: 'candle', flickerSpeed: 0.11, flickerOffset: 1.1 },
        { x: 2, y: 5.5, radius: 26, color: 'rgba(245, 158, 11, 0.18)', type: 'candle', flickerSpeed: 0.07, flickerOffset: 4.2 },
        { x: 22, y: 5.5, radius: 26, color: 'rgba(245, 158, 11, 0.18)', type: 'candle', flickerSpeed: 0.10, flickerOffset: 3.3 },
      ];

      // Floating golden parchment dust & ancient library wisps
      const count = 42;
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.widthPx,
          y: Math.random() * this.heightPx,
          size: Math.random() > 0.6 ? 2 : 1,
          vx: (Math.random() - 0.5) * 0.15,
          vy: -0.06 - Math.random() * 0.10,
          alpha: 0.3 + Math.random() * 0.5,
          baseAlpha: 0.3 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
          phaseSpeed: 0.015 + Math.random() * 0.025,
          color: Math.random() > 0.3 ? '#fde047' : '#fed7aa',
          type: 'mote',
        });
      }
    } else {
      // Room 3: The Secret Vault Gateway (Shrine / Sanctuary)
      // Sacred Torii stone lanterns & altar candles with flickering warm flames
      this.candles = [
        // Lanterns flanking the final Torii Exit Gate
        { x: 11, y: 1.8, radius: 42, color: 'rgba(251, 146, 60, 0.26)', type: 'shrine_lantern', flickerSpeed: 0.10, flickerOffset: 0.2 },
        { x: 16, y: 1.8, radius: 42, color: 'rgba(251, 146, 60, 0.26)', type: 'shrine_lantern', flickerSpeed: 0.09, flickerOffset: 1.8 },
        // Sanctuary perimeter lanterns
        { x: 4, y: 4.5, radius: 34, color: 'rgba(251, 191, 36, 0.20)', type: 'shrine_lantern', flickerSpeed: 0.08, flickerOffset: 3.4 },
        { x: 23, y: 4.5, radius: 34, color: 'rgba(251, 191, 36, 0.20)', type: 'shrine_lantern', flickerSpeed: 0.11, flickerOffset: 2.1 },
        { x: 10, y: 16.5, radius: 32, color: 'rgba(251, 146, 60, 0.20)', type: 'candle', flickerSpeed: 0.12, flickerOffset: 4.5 },
        { x: 17, y: 16.5, radius: 32, color: 'rgba(251, 146, 60, 0.20)', type: 'candle', flickerSpeed: 0.07, flickerOffset: 0.9 },
      ];

      // Drifting Sakura petals and sacred shrine spirit embers
      const count = 38;
      for (let i = 0; i < count; i++) {
        const isPetal = i % 2 === 0;
        this.particles.push({
          x: Math.random() * this.widthPx,
          y: Math.random() * this.heightPx,
          size: isPetal ? 2 : 1,
          vx: 0.15 + Math.random() * 0.25, // gentle rightward breeze
          vy: isPetal ? 0.25 + Math.random() * 0.35 : -0.15 - Math.random() * 0.2, // petals drift down, embers float up
          alpha: 0.4 + Math.random() * 0.5,
          baseAlpha: 0.4 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
          phaseSpeed: 0.03 + Math.random() * 0.03,
          color: isPetal
            ? (['#fbcfe8', '#f472b6', '#fda4af'][Math.floor(Math.random() * 3)])
            : '#fef08a',
          type: isPetal ? 'sakura' : 'ember',
          swayAmp: isPetal ? 0.6 : 0.2,
          rot: Math.random() * Math.PI * 2,
        });
      }
    }
  }

  public update() {
    this.tick += 1;

    for (const p of this.particles) {
      p.phase += p.phaseSpeed;

      // Update positions with organic sine wave flutter
      if (p.type === 'sakura') {
        p.x += p.vx + Math.sin(p.phase) * (p.swayAmp || 0.5);
        p.y += p.vy;
        p.alpha = p.baseAlpha * (0.7 + Math.sin(p.phase * 0.8) * 0.3);

        // Wrap around room bounds
        if (p.y > this.heightPx + 4) {
          p.y = -4;
          p.x = Math.random() * this.widthPx;
        }
        if (p.x > this.widthPx + 4) {
          p.x = -4;
        }
      } else if (p.type === 'ember') {
        p.x += p.vx + Math.sin(p.phase * 1.5) * 0.3;
        p.y += p.vy;
        p.alpha = p.baseAlpha * (0.6 + Math.sin(p.phase * 2) * 0.4);

        if (p.y < -4) {
          p.y = this.heightPx + 2;
          p.x = Math.random() * this.widthPx;
        }
      } else {
        // Floating dust mote
        p.x += p.vx + Math.cos(p.phase) * 0.12;
        p.y += p.vy;
        p.alpha = p.baseAlpha * (0.5 + Math.sin(p.phase) * 0.5);

        // Wrap around
        if (p.y < -4) {
          p.y = this.heightPx + 2;
          p.x = Math.random() * this.widthPx;
        }
        if (p.x < -4) p.x = this.widthPx + 2;
        if (p.x > this.widthPx + 4) p.x = -2;
      }
    }
  }

  // 1. Draw warm ambient floor glow rings beneath objects
  public drawFloorGlow(ctx: CanvasRenderingContext2D, tileSize: number) {
    for (const candle of this.candles) {
      const flicker =
        Math.sin(this.tick * candle.flickerSpeed + candle.flickerOffset) * 0.2 +
        Math.cos(this.tick * (candle.flickerSpeed * 1.6) + candle.flickerOffset) * 0.1;

      const currentRadius = Math.max(12, candle.radius * (1 + flicker * 0.2));
      const centerX = candle.x * tileSize + 8;
      const centerY = candle.y * tileSize + 8;

      const grad = ctx.createRadialGradient(
        centerX,
        centerY,
        2,
        centerX,
        centerY,
        currentRadius
      );
      grad.addColorStop(0, candle.color);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 2. Draw wall candle sconces, shrine lanterns, and animated pixel flame
  public drawCandlesAndLanterns(ctx: CanvasRenderingContext2D, tileSize: number) {
    for (const candle of this.candles) {
      const px = Math.round(candle.x * tileSize);
      const py = Math.round(candle.y * tileSize);

      const flickerVal =
        Math.sin(this.tick * candle.flickerSpeed + candle.flickerOffset) +
        Math.cos(this.tick * (candle.flickerSpeed * 2.3) + candle.flickerOffset);
      const flameShift = flickerVal > 0.4 ? 1 : flickerVal < -0.4 ? -1 : 0;
      const flameHeight = flickerVal > 0.2 ? 4 : 3;

      if (candle.type === 'candle') {
        // Pixel Brass Wall Bracket
        ctx.fillStyle = '#78350f'; // Dark bronze bracket
        ctx.fillRect(px + 6, py + 10, 4, 3);
        ctx.fillRect(px + 7, py + 8, 2, 2);

        // Candle Wax Body
        ctx.fillStyle = '#fef3c7'; // Cream wax
        ctx.fillRect(px + 6, py + 4, 4, 5);
        ctx.fillStyle = '#d97706'; // Wax shade
        ctx.fillRect(px + 9, py + 5, 1, 4);

        // Wick
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(px + 7, py + 3, 2, 1);

        // Animated Pixel Flame
        // Outer orange flame
        ctx.fillStyle = '#f97316';
        ctx.fillRect(px + 7 + flameShift, py + 3 - flameHeight, 2, flameHeight);
        // Inner intense yellow core
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(px + 7 + flameShift, py + 2 - (flameHeight > 3 ? 1 : 0), 2, 2);
        // White-hot tip
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(px + 8 + flameShift, py + 2 - (flameHeight > 3 ? 1 : 0), 1, 1);
      } else if (candle.type === 'shrine_lantern') {
        // Japanese Stone Toro / Lantern
        // Roof cap
        ctx.fillStyle = '#475569';
        ctx.fillRect(px + 3, py + 2, 10, 2);
        ctx.fillRect(px + 4, py + 1, 8, 1);
        ctx.fillStyle = '#334155';
        ctx.fillRect(px + 5, py, 6, 1);

        // Lantern Chamber (Paper shoji with inner fire)
        ctx.fillStyle = '#78350f'; // Wood frame
        ctx.fillRect(px + 4, py + 4, 8, 6);
        ctx.fillStyle = '#fbbf24'; // Lit paper center
        ctx.fillRect(px + 5, py + 5, 6, 4);

        // Inner glowing sacred flame
        ctx.fillStyle = '#fffbeb';
        ctx.fillRect(px + 7 + flameShift, py + 6, 2, 2);

        // Stone Base
        ctx.fillStyle = '#475569';
        ctx.fillRect(px + 5, py + 10, 6, 3);
        ctx.fillRect(px + 4, py + 13, 8, 2);
      } else {
        // Terminal Status LED Beacon
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(px + 6, py + 8, 4, 4);

        const isLit = Math.sin(this.tick * candle.flickerSpeed * 2 + candle.flickerOffset) > -0.2;
        ctx.fillStyle = isLit ? '#38bdf8' : '#0369a1';
        ctx.fillRect(px + 7, py + 9, 2, 2);
        if (isLit) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(px + 7, py + 9, 1, 1);
        }
      }
    }
  }

  // 3. Draw Foreground Floating Dust Motes, Sakura Petals, and Embers
  public drawAtmosphere(ctx: CanvasRenderingContext2D) {
    ctx.save();

    for (const p of this.particles) {
      if (p.alpha <= 0.01) continue;

      ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
      ctx.fillStyle = p.color;

      const px = Math.round(p.x);
      const py = Math.round(p.y);

      if (p.type === 'sakura') {
        // 2x2 or 3x2 delicate cherry blossom petal
        ctx.fillRect(px, py, 2, 2);
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(px + 1, py + 1, 1, 1);
      } else if (p.type === 'ember') {
        // 1px bright firefly / altar ember spark with faint halo
        ctx.fillRect(px, py, 1, 1);
      } else {
        // Floating dust mote: soft square pixel
        ctx.fillRect(px, py, p.size, p.size);
      }
    }

    ctx.restore();
  }
}
