import { afterEach, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import ContactSection from '../../src/components/ContactSection.vue'
import { feedbackConsent } from '../../src/data/legal.js'
import { useNotifications } from '../../src/stores/notifications.js'

let page
let notices
function render(deliver) {
  vi.stubGlobal('matchMedia', () => ({ matches: true }))
  const pinia = createPinia()
  notices = useNotifications(pinia)
  page = mount(ContactSection, {
    props: { deliver }, attachTo: globalThis.document.body, global: { plugins: [pinia] },
  })
}
afterEach(() => {
  page.unmount()
  notices.$dispose()
  vi.unstubAllGlobals()
})
async function fill() {
  await page.get('[name=name]').setValue(' Анна ')
  await page.get('[name=email]').setValue('anna@example.org')
  await page.get('textarea').setValue(' Вопрос о канале ')
  await page.get('[type=checkbox]').setValue(true)
}
it('проверяет поля без доставки и сохраняет введённое', async () => {
  const network = vi.fn()
  vi.stubGlobal('fetch', network)
  render()
  expect(page.text()).toContain('Отправка временно недоступна')
  await page.get('[name=name]').setValue('   ')
  await page.get('[name=email]').setValue('не адрес')
  await page.get('textarea').setValue(' ')
  await page.get('form').trigger('submit')
  expect(page.findAll('[aria-invalid=true]')).toHaveLength(4)
  expect(globalThis.document.activeElement.name).toBe('name')
  await fill()
  expect(page.findAll('[aria-invalid=true]')).toHaveLength(0)
  await page.get('form').trigger('submit')
  expect(notices.messages.map(m => m.type)).toEqual(['info'])
  expect(network).not.toHaveBeenCalled()
  expect(page.get('textarea').element.value.trim()).toBe('Вопрос о канале')
})
it.each(['reject', 'unconfirmed', 'refused'])('обрабатывает %s и подтверждённую повторную отправку', async failure => {
  let resolve, reject
  const deliver = vi.fn().mockImplementationOnce(() => new Promise((yes, no) => {
    resolve = yes
    reject = no
  })).mockResolvedValue({ delivered: true })
  render(deliver)
  await fill()
  await page.get('form').trigger('submit')
  await page.get('form').trigger('submit')
  expect(deliver).toHaveBeenCalledTimes(1)
  expect(deliver).toHaveBeenCalledWith({ name: 'Анна', email: 'anna@example.org', question: 'Вопрос о канале', consent: true, consent_version: feedbackConsent.version, consent_sha256: feedbackConsent.sha256 })
  expect(page.get('button').attributes('aria-busy')).toBe('true')
  expect(notices.messages).toHaveLength(0)
  if (failure === 'reject') reject(new Error('offline'))
  else resolve(failure === 'refused' ? { delivered: false } : {})
  await flushPromises()
  expect(page.get('[role=alert]').text()).toContain('Вопрос пока не отправлен')
  expect(page.get('[role=alert] a').attributes('href')).toBe('mailto:info@chanly.ru')
  expect(page.get('textarea').element.value).toBe(' Вопрос о канале ')
  expect(page.get('[type=checkbox]').element.checked).toBe(true)
  await page.get('form').trigger('submit')
  await flushPromises()
  expect(deliver).toHaveBeenCalledTimes(2)
  expect(notices.messages[0].type).toBe('success')
  expect(page.find('[role=alert]').exists()).toBe(false)
  expect(page.get('textarea').element.value).toBe('')
})

it('offers a separate PDF consent, starts unchecked and blocks submission without agreement', async () => {
  const deliver = vi.fn()
  render(deliver)
  expect(page.get('[type=checkbox]').element.checked).toBe(false)
  expect(page.get('.contact__consent a').attributes('href')).toBe(feedbackConsent.asset)
  expect(page.get('.contact__policy a').attributes('href')).toBe('/privacy_policy.pdf')
  await fill()
  await page.get('[type=checkbox]').setValue(false)
  await page.get('form').trigger('submit')
  expect(deliver).not.toHaveBeenCalled()
  expect(page.get('[type=checkbox]').attributes('aria-invalid')).toBe('true')
})
it('asks to read the current consent after a version conflict and retains the question', async () => {
  render(vi.fn().mockRejectedValue({ code: 'consent_outdated' }))
  await fill()
  await page.get('form').trigger('submit')
  await flushPromises()
  expect(page.get('[role=alert]').text()).toContain('Редакция согласия обновилась')
  expect(page.get('textarea').element.value).toBe(' Вопрос о канале ')
  expect(notices.messages).toHaveLength(0)
})
