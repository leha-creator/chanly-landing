import { afterEach, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { nextTick } from 'vue'
import DemoSection from '../../src/components/DemoSection.vue'

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

it('связывает четыре экрана со всеми переключателями и перезапускает таймер', async () => {
  vi.useFakeTimers()
  const media = new globalThis.EventTarget()
  media.matches = false
  const compact = new globalThis.EventTarget()
  compact.matches = false
  vi.stubGlobal('matchMedia', query => query.includes('max-width') ? compact : media)
  let intersect
  vi.stubGlobal('IntersectionObserver', class {
    constructor(callback) { intersect = callback }
    observe() {}
    disconnect() {}
  })
  const wrapper = mount(DemoSection, { global: { plugins: [createPinia()] } })
  const captions = ['Подключение канала', 'Мои каналы', 'Запросы и размещения', 'Выплаты']
  const images = new Set()
  function check(index) {
    const img = wrapper.get('img')
    expect(img.attributes('alt')).toContain(captions[index])
    expect(wrapper.get('figcaption').text()).toContain(captions[index])
    for (const selector of ['h3 button', '.mobile-index button', '.progress button']) {
      const buttons = wrapper.findAll(selector)
      expect(buttons.filter(b => b.attributes('aria-current') === 'step')).toEqual([buttons[index]])
    }
    images.add(img.attributes('src'))
  }
  await vi.advanceTimersByTimeAsync(30_000)
  check(0)
  intersect([{ isIntersecting: true }])
  await nextTick()
  await vi.advanceTimersByTimeAsync(19_999)
  check(0)
  await wrapper.findAll('h3 button')[1].trigger('click')
  await vi.advanceTimersByTimeAsync(19_999)
  check(1)
  await vi.advanceTimersByTimeAsync(1)
  check(2)
  await wrapper.findAll('.progress button')[3].trigger('click')
  check(3)
  await vi.advanceTimersByTimeAsync(20_000)
  check(0)
  expect(images.size).toBe(4)
  await wrapper.findAll('.mobile-index button')[2].trigger('click')
  check(2)
  await wrapper.findAll('.mobile-controls button')[0].trigger('click')
  check(1)
  media.matches = true
  media.dispatchEvent(new globalThis.Event('change'))
  await nextTick()
  expect(wrapper.find('.playing').exists()).toBe(false)
  await wrapper.findAll('.mobile-controls button')[1].trigger('click')
  await vi.advanceTimersByTimeAsync(40_000)
  check(2)
  media.matches = false
  media.dispatchEvent(new globalThis.Event('change'))
  await nextTick()
  await vi.advanceTimersByTimeAsync(20_000)
  check(3)
  for (const width of [390, 768, 1024]) {
    compact.matches = width <= 1024
    compact.dispatchEvent(new globalThis.Event('change'))
    await nextTick()
    expect(vi.getTimerCount()).toBe(0)
    await vi.advanceTimersByTimeAsync(41_000)
    check(3)
    compact.matches = false
    compact.dispatchEvent(new globalThis.Event('change'))
    await nextTick()
    expect(vi.getTimerCount()).toBe(1)
    await vi.advanceTimersByTimeAsync(19_999)
    check(3)
  }
  wrapper.unmount()
  expect(vi.getTimerCount()).toBe(0)
})
