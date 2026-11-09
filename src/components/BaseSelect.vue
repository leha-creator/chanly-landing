<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, toRaw, useId } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  options: { type: Array, required: true },
})
const value = defineModel({ required: true })
const id = useId()
const root = ref(null)
const open = ref(false)
const active = ref(0)
const selected = computed(() => props.options.findIndex(option => toRaw(option.value) === toRaw(value.value)))
let prefix = ''
let lastKey = 0

function move(index) {
  active.value = Math.max(0, Math.min(index, props.options.length - 1))
  nextTick(() => globalThis.document.getElementById(id + '-' + active.value)?.scrollIntoView({ block: 'nearest' }))
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
  <div ref="root" class="select-field">
    <label :id="id + '-label'" :for="id">{{ label }}</label>
    <div class="control">
      <select :id="id" v-model="value">
        <option v-for="option in options" :key="option.label" :value="option.value">{{ option.label }}</option>
      </select>
      <button type="button" role="combobox" :aria-labelledby="id + '-label'"
        :aria-expanded="open" :aria-controls="id + '-list'"
        :aria-activedescendant="open ? id + '-' + active : undefined"
        @click="toggle" @keydown="keydown" @blur="open = false">{{ options[selected]?.label }}</button>
      <ul v-show="open" :id="id + '-list'" role="listbox" :aria-labelledby="id + '-label'">
        <li v-for="(option, index) in options" :id="id + '-' + index" :key="option.label"
          role="option" :class="{ active: index === active }" :aria-selected="index === selected"
          @pointerdown.prevent @click="choose(index)">{{ option.label }}</li>
      </ul>
    </div>
  </div>
</template>
<style scoped lang="scss">
.select-field { display: grid; gap: 8px; min-width: 0; font-size: 13px; }
.control { position: relative; }
.control::after {
  content: ''; position: absolute; top: calc(var(--field-height) / 2 - 5px); right: 18px;
  width: 9px; height: 9px; border: solid var(--ink); border-width: 0 2px 2px 0;
  transform: rotate(45deg); pointer-events: none;
}
select, button {
  width: 100%; min-height: var(--field-height); appearance: none; text-align: left;
  padding: 8px 42px 8px var(--field-inset); border: 1px solid var(--rule); border-radius: 8px;
  font: 400 var(--field-font)/1.4 var(--font-body); background: white; color: var(--ink); cursor: pointer;
}
select { display: none; }
ul {
  position: absolute; z-index: 2; inset: calc(100% + 4px) 0 auto;
  margin: 0; padding: 4px; max-height: min(280px, 40vh); overflow: auto; overscroll-behavior: contain;
  list-style: none; border: 1px solid var(--rule); border-radius: 10px; background: white;
  box-shadow: 0 6px 20px #20221f26; font-size: 15px;
}
li { padding: 9px 12px; border-radius: 6px; cursor: pointer; }
li[aria-selected=true] { color: var(--focus); font-weight: 600; }
li.active { background: #ededff; }
@media (hover: hover) and (pointer: fine) {
  button:hover { border-color: var(--accent-hover); }
  li:hover { background: #ededff; }
}
button:active, button[aria-expanded=true] { border-color: var(--accent); }
@media (pointer: coarse) {
  select { display: block; }
  button, ul { display: none; }
}
</style>
