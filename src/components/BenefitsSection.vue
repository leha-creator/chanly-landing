<script setup>
import { useSectionReveal } from '../composables/useSectionReveal.js'
import request from '../assets/images/benefit-request.svg'
import price from '../assets/images/benefit-price.svg'
import schedule from '../assets/images/benefit-schedule.svg'

useSectionReveal()
const items = [
  [
    'Вас находят.\nВы выбираете.',
    'Канал в каталоге видят компании, которым интересна ваша аудитория. Вы решаете, какие предложения принять.',
    request,
    'Пример запроса на рекламу',
  ],
  [
    'Ваша цена.\nБез догадок.',
    'Устанавливайте стоимость и форматы размещения. Комиссия сервиса добавляется к цене для рекламодателя.',
    price,
    'Условия размещения и цена формата',
  ],
  [
    'Рутина уходит\nза кадр.',
    'Публикация, снятие поста, маркировка и статусы заказов — в одном процессе. Больше внимания остаётся контенту.',
    schedule,
    'Пример расписания публикации',
  ],
]
</script>
<template>
  <section ref="section" id="benefits" class="slice">
    <div class="wrap">
      <div class="intro">
        <h2 data-reveal>У канала есть голос.<br />Пусть будет и доход.</h2>
        <p data-reveal>
          Chanly соединяет авторов MAX-каналов и рекламодателей. Вы ведёте канал
          в своём стиле — сервис берёт на себя организацию размещений.
        </p>
      </div>
      <div class="cards">
      <article
        data-reveal
        v-for="([title, copy, image, alt], i) in items"
        :key="title"
      >
        <small>0{{ i + 1 }}</small>
        <div>
          <h3>{{ title }}</h3>
          <p>{{ copy }}</p>
        </div>
        <div class="poster">
          <img class="card" loading="lazy" :src="image" :alt="alt" />
        </div>
      </article>
      </div>
    </div>
  </section>
</template>
<style scoped lang="scss">
#benefits { padding-block: 56px 60px; }
.intro { display: grid; grid-template-columns: 1.8fr 1fr; align-items: start; gap: 5.5%; margin-bottom: 36px; }
h2 { font-size: clamp(34px, 4.03vw, 58px); }
.intro p { margin: 0; font-size: 18px; color: #606458; }
.cards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 23px; }
article {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 458px;
  padding: 22px 24px 20px;
  border-radius: 18px;
  background: #29292e;
  color: white;
}
article::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: var(--pattern) right top / var(--mark-width, 21.3%) auto no-repeat;
}
article:nth-child(1) { --mark-width: 22.3%; --pattern: url('../assets/images/benefit-mark-sparks.svg'); }
article:nth-child(2) { --pattern: url('../assets/images/benefit-mark-star.svg'); }
article:nth-child(3) { --pattern: url('../assets/images/benefit-mark-folds.svg'); }
small { font-size: 11px; color: #cac3ff; font-weight: 500; letter-spacing: .09em; }
h3 { color: #f9f8f1; position: relative; margin-top: 14px; font-size: clamp(26px, 2.36vw, 34px); white-space: pre-line; }
article p { color: #d3d2d1; margin: 14px 0 32px; font-size: 17px; line-height: 1.36; }
.poster { margin: auto -5px 0; }
.card { width: 100%; display: block; }
@media (max-width: 48rem) {
  #benefits { padding-block: 44px; }
  .intro, .cards { grid-template-columns: 1fr; gap: 16px; }
  .intro { margin-bottom: 26px; }
  .intro p { font-size: 16px; line-height: 22px; }
  h2 { line-height: 37px; }
  .cards { gap: 14px; }
  article { min-height: 404px; padding: 18px 18px 16px; }
  article::before { background-size: 19.2% auto; }
  h3 { font-size: 28px; line-height: 32px; }
  article p { font-size: 16px; line-height: 22px; margin: 10px 0 20px; }
}
</style>
