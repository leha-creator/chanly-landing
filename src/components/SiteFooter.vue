<script setup>
import {useSectionReveal} from '../composables/useSectionReveal.js'
import BaseButton from './BaseButton.vue'
import BaseHeading from './BaseHeading.vue'
import {connectChannel} from '../composables/useConnectChannel.js'

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
        data-reveal
        class="footer__links"
      >
        <span>© Chanly, 2026</span><span>Политика конфиденциальности</span><span>Условия использования</span><a
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

  @include styles.mobile {
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
