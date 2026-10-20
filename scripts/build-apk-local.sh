#!/bin/bash

# Скрипт для локальной сборки APK
# Использование: ./scripts/build-apk-local.sh [debug|release]

set -e

BUILD_TYPE=${1:-debug}

echo "🎸 Circle of Fifths — Local APK Build"
echo "======================================"
echo "Build type: $BUILD_TYPE"
echo ""

# Проверка зависимостей
echo "🔍 Checking dependencies..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 20+"
    exit 1
fi

if ! command -v java &> /dev/null; then
    echo "❌ Java not found. Please install Java JDK 17+"
    exit 1
fi

if [ -z "$ANDROID_HOME" ]; then
    echo "❌ ANDROID_HOME not set. Please set ANDROID_HOME environment variable"
    echo "   Example: export ANDROID_HOME=/path/to/android/sdk"
    exit 1
fi

echo "✅ Node.js: $(node --version)"
echo "✅ Java: $(java -version 2>&1 | head -n 1)"
echo "✅ Android SDK: $ANDROID_HOME"
echo ""

# Установка зависимостей
echo "📦 Installing npm dependencies..."
npm ci

# Сборка веб-приложения
echo ""
echo "🏗️  Building web app..."
npm run build
echo "✅ Web build completed"

# Установка Capacitor
echo ""
echo "🔌 Installing Capacitor..."
npm install --save @capacitor/core @capacitor/cli @capacitor/android

# Инициализация Android
echo ""
echo "📱 Initializing Android platform..."
rm -rf android
npx cap add android

# Синхронизация
echo ""
echo "🔄 Syncing Capacitor..."
npx cap sync android

# Настройка SDK path
echo ""
echo "📝 Configuring Android SDK path..."
echo "sdk.dir=$ANDROID_HOME" > android/local.properties

# Сборка APK
echo ""
echo "🔨 Building APK ($BUILD_TYPE)..."
cd android
chmod +x gradlew

if [ "$BUILD_TYPE" = "release" ]; then
    ./gradlew assembleRelease --no-daemon --stacktrace
    APK_PATH=$(find app/build/outputs/apk/release -name "*.apk" | head -1)
else
    ./gradlew assembleDebug --no-daemon --stacktrace
    APK_PATH=$(find app/build/outputs/apk/debug -name "*.apk" | head -1)
fi

cd ..

# Результат
echo ""
echo "======================================"
if [ -f "$APK_PATH" ]; then
    APK_SIZE=$(du -h "$APK_PATH" | cut -f1)
    echo "✅ APK built successfully!"
    echo "📍 Location: $APK_PATH"
    echo "📏 Size: $APK_SIZE"
    echo ""
    echo "To install on device:"
    echo "  adb install $APK_PATH"
else
    echo "❌ APK build failed!"
    exit 1
fi
