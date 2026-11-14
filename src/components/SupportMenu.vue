<script setup>
import { onMounted, onUnmounted, ref, useId } from 'vue'

const props = defineProps({
  telegramUrl: { type: String, default: 'https://t.me/sup_chanly' },
  maxUrl: { type: String, default: '' },
})
const open = ref(false)
const root = ref(null)
const trigger = ref(null)
const menuId = useId()

function close(event) {
  if (event && root.value?.contains(event.target)) return
  open.value = false
}
function escape() {
  open.value = false
  trigger.value?.focus()
}
function leave(event) {
  if (!root.value?.contains(event.relatedTarget)) open.value = false
}
onMounted(() => globalThis.document.addEventListener('pointerdown', close))
onUnmounted(() => globalThis.document.removeEventListener('pointerdown', close))
</script>

<template>
  <div ref="root" class="support" @keydown.esc.stop.prevent="escape" @focusout="leave">
    <button ref="trigger" type="button" :aria-expanded="open" :aria-controls="menuId" @click="open = !open">
      Поддержка
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" :class="{ expanded: open }">
        <path d="m3 4.5 3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    <ul v-if="open" :id="menuId" class="support__links" aria-label="Служба поддержки">
      <li><a :href="props.telegramUrl" target="_blank" rel="noopener noreferrer" @click="close()">Telegram <span aria-hidden="true">↗</span></a></li>
      <li>
        <a v-if="props.maxUrl" :href="props.maxUrl" target="_blank" rel="noopener noreferrer" @click="close()">MAX <span aria-hidden="true">↗</span></a>
        <span v-else class="support__unavailable" aria-disabled="true">MAX</span>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.support { position: relative; }
button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 44px;
  padding: 0;
  border: 0;
  background: none;
  color: var(--ink);
  font: inherit;
  cursor: pointer;
}
svg { flex: none; transition: transform var(--motion-fast); }
.expanded { transform: rotate(180deg); }
.support__links {
  position: absolute;
  z-index: 1;
  top: calc(100% + 8px);
  right: 0;
  width: 200px;
  margin: 0;
  padding: 6px;
  border: 1px solid var(--rule);
  border-radius: 14px;
  background: var(--paper);
  box-shadow: 0 12px 32px #20221f1a;
  list-style: none;
  font-size: 14px;
}
.support__links a, .support__unavailable {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 44px;
  padding: 10px 14px;
  border-radius: 8px;
  text-decoration: none;
}
.support__unavailable { color: var(--placeholder); }
.support__links a:focus-visible { outline-offset: -3px; }
@media (hover: hover) and (pointer: fine) {
  button:hover { color: var(--accent); }
  .support__links a:hover { background: var(--highlight); }
}
@media (max-width: 48rem) {
  button { width: 100%; font-size: 13px; }
}
</style>
