/**
 * AdManager: Google AdMob Integration Layer
 * Fully compliant with Google Play Families Policy & COPPA for child-directed apps.
 * Uses official Google Test Ad Unit IDs.
 */

export interface AdRewardCallback {
  onRewardEarned: (amount: number, type: 'coins' | 'hint') => void;
  onAdClosed: () => void;
  onAdFailed?: (error: string) => void;
}

export const ADMOB_TEST_CONFIG = {
  APP_ID: 'ca-app-pub-3940256099942544~3347511713',
  BANNER_ID: 'ca-app-pub-3940256099942544/6300978111',
  INTERSTITIAL_ID: 'ca-app-pub-3940256099942544/1033173712',
  REWARDED_ID: 'ca-app-pub-3940256099942544/5224354917',
  TAG_FOR_CHILD_DIRECTED_TREATMENT: true,
  MAX_AD_CONTENT_RATING: 'G', // G rating for general audience & kids
  ENABLED: true,
};

class AdManager {
  private isShowingAd = false;
  private currentCallback: AdRewardCallback | null = null;
  private puzzlesCompletedSinceLastAd = 0;

  public isEnabled(): boolean {
    return ADMOB_TEST_CONFIG.ENABLED;
  }

  public getTestIds() {
    return { ...ADMOB_TEST_CONFIG };
  }

  // Interstitial ad trigger check after natural transitions (e.g. every 3 puzzles)
  public onPuzzleFinished(onShowAdModal: () => void) {
    this.puzzlesCompletedSinceLastAd++;
    if (this.puzzlesCompletedSinceLastAd >= 4) {
      this.puzzlesCompletedSinceLastAd = 0;
      onShowAdModal();
    }
  }

  public requestRewardedVideo(rewardType: 'coins' | 'hint', callback: AdRewardCallback) {
    this.currentCallback = callback;
    this.isShowingAd = true;
  }

  public closeAd(rewardEarned: boolean, rewardType: 'coins' | 'hint' = 'coins') {
    this.isShowingAd = false;
    if (this.currentCallback) {
      if (rewardEarned) {
        this.currentCallback.onRewardEarned(rewardType === 'coins' ? 50 : 1, rewardType);
      }
      this.currentCallback.onAdClosed();
      this.currentCallback = null;
    }
  }
}

export const adManager = new AdManager();
