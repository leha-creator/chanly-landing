import { afterEach, expect, it, vi } from 'vitest'
import { nextTick, defineComponent } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import App from '../../src/App.vue'
import HomeView from '../../src/views/HomeView.vue'

afterEach(() => vi.unstubAllGlobals())

it('связывает якоря реальной страницы, реагирует на порог и меняет механизм прокрутки', async () => {
  const media = new globalThis.EventTarget()
  media.matches = false
  vi.stubGlobal('matchMedia', () => media)
  const nativeScroll = vi.fn(),
    smoothScroll = vi.fn()
  vi.stubGlobal('scrollTo', nativeScroll)
  const engine = defineComponent({
    setup(_, { expose }) {
      expose({ lenis: { scrollTo: smoothScroll } })
      return () => null
    },
  })
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: HomeView }],
  })
  await router.push('/')
  const render = () =>
    mount(App, {
      attachTo: globalThis.document.body,
      global: { plugins: [router, createPinia()], stubs: { VueLenis: engine } },
    })
  const page = render()
  await flushPromises()
  for (const a of page.findAll('a[href^="#"]'))
    expect(page.find(a.attributes('href')).exists()).toBe(true)
  const ribbon = page.get('#ribbon').element
  let y = 50
  ribbon.getBoundingClientRect = () => ({ top: y })
  const scroll = async () => {
    globalThis.dispatchEvent(new globalThis.Event('scroll'))
    await nextTick()
  }
  await scroll()
  expect(page.find('.back').exists()).toBe(false)
  y = -1
  await scroll()
  expect(page.get('.back').attributes('href')).toBe('#top')
  await page.get('header a[href="#how"]').trigger('click')
  await flushPromises()
  expect(router.currentRoute.value.hash).toBe('#how')
  expect(smoothScroll).toHaveBeenCalledTimes(1)
  expect(globalThis.document.activeElement).toBe(page.get('#how h2').element)
  // Chromium can restore body focus after a same-document history traversal.
  const heading = page.get('#how h2').element
  heading.blur()
  globalThis.history.replaceState(null, '', '#how')
  try {
    globalThis.dispatchEvent(new globalThis.Event('hashchange'))
    await new Promise(resolve => globalThis.requestAnimationFrame(resolve))
    expect(globalThis.document.activeElement).toBe(heading)
  } finally {
    globalThis.history.replaceState(null, '', '/')
  }
  media.matches = true
  media.dispatchEvent(new globalThis.Event('change'))
  await nextTick()
  await page.get('.back').trigger('click')
  await flushPromises()
  expect(nativeScroll).toHaveBeenCalledWith({ top: 0, behavior: 'instant' })
  y = 200
  await scroll()
  expect(page.find('.back').exists()).toBe(false)
  page.unmount()
  media.matches = false
  const again = render()
  await flushPromises()
  smoothScroll.mockClear()
  await again.get('footer a[href="#contact"]').trigger('click')
  await flushPromises()
  expect(smoothScroll).toHaveBeenCalledTimes(1)
  again.unmount()
})
