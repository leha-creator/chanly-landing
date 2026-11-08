<script setup>
import { useSectionReveal } from '../composables/useSectionReveal.js'
useSectionReveal()
import BaseButton from './BaseButton.vue'
import { connectChannel } from '../composables/useConnectChannel.js'
</script>
<template><footer ref="section" id="footer" class="slice dark"><div class="wrap">
  <div class="invitation"><h2 data-reveal>Дайте каналу<br>новую возможность.</h2><BaseButton data-reveal class="lime" @click="connectChannel">Подключить канал</BaseButton></div>
  <div data-reveal class="links"><span>© Chanly, 2026</span><span>Политика конфиденциальности</span><span>Условия использования</span><a href="#contact">Задать вопрос ↗</a></div>
</div></footer></template>
<style scoped lang="scss">
.invitation,.links{display:flex;align-items:center;justify-content:space-between;gap:24px}.links{border-top:1px solid #66685f;padding-top:32px;margin-top:40px;font-size:14px}footer{padding-bottom:40px}
@media(max-width:48rem){.invitation,.links{align-items:flex-start;flex-direction:column}.links{gap:16px}}
</style>
