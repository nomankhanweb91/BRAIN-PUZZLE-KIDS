package com.brainpuzzlekids.game

import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity

class GameActivity : AppCompatActivity() {
    private lateinit var gameView: GameView
    private lateinit var engine: PuzzleEngine
    private lateinit var audioManager: AudioManager
    private lateinit var saveManager: SaveManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        hideSystemUI()

        audioManager = AudioManager(this)
        saveManager = SaveManager(this)

        val childName = saveManager.childProfile
        val gridSize = intent.getIntExtra("GRID_SIZE", 3)
        val boardDim = 600f

        engine = PuzzleEngine(gridSize, boardDim, boardDim)
        val masterBmp = createSamplePuzzleBitmap(boardDim.toInt(), boardDim.toInt())
        engine.initPieces(masterBmp)

        gameView = GameView(this).apply {
            setEngine(this@GameActivity.engine)
            onSnapListener = { audioManager.playSnap() }
            onCompleteListener = { stars ->
                audioManager.playVictory()
                audioManager.speakCongratulations(childName)
                saveManager.recordCompletion("animal_1", stars)
            }
        }

        setContentView(gameView)
    }

    private fun createSamplePuzzleBitmap(w: Int, h: Int): Bitmap {
        val bmp = Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bmp)
        val paint = Paint(Paint.ANTI_ALIAS_FLAG)

        paint.color = Color.parseColor("#38bdf8")
        canvas.drawRect(0f, 0f, w.toFloat(), h.toFloat(), paint)

        // Cute friendly mascot
        paint.color = Color.parseColor("#94a3b8")
        canvas.drawCircle(w * 0.5f, h * 0.5f, w * 0.25f, paint)

        return bmp
    }

    private fun hideSystemUI() {
        window.decorView.systemUiVisibility = (
            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
            or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
            or View.SYSTEM_UI_FLAG_FULLSCREEN
        )
    }

    override fun onDestroy() {
        super.onDestroy()
        audioManager.release()
    }
}
