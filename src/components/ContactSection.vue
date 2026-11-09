<script setup>
import { useSectionReveal } from '../composables/useSectionReveal.js'
import BaseField from './BaseField.vue'
import BaseButton from './BaseButton.vue'

import { computed, nextTick, reactive, ref } from 'vue'

import { useNotifications } from '../stores/notifications.js'

const props = defineProps({ deliver: Function })
const notices = useNotifications()
const pending = ref(false)
const emptyFields = () => ({ name: '', email: '', question: '', consent: false })
const fields = reactive(emptyFields())
const attempted = ref(false)
const problems = computed(() => ({
  name: fields.name.trim() ? '' : 'Введите ваше имя.',
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim()) ? '' : 'Введите адрес электронной почты.',
  question: fields.question.trim() ? '' : 'Напишите ваш вопрос.',
  consent: fields.consent ? '' : 'Подтвердите согласие на обработку данных.',
}))
const errors = computed(() => attempted.value ? problems.value : {})
async function submit(event) {
  if (pending.value) return
  const form = event.currentTarget
  attempted.value = true
  const invalid = Object.keys(problems.value).find(key => problems.value[key])
  if (invalid) {
    await nextTick()
    form.elements.namedItem(invalid)?.focus()
    return
  }
  if (!props.deliver) {
    notices.notify('info', 'Поля заполнены верно. Отправка временно недоступна.')
    return
  }
  pending.value = true
  try {
    const result = await props.deliver({
      name: fields.name.trim(), email: fields.email.trim(),
      question: fields.question.trim(), consent: fields.consent,
    })
    if (result?.delivered !== true) {
      notices.notify('error', 'Доставка не подтверждена. Проверьте данные и попробуйте ещё раз.')
      return
    }
    notices.notify('success', 'Вопрос доставлен.')
    attempted.value = false
    Object.assign(fields, emptyFields())
  } catch {
    notices.notify('error', 'Не удалось отправить вопрос. Попробуйте ещё раз.')
  } finally {
    pending.value = false
  }
}

useSectionReveal()
</script>
<template>
  <section ref="section" id="contact" class="slice">
    <div class="wrap split">
      <div>
        <h2 data-reveal>На связи.</h2>
        <p data-reveal>
          Поможем подключить канал<br /> и разобраться с первым размещением.
        </p>
        <img
          src="../assets/images/support.svg"
          alt=""
          width="500"
          height="190"
        />
      </div>
      <form data-reveal novalidate @submit.prevent="submit">
        <BaseField :disabled="pending" v-model="fields.name" name="name" required label="Ваше имя" autocomplete="name"
          placeholder="Как к вам обращаться" :error="errors.name" />
        <BaseField :disabled="pending" v-model="fields.email" name="email" required type="email" label="Электронная почта"
          autocomplete="email" placeholder="you@example.ru" :error="errors.email" />
        <div>
          <label for="contact-question">Вопрос</label>
          <textarea id="contact-question" :disabled="pending" v-model="fields.question" required name="question" rows="4"
            placeholder="Расскажите, чем помочь" :aria-invalid="errors.question ? 'true' : undefined"
            :aria-describedby="errors.question ? 'contact-question-error' : undefined"></textarea>
          <span v-if="errors.question" id="contact-question-error" class="error">{{ errors.question }}</span>
        </div>
        <div>
          <label class="consent">
            <input :disabled="pending" v-model="fields.consent" required name="consent" type="checkbox"
              :aria-invalid="errors.consent ? 'true' : undefined"
              :aria-describedby="errors.consent ? 'contact-consent-error' : undefined" />
            Согласен на обработку персональных данных и ознакомлен с политикой конфиденциальности
          </label>
          <span v-if="errors.consent" id="contact-consent-error" class="error">{{ errors.consent }}</span>
        </div>
        <small v-if="!deliver">Отправка временно недоступна. Вы можете проверить заполнение формы.</small>
        <BaseButton class="lime" type="submit" :loading="pending">
          {{ pending ? "Отправляем…" : deliver ? "Отправить вопрос" : "Проверить поля" }}
        </BaseButton>
      </form>
    </div>
  </section>
</template>
<style scoped lang="scss">
#contact {
  --field-label: var(--on-accent);
  background: var(--accent);
  color: white;
}
h2 {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 400;
  font-size: clamp(48px, 6.25vw, 90px);
  letter-spacing: -.04em;
}
p {
  margin: 28px 0;
  color: var(--on-accent);
  font-size: clamp(17px, 1.46vw, 21px);
}
img {
  max-width: 100%;
  height: auto;
}
@media (min-width: 48.001rem) {
  .split { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6.1%; }
}
form {
  display: grid;
  gap: 20px;
}
label {
  color: var(--field-label);
  font-size: 13px;
}
textarea {
  display: block;
  width: 100%;
  margin-top: 8px;
  padding: 14px;
  border: 1px solid var(--rule);
  border-radius: var(--field-radius);
  background: var(--field-bg);
  font: inherit;
  font-size: 1rem;
  height: 110px;
  min-height: 110px;
  resize: vertical;
  &::placeholder { color: var(--placeholder); opacity: 1; }
}
.error { display: table; margin-top: 4px; background: var(--white); color: var(--error); padding-inline: 4px; font-size: 13px; }
textarea:focus { outline: none; border-color: var(--accent); box-shadow: inset 0 0 0 1px var(--accent); }
textarea[aria-invalid="true"]:focus { box-shadow: inset 0 0 0 1px var(--error); }
textarea[aria-invalid="true"] { border-color: var(--error); }
textarea { color: var(--ink); }
.consent {
  display: flex;
  align-items: start;
  gap: 8px;
}
.consent { cursor: pointer; min-height: 24px; font-size: 12px; gap: 12px; }
.consent input {
  appearance: none;
  display: grid;
  place-content: center;
  flex: 0 0 20px;
  width: 20px;
  height: 20px;
  margin: 0;
  border: 1px solid var(--rule);
  border-radius: 5px;
  background: white;
  color: var(--ink);
  cursor: inherit;
}
.consent input:checked { background: var(--highlight); border-color: var(--highlight); }
.consent input:checked::after {
  content: '';
  width: 6px;
  height: 11px;
  margin-top: -3px;
  border: solid currentColor;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
@media (hover: hover) and (pointer: fine) {
  .consent:hover input:enabled { border-color: var(--ink); }
}
.consent input[aria-invalid=true] { border: 2px solid var(--error); }
.consent input:disabled { opacity: .6; cursor: default; }
.consent input:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--focus); }
@media (forced-colors: active) {
  .consent input { appearance: auto; }
  .consent input:checked::after { content: none; }
}
form .button {
  width: 100%;
}
@media (max-width: 48rem) {
  img {
    display: none;
  }
}
@media (max-width: 48rem) {
  .split { gap: 20px; }
  form { gap: 8px; }
  h2 { font-size: 46px; line-height: 1.09; }
  p { font-size: 17px; line-height: 1.4; margin: 20px 0 0; }
  p br { display: none; }
  textarea { min-height: 92px; height: 92px; font-size: 15px; }
  .consent { font-size: 13px; line-height: 1.4; gap: 8px; }
  .button { --button-font: 15px; }
}
</style>
