package com.brainpuzzlekids.game

import android.app.Activity
import com.google.android.gms.ads.*
import com.google.android.gms.ads.rewarded.RewardedAd
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback

object AdManager {
    // Official Google Test Ad Unit IDs
    const val TEST_REWARDED_ID = "ca-app-pub-3940256099942544/5224354917"
    const val TEST_INTERSTITIAL_ID = "ca-app-pub-3940256099942544/1033173712"

    private var rewardedAd: RewardedAd? = null

    fun initialize(activity: Activity) {
        // Enforce Child-Directed Treatment under Google Play Families Policy & COPPA
        val requestConfiguration = RequestConfiguration.Builder()
            .setTagForChildDirectedTreatment(RequestConfiguration.TAG_FOR_CHILD_DIRECTED_TREATMENT_TRUE)
            .setMaxAdContentRating(RequestConfiguration.MAX_AD_CONTENT_RATING_G)
            .build()
        MobileAds.setRequestConfiguration(requestConfiguration)

        MobileAds.initialize(activity) {
            loadRewardedAd(activity)
        }
    }

    private fun loadRewardedAd(activity: Activity) {
        val adRequest = AdRequest.Builder().build()
        RewardedAd.load(activity, TEST_REWARDED_ID, adRequest, object : RewardedAdLoadCallback() {
            override fun onAdLoaded(ad: RewardedAd) {
                rewardedAd = ad
            }
            override fun onAdFailedToLoad(error: LoadAdError) {
                rewardedAd = null
            }
        })
    }

    fun showRewardedAd(activity: Activity, onReward: (amount: Int) -> Unit) {
        rewardedAd?.let { ad ->
            ad.show(activity) { rewardItem ->
                onReward(rewardItem.amount)
                loadRewardedAd(activity) // reload next
            }
        } ?: run {
            // Safe fallback if offline: give reward anyway without blocking child
            onReward(50)
            loadRewardedAd(activity)
        }
    }
}
