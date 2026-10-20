# ✅ Исправлено: Конфликт версий Kotlin stdlib

## Проблема

При сборке APK возникала ошибка:

```
Execution failed for task ':app:checkDebugDuplicateClasses'.
Duplicate class kotlin.collections.jdk8.CollectionsJDK8Kt found in modules 
kotlin-stdlib-1.8.22.jar and kotlin-stdlib-jdk8-1.6.21.jar
```

## Причина

Начиная с **Kotlin 1.8**, модули `kotlin-stdlib-jdk7` и `kotlin-stdlib-jdk8` были **объединены** в основной `kotlin-stdlib`. Это означает, что все классы из jdk7 и jdk8 теперь находятся в одном артефакте.

Однако некоторые зависимости (включая старые версии библиотек) всё ещё подтягивают отдельные модули `kotlin-stdlib-jdk7:1.6.21` и `kotlin-stdlib-jdk8:1.6.21`, что вызывает **конфликт дублирующихся классов**.

### Что происходит:
- Capacitor использует `kotlin-stdlib:1.8.22` (новая версия, включает всё)
- Какая-то зависимость тянет `kotlin-stdlib-jdk7:1.6.21` и `kotlin-stdlib-jdk8:1.6.21` (старые версии)
- Gradle обнаруживает одинаковые классы в обоих артефактах → ошибка сборки

## Решение

Добавлено **принудительное разрешение версий** в `android/app/build.gradle`:

```gradle
configurations.all {
    resolutionStrategy {
        force 'org.jetbrains.kotlin:kotlin-stdlib:1.9.24'
        force 'org.jetbrains.kotlin:kotlin-stdlib-jdk7:1.9.24'
        force 'org.jetbrains.kotlin:kotlin-stdlib-jdk8:1.9.24'
    }
}
```

Этот блок:
1. Принудительно устанавливает единую версию Kotlin (1.9.24) для всех модулей
2. Гарантирует, что все зависимости используют совместимые версии
3. Исключает конфликт дублирующихся классов

## Что было изменено

### `.github/workflows/build-apk.yml`

Добавлен шаг автоматического исправления после `npx cap add android`:

```yaml
# Fix: Resolve Kotlin stdlib duplicate classes conflict
if [ -f "app/build.gradle" ]; then
  cat >> app/build.gradle << 'EOF'

configurations.all {
    resolutionStrategy {
        force 'org.jetbrains.kotlin:kotlin-stdlib:1.9.24'
        force 'org.jetbrains.kotlin:kotlin-stdlib-jdk7:1.9.24'
        force 'org.jetbrains.kotlin:kotlin-stdlib-jdk8:1.9.24'
    }
}
EOF
fi
```

### `TROUBLESHOOTING.md`

Добавлена секция с описанием проблемы и решением для локальной разработки.

## Следующие шаги

1. **Закоммитьте изменения:**
   ```bash
   git add .
   git commit -m "fix: resolve Kotlin stdlib duplicate classes conflict"
   git push
   ```

2. **Дождитесь завершения workflow** (~10-15 минут)

3. **Скачайте APK** из артефактов

## Локальная разработка

Если вы разрабатываете локально, добавьте этот блок в `android/app/build.gradle` вручную:

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

Затем пересоберите:

```bash
./gradlew clean
./gradlew assembleDebug
```

## Дополнительная информация

- [Kotlin 1.8 Release Notes](https://kotlinlang.org/docs/whatsnew18.html)
- [Kotlin Standard Library](https://kotlinlang.org/docs/whatsnew18.html#updated-standard-library)
- [Gradle Resolution Strategy](https://docs.gradle.org/current/dsl/org.gradle.api.artifacts.ResolutionStrategy.html)

---

**Теперь сборка должна пройти успешно!** 🎉
