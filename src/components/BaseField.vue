<script setup>
import { computed, useAttrs, useId } from 'vue'

defineOptions({ inheritAttrs: false })
const props = defineProps({
  id: String,
  label: { type: String, required: true },
  error: { type: String, default: '' },
  disabled: Boolean,
})
const model = defineModel({ type: String, default: '' })
const generatedId = useId()
const inputId = computed(() => props.id || generatedId)
const attrs = useAttrs()
</script>

<template>
  <div class="field">
    <label :for="inputId">{{ label }}</label>
    <input
      v-bind="attrs"
      :id="inputId"
      v-model="model"
      :disabled="disabled"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="[attrs['aria-describedby'], error && inputId + '-error'].filter(Boolean).join(' ') || undefined"
    >
    <span v-if="error" :id="inputId + '-error'" class="field__error">{{ error }}</span>
  </div>
</template>

<style scoped lang="scss">
.field {
  display: grid;
  gap: var(--gap);
  font: 400 13px/1.5 var(--font-body);
  color: var(--field-label, inherit);

  input {
    width: 100%;
    min-width: 0;
    height: var(--field-height);
    border: 1px solid transparent;
    border-radius: var(--field-radius);
    padding: 0 calc(var(--field-inset) - 1px);
    background: var(--field-bg);
    color: var(--ink);
    font: 400 var(--field-font)/1.5 var(--font-body);
    transition: border-color var(--motion-fast) var(--ease);
    &::placeholder { color: var(--placeholder); opacity: 1; }
    @media (hover: hover) and (pointer: fine) {
      &:enabled:hover { border-color: var(--accent-hover); }
    }
    &:focus { border-color: var(--accent); }
    &[aria-invalid='true'] { border-color: var(--error); }
    &:disabled { opacity: .65; }
  }

  &__error {
    justify-self: start;
    color: var(--error);
    background: var(--white);
    padding-inline: 4px;
  }
}
</style>
