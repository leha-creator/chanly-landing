<script setup>
import BaseHeading from './BaseHeading.vue'
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
  <section
    id="terms"
    ref="section"
    class="slice terms"
  >
    <div class="wrap">
      <BaseHeading
        :level="2"
        size="section"
        class="terms__head"
        data-reveal
      >
        Понятные условия<br>Спокойная работа
      </BaseHeading>
      <div class="terms__body">
        <article
          v-for="([title, copy], i) in terms"
          :key="title"
          class="terms__card"
          data-reveal
        >
          <small class="terms__number">0{{ i + 1 }}</small>
          <BaseHeading
            :level="3"
            size="card"
            class="terms__card-title"
          >
            {{ title }}
          </BaseHeading>
          <p class="terms__copy">
            {{ copy }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>
<style scoped lang="scss">
@use '../assets/styles/tools' as styles;

.terms {
  padding-bottom: 70px;

  &__head { font-size: clamp(33px, 3.34vw, 48px); }
  &__number { font-size: 14px; font-weight: 500; color: var(--accent); }

  &__body {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 24px;
    margin-top: 20px;
    padding-bottom: 48px;
  }

  &__card {
    --pattern: url('../assets/images/pattern-sparks.svg');
    --mark-width: 80.32%;
    --number-color: var(--accent);
    --copy-color: #484b42;
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

    &::before {
      content: '';
      position: absolute;
      z-index: -1;
      inset: 0;
      background: var(--pattern) right top / var(--mark-width, 69.35%) auto no-repeat;
      pointer-events: none;
    }

    &:nth-child(2) {
      --mark-width: 84.84%;
      --pattern: url('../assets/images/pattern-star.svg');
      --number-color: #4a46bc;
      --copy-color: #464255;
      top: 18px;
      background: #dcd8f2;
      color: #272534;
    }

    &:nth-child(3) {
      --mark-width: 69.35%;
      --pattern: url('../assets/images/pattern-folds.svg');
      top: 38px;
      background: #e9e7df;
    }

    &:nth-child(4) {
      --mark-width: 69.35%;
      --pattern: url('../assets/images/pattern-stripes.svg');
      --number-color: var(--white);
      --copy-color: #f5f4ff;
      top: 0;
      background: var(--accent);
      color: var(--white);
    }
  }

  &__number { color: var(--number-color); }
  &__card-title { margin: 130px 0 24px; font-size: clamp(22px, 2.1vw, 30px); }
  &__copy { margin: auto 0 0; color: var(--copy-color); }

  @media (max-width: 64rem) {
    &__body { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }

  @include styles.mobile {
    padding-block: 42px 44px;

    &__head { font-size: 33px; line-height: 37px; }
    &__body { grid-template-columns: 1fr; gap: 12px; margin-top: 26px; padding: 0; }
    &__copy { line-height: 22px; }

    &__card {
      --mark-width: 43.82%;
      top: 0;
      min-height: 213px;
      padding: 18px 20px;

      &:nth-child(odd) { margin-right: 10px; }
      &:nth-child(even) { margin-left: 10px; }
      &:nth-child(1) { --pattern: url('../assets/images/pattern-sparks-mobile.svg'); }
      &:nth-child(2) { --mark-width: 39.71%; --pattern: url('../assets/images/pattern-star-mobile.svg'); }
      &:nth-child(3) { --mark-width: 43.82%; --pattern: url('../assets/images/pattern-folds-mobile.svg'); }
      &:nth-child(4) { --mark-width: 43.82%; --pattern: url('../assets/images/pattern-stripes-mobile.svg'); }
      &:nth-child(n) { top: 0; }
    }

    &__card-title { max-width: 266px; margin: 31px 0 12px; font-size: 26px; line-height: 30px; }
  }
}
</style>
