# 🚀 Быстрый старт — Сборка APK

## Что было исправлено

### ❌ Проблема: `Failed to find package 'tools'`
**Причина:** Action `android-actions/setup-android@v3` пытается установить устаревший пакет `tools`, который удалён из Android SDK.

**Решение:** Убран сторонний action, используется встроенный Android SDK на `ubuntu-latest`.

### ❌ Проблема: `BUILD FAILED in 56s` (без конкретной ошибки)
**Причины:**
1. Дублирующийся ключ `server` в `capacitor.config.ts`
2. Недостаточно памяти для Gradle
3. Отсутствие детального логирования

**Решения:**
- ✅ Исправлен `capacitor.config.ts`
- ✅ Добавлен `android-gradle.properties` с увеличенной памятью (4GB)
- ✅ Добавлено детальное логирование с `--stacktrace --info`
- ✅ Автоматическая проверка и исправление типичных проблем
- ✅ Загрузка логов при ошибке

### ❌ Проблема: `Resource not accessible by integration` при создании Release
**Причина:** GitHub Actions по умолчанию имеет ограниченные права для `GITHUB_TOKEN`. Для создания релизов нужны явные права на запись в `contents`.

**Решение:**
- ✅ Добавлен `permissions: contents: write` в job
- ✅ Изменён способ передачи токена: `env:` → `with: token:`

## Использование

### Автоматическая сборка

Workflow запускается автоматически при:
- Push в `main` или `master`
- Создании тега `v*` (например, `v1.0.0`)
- Pull Request в main/master

### Ручной запуск

1. Перейдите в **Actions** → **Build Android APK**
2. Нажмите **Run workflow**
3. Выберите тип сборки:
   - `debug` — для тестирования
   - `release` — для публикации
4. Дождитесь завершения (~10-15 минут)
5. Скачайте APK из артефактов

### Создание релиза

```bash
# Создайте тег версии
git tag v1.0.0
git push origin v1.0.0

# APK автоматически прикрепится к Release
```

## Структура workflow

```
1. 📥 Checkout repository
2. 🔧 Setup Node.js 22
3. ☕ Setup Java JDK 21
4. 🤖 Configure Android SDK (встроенный)
5. 📥 Install npm dependencies
6. 🏗️ Build web app (Vite)
7. 🔌 Install Capacitor
8. 📱 Initialize Capacitor (добавляет Android)
9. 🔄 Sync Capacitor (копирует веб-ассеты)
10. 🔐 Make gradlew executable
11. 📝 Configure Android SDK path
12. 🔧 Fix common Capacitor issues
13. 🔍 Check Gradle configuration
14. 🔨 Build APK (с детальными логами)
15. 🔍 Locate APK
16. 📤 Upload APK artifact
17. 📤 Upload Gradle logs (при ошибке)
18. 🚀 Create GitHub Release (при теге)
19. 📊 Build Summary
```

## Отладка

### Если сборка упала

1. **Скачайте логи:**
   - Перейдите в Actions → ваш workflow run
   - Скачайте артефакт `gradle-logs`
   - Изучите `gradle-build.log`

2. **Проверьте вывод шагов:**
   - Каждый шаг выводит детальную информацию
   - Ищите строки с `❌` или `Error:`

3. **Локальная отладка:**
   ```bash
   chmod +x scripts/build-apk-local.sh
   ./scripts/build-apk-local.sh debug
   ```

### Типичные ошибки

| Ошибка | Решение |
|--------|---------|
| `Web assets not found` | Пересоберите: `npm run build && npx cap sync android` |
| `SDK location not found` | Проверьте `android/local.properties` |
| `OutOfMemoryError` | Увеличьте память в `gradle.properties` |
| `namespace not found` | Workflow автоматически исправит |

## Файлы

```
.github/workflows/
└── build-apk.yml          # GitHub Actions workflow

capacitor.config.ts        # Конфигурация Capacitor
android-gradle.properties  # Настройки Gradle (память, AndroidX)

scripts/
└── build-apk-local.sh     # Скрипт для локальной сборки

TROUBLESHOOTING.md         # Подробное руководство по отладке
README.md                  # Общая документация
```

## Локальная сборка

```bash
# Установите зависимости
npm install

# Установите Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# Запустите скрипт
chmod +x scripts/build-apk-local.sh
./scripts/build-apk-local.sh debug

# Или вручную:
npm run build
npx cap add android
npx cap sync android
cd android
./gradlew assembleDebug
```

## Полезные ссылки

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Build Guide](https://developer.android.com/build)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) — подробное руководство

---

**Если проблема не решена:** создайте issue с полным логом сборки и версиями инструментов.
