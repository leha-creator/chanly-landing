<script setup>
import BaseHeading from './BaseHeading.vue'
import {useSectionReveal} from '../composables/useSectionReveal.js'
import BaseField from './BaseField.vue'
import BaseButton from './BaseButton.vue'
import FieldError from './FieldError.vue'

import {computed, nextTick, reactive, ref} from 'vue'

import {useNotifications} from '../stores/notifications.js'

const props = defineProps({ deliver: { type: Function, default: undefined } })
const notices = useNotifications()
const pending = ref(false)
const deliveryError = ref('')
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
  deliveryError.value = ''
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
      deliveryError.value = 'Не удалось подтвердить отправку. Попробуйте ещё раз.'
      return
    }
    notices.notify('success', 'Вопрос доставлен.')
    attempted.value = false
    Object.assign(fields, emptyFields())
  } catch (error) {
    deliveryError.value = error?.code === 'rate_limited'
      ? 'Слишком много попыток отправки. Попробуйте позже или напишите нам на почту.'
      : 'Не удалось отправить вопрос. Попробуйте ещё раз.'
  } finally {
    pending.value = false
  }
}

useSectionReveal()
</script>
<template>
  <section
    id="contact"
    ref="section"
    class="contact slice"
  >
    <div class="contact__content wrap split">
      <div>
        <BaseHeading
          italic
          class="contact__head"
          data-reveal
        >
          Давайте начнём
        </BaseHeading>
        <p
          class="contact__copy"
          data-reveal
        >
          Поможем подключить канал<br> и разобраться с первым размещением.
        </p>
        <img
          class="contact__image"
          src="../assets/images/support.svg"
          alt=""
          width="500"
          height="190"
        >
      </div>
      <form
        class="contact__form"
        data-reveal
        novalidate
        @submit.prevent="submit"
      >
        <BaseField
          v-model="fields.name"
          :disabled="pending"
          name="name"
          required
          maxlength="100"
          label="Ваше имя"
          autocomplete="name"
          placeholder="Как к вам обращаться"
          :error="errors.name"
        />
        <BaseField
          v-model="fields.email"
          :disabled="pending"
          name="email"
          required
          maxlength="254"
          type="email"
          label="Электронная почта"
          autocomplete="email"
          placeholder="you@example.ru"
          :error="errors.email"
        />
        <div class="contact__question">
          <label
            class="contact__label"
            for="contact-question"
          >Вопрос</label>
          <textarea
            id="contact-question"
            v-model="fields.question"
            class="contact__textarea"
            :disabled="pending"
            required
            maxlength="5000"
            name="question"
            rows="4"
            placeholder="Расскажите, чем помочь"
            :aria-invalid="errors.question ? 'true' : undefined"
            :aria-describedby="errors.question ? 'contact-question-error' : undefined"
          />
          <FieldError
            v-if="errors.question"
            id="contact-question-error"
          >
            {{ errors.question }}
          </FieldError>
        </div>
        <div class="contact__consent-field">
          <label class="contact__consent">
            <input
              v-model="fields.consent"
              class="contact__checkbox"
              :disabled="pending"
              required
              name="consent"
              type="checkbox"
              :aria-invalid="errors.consent ? 'true' : undefined"
              :aria-describedby="errors.consent ? 'contact-consent-error' : undefined"
            >
            Согласен на обработку персональных данных и ознакомлен с политикой конфиденциальности
          </label>
          <FieldError
            v-if="errors.consent"
            id="contact-consent-error"
          >
            {{ errors.consent }}
          </FieldError>
        </div>
        <small v-if="!deliver">Отправка временно недоступна. Вы можете проверить заполнение формы.</small>
        <div
          v-if="deliveryError"
          class="contact__delivery-error"
          role="alert"
        >
          <strong class="contact__error-head">Вопрос пока не отправлен</strong>
          <p class="contact__error-copy">
            {{ deliveryError }} Введённые данные сохранены.
          </p>
          <a
            class="contact__error-link"
            href="mailto:info@chanly.ru"
          >Написать на info@chanly.ru ↗</a>
        </div>
        <BaseButton
          tone="highlight"
          class="contact__action"
          type="submit"
          :loading="pending"
        >
          {{ pending ? "Отправляем…" : deliver ? "Отправить вопрос" : "Проверить поля" }}
        </BaseButton>
      </form>
    </div>
  </section>
</template>
<style scoped lang="scss">
@use '../assets/styles/tools' as styles;
@use '../assets/styles/controls';

.contact {
  --focus-ring: var(--highlight);
  --link-hover: var(--highlight);
  --field-label: var(--on-accent);
  background: var(--accent);
  color: var(--white);

  &__head { font-size: clamp(48px, 6.25vw, 90px); }
  &__copy { margin: 28px 0; color: var(--on-accent); font-size: clamp(17px, 1.46vw, 21px); }
  &__image { max-width: 100%; height: auto; }
  &__form { display: grid; gap: 20px; }
  &__label { color: var(--field-label); font-size: 13px; }
  &__question, &__consent-field { display: grid; gap: 8px; }
  &__textarea {
    display: block;
    @include controls.field-surface(var(--field-bg));

    padding: 14px;
    height: 110px;
    min-height: 110px;
    resize: vertical;

    &::placeholder { color: var(--placeholder); opacity: 1; }
    &:focus { @include controls.control-focus; }
    &[aria-invalid=true] {
      border-color: var(--error);
      background: var(--error-bg);
      &:focus { box-shadow: inset 0 0 0 1px var(--error); }
    }
  }
  &__delivery-error {
    padding: 16px;
    border: 1px solid var(--error);
    border-radius: 12px;
    background: var(--error-bg);
    color: var(--error);
    font-size: 14px;
    line-height: 1.5;
  }
  &__error-head { display: block; font-size: 15px; }
  &__error-copy { margin: 6px 0 10px; color: inherit; font-size: inherit; }
  &__error-link {
    font-weight: 600;
    overflow-wrap: anywhere;
    &:focus-visible { outline-color: var(--error); }
  }
  &__consent {
    display: flex;
    align-items: start;
    gap: 12px;
    color: var(--field-label);
    cursor: pointer;
    min-height: 24px;
    font-size: 12px;

    @include styles.hover { &:hover .contact__checkbox:enabled { border-color: var(--ink); } }
  }
  &__checkbox {
    appearance: none;
    display: grid;
    place-content: center;
    flex: 0 0 20px;
    width: 20px;
    height: 20px;
    margin: 0;
    border: 1px solid var(--rule);
    border-radius: 5px;
    background: var(--white);
    color: var(--ink);
    cursor: inherit;

    &:checked {
      background: var(--highlight);
      border-color: var(--highlight);
      &::after {
        content: '';
        width: 6px;
        height: 11px;
        margin-top: -3px;
        border: solid currentColor;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
      }
    }
    &[aria-invalid=true] { border: 2px solid var(--error); }
    &:disabled { opacity: .6; cursor: default; }
    &:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--focus); }

    @media (forced-colors: active) {
      appearance: auto;
      &:checked::after { content: none; }
    }
  }
  &__action { width: 100%; }

  @media (min-width: 48.001rem) {
    &__content { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6.1%; }
  }

  @include styles.mobile {
    &__image { display: none; }
    &__content { gap: 20px; }
    &__form { gap: 8px; }
    &__head { font-size: 46px; line-height: 1.09; }
    &__copy {
      font-size: 17px;
      line-height: 1.4;
      margin: 20px 0 0;
      br { display: none; }
    }
    &__textarea { min-height: 92px; height: 92px; font-size: 15px; }
    &__consent { font-size: 13px; line-height: 1.4; gap: 8px; }
    &__action { --button-font: 15px; }
  }
}
</style>
