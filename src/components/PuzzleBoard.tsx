import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PuzzleDefinition } from '../game/PuzzleDatabase';
import { JigsawEngine, JigsawPiece } from '../game/JigsawEngine';
import { sounds } from '../audio/SoundEngine';
import { ChildProfileName } from '../game/SaveManager';

interface PuzzleBoardProps {
  puzzle: PuzzleDefinition;
  gridSize: number;
  childName: ChildProfileName;
  onComplete: (stars: number, timeSec: number, moves: number) => void;
  onTriggerSparkle: (x: number, y: number) => void;
  hintTrigger: number;
  onNeedCoinsForHint: () => void;
  canAffordHint: boolean;
  onSpendCoins: (amount: number) => boolean;
}

const CORRECT_FEEDBACK = [
  (name: string) => `Great, ${name}! ⭐`,
  (name: string) => `Nice one, ${name}! 👏`,
  (name: string) => `Super, ${name}! 🌟`,
  (name: string) => `Perfect fit, ${name}! 🎉`,
];

const INCORRECT_FEEDBACK = [
  (name: string) => `Try another spot, ${name}!`,
  (name: string) => `Almost! You can do it! 💪`,
  (name: string) => `Have another look, ${name}!`,
  (name: string) => `Keep going, ${name}!`,
];

export const PuzzleBoard: React.FC<PuzzleBoardProps> = ({
  puzzle,
  gridSize,
  childName,
  onComplete,
  onTriggerSparkle,
  hintTrigger,
  onNeedCoinsForHint,
  canAffordHint,
  onSpendCoins,
}) => {
  const [engine] = useState(() => new JigsawEngine());
  const [pieces, setPieces] = useState<JigsawPiece[]>([]);
  const [boardDimension, setBoardDimension] = useState<number>(480);
  const [activeDragId, setActiveDragId] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragPos, setDragPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hintedPieceId, setHintedPieceId] = useState<number | null>(null);
  const [showGhostGuide, setShowGhostGuide] = useState<boolean>(true);
  const [feedbackToast, setFeedbackToast] = useState<{ text: string; isPositive: boolean } | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  const showToast = (text: string, isPositive: boolean) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setFeedbackToast({ text, isPositive });
    toastTimeoutRef.current = window.setTimeout(() => {
      setFeedbackToast(null);
    }, 1400);
  };

  const boardContainerRef = useRef<HTMLDivElement>(null);
  const boardCanvasRef = useRef<HTMLDivElement>(null);
  const ghostCanvasRef = useRef<HTMLCanvasElement>(null);
  const trayRef = useRef<HTMLDivElement>(null);

  // Measure and adapt board size responsively
  const updateBoardSize = useCallback(() => {
    if (!boardContainerRef.current) return;
    const { clientWidth, clientHeight } = boardContainerRef.current;
    // Keep board square and leave space for tray
    const maxDim = Math.min(clientWidth - 32, clientHeight - 32, 540);
    const safeDim = Math.max(260, Math.floor(maxDim));
    setBoardDimension(safeDim);
  }, []);

  useEffect(() => {
    updateBoardSize();
    window.addEventListener('resize', updateBoardSize);
    return () => window.removeEventListener('resize', updateBoardSize);
  }, [updateBoardSize]);

  // Initialize or re-initialize puzzle
  useEffect(() => {
    if (boardDimension <= 0) return;
    const generated = engine.initPuzzle(puzzle.draw, gridSize, boardDimension);
    setPieces([...generated]);

    // Render ghost guide canvas in background
    if (ghostCanvasRef.current) {
      ghostCanvasRef.current.width = boardDimension;
      ghostCanvasRef.current.height = boardDimension;
      const gCtx = ghostCanvasRef.current.getContext('2d');
      if (gCtx) {
        gCtx.clearRect(0, 0, boardDimension, boardDimension);
        puzzle.draw(gCtx, boardDimension, boardDimension);
      }
    }
  }, [puzzle, gridSize, boardDimension, engine]);

  // Handle Hint action
  useEffect(() => {
    if (hintTrigger === 0) return;

    // Find first unplaced piece
    const unplaced = pieces.find(p => !p.isSnapped);
    if (!unplaced) return;

    if (!canAffordHint) {
      onNeedCoinsForHint();
      return;
    }

    if (!onSpendCoins(25)) {
      onNeedCoinsForHint();
      return;
    }

    sounds.playHintUsed();
    setHintedPieceId(unplaced.id);

    // Animate snap after short highlight
    const timer = setTimeout(() => {
      unplaced.isSnapped = true;
      unplaced.inTray = false;
      unplaced.currentX = unplaced.correctX;
      unplaced.currentY = unplaced.correctY;
      engine.snappedCount++;

      // Trigger sparkle at center of piece
      if (boardCanvasRef.current) {
        const rect = boardCanvasRef.current.getBoundingClientRect();
        const px = rect.left + unplaced.correctX + engine.cellWidth / 2;
        const py = rect.top + unplaced.correctY + engine.cellHeight / 2;
        onTriggerSparkle(px, py);
      }
      sounds.playPieceSnap();

      setPieces([...engine.pieces]);
      setHintedPieceId(null);

      if (engine.isComplete()) {
        const stars = engine.calculateStars();
        const time = engine.getElapsedTimeSec();
        setTimeout(() => onComplete(stars, time, engine.moveCount), 600);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [hintTrigger]);

  // Pointer dragging implementation
  const handlePointerDown = (piece: JigsawPiece, e: React.PointerEvent) => {
    if (piece.isSnapped) return;

    // Prevent default touch scrolling
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    sounds.playPiecePickup();
    setActiveDragId(piece.id);
    engine.moveCount++;

    const boardRect = boardCanvasRef.current?.getBoundingClientRect();
    const bx = boardRect ? boardRect.left : 0;
    const by = boardRect ? boardRect.top : 0;

    // Center offset or relative to grab
    setDragOffset({
      x: e.clientX - bx,
      y: e.clientY - by,
    });
    setDragPos({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (activeDragId === null) return;
    e.preventDefault();

    setDragPos({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (activeDragId === null) return;
    e.preventDefault();

    const piece = pieces.find(p => p.id === activeDragId);
    if (!piece) {
      setActiveDragId(null);
      return;
    }

    const boardRect = boardCanvasRef.current?.getBoundingClientRect();
    if (!boardRect) {
      setActiveDragId(null);
      return;
    }

    // Coordinates of piece's top-left cell inside board
    // The cursor was placed relative to piece's center
    const dropBoardX = e.clientX - boardRect.left - engine.cellWidth / 2;
    const dropBoardY = e.clientY - boardRect.top - engine.cellHeight / 2;

    piece.currentX = dropBoardX;
    piece.currentY = dropBoardY;

    // Magnetic snapping check
    // Dynamic snap radius based on cell size (generous for kids!)
    const snapRadius = Math.max(55, engine.cellWidth * 0.45);
    const snapped = engine.checkSnap(piece, dropBoardX, dropBoardY, snapRadius);

    if (snapped) {
      sounds.playPieceSnap();
      const msg = CORRECT_FEEDBACK[Math.floor(Math.random() * CORRECT_FEEDBACK.length)](childName);
      showToast(msg, true);

      // Calculate screen coordinate for sparkles
      const sparkleX = boardRect.left + piece.correctX + engine.cellWidth / 2;
      const sparkleY = boardRect.top + piece.correctY + engine.cellHeight / 2;
      onTriggerSparkle(sparkleX, sparkleY);

      setPieces([...engine.pieces]);

      // Check puzzle completion
      if (engine.isComplete()) {
        const stars = engine.calculateStars();
        const time = engine.getElapsedTimeSec();
        setTimeout(() => onComplete(stars, time, engine.moveCount), 650);
      }
    } else {
      sounds.playWrongPlacement();
      const msg = INCORRECT_FEEDBACK[Math.floor(Math.random() * INCORRECT_FEEDBACK.length)](childName);
      showToast(msg, false);

      // Return piece to tray gently
      piece.inTray = true;
      setPieces([...engine.pieces]);
    }

    setActiveDragId(null);
  };

  const activePiece = pieces.find(p => p.id === activeDragId);
  const trayPieces = pieces.filter(p => !p.isSnapped && p.id !== activeDragId);

  return (
    <div
      className="flex-1 w-full flex flex-col md:flex-row items-center justify-center p-2 sm:p-4 gap-3 sm:gap-6 overflow-hidden select-none touch-none relative"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Floating Encouragement Feedback Toast */}
      {feedbackToast && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-40 pointer-events-none animate-bounce">
          <div
            className={`px-5 py-2 rounded-2xl border-2 font-['Nunito',sans-serif] font-black text-sm sm:text-base shadow-2xl flex items-center gap-2 ${
              feedbackToast.isPositive
                ? 'bg-emerald-600 border-emerald-300 text-white'
                : 'bg-amber-800 border-amber-500 text-amber-100'
            }`}
          >
            <span>{feedbackToast.isPositive ? '✨' : '💡'}</span>
            <span>{feedbackToast.text}</span>
          </div>
        </div>
      )}
      {/* Left/Center: Wooden Board Frame */}
      <div
        ref={boardContainerRef}
        className="flex-1 w-full h-full flex flex-col items-center justify-center relative min-h-0"
      >
        <div
          className="relative wood-board-rim rounded-3xl p-3 sm:p-4 flex items-center justify-center shadow-2xl transition-all"
          style={{
            width: `${boardDimension + 32}px`,
            height: `${boardDimension + 32}px`,
          }}
        >
          {/* Inner Board Area */}
          <div
            ref={boardCanvasRef}
            className="relative bg-amber-950/90 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center"
            style={{
              width: `${boardDimension}px`,
              height: `${boardDimension}px`,
            }}
          >
            {/* Ghost Guide Illustration (Faint reference image) */}
            <canvas
              ref={ghostCanvasRef}
              className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
                showGhostGuide ? 'opacity-25' : 'opacity-5'
              }`}
              style={{
                width: `${boardDimension}px`,
                height: `${boardDimension}px`,
              }}
            />

            {/* Grid Interlocking Cell Guide Lines */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
              viewBox={`0 0 ${boardDimension} ${boardDimension}`}
            >
              {pieces.map(p => (
                <rect
                  key={`grid-${p.id}`}
                  x={p.correctX}
                  y={p.correctY}
                  width={engine.cellWidth}
                  height={engine.cellHeight}
                  fill={p.id === hintedPieceId ? 'rgba(250, 204, 21, 0.45)' : 'none'}
                  stroke="rgba(254, 240, 138, 0.45)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  className={p.id === hintedPieceId ? 'animate-pulse' : ''}
                />
              ))}
            </svg>

            {/* Snapped Pieces Rendered in Place */}
            {pieces
              .filter(p => p.isSnapped)
              .map(p => (
                <div
                  key={`snapped-${p.id}`}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${p.correctX - p.pad}px`,
                    top: `${p.correctY - p.pad}px`,
                    width: `${p.width}px`,
                    height: `${p.height}px`,
                  }}
                >
                  <img
                    src={p.canvas.toDataURL()}
                    alt={`Piece ${p.id}`}
                    className="w-full h-full object-contain filter drop-shadow-sm"
                  />
                </div>
              ))}
          </div>

          {/* Toggle Ghost Guide button at bottom corner */}
          <button
            onClick={() => setShowGhostGuide(!showGhostGuide)}
            className="absolute bottom-1 right-2 text-[11px] font-bold text-amber-200/80 hover:text-amber-100 bg-amber-950/70 px-2 py-0.5 rounded-lg border border-amber-800 cursor-pointer"
          >
            {showGhostGuide ? 'Hide Guide' : 'Show Guide'}
          </button>
        </div>
      </div>

      {/* Right/Bottom: Wooden Piece Tray */}
      <div
        ref={trayRef}
        className="w-full md:w-64 lg:w-72 max-h-48 md:max-h-full h-auto md:h-full wood-panel border-4 border-amber-950 rounded-2xl md:rounded-3xl p-3 flex flex-col shadow-xl shrink-0 z-10"
      >
        <div className="flex items-center justify-between pb-2 border-b-2 border-amber-900/60 mb-2">
          <span className="font-['Nunito',sans-serif] font-black text-amber-100 text-sm flex items-center gap-1.5">
            <span>🧩</span> Puzzle Tray
          </span>
          <span className="text-xs font-bold text-amber-300">
            {trayPieces.length} left
          </span>
        </div>

        {/* Piece list inside tray */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-1 grid grid-cols-3 md:grid-cols-2 gap-3 items-center justify-items-center">
          {trayPieces.length === 0 ? (
            <div className="col-span-full py-8 text-center text-amber-200 font-bold text-sm">
              All pieces placed! 🎉
            </div>
          ) : (
            trayPieces.map(piece => (
              <div
                key={`tray-${piece.id}`}
                onPointerDown={e => handlePointerDown(piece, e)}
                className={`relative cursor-grab active:cursor-grabbing p-1 rounded-xl bg-amber-900/40 hover:bg-amber-800/60 transition-all border border-amber-700/50 flex items-center justify-center ${
                  piece.id === hintedPieceId ? 'ring-4 ring-yellow-400 animate-bounce' : ''
                }`}
                style={{
                  width: `${Math.min(90, engine.cellWidth * 0.9)}px`,
                  height: `${Math.min(90, engine.cellHeight * 0.9)}px`,
                }}
              >
                <img
                  src={piece.canvas.toDataURL()}
                  alt={`Tray piece ${piece.id}`}
                  className="max-w-full max-h-full object-contain filter drop-shadow hover:scale-105 transition-transform pointer-events-none"
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Currently Dragged Floating Piece */}
      {activePiece && (
        <div
          className="fixed pointer-events-none z-50 transition-transform duration-75"
          style={{
            left: `${dragPos.x}px`,
            top: `${dragPos.y}px`,
            transform: 'translate(-50%, -50%) scale(1.12)',
            filter: 'drop-shadow(0 14px 18px rgba(0,0,0,0.5))',
          }}
        >
          <img
            src={activePiece.canvas.toDataURL()}
            alt="Dragging piece"
            style={{
              width: `${activePiece.width}px`,
              height: `${activePiece.height}px`,
            }}
          />
        </div>
      )}
    </div>
  );
};
