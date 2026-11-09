import { afterEach, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CookieNotice from '../../src/components/CookieNotice.vue'

afterEach(() => { vi.unstubAllGlobals(); globalThis.localStorage.clear() })
it('сохраняет решение между посещениями', async () => {
  const first = mount(CookieNotice)
  await first.get('button').trigger('click')
  expect(first.find('aside').exists()).toBe(false)
  first.unmount()
  const next = mount(CookieNotice)
  expect(next.find('aside').exists()).toBe(false)
  next.unmount()
})
it('закрывается и при запрете браузерного хранилища', async () => {
  const denied = () => { throw new Error('storage unavailable') }
  vi.stubGlobal('localStorage', { getItem: denied, setItem: denied })
  const page = mount(CookieNotice)
  await page.get('button').trigger('click')
  expect(page.find('aside').exists()).toBe(false)
  page.unmount()
})

it('отказ на экране пояснений действует до следующего посещения', async () => {
  const page = mount(CookieNotice, { attachTo: globalThis.document.body })
  const details = page.findAll('button')[2]
  await details.trigger('click')
  expect(page.get('h2').text()).toBe('Что сохраняется')
  expect(globalThis.document.activeElement).toBe(details.element)
  await details.trigger('click')
  expect(details.text()).toBe('Подробнее')
  await page.findAll('button')[1].trigger('click')
  expect(page.find('aside').exists()).toBe(false)
  expect(globalThis.localStorage.length).toBe(0)
  page.unmount()
  const next = mount(CookieNotice)
  expect(next.get('h2').text()).toBe('Файлы cookie')
  next.unmount()
})
