<script setup>
defineProps({ visible: Boolean })
</script>
<template>
  <a v-if="visible" class="back" href="#top" aria-label="Вернуться наверх">↑</a>
</template>
<style scoped lang="scss">
.back {
  pointer-events: auto;
  display: grid;
  place-items: center;
  background: #1f211a;
  border: 1px solid var(--paper);
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  text-decoration: none;
  font: 500 24px/1.5 var(--font-body);
}
@media (hover: hover) and (pointer: fine) {
  .back:hover { background: var(--accent-hover); }
}
.back:active { background: var(--accent-pressed); }
.back:focus-visible { outline-color: var(--accent); box-shadow: 0 0 0 3px white; }
</style>
