import { afterEach, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SupportMenu from '../../src/components/SupportMenu.vue'

let page
afterEach(() => page.unmount())

it('opens Telegram, keeps MAX inactive until provided and closes on Escape or outside click', async () => {
  page = mount(SupportMenu, { attachTo: globalThis.document.body })
  const button = page.get('button')
  await button.trigger('click')
  expect(button.attributes('aria-expanded')).toBe('true')
  expect(page.get('a').attributes('href')).toBe('https://t.me/sup_chanly')
  expect(page.get('[aria-disabled=true]').text()).toBe('MAX')
  await page.get('a').trigger('keydown', { key: 'Escape' })
  expect(page.find('ul').exists()).toBe(false)
  expect(globalThis.document.activeElement).toBe(button.element)
  await button.trigger('click')
  globalThis.document.body.dispatchEvent(new globalThis.Event('pointerdown', { bubbles: true }))
  await page.vm.$nextTick()
  expect(page.find('ul').exists()).toBe(false)
})

it('enables the MAX link when its address is supplied', async () => {
  page = mount(SupportMenu, { props: { maxUrl: 'https://max.ru/test-support' } })
  await page.get('button').trigger('click')
  expect(page.findAll('a').map(a => a.attributes('href'))).toEqual(['https://t.me/sup_chanly', 'https://max.ru/test-support'])
})
