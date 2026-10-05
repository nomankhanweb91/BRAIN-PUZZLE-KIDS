package com.brainpuzzlekids.game

import android.content.Context
import android.graphics.*
import android.util.AttributeSet
import android.view.MotionEvent
import android.view.SurfaceHolder
import android.view.SurfaceView

class GameView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null
) : SurfaceView(context, attrs), SurfaceHolder.Callback, Runnable {

    private var thread: Thread? = null
    private var isRunning = false
    private val paint = Paint(Paint.ANTI_ALIAS_FLAG)
    private var engine: PuzzleEngine? = null
    private var activePiece: PuzzlePiece? = null
    private var touchOffsetX = 0f
    private var touchOffsetY = 0f

    var onSnapListener: (() -> Unit)? = null
    var onCompleteListener: ((stars: Int) -> Unit)? = null

    init {
        holder.addCallback(this)
        isFocusable = true
    }

    fun setEngine(puzzleEngine: PuzzleEngine) {
        this.engine = puzzleEngine
    }

    override fun surfaceCreated(holder: SurfaceHolder) {
        isRunning = true
        thread = Thread(this).apply { start() }
    }

    override fun surfaceChanged(holder: SurfaceHolder, format: Int, width: Int, height: Int) {}

    override fun surfaceDestroyed(holder: SurfaceHolder) {
        isRunning = false
        thread?.join()
    }

    override fun run() {
        while (isRunning) {
            val canvas = holder.lockCanvas() ?: continue
            try {
                drawGame(canvas)
            } finally {
                holder.unlockCanvasAndPost(canvas)
            }
        }
    }

    private fun drawGame(canvas: Canvas) {
        // Draw warm wooden background
        canvas.drawColor(Color.parseColor("#451a03"))

        val eng = engine ?: return

        // Draw snapped pieces
        for (piece in eng.pieces) {
            if (piece.isSnapped) {
                piece.bitmap?.let { bmp ->
                    canvas.drawBitmap(bmp, piece.correctX, piece.correctY, paint)
                }
            }
        }

        // Draw dragging piece on top
        activePiece?.let { piece ->
            piece.bitmap?.let { bmp ->
                canvas.drawBitmap(bmp, piece.currentX, piece.currentY, paint)
            }
        }
    }

    override fun onTouchEvent(event: MotionEvent): Boolean {
        val eng = engine ?: return super.onTouchEvent(event)
        val x = event.x
        val y = event.y

        when (event.action) {
            MotionEvent.ACTION_DOWN -> {
                // Find unsnapped piece under touch
                for (piece in eng.pieces.reversed()) {
                    if (!piece.isSnapped && x >= piece.currentX && x <= piece.currentX + eng.cellWidth &&
                        y >= piece.currentY && y <= piece.currentY + eng.cellHeight
                    ) {
                        activePiece = piece
                        touchOffsetX = x - piece.currentX
                        touchOffsetY = y - piece.currentY
                        eng.moveCount++
                        return true
                    }
                }
            }
            MotionEvent.ACTION_MOVE -> {
                activePiece?.let { piece ->
                    piece.currentX = x - touchOffsetX
                    piece.currentY = y - touchOffsetY
                }
            }
            MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                activePiece?.let { piece ->
                    val snapped = eng.checkSnap(piece)
                    if (snapped) {
                        onSnapListener?.invoke()
                        if (eng.isComplete()) {
                            onCompleteListener?.invoke(eng.calculateStars())
                        }
                    }
                }
                activePiece = null
            }
        }
        return true
    }
}
