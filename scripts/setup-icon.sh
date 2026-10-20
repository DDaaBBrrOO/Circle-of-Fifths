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

# Используем Node.js скрипт для генерации иконок
echo "📐 Generating icons using Node.js..."
node scripts/generate-icons.js

echo ""
echo "🎉 Icon setup complete!"
echo "Now rebuild your APK:"
echo "  cd android && ./gradlew assembleDebug"
