import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.brainpuzzlekids.game',
  appName: 'Brain Puzzle Kids',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
