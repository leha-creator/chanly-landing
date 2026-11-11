<script setup>
import {useSectionReveal} from '../composables/useSectionReveal.js'
import BaseButton from './BaseButton.vue'
import {connectChannel} from '../composables/useConnectChannel.js'

useSectionReveal()
</script>
<template>
  <footer ref="section" id="footer" class="slice dark">
    <div class="wrap">
      <div class="invitation">
        <h2 data-reveal>Дайте каналу<br/>новую возможность</h2>
        <BaseButton data-reveal class="lime" @click="connectChannel"
        >Подключить канал</BaseButton
        >
      </div>
      <div data-reveal class="links">
        <span>© Chanly, 2026</span><span>Политика конфиденциальности</span
      ><span>Условия использования</span
      ><a href="#contact">Задать вопрос ↗</a>
      </div>
    </div>
  </footer>
</template>
<style scoped lang="scss">
.invitation,
.links {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.links {
  border-top: 1px solid #66685f;
  padding-top: 40px;
  margin-top: 40px;
  font-size: 13px;
}

h2 {
  font-size: clamp(32px, 4.31vw, 62px);
}

.links a {
  text-decoration: none;
}

footer {
  padding-bottom: 40px;
}

@media (max-width: 48rem) {
  .invitation,
  .links {
    align-items: flex-start;
    flex-direction: column;
  }
  .links {
    gap: 16px;
  }
}

.invitation .button {
  width: min(320px, 100%);
}

@media (max-width: 48rem) {
  h2 {
    font-size: 32px;
    line-height: 1.09;
  }
  .invitation, .links {
    gap: 20px;
  }
  .invitation .button {
    width: 100%;
    --button-font: 15px;
    --button-height: 45px;
  }
  .cta-arrow {
    display: none;
  }
  .links {
    font-size: 14px;
    line-height: 1.4;
    margin-top: 20px;
    padding-top: 0;
    border: 0;
  }
}
</style>
