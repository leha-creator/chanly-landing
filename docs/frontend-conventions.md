[К README](../README.md)

# Стили и общие компоненты

## SCSS

Стили компонента находятся в `<style scoped lang="scss">`. Общая точка входа —
`src/assets/styles/main.scss`, подключённая один раз в `src/main.js`.

| Модуль | Содержимое |
| --- | --- |
| `_tokens.scss` | CSS-переменные цветов, шрифтов, размеров и движения, адаптивные значения |
| `_base.scss` | Reset, базовые правила документа, общие focus и link состояния |
| `_layout.scss` | Небольшой набор существующих помощников: `slice`, `wrap`, `split`, `dark` |
| `_motion.scss` | Появление элементов по `data-reveal` с учётом reduced motion |
| `_tools.scss` | SCSS-переменные ширины и миксины `mobile`, `hover`, `motion`, `reduced-motion`, `container` |
| `_controls.scss` | Повторяющиеся раскладка, поверхность и фокус полей формы |

Подключайте нужный модуль явно через `@use`. `tools` и `controls` сами не выводят CSS,
поэтому их импорт в SFC не дублирует глобальную тему. CSS-переменные остаются для
наследуемых значений и состояний; SCSS-переменные и миксины — для правил при сборке.
Отдельная функция нужна, когда появляется повторяющееся вычисление.

Структура классов — BEM: корень компонента, его элементы и модификаторы.
`content`, `head`, `body`, `actions` описывают назначение части; более конкретное имя
вроде `image`, `question`, `result` помогает, когда общее название неоднозначно.

```vue
<template>
  <section class="feature">
    <div class="feature__content">
      <BaseHeading class="feature__head">Новая возможность</BaseHeading>
      <div class="feature__body"><slot /></div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '../assets/styles/tools' as styles;

.feature {
  &__content { @include styles.container; }
  &__body { display: grid; gap: 24px; }
  &--compact { padding-block: 20px; }

  @include styles.mobile {
    &__body { gap: 16px; }
  }
}
</style>
```

Держите вложенность неглубокой: блок → элемент → состояние. `&__body` компилируется
в один класс `.feature__body`, без роста специфичности по всей цепочке DOM.
Элемент остаётся частью исходного блока и при вложении в другой элемент:
`feature__action`, а не `feature__body__action`. Стили раскладки дочернего компонента
задавайте классом на его корне; `:deep()` нужен только для намеренного доступа внутрь,
например к `<em>` в slot заголовка.

## Заголовки

`BaseHeading` выводит настоящий `h1`–`h6`. `level` определяет семантику, `size` —
размер; они независимы. По умолчанию это `level=2`, `size="section"`.

```vue
<BaseHeading :level="1" size="hero">
  Зарабатывайте <em>в MAX</em>
</BaseHeading>
<BaseHeading :level="2" italic>Как всё устроено?</BaseHeading>
<BaseHeading :level="3" size="card">Ваш сценарий дохода</BaseHeading>
```

Размеры `hero`, `section`, `card` адаптивны. `italic` задаёт Lora всему заголовку,
а `<em>` — отдельному фрагменту с акцентным цветом. `id`, `class`, ARIA-атрибуты
и `data-reveal` передаются на сам заголовок, что сохраняет якоря, фокус и анимации.
Индивидуальные размеры из макета переопределяются локальным BEM-классом.

## Кнопки и поля

```vue
<BaseButton tone="highlight" @click="connectChannel">Подключить канал</BaseButton>
<BaseButton type="submit" :loading="pending">Отправить вопрос</BaseButton>
<BaseField v-model="email" label="Электронная почта" :error="errors.email" />
```

У кнопки `tone="accent"` по умолчанию. `disabled` и `loading` блокируют повторное
действие; в состоянии загрузки доступен `aria-busy`. Состоянием формы управляет
родитель. BaseSelect принимает массив `{ value, label }`, BaseRange — числовой
`v-model`, пределы и текстовое представление текущего значения.

## TypeScript и проверки

Для нового типизированного SFC используйте `<script setup lang="ts">` и
`defineProps<{ ... }>()`. Рабочий пример — `BaseHeading.vue`.

`tsconfig.json` расширяет официальный `@vue/tsconfig/tsconfig.dom.json` и проверяет
TS/TSX и типизированные SFC. `allowJs: true`, `checkJs: false` позволяют постепенно
переносить существующий JavaScript. Это не полная проверка типов старого JS-кода.
`tsconfig.node.json` выделяет Vite, Vitest и ESLint configs с Node-окружением.
При переводе конфигурации на TS отдельная настройка не нужна.

`npm run lint` применяет ESLint recommended, Vue recommended и TypeScript recommended;
предупреждения блокируют проверку. `npm run typecheck` проверяет оба tsconfig.
`npm run build` сначала проверяет типы, поэтому существующий CI также включает эту проверку.

Husky устанавливается через `prepare` при `npm ci` / `npm install`. `pre-commit`
запускает `lint` → `typecheck` для **всего рабочего дерева**. Проверки не исправляют
файлы и не меняют индекс; ошибки даже в неподготовленных файлах останавливают коммит.
Для исправления запустите `npm run lint:fix` и проверьте изменения перед добавлением.

В `package.json` закреплён `minimatch@11.0.1` только для
`@typescript-eslint/typescript-estree`: это устраняет
[GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249)
до обновления зависимости самим TypeScript ESLint. Совместимость API и glob-обработка
проверены на Node.js 24. Остальные ветви зависимостей override не затрагивает.

## См. также

- [Команды разработки](../README.md#проверки-и-сборка)
- [Требования к лендингу](landing-requirements.md)
- [Sass: @use](https://sass-lang.com/documentation/at-rules/use/), [Vue: Scoped CSS](https://vuejs.org/api/sfc-css-features)
