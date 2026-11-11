<script setup>
import {useSectionReveal} from '../composables/useSectionReveal.js'
import BaseSelect from './BaseSelect.vue'
import BaseRange from './BaseRange.vue'
import BaseButton from './BaseButton.vue'
import {connectChannel} from '../composables/useConnectChannel.js'

import {computed, ref} from 'vue'
import BaseField from './BaseField.vue'
import {incomeTopics} from '../data/incomeTopics.js'
import {estimateIncome, formatIncome} from '../utils/estimateIncome.js'

const topic = ref(incomeTopics[0])
const views = ref('10 000')
const placements = ref(6)
const estimate = computed(() => estimateIncome(views.value, placements.value, (topic.value.rate * 1000)))

function placementCount(count) {
  if (count === 1) return '1 размещение'
  return count + (count < 5 ? ' размещения' : ' размещений')
}

const topicOptions = incomeTopics.map(item => ({value: item, label: item.label}))
const placementOptions = Array.from({length: 12}, (_, index) => ({value: index + 1, label: placementCount(index + 1)}))
const period = computed(() => placements.value === 1
    ? 'за месяц при одном размещении'
    : 'за месяц при ' + placements.value + ' размещениях')

useSectionReveal()
</script>
<template>
  <section ref="section" id="income" class="slice">
    <div class="wrap">
      <h2 data-reveal>Сколько может приносить<br/>ваш канал?</h2>
      <p data-reveal>Выберите тематику и укажите средние просмотры поста.</p>
      <div class="calculator">
        <div data-reveal class="inputs">
          <h3>Ваш сценарий дохода</h3>
          <BaseSelect v-model="topic" label="Тематика канала" :options="topicOptions"/>
          <BaseField v-model="views" label="Средние просмотры поста" inputmode="numeric"
                     :error="estimate === null ? 'Введите целое число просмотров от нуля в допустимом диапазоне.' : ''"/>
          <BaseRange v-model="placements" class="placements-desktop" label="Размещений в месяц"
                     :text="placementCount(placements)" :min="1" :max="12"/>
          <BaseSelect v-model="placements" class="placements-mobile" label="Размещений в месяц"
                      :options="placementOptions"/>
          <small>Оценка до налогов. Число заказов может меняться.</small>
        </div>
        <div data-reveal class="result">
          <div role="status" aria-atomic="true">
            <strong>{{ estimate === null ? "—" : formatIncome(estimate) }}</strong>
            <p v-if="estimate !== null">{{ period }}</p>
          </div>
          <small
          >Итог зависит от спроса рекламодателей и выполненных заказов.</small
          >
          <BaseButton @click="connectChannel"
          >Подключить канал
          </BaseButton
          >
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped lang="scss">
#income {
  padding-block: 64px;
  background: var(--paper);
  color: #182230;
  --field-label: #5d687a;
  --field-height: 58px;
  --field-radius: 12px;
}

.wrap > p {
  margin: 40px 0;
  font-size: 18px;
  color: var(--field-label);
}

.calculator {
  margin-top: 0;
  background: #f7f7fc;
  color: var(--ink);
  padding: 40px;
  display: grid;
  grid-template-columns: minmax(0, 660fr) minmax(0, 524fr);
  gap: clamp(24px, 3.34vw, 48px);
  border-radius: 28px;
}

.inputs,
.result,
label {
  display: grid;
  gap: 10px;
}

.inputs {
  gap: 24px;
  color: #182230;

  > small {
    font-size: 12px;
    color: var(--field-label);
  }

  :deep(label) {
    color: var(--field-label);
    font-weight: 500;
  }
}

h3 {
  font-size: 32px;
}

.result {
  align-self: start;
  border-radius: 24px;
  padding: 32px;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background: var(--ink);

  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    inset: 0;
    background: url('../assets/images/income-mark-stripes.svg') right top / var(--mark-width, 23%) auto no-repeat;
    pointer-events: none;
  }

  --focus-ring: var(--highlight);
  color: white;
  align-content: start;
  gap: 20px;
}

.result strong {
  display: block;
  max-width: 82%;
  font: 700 clamp(44px, 4.17vw, 60px)/1.12 var(--font-heading);
  letter-spacing: -.03em;
}

.result button {
  margin-top: 0;
  width: 100%;
  border-radius: 12px;
}

.result small {
  color: #c5c6d5;
  font-size: 13px;
}

.result p {
  color: #c5c6d5;
  margin: 20px 0 0;
  padding-bottom: 20px;
  border-bottom: 1px solid #626279;
}

:deep(.field) {
  width: 100%;
}

@media (min-width: 48.001rem) {
  .inputs :deep(.field) {
    --field-bg: white;
  }
}

@media (max-width: 48rem) {
  .calculator {
    grid-template-columns: 1fr;
    padding: 16px;
    gap: 20px;
    margin-top: 20px;
  }
  #income {
    padding-block: 40px;
    --field-height: 49px;
    --field-radius: 8px;
  }
  h2 {
    line-height: 1.09;
  }
  .wrap > p {
    margin: 20px 0;
    font-size: 16px;
    line-height: 1.4;
  }
  .result {
    border-radius: 12px;
    padding: 16px;
    --mark-width: 20%;
  }
}

.placements-mobile {
  display: none;
}

.result {
  min-width: 0;
  overflow-wrap: anywhere;
}

@media (max-width: 48rem) {
  .placements-desktop {
    display: none;
  }
  .placements-mobile {
    display: grid;
  }
  .inputs {
    gap: 10px;
  }
  .inputs > small {
    font-size: 13px;
  }
  .inputs h3 {
    font-size: 23px;
    line-height: 1.4;
  }
  .result {
    gap: 8px;
  }
  .result small {
    font-size: 14px;
    line-height: 1.4;
  }
  .result p {
    font-size: 15px;
    line-height: 1.4;
    margin-top: 8px;
    padding: 0;
    border: 0;
  }
  .result strong {
    font-size: 44px;
  }
  .result button {
    border-radius: 28px;
    --button-font: 15px;
    --button-height: 45px;
  }
  .calculator {
    gap: 12px;
  }
}
</style>
