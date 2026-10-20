# 🎨 Установка иконки приложения

## Автоматическая установка (GitHub Actions)

При сборке через GitHub Actions иконка устанавливается автоматически из файла `public/icon.svg` с использованием Node.js библиотеки `sharp`.

## Локальная установка

### Вариант 1: Использование скрипта (рекомендуется)

```bash
# Убедитесь, что зависимости установлены
npm install

# Запустите скрипт установки
chmod +x scripts/setup-icon.sh
./scripts/setup-icon.sh
```

Скрипт использует Node.js библиотеку `sharp` для конвертации SVG в PNG, поэтому не требует установки системных утилит.

### Вариант 2: Ручная установка

#### 1. Конвертируйте SVG в PNG

Используйте онлайн-сервисы:
- [CloudConvert](https://cloudconvert.com/svg-to-png)
- [Convertio](https://convertio.co/svg-png/)

Или командную строку:
```bash
# ImageMagick
convert -background none public/icon.svg -resize 512x512 icon.png

# librsvg
rsvg-convert -w 512 -h 512 public/icon.svg -o icon.png
```

#### 2. Создайте иконки разных размеров

Вам нужны PNG файлы следующих размеров:

| Плотность | Размер | Путь |
|-----------|--------|------|
| mdpi | 48x48 | `android/app/src/main/res/mipmap-mdpi/ic_launcher.png` |
| hdpi | 72x72 | `android/app/src/main/res/mipmap-hdpi/ic_launcher.png` |
| xhdpi | 96x96 | `android/app/src/main/res/mipmap-xhdpi/ic_launcher.png` |
| xxhdpi | 144x144 | `android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png` |
| xxxhdpi | 192x192 | `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` |

Для круглых иконок (Android 7.1+):
```bash
cp ic_launcher.png ic_launcher_round.png
```

#### 3. Настройте Adaptive Icon (Android 8.0+)

Создайте файл `android/app/src/main/res/drawable/ic_launcher_background.xml`:
```xml
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="#0f0f1e"/>
</shape>
```

Скопируйте `public/icon.svg` в `android/app/src/main/res/drawable/ic_launcher_foreground.svg`

Создайте `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml`:
```xml
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background"/>
    <foreground android:drawable="@drawable/ic_launcher_foreground"/>
</adaptive-icon>
```

#### 4. Пересоберите APK

```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

## Проверка иконки

1. Установите APK на устройство
2. Найдите приложение "Circle of Fifths" в списке приложений
3. Иконка должна соответствовать дизайну в навбаре приложения

## Дизайн иконки

Иконка должна содержать:
- Тёмно-синий фон (#0f0f1e)
- Золотой круг квинт с 12 сегментами
- Символ "♭" в центре
- Текст "Circle" под символом

Этот дизайн соответствует иконке в навбаре приложения.

## Альтернативные инструменты

### Ручная генерация через Node.js

Если вы хотите сгенерировать иконки вручную:

```bash
node scripts/generate-icons.js
```

Этот скрипт:
- Конвертирует `public/icon.svg` в PNG для всех плотностей экрана
- Создаёт обычные и круглые иконки
- Настраивает Adaptive Icon конфигурацию

### Онлайн-генераторы иконок

Если вы предпочитаете онлайн-инструменты:

- [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html)
- [App Icon Generator](https://appicon.co/)
- [Icon Kitchen](https://icon.kitchen/)

Загрузите `public/icon.svg` и скачайте готовый набор иконок для всех плотностей.

### Figma / Sketch

Если у вас есть исходник в Figma:
1. Экспортируйте в SVG
2. Сохраните в `public/icon.svg`
3. Запустите `node scripts/generate-icons.js`

## Устранение неполадок

### Ошибка: "Cannot find module 'sharp'"

Убедитесь, что зависимости установлены:
```bash
npm install
```

Если проблема сохраняется, переустановите sharp:
```bash
npm uninstall sharp
npm install sharp
```

### Ошибка: "Source icon not found at public/icon.svg"

Убедитесь, что файл `public/icon.svg` существует. Если нет, создайте его или скачайте из репозитория.

### Иконка не отображается

1. Убедитесь, что файлы иконок находятся в правильных директориях
2. Проверьте, что `AndroidManifest.xml` ссылается на правильные иконки:
   ```xml
   <application
       android:icon="@mipmap/ic_launcher"
       android:roundIcon="@mipmap/ic_launcher_round">
   ```
3. Очистите кеш приложения на устройстве
4. Пересоберите APK

### Иконка выглядит размытой

- Используйте PNG с правильным размером для каждой плотности
- Не масштабируйте маленькие иконки вверх
- Проверьте, что исходный SVG имеет высокое разрешение

### Adaptive Icon не работает

- Убедитесь, что используете Android 8.0+ (API 26+)
- Проверьте наличие файлов в `mipmap-anydpi-v26/`
- Убедитесь, что `ic_launcher_foreground.svg` существует

## Дополнительные ресурсы

- [Android Icon Design Guidelines](https://developer.android.com/guide/practices/ui_guidelines/icon_design_launcher)
- [Adaptive Icons](https://developer.android.com/about/versions/oreo/android-8.0#adaptive-icons)
- [Material Design Icons](https://material.io/design/iconography/product-icons)
