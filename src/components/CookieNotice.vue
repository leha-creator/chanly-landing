<script setup>
import { nextTick, ref } from 'vue'

const key = 'chanly:cookie-notice-dismissed'
function previouslyDismissed() {
  try {
    return globalThis.localStorage.getItem(key) === '1'
  } catch {
    return false
  }
}
const visible = ref(!previouslyDismissed())
const details = ref(false)
const detailsButton = ref(null)
async function toggleDetails() {
  details.value = !details.value
  await nextTick()
  detailsButton.value?.focus()
}
function accept() {
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
    <div aria-live="polite">
      <h2>{{ details ? 'Что сохраняется' : 'Файлы cookie' }}</h2>
      <p v-if="details">Выбор хранится в этом браузере. Если очистить данные сайта, уведомление появится снова.</p>
      <p v-else>Разрешить сайту запомнить ваш выбор в этом браузере? Если отклонить, сообщение закроется только до следующего посещения.</p>
    </div>
    <div class="actions">
      <button type="button" class="accept" @click="accept">Принять</button>
      <button type="button" @click="visible = false">Отклонить</button>
      <button ref="detailsButton" type="button" class="details" :aria-expanded="details" @click="toggleDetails">
        {{ details ? 'Назад' : 'Подробнее' }}
      </button>
    </div>
  </aside>
</template>
<style scoped lang="scss">
.cookie-notice {
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 18px;
  min-height: 184px;
  max-height: 55dvh;
  overflow: auto;
  padding: 24px;
  border-radius: 12px;
  background: #efede6;
  box-shadow: 0 4px 24px #20221f29, inset 0 0 0 1px var(--rule);
  color: var(--ink);
}
h2 { font-size: 20px; line-height: 26px; }
p { margin: 8px 0 0; color: #474941; font-size: 14px; line-height: 20px; }
.actions { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
button {
  min-height: 44px; padding: 0 20px; border-radius: 24px; border: 1px solid var(--rule);
  background: white; color: var(--ink); font: 500 14px/1.4 var(--font-body); cursor: pointer;
}
.accept { color: white; background: var(--ink); border-color: transparent; }
.details { margin-left: auto; }
@media (hover: hover) and (pointer: fine) {
  button:hover { background: #e3e2fc; }
  .accept:hover { background: var(--accent-hover); }
}
button:active { background: #d2d1f8; }
.accept:active { background: var(--accent-pressed); }
@media (max-width: 48rem) {
  .cookie-notice { padding: 18px; min-height: min(224px, 55dvh); }
  .actions { gap: 6px; }
  button { padding-inline: 13px; flex-grow: 1; }
}
</style>
