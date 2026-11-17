<script setup>
import {useSectionReveal} from '../composables/useSectionReveal.js'
import BaseButton from './BaseButton.vue'
import BaseHeading from './BaseHeading.vue'
import {connectChannel} from '../composables/useConnectChannel.js'
import { legalDocuments } from '../data/legal.js'

useSectionReveal()
</script>
<template>
  <footer
    id="footer"
    ref="section"
    class="footer slice dark"
  >
    <div class="wrap">
      <div class="footer__invitation">
        <BaseHeading
          class="footer__heading"
          data-reveal
        >
          Дайте каналу<br>новую возможность
        </BaseHeading>
        <BaseButton
          data-reveal
          class="footer__action"
          tone="highlight"
          @click="connectChannel"
        >
          Подключить канал
        </BaseButton>
      </div>
      <div
        class="footer__legal"
        data-reveal
      >
        <div class="footer__company">
          <p><strong>ИП Каргин Данил Михайлович</strong></p>
          <p>ИНН 730204905616<br>ОГРНИП 326730000073523</p>
          <p>
            Общие вопросы: <a href="mailto:info@chanly.ru">info@chanly.ru</a><br>
            Поддержка: <a href="mailto:support@chanly.ru">support@chanly.ru</a><br>
            Партнёрство: <a href="mailto:partners@chanly.ru">partners@chanly.ru</a>
          </p>
        </div>
        <nav aria-label="Документы Chanly">
          <ul class="footer__documents">
            <li
              v-for="document in legalDocuments"
              :key="document.id"
            >
              <a
                :href="document.href"
                target="_blank"
                rel="noopener"
              >{{ document.title }} <span class="footer__format">PDF ↗</span></a>
            </li>
          </ul>
        </nav>
      </div>
      <div
        class="footer__links"
        data-reveal
      >
        <a
          class="footer__link"
          href="#contact"
        >Задать вопрос ↗</a>
      </div>
    </div>
  </footer>
</template>
<style scoped lang="scss">
@use '../assets/styles/tools' as styles;

.footer {
  padding-bottom: 40px;

  &__invitation,
  &__links {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }

  &__heading { font-size: clamp(32px, 4.31vw, 62px); }
  &__action { width: min(320px, 100%); }

  &__links {
    border-top: 1px solid #66685f;
    padding-top: 40px;
    margin-top: 40px;
    font-size: 13px;
  }

  &__link { text-decoration: none; }

  &__legal { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; border-top: 1px solid #66685f; margin-top: 40px; padding-top: 32px; font-size: 14px; line-height: 1.6; }
  &__company p { margin: 0 0 16px; }
  &__company summary { cursor: pointer; text-decoration: underline; text-underline-offset: 3px; }
  &__company details p { margin-top: 12px; overflow-wrap: anywhere; }
  &__documents { list-style: none; padding: 0; margin: 0; display: grid; gap: 14px; }
  &__documents a { text-underline-offset: 4px; }
  &__format { white-space: nowrap; font-size: 11px; opacity: .75; }

  @include styles.mobile {
    &__legal { grid-template-columns: 1fr; gap: 28px; }
    &__invitation,
    &__links {
      align-items: flex-start;
      flex-direction: column;
      gap: 20px;
    }

    &__heading { font-size: 32px; line-height: 1.09; }

    &__action {
      --button-font: 15px;
      --button-height: 45px;
      width: 100%;
    }

    &__links {
      font-size: 14px;
      line-height: 1.4;
      margin-top: 20px;
      padding-top: 0;
      border: 0;
    }
  }
}
</style>
