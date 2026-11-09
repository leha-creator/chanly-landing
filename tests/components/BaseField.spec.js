import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import { expect, it } from 'vitest'
import BaseField from '../../src/components/BaseField.vue'

it('keeps the value and associates a changing error with only its field', async () => {
  const form = mount(defineComponent({
    components: { BaseField },
    setup: () => ({ value: ref(''), error: ref(''), disabled: ref(false) }),
    template: `<BaseField label="Имя" v-model="value" :error="error" :disabled="disabled" aria-describedby="hint" />
               <span id="hint">Как к вам обращаться</span><BaseField label="Почта" type="email" />`,
  }))
  const [name, email] = form.findAll('input')
  const [nameLabel, emailLabel] = form.findAll('label')
  expect(name.element.id).not.toBe(email.element.id)
  expect(nameLabel.element.htmlFor).toBe(name.element.id)
  expect(emailLabel.element.htmlFor).toBe(email.element.id)
  expect(email.element.type).toBe('email')
  await name.setValue('Анна')
  expect(form.vm.value).toBe('Анна')
  form.vm.error = 'Уточните имя'
  form.vm.disabled = true
  await form.vm.$nextTick()
  expect(name.element.disabled).toBe(true)
  expect(name.attributes('aria-invalid')).toBe('true')
  expect(email.attributes('aria-describedby')).toBeUndefined()
  const errorId = name.element.id + '-error'
  expect(name.attributes('aria-describedby')).toBe('hint ' + errorId)
  expect(form.get('[id="' + errorId + '"]').text()).toBe('Уточните имя')
  expect(name.element.value).toBe('Анна')
  form.vm.error = ''
  form.vm.disabled = false
  await form.vm.$nextTick()
  expect(name.element.value).toBe('Анна')
  expect(name.attributes('aria-describedby')).toBe('hint')
  expect(name.attributes('aria-invalid')).toBeUndefined()
})
