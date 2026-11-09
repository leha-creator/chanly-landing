<script setup>
defineProps({ visible: Boolean })
</script>
<template>
  <a v-if="visible" class="back" href="#top" aria-label="Вернуться наверх">↑</a>
</template>
<style scoped lang="scss">
.back {
  position: fixed;
  z-index: var(--layer-sticky);
  left: var(--gutter);
  bottom: 20px;
  display: grid;
  place-items: center;
  background: var(--ink);
  border: 1px solid var(--paper);
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  text-decoration: none;
  font-size: 24px;
}
@media (hover: hover) and (pointer: fine) {
  .back:hover { background: var(--accent-hover); }
}
.back:active { background: var(--accent-pressed); }
.back:focus-visible { outline-color: var(--accent); box-shadow: 0 0 0 3px white; }
</style>
