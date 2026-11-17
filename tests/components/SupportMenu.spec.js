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

it('shows the floating panel and closes after choosing a messenger or resizing', async () => {
  page = mount(SupportMenu, { props: { floating: true }, attachTo: globalThis.document.body })
  const button = page.get('button[aria-label="Поддержка"]')
  await button.trigger('click')
  expect(page.get('h2').text()).toBe('Мы на связи')
  expect(page.get('[aria-disabled=true]').text()).toContain('Ссылка пока недоступна')
  expect(page.get('a').attributes('target')).toBe('_blank')
  expect(page.get('a').attributes('rel')).toBe('noopener noreferrer')
  await page.get('a').trigger('click')
  expect(button.attributes('aria-expanded')).toBe('false')
  await button.trigger('click')
  globalThis.dispatchEvent(new globalThis.Event('resize'))
  await page.vm.$nextTick()
  expect(button.attributes('aria-expanded')).toBe('false')
})

it('disables unsafe or empty messenger URLs', async () => {
  page = mount(SupportMenu, { props: { floating: true, telegramUrl: '', maxUrl: 'javascript:alert(1)' } })
  await page.get('button').trigger('click')
  expect(page.findAll('a')).toHaveLength(0)
  expect(page.findAll('[aria-disabled=true]')).toHaveLength(2)
})

it('closes when keyboard focus leaves the widget', async () => {
  page = mount(SupportMenu, { props: { floating: true }, attachTo: globalThis.document.body })
  await page.get('button').trigger('click')
  await page.get('a').trigger('focusout', { relatedTarget: globalThis.document.body })
  expect(page.find('ul').exists()).toBe(false)
})
