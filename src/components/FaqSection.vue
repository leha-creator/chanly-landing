<script setup>
import { ref } from 'vue'
import { useSectionReveal } from '../composables/useSectionReveal.js'

useSectionReveal()
const opened = ref(0)
const questions = [
  ['Кто может подключить канал?', 'Самозанятые, ИП и юридические лица — владельцы MAX-каналов. Понадобятся данные владельца, реквизиты и подключение бота.'],
  ['Нужно ли публиковать пост вручную?', 'Публикация проходит по согласованному расписанию. За статусом заказа можно следить в кабинете.'],
  ['Можно ли отказаться от рекламы?', 'Да. Вы можете отказаться от предложенного заказа.'],
  ['Когда придёт выплата?', 'После приёмки заказа. Статус выплаты и документы появятся в кабинете.'],
  ['Можно ли добавить несколько каналов?', 'Каналы доступны в разделе «Мои каналы». Для подключения каждого канала потребуется подтверждение.'],
]
</script>
<template>
  <section ref="section" id="faq" class="slice">
    <div class="wrap split">
      <h2 data-reveal>Разберёмся.</h2>
      <div>
        <article v-for="([question, answer], index) in questions" :key="question" data-reveal>
          <h3>
            <button type="button" :aria-expanded="opened === index" :aria-controls="'faq-answer-' + index"
              @click="opened = opened === index ? null : index">
              {{ question }}<span aria-hidden="true">{{ opened === index ? '−' : '+' }}</span>
            </button>
          </h3>
          <div :id="'faq-answer-' + index" class="answer" :inert="opened !== index || undefined" :class="{ open: opened === index }">
            <div><p>{{ answer }}</p></div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
<style scoped lang="scss">
@media (min-width: 48.001rem) {
  .split { grid-template-columns: 0.64fr 1fr; }
}
h2 { font-family: var(--font-display); font-style: italic; font-weight: 400; }
article { padding: 8px 0; margin-bottom: 10px; border-bottom: 1px solid var(--rule); }
h3 { font-size: clamp(17px, 1.6vw, 24px); }
button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  width: 100%;
  min-height: 44px;
  padding: 6px 0;
  background: transparent;
  color: inherit;
  border: 0;
  text-align: left;
  font: inherit;
  cursor: pointer;
}
button span { color: var(--accent); }
.answer { display: grid; grid-template-rows: 0fr; transition: grid-template-rows var(--motion-fast) var(--ease); }
.answer.open { grid-template-rows: 1fr; }
.answer > div { overflow: hidden; min-height: 0; }
</style>
