<script setup>
import { useNotifications } from '../stores/notifications.js'

const notifications = useNotifications()
</script>
<template>
  <div class="notifications" aria-label="Уведомления">
    <div v-for="message in notifications.messages" :key="message.id" class="notice" :class="message.type">
      <span :role="message.type === 'error' ? 'alert' : 'status'">{{ message.text }}</span>
      <button type="button" :aria-label="'Закрыть уведомление: ' + message.text" @click="notifications.dismiss(message.id)">×</button>
    </div>
  </div>
</template>
<style scoped lang="scss">
.notifications {
  display: flex;
  flex-direction: column-reverse;
  width: min(320px, 100%);
  max-height: 48dvh;
  gap: 5px;
  overflow: auto;
}
.notice {
  pointer-events: auto;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 3px 18px;
  min-height: 52px;
  border: 1px solid #595b52;
  border-radius: 12px;
  background: #1c1f1a;
  color: white;
}
.error { min-height: 80px; }
span { min-width: 0; overflow-wrap: anywhere; }
button {
  flex: 0 0 44px; height: 44px; padding: 0; border: 0; border-radius: 8px;
  color: inherit; background: transparent; font: 400 19px/1.4 var(--font-body); cursor: pointer;
}
button:focus-visible { outline-color: var(--highlight); outline-offset: -3px; }
@media (hover: hover) and (pointer: fine) { button:hover { background: #41443b; } }
button:active { background: #4d5046; }
@media (max-width: 48rem) {
  .notifications { width: min(304px, 100%); gap: 9px; }
  .notice { min-height: 49px; padding: 1px 4px 1px 12px; gap: 4px; font-size: 14px; }
}
</style>
