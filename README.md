# Лендинг Chanly

Публичный сайт Chanly на Vue 3. Сейчас маршрут `/` открывает каркас главной страницы. Для вёрстки секций уже есть общая SCSS-тема, кнопка и поле ввода.

## Запуск

Используйте Node.js 24.15.0 (см. [.nvmrc](.nvmrc)). Из корня репозитория выполните:

```sh
npm ci
npm run dev
```

Откройте локальный адрес, который напечатает Vite.

## Проверки и сборка

| Команда | Результат |
| --- | --- |
| `npm run lint` | ESLint проверяет JavaScript и Vue SFC. |
| `npm test` | Vitest один раз запускает тесты компонентов. |
| `npm run build` | Vite создаёт production-сборку в `dist/`. |
| `npm run preview` | Запускает локальный просмотр последней сборки. |

[GitHub Actions](.github/workflows/ci.yml) выполняет чистую установку, проверки и сборку для каждого pull request и проверяет наличие непустого `dist/index.html`. Публикация на сервер — отдельный этап.

## Работа с компонентами

[BaseButton](src/components/BaseButton.vue) по умолчанию имеет тип `button`; для отправки формы передайте `type="submit"`. Свойства `disabled` и `loading` блокируют действие. [BaseField](src/components/BaseField.vue) принимает `label`, `v-model` и текст `error`. Состояние формы остаётся у вызывающего компонента.

Общие цвета, размеры и параметры движения находятся в [теме](src/assets/styles/_tokens.scss). Состав секций, ссылки на оба макета Figma и критерии приёмки приведены в [требованиях к лендингу](docs/landing-requirements.md).
