import { afterEach, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { nextTick } from 'vue'
import NotificationStack from '../../src/components/NotificationStack.vue'
import { useNotifications } from '../../src/stores/notifications.js'

afterEach(() => vi.useRealTimers())
it('закрывает каждое уведомление независимо и очищает таймеры', async () => {
  vi.useFakeTimers()
  const pinia = createPinia()
  const page = mount(NotificationStack, { global: { plugins: [pinia] } })
  const notices = useNotifications(pinia)
  notices.notify('success', 'Успех')
  await vi.advanceTimersByTimeAsync(3000)
  notices.notify('error', 'Сбой')
  notices.notify('info', 'Информация')
  await nextTick()
  expect(page.findAll('[role=status]')).toHaveLength(2)
  expect(page.get('[role=alert]').text()).toBe('Сбой')
  await page.get('[aria-label$="Информация"]').trigger('click')
  await vi.advanceTimersByTimeAsync(6999)
  expect(page.findAll('button')).toHaveLength(2)
  await vi.advanceTimersByTimeAsync(1)
  expect(page.findAll('button')).toHaveLength(1)
  expect(page.text()).toContain('Сбой')
  await vi.advanceTimersByTimeAsync(3000)
  expect(page.findAll('button')).toHaveLength(0)
  notices.notify('info', 'Новое')
  notices.$dispose()
  expect(vi.getTimerCount()).toBe(0)
  page.unmount()
})
