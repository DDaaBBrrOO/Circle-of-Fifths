#!/bin/bash

# Скрипт для установки иконки приложения в Android проект
# Использование: ./scripts/setup-icon.sh

set -e

echo "🎨 Setting up app icon..."

# Проверка наличия Android проекта
if [ ! -d "android" ]; then
    echo "❌ Android directory not found!"
    echo "Please run 'npx cap add android' first"
    exit 1
fi

# Проверка наличия исходной иконки
if [ ! -f "public/icon.svg" ]; then
    echo "❌ Source icon not found at public/icon.svg"
    exit 1
fi

# Создаём директории для иконок разных размеров
echo "📁 Creating icon directories..."
mkdir -p android/app/src/main/res/mipmap-mdpi
mkdir -p android/app/src/main/res/mipmap-hdpi
mkdir -p android/app/src/main/res/mipmap-xhdpi
mkdir -p android/app/src/main/res/mipmap-xxhdpi
mkdir -p android/app/src/main/res/mipmap-xxxhdpi
mkdir -p android/app/src/main/res/mipmap-anydpi-v26
mkdir -p android/app/src/main/res/drawable

# Конвертируем SVG в PNG разных размеров (если установлен ImageMagick или librsvg)
if command -v convert &> /dev/null; then
    echo "🔄 Converting SVG to PNG using ImageMagick..."
    convert -background none public/icon.svg -resize 48x48 android/app/src/main/res/mipmap-mdpi/ic_launcher.png
    convert -background none public/icon.svg -resize 72x72 android/app/src/main/res/mipmap-hdpi/ic_launcher.png
    convert -background none public/icon.svg -resize 96x96 android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
    convert -background none public/icon.svg -resize 144x144 android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
    convert -background none public/icon.svg -resize 192x192 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png
    
    # Round icons
    convert -background none public/icon.svg -resize 48x48 android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png
    convert -background none public/icon.svg -resize 72x72 android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png
    convert -background none public/icon.svg -resize 96x96 android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png
    convert -background none public/icon.svg -resize 144x144 android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png
    convert -background none public/icon.svg -resize 192x192 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png
    
    echo "✅ Icons converted successfully!"
elif command -v rsvg-convert &> /dev/null; then
    echo "🔄 Converting SVG to PNG using librsvg..."
    rsvg-convert -w 48 -h 48 public/icon.svg -o android/app/src/main/res/mipmap-mdpi/ic_launcher.png
    rsvg-convert -w 72 -h 72 public/icon.svg -o android/app/src/main/res/mipmap-hdpi/ic_launcher.png
    rsvg-convert -w 96 -h 96 public/icon.svg -o android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
    rsvg-convert -w 144 -h 144 public/icon.svg -o android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
    rsvg-convert -w 192 -h 192 public/icon.svg -o android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png
    
    # Round icons
    cp android/app/src/main/res/mipmap-mdpi/ic_launcher.png android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png
    cp android/app/src/main/res/mipmap-hdpi/ic_launcher.png android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png
    cp android/app/src/main/res/mipmap-xhdpi/ic_launcher.png android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png
    cp android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png
    cp android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png
    
    echo "✅ Icons converted successfully!"
else
    echo "⚠️  No SVG converter found (ImageMagick or librsvg)"
    echo "Please install one of them:"
    echo "  - ImageMagick: apt-get install imagemagick"
    echo "  - librsvg: apt-get install librsvg2-bin"
    echo ""
    echo "Or manually convert public/icon.svg to PNG files and place them in:"
    echo "  android/app/src/main/res/mipmap-*/ic_launcher.png"
    exit 1
fi

# Копируем SVG как foreground для adaptive icon
cp public/icon.svg android/app/src/main/res/drawable/ic_launcher_foreground.svg

# Создаём background для adaptive icon
cat > android/app/src/main/res/drawable/ic_launcher_background.xml << 'EOF'
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="#0f0f1e"/>
</shape>
EOF

# Создаём adaptive icon конфигурацию
cat > android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml << 'EOF'
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background"/>
    <foreground android:drawable="@drawable/ic_launcher_foreground"/>
</adaptive-icon>
EOF

cat > android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml << 'EOF'
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background"/>
    <foreground android:drawable="@drawable/ic_launcher_foreground"/>
</adaptive-icon>
EOF

echo "✅ Adaptive icon configuration created!"
echo ""
echo "🎉 Icon setup complete!"
echo "Now rebuild your APK:"
echo "  cd android && ./gradlew assembleDebug"
