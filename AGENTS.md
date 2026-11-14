# Лендинг Chanly

Это отдельный репозиторий публичного сайта продукта Chanly. Основное приложение находится в `D:\work\maxim-frontend`. Здесь размещён адаптивный лендинг на Vue 3.

| Путь | Что здесь искать |
| --- | --- |
| [README.md](README.md) | Установка, запуск, тесты и сборка |
| [deploy/release.py](deploy/release.py), [deploy/tests/](deploy/tests/) | Команда SSH для выпуска и отката, проверки на Linux |
| [deploy/contact/](deploy/contact/), [src/api/contact.js](src/api/contact.js), [docs/contact-delivery.md](docs/contact-delivery.md) | SMTP-обработчик заявок на info@chanly.ru, клиент формы и настройка REG.RU |
| [src/main.js](src/main.js), [src/App.vue](src/App.vue) | Подключение Router, Pinia, темы и общего каркаса |
| [src/router/index.js](src/router/index.js), [src/views/](src/views/) | Маршруты и страницы |
| [src/components/](src/components/), [src/assets/styles/](src/assets/styles/) | Общие компоненты и SCSS-тема |
| [BaseHeading](src/components/BaseHeading.vue), [docs/frontend-conventions.md](docs/frontend-conventions.md) | API дизайн-компонентов, BEM и организация SCSS |
| [eslint.config.js](eslint.config.js), [tsconfig.json](tsconfig.json), [tsconfig.node.json](tsconfig.node.json), [.husky/pre-commit](.husky/pre-commit) | Vue/TypeScript lint, проверка типов и проверки перед коммитом |
| [HomeView](src/views/HomeView.vue), [SiteLayout](src/layout/SiteLayout.vue) | Порядок секций, шапка, подвал и единый экземпляр Lenis |
| [src/composables/](src/composables/), [src/stores/landingMotion.js](src/stores/landingMotion.js) | Якоря, действие подключения, появление секций и память показа |
| [tests/motion/](tests/motion/), [tests/navigation/](tests/navigation/) | Проверки уменьшенного движения, повторного входа и якорей |
| [tests/components/](tests/components/), [.github/workflows/ci.yml](.github/workflows/ci.yml) | Тесты компонентов и проверки pull request |
| [.ai-factory/DESCRIPTION.md](.ai-factory/DESCRIPTION.md) | Стек и исходный макет Figma |
| [.ai-factory/ROADMAP.md](.ai-factory/ROADMAP.md) | Этапы разработки и выпуска |
| [docs/landing-requirements.md](docs/landing-requirements.md) | Требования к макету, интерактивности и приёмке |
| [.ai-factory/ARCHITECTURE.md](.ai-factory/ARCHITECTURE.md) | Структура Vue-приложения и порядок добавления страниц |
| [.ai-factory/rules/base.md](.ai-factory/rules/base.md) | Соглашения по компонентам и стилям |
| [.ai-factory/config.yaml](.ai-factory/config.yaml) | Язык проекта и работа с ветками |
| [.codex/config.toml](.codex/config.toml) | Настройки агентов и MCP |
| `.agents/skills/`, `.codex/skills/` | Установленные навыки AI Factory |

Выполняйте команды Git по отдельности, проверяя результат каждого шага. Обновляйте карту при появлении точек входа и команд сборки.
