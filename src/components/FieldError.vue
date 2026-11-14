<script setup>
defineProps({ id: String })
</script>

<template>
  <p :id="id" class="field-error">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" stroke-width="1.5" />
      <path d="M8 4.5v4M8 11h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    </svg>
    <span><slot /></span>
  </p>
</template>

<style scoped lang="scss">
.field-error {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 0;
  padding: 8px 10px;
  border-radius: 8px;
  background: var(--error-bg);
  color: var(--error);
  font: 400 13px/1.45 var(--font-body);
}
svg { flex: 0 0 16px; margin-top: 1px; }
span { min-width: 0; overflow-wrap: anywhere; }
</style>
