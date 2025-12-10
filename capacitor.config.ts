import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.carpenter.panel',
  appName: 'פאנל נגרות',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    backgroundColor: '#667eea'
  },
  splashScreen: {
    launchShowDuration: 2000,
    backgroundColor: '#667eea',
    showSpinner: false,
    androidSplashResourceName: 'splash',
    androidScaleType: 'CENTER_CROP'
  },
  ios: {
    backgroundColor: '#667eea',
    splash: {
      backgroundColor: '#667eea',
      image: 'assets/splash.png',
      resizeMode: 'CONTAIN'
    }
  }
};

export default config;
