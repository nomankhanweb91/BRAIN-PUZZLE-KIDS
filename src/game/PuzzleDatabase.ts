/**
 * Puzzle Database: 52 Unique, Hand-Crafted Children's Vector Puzzle Illustrations
 * Rendered with high-contrast, playful cartoon aesthetics on HTML5 Canvas.
 * 100% Offline, resolution independent, zero remote asset dependencies.
 */

export type PuzzleCategory = 'animals' | 'fruits' | 'vehicles' | 'nature' | 'dinosaurs';
export type GridDifficulty = 2 | 3 | 4 | 5 | 6;

export interface PuzzleDefinition {
  id: string;
  title: string;
  category: PuzzleCategory;
  defaultGrid: GridDifficulty;
  themeColor: string;
  icon: string;
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
}

// Drawing helpers for cute children's vector art
function drawEye(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  // Eye white
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = Math.max(2, r * 0.15);
  ctx.strokeStyle = '#1e293b';
  ctx.stroke();

  // Dark pupil
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.65, 0, Math.PI * 2);
  ctx.fill();

  // Eye shines (sparkles)
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(cx - r * 0.22, cy - r * 0.22, r * 0.28, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx + r * 0.2, cy + r * 0.2, r * 0.14, 0, Math.PI * 2);
  ctx.fill();
}

function drawCheek(ctx: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number) {
  ctx.fillStyle = 'rgba(244, 114, 182, 0.45)';
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawSmile(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = Math.max(3, r * 0.2);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0.2, Math.PI - 0.2);
  ctx.stroke();
}

function drawBackground(ctx: CanvasRenderingContext2D, w: number, h: number, skyTop: string, skyBot: string, grassCol: string) {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, skyTop);
  grad.addColorStop(0.65, skyBot);
  grad.addColorStop(0.65, grassCol);
  grad.addColorStop(1, '#15803d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Gentle rolling hill
  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.ellipse(w * 0.5, h * 0.85, w * 0.7, h * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();

  // Fluffy clouds in sky
  drawFluffyCloud(ctx, w * 0.2, h * 0.18, w * 0.12);
  drawFluffyCloud(ctx, w * 0.75, h * 0.15, w * 0.14);

  // Tiny friendly flowers on grass
  drawFlower(ctx, w * 0.15, h * 0.85, '#f43f5e');
  drawFlower(ctx, w * 0.85, h * 0.88, '#eab308');
  drawFlower(ctx, w * 0.5, h * 0.92, '#38bdf8');
}

function drawFluffyCloud(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.6, 0, Math.PI * 2);
  ctx.arc(cx + r * 0.45, cy - r * 0.1, r * 0.5, 0, Math.PI * 2);
  ctx.arc(cx - r * 0.45, cy + r * 0.05, r * 0.45, 0, Math.PI * 2);
  ctx.arc(cx + r * 0.85, cy + r * 0.15, r * 0.4, 0, Math.PI * 2);
  ctx.fill();
}

function drawFlower(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.fillStyle = color;
  for (let i = 0; i < 5; i++) {
    const ang = (i * Math.PI * 2) / 5;
    ctx.beginPath();
    ctx.arc(x + Math.cos(ang) * 6, y + Math.sin(ang) * 6, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(x, y, 3.5, 0, Math.PI * 2);
  ctx.fill();
}

// -------------------------------------------------------------
// PUZZLE DEFINITIONS (52 Levels across 5 Categories)
// -------------------------------------------------------------

export const ALL_PUZZLES: PuzzleDefinition[] = [
  // ================= ANIMALS (1-12) =================
  {
    id: 'animal_1',
    title: 'Ellie the Elephant',
    category: 'animals',
    defaultGrid: 2,
    themeColor: '#38bdf8',
    icon: '🐘',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#7dd3fc', '#bae6fd', '#4ade80');
      const cx = w * 0.5;
      const cy = h * 0.55;

      // Elephant Body
      ctx.fillStyle = '#94a3b8';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(cx, cy, w * 0.28, h * 0.26, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Big Round Ears
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.ellipse(cx - w * 0.22, cy - h * 0.08, w * 0.15, h * 0.2, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.ellipse(cx - w * 0.22, cy - h * 0.08, w * 0.09, h * 0.13, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Right Ear
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.ellipse(cx + w * 0.22, cy - h * 0.08, w * 0.15, h * 0.2, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.ellipse(cx + w * 0.22, cy - h * 0.08, w * 0.09, h * 0.13, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Elephant Trunk curled up happily
      ctx.fillStyle = '#94a3b8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.06, cy + h * 0.05);
      ctx.quadraticCurveTo(cx - w * 0.12, cy + h * 0.24, cx + w * 0.05, cy + h * 0.24);
      ctx.quadraticCurveTo(cx + w * 0.14, cy + h * 0.22, cx + w * 0.12, cy + h * 0.12);
      ctx.quadraticCurveTo(cx + w * 0.05, cy + h * 0.13, cx + w * 0.04, cy + h * 0.18);
      ctx.quadraticCurveTo(cx - w * 0.03, cy + h * 0.18, cx - w * 0.01, cy + h * 0.05);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Eyes & cheeks
      drawEye(ctx, cx - w * 0.1, cy - h * 0.05, w * 0.045);
      drawEye(ctx, cx + w * 0.1, cy - h * 0.05, w * 0.045);
      drawCheek(ctx, cx - w * 0.16, cy + h * 0.03, w * 0.045, h * 0.025);
      drawCheek(ctx, cx + w * 0.16, cy + h * 0.03, w * 0.045, h * 0.025);

      // Water droplets sprayed from trunk
      ctx.fillStyle = '#0284c7';
      [
        { x: cx + w * 0.16, y: cy + h * 0.05, r: 6 },
        { x: cx + w * 0.22, y: cy - h * 0.02, r: 7 },
        { x: cx + w * 0.26, y: cy + h * 0.03, r: 5 },
      ].forEach(d => {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      });
    },
  },
  {
    id: 'animal_2',
    title: 'Leo the Lion',
    category: 'animals',
    defaultGrid: 3,
    themeColor: '#f59e0b',
    icon: '🦁',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#fef08a', '#fed7aa', '#84cc16');
      const cx = w * 0.5;
      const cy = h * 0.52;

      // Big Fluffy Orange Mane
      ctx.fillStyle = '#ea580c';
      ctx.strokeStyle = '#9a3412';
      ctx.lineWidth = 4;
      const pet = 14;
      ctx.beginPath();
      for (let i = 0; i < pet; i++) {
        const ang = (i * Math.PI * 2) / pet;
        const rad = w * 0.32 + (i % 2 === 0 ? w * 0.05 : 0);
        const px = cx + Math.cos(ang) * rad;
        const py = cy + Math.sin(ang) * rad;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Lion Face
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(cx, cy, w * 0.22, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Ears
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(cx - w * 0.16, cy - h * 0.18, w * 0.065, 0, Math.PI * 2);
      ctx.arc(cx + w * 0.16, cy - h * 0.18, w * 0.065, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Muzzle
      ctx.fillStyle = '#fef3c7';
      ctx.beginPath();
      ctx.ellipse(cx, cy + h * 0.06, w * 0.1, h * 0.07, 0, 0, Math.PI * 2);
      ctx.fill();

      // Nose
      ctx.fillStyle = '#9a3412';
      ctx.beginPath();
      ctx.moveTo(cx, cy + h * 0.03);
      ctx.lineTo(cx - w * 0.03, cy + h * 0.01);
      ctx.lineTo(cx + w * 0.03, cy + h * 0.01);
      ctx.closePath();
      ctx.fill();

      // Eyes & cheeks & whiskers
      drawEye(ctx, cx - w * 0.09, cy - h * 0.04, w * 0.038);
      drawEye(ctx, cx + w * 0.09, cy - h * 0.04, w * 0.038);
      drawSmile(ctx, cx, cy + h * 0.05, w * 0.05);
      drawCheek(ctx, cx - w * 0.14, cy + h * 0.03, w * 0.035, h * 0.02);
      drawCheek(ctx, cx + w * 0.14, cy + h * 0.03, w * 0.035, h * 0.02);
    },
  },
  {
    id: 'animal_3',
    title: 'Pip the Panda',
    category: 'animals',
    defaultGrid: 3,
    themeColor: '#10b981',
    icon: '🐼',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#dcfce7', '#bbf7d0', '#22c55e');
      const cx = w * 0.5;
      const cy = h * 0.54;

      // Panda Ears
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(cx - w * 0.18, cy - h * 0.18, w * 0.08, 0, Math.PI * 2);
      ctx.arc(cx + w * 0.18, cy - h * 0.18, w * 0.08, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(cx, cy, w * 0.25, h * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Black Eye Patches
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.ellipse(cx - w * 0.09, cy - h * 0.03, w * 0.065, h * 0.055, -0.3, 0, Math.PI * 2);
      ctx.ellipse(cx + w * 0.09, cy - h * 0.03, w * 0.065, h * 0.055, 0.3, 0, Math.PI * 2);
      ctx.fill();

      // White eyes inside patches
      drawEye(ctx, cx - w * 0.09, cy - h * 0.03, w * 0.032);
      drawEye(ctx, cx + w * 0.09, cy - h * 0.03, w * 0.032);

      // Cute tiny triangle nose
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(cx, cy + h * 0.04, w * 0.025, 0, Math.PI * 2);
      ctx.fill();

      drawSmile(ctx, cx, cy + h * 0.06, w * 0.04);
      drawCheek(ctx, cx - w * 0.15, cy + h * 0.06, w * 0.04, h * 0.025);
      drawCheek(ctx, cx + w * 0.15, cy + h * 0.06, w * 0.04, h * 0.025);

      // Bamboo stalk in hand
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(cx + w * 0.18, cy + h * 0.25);
      ctx.lineTo(cx + w * 0.25, cy - h * 0.1);
      ctx.stroke();
    },
  },
  {
    id: 'animal_4',
    title: 'Momo the Monkey',
    category: 'animals',
    defaultGrid: 3,
    themeColor: '#d97706',
    icon: '🐵',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#fef3c7', '#fed7aa', '#65a30d');
      const cx = w * 0.5;
      const cy = h * 0.52;

      // Ears
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(cx - w * 0.22, cy - h * 0.04, w * 0.09, 0, Math.PI * 2);
      ctx.arc(cx + w * 0.22, cy - h * 0.04, w * 0.09, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fde68a';
      ctx.beginPath();
      ctx.arc(cx - w * 0.22, cy - h * 0.04, w * 0.05, 0, Math.PI * 2);
      ctx.arc(cx + w * 0.22, cy - h * 0.04, w * 0.05, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.fillStyle = '#92400e';
      ctx.beginPath();
      ctx.arc(cx, cy, w * 0.22, 0, Math.PI * 2);
      ctx.fill();

      // Face mask heart-shape
      ctx.fillStyle = '#fde68a';
      ctx.beginPath();
      ctx.arc(cx - w * 0.07, cy - h * 0.05, w * 0.09, 0, Math.PI * 2);
      ctx.arc(cx + w * 0.07, cy - h * 0.05, w * 0.09, 0, Math.PI * 2);
      ctx.ellipse(cx, cy + h * 0.06, w * 0.14, h * 0.09, 0, 0, Math.PI * 2);
      ctx.fill();

      drawEye(ctx, cx - w * 0.07, cy - h * 0.05, w * 0.038);
      drawEye(ctx, cx + w * 0.07, cy - h * 0.05, w * 0.038);
      drawSmile(ctx, cx, cy + h * 0.07, w * 0.06);

      // Banana in paw
      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx + w * 0.16, cy + h * 0.18, w * 0.08, -0.6, 1.2);
      ctx.stroke();
    },
  },
  {
    id: 'animal_5',
    title: 'Benny the Bunny',
    category: 'animals',
    defaultGrid: 2,
    themeColor: '#ec4899',
    icon: '🐰',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#fce7f3', '#fbcfe8', '#4ade80');
      const cx = w * 0.5;
      const cy = h * 0.58;

      // Long bunny ears
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(cx - w * 0.11, cy - h * 0.32, w * 0.06, h * 0.22, -0.15, 0, Math.PI * 2);
      ctx.ellipse(cx + w * 0.11, cy - h * 0.32, w * 0.06, h * 0.22, 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Ear pink inners
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.ellipse(cx - w * 0.11, cy - h * 0.32, w * 0.03, h * 0.15, -0.15, 0, Math.PI * 2);
      ctx.ellipse(cx + w * 0.11, cy - h * 0.32, w * 0.03, h * 0.15, 0.15, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx, cy, w * 0.24, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      drawEye(ctx, cx - w * 0.09, cy - h * 0.05, w * 0.036);
      drawEye(ctx, cx + w * 0.09, cy - h * 0.05, w * 0.036);
      drawCheek(ctx, cx - w * 0.15, cy + h * 0.04, w * 0.045, h * 0.025);
      drawCheek(ctx, cx + w * 0.15, cy + h * 0.04, w * 0.045, h * 0.025);

      // Pink nose
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.arc(cx, cy + h * 0.02, w * 0.025, 0, Math.PI * 2);
      ctx.fill();
      drawSmile(ctx, cx, cy + h * 0.05, w * 0.04);
    },
  },
  {
    id: 'animal_6',
    title: 'Gerry the Giraffe',
    category: 'animals',
    defaultGrid: 3,
    themeColor: '#eab308',
    icon: '🦒',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#fef9c3', '#fef08a', '#22c55e');
      const cx = w * 0.5;
      const cy = h * 0.45;

      // Long Neck
      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 4;
      ctx.fillRect(cx - w * 0.08, cy, w * 0.16, h * 0.55);

      // Brown spots on neck
      ctx.fillStyle = '#b45309';
      [
        { x: cx - w * 0.02, y: cy + h * 0.12, r: 16 },
        { x: cx + w * 0.03, y: cy + h * 0.28, r: 18 },
        { x: cx - w * 0.03, y: cy + h * 0.42, r: 20 },
      ].forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Head
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.ellipse(cx, cy, w * 0.18, h * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Ossicones (little horns)
      ctx.fillStyle = '#92400e';
      ctx.beginPath();
      ctx.arc(cx - w * 0.08, cy - h * 0.18, w * 0.03, 0, Math.PI * 2);
      ctx.arc(cx + w * 0.08, cy - h * 0.18, w * 0.03, 0, Math.PI * 2);
      ctx.fill();

      drawEye(ctx, cx - w * 0.07, cy - h * 0.03, w * 0.035);
      drawEye(ctx, cx + w * 0.07, cy - h * 0.03, w * 0.035);
      drawSmile(ctx, cx, cy + h * 0.06, w * 0.05);
      drawCheek(ctx, cx - w * 0.12, cy + h * 0.03, w * 0.035, h * 0.02);
      drawCheek(ctx, cx + w * 0.12, cy + h * 0.03, w * 0.035, h * 0.02);
    },
  },
  {
    id: 'animal_7',
    title: 'Toby the Tiger',
    category: 'animals',
    defaultGrid: 4,
    themeColor: '#ea580c',
    icon: '🐯',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#ffedd5', '#fed7aa', '#16a34a');
      const cx = w * 0.5;
      const cy = h * 0.52;

      // Head
      ctx.fillStyle = '#f97316';
      ctx.strokeStyle = '#c2410c';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, w * 0.24, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Tiger stripes
      ctx.fillStyle = '#1e293b';
      [-0.15, -0.05, 0.05, 0.15].forEach(xOff => {
        ctx.beginPath();
        ctx.moveTo(cx + w * xOff, cy - h * 0.2);
        ctx.lineTo(cx + w * (xOff - 0.02), cy - h * 0.12);
        ctx.lineTo(cx + w * (xOff + 0.02), cy - h * 0.12);
        ctx.fill();
      });

      // Cheeks & Muzzle
      ctx.fillStyle = '#ffedd5';
      ctx.beginPath();
      ctx.ellipse(cx, cy + h * 0.06, w * 0.12, h * 0.08, 0, 0, Math.PI * 2);
      ctx.fill();

      drawEye(ctx, cx - w * 0.09, cy - h * 0.04, w * 0.036);
      drawEye(ctx, cx + w * 0.09, cy - h * 0.04, w * 0.036);
      drawSmile(ctx, cx, cy + h * 0.06, w * 0.05);
    },
  },
  {
    id: 'animal_8',
    title: 'Barnaby Bear',
    category: 'animals',
    defaultGrid: 4,
    themeColor: '#78350f',
    icon: '🐻',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#e0f2fe', '#bae6fd', '#15803d');
      const cx = w * 0.5;
      const cy = h * 0.54;

      // Round ears
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(cx - w * 0.18, cy - h * 0.18, w * 0.08, 0, Math.PI * 2);
      ctx.arc(cx + w * 0.18, cy - h * 0.18, w * 0.08, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.fillStyle = '#92400e';
      ctx.beginPath();
      ctx.arc(cx, cy, w * 0.24, 0, Math.PI * 2);
      ctx.fill();

      // Snout
      ctx.fillStyle = '#fef3c7';
      ctx.beginPath();
      ctx.ellipse(cx, cy + h * 0.06, w * 0.11, h * 0.08, 0, 0, Math.PI * 2);
      ctx.fill();

      // Nose
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(cx, cy + h * 0.04, w * 0.03, 0, Math.PI * 2);
      ctx.fill();

      drawEye(ctx, cx - w * 0.09, cy - h * 0.04, w * 0.035);
      drawEye(ctx, cx + w * 0.09, cy - h * 0.04, w * 0.035);
      drawSmile(ctx, cx, cy + h * 0.07, w * 0.05);
    },
  },
  {
    id: 'animal_9',
    title: 'Penny the Penguin',
    category: 'animals',
    defaultGrid: 3,
    themeColor: '#0284c7',
    icon: '🐧',
    draw: (ctx, w, h) => {
      // Snowy scene
      drawBackground(ctx, w, h, '#bae6fd', '#e0f2fe', '#f8fafc');
      const cx = w * 0.5;
      const cy = h * 0.54;

      // Penguin Black Body
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.ellipse(cx, cy, w * 0.22, h * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Flippers
      ctx.beginPath();
      ctx.ellipse(cx - w * 0.22, cy + h * 0.05, w * 0.06, h * 0.15, -0.4, 0, Math.PI * 2);
      ctx.ellipse(cx + w * 0.22, cy + h * 0.05, w * 0.06, h * 0.15, 0.4, 0, Math.PI * 2);
      ctx.fill();

      // White Belly
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(cx, cy + h * 0.06, w * 0.15, h * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();

      // Beak
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx - w * 0.04, cy - h * 0.02);
      ctx.lineTo(cx + w * 0.04, cy - h * 0.02);
      ctx.closePath();
      ctx.fill();

      drawEye(ctx, cx - w * 0.08, cy - h * 0.08, w * 0.032);
      drawEye(ctx, cx + w * 0.08, cy - h * 0.08, w * 0.032);
      drawCheek(ctx, cx - w * 0.11, cy - h * 0.01, w * 0.03, h * 0.02);
      drawCheek(ctx, cx + w * 0.11, cy - h * 0.01, w * 0.03, h * 0.02);
    },
  },
  {
    id: 'animal_10',
    title: 'Danny the Dolphin',
    category: 'animals',
    defaultGrid: 4,
    themeColor: '#06b6d4',
    icon: '🐬',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#e0f2fe', '#38bdf8', '#0284c7');
      const cx = w * 0.5;
      const cy = h * 0.5;

      // Leaping Dolphin body curve
      ctx.fillStyle = '#38bdf8';
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(cx, cy, w * 0.32, h * 0.16, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // White underbelly
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(cx - w * 0.02, cy + h * 0.05, w * 0.25, h * 0.08, -0.3, 0, Math.PI * 2);
      ctx.fill();

      // Dorsal Fin
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.moveTo(cx, cy - h * 0.12);
      ctx.lineTo(cx - w * 0.08, cy - h * 0.05);
      ctx.lineTo(cx + w * 0.04, cy - h * 0.05);
      ctx.closePath();
      ctx.fill();

      drawEye(ctx, cx + w * 0.16, cy - h * 0.06, w * 0.032);
      drawSmile(ctx, cx + w * 0.22, cy - h * 0.02, w * 0.03);
    },
  },
  {
    id: 'animal_11',
    title: 'Ziggy the Zebra',
    category: 'animals',
    defaultGrid: 4,
    themeColor: '#475569',
    icon: '🦓',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#fef3c7', '#fed7aa', '#84cc16');
      const cx = w * 0.5;
      const cy = h * 0.52;

      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(cx, cy, w * 0.22, h * 0.26, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Black stripes
      ctx.fillStyle = '#1e293b';
      [-0.15, -0.05, 0.05, 0.15].forEach(yOff => {
        ctx.beginPath();
        ctx.moveTo(cx - w * 0.2, cy + h * yOff);
        ctx.lineTo(cx - w * 0.05, cy + h * (yOff + 0.02));
        ctx.lineTo(cx - w * 0.2, cy + h * (yOff + 0.04));
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(cx + w * 0.2, cy + h * yOff);
        ctx.lineTo(cx + w * 0.05, cy + h * (yOff + 0.02));
        ctx.lineTo(cx + w * 0.2, cy + h * (yOff + 0.04));
        ctx.fill();
      });

      drawEye(ctx, cx - w * 0.08, cy - h * 0.06, w * 0.035);
      drawEye(ctx, cx + w * 0.08, cy - h * 0.06, w * 0.035);
      drawSmile(ctx, cx, cy + h * 0.08, w * 0.05);
    },
  },
  {
    id: 'animal_12',
    title: 'Koko the Koala',
    category: 'animals',
    defaultGrid: 3,
    themeColor: '#64748b',
    icon: '🐨',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#dcfce7', '#bbf7d0', '#15803d');
      const cx = w * 0.5;
      const cy = h * 0.52;

      // Big fluffy fuzzy ears
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(cx - w * 0.22, cy - h * 0.12, w * 0.1, 0, Math.PI * 2);
      ctx.arc(cx + w * 0.22, cy - h * 0.12, w * 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.arc(cx - w * 0.22, cy - h * 0.12, w * 0.06, 0, Math.PI * 2);
      ctx.arc(cx + w * 0.22, cy - h * 0.12, w * 0.06, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(cx, cy, w * 0.23, 0, Math.PI * 2);
      ctx.fill();

      // Big Oval Black Koala Nose
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.ellipse(cx, cy + h * 0.03, w * 0.06, h * 0.08, 0, 0, Math.PI * 2);
      ctx.fill();

      drawEye(ctx, cx - w * 0.11, cy - h * 0.05, w * 0.035);
      drawEye(ctx, cx + w * 0.11, cy - h * 0.05, w * 0.035);
      drawSmile(ctx, cx, cy + h * 0.1, w * 0.04);
      drawCheek(ctx, cx - w * 0.14, cy + h * 0.04, w * 0.035, h * 0.02);
      drawCheek(ctx, cx + w * 0.14, cy + h * 0.04, w * 0.035, h * 0.02);
    },
  },

  // ================= FRUITS (13-22) =================
  {
    id: 'fruit_1',
    title: 'Juicy Red Apple',
    category: 'fruits',
    defaultGrid: 2,
    themeColor: '#ef4444',
    icon: '🍎',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#fef2f2', '#fee2e2', '#22c55e');
      const cx = w * 0.5;
      const cy = h * 0.55;

      // Stem & Green Leaf
      ctx.fillStyle = '#78350f';
      ctx.fillRect(cx - 5, cy - h * 0.35, 10, h * 0.15);

      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.ellipse(cx + w * 0.08, cy - h * 0.28, w * 0.09, h * 0.05, 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Apple Body
      ctx.fillStyle = '#dc2626';
      ctx.strokeStyle = '#991b1b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx - w * 0.12, cy - h * 0.05, w * 0.16, 0, Math.PI * 2);
      ctx.arc(cx + w * 0.12, cy - h * 0.05, w * 0.16, 0, Math.PI * 2);
      ctx.ellipse(cx, cy + h * 0.08, w * 0.24, h * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      drawEye(ctx, cx - w * 0.08, cy, w * 0.038);
      drawEye(ctx, cx + w * 0.08, cy, w * 0.038);
      drawSmile(ctx, cx, cy + h * 0.08, w * 0.05);
      drawCheek(ctx, cx - w * 0.14, cy + h * 0.06, w * 0.04, h * 0.025);
      drawCheek(ctx, cx + w * 0.14, cy + h * 0.06, w * 0.04, h * 0.025);
    },
  },
  {
    id: 'fruit_2',
    title: 'Sunny Banana',
    category: 'fruits',
    defaultGrid: 2,
    themeColor: '#eab308',
    icon: '🍌',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#fefce8', '#fef9c3', '#16a34a');
      const cx = w * 0.5;
      const cy = h * 0.52;

      // Curved banana shape
      ctx.fillStyle = '#fde047';
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(cx, cy, w * 0.32, h * 0.15, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Stem tips
      ctx.fillStyle = '#65a30d';
      ctx.beginPath();
      ctx.arc(cx - w * 0.28, cy - h * 0.14, 12, 0, Math.PI * 2);
      ctx.fill();

      drawEye(ctx, cx - w * 0.06, cy - h * 0.02, w * 0.035);
      drawEye(ctx, cx + w * 0.08, cy - h * 0.04, w * 0.035);
      drawSmile(ctx, cx + w * 0.01, cy + h * 0.04, w * 0.05);
      drawCheek(ctx, cx - w * 0.12, cy + h * 0.02, w * 0.035, h * 0.02);
      drawCheek(ctx, cx + w * 0.14, cy, w * 0.035, h * 0.02);
    },
  },
  {
    id: 'fruit_3',
    title: 'Sweet Watermelon',
    category: 'fruits',
    defaultGrid: 3,
    themeColor: '#16a34a',
    icon: '🍉',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#f0fdf4', '#dcfce7', '#15803d');
      const cx = w * 0.5;
      const cy = h * 0.55;

      // Green Rind
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(cx, cy, w * 0.32, 0, Math.PI);
      ctx.fill();

      // White border
      ctx.fillStyle = '#dcfce7';
      ctx.beginPath();
      ctx.arc(cx, cy, w * 0.29, 0, Math.PI);
      ctx.fill();

      // Red Pulp
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(cx, cy, w * 0.26, 0, Math.PI);
      ctx.fill();

      // Seeds
      ctx.fillStyle = '#1e293b';
      [-0.15, -0.06, 0.06, 0.15].forEach(x => {
        ctx.beginPath();
        ctx.ellipse(cx + w * x, cy + h * 0.12, 5, 8, 0.2, 0, Math.PI * 2);
        ctx.fill();
      });

      drawEye(ctx, cx - w * 0.08, cy + h * 0.03, w * 0.035);
      drawEye(ctx, cx + w * 0.08, cy + h * 0.03, w * 0.035);
      drawSmile(ctx, cx, cy + h * 0.07, w * 0.04);
    },
  },
  {
    id: 'fruit_4',
    title: 'Berry Strawberry',
    category: 'fruits',
    defaultGrid: 3,
    themeColor: '#f43f5e',
    icon: '🍓',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#fff1f2', '#ffe4e6', '#22c55e');
      const cx = w * 0.5;
      const cy = h * 0.54;

      // Leaves crown
      ctx.fillStyle = '#16a34a';
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.ellipse(cx + i * w * 0.06, cy - h * 0.22, w * 0.05, h * 0.07, i * 0.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Berry heart body
      ctx.fillStyle = '#e11d48';
      ctx.beginPath();
      ctx.moveTo(cx, cy + h * 0.28);
      ctx.bezierCurveTo(cx - w * 0.35, cy + h * 0.08, cx - w * 0.25, cy - h * 0.2, cx, cy - h * 0.14);
      ctx.bezierCurveTo(cx + w * 0.25, cy - h * 0.2, cx + w * 0.35, cy + h * 0.08, cx, cy + h * 0.28);
      ctx.fill();

      // Yellow seeds
      ctx.fillStyle = '#fef08a';
      for (let r = 0; r < 3; r++) {
        for (let c = -2; c <= 2; c++) {
          ctx.beginPath();
          ctx.arc(cx + c * w * 0.06, cy - h * 0.05 + r * h * 0.09, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      drawEye(ctx, cx - w * 0.08, cy - h * 0.02, w * 0.035);
      drawEye(ctx, cx + w * 0.08, cy - h * 0.02, w * 0.035);
      drawSmile(ctx, cx, cy + h * 0.06, w * 0.05);
    },
  },
  {
    id: 'fruit_5',
    title: 'Citrus Orange',
    category: 'fruits',
    defaultGrid: 3,
    themeColor: '#f97316',
    icon: '🍊',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#fff7ed', '#ffedd5', '#16a34a');
      const cx = w * 0.5;
      const cy = h * 0.54;

      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.ellipse(cx + w * 0.07, cy - h * 0.28, w * 0.08, h * 0.04, 0.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.arc(cx, cy, w * 0.26, 0, Math.PI * 2);
      ctx.fill();

      drawEye(ctx, cx - w * 0.09, cy - h * 0.03, w * 0.038);
      drawEye(ctx, cx + w * 0.09, cy - h * 0.03, w * 0.038);
      drawSmile(ctx, cx, cy + h * 0.07, w * 0.05);
      drawCheek(ctx, cx - w * 0.15, cy + h * 0.04, w * 0.04, h * 0.025);
      drawCheek(ctx, cx + w * 0.15, cy + h * 0.04, w * 0.04, h * 0.025);
    },
  },
  {
    id: 'fruit_6',
    title: 'Golden Pineapple',
    category: 'fruits',
    defaultGrid: 4,
    themeColor: '#eab308',
    icon: '🍍',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#fefce8', '#fef08a', '#15803d');
      const cx = w * 0.5;
      const cy = h * 0.56;

      // Crown
      ctx.fillStyle = '#15803d';
      for (let i = -3; i <= 3; i++) {
        ctx.beginPath();
        ctx.ellipse(cx + i * w * 0.04, cy - h * 0.26, w * 0.035, h * 0.12, i * 0.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Pineapple body
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.ellipse(cx, cy, w * 0.22, h * 0.26, 0, 0, Math.PI * 2);
      ctx.fill();

      // Diamond pattern
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let d = -2; d <= 2; d++) {
        ctx.moveTo(cx - w * 0.18, cy + d * h * 0.08);
        ctx.lineTo(cx + w * 0.18, cy - d * h * 0.08);
      }
      ctx.stroke();

      drawEye(ctx, cx - w * 0.08, cy - h * 0.04, w * 0.035);
      drawEye(ctx, cx + w * 0.08, cy - h * 0.04, w * 0.035);
      drawSmile(ctx, cx, cy + h * 0.06, w * 0.05);
    },
  },
  {
    id: 'fruit_7',
    title: 'Purple Grapes',
    category: 'fruits',
    defaultGrid: 3,
    themeColor: '#a855f7',
    icon: '🍇',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#faf5ff', '#f3e8ff', '#22c55e');
      const cx = w * 0.5;
      const cy = h * 0.52;

      // Grapes bunch
      const grapeRows = [4, 3, 2, 1];
      ctx.fillStyle = '#9333ea';
      ctx.strokeStyle = '#6b21a8';
      ctx.lineWidth = 3;

      let rY = cy - h * 0.14;
      grapeRows.forEach(count => {
        const startX = cx - ((count - 1) * w * 0.09) / 2;
        for (let i = 0; i < count; i++) {
          ctx.beginPath();
          ctx.arc(startX + i * w * 0.09, rY, w * 0.055, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
        rY += h * 0.09;
      });

      drawEye(ctx, cx - w * 0.06, cy - h * 0.08, w * 0.028);
      drawEye(ctx, cx + w * 0.06, cy - h * 0.08, w * 0.028);
      drawSmile(ctx, cx, cy - h * 0.02, w * 0.04);
    },
  },
  {
    id: 'fruit_8',
    title: 'Tropical Mango',
    category: 'fruits',
    defaultGrid: 4,
    themeColor: '#f59e0b',
    icon: '🥭',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#fef3c7', '#fed7aa', '#15803d');
      const cx = w * 0.5;
      const cy = h * 0.54;

      const grad = ctx.createLinearGradient(cx - w * 0.2, cy - h * 0.2, cx + w * 0.2, cy + h * 0.2);
      grad.addColorStop(0, '#ef4444');
      grad.addColorStop(0.5, '#f59e0b');
      grad.addColorStop(1, '#84cc16');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(cx, cy, w * 0.22, h * 0.26, 0.2, 0, Math.PI * 2);
      ctx.fill();

      drawEye(ctx, cx - w * 0.08, cy - h * 0.04, w * 0.035);
      drawEye(ctx, cx + w * 0.08, cy - h * 0.04, w * 0.035);
      drawSmile(ctx, cx, cy + h * 0.06, w * 0.05);
      drawCheek(ctx, cx - w * 0.13, cy + h * 0.04, w * 0.035, h * 0.02);
      drawCheek(ctx, cx + w * 0.13, cy + h * 0.04, w * 0.035, h * 0.02);
    },
  },
  {
    id: 'fruit_9',
    title: 'Twin Cherries',
    category: 'fruits',
    defaultGrid: 2,
    themeColor: '#e11d48',
    icon: '🍒',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#fff1f2', '#ffe4e6', '#16a34a');
      const cx = w * 0.5;
      const cy = h * 0.58;

      // Stems meeting at top
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(cx, cy - h * 0.35);
      ctx.quadraticCurveTo(cx - w * 0.15, cy - h * 0.2, cx - w * 0.15, cy);
      ctx.moveTo(cx, cy - h * 0.35);
      ctx.quadraticCurveTo(cx + w * 0.15, cy - h * 0.2, cx + w * 0.15, cy);
      ctx.stroke();

      // Left cherry
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(cx - w * 0.15, cy, w * 0.14, 0, Math.PI * 2);
      ctx.fill();
      drawEye(ctx, cx - w * 0.18, cy - h * 0.02, w * 0.028);
      drawEye(ctx, cx - w * 0.12, cy - h * 0.02, w * 0.028);
      drawSmile(ctx, cx - w * 0.15, cy + h * 0.04, w * 0.03);

      // Right cherry
      ctx.beginPath();
      ctx.arc(cx + w * 0.15, cy, w * 0.14, 0, Math.PI * 2);
      ctx.fill();
      drawEye(ctx, cx + w * 0.12, cy - h * 0.02, w * 0.028);
      drawEye(ctx, cx + w * 0.18, cy - h * 0.02, w * 0.028);
      drawSmile(ctx, cx + w * 0.15, cy + h * 0.04, w * 0.03);
    },
  },
  {
    id: 'fruit_10',
    title: 'Peachy Peach',
    category: 'fruits',
    defaultGrid: 3,
    themeColor: '#fb923c',
    icon: '🍑',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#fff7ed', '#ffedd5', '#22c55e');
      const cx = w * 0.5;
      const cy = h * 0.54;

      ctx.fillStyle = '#fb923c';
      ctx.beginPath();
      ctx.arc(cx - w * 0.1, cy, w * 0.18, 0, Math.PI * 2);
      ctx.arc(cx + w * 0.1, cy, w * 0.18, 0, Math.PI * 2);
      ctx.fill();

      drawEye(ctx, cx - w * 0.08, cy - h * 0.02, w * 0.035);
      drawEye(ctx, cx + w * 0.08, cy - h * 0.02, w * 0.035);
      drawSmile(ctx, cx, cy + h * 0.07, w * 0.05);
      drawCheek(ctx, cx - w * 0.15, cy + h * 0.04, w * 0.04, h * 0.025);
      drawCheek(ctx, cx + w * 0.15, cy + h * 0.04, w * 0.04, h * 0.025);
    },
  },

  // ================= VEHICLES (23-32) =================
  {
    id: 'vehicle_1',
    title: 'Speedy Red Car',
    category: 'vehicles',
    defaultGrid: 2,
    themeColor: '#dc2626',
    icon: '🚗',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#e0f2fe', '#bae6fd', '#475569'); // Road at bottom
      const cx = w * 0.5;
      const cy = h * 0.58;

      // Car body
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.roundRect(cx - w * 0.32, cy - h * 0.08, w * 0.64, h * 0.18, 16);
      ctx.fill();

      // Cabin roof
      ctx.beginPath();
      ctx.roundRect(cx - w * 0.18, cy - h * 0.22, w * 0.36, h * 0.16, 20);
      ctx.fill();

      // Windows
      ctx.fillStyle = '#bae6fd';
      ctx.beginPath();
      ctx.roundRect(cx - w * 0.15, cy - h * 0.19, w * 0.13, h * 0.11, 10);
      ctx.roundRect(cx + w * 0.02, cy - h * 0.19, w * 0.13, h * 0.11, 10);
      ctx.fill();

      // Wheels
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(cx - w * 0.18, cy + h * 0.1, w * 0.08, 0, Math.PI * 2);
      ctx.arc(cx + w * 0.18, cy + h * 0.1, w * 0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(cx - w * 0.18, cy + h * 0.1, w * 0.035, 0, Math.PI * 2);
      ctx.arc(cx + w * 0.18, cy + h * 0.1, w * 0.035, 0, Math.PI * 2);
      ctx.fill();

      // Headlight eyes
      drawEye(ctx, cx + w * 0.26, cy - h * 0.02, w * 0.03);
    },
  },
  {
    id: 'vehicle_2',
    title: 'Yellow School Bus',
    category: 'vehicles',
    defaultGrid: 3,
    themeColor: '#eab308',
    icon: '🚌',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#e0f2fe', '#bae6fd', '#334155');
      const cx = w * 0.5;
      const cy = h * 0.54;

      // Bus Box
      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(cx - w * 0.36, cy - h * 0.2, w * 0.72, h * 0.3, 16);
      ctx.fill();
      ctx.stroke();

      // Windows
      ctx.fillStyle = '#38bdf8';
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.roundRect(cx - w * 0.32 + i * w * 0.16, cy - h * 0.14, w * 0.12, h * 0.1, 8);
        ctx.fill();
      }

      // Wheels
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(cx - w * 0.22, cy + h * 0.12, w * 0.075, 0, Math.PI * 2);
      ctx.arc(cx + w * 0.22, cy + h * 0.12, w * 0.075, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    id: 'vehicle_3',
    title: 'Brave Fire Truck',
    category: 'vehicles',
    defaultGrid: 3,
    themeColor: '#ef4444',
    icon: '🚒',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#e0f2fe', '#bae6fd', '#475569');
      const cx = w * 0.5;
      const cy = h * 0.56;

      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.roundRect(cx - w * 0.35, cy - h * 0.16, w * 0.7, h * 0.26, 12);
      ctx.fill();

      // Ladder on top
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.25, cy - h * 0.22);
      ctx.lineTo(cx + w * 0.2, cy - h * 0.22);
      ctx.moveTo(cx - w * 0.25, cy - h * 0.28);
      ctx.lineTo(cx + w * 0.2, cy - h * 0.28);
      ctx.stroke();

      // Siren
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(cx + w * 0.22, cy - h * 0.2, w * 0.035, 0, Math.PI * 2);
      ctx.fill();

      // Wheels
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(cx - w * 0.22, cy + h * 0.12, w * 0.07, 0, Math.PI * 2);
      ctx.arc(cx + w * 0.22, cy + h * 0.12, w * 0.07, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    id: 'vehicle_4',
    title: 'Choo-Choo Train',
    category: 'vehicles',
    defaultGrid: 4,
    themeColor: '#3b82f6',
    icon: '🚂',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#dbeafe', '#bfdbfe', '#475569');
      const cx = w * 0.5;
      const cy = h * 0.56;

      ctx.fillStyle = '#2563eb';
      ctx.beginPath();
      ctx.roundRect(cx - w * 0.3, cy - h * 0.12, w * 0.45, h * 0.22, 10);
      ctx.roundRect(cx + w * 0.1, cy - h * 0.26, w * 0.2, h * 0.36, 12);
      ctx.fill();

      // Chimney & Puffy Steam
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(cx - w * 0.25, cy - h * 0.26, w * 0.08, h * 0.15);

      drawFluffyCloud(ctx, cx - w * 0.22, cy - h * 0.36, w * 0.06);
      drawFluffyCloud(ctx, cx - w * 0.32, cy - h * 0.44, w * 0.08);

      // Wheels
      ctx.fillStyle = '#e11d48';
      [-0.2, -0.05, 0.12, 0.24].forEach(x => {
        ctx.beginPath();
        ctx.arc(cx + w * x, cy + h * 0.12, w * 0.06, 0, Math.PI * 2);
        ctx.fill();
      });
    },
  },
  {
    id: 'vehicle_5',
    title: 'High-Flying Airplane',
    category: 'vehicles',
    defaultGrid: 3,
    themeColor: '#0ea5e9',
    icon: '✈️',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#0284c7', '#38bdf8', '#7dd3fc');
      const cx = w * 0.5;
      const cy = h * 0.5;

      // Plane Fuselage
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(cx, cy, w * 0.35, h * 0.1, -0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Wings
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.05, cy - h * 0.02);
      ctx.lineTo(cx - w * 0.12, cy - h * 0.25);
      ctx.lineTo(cx + w * 0.05, cy - h * 0.02);
      ctx.fill();

      // Windows
      ctx.fillStyle = '#38bdf8';
      [-0.15, -0.05, 0.05, 0.15].forEach(x => {
        ctx.beginPath();
        ctx.arc(cx + w * x, cy - h * 0.02, 6, 0, Math.PI * 2);
        ctx.fill();
      });
    },
  },
  {
    id: 'vehicle_6',
    title: 'Whirly Helicopter',
    category: 'vehicles',
    defaultGrid: 3,
    themeColor: '#8b5cf6',
    icon: '🚁',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#ede9fe', '#ddd6fe', '#84cc16');
      const cx = w * 0.5;
      const cy = h * 0.52;

      // Body
      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.ellipse(cx, cy, w * 0.22, h * 0.16, 0, 0, Math.PI * 2);
      ctx.fill();

      // Tail
      ctx.fillStyle = '#9333ea';
      ctx.fillRect(cx - w * 0.32, cy - h * 0.03, w * 0.18, h * 0.06);

      // Rotor blades spinning
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.3, cy - h * 0.2);
      ctx.lineTo(cx + w * 0.3, cy - h * 0.2);
      ctx.stroke();

      // Cockpit window
      ctx.fillStyle = '#bae6fd';
      ctx.beginPath();
      ctx.arc(cx + w * 0.12, cy - h * 0.02, w * 0.07, -0.5, 1.5);
      ctx.fill();
    },
  },
  {
    id: 'vehicle_7',
    title: 'Friendly Tugboat',
    category: 'vehicles',
    defaultGrid: 3,
    themeColor: '#0284c7',
    icon: '🚢',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#e0f2fe', '#38bdf8', '#0369a1');
      const cx = w * 0.5;
      const cy = h * 0.54;

      // Hull
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.3, cy);
      ctx.lineTo(cx + w * 0.32, cy);
      ctx.lineTo(cx + w * 0.22, cy + h * 0.16);
      ctx.lineTo(cx - w * 0.2, cy + h * 0.16);
      ctx.closePath();
      ctx.fill();

      // Cabin
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cx - w * 0.15, cy - h * 0.16, w * 0.3, h * 0.16);

      // Water Waves
      ctx.fillStyle = '#0284c7';
      for (let i = -4; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(cx + i * w * 0.09, cy + h * 0.16, w * 0.05, 0, Math.PI);
        ctx.fill();
      }
    },
  },
  {
    id: 'vehicle_8',
    title: 'Blast-Off Rocket',
    category: 'vehicles',
    defaultGrid: 4,
    themeColor: '#4f46e5',
    icon: '🚀',
    draw: (ctx, w, h) => {
      // Space background with stars
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#fef08a';
      [
        { x: w * 0.2, y: h * 0.2 },
        { x: w * 0.8, y: h * 0.25 },
        { x: w * 0.3, y: h * 0.7 },
        { x: w * 0.75, y: h * 0.8 },
      ].forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      const cx = w * 0.5;
      const cy = h * 0.48;

      // Rocket body
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(cx, cy, w * 0.14, h * 0.25, 0, 0, Math.PI * 2);
      ctx.fill();

      // Red nose cone
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(cx, cy - h * 0.32);
      ctx.lineTo(cx - w * 0.1, cy - h * 0.18);
      ctx.lineTo(cx + w * 0.1, cy - h * 0.18);
      ctx.closePath();
      ctx.fill();

      // Porthole window
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(cx, cy - h * 0.06, w * 0.06, 0, Math.PI * 2);
      ctx.fill();

      // Rocket flame
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.08, cy + h * 0.24);
      ctx.lineTo(cx, cy + h * 0.42);
      ctx.lineTo(cx + w * 0.08, cy + h * 0.24);
      ctx.closePath();
      ctx.fill();
    },
  },
  {
    id: 'vehicle_9',
    title: 'Green Farm Tractor',
    category: 'vehicles',
    defaultGrid: 3,
    themeColor: '#16a34a',
    icon: '🚜',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#dbeafe', '#bfdbfe', '#854d0e'); // Farm soil
      const cx = w * 0.5;
      const cy = h * 0.56;

      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.roundRect(cx - w * 0.26, cy - h * 0.1, w * 0.3, h * 0.18, 10);
      ctx.roundRect(cx + w * 0.04, cy - h * 0.22, w * 0.22, h * 0.3, 12);
      ctx.fill();

      // Big rear wheel & small front wheel
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(cx + w * 0.16, cy + h * 0.1, w * 0.11, 0, Math.PI * 2);
      ctx.arc(cx - w * 0.18, cy + h * 0.12, w * 0.065, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(cx + w * 0.16, cy + h * 0.1, w * 0.045, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    id: 'vehicle_10',
    title: 'Police Patrol Car',
    category: 'vehicles',
    defaultGrid: 3,
    themeColor: '#1e40af',
    icon: '🚓',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#e0f2fe', '#bae6fd', '#334155');
      const cx = w * 0.5;
      const cy = h * 0.56;

      // Car body
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(cx - w * 0.32, cy - h * 0.08, w * 0.64, h * 0.18, 14);
      ctx.fill();

      // White doors & roof
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cx - w * 0.14, cy - h * 0.08, w * 0.28, h * 0.18);
      ctx.beginPath();
      ctx.roundRect(cx - w * 0.18, cy - h * 0.2, w * 0.36, h * 0.14, 16);
      ctx.fill();

      // Flashing police lights (red + blue)
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(cx - w * 0.06, cy - h * 0.25, w * 0.05, h * 0.05);
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(cx + w * 0.01, cy - h * 0.25, w * 0.05, h * 0.05);

      // Wheels
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(cx - w * 0.18, cy + h * 0.1, w * 0.075, 0, Math.PI * 2);
      ctx.arc(cx + w * 0.18, cy + h * 0.1, w * 0.075, 0, Math.PI * 2);
      ctx.fill();
    },
  },

  // ================= NATURE (33-42) =================
  {
    id: 'nature_1',
    title: 'Magic Rainbow & Sun',
    category: 'nature',
    defaultGrid: 2,
    themeColor: '#0ea5e9',
    icon: '🌈',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#7dd3fc', '#bae6fd', '#22c55e');
      const cx = w * 0.5;
      const cy = h * 0.72;

      // Rainbow Arcs
      const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7'];
      let rad = w * 0.42;
      colors.forEach(c => {
        ctx.strokeStyle = c;
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, Math.PI, 0);
        ctx.stroke();
        rad -= 14;
      });

      // Cheerful smiling sun
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(w * 0.82, h * 0.22, w * 0.12, 0, Math.PI * 2);
      ctx.fill();
      drawEye(ctx, w * 0.78, h * 0.2, w * 0.025);
      drawEye(ctx, w * 0.86, h * 0.2, w * 0.025);
      drawSmile(ctx, w * 0.82, h * 0.25, w * 0.035);
    },
  },
  {
    id: 'nature_2',
    title: 'Butterfly Garden',
    category: 'nature',
    defaultGrid: 3,
    themeColor: '#ec4899',
    icon: '🦋',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#fdf2f8', '#fce7f3', '#16a34a');
      const cx = w * 0.5;
      const cy = h * 0.48;

      // Big butterfly wings
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.ellipse(cx - w * 0.18, cy - h * 0.12, w * 0.15, h * 0.18, -0.4, 0, Math.PI * 2);
      ctx.ellipse(cx + w * 0.18, cy - h * 0.12, w * 0.15, h * 0.18, 0.4, 0, Math.PI * 2);
      ctx.ellipse(cx - w * 0.14, cy + h * 0.12, w * 0.12, h * 0.14, 0.3, 0, Math.PI * 2);
      ctx.ellipse(cx + w * 0.14, cy + h * 0.12, w * 0.12, h * 0.14, -0.3, 0, Math.PI * 2);
      ctx.fill();

      // Wing spots
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(cx - w * 0.18, cy - h * 0.12, w * 0.045, 0, Math.PI * 2);
      ctx.arc(cx + w * 0.18, cy - h * 0.12, w * 0.045, 0, Math.PI * 2);
      ctx.fill();

      // Body & smile
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.ellipse(cx, cy, w * 0.04, h * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();
      drawEye(ctx, cx - w * 0.02, cy - h * 0.12, 4);
      drawEye(ctx, cx + w * 0.02, cy - h * 0.12, 4);
    },
  },
  {
    id: 'nature_3',
    title: 'Sunny Beach & Palm',
    category: 'nature',
    defaultGrid: 3,
    themeColor: '#0284c7',
    icon: '🏖️',
    draw: (ctx, w, h) => {
      // Ocean & Sand
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#38bdf8');
      grad.addColorStop(0.5, '#0284c7');
      grad.addColorStop(0.5, '#fde047');
      grad.addColorStop(1, '#facc15');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Palm trunk
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(w * 0.25, h * 0.85);
      ctx.quadraticCurveTo(w * 0.28, h * 0.45, w * 0.35, h * 0.25);
      ctx.stroke();

      // Palm fronds
      ctx.fillStyle = '#15803d';
      for (let i = 0; i < 6; i++) {
        const ang = (i * Math.PI) / 3;
        ctx.beginPath();
        ctx.ellipse(w * 0.35 + Math.cos(ang) * 45, h * 0.25 + Math.sin(ang) * 45, 45, 14, ang, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  },
  {
    id: 'nature_4',
    title: 'Pine Forest & Owl',
    category: 'nature',
    defaultGrid: 4,
    themeColor: '#15803d',
    icon: '🌲',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#dbeafe', '#bbf7d0', '#14532d');

      // Pine Trees
      const drawPine = (x: number, y: number, s: number) => {
        ctx.fillStyle = '#166534';
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(x, y - (3 - i) * s * 25);
          ctx.lineTo(x - s * 30, y - (2 - i) * s * 25);
          ctx.lineTo(x + s * 30, y - (2 - i) * s * 25);
          ctx.closePath();
          ctx.fill();
        }
      };

      drawPine(w * 0.2, h * 0.85, 1.2);
      drawPine(w * 0.8, h * 0.85, 1.4);

      // Cute Little Owl in center
      const cx = w * 0.5;
      const cy = h * 0.56;
      ctx.fillStyle = '#854d0e';
      ctx.beginPath();
      ctx.ellipse(cx, cy, w * 0.16, h * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();
      drawEye(ctx, cx - w * 0.07, cy - h * 0.05, w * 0.045);
      drawEye(ctx, cx + w * 0.07, cy - h * 0.05, w * 0.045);
    },
  },
  {
    id: 'nature_5',
    title: 'Snowy Mountains',
    category: 'nature',
    defaultGrid: 4,
    themeColor: '#0284c7',
    icon: '🏔️',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#e0f2fe', '#bae6fd', '#f8fafc');

      // Blue Mountains
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.moveTo(w * 0.1, h * 0.8);
      ctx.lineTo(w * 0.4, h * 0.25);
      ctx.lineTo(w * 0.7, h * 0.8);
      ctx.closePath();
      ctx.fill();

      // Snow cap
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(w * 0.32, h * 0.4);
      ctx.lineTo(w * 0.4, h * 0.25);
      ctx.lineTo(w * 0.48, h * 0.4);
      ctx.closePath();
      ctx.fill();
    },
  },
  {
    id: 'nature_6',
    title: 'Sparkling Waterfall',
    category: 'nature',
    defaultGrid: 4,
    themeColor: '#06b6d4',
    icon: '🌊',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#cffafe', '#a5f3fc', '#15803d');

      // Rocks
      ctx.fillStyle = '#475569';
      ctx.fillRect(w * 0.25, h * 0.3, w * 0.5, h * 0.5);

      // Waterfall streams
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(w * 0.35, h * 0.3, w * 0.3, h * 0.5);

      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 5; i++) {
        ctx.fillRect(w * 0.38 + i * 20, h * 0.35, 6, h * 0.4);
      }
    },
  },
  {
    id: 'nature_7',
    title: 'Desert & Friendly Camel',
    category: 'nature',
    defaultGrid: 4,
    themeColor: '#d97706',
    icon: '🐪',
    draw: (ctx, w, h) => {
      // Golden desert
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#fed7aa');
      grad.addColorStop(0.5, '#fde047');
      grad.addColorStop(1, '#d97706');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const cx = w * 0.5;
      const cy = h * 0.55;

      // Camel body with hump
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.ellipse(cx, cy, w * 0.25, h * 0.16, 0, 0, Math.PI * 2);
      ctx.arc(cx - w * 0.05, cy - h * 0.12, w * 0.1, 0, Math.PI * 2);
      ctx.fill();

      drawEye(ctx, cx + w * 0.18, cy - h * 0.12, w * 0.03);
      drawSmile(ctx, cx + w * 0.22, cy - h * 0.06, w * 0.035);
    },
  },
  {
    id: 'nature_8',
    title: 'Golden Sunset',
    category: 'nature',
    defaultGrid: 3,
    themeColor: '#f97316',
    icon: '🌅',
    draw: (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#f97316');
      grad.addColorStop(0.5, '#facc15');
      grad.addColorStop(0.8, '#4ade80');
      grad.addColorStop(1, '#15803d');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Huge setting sun
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.55, w * 0.22, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    id: 'nature_9',
    title: 'Happy Sunflower Farm',
    category: 'nature',
    defaultGrid: 3,
    themeColor: '#eab308',
    icon: '🌻',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#dbeafe', '#bae6fd', '#15803d');
      const cx = w * 0.5;
      const cy = h * 0.52;

      // Stalk
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx, h * 0.95);
      ctx.stroke();

      // Yellow petals
      ctx.fillStyle = '#facc15';
      for (let i = 0; i < 12; i++) {
        const ang = (i * Math.PI * 2) / 12;
        ctx.beginPath();
        ctx.ellipse(cx + Math.cos(ang) * w * 0.2, cy + Math.sin(ang) * h * 0.2, w * 0.08, h * 0.05, ang, 0, Math.PI * 2);
        ctx.fill();
      }

      // Brown Seed Center
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(cx, cy, w * 0.16, 0, Math.PI * 2);
      ctx.fill();

      drawEye(ctx, cx - w * 0.06, cy - h * 0.03, w * 0.03);
      drawEye(ctx, cx + w * 0.06, cy - h * 0.03, w * 0.03);
      drawSmile(ctx, cx, cy + h * 0.05, w * 0.04);
    },
  },
  {
    id: 'nature_10',
    title: 'Ocean Coral Reef',
    category: 'nature',
    defaultGrid: 4,
    themeColor: '#0284c7',
    icon: '🪸',
    draw: (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#38bdf8');
      grad.addColorStop(0.7, '#0284c7');
      grad.addColorStop(1, '#075985');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Colorful corals at bottom
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(w * 0.2, h * 0.85, w * 0.12, 0, Math.PI * 2);
      ctx.arc(w * 0.45, h * 0.88, w * 0.14, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.arc(w * 0.75, h * 0.86, w * 0.15, 0, Math.PI * 2);
      ctx.fill();

      // Cute little orange clownfish
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.45, w * 0.1, h * 0.06, 0, 0, Math.PI * 2);
      ctx.fill();
      drawEye(ctx, w * 0.54, h * 0.43, 6);
    },
  },

  // ================= DINOSAURS (43-52) =================
  {
    id: 'dino_1',
    title: 'Friendly Rex (T-Rex)',
    category: 'dinosaurs',
    defaultGrid: 3,
    themeColor: '#22c55e',
    icon: '🦖',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#fef08a', '#bbf7d0', '#15803d');
      const cx = w * 0.5;
      const cy = h * 0.52;

      // Big Round Green Dino Head
      ctx.fillStyle = '#22c55e';
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(cx, cy, w * 0.26, h * 0.24, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Yellow belly patch
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.ellipse(cx - w * 0.06, cy + h * 0.08, w * 0.14, h * 0.12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Tiny arms
      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.ellipse(cx - w * 0.18, cy + h * 0.1, w * 0.05, h * 0.025, 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Cute round teeth
      ctx.fillStyle = '#ffffff';
      [-0.04, 0.04, 0.12].forEach(x => {
        ctx.beginPath();
        ctx.arc(cx + w * x, cy + h * 0.08, 6, 0, Math.PI);
        ctx.fill();
      });

      drawEye(ctx, cx + w * 0.08, cy - h * 0.06, w * 0.045);
      drawSmile(ctx, cx + w * 0.06, cy + h * 0.06, w * 0.07);
      drawCheek(ctx, cx + w * 0.14, cy + h * 0.02, w * 0.04, h * 0.025);
    },
  },
  {
    id: 'dino_2',
    title: 'Trixie Triceratops',
    category: 'dinosaurs',
    defaultGrid: 3,
    themeColor: '#3b82f6',
    icon: '🦕',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#dbeafe', '#bae6fd', '#16a34a');
      const cx = w * 0.5;
      const cy = h * 0.54;

      // Big Frill
      ctx.fillStyle = '#60a5fa';
      ctx.beginPath();
      ctx.arc(cx - w * 0.08, cy - h * 0.08, w * 0.24, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.ellipse(cx + w * 0.04, cy, w * 0.22, h * 0.18, 0, 0, Math.PI * 2);
      ctx.fill();

      // 3 Cute Horns
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(cx + w * 0.22, cy - h * 0.02, w * 0.04, 0, Math.PI * 2);
      ctx.arc(cx + w * 0.06, cy - h * 0.2, w * 0.04, 0, Math.PI * 2);
      ctx.arc(cx - w * 0.02, cy - h * 0.22, w * 0.04, 0, Math.PI * 2);
      ctx.fill();

      drawEye(ctx, cx + w * 0.1, cy - h * 0.05, w * 0.038);
      drawSmile(ctx, cx + w * 0.16, cy + h * 0.06, w * 0.05);
    },
  },
  {
    id: 'dino_3',
    title: 'Brody Brachiosaurus',
    category: 'dinosaurs',
    defaultGrid: 4,
    themeColor: '#0d9488',
    icon: '🦕',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#ccfbf1', '#99f6e4', '#15803d');
      const cx = w * 0.5;
      const cy = h * 0.45;

      // Long Curved Neck
      ctx.strokeStyle = '#0d9488';
      ctx.lineWidth = 45;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.15, h * 0.85);
      ctx.quadraticCurveTo(cx - w * 0.15, cy, cx + w * 0.1, cy - h * 0.2);
      ctx.stroke();

      // Cute head
      ctx.fillStyle = '#14b8a6';
      ctx.beginPath();
      ctx.arc(cx + w * 0.12, cy - h * 0.22, w * 0.11, 0, Math.PI * 2);
      ctx.fill();

      drawEye(ctx, cx + w * 0.15, cy - h * 0.24, w * 0.03);
      drawSmile(ctx, cx + w * 0.16, cy - h * 0.18, w * 0.035);
    },
  },
  {
    id: 'dino_4',
    title: 'Spike Stegosaurus',
    category: 'dinosaurs',
    defaultGrid: 4,
    themeColor: '#84cc16',
    icon: '🦎',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#fef9c3', '#d9f99d', '#15803d');
      const cx = w * 0.5;
      const cy = h * 0.56;

      // Back plates (orange diamonds)
      ctx.fillStyle = '#ea580c';
      for (let i = -3; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(cx + i * w * 0.06, cy - h * 0.18, w * 0.045, 0, Math.PI * 2);
        ctx.fill();
      }

      // Body
      ctx.fillStyle = '#84cc16';
      ctx.beginPath();
      ctx.ellipse(cx, cy, w * 0.28, h * 0.18, 0, 0, Math.PI * 2);
      ctx.fill();

      drawEye(ctx, cx + w * 0.2, cy - h * 0.02, w * 0.035);
      drawSmile(ctx, cx + w * 0.22, cy + h * 0.05, w * 0.04);
    },
  },
  {
    id: 'dino_5',
    title: 'Perry Pterodactyl',
    category: 'dinosaurs',
    defaultGrid: 4,
    themeColor: '#c026d3',
    icon: '🦅',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#fdf4ff', '#fae8ff', '#4ade80');
      const cx = w * 0.5;
      const cy = h * 0.48;

      // Wings outstretched
      ctx.fillStyle = '#d946ef';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx - w * 0.35, cy - h * 0.2);
      ctx.lineTo(cx - w * 0.2, cy + h * 0.1);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx + w * 0.2, cy + h * 0.1);
      ctx.lineTo(cx + w * 0.35, cy - h * 0.2);
      ctx.closePath();
      ctx.fill();

      // Head & Crest
      ctx.fillStyle = '#c026d3';
      ctx.beginPath();
      ctx.arc(cx, cy - h * 0.05, w * 0.08, 0, Math.PI * 2);
      ctx.fill();
      drawEye(ctx, cx, cy - h * 0.06, 6);
    },
  },
  {
    id: 'dino_6',
    title: 'Sammy Spinosaurus',
    category: 'dinosaurs',
    defaultGrid: 4,
    themeColor: '#e11d48',
    icon: '🐊',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#ffe4e6', '#fecdd3', '#16a34a');
      const cx = w * 0.5;
      const cy = h * 0.54;

      // Big Spine Sail
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(cx, cy - h * 0.06, w * 0.24, Math.PI, 0);
      ctx.fill();

      // Body
      ctx.fillStyle = '#e11d48';
      ctx.beginPath();
      ctx.ellipse(cx, cy, w * 0.26, h * 0.16, 0, 0, Math.PI * 2);
      ctx.fill();
      drawEye(ctx, cx + w * 0.18, cy - h * 0.04, w * 0.035);
      drawSmile(ctx, cx + w * 0.2, cy + h * 0.04, w * 0.04);
    },
  },
  {
    id: 'dino_7',
    title: 'Archie Ankylosaurus',
    category: 'dinosaurs',
    defaultGrid: 4,
    themeColor: '#b45309',
    icon: '🛡️',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#fef3c7', '#fed7aa', '#84cc16');
      const cx = w * 0.5;
      const cy = h * 0.56;

      // Armored dome body
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(cx, cy, w * 0.26, Math.PI, 0);
      ctx.fill();

      // Armor bumps
      ctx.fillStyle = '#f59e0b';
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(cx - w * 0.18 + i * w * 0.09, cy - h * 0.12, 10, 0, Math.PI * 2);
        ctx.fill();
      }
      drawEye(ctx, cx + w * 0.2, cy - h * 0.02, w * 0.032);
      drawSmile(ctx, cx + w * 0.22, cy + h * 0.03, w * 0.035);
    },
  },
  {
    id: 'dino_8',
    title: 'Baby Dino Hatchling',
    category: 'dinosaurs',
    defaultGrid: 2,
    themeColor: '#a855f7',
    icon: '🐣',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#faf5ff', '#f3e8ff', '#22c55e');
      const cx = w * 0.5;
      const cy = h * 0.55;

      // Cracked Egg Shell Bottom
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy + h * 0.1, w * 0.24, 0, Math.PI);
      ctx.fill();
      ctx.stroke();

      // Cute Baby Dino Peeking Out
      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.arc(cx, cy - h * 0.05, w * 0.16, 0, Math.PI * 2);
      ctx.fill();

      // Top shell piece as hat
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx, cy - h * 0.18, w * 0.1, Math.PI, 0);
      ctx.fill();
      ctx.stroke();

      drawEye(ctx, cx - w * 0.06, cy - h * 0.06, w * 0.035);
      drawEye(ctx, cx + w * 0.06, cy - h * 0.06, w * 0.035);
      drawSmile(ctx, cx, cy + h * 0.01, w * 0.04);
      drawCheek(ctx, cx - w * 0.11, cy - h * 0.01, w * 0.035, h * 0.02);
      drawCheek(ctx, cx + w * 0.11, cy - h * 0.01, w * 0.035, h * 0.02);
    },
  },
  {
    id: 'dino_9',
    title: 'Dino Volcano Valley',
    category: 'dinosaurs',
    defaultGrid: 5,
    themeColor: '#ef4444',
    icon: '🌋',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#fef08a', '#fed7aa', '#15803d');

      // Volcano cone
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.moveTo(w * 0.25, h * 0.85);
      ctx.lineTo(w * 0.42, h * 0.35);
      ctx.lineTo(w * 0.58, h * 0.35);
      ctx.lineTo(w * 0.75, h * 0.85);
      ctx.closePath();
      ctx.fill();

      // Lava flow
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.35, w * 0.08, h * 0.04, 0, 0, Math.PI * 2);
      ctx.fill();

      // Puffy smoke
      drawFluffyCloud(ctx, w * 0.5, h * 0.2, w * 0.12);
    },
  },
  {
    id: 'dino_10',
    title: 'Dino Rainbow Valley',
    category: 'dinosaurs',
    defaultGrid: 5,
    themeColor: '#06b6d4',
    icon: '✨',
    draw: (ctx, w, h) => {
      drawBackground(ctx, w, h, '#cffafe', '#a5f3fc', '#22c55e');
      // Rainbow in background
      const colors = ['#ef4444', '#facc15', '#22c55e', '#3b82f6'];
      colors.forEach((col, idx) => {
        ctx.strokeStyle = col;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.75, w * 0.35 - idx * 8, Math.PI, 0);
        ctx.stroke();
      });

      // Two cute little dinos dancing together
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(w * 0.38, h * 0.6, w * 0.09, 0, Math.PI * 2);
      ctx.fill();
      drawEye(ctx, w * 0.4, h * 0.58, 5);

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(w * 0.62, h * 0.6, w * 0.09, 0, Math.PI * 2);
      ctx.fill();
      drawEye(ctx, w * 0.6, h * 0.58, 5);
    },
  },
];

export const CATEGORIES_CONFIG = [
  { id: 'animals' as PuzzleCategory, name: 'Animals', icon: '🐘', color: 'from-amber-400 to-amber-600' },
  { id: 'fruits' as PuzzleCategory, name: 'Fruits', icon: '🍎', color: 'from-rose-400 to-rose-600' },
  { id: 'vehicles' as PuzzleCategory, name: 'Vehicles', icon: '🚗', color: 'from-sky-400 to-sky-600' },
  { id: 'nature' as PuzzleCategory, name: 'Nature', icon: '🌈', color: 'from-emerald-400 to-emerald-600' },
  { id: 'dinosaurs' as PuzzleCategory, name: 'Dinosaurs', icon: '🦖', color: 'from-purple-400 to-purple-600' },
];
