<script setup>
import BaseHeading from './BaseHeading.vue'
import {useSectionReveal} from '../composables/useSectionReveal.js'
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
    'Устанавливайте стоимость и форматы размещения. Комиссия сервиса составляет 0%.',
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
  <section
    id="benefits"
    ref="section"
    class="slice benefits"
  >
    <div class="wrap">
      <div class="benefits__head">
        <BaseHeading
          :level="2"
          size="section"
          class="benefits__title"
          data-reveal
        >
          У канала есть голос<br>Пусть будет и <em>доход</em>
        </BaseHeading>
        <p
          class="benefits__intro"
          data-reveal
        >
          Chanly соединяет авторов MAX-каналов и рекламодателей. Вы ведёте канал
          в своём стиле — сервис берёт на себя организацию размещений.
        </p>
      </div>
      <div class="benefits__body">
        <article
          v-for="([title, copy, image, alt], i) in items"
          :key="title"
          class="benefits__card"
          data-reveal
        >
          <small class="benefits__number">0{{ i + 1 }}</small>
          <div>
            <BaseHeading
              :level="3"
              size="card"
              class="benefits__card-title"
            >
              {{ title }}
            </BaseHeading>
            <p class="benefits__copy">
              {{ copy }}
            </p>
          </div>
          <div class="benefits__poster">
            <img
              class="benefits__image"
              loading="lazy"
              :src="image"
              :alt="alt"
            >
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
<style scoped lang="scss">
@use '../assets/styles/tools' as styles;

.benefits {
  padding-block: 56px 60px;

  &__head {
    display: grid;
    grid-template-columns: 1.8fr 0.75fr;
    align-items: center;
    gap: 5.5%;
    margin-bottom: 36px;
  }

  &__title { font-size: clamp(34px, 4.03vw, 58px); }
  &__intro { margin: 0; font-size: 18px; color: #606458; }

  &__body {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 23px;
  }

  &__card {
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 458px;
    padding: 22px 24px 20px;
    border-radius: 18px;
    background: #29292e;
    color: var(--white);

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: var(--pattern) right top / var(--mark-width, 21.3%) auto no-repeat;
    }

    &:nth-child(1) { --mark-width: 22.3%; --pattern: url('../assets/images/benefit-mark-sparks.svg'); }
    &:nth-child(2) { --pattern: url('../assets/images/benefit-mark-star.svg'); }
    &:nth-child(3) { --pattern: url('../assets/images/benefit-mark-folds.svg'); }
  }

  &__number {
    font-size: 11px;
    color: #cac3ff;
    font-weight: 500;
    letter-spacing: .09em;
  }

  &__card-title {
    color: #f9f8f1;
    position: relative;
    margin-top: 14px;
    white-space: pre-line;
  }

  &__copy {
    color: #d3d2d1;
    margin: 14px 0 32px;
    font-size: 17px;
    line-height: 1.36;
  }

  &__poster { margin: auto -5px 0; }
  &__image { width: 100%; display: block; }

  @include styles.mobile {
    padding-block: 44px;

    &__head,
    &__body { grid-template-columns: 1fr; gap: 16px; }
    &__head { margin-bottom: 26px; }
    &__intro { font-size: 16px; line-height: 22px; }
    &__title { line-height: 37px; }
    &__body { gap: 14px; }
    &__card { min-height: 404px; padding: 18px 18px 16px; }
    &__card::before { background-size: 19.2% auto; }
    &__copy { font-size: 16px; line-height: 22px; margin: 10px 0 20px; }
  }

  @media (max-width: 1024px) {
    &__head { grid-template-columns: 1.8fr 1fr; }
  }

  @media (max-width: 567px) {
    &__head { grid-template-columns: 1fr; }
  }
}
</style>
