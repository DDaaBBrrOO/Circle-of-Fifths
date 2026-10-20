# 🔧 Troubleshooting — Android APK Build

## Ошибка: `invalid source release: 21`

### Проблема
```
error: invalid source release: 21
Execution failed for task ':capacitor-android:compileDebugJavaWithJavac'
```

### Причина
Capacitor требует **Java 21**, но в workflow установлена более старая версия (например, Java 17).

### Решение
Обновите версию Java в `.github/workflows/build-apk.yml`:

```yaml
env:
  NODE_VERSION: '20'
  JAVA_VERSION: '21'  # ← Измените с 17 на 21
```

### Локальная разработка
Убедитесь, что у вас установлена Java 21:

```bash
# Проверьте версию
java -version

# Если нужна Java 21, установите через SDKMAN
curl -s "https://get.sdkman.io" | bash
sdk install java 21.0.2-zulu
sdk use java 21.0.2-zulu
```

---

## Ошибка: `Invalid workflow file: YAML syntax error`

### Проблема
```
Invalid workflow file: .github/workflows/build-apk.yml#L180
You have an error in your yaml syntax on line 180
```

### Причина
YAML парсер GitHub Actions не может обработать bash heredoc (`<< 'EOF'`) с одинарными кавычками внутри.

### Решение
Используйте `printf` вместо heredoc:

```yaml
# ❌ Неправильно (вызывает YAML ошибку):
cat >> app/build.gradle << 'EOF'
configurations.all {
    resolutionStrategy {
        force 'org.jetbrains.kotlin:kotlin-stdlib:1.9.24'
    }
}
EOF

# ✅ Правильно:
printf "\nconfigurations.all {\n    resolutionStrategy {\n        force \"org.jetbrains.kotlin:kotlin-stdlib:1.9.24\"\n    }\n}\n" >> app/build.gradle
```

---

## Ошибка: `Duplicate class kotlin.collections.jdk8.CollectionsJDK8Kt`

### Проблема
```
Execution failed for task ':app:checkDebugDuplicateClasses'.
Duplicate class kotlin.collections.jdk8.CollectionsJDK8Kt found in modules 
kotlin-stdlib-1.8.22.jar and kotlin-stdlib-jdk8-1.6.21.jar
```

### Причина
Начиная с Kotlin 1.8, модули `kotlin-stdlib-jdk7` и `kotlin-stdlib-jdk8` были объединены в основной `kotlin-stdlib`. Однако некоторые зависимости всё ещё подтягивают старые версии (1.6.21), что вызывает конфликт дублирующихся классов.

### Решение
Добавьте в `android/app/build.gradle` принудительное разрешение версий:

```gradle
configurations.all {
    resolutionStrategy {
        force 'org.jetbrains.kotlin:kotlin-stdlib:1.9.24'
        force 'org.jetbrains.kotlin:kotlin-stdlib-jdk7:1.9.24'
        force 'org.jetbrains.kotlin:kotlin-stdlib-jdk8:1.9.24'
    }
}
```

**Автоматическое исправление:** Workflow теперь автоматически добавляет этот блок после `npx cap add android`.

### Локальная разработка
Если вы разрабатываете локально, добавьте этот блок в `android/app/build.gradle` вручную или выполните:

```bash
cd android
cat >> app/build.gradle << 'EOF'

configurations.all {
    resolutionStrategy {
        force 'org.jetbrains.kotlin:kotlin-stdlib:1.9.24'
        force 'org.jetbrains.kotlin:kotlin-stdlib-jdk7:1.9.24'
        force 'org.jetbrains.kotlin:kotlin-stdlib-jdk8:1.9.24'
    }
}
EOF
```

---

## Ошибка: Gradle build failed

### Проблема: `BUILD FAILED in 56s`

Без конкретной ошибки в логах — это обычно означает одну из следующих проблем:

### 1. Отсутствуют зависимости Android SDK

**Симптом:**
```
Could not find platform 'android-34'
```

**Решение:**
```bash
# Установите необходимые компоненты
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager \
  "platforms;android-34" \
  "build-tools;34.0.0" \
  "platform-tools"
```

### 2. Проблема с Capacitor sync

**Симптом:**
```
[error] Unable to find android/app/src/main/assets/public
```

**Решение:**
```bash
# Пересоберите веб-приложение и синхронизируйте
npm run build
npx cap sync android
```

### 3. Неправильная версия Gradle

**Симптом:**
```
Unsupported Gradle version
```

**Решение:**
```bash
# Проверьте версию Gradle в android/gradle/wrapper/gradle-wrapper.properties
# Должна быть 8.0+ для Android Gradle Plugin 8.x

# Обновите wrapper
cd android
./gradlew wrapper --gradle-version 8.4
```

### 4. Проблема с Android Gradle Plugin

**Симптом:**
```
Could not resolve com.android.tools.build:gradle:8.x.x
```

**Решение:**
```bash
# Проверьте android/build.gradle
# Убедитесь, что версия AGP совместима с Gradle

# Очистите кеш
cd android
./gradlew clean
rm -rf .gradle
rm -rf app/build
```

### 5. Недостаточно памяти

**Симптом:**
```
Java heap space
OutOfMemoryError
```

**Решение:**
```bash
# Увеличьте память в android/gradle.properties
echo "org.gradle.jvmargs=-Xmx4g -XX:MaxMetaspaceSize=512m" >> android/gradle.properties
```

## Ошибка: Capacitor add android failed

### Проблема: `Platform android already exists`

**Решение:**
```bash
# Удалите существующую платформу
rm -rf android

# Добавьте заново
npx cap add android
```

### Проблема: `capacitor.config.ts not found`

**Решение:**
```bash
# Проверьте, что файл существует
ls -la capacitor.config.ts

# Если нет, создайте
npx cap init "Circle of Fifths" "com.circleoffifths.guitar" --web-dir=dist
```

## Ошибка: Web assets not synced

### Проблема: Пустой APK или белый экран

**Симптом:**
```
android/app/src/main/assets/public не существует
```

**Решение:**
```bash
# 1. Убедитесь, что веб-сборка актуальна
npm run build

# 2. Проверьте capacitor.config.ts
cat capacitor.config.ts
# Должно быть: webDir: 'dist'

# 3. Синхронизируйте заново
npx cap sync android

# 4. Проверьте результат
ls -la android/app/src/main/assets/public/
```

## Локальная отладка

### Запуск с детальными логами

```bash
# Дайте права на выполнение
chmod +x scripts/build-apk-local.sh

# Запустите с логами
./scripts/build-apk-local.sh debug 2>&1 | tee build.log

# Или с Gradle debug
cd android
./gradlew assembleDebug --no-daemon --stacktrace --info --debug
```

### Проверка структуры проекта

```bash
# Должна быть такая структура:
.
├── dist/                    # Веб-сборка
├── capacitor.config.ts      # Конфигурация Capacitor
├── android/
│   ├── app/
│   │   ├── build.gradle
│   │   └── src/main/
│   │       ├── assets/public/  # Веб-ассеты
│   │       └── java/
│   ├── build.gradle
│   ├── gradle/
│   ├── gradlew
│   └── local.properties
└── package.json
```

### Проверка Capacitor

```bash
# Проверьте статус
npx cap doctor android

# Покажет проблемы и рекомендации
```

## GitHub Actions отладка

### Скачать логи сборки

1. Перейдите в **Actions** → ваш workflow run
2. Скачайте артефакт **gradle-logs** (если build failed)
3. Изучите `gradle-build.log`

### Запуск с verbose логами

Workflow уже настроен на детальное логирование:
- `--stacktrace` — полный стек-трейс
- `--info` — информационные сообщения
- Логи сохраняются в `gradle-build.log`

### Ручной запуск для отладки

```bash
# В GitHub Actions:
# Actions → Build Android APK → Run workflow
# Выберите build_type: debug
```

## Типичные ошибки и решения

### `Execution failed for task ':app:mergeDebugResources'`

**Причина:** Проблема с ресурсами Android

**Решение:**
```bash
cd android
./gradlew clean
rm -rf app/build
./gradlew assembleDebug
```

### `AAPT: error: resource not found`

**Причина:** Отсутствуют ресурсы в Android проекте

**Решение:**
```bash
# Пересоздайте Android платформу
rm -rf android
npx cap add android
npx cap sync android
```

### `Failed to apply plugin 'com.android.internal.application'`

**Причина:** Несовместимость версий Gradle и AGP

**Решение:**
```bash
# Проверьте совместимость:
# https://developer.android.com/build/releases/gradle-plugin#updating-gradle

# Обновите Gradle wrapper
cd android
./gradlew wrapper --gradle-version 8.4
```

### `SDK location not found`

**Причина:** Не настроен путь к Android SDK

**Решение:**
```bash
# Создайте android/local.properties
echo "sdk.dir=$ANDROID_HOME" > android/local.properties

# Или укажите явно
echo "sdk.dir=/usr/local/lib/android/sdk" > android/local.properties
```

## Полезные команды

```bash
# Очистить все кэши
cd android
./gradlew clean
rm -rf .gradle
rm -rf app/build
rm -rf build

# Показать все задачи
./gradlew tasks

# Показать зависимости
./gradlew app:dependencies

# Проверить конфигурацию
./gradlew app:properties

# Собрать с полным логированием
./gradlew assembleDebug --no-daemon --stacktrace --info --debug 2>&1 | tee full-build.log
```

## Получение помощи

Если проблема не решена:

1. **Соберите полную информацию:**
   ```bash
   node --version
   java -version
   echo $ANDROID_HOME
   npx cap --version
   cd android && ./gradlew --version
   ```

2. **Создайте issue с:**
   - Полным логом сборки
   - Версиями всех инструментов
   - Содержимым `capacitor.config.ts`
   - Содержимым `android/app/build.gradle`

3. **Полезные ссылки:**
   - [Capacitor Docs](https://capacitorjs.com/docs)
   - [Android Build Docs](https://developer.android.com/build)
   - [Gradle User Manual](https://docs.gradle.org/current/userguide/userguide.html)
