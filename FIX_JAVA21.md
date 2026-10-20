# ✅ Проблема решена: Java 21

## Что было исправлено

### Ошибка
```
error: invalid source release: 21
Execution failed for task ':capacitor-android:compileDebugJavaWithJavac'
```

### Причина
Capacitor (последняя версия) требует **Java 21** для компиляции, но в workflow была установлена Java 17.

### Решение
Обновлена версия Java в `.github/workflows/build-apk.yml`:

```yaml
env:
  NODE_VERSION: '22'
  JAVA_VERSION: '21'  # ← Было: '17'
```

## Обновлённые файлы

1. **`.github/workflows/build-apk.yml`**
   - `JAVA_VERSION: '17'` → `JAVA_VERSION: '21'`

2. **`README.md`**
   - Обновлены требования: Java JDK 21+

3. **`scripts/build-apk-local.sh`**
   - Обновлена проверка версии Java

4. **`QUICKSTART.md`**
   - Обновлена структура workflow

5. **`TROUBLESHOOTING.md`**
   - Добавлена секция с описанием этой ошибки и решением

## Следующие шаги

1. **Закоммитьте изменения:**
   ```bash
   git add .
   git commit -m "fix: update Java version to 21 for Capacitor compatibility"
   git push
   ```

2. **Дождитесь завершения workflow** (~10-15 минут)

3. **Скачайте APK** из артефактов

## Локальная разработка

Если вы разрабатываете локально, убедитесь, что у вас установлена Java 21:

```bash
# Проверьте версию
java -version

# Должно показать: openjdk version "21.x.x"

# Если нужна Java 21, установите через SDKMAN
curl -s "https://get.sdkman.io" | bash
sdk install java 21.0.2-zulu
sdk use java 21.0.2-zulu
```

## Примечание

Capacitor 5.x и выше требует Java 21. Это связано с тем, что Android Gradle Plugin 8.x требует Java 21 для компиляции.

---

**Теперь сборка должна пройти успешно!** 🎉
