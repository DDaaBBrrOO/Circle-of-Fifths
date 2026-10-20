import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.circleoffifths.guitar',
  appName: 'Circle of Fifths',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  // Иконки приложения генерируются из public/icon.svg
  // Скрипт scripts/generate-icons.js создаёт все необходимые размеры
};

export default config;
