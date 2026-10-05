package com.brainpuzzlekids.game

import android.graphics.*
import kotlin.math.hypot

data class PieceEdge(
    val top: Int,    // 0 = flat, 1 = tab out, -1 = blank in
    val right: Int,
    val bottom: Int,
    val left: Int
)

data class PuzzlePiece(
    val id: Int,
    val row: Int,
    val col: Int,
    val edges: PieceEdge,
    val correctX: Float,
    val correctY: Float,
    var currentX: Float,
    var currentY: Float,
    var isSnapped: Boolean = false,
    var inTray: Boolean = true,
    var bitmap: Bitmap? = null
)

class PuzzleEngine(
    val gridSize: Int,
    val boardWidth: Float,
    val boardHeight: Float
) {
    val cellWidth = boardWidth / gridSize
    val cellHeight = boardHeight / gridSize
    val tabSize = Math.min(cellWidth, cellHeight) * 0.22f
    val pieces = mutableListOf<PuzzlePiece>()
    var snappedCount = 0
    var moveCount = 0
    var startTime = System.currentTimeMillis()

    fun initPieces(masterBitmap: Bitmap): List<PuzzlePiece> {
        pieces.clear()
        snappedCount = 0
        moveCount = 0
        startTime = System.currentTimeMillis()

        val horizEdges = Array(gridSize - 1) { IntArray(gridSize) { if (Math.random() < 0.5) 1 else -1 } }
        val vertEdges = Array(gridSize) { IntArray(gridSize - 1) { if (Math.random() < 0.5) 1 else -1 } }

        val pad = (tabSize * 1.5f).toInt()
        var id = 0

        for (r in 0 until gridSize) {
            for (c in 0 until gridSize) {
                val top = if (r == 0) 0 else -horizEdges[r - 1][c]
                val bottom = if (r == gridSize - 1) 0 else horizEdges[r][c]
                val left = if (c == 0) 0 else -vertEdges[r][c - 1]
                val right = if (c == gridSize - 1) 0 else vertEdges[r][c]

                val edges = PieceEdge(top, right, bottom, left)
                val correctX = c * cellWidth
                val correctY = r * cellHeight

                val pWidth = (cellWidth + pad * 2).toInt()
                val pHeight = (cellHeight + pad * 2).toInt()

                // Create clipped piece bitmap
                val pieceBmp = Bitmap.createBitmap(pWidth, pHeight, Bitmap.Config.ARGB_8888)
                val canvas = Canvas(pieceBmp)
                val path = buildJigsawPath(pad.toFloat(), pad.toFloat(), cellWidth, cellHeight, edges, tabSize)

                val paint = Paint(Paint.ANTI_ALIAS_FLAG)
                canvas.drawPath(path, paint)
                paint.xfermode = PorterDuffXfermode(PorterDuff.Mode.SRC_IN)

                val srcRect = Rect(
                    (correctX - pad).toInt().coerceAtLeast(0),
                    (correctY - pad).toInt().coerceAtLeast(0),
                    (correctX - pad + pWidth).toInt().coerceAtMost(masterBitmap.width),
                    (correctY - pad + pHeight).toInt().coerceAtMost(masterBitmap.height)
                )
                val dstRect = Rect(0, 0, pWidth, pHeight)
                canvas.drawBitmap(masterBitmap, srcRect, dstRect, paint)

                pieces.add(
                    PuzzlePiece(
                        id = id++,
                        row = r,
                        col = c,
                        edges = edges,
                        correctX = correctX,
                        correctY = correctY,
                        currentX = correctX,
                        currentY = correctY,
                        bitmap = pieceBmp
                    )
                )
            }
        }
        pieces.shuffle()
        return pieces
    }

    private fun buildJigsawPath(x: Float, y: Float, w: Float, h: Float, edges: PieceEdge, tab: Float): Path {
        val path = Path()
        path.moveTo(x, y)

        // Top edge
        if (edges.top == 0) {
            path.lineTo(x + w, y)
        } else {
            val s = edges.top.toFloat()
            path.lineTo(x + w * 0.35f, y)
            path.cubicTo(
                x + w * 0.35f, y - tab * 0.4f * s,
                x + w * 0.4f, y - tab * s,
                x + w * 0.5f, y - tab * s
            )
            path.cubicTo(
                x + w * 0.6f, y - tab * s,
                x + w * 0.65f, y - tab * 0.4f * s,
                x + w * 0.65f, y
            )
            path.lineTo(x + w, y)
        }

        // Right edge
        if (edges.right == 0) {
            path.lineTo(x + w, y + h)
        } else {
            val s = edges.right.toFloat()
            path.lineTo(x + w, y + h * 0.35f)
            path.cubicTo(
                x + w + tab * 0.4f * s, y + h * 0.35f,
                x + w + tab * s, y + h * 0.4f,
                x + w + tab * s, y + h * 0.5f
            )
            path.cubicTo(
                x + w + tab * s, y + h * 0.6f,
                x + w + tab * 0.4f * s, y + h * 0.65f,
                x + w, y + h * 0.65f
            )
            path.lineTo(x + w, y + h)
        }

        // Bottom edge
        if (edges.bottom == 0) {
            path.lineTo(x, y + h)
        } else {
            val s = edges.bottom.toFloat()
            path.lineTo(x + w * 0.65f, y + h)
            path.cubicTo(
                x + w * 0.65f, y + h + tab * 0.4f * s,
                x + w * 0.6f, y + h + tab * s,
                x + w * 0.5f, y + h + tab * s
            )
            path.cubicTo(
                x + w * 0.4f, y + h + tab * s,
                x + w * 0.35f, y + h + tab * 0.4f * s,
                x + w * 0.35f, y + h
            )
            path.lineTo(x, y + h)
        }

        // Left edge
        if (edges.left == 0) {
            path.lineTo(x, y)
        } else {
            val s = edges.left.toFloat()
            path.lineTo(x, y + h * 0.65f)
            path.cubicTo(
                x - tab * 0.4f * s, y + h * 0.65f,
                x - tab * s, y + h * 0.6f,
                x - tab * s, y + h * 0.5f
            )
            path.cubicTo(
                x - tab * s, y + h * 0.4f,
                x - tab * 0.4f * s, y + h * 0.35f,
                x, y + h * 0.35f
            )
            path.lineTo(x, y)
        }
        path.close()
        return path
    }

    fun checkSnap(piece: PuzzlePiece, snapThreshold: Float = 60f): Boolean {
        val dx = piece.currentX - piece.correctX
        val dy = piece.currentY - piece.correctY
        val dist = hypot(dx, dy)

        if (dist <= snapThreshold) {
            piece.currentX = piece.correctX
            piece.currentY = piece.correctY
            piece.isSnapped = true
            piece.inTray = false
            snappedCount++
            return true
        }
        return false
    }

    fun isComplete(): Boolean = snappedCount >= gridSize * gridSize

    fun calculateStars(): Int {
        val elapsedSec = (System.currentTimeMillis() - startTime) / 1000
        val target = gridSize * gridSize * 15
        return when {
            elapsedSec <= target && moveCount <= gridSize * gridSize * 2.5 -> 3
            elapsedSec <= target * 1.8 -> 2
            else -> 1
        }
    }
}
