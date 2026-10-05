package com.brainpuzzlekids.game

import android.content.Context
import android.content.SharedPreferences

class SaveManager(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("brain_puzzle_kids_prefs", Context.MODE_PRIVATE)

    var childProfile: String
        get() = prefs.getString("child_profile", "Arham") ?: "Arham"
        set(value) = prefs.edit().putString("child_profile", if (value == "Arisha") "Arisha" else "Arham").apply()

    var isVoiceEnabled: Boolean
        get() = prefs.getBoolean("voice_enabled", true)
        set(value) = prefs.edit().putBoolean("voice_enabled", value).apply()

    var isSoundEnabled: Boolean
        get() = prefs.getBoolean("sound_enabled", true)
        set(value) = prefs.edit().putBoolean("sound_enabled", value).apply()

    var isMusicEnabled: Boolean
        get() = prefs.getBoolean("music_enabled", true)
        set(value) = prefs.edit().putBoolean("music_enabled", value).apply()

    var coins: Int
        get() = prefs.getInt("coins", 100)
        set(value) = prefs.edit().putInt("coins", value).apply()

    fun isLevelUnlocked(levelId: String): Boolean {
        return prefs.getBoolean("unlocked_$levelId", levelId == "animal_1")
    }

    fun unlockLevel(levelId: String) {
        prefs.edit().putBoolean("unlocked_$levelId", true).apply()
    }

    fun recordCompletion(levelId: String, stars: Int) {
        val prevStars = prefs.getInt("stars_$levelId", 0)
        if (stars > prevStars) {
            prefs.edit().putInt("stars_$levelId", stars).apply()
        }
        coins += stars * 15
    }

    fun getStars(levelId: String): Int = prefs.getInt("stars_$levelId", 0)
}
