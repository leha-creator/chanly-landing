<script setup>
import BaseHeading from './BaseHeading.vue'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useLandingMotion } from '../stores/landingMotion.js'
import { useSectionReveal } from '../composables/useSectionReveal.js'
import connectScreen from '../assets/images/demo-connect.png'
import connectRetina from '../assets/images/demo-connect-2x.png'
import channelsScreen from '../assets/images/demo-channels.png'
import channelsRetina from '../assets/images/demo-channels-2x.png'
import ordersScreen from '../assets/images/demo-orders.png'
import ordersRetina from '../assets/images/demo-orders-2x.png'
import paymentsScreen from '../assets/images/demo-payments.png'
import paymentsRetina from '../assets/images/demo-payments-2x.png'
useSectionReveal()
const steps = [
  {
    title: 'Подключите канал',
    description: 'Запустите бота, добавьте его администратором и выберите канал.',
    label: 'Подключение',
    image: connectScreen,
    retina: connectRetina,
    screen: 'Подключение канала',
  },
  {
    title: 'Задайте форматы и цены',
    description: 'Управляйте каналами и условиями размещения.',
    label: 'Форматы и цены',
    image: channelsScreen,
    retina: channelsRetina,
    screen: 'Мои каналы',
  },
  {
    title: 'Примите заказ',
    description: 'Изучите запрос, согласуйте публикацию и следите за статусом.',
    label: 'Размещение',
    image: ordersScreen,
    retina: ordersRetina,
    screen: 'Запросы и размещения',
  },
  {
    title: 'Получите выплату',
    description: 'После приёмки заказа проверьте выплату и документы.',
    label: 'Выплата',
    image: paymentsScreen,
    retina: paymentsRetina,
    screen: 'Выплаты',
  },
]

const active = ref(0)
const cycle = ref(0)
const duration = 20_000
const motion = useLandingMotion()
const preference = globalThis.matchMedia('(prefers-reduced-motion: reduce)')
const compactLayout = globalThis.matchMedia('(max-width: 64rem)')
const compact = ref(compactLayout.matches)
const reduced = ref(preference.matches)
const playing = computed(() => Boolean(motion.shown.how) && !reduced.value && !compact.value)
const current = computed(() => steps[active.value])
let timer

function select(index) {
  active.value = (index + steps.length) % steps.length
  restart()
}

function restart() {
  globalThis.clearTimeout(timer)
  cycle.value++
  if (playing.value) timer = globalThis.setTimeout(() => select(active.value + 1), duration)
}

function updatePreference() {
  compact.value = compactLayout.matches
  reduced.value = preference.matches
}

watch(playing, restart, { immediate: true })
onMounted(() => {
  preference.addEventListener('change', updatePreference)
  compactLayout.addEventListener('change', updatePreference)
})
onUnmounted(() => {
  compactLayout.removeEventListener('change', updatePreference)
  preference.removeEventListener('change', updatePreference)
  globalThis.clearTimeout(timer)
})
</script>
<template>
  <section
    id="how"
    ref="section"
    class="demo slice dark"
  >
    <div class="wrap">
      <BaseHeading
        class="demo__head"
        data-reveal
      >
        От подключения канала<br>до первой выплаты
      </BaseHeading>
      <div class="demo__body">
        <div class="demo__steps">
          <div class="demo__mobile-index">
            <button
              v-for="(step, i) in steps"
              :key="step.label"
              class="demo__button"
              type="button"
              :aria-label="step.title"
              :aria-current="active === i ? 'step' : undefined"
              @click="select(i)"
            >
              0{{ i + 1 }}
            </button>
          </div>
          <article
            v-for="({ title, description }, i) in steps"
            :key="title"
            class="demo__step"
            data-reveal
            :class="{ 'demo__step--selected': active === i }"
          >
            <BaseHeading
              :level="3"
              size="card"
              class="demo__step-head"
            >
              <button
                class="demo__button"
                type="button"
                :aria-current="active === i ? 'step' : undefined"
                @click="select(i)"
              >
                0{{ i + 1 }}<span class="demo__step-title">{{ title }}</span>
              </button>
            </BaseHeading>
            <p class="demo__copy">
              {{ description }}
            </p>
          </article>
        </div>
        <figure
          class="demo__figure"
          data-reveal
        >
          <img
            class="demo__image"
            :src="current.image"
            :srcset="current.image + ' 1280w, ' + current.retina + ' 2560w'"
            sizes="(max-width: 48rem) calc(100vw - 40px), (max-width: 64rem) calc(100vw - 128px), min(70vw, 972px)"
            :alt="'Кабинет Chanly — ' + current.screen"
            width="1280"
            height="900"
          >
          <figcaption class="demo__caption">
            {{ current.screen }} в Chanly · демонстрационные данные
          </figcaption>
        </figure>
      </div>
      <div
        data-reveal
        class="demo__progress"
        :style="{ '--period': duration + 'ms' }"
      >
        <button
          v-for="(step, i) in steps"
          :key="step.label"
          class="demo__button"
          type="button"
          :aria-current="active === i ? 'step' : undefined"
          @click="select(i)"
        >
          <span
            class="demo__bar"
            aria-hidden="true"
          ><i
            v-if="active === i"
            :key="cycle"
            class="demo__fill"
            :class="{ 'demo__fill--playing': playing }"
          /></span>
          0{{ i + 1 }}&ensp;{{ step.label }}
        </button>
      </div>
      <div
        class="demo__mobile-controls"
        data-reveal
      >
        <button
          class="demo__button"
          type="button"
          @click="select(active - 1)"
        >
          ← Назад
        </button>
        <button
          class="demo__button"
          type="button"
          @click="select(active + 1)"
        >
          Далее →
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '../assets/styles/tools' as styles;

.demo {
  &__head { color: var(--paper); }
  &__body {
    display: grid;
    grid-template-columns: minmax(0, 360fr) minmax(0, 912fr);
    gap: clamp(20px, 2.78vw, 40px);
    align-items: center;
    margin: 40px 0;
  }
  &__steps { display: grid; gap: 12px; }
  &__step {
    position: relative;
    padding: 20px;
    min-height: 117px;
    color: var(--white);

    &--selected {
      border-radius: 16px;
      background: var(--highlight);
      color: var(--ink);
      .demo__copy { color: #62665c; }
    }
  }
  &__step-head {
    font: 500 18px/1.5 var(--font-body);
    letter-spacing: normal;

    .demo__button::after { content: ''; position: absolute; inset: 0; }
  }
  &__step-title { margin-inline-start: .8em; }
  &__copy { margin: 8px 0 0; color: #b7bbaf; font: 400 14px/1.5 var(--font-body); }
  &__figure { margin: 0; padding: 16px; }
  &__image { display: block; width: 100%; height: auto; border-radius: 12px; }
  &__caption { margin-top: 12px; color: #b7bbaf; font-size: 12px; }
  &__progress {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
    color: #b7bbaf;
    font: 500 14px/1.5 var(--font-body);

    [aria-current] { color: var(--highlight); }
  }
  &__bar { display: block; overflow: hidden; margin-bottom: 12px; height: 4px; background: #494c43; border-radius: 2px; }
  &__fill {
    display: block;
    height: 100%;
    background: var(--highlight);
    transform-origin: left;

    &--playing { animation: fill var(--period) linear both; }
  }
  &__button {
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    padding: 0;
    text-align: inherit;
    cursor: pointer;

    &:focus-visible { outline: 3px solid var(--highlight); outline-offset: 3px; }
    @include styles.hover { &:hover { text-decoration: underline; text-underline-offset: .2em; } }
    &:active { opacity: .8; }
  }
  &__mobile-index, &__mobile-controls { display: none; }

  @media (max-width: 64rem) {
    &__head { line-height: 1.09; }
    &__body { grid-template-columns: 1fr; margin: 20px 0 16px; gap: 16px; }
    &__steps { gap: 16px; }
    &__mobile-index, &__mobile-controls {
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: 1fr;
      gap: 8px;

      .demo__button {
        text-align: center;
        padding: 11px 0;
        border: 0;
        border-radius: 12px;
        color: var(--white);
        background: #383b38;
        font: 500 16px/22px var(--font-body);
      }
    }
    &__mobile-index [aria-current] { background: var(--highlight); color: var(--ink); }
    &__mobile-controls .demo__button { font-size: 14px; }
    &__step { display: none; }
    &__step--selected {
      display: block;
      min-height: 0;
      padding: 0;
      background: transparent;
      color: var(--white);
      .demo__step-head { font-size: 22px; line-height: 1.4; }
      .demo__copy { margin-top: 16px; color: inherit; font-size: 16px; line-height: 1.4; }
    }
    &__figure { padding: 0; }
    &__image { border-radius: 5px; }
    &__caption, &__progress { display: none; }
  }
}

@keyframes fill { from { transform: scaleX(0); } to { transform: scaleX(1); } }
</style>
