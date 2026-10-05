package com.brainpuzzlekids.game

import android.content.Context
import android.media.AudioAttributes
import android.media.SoundPool
import android.speech.tts.TextToSpeech
import java.util.Locale

class AudioManager(context: Context) {
    private val soundPool: SoundPool
    private var snapSoundId: Int = 0
    private var clickSoundId: Int = 0
    private var victorySoundId: Int = 0
    private var tts: TextToSpeech? = null
    private var isTtsReady = false

    var isSoundEnabled: Boolean = true
    var isMusicEnabled: Boolean = true
    var isVoiceEnabled: Boolean = true

    init {
        val attributes = AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_GAME)
            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
            .build()

        soundPool = SoundPool.Builder()
            .setMaxStreams(5)
            .setAudioAttributes(attributes)
            .build()

        // Initialize Android TextToSpeech offline for voice congratulations
        try {
            tts = TextToSpeech(context.applicationContext) { status ->
                if (status == TextToSpeech.SUCCESS) {
                    tts?.language = Locale.US
                    tts?.setPitch(1.2f) // warm, friendly tone for kids
                    tts?.setSpeechRate(0.95f)
                    isTtsReady = true
                }
            }
        } catch (_: Exception) {
            // Graceful fallback if TTS is unavailable on device
            tts = null
        }
    }

    fun playClick() {
        if (!isSoundEnabled) return
        if (clickSoundId != 0) soundPool.play(clickSoundId, 0.7f, 0.7f, 1, 0, 1.0f)
    }

    fun playSnap() {
        if (!isSoundEnabled) return
        if (snapSoundId != 0) soundPool.play(snapSoundId, 0.9f, 0.9f, 1, 0, 1.0f)
    }

    fun playVictory() {
        if (!isSoundEnabled) return
        if (victorySoundId != 0) soundPool.play(victorySoundId, 1.0f, 1.0f, 1, 0, 1.0f)
    }

    fun speakCongratulations(childName: String) {
        if (!isVoiceEnabled || !isTtsReady) return
        try {
            val text = "Congratulations, $childName! Great job!"
            tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "CONGRATS_UTTERANCE")
        } catch (_: Exception) {
            // Safe non-crashing execution
        }
    }

    fun release() {
        try {
            tts?.stop()
            tts?.shutdown()
        } catch (_: Exception) {}
        soundPool.release()
    }
}
