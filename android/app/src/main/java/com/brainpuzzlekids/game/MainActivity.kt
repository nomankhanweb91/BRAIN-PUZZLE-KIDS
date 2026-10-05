package com.brainpuzzlekids.game

import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    private lateinit var saveManager: SaveManager
    private lateinit var audioManager: AudioManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        hideSystemUI()

        saveManager = SaveManager(this)
        audioManager = AudioManager(this)
        AdManager.initialize(this)

        setContentView(R.layout.activity_main)
    }

    fun onPlayClicked(view: View) {
        audioManager.playClick()
        val intent = Intent(this, GameActivity::class.java).apply {
            putExtra("PUZZLE_ID", "animal_1")
            putExtra("GRID_SIZE", 3)
        }
        startActivity(intent)
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
}
