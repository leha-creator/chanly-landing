import { afterEach, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import IncomeSection from '../../src/components/IncomeSection.vue'

afterEach(() => vi.unstubAllGlobals())

it('пересчитывает сумму при смене любой вводной и восстанавливается после ошибки', async () => {
  vi.stubGlobal('matchMedia', () => ({ matches: true }))
  const wrapper = mount(IncomeSection, { global: { plugins: [createPinia()] } })
  const topics = wrapper.get('select')
  const views = wrapper.get('[inputmode=numeric]')
  const amount = () => wrapper.get('[role=status] strong').text()
  expect(amount()).toBe('18 000 ₽')
  const choose = async index => {
    topics.element.selectedIndex = index
    await topics.trigger('change')
  }
  const trigger = wrapper.get('[role=combobox]')
  await trigger.trigger('keydown', { key: 'End' })
  expect(trigger.attributes('aria-expanded')).toBe('true')
  await trigger.trigger('keydown', { key: 'Escape' })
  expect(amount()).toBe('18 000 ₽')
  await trigger.trigger('keydown', { key: 'Н' })
  await trigger.trigger('keydown', { key: 'Enter' })
  expect(trigger.text()).toBe('Новости и СМИ')
  expect(amount()).toBe('39 000 ₽')
  await choose(1)
  expect(amount()).toBe('21 000 ₽')
  await choose(2)
  expect(amount()).toBe('39 000 ₽')
  await choose(0)
  expect(amount()).toBe('18 000 ₽')
  await wrapper.get('input[type=range]').setValue(12)
  expect(amount()).toBe('36 000 ₽')
  await wrapper.get('.placements-mobile select').setValue('4')
  expect(amount()).toBe('12 000 ₽')
  expect(wrapper.get('input[type=range]').element.value).toBe('4')
  await views.setValue('')
  expect(views.attributes('aria-invalid')).toBe('true')
  expect(amount()).toBe('—')
  await views.setValue('0')
  expect(views.attributes('aria-invalid')).toBeUndefined()
  expect(amount()).toBe('0 ₽')
  wrapper.unmount()
})
