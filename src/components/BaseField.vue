<script setup>
import { computed, useAttrs, useId } from 'vue'
import FieldError from './FieldError.vue'

defineOptions({ inheritAttrs: false })
const props = defineProps({
  id: { type: String, default: undefined },
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
    <label
      class="field__label"
      :for="inputId"
    >{{ label }}</label>
    <input
      v-bind="attrs"
      :id="inputId"
      v-model="model"
      class="field__input"
      :disabled="disabled"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="[attrs['aria-describedby'], error && inputId + '-error'].filter(Boolean).join(' ') || undefined"
    >
    <FieldError
      v-if="error"
      :id="inputId + '-error'"
    >
      {{ error }}
    </FieldError>
  </div>
</template>

<style scoped lang="scss">
@use '../assets/styles/controls';
@use '../assets/styles/tools' as styles;

.field {
  @include controls.field-layout;

  font: 400 13px/1.5 var(--font-body);
  color: var(--field-label, inherit);

  &__input {
    @include controls.field-surface(var(--field-bg));

    height: var(--field-height);
    padding: 0 calc(var(--field-inset) - 1px);
    transition: border-color var(--motion-fast) var(--ease);

    &::placeholder {
      color: var(--placeholder);
      opacity: 1;
    }

    @include styles.hover {
      &:enabled:hover {
        border-color: var(--accent-hover);
      }
    }

    &:focus {
      @include controls.control-focus;
    }

    &[aria-invalid='true'] {
      border-color: var(--error);
      background: var(--error-bg);

      &:focus {
        box-shadow: inset 0 0 0 1px var(--error);
      }
    }

    &:disabled {
      opacity: .65;
    }
  }
}
</style>
