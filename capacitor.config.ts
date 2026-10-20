import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.circleoffifths.guitar',
  appName: 'Circle of Fifths',
  webDir: 'dist',
  server: {
    // Используем https схему для Android
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
};

export default config;
