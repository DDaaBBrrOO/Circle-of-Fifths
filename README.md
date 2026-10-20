# 🎸 Circle of Fifths — Guitar Theory Tool

Интерактивное веб-приложение с кварто-квинтовым кругом для гитаристов, упакованное в Android APK.

![Circle of Fifths](https://img.shields.io/badge/Circle_of_Fifths-Guitar_Tool-FFD700?style=for-the-badge)
![Android](https://img.shields.io/badge/Android-APK-3DDC84?style=for-the-badge&logo=android)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-Automated-2088FF?style=for-the-badge&logo=githubactions)

## ✨ Возможности

- 🎵 **Интерактивный круг** — тоника всегда на 12 часов, плавная анимация поворота
- 🎸 **Аппликатуры аккордов** — визуализация на грифе гитары с номерами пальцев
- 🎼 **Диатонические аккорды** — все 7 аккордов тональности с римскими цифрами
- 📊 **Ступени гаммы** — ноты с указанием ступени (I, II, III...)
- 🌐 **Два языка** — переключение EN/RU
- 🎯 **Подсветка нот гаммы** — наглядное отображение на круге

## 📱 Установка APK

### Скачать готовый APK

1. Перейдите в раздел [Releases](../../releases)
2. Скачайте последний `circle-of-fifths.apk`
3. Установите на Android-устройство (разрешите установку из неизвестных источников)

### Автоматическая сборка через GitHub Actions

APK автоматически собирается при:
- Push в ветку `main` или `master`
- Создании тега версии `v*` (например, `v1.0.0`)
- Ручном запуске workflow

#### Ручной запуск сборки

1. Перейдите в **Actions** → **Build Android APK**
2. Нажмите **Run workflow**
3. Выберите тип сборки (debug/release)
4. Дождитесь завершения (~10 минут)
5. Скачайте APK из артефактов

## 🛠️ Локальная разработка

### Требования

- Node.js 20+
- npm 10+
- Java JDK 17+
- Android SDK (API 34)

### Установка

```bash
# Клонируйте репозиторий
git clone https://github.com/your-username/circle-of-fifths.git
cd circle-of-fifths

# Установите зависимости
npm install

# Установите Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# Запустите dev-сервер
npm run dev
```

### Сборка APK локально

```bash
# 1. Соберите веб-приложение
npm run build

# 2. Добавьте Android платформу (только первый раз)
npx cap add android

# 3. Синхронизируйте веб-ассеты
npx cap sync android

# 4. Откройте в Android Studio (опционально)
npx cap open android

# 5. Или соберите APK через Gradle
cd android
./gradlew assembleDebug

# APK будет в: android/app/build/outputs/apk/debug/app-debug.apk
```

### Синхронизация изменений

После изменений в веб-коде:

```bash
npm run build
npx cap sync android
```

## 📂 Структура проекта

```
.
├── .github/
│   └── workflows/
│       └── build-apk.yml      # GitHub Actions workflow
├── src/
│   ├── components/
│   │   ├── CircleOfFifths.tsx # Интерактивный круг
│   │   └── GuitarNeck.tsx     # Гриф гитары
│   ├── data/
│   │   ├── musicData.ts       # Музыкальные данные и аккорды
│   │   └── translations.ts    # Локализация EN/RU
│   ├── App.tsx                # Главный компонент
│   ├── main.tsx               # Точка входа
│   └── index.css              # Стили
├── capacitor.config.ts        # Конфигурация Capacitor
├── package.json
├── vite.config.js
└── README.md
```

## 🎯 Использование

### Выбор тональности
- Тапните по сегменту на круге — тоника переместится на 12 часов
- Внешнее кольцо — мажорные тональности
- Внутреннее кольцо — минорные тональности

### Просмотр аппликатуры
- Выберите тональность
- Тапните на аккорд в списке диатонических аккордов
- Внизу появится панель с аппликатурой на грифе
- Переключайте варианты (open, barre) свайпом

### Переключение языка
- Нажмите кнопку **EN/RU** в правом верхнем углу
- Текущий язык отображается на кнопке

## 🔧 Настройка GitHub Actions

### Секреты (опционально)

Для подписи release-сборки добавьте в **Settings → Secrets**:

```
ANDROID_KEYSTORE_PASSWORD=your_password
ANDROID_KEY_ALIAS=your_alias
ANDROID_KEY_PASSWORD=your_key_password
```

### Переменные окружения

В файле `.github/workflows/build-apk.yml` можно настроить:

```yaml
env:
  NODE_VERSION: '20'        # Версия Node.js
  JAVA_VERSION: '17'        # Версия Java
  ANDROID_API_LEVEL: '34'   # Целевой API Android
  ANDROID_BUILD_TOOLS: '34.0.0'  # Версия Build Tools
```

## 📊 CI/CD Pipeline

```
┌─────────────┐
│   Push/PR   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Checkout   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Setup Env   │ ← Node.js, Java, Android SDK
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ npm install │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ npm build   │ ← Vite production build
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Capacitor   │ ← Add Android + Sync
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Gradle     │ ← Build APK
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Upload     │ ← Artifact / Release
└─────────────┘
```

## 🐛 Troubleshooting

### Ошибка: "SDK location not found"

Создайте файл `android/local.properties`:

```properties
sdk.dir=/usr/lib/android-sdk
```

### Ошибка: "Failed to install the following Android SDK packages"

```bash
# Принудительно примите лицензии
yes | sdkmanager --licenses
```

### APK не устанавливается

```bash
# Проверьте минимальную версию Android
# В android/app/build.gradle:
minSdkVersion 22  # Android 5.1+
```

### Capacitor sync не работает

```bash
# Очистите кеш и пересоберите
rm -rf node_modules/.cache
rm -rf android/.gradle
npm run build
npx cap sync android
```

## 📄 Лицензия

MIT

## 🤝 Contributing

1. Fork репозитория
2. Создайте ветку (`git checkout -b feature/AmazingFeature`)
3. Commit изменения (`git commit -m 'Add AmazingFeature'`)
4. Push в ветку (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

## 📞 Контакты

Автор: Your Name  
Email: your.email@example.com

---

**Made with ❤️ for guitarists**
