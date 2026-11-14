# SCSS, общие элементы и проверки кода

## Scope

Реализовать запрос пользователя: компактные SCSS-модули и BEM-вложенность в Vue SFC,
декларативные общие заголовки и кнопки, Vue recommended ESLint, подготовка TypeScript,
Husky с проверками перед коммитом. Сохранить внешний вид, доступность и поведение.

## Settings

- Tests: существующий набор и проверки API новых общих компонентов.
- Logging: штатный вывод инструментов; рефакторинг стилей не добавляет runtime-логов.
- Docs: обновить README, карту AGENTS и инструкцию по стилям/компонентам.
- Commit strategy: single-commit (создание коммита не запрошено).
- Development methodology: implementation-first.
- TDD granularity: task-based.

## Roadmap Linkage

Не выбрано: текущие этапы дорожной карты уже завершены; это улучшение основы проекта.

## Tasks

- [x] Общие SCSS tools, отделение reset/layout/motion от темы, BEM для каркаса и уведомлений.
  Файлы: `src/assets/styles/`, `src/layout/SiteLayout.vue`, шапка, подвал, лента, поддержка.
  Runtime-логирование не требуется.
- [x] BaseHeading и интеграция в секции; BEM-вложенность локальных стилей.
  Файлы: `src/components/*Section.vue`, `BaseHeading.vue`, тесты BaseHeading.
  Зависимость: API SCSS tools. Сохранить motion hooks и семантику. Без новых логов.
- [x] Общие SCSS-приёмы полей и декларативный tone кнопки.
  Файлы: BaseButton/BaseField/BaseSelect/BaseRange/FieldError и `_controls.scss`.
  Без изменения взаимодействий и дополнительных логов.
- [x] Vue recommended ESLint, TypeScript/vue-tsc и Husky pre-commit.
  Файлы: package manifests, eslint/tsconfig/env, `.husky/`.
  Проверки всего рабочего дерева, без автоматического исправления/индексирования;
  ошибки отражаются стандартным выводом команд.
- [x] Проверить lint/typecheck/Vitest/production build, адаптивность и документацию.
  Файлы: README, AGENTS, `docs/frontend-conventions.md`, затронутые тестовые селекторы.
  Логи: результаты команд и фактические ограничения в ответе пользователю.
