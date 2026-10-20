# 📱 Установка иконки приложения

## Автоматическая установка (рекомендуется)

После генерации Android проекта, замените иконки вручную:

### 1. Подготовьте иконки разных размеров

Вам нужны PNG файлы следующих размеров:
- `ic_launcher.png` — 48x48 (mdpi)
- `ic_launcher.png` — 72x72 (hdpi)
- `ic_launcher.png` — 96x96 (xhdpi)
- `ic_launcher.png` — 144x144 (xxhdpi)
- `ic_launcher.png` — 192x192 (xxxhdpi)

### 2. Скопируйте иконки в Android проект

```bash
# Создайте папку для иконок (если ещё не создана)
mkdir -p android/app/src/main/res/mipmap-mdpi
mkdir -p android/app/src/main/res/mipmap-hdpi
mkdir -p android/app/src/main/res/mipmap-xhdpi
mkdir -p android/app/src/main/res/mipmap-xxhdpi
mkdir -p android/app/src/main/res/mipmap-xxxhdpi

# Скопируйте иконки (используйте сгенерированную иконку из public/)
cp public/icon-512.png android/app/src/main/res/mipmap-mdpi/ic_launcher.png
cp public/icon-512.png android/app/src/main/res/mipmap-hdpi/ic_launcher.png
cp public/icon-512.png android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
cp public/icon-512.png android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
cp public/icon-512.png android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png
```

### 3. Используйте онлайн-генератор иконок

Для автоматической генерации всех размеров используйте:
- [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html)
- [App Icon Generator](https://appicon.co/)

Загрузите сгенерированную иконку (512x512), и сервис создаст все необходимые размеры.

## Альтернатива: Adaptive Icon (Android 8.0+)

Для современных Android устройств можно использовать adaptive icon:

### 1. Создайте два слоя:
- **Foreground** (передний план) — основной элемент (круг квинт)
- **Background** (фон) — тёмно-синий (#0f0f1e)

### 2. Структура файлов:
```
android/app/src/main/res/
├── mipmap-anydpi-v26/
│   ├── ic_launcher.xml
│   └── ic_launcher_round.xml
├── drawable/
│   ├── ic_launcher_foreground.xml
│   └── ic_launcher_background.xml
└── mipmap-*/
    └── ic_launcher.png
```

### 3. Пример `ic_launcher.xml`:
```xml
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background"/>
    <foreground android:drawable="@drawable/ic_launcher_foreground"/>
</adaptive-icon>
```

## Обновление иконки в Capacitor

После замены иконок пересоберите проект:

```bash
# Синхронизируйте изменения
npx cap sync android

# Или пересоберите APK
cd android
./gradlew assembleDebug
```

## Проверка иконки

1. Установите APK на устройство
2. Найдите приложение "Circle of Fifths" в списке приложений
3. Проверьте, что иконка отображается корректно

## Рекомендации

- Используйте **PNG** формат с прозрачностью
- Минимальный размер: **512x512** пикселей
- Избегайте мелких деталей — они не будут видны при маленьком размере
- Используйте контрастные цвета для лучшей видимости
- Тестируйте иконку на разных фонах (светлый/тёмный режим)

## Текущая иконка

Сгенерированная иконка находится в `public/icon-512.png` и может быть использована как основа для создания всех необходимых размеров.

---

**Примечание:** Иконка по умолчанию от Capacitor будет заменена после выполнения шагов выше.
