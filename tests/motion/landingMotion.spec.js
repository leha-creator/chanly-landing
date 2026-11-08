import { afterEach, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import TermsSection from '../../src/components/TermsSection.vue'
import { useLandingMotion } from '../../src/stores/landingMotion.js'

afterEach(() => vi.unstubAllGlobals())
function setup(reduced = false) {
  const media = new globalThis.EventTarget()
  media.matches = reduced
  vi.stubGlobal('matchMedia', () => media)
  const observers = []
  vi.stubGlobal('IntersectionObserver', class {
    constructor(cb) { this.cb = cb; observers.push(this) }
    observe() {}
    disconnect = vi.fn()
  })
  const pinia = createPinia()
  const render = () => mount(TermsSection, { global: { plugins: [pinia] } })
  return { pinia, observers, render, media }
}
it('показывает заголовок до карточек и не повторяет показ в пределах приложения', () => {
  const { pinia, observers, render } = setup()
  const page = render()
  expect(page.element.hasAttribute('data-waiting')).toBe(true)
  expect(page.find('h2').element.style.getPropertyValue('--order')).toBe('0')
  expect(page.find('article').element.style.getPropertyValue('--order')).toBe('1')
  observers[0].cb([{isIntersecting:false}])
  expect(useLandingMotion(pinia).shown.terms).toBeUndefined()
  observers[0].cb([{isIntersecting:true}])
  expect(page.element.hasAttribute('data-waiting')).toBe(false)
  expect(observers[0].disconnect).toHaveBeenCalled()
  page.unmount()
  const next = render()
  expect(next.element.hasAttribute('data-waiting')).toBe(false)
  expect(observers).toHaveLength(1)
  next.unmount()
  expect(useLandingMotion(pinia).takeIntro()).toBe(true)
  expect(useLandingMotion(pinia).takeIntro()).toBe(false)
  const fresh = useLandingMotion(createPinia())
  expect(fresh.takeIntro()).toBe(true)
  expect(fresh.shown.terms).toBeUndefined()
})
it.each([true,false])('показывает содержимое без движения (изначально reduce: %s)', reduced => {
  const { media, render } = setup(reduced)
  const page = render()
  if (!reduced) { media.matches = true; media.dispatchEvent(new globalThis.Event('change')) }
  expect(page.element.hasAttribute('data-waiting')).toBe(false)
  page.unmount()
})
