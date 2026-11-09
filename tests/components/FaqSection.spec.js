import { afterEach, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import FaqSection from '../../src/components/FaqSection.vue'

afterEach(() => vi.unstubAllGlobals())
it('раскрывает каждый ответ и позволяет закрыть последний', async () => {
  vi.stubGlobal('matchMedia', () => ({ matches: true }))
  const page = mount(FaqSection, { global: { plugins: [createPinia()] } })
  const buttons = page.findAll('button')
  expect(buttons).toHaveLength(5)
  expect(buttons[0].attributes('aria-expanded')).toBe('true')
  for (const button of buttons.slice(1).concat(buttons[0])) {
    await button.trigger('click')
    expect(page.findAll('[aria-expanded=true]')).toHaveLength(1)
    expect(page.get('#' + button.attributes('aria-controls')).attributes('inert')).toBeUndefined()
    expect(page.findAll('.answer[inert]')).toHaveLength(4)
  }
  await buttons[0].trigger('click')
  expect(page.findAll('.answer[inert]')).toHaveLength(5)
  page.unmount()
})
