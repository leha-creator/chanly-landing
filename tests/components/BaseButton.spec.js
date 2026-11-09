import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import BaseButton from '../../src/components/BaseButton.vue'

describe('BaseButton', () => {
  it('fires once, retains its name while busy and works again when ready', async () => {
    const onClick = vi.fn()
    const button = mount(BaseButton, { attrs: { onClick }, slots: { default: 'Подключить канал' } })
    expect(button.element.type).toBe('button')
    button.element.click()
    expect(onClick).toHaveBeenCalledTimes(1)
    await button.setProps({ loading: true })
    expect(button.text()).toContain('Подключить канал')
    expect(button.attributes('aria-busy')).toBe('true')
    for (const props of [{ loading: true }, { disabled: true }, { loading: false }]) {
      await button.setProps(props)
      button.element.click()
      expect(onClick).toHaveBeenCalledTimes(1)
    }
    await button.setProps({ disabled: false })
    expect(button.attributes('aria-busy')).toBeUndefined()
    button.element.click()
    expect(onClick).toHaveBeenCalledTimes(2)
  })
})
