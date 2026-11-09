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
    '#e5e0f5',
  ],
  [
    'Ваша цена.\nБез догадок.',
    'Устанавливайте стоимость и форматы размещения. Комиссия сервиса добавляется к цене для рекламодателя.',
    price,
    'Условия размещения и цена формата',
    '#e8edcc',
  ],
  [
    'Рутина уходит\nза кадр.',
    'Публикация, снятие поста, маркировка и статусы заказов — в одном процессе. Больше внимания остаётся контенту.',
    schedule,
    'Пример расписания публикации',
    '#e0e8eb',
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
      <article
        data-reveal
        v-for="([title, copy, image, alt, color], i) in items"
        :key="title"
      >
        <small>0{{ i + 1 }}</small>
        <div>
          <h3>{{ title }}</h3>
          <p>{{ copy }}</p>
        </div>
        <div class="poster" :style="{ backgroundColor: color }">
          <img class="card" loading="lazy" :src="image" :alt="alt" />
        </div>
      </article>
    </div>
  </section>
</template>
<style scoped lang="scss">
.intro {
  display: grid;
  grid-template-columns: 1.8fr 1fr;
  gap: 6%;
  margin-bottom: 44px;
}
article {
  display: grid;
  grid-template-columns: 0.12fr 1.1fr 1.1fr;
  gap: 3%;
  align-items: center;
  border-top: 1px solid var(--rule);
  padding: 44px 0;
}
article:last-child {
  border-bottom: 1px solid var(--rule);
}
h3 {
  white-space: pre-line;
  font-size: clamp(30px, 3vw, 44px);
}
small {
  color: var(--accent);
}
.poster {
  position: relative;
  aspect-ratio: 572 / 270;
  border-radius: 3.85% / 8.15%;
  box-shadow: inset 5px 9px 18px 2px rgb(33 31 48 / 32%),
    inset -2px -3px 5px rgb(255 255 255 / 70%);
  container-type: inline-size;
}
.card {
  position: absolute;
  top: 8.89%;
  left: 10.66%;
  width: 78.68%;
  border-radius: 3.15cqw;
  box-shadow: 0 1.22cqw #dedee5, 0 1.55cqw 1cqw rgb(31 31 46 / 22%);
}
@media (hover: hover) and (prefers-reduced-motion: no-preference) {
  .card { transition: transform 240ms ease-out; }
  .poster:hover .card { transform: translateY(-8px) scale(1.025); }
}
p {
  max-width: 540px;
}
@media (max-width: 48rem) {
  .intro,
  article {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .intro {
    margin-bottom: 20px;
  }
  article {
    padding: 24px 0;
  }
}
@media (max-width:48rem){article {padding:12px 0;gap:9px} article p,.intro p{margin:6px 0;line-height:1.4} article h3{font-size:27px;line-height:1.4}}
</style>
