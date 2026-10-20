# ✅ Исправлена ошибка прав доступа при создании GitHub Release

## Проблема

При попытке создать GitHub Release через `softprops/action-gh-release@v2` возникала ошибка:

```
⚠️ Unexpected error fetching GitHub release for tag refs/tags/v1.0.0: 
HttpError: Resource not accessible by integration - 
https://docs.github.com/rest/releases/releases#generate-release-notes-content-for-a-release
```

## Причина

GitHub Actions по умолчанию предоставляет `GITHUB_TOKEN` с **минимальными правами** (read-only для большинства ресурсов). Для создания релизов требуются права на **запись** в `contents` (репозиторий).

### Что происходит:
1. Workflow запускается с `GITHUB_TOKEN`
2. Action `softprops/action-gh-release@v2` пытается создать Release через GitHub API
3. API отклоняет запрос из-за недостаточных прав
4. Сборка APK прошла успешно, но релиз не создан

## Решение

### 1. Добавьте `permissions` в job

В файле `.github/workflows/build-apk.yml` добавьте явное указание прав:

```yaml
jobs:
  build-apk:
    name: Build APK
    runs-on: ubuntu-latest
    timeout-minutes: 30
    permissions:
      contents: write  # ← Добавьте эту строку
```

### 2. Используйте `token` вместо `env` в action

Обновите шаг создания релиза:

```yaml
# ❌ Неправильно (старый способ):
- name: 🚀 Create GitHub Release
  uses: softprops/action-gh-release@v2
  with:
    files: ${{ steps.find_apk.outputs.apk_path }}
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

# ✅ Правильно (новый способ):
- name: 🚀 Create GitHub Release
  uses: softprops/action-gh-release@v2
  with:
    files: ${{ steps.find_apk.outputs.apk_path }}
    token: ${{ secrets.GITHUB_TOKEN }}
```

## Что было изменено

### `.github/workflows/build-apk.yml`

**Добавлено:**
```yaml
jobs:
  build-apk:
    name: Build APK
    runs-on: ubuntu-latest
    timeout-minutes: 30
    permissions:
      contents: write  # ← Добавлено
```

**Изменено:**
```yaml
# Было:
- name: 🚀 Create GitHub Release
  uses: softprops/action-gh-release@v2
  with:
    files: ${{ steps.find_apk.outputs.apk_path }}
    generate_release_notes: true
    draft: false
    prerelease: false
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

# Стало:
- name: 🚀 Create GitHub Release
  uses: softprops/action-gh-release@v2
  with:
    files: ${{ steps.find_apk.outputs.apk_path }}
    generate_release_notes: true
    draft: false
    prerelease: false
    token: ${{ secrets.GITHUB_TOKEN }}  # ← Изменено с env на with
```

### `TROUBLESHOOTING.md`

Добавлена новая секция с описанием проблемы и решением.

## Почему это работает

### `permissions: contents: write`
- Даёт `GITHUB_TOKEN` право на **запись** в репозиторий
- Позволяет создавать теги, релизы, загружать артефакты
- Это **безопасно**, так как токен автоматически истекает после завершения workflow

### `token:` вместо `env:`
- Action `softprops/action-gh-release@v2` ожидает токен в параметре `with.token`
- Использование `env.GITHUB_TOKEN` устарело и может не работать в новых версиях action
- Явная передача токена делает конфигурацию более понятной

## Альтернативные решения

### Вариант 1: Использовать Personal Access Token (PAT)

Если вам нужны дополнительные права (например, для создания релизов в других репозиториях):

1. Создайте PAT в **Settings → Developer settings → Personal access tokens → Tokens (classic)**
2. Добавьте токен в **Settings → Secrets and variables → Actions** как `RELEASE_TOKEN`
3. Используйте его в workflow:

```yaml
- name: 🚀 Create GitHub Release
  uses: softprops/action-gh-release@v2
  with:
    files: ${{ steps.find_apk.outputs.apk_path }}
    token: ${{ secrets.RELEASE_TOKEN }}
```

⚠️ **Внимание:** PAT имеет доступ ко всем вашим репозиториям. Используйте только если необходимо.

### Вариант 2: Использовать GitHub App Token

Для enterprise-решений можно создать GitHub App с ограниченными правами:

1. Создайте GitHub App в **Settings → Developer settings → GitHub Apps**
2. Настройте права только для `contents: write`
3. Используйте action `tibdex/github-app-token` для генерации токена

```yaml
- name: Generate GitHub App token
  id: generate-token
  uses: tibdex/github-app-token@v2
  with:
    app_id: ${{ secrets.APP_ID }}
    private_key: ${{ secrets.APP_PRIVATE_KEY }}

- name: 🚀 Create GitHub Release
  uses: softprops/action-gh-release@v2
  with:
    files: ${{ steps.find_apk.outputs.apk_path }}
    token: ${{ steps.generate-token.outputs.token }}
```

## Проверка прав

Чтобы убедиться, что права настроены правильно, добавьте шаг диагностики:

```yaml
- name: 🔍 Check token permissions
  run: |
    echo "Token is set: ${{ secrets.GITHUB_TOKEN != '' }}"
    echo "Repository: ${{ github.repository }}"
    echo "Event: ${{ github.event_name }}"
    echo "Ref: ${{ github.ref }}"
```

## Дополнительные ресурсы

- [GitHub Actions Permissions](https://docs.github.com/en/actions/using-jobs/assigning-permissions-to-jobs)
- [softprops/action-gh-release Documentation](https://github.com/softprops/action-gh-release)
- [GitHub REST API - Releases](https://docs.github.com/en/rest/releases/releases)

## Следующие шаги

1. **Закоммитьте изменения:**
   ```bash
   git add .
   git commit -m "fix: add permissions for GitHub Release creation"
   git push
   ```

2. **Создайте тег для релиза:**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

3. **Проверьте результат:**
   - Перейдите в **Actions** → ваш workflow run
   - Убедитесь, что шаг "Create GitHub Release" прошёл успешно
   - Проверьте **Releases** → должен появиться новый релиз с APK

---

**Теперь релизы должны создаваться автоматически!** 🎉
