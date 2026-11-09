<script setup>
import { useSectionReveal } from '../composables/useSectionReveal.js'
useSectionReveal()
const terms = [
  [
    'Вы выбираете рекламу',
    'Принимайте только те предложения, которые подходят вашему каналу.',
  ],
  [
    'Вы задаёте стоимость',
    'Комиссия сервиса добавляется к цене для рекламодателя.',
  ],
  [
    'Выплата после приёмки',
    'Следите за статусом выплаты и документами в кабинете.',
  ],
  [
    'Маркировка в процессе',
    'Сервис получает erid и добавляет маркировку к посту.',
  ],
]
</script>
<template>
  <section ref="section" id="terms" class="slice">
    <div class="wrap">
      <h2 data-reveal>Понятные условия.<br />Спокойная работа.</h2>
      <div class="grid">
        <article data-reveal v-for="([title, copy], i) in terms" :key="title">
          <small>0{{ i + 1 }}</small>
          <h3>{{ title }}</h3>
          <p>{{ copy }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
<style scoped lang="scss">
.grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px; margin-top: 20px; padding-bottom: 48px; }
article {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 412px;
  padding: 24px;
  border-radius: 18px;
  background: #e6e2d5;
  top: 48px;
  --pattern: url('../assets/images/pattern-sparks.svg');
}
article::before { content: ''; position: absolute; z-index: -1; top: -6%; right: -14%; width: 84%; aspect-ratio: 1; background: var(--pattern) center / contain no-repeat; pointer-events: none; }
article:nth-child(2) { top: 18px; background: #dcd8f2; --pattern: url('../assets/images/pattern-star.svg'); }
article:nth-child(3) { top: 38px; background: #e9e7df; --pattern: url('../assets/images/pattern-folds.svg'); }
article:nth-child(4) { top: 0; background: var(--accent); color: white; --pattern: url('../assets/images/pattern-stripes.svg'); }
h3 { margin: 130px 0 24px; font-size: clamp(22px, 2.1vw, 30px); }
p { margin: auto 0 0; }
@media (max-width: 64rem) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 48rem) {
  .grid { grid-template-columns: 1fr; gap: 12px; padding: 0; }
  .grid article { top: 0; min-height: 213px; padding: 18px 20px; }
  article::before { width: 56%; top: -20%; }
  h3 { margin: 28px 0 14px; font-size: 26px; }
}
</style>
