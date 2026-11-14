<script setup>
import { computed } from 'vue'
const props = defineProps({
  label: { type: String, required: true },
  text: { type: String, required: true },
  min: { type: Number, required: true },
  max: { type: Number, required: true },
})
const value = defineModel({ type: Number, required: true })
const fill = computed(() => (value.value - props.min) / (props.max - props.min) * 100 + '%')
</script>
<template>
  <label class="range-field">
    {{ label }}
    <span class="range-field__value">{{ text }}</span>
    <input
      v-model.number="value"
      class="range-field__input"
      type="range"
      :min="min"
      :max="max"
      step="1"
      :aria-label="label"
      :aria-valuetext="text"
      :style="{ '--fill': fill }"
    >
    <small
      class="range-field__limits"
      aria-hidden="true"
    >{{ min }} <span>{{ max }}</span></small>
  </label>
</template>
<style scoped lang="scss">
@use '../assets/styles/controls';
@use '../assets/styles/tools' as styles;

@mixin track {
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(to right, var(--accent) var(--fill), #d3d3df var(--fill));
}

@mixin thumb {
  appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 3px solid var(--thumb-border, var(--white));
  background: var(--thumb, var(--accent));
  box-shadow: 0 0 0 1px var(--thumb, var(--accent));
}

.range-field {
  @include controls.field-layout;

  &__value {
    display: flex;
    align-items: center;
    min-height: var(--field-height);
    padding: 0 16px;
    border: 1px solid var(--rule);
    border-radius: var(--field-radius);
    background: var(--white);
    color: #182230;
    font-size: 16px;
    font-weight: 400;
  }

  &__input {
    appearance: none;
    display: block;
    width: 100%;
    height: 32px;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: grab;

    &::-webkit-slider-runnable-track {
      @include track;
    }

    &::-moz-range-track {
      @include track;
    }

    &::-webkit-slider-thumb {
      @include thumb;

      margin-top: -8px;
    }

    &::-moz-range-thumb {
      @include thumb;
    }

    @include styles.hover {
      &:hover {
        --thumb: var(--accent-hover);
      }
    }

    &:active {
      cursor: grabbing;
      --thumb: var(--accent-pressed);
    }

    &:focus-visible {
      outline: none;
      --thumb-border: var(--focus);
      --thumb: var(--white);
    }
  }

  &__limits {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 400;
  }
}
</style>
