<script setup>
import { ref } from 'vue'

const key = 'chanly:cookie-notice-dismissed'
function previouslyDismissed() {
  try {
    return globalThis.localStorage.getItem(key) === '1'
  } catch {
    return false
  }
}
const visible = ref(!previouslyDismissed())
function dismiss() {
  visible.value = false
  try {
    globalThis.localStorage.setItem(key, '1')
  } catch {
    // При недоступном хранилище выбор действует на открытой странице.
  }
}
</script>
<template>
  <aside v-if="visible" class="cookie-notice" aria-label="Cookie и хранение данных">
    <span>Мы сохраняем в браузере ваш выбор о закрытии этого сообщения.</span>
    <button type="button" aria-label="Закрыть сообщение о хранении данных" @click="dismiss">×</button>
  </aside>
</template>
<style scoped lang="scss">
.cookie-notice {
  display: flex;
  align-items: center;
  gap: var(--gap);
  padding: 4px 4px 4px 16px;
  border-radius: 12px;
  border: 1px solid var(--rule);
  background: var(--paper);
  color: var(--ink);
  pointer-events: auto;
}
</style>
