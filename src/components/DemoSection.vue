<script setup>
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
    description: 'Добавьте бота и подтвердите канал одноразовым кодом.',
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
  <section ref="section" id="how" class="slice dark">
    <div class="wrap">
      <h2 data-reveal>От подключения канала<br />до первой выплаты</h2>
      <div class="demo">
        <div class="steps">
          <div class="mobile-index">
            <button v-for="(step, i) in steps" :key="step.label" type="button"
              :aria-label="step.title" :aria-current="active === i ? 'step' : undefined" @click="select(i)">0{{ i + 1 }}</button>
          </div>
          <article data-reveal v-for="({ title, description }, i) in steps" :key="title" :class="{ selected: active === i }">
            <h3><button type="button" :aria-current="active === i ? 'step' : undefined" @click="select(i)">0{{ i + 1 }}<span>{{ title }}</span></button></h3>
            <p>{{ description }}</p>
          </article>
        </div>
        <figure data-reveal>
          <img :src="current.image" :srcset="current.image + ' 1280w, ' + current.retina + ' 2560w'"
            sizes="(max-width: 48rem) calc(100vw - 40px), (max-width: 64rem) calc(100vw - 128px), min(70vw, 972px)" :alt="'Кабинет Chanly — ' + current.screen" width="1280" height="900" />
          <figcaption>{{ current.screen }} в Chanly · демонстрационные данные</figcaption>
        </figure>
      </div>
      <div data-reveal class="progress" :style="{ '--period': duration + 'ms' }">
        <button v-for="(step, i) in steps" :key="step.label" type="button" :aria-current="active === i ? 'step' : undefined" @click="select(i)">
          <span class="bar" aria-hidden="true"><i v-if="active === i" :key="cycle" :class="{ playing }"></i></span>
          0{{ i + 1 }}&ensp;{{ step.label }}
        </button>
      </div>
      <div class="mobile-controls" data-reveal>
        <button type="button" @click="select(active - 1)">← Назад</button>
        <button type="button" @click="select(active + 1)">Далее →</button>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
h2 {
  font-size: clamp(34px, 3.62vw, 52px);
  letter-spacing: -.03em;
  color: var(--paper);
}
.demo {
  display: grid;
  grid-template-columns: minmax(0, 360fr) minmax(0, 912fr);
  gap: clamp(20px, 2.78vw, 40px);
  align-items: center;
  margin: 40px 0;
}
.steps { display: grid; gap: 12px; }
article {
  padding: 20px;
  min-height: 117px;
  color: var(--white);
}
h3 {
  font: 500 18px/1.5 var(--font-body);
  letter-spacing: normal;
  span { margin-inline-start: .8em; }
}
article p {
  margin: 8px 0 0;
  color: #b7bbaf;
  font: 400 14px/1.5 var(--font-body);
}
article.selected {
  border-radius: 16px;
  background: var(--highlight);
  color: var(--ink);
  p { color: #62665c; }
}
figure { margin: 0; padding: 16px; }
img { display: block; width: 100%; height: auto; border-radius: 12px; }
figcaption { margin-top: 12px; color: #b7bbaf; font-size: 12px; }
.progress {
  display: grid;
  grid-template-columns: repeat(4, minmax(0,1fr));
  gap: 16px;
  color: #b7bbaf;
  font: 500 14px/1.5 var(--font-body);
}
.bar {
  display: block;
  margin-bottom: 12px;
  height: 4px;
  background: #494c43;
  border-radius: 2px;
}
button { border: 0; background: transparent; color: inherit; font: inherit; padding: 0; text-align: inherit; cursor: pointer; }
button:focus-visible { outline: 3px solid var(--highlight); outline-offset: 3px; }
article { position: relative; }
h3 button::after { content: ''; position: absolute; inset: 0; }
.progress [aria-current] { color: var(--highlight); }
.bar { overflow: hidden; }
.bar i { display: block; height: 100%; background: var(--highlight); transform-origin: left; }
.bar i.playing { animation: fill var(--period) linear both; }
@media (hover: hover) and (pointer: fine) {
  button:hover { text-decoration: underline; text-underline-offset: .2em; }
}
button:active { opacity: .8; }
@keyframes fill { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.mobile-index, .mobile-controls { display: none; }

@media (max-width: 64rem) {
  h2 { line-height: 1.09; }
  .demo { grid-template-columns: 1fr; margin: 20px 0 16px; gap: 16px; }
  .steps { gap: 16px; }
  .mobile-index, .mobile-controls {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    gap: 8px;
  }
  .mobile-index button, .mobile-controls button {
    text-align: center;
    padding: 11px 0;
    border: 0;
    border-radius: 12px;
    color: white;
    background: #383b38;
    font: 500 16px/22px var(--font-body);
  }
  .mobile-index [aria-current] { background: var(--highlight); color: var(--ink); }
  .mobile-controls button { font-size: 14px; }
  article { display: none; }
  article.selected {
    display: block;
    min-height: 0;
    padding: 0;
    background: transparent;
    color: white;
    h3 { font-size: 22px; line-height: 1.4; }
    p { margin-top: 16px; color: inherit; font-size: 16px; line-height: 1.4; }
  }
  figure { padding: 0; }
  img { border-radius: 5px; }
  figcaption, .progress { display: none; }
}
</style>
