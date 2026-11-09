<script setup>
import { useSectionReveal } from '../composables/useSectionReveal.js'
import BaseSelect from './BaseSelect.vue'
import BaseRange from './BaseRange.vue'
import BaseButton from './BaseButton.vue'
import { connectChannel } from '../composables/useConnectChannel.js'

import { computed, ref } from 'vue'
import BaseField from './BaseField.vue'
import { incomeTopics } from '../data/incomeTopics.js'
import { estimateIncome, formatIncome } from '../utils/estimateIncome.js'

const topic = ref(incomeTopics[0])
const views = ref('10 000')
const placements = ref(1)
const estimate = computed(() => estimateIncome(views.value, placements.value, topic.value.rate))
function placementCount(count) {
  if (count === 1) return '1 размещение'
  return count + (count < 5 ? ' размещения' : ' размещений')
}
const topicOptions = incomeTopics.map(item => ({ value: item, label: item.label }))
const placementOptions = Array.from({ length: 12 }, (_, index) => ({ value: index + 1, label: placementCount(index + 1) }))
const period = computed(() => placements.value === 1
  ? 'за месяц при одном размещении'
  : 'за месяц при ' + placements.value + ' размещениях')

useSectionReveal()
</script>
<template>
  <section ref="section" id="income" class="slice">
    <div class="wrap">
      <h2 data-reveal>Сколько может приносить<br />ваш канал?</h2>
      <p data-reveal>Выберите тематику и укажите средние просмотры поста.</p>
      <div class="calculator">
        <div data-reveal class="inputs">
          <h3>Ваш сценарий дохода</h3>
          <BaseSelect v-model="topic" label="Тематика канала" :options="topicOptions" />
          <BaseField v-model="views" label="Средние просмотры поста" inputmode="numeric"
            :error="estimate === null ? 'Введите целое число просмотров от нуля в допустимом диапазоне.' : ''" />
          <BaseRange v-model="placements" class="placements-desktop" label="Размещений в месяц"
            :text="placementCount(placements)" :min="1" :max="12" />
          <BaseSelect v-model="placements" class="placements-mobile" label="Размещений в месяц" :options="placementOptions" />
          <small>Оценка до налогов. Число заказов может меняться.</small>
        </div>
        <div data-reveal class="result">
          <div role="status" aria-atomic="true">
            <strong>{{ estimate === null ? "—" : formatIncome(estimate) }}</strong>
            <p v-if="estimate !== null">{{ period }}</p>
          </div>
          <small
            >Итог зависит от спроса рекламодателей и выполненных заказов.</small
          ><BaseButton @click="connectChannel"
            >Подключить канал</BaseButton
          >
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped lang="scss">
#income {
  background: var(--paper);
  color: var(--ink);
}
.calculator {
  margin-top: 36px;
  background: #f7f7fc;
  color: var(--ink);
  padding: 40px;
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  gap: 40px;
  border-radius: 24px;
}
.inputs,
.result,
label {
  display: grid;
  gap: 10px;
}
.inputs {
  gap: 16px;
}
h3 {
  font-size: 28px;
}
.result {
  align-self: start;
  border-radius: 16px;
  padding: 32px;
  background: var(--ink) url('../assets/images/pattern-stripes.svg') right 3px top / min(23%, 120px) auto no-repeat;
  --focus-ring: var(--highlight);
  color: white;
  align-content: center;
}
.result strong {
  display: block;
  max-width: 82%;
  font-size: clamp(44px, 4vw, 60px);
  line-height: 1;
}
.result button {
  margin-top: 24px;
  width: 100%;
  border-radius: 6px;

}
.result p {
  margin: 16px 0 0;
  padding-bottom: 16px;
  border-bottom: 1px solid #626279;
}
@media (min-width: 48.001rem) {
  .inputs :deep(.field) { max-width: 320px; --field-bg: white; }
}
@media (max-width: 48rem) {
  .calculator {
    grid-template-columns: 1fr;
    padding: 16px;
    gap: 20px;
    margin-top: 20px;
  }
  .result {
    padding: 20px;
  }
}
.placements-mobile { display: none; }
.result { min-width: 0; overflow-wrap: anywhere; }
@media (max-width: 48rem) {
  .placements-desktop { display: none; }
  .placements-mobile { display: grid; }
  .inputs { gap: 8px; }
  .inputs h3 { font-size: 23px; }
  .result { gap: 6px; }
  .result strong { font-size: 44px; }
  .result button { margin-top: 6px; }
  .calculator { gap: 12px; }
}
</style>
