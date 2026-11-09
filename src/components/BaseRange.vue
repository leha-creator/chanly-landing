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
    <span>{{ text }}</span>
    <input v-model.number="value" type="range" :min="min" :max="max" step="1"
      :aria-label="label" :aria-valuetext="text" :style="{ '--fill': fill }">
    <small aria-hidden="true">{{ min }} <span>{{ max }}</span></small>
  </label>
</template>
<style scoped lang="scss">
.range-field { display: grid; gap: 8px; font-size: 13px; }
.range-field > span { background: white; border: 1px solid var(--rule); padding: 0 16px; min-height: var(--field-height); display: flex; align-items: center; border-radius: var(--field-radius); font-size: 16px; font-weight: 400; color: #182230; }
input {
  appearance: none; display: block; width: 100%; height: 32px; margin: 0; padding: 0; border: 0; background: transparent; cursor: grab;
}
@mixin track {
  height: 6px; border-radius: 3px;
  background: linear-gradient(to right, var(--accent) var(--fill), #d3d3df var(--fill));
}
@mixin thumb {
  appearance: none; width: 22px; height: 22px; border-radius: 50%;
  border: 3px solid var(--thumb-border, white); background: var(--thumb, var(--accent)); box-shadow: 0 0 0 1px var(--thumb, var(--accent));
}
input::-webkit-slider-runnable-track { @include track; }
input::-moz-range-track { @include track; }
input::-webkit-slider-thumb { @include thumb; margin-top: -8px; }
input::-moz-range-thumb { @include thumb; }
@media (hover: hover) and (pointer: fine) { input:hover { --thumb: var(--accent-hover); } }
input:active { cursor: grabbing; --thumb: var(--accent-pressed); }
input:focus-visible { outline: none; --thumb-border: var(--focus); --thumb: white; }
small { font-size: 12px; font-weight: 400; display: flex; justify-content: space-between; }
</style>
