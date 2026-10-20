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
  // Иконки будут скопированы из public/ при сборке
  // Для кастомных иконок нужно вручную добавить в android/app/src/main/res/
};

export default config;
