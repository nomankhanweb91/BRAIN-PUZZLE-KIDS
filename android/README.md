# Brain Puzzle Kids - Android Mobile Game

A lightweight children's jigsaw puzzle game for Android smartphones and tablets.

## Key Features & Specifications
- **Target OS**: Android 7.0+ (API 24 to 34)
- **Primary Orientation**: Landscape (16:9, 18:9, 19.5:9, 4:3 tablets)
- **Rendering**: Hardware-accelerated 2D Canvas & SurfaceView (`GameView.kt`)
- **Performance**: 60 FPS target, minimal RAM footprint (<40MB heap), zero heavy 3D engine overhead
- **Audio**: Low-latency `SoundPool` for pops, clicks, snaps, and victory fanfare
- **Ads & Policy**: Google AdMob with official Test Ad IDs and strict COPPA / Google Play Families Policy compliance (child-directed flag active)
- **Offline Gameplay**: 100% playable offline with persistent local `SharedPreferences`

## How to Build in Android Studio
1. Open Android Studio (Hedgehog, Iguana, Jellyfish, or newer).
2. Select **Open** and choose this `android` folder.
3. Allow Gradle to sync dependencies (`androidx.core`, `material`, `play-services-ads`).
4. Select a Connected Android Device or Emulator running API 24+.
5. Click **Run 'app'** (`Shift + F10`).
