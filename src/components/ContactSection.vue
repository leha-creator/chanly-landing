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
  background: var(--accent);
  color: white;
}
h2 {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 400;
  font-size: clamp(48px, 7vw, 90px);
}
p {
  font-size: clamp(18px, 2vw, 24px);
}
img {
  max-width: 100%;
  height: auto;
}
form {
  display: grid;
  gap: 16px;
}
label {
  font-size: 13px;
}
textarea {
  display: block;
  width: 100%;
  margin-top: 8px;
  padding: 14px;
  border: 1px solid transparent;
  border-radius: var(--field-radius);
  background: var(--field-bg);
  font: inherit;
  font-size: 1rem;
  resize: vertical;
}
.error { display: table; margin-top: 4px; background: var(--white); color: var(--error); padding-inline: 4px; font-size: 13px; }
textarea:focus { border-color: var(--accent); }
textarea[aria-invalid="true"] { border-color: var(--error); }
textarea { color: var(--ink); }
.consent {
  display: flex;
  align-items: start;
  gap: 8px;
}
form .button {
  width: 100%;
}
@media (max-width: 48rem) {
  img {
    display: none;
  }
}
@media (max-width:48rem){.split{gap:16px} form{gap:8px} .consent{line-height:1.38} h2{font-size:46px} p{font-size:17px;line-height:1.4;margin:12px 0 0} p br{display:none} textarea{height:92px} form :deep(.field){gap:4px}}
</style>
