<script setup>
import BaseHeading from './BaseHeading.vue'
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
  <section
    id="income"
    ref="section"
    class="income slice"
  >
    <div class="wrap">
      <BaseHeading
        class="income__head"
        data-reveal
      >
        Сколько может приносить<br>ваш канал?
      </BaseHeading>
      <p
        class="income__copy"
        data-reveal
      >
        Выберите тематику и укажите средние просмотры поста.
      </p>
      <div class="income__body">
        <div
          data-reveal
          class="income__inputs"
        >
          <BaseHeading
            :level="3"
            size="card"
            class="income__input-head"
          >
            Ваш сценарий дохода
          </BaseHeading>
          <BaseSelect
            v-model="topic"
            label="Тематика канала"
            :options="topicOptions"
          />
          <BaseField
            v-model="views"
            label="Средние просмотры поста"
            inputmode="numeric"
            :error="estimate === null ? 'Введите целое число просмотров от нуля в допустимом диапазоне.' : ''"
          />
          <BaseRange
            v-model="placements"
            class="income__placements income__placements--desktop"
            label="Размещений в месяц"
            :text="placementCount(placements)"
            :min="1"
            :max="12"
          />
          <BaseSelect
            v-model="placements"
            class="income__placements income__placements--mobile"
            label="Размещений в месяц"
            :options="placementOptions"
          />
          <small class="income__disclaimer">Оценка до налогов. Число заказов может меняться.</small>
        </div>
        <div
          data-reveal
          class="income__result"
        >
          <div
            role="status"
            aria-atomic="true"
          >
            <strong class="income__amount">{{ estimate === null ? "—" : formatIncome(estimate) }}</strong>
            <p
              v-if="estimate !== null"
              class="income__period"
            >
              {{ period }}
            </p>
          </div>
          <small class="income__result-note">Итог зависит от спроса рекламодателей и выполненных заказов.</small>
          <BaseButton
            class="income__action"
            @click="connectChannel"
          >
            Подключить канал
          </BaseButton>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped lang="scss">
@use '../assets/styles/tools' as styles;

.income {
  --field-label: #5d687a;
  --field-height: 58px;
  --field-radius: 12px;
  padding-block: 64px;
  background: var(--paper);
  color: #182230;

  &__copy { margin: 40px 0; font-size: 18px; color: var(--field-label); }

  &__body {
    display: grid;
    grid-template-columns: minmax(0, 660fr) minmax(0, 524fr);
    gap: clamp(24px, 3.34vw, 48px);
    padding: 40px;
    border-radius: 28px;
    background: #f7f7fc;
    color: var(--ink);
  }

  &__inputs {
    display: grid;
    gap: 24px;
    color: #182230;

    :deep(label) { color: var(--field-label); font-weight: 500; }
  }

  &__disclaimer { font-size: 12px; color: var(--field-label); }
  &__input-head { font-size: 32px; }

  &__result {
    --focus-ring: var(--highlight);
    display: grid;
    gap: 20px;
    align-self: start;
    align-content: start;
    min-width: 0;
    position: relative;
    isolation: isolate;
    overflow: hidden;
    overflow-wrap: anywhere;
    border-radius: 24px;
    padding: 32px;
    background: var(--ink);
    color: var(--white);

    &::before {
      content: '';
      position: absolute;
      z-index: -1;
      inset: 0;
      background: url('../assets/images/income-mark-stripes.svg') right top / var(--mark-width, 23%) auto no-repeat;
      pointer-events: none;
    }
  }

  &__amount { display: block; max-width: 82%; font: 700 clamp(44px, 4.17vw, 60px)/1.12 var(--font-heading); letter-spacing: -.03em; }
  &__action { margin-top: 0; width: 100%; border-radius: 12px; }
  &__result-note { color: #c5c6d5; font-size: 13px; }
  &__period { color: #c5c6d5; margin: 20px 0 0; padding-bottom: 20px; border-bottom: 1px solid #626279; }
  &__placements--mobile { display: none; }

  @media (min-width: 48.001rem) {
    &__inputs { --field-bg: var(--white); }
  }

  @include styles.mobile {
    --field-height: 49px;
    --field-radius: 8px;
    padding-block: 40px;

    &__head { line-height: 1.09; }
    &__copy { margin: 20px 0; font-size: 16px; line-height: 1.4; }
    &__body { grid-template-columns: 1fr; padding: 16px; gap: 12px; margin-top: 20px; }
    &__result { --mark-width: 20%; border-radius: 12px; padding: 16px; gap: 8px; }
    &__inputs { gap: 10px; }
    &__disclaimer { font-size: 13px; }
    &__input-head { font-size: 23px; line-height: 1.4; }
    &__placements--desktop { display: none; }
    &__placements--mobile { display: grid; }
    &__result-note { font-size: 14px; line-height: 1.4; }
    &__period { font-size: 15px; line-height: 1.4; margin-top: 8px; padding: 0; border: 0; }
    &__amount { font-size: 44px; }
    &__action { --button-font: 15px; --button-height: 45px; border-radius: 28px; }
  }
}
</style>
