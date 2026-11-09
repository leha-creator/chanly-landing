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
#terms { padding-bottom: 70px; }
h2 { font-size: clamp(33px, 3.34vw, 48px); }
small { font-size: 14px; font-weight: 500; color: var(--accent); }
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
  --mark-width: 80.32%;
}
article::before { content: ''; position: absolute; z-index: -1; inset: 0; background: var(--pattern) right top / var(--mark-width, 69.35%) auto no-repeat; pointer-events: none; }
article:nth-child(2) { top: 18px; background: #dcd8f2; --mark-width: 84.84%; --pattern: url('../assets/images/pattern-star.svg'); }
article:nth-child(3), article:nth-child(4) { --mark-width: 69.35%; }
article:nth-child(3) { top: 38px; background: #e9e7df; --pattern: url('../assets/images/pattern-folds.svg'); }
article:nth-child(4) { top: 0; background: var(--accent); color: white; --pattern: url('../assets/images/pattern-stripes.svg'); }
h3 { margin: 130px 0 24px; font-size: clamp(22px, 2.1vw, 30px); }
p { margin: auto 0 0; color: #484b42; }
article:nth-child(2) { color: #272534; small { color: #4a46bc; } p { color: #464255; } }
article:nth-child(4) { small { color: white; } p { color: #f5f4ff; } }
@media (max-width: 64rem) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 48rem) {
  #terms { padding-block: 42px 44px; }
  h2 { font-size: 33px; line-height: 37px; }
  .grid { grid-template-columns: 1fr; gap: 12px; margin-top: 26px; padding: 0; }
  article:nth-child(odd) { margin-right: 10px; }
  article:nth-child(even) { margin-left: 10px; }
  p { line-height: 22px; }
  .grid article { top: 0; min-height: 213px; padding: 18px 20px; }
  .grid article { --mark-width: 43.82%; }
  article:nth-child(1) { --pattern: url('../assets/images/pattern-sparks-mobile.svg'); }
  .grid article:nth-child(2) { --mark-width: 39.71%; --pattern: url('../assets/images/pattern-star-mobile.svg'); }
  article:nth-child(3) { --pattern: url('../assets/images/pattern-folds-mobile.svg'); }
  article:nth-child(4) { --pattern: url('../assets/images/pattern-stripes-mobile.svg'); }
  h3 { max-width: 266px; margin: 31px 0 12px; font-size: 26px; line-height: 30px; }
}
</style>
