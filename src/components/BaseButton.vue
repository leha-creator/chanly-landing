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
  background: var(--button-fill, var(--accent));
  color: var(--white);
  font: 500 var(--button-font)/1.5 var(--font-body);
  cursor: pointer;
  transition: background-color var(--motion-fast) var(--ease);

  @media (hover: hover) and (pointer: fine) {
    &:enabled:hover { background: var(--accent-hover); }
  }
  &:enabled:active { background: var(--accent-pressed); }
  &:disabled { opacity: .65; cursor: default; }
  &[aria-busy='true'] { cursor: progress; }
  &.lime {
    background: var(--highlight);
    color: var(--ink);
    @media (hover: hover) and (pointer: fine) {
      &:enabled:hover { background: #d7e78b; }
    }
    &:enabled:active { background: #c4d775; }
  }
}
</style>
