import { onScopeDispose, ref } from 'vue'
import { defineStore } from 'pinia'

export const useNotifications = defineStore('notifications', () => {
  const messages = ref([])
  const timers = new Map()
  let nextId = 0

  function dismiss(id) {
    globalThis.clearTimeout(timers.get(id))
    timers.delete(id)
    messages.value = messages.value.filter(message => message.id !== id)
  }

  function notify(type, text) {
    const id = ++nextId
    messages.value.push({ id, type, text })
    timers.set(id, globalThis.setTimeout(() => dismiss(id), 10_000))
    return id
  }

  onScopeDispose(() => {
    for (const timer of timers.values()) globalThis.clearTimeout(timer)
    timers.clear()
  })
  return { messages, notify, dismiss }
})
