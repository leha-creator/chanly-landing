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
.notifications { display: grid; justify-items: end; gap: var(--gap); overflow-y: auto; }
.notice {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  width: min(100%, 320px);
  padding: 4px 4px 4px 16px;
  background: var(--ink);
  color: var(--white);
  border-radius: 12px;
}
.success { background: var(--highlight); color: var(--ink); }
.error { background: var(--error); }
span { flex: 1; overflow-wrap: anywhere; }
button { flex: none; }
</style>
