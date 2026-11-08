<script setup>
defineProps({
  type: { type: String, default: 'button' },
  disabled: Boolean,
  loading: Boolean,
})
</script>

<template>
  <button class="button" :type="type" :disabled="disabled || loading" :aria-busy="loading || undefined">
    <span v-if="loading" class="button__indicator" aria-hidden="true">…</span>
    <slot />
  </button>
</template>

<style scoped lang="scss">
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--gap);
  min-height: var(--button-height);
  width: var(--button-width);
  max-width: 100%;
  padding: 6px var(--button-inset);
  border: 0;
  border-radius: var(--button-radius);
  background: var(--ink);
  color: var(--white);
  font: 500 var(--button-font)/1.5 var(--font-body);
  cursor: pointer;
  transition: background-color var(--motion-fast) var(--ease);

  &:enabled:hover { background: var(--accent); }
  &:enabled:active { background: var(--focus); }
  &:focus-visible {
    outline: 3px solid var(--focus);
    outline-offset: 3px;
    box-shadow: 0 0 0 3px var(--white);
  }
  &:disabled { opacity: .65; cursor: default; }
  &[aria-busy='true'] { cursor: progress; }
}
</style>
