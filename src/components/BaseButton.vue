<script setup>
defineProps({
  type: { type: String, default: 'button' },
  disabled: Boolean,
  loading: Boolean,
  tone: {
    type: String,
    default: 'accent',
    validator: value => ['accent', 'highlight'].includes(value),
  },
})
</script>

<template>
  <button
    class="button"
    :class="{ 'button--highlight': tone === 'highlight' }"
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
  >
    <span
      v-if="loading"
      class="button__indicator"
      aria-hidden="true"
    >…</span>
    <slot />
  </button>
</template>

<style scoped lang="scss">
@use '../assets/styles/tools' as styles;

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

  @include styles.hover {
    &:enabled:hover {
      background: var(--accent-hover);
    }
  }

  &:enabled:active {
    background: var(--accent-pressed);
  }

  &:disabled {
    opacity: .65;
    cursor: default;
  }

  &[aria-busy='true'] {
    cursor: progress;
  }

  &--highlight {
    background: var(--highlight);
    color: var(--ink);

    @include styles.hover {
      &:enabled:hover {
        background: #d7e78b;
      }
    }

    &:enabled:active {
      background: #c4d775;
    }
  }
}
</style>
