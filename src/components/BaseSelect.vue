<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, toRaw, useId } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  options: { type: Array, required: true },
})
const value = defineModel({ type: [String, Number, Object], required: true })
const id = useId()
const root = ref(null)
const trigger = ref(null)
const open = ref(false)
const active = ref(0)
const selected = computed(() => props.options.findIndex(option => toRaw(option.value) === toRaw(value.value)))
let prefix = ''
let lastKey = 0

function move(index) {
  active.value = Math.max(0, Math.min(index, props.options.length - 1))
  nextTick(() => globalThis.document.getElementById(id + '-' + active.value)?.scrollIntoView?.({ block: 'nearest' }))
}
function toggle() {
  open.value = !open.value
  if (open.value) move(selected.value)
}
function choose(index) {
  value.value = props.options[index].value
  open.value = false
}
function keydown(event) {
  const { key } = event
  if (key === 'Tab' || key === 'Escape') {
    open.value = false
    return
  }
  if (key === 'Enter' || key === ' ') {
    event.preventDefault()
    if (open.value) choose(active.value)
    else toggle()
    return
  }
  if (event.ctrlKey || event.metaKey || event.altKey) return
  const start = open.value ? active.value : selected.value
  const targets = { ArrowDown: start + 1, ArrowUp: start - 1, Home: 0, End: props.options.length - 1 }
  let index = targets[key]
  if (index === undefined) {
    if (key.length !== 1) return
    const now = Date.now()
    prefix = (now - lastKey < 700 ? prefix : '') + key.toLocaleLowerCase()
    lastKey = now
    index = props.options.findIndex(option => option.label.toLocaleLowerCase().startsWith(prefix))
    if (index < 0) return
  }
  event.preventDefault()
  open.value = true
  move(index)
}
function outside(event) {
  if (!root.value?.contains(event.target)) open.value = false
}
onMounted(() => globalThis.document.addEventListener('pointerdown', outside))
onUnmounted(() => globalThis.document.removeEventListener('pointerdown', outside))
</script>
<template>
  <div
    ref="root"
    class="select-field"
  >
    <label
      :id="id + '-label'"
      class="select-field__label"
      :for="id"
      @click="trigger?.focus()"
    >{{ label }}</label>
    <div class="select-field__control">
      <select
        :id="id"
        v-model="value"
        class="select-field__native"
      >
        <option
          v-for="option in options"
          :key="option.label"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <button
        ref="trigger"
        class="select-field__trigger"
        type="button"
        role="combobox"
        :aria-labelledby="id + '-label'"
        :aria-expanded="open"
        :aria-controls="id + '-list'"
        :aria-activedescendant="open ? id + '-' + active : undefined"
        @click="toggle"
        @keydown="keydown"
        @blur="open = false"
      >
        {{ options[selected]?.label }}
      </button>
      <ul
        v-show="open"
        :id="id + '-list'"
        class="select-field__list"
        role="listbox"
        :aria-labelledby="id + '-label'"
      >
        <li
          v-for="(option, index) in options"
          :id="id + '-' + index"
          :key="option.label"
          role="option"
          class="select-field__option"
          :class="{ 'select-field__option--active': index === active }"
          :aria-selected="index === selected"
          @pointerdown.prevent
          @click="choose(index)"
        >
          {{ option.label }}
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped lang="scss">
@use '../assets/styles/controls';
@use '../assets/styles/tools' as styles;

.select-field {
  @include controls.field-layout;

  min-width: 0;

  &__control {
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      right: 18px;
      width: 20px;
      height: 20px;
      transform: translateY(-50%);
      pointer-events: none;
      background: url('../assets/images/select-chevron.svg') center / contain no-repeat;
    }
  }

  &__native,
  &__trigger {
    @include controls.field-surface($line-height: 1.4);

    appearance: none;
    text-align: left;
    padding: 8px 42px 8px var(--field-inset);
    cursor: pointer;

    &:focus {
      @include controls.control-focus;
    }
  }

  &__native {
    display: none;
  }

  &__trigger {
    @include styles.hover {
      &:hover {
        border-color: var(--accent-hover);
      }
    }

    &:active,
    &[aria-expanded='true'] {
      border-color: var(--accent);
    }
  }

  &__list {
    position: absolute;
    z-index: 2;
    inset: calc(100% + 4px) 0 auto;
    margin: 0;
    padding: 4px;
    max-height: min(280px, 40vh);
    overflow: auto;
    overscroll-behavior: contain;
    list-style: none;
    border: 1px solid var(--rule);
    border-radius: 10px;
    background: var(--white);
    box-shadow: 0 6px 20px #20221f26;
    font-size: 15px;
  }

  &__option {
    padding: 9px 12px;
    border-radius: 6px;
    cursor: pointer;

    &[aria-selected='true'] {
      color: var(--focus);
      font-weight: 600;
    }

    &--active {
      background: #ededff;
    }

    @include styles.hover {
      &:hover {
        background: #ededff;
      }
    }
  }

  @media (pointer: coarse) {
    &__native {
      display: block;
    }

    &__trigger,
    &__list {
      display: none;
    }
  }
}
</style>
