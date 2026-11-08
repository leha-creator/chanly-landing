<script setup>
import { useSectionReveal } from '../composables/useSectionReveal.js'
import BaseButton from './BaseButton.vue'
import { connectChannel } from '../composables/useConnectChannel.js'

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
          <label
            >Тематика канала<select disabled>
              <option>Открытки / поздравления</option>
            </select></label
          ><label
            >Средние просмотры поста<input readonly value="10 000" /></label
          ><label
            >Размещений в месяц <strong>1 размещение</strong
            ><input type="range" min="1" max="12" value="1" disabled
          /></label>
          <div class="limits"><span>1</span><span>12</span></div>
          <small>Оценка до налогов. Число заказов может меняться.</small>
        </div>
        <div data-reveal class="result">
          <strong>3 ₽</strong>
          <p>за месяц при одном размещении</p>
          <small
            >Итог зависит от спроса рекламодателей и выполненных заказов.</small
          ><BaseButton class="lime" @click="connectChannel"
            >Подключить канал</BaseButton
          >
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped lang="scss">
#income {
  background: var(--white);
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
input,
select {
  font: inherit;
  padding: 10px;
  width: 100%;
  min-width: 0;
  border: 1px solid var(--rule);
  border-radius: 6px;
  background: white;
  color: var(--ink);
}
input[type='range'] {
  padding: 0;
  accent-color: var(--accent);
}
.limits {
  display: flex;
  justify-content: space-between;
}
.result {
  border-radius: 16px;
  padding: 32px;
  background: #15162c;
  color: white;
  align-content: center;
}
.result strong {
  font-size: clamp(60px, 7vw, 104px);
  line-height: 1;
}
.result button {
  margin-top: 24px;
  width: 100%;
  border-radius: 6px;
  background: var(--accent);
  color: white;
}
.result p {
  margin: 0;
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
@media (max-width:48rem){.inputs{gap:8px}.inputs h3{font-size:23px}.inputs label{font-size:13px;gap:5px}.inputs label strong{padding:13px;background:white;border-radius:6px;font-size:15px;font-weight:400}.inputs input[type='range'],.limits{display:none}.result{gap:6px}.result strong{font-size:44px}.result button{margin-top:6px}.calculator{gap:12px}.inputs input,.inputs select{font-size:15px;min-height:49px}}
</style>
