<script setup>
import { useSectionReveal } from '../composables/useSectionReveal.js'
import BaseField from './BaseField.vue'
import BaseButton from './BaseButton.vue'

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
      <form data-reveal @submit.prevent>
        <BaseField
          label="Ваше имя"
          autocomplete="name"
          placeholder="Как к вам обращаться"
        /><BaseField
          type="email"
          label="Электронная почта"
          autocomplete="email"
          placeholder="you@example.ru"
        /><label
          >Вопрос<textarea
            placeholder="Расскажите, чем помочь"
            rows="4"
          ></textarea></label
        ><label class="consent"
          ><input type="checkbox" /> Согласен на обработку персональных данных и
          ознакомлен с политикой конфиденциальности</label
        ><BaseButton class="lime" disabled type="submit"
          >Отправить вопрос</BaseButton
        >
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
  border: 0;
  border-radius: var(--field-radius);
  background: var(--field-bg);
  font: inherit;
  font-size: 1rem;
  resize: vertical;
}
.consent {
  display: flex;
  align-items: start;
  gap: 8px;
}
button {
  width: 100%;
}
@media (max-width: 48rem) {
  img {
    display: none;
  }
}
@media (max-width:48rem){.split{gap:16px} form{gap:8px} .consent{line-height:1.38} h2{font-size:46px} p{font-size:17px;line-height:1.4;margin:12px 0 0} p br{display:none} textarea{height:92px} form :deep(.field){gap:4px}}
</style>
