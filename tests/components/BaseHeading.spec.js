import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import BaseHeading from '../../src/components/BaseHeading.vue'

describe('BaseHeading', () => {
  it('keeps the semantic level independent from visual size', async () => {
    const heading = mount(BaseHeading, {
      props: { level: 3, size: 'hero' },
      attrs: { id: 'section-title', 'data-reveal': '' },
      slots: { default: 'Заголовок' },
    })

    expect(heading.element.tagName).toBe('H3')
    expect(heading.classes()).toContain('heading--hero')
    expect(heading.attributes('id')).toBe('section-title')
    expect(heading.attributes('data-reveal')).toBe('')

    await heading.setProps({ level: 1, size: 'card' })
    expect(heading.element.tagName).toBe('H1')
    expect(heading.classes()).toContain('heading--card')
  })

  it('supports whole-heading italics and inline emphasis in the slot', () => {
    const heading = mount(BaseHeading, {
      props: { italic: true },
      slots: { default: 'Доход <em>вашего канала</em>' },
    })

    expect(heading.element.tagName).toBe('H2')
    expect(heading.classes()).toContain('heading--italic')
    expect(heading.get('em').text()).toBe('вашего канала')
    expect(heading.text()).toBe('Доход вашего канала')
  })
})
