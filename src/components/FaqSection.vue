<script setup>
import {ref} from 'vue'
import {useSectionReveal} from '../composables/useSectionReveal.js'

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
      <h2 data-reveal>Как всё устроено?</h2>
      <div>
        <article v-for="([question, answer], index) in questions" :key="question" data-reveal>
          <h3>
            <button type="button" :aria-expanded="opened === index" :aria-controls="'faq-answer-' + index"
                    @click="opened = opened === index ? null : index">
              {{ question }}<span aria-hidden="true">{{ opened === index ? '−' : '+' }}</span>
            </button>
          </h3>
          <div :id="'faq-answer-' + index" class="answer" :inert="opened !== index || undefined"
               :class="{ open: opened === index }">
            <div><p>{{ answer }}</p></div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
<style scoped lang="scss">
@media (min-width: 48.001rem) {
  .split {
    grid-template-columns: 0.64fr 1fr;
  }
}

h2 {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 400;
  font-size: clamp(40px, 3.89vw, 56px);
  letter-spacing: -.04em;
}

article {
  padding: 0 0 2px;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--rule);
}

article:last-child {
  margin-bottom: 0;
}

h3 {
  font: 500 20px/1.5 var(--font-body);
  letter-spacing: normal;
}

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

@media (hover: hover) and (pointer: fine) {
  button:hover {
    color: var(--accent-hover);
  }
}

button:active {
  color: var(--accent-pressed);
}

button span {
  flex: 0 0 24px;
  height: 24px;
  font-size: 0;
  background: url('../assets/images/faq-plus.svg') center / contain no-repeat;
}

button[aria-expanded=true] span {
  background-image: url('../assets/images/faq-close.svg');
}

.answer p {
  color: #606458;
  margin: 2px 0 14px;
}

@media (max-width: 48rem) {
  h2 {
    font-size: 40px;
    line-height: 1.09;
  }
  h3 {
    font-size: 17px;
    line-height: 1.4;
  }
  .split {
    gap: 20px;
  }
  article {
    padding: 8px 0 10px;
    margin-bottom: 0;
  }
  .answer p {
    margin: 0 0 12px;
    font-size: 15px;
    line-height: 1.4;
  }
  button span, button[aria-expanded=true] span {
    background: none;
    font: 500 21px/24px var(--font-body);
  }
}

.answer {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--motion-fast) var(--ease);
}

.answer.open {
  grid-template-rows: 1fr;
}

.answer > div {
  overflow: hidden;
  min-height: 0;
}
</style>
