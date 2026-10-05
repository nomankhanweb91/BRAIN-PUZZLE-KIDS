/**
 * JigsawEngine: High-Performance Canvas Jigsaw Cutter & Math
 * Generates interlocking jigsaw tabs & blanks, pre-renders piece bitmaps,
 * and handles magnetic snapping, hints, and celebrations.
 */

export interface PieceEdge {
  top: number; // 0 = flat, 1 = tab (out), -1 = blank (in)
  right: number;
  bottom: number;
  left: number;
}

export interface JigsawPiece {
  id: number;
  row: number;
  col: number;
  edges: PieceEdge;
  width: number;
  height: number;
  pad: number; // padding for tabs extending outside cell bounds
  correctX: number; // relative to board canvas
  correctY: number;
  currentX: number;
  currentY: number;
  isSnapped: boolean;
  inTray: boolean;
  canvas: HTMLCanvasElement; // pre-rendered piece with crisp interlocking path
  trayOrder: number;
}

export interface Sparkle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
}

export class JigsawEngine {
  public gridSize: number = 3;
  public boardWidth: number = 600;
  public boardHeight: number = 600;
  public cellWidth: number = 200;
  public cellHeight: number = 200;
  public tabSize: number = 30;

  public pieces: JigsawPiece[] = [];
  public masterCanvas: HTMLCanvasElement;
  public masterCtx: CanvasRenderingContext2D;

  public totalPieces: number = 9;
  public snappedCount: number = 0;
  public moveCount: number = 0;
  public startTime: number = 0;

  constructor() {
    this.masterCanvas = document.createElement('canvas');
    this.masterCtx = this.masterCanvas.getContext('2d')!;
  }

  public initPuzzle(
    drawFn: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
    gridSize: number,
    boardSize: number = 600
  ): JigsawPiece[] {
    this.gridSize = gridSize;
    this.boardWidth = boardSize;
    this.boardHeight = boardSize;
    this.totalPieces = gridSize * gridSize;
    this.snappedCount = 0;
    this.moveCount = 0;
    this.startTime = Date.now();

    this.cellWidth = this.boardWidth / gridSize;
    this.cellHeight = this.boardHeight / gridSize;
    this.tabSize = Math.min(this.cellWidth, this.cellHeight) * 0.22;

    // 1. Draw master image on high-res canvas
    this.masterCanvas.width = this.boardWidth;
    this.masterCanvas.height = this.boardHeight;
    this.masterCtx.clearRect(0, 0, this.boardWidth, this.boardHeight);
    drawFn(this.masterCtx, this.boardWidth, this.boardHeight);

    // 2. Generate complementary edges for interlocking grid
    // horizontal edges: (gridSize - 1) x gridSize
    // vertical edges: gridSize x (gridSize - 1)
    const horizEdges: number[][] = [];
    for (let r = 0; r < gridSize - 1; r++) {
      horizEdges[r] = [];
      for (let c = 0; c < gridSize; c++) {
        horizEdges[r][c] = Math.random() < 0.5 ? 1 : -1;
      }
    }

    const vertEdges: number[][] = [];
    for (let r = 0; r < gridSize; r++) {
      vertEdges[r] = [];
      for (let c = 0; c < gridSize - 1; c++) {
        vertEdges[r][c] = Math.random() < 0.5 ? 1 : -1;
      }
    }

    this.pieces = [];
    const pad = Math.ceil(this.tabSize * 1.5);

    let id = 0;
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const top = r === 0 ? 0 : -horizEdges[r - 1][c];
        const bottom = r === gridSize - 1 ? 0 : horizEdges[r][c];
        const left = c === 0 ? 0 : -vertEdges[r][c - 1];
        const right = c === gridSize - 1 ? 0 : vertEdges[r][c];

        const edges: PieceEdge = { top, right, bottom, left };
        const correctX = c * this.cellWidth;
        const correctY = r * this.cellHeight;

        // Create piece canvas
        const pCanvas = document.createElement('canvas');
        const pWidth = this.cellWidth + pad * 2;
        const pHeight = this.cellHeight + pad * 2;
        pCanvas.width = pWidth;
        pCanvas.height = pHeight;
        const pCtx = pCanvas.getContext('2d')!;

        // Draw jigsaw piece clipped to interlocking path
        this.renderPieceBitmap(pCtx, r, c, edges, pad, pWidth, pHeight);

        this.pieces.push({
          id,
          row: r,
          col: c,
          edges,
          width: pWidth,
          height: pHeight,
          pad,
          correctX,
          correctY,
          currentX: correctX,
          currentY: correctY,
          isSnapped: false,
          inTray: true,
          canvas: pCanvas,
          trayOrder: id,
        });

        id++;
      }
    }

    // Shuffle tray order
    const shuffled = [...this.pieces].sort(() => Math.random() - 0.5);
    shuffled.forEach((p, idx) => {
      p.trayOrder = idx;
    });

    return this.pieces;
  }

  // Draw the interlocking piece path with cubic beziers
  public buildJigsawPath(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    edges: PieceEdge,
    tab: number
  ) {
    ctx.beginPath();
    ctx.moveTo(x, y);

    // Top edge
    if (edges.top === 0) {
      ctx.lineTo(x + w, y);
    } else {
      const s = edges.top; // +1 tab pointing up, -1 blank pointing down
      ctx.lineTo(x + w * 0.35, y);
      ctx.bezierCurveTo(
        x + w * 0.35, y - tab * 0.4 * s,
        x + w * 0.4, y - tab * s,
        x + w * 0.5, y - tab * s
      );
      ctx.bezierCurveTo(
        x + w * 0.6, y - tab * s,
        x + w * 0.65, y - tab * 0.4 * s,
        x + w * 0.65, y
      );
      ctx.lineTo(x + w, y);
    }

    // Right edge
    if (edges.right === 0) {
      ctx.lineTo(x + w, y + h);
    } else {
      const s = edges.right;
      ctx.lineTo(x + w, y + h * 0.35);
      ctx.bezierCurveTo(
        x + w + tab * 0.4 * s, y + h * 0.35,
        x + w + tab * s, y + h * 0.4,
        x + w + tab * s, y + h * 0.5
      );
      ctx.bezierCurveTo(
        x + w + tab * s, y + h * 0.6,
        x + w + tab * 0.4 * s, y + h * 0.65,
        x + w, y + h * 0.65
      );
      ctx.lineTo(x + w, y + h);
    }

    // Bottom edge
    if (edges.bottom === 0) {
      ctx.lineTo(x, y + h);
    } else {
      const s = edges.bottom;
      ctx.lineTo(x + w * 0.65, y + h);
      ctx.bezierCurveTo(
        x + w * 0.65, y + h + tab * 0.4 * s,
        x + w * 0.6, y + h + tab * s,
        x + w * 0.5, y + h + tab * s
      );
      ctx.bezierCurveTo(
        x + w * 0.4, y + h + tab * s,
        x + w * 0.35, y + h + tab * 0.4 * s,
        x + w * 0.35, y + h
      );
      ctx.lineTo(x, y + h);
    }

    // Left edge
    if (edges.left === 0) {
      ctx.lineTo(x, y);
    } else {
      const s = edges.left;
      ctx.lineTo(x, y + h * 0.65);
      ctx.bezierCurveTo(
        x - tab * 0.4 * s, y + h * 0.65,
        x - tab * s, y + h * 0.6,
        x - tab * s, y + h * 0.5
      );
      ctx.bezierCurveTo(
        x - tab * s, y + h * 0.4,
        x - tab * 0.4 * s, y + h * 0.35,
        x, y + h * 0.35
      );
      ctx.lineTo(x, y);
    }

    ctx.closePath();
  }

  private renderPieceBitmap(
    ctx: CanvasRenderingContext2D,
    row: number,
    col: number,
    edges: PieceEdge,
    pad: number,
    totalW: number,
    totalH: number
  ) {
    ctx.save();
    ctx.clearRect(0, 0, totalW, totalH);

    // Build clipping path
    this.buildJigsawPath(ctx, pad, pad, this.cellWidth, this.cellHeight, edges, this.tabSize);
    ctx.clip();

    // Draw slice of master image
    const srcX = col * this.cellWidth - pad;
    const srcY = row * this.cellHeight - pad;
    ctx.drawImage(
      this.masterCanvas,
      srcX, srcY, totalW, totalH,
      0, 0, totalW, totalH
    );

    // Inner bevel highlight
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Darker outline for jigsaw edge clarity
    ctx.restore();
    ctx.save();
    this.buildJigsawPath(ctx, pad, pad, this.cellWidth, this.cellHeight, edges, this.tabSize);
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.55)';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.restore();
  }

  // Magnetic Snapping Check
  public checkSnap(piece: JigsawPiece, boardX: number, boardY: number, snapThreshold: number = 55): boolean {
    const dx = piece.currentX - piece.correctX;
    const dy = piece.currentY - piece.correctY;
    const dist = Math.hypot(dx, dy);

    if (dist <= snapThreshold) {
      piece.currentX = piece.correctX;
      piece.currentY = piece.correctY;
      piece.isSnapped = true;
      piece.inTray = false;
      this.snappedCount++;
      return true;
    }
    return false;
  }

  public isComplete(): boolean {
    return this.snappedCount >= this.totalPieces;
  }

  public calculateStars(): number {
    const elapsed = (Date.now() - this.startTime) / 1000;
    // Friendly scoring:
    // If completed smoothly within reasonable time/moves, 3 stars
    const targetTime = this.totalPieces * 15; // e.g. 60s for 2x2, 135s for 3x3
    if (elapsed <= targetTime && this.moveCount <= this.totalPieces * 2.5) {
      return 3;
    } else if (elapsed <= targetTime * 1.8) {
      return 2;
    }
    return 1;
  }

  public getElapsedTimeSec(): number {
    return Math.floor((Date.now() - this.startTime) / 1000);
  }
}
