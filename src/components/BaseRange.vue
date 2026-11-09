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
.range-field > span { background: white; padding: 14px; border-radius: 8px; font-size: 16px; }
input {
  appearance: none; width: 100%; height: 32px; margin: 0; cursor: grab; border-radius: 6px;
  background: linear-gradient(to right, var(--accent) var(--fill), #d3d3df var(--fill)) center / 100% 6px no-repeat;
}
@mixin thumb {
  appearance: none; width: 22px; height: 22px; border-radius: 50%;
  border: 3px solid white; background: var(--thumb, var(--accent)); box-shadow: 0 0 0 1px var(--thumb, var(--accent));
}
input::-webkit-slider-thumb { @include thumb; }
input::-moz-range-thumb { @include thumb; }
@media (hover: hover) and (pointer: fine) { input:hover { --thumb: var(--accent-hover); } }
input:active { cursor: grabbing; --thumb: var(--accent-pressed); }
small { display: flex; justify-content: space-between; }
</style>
