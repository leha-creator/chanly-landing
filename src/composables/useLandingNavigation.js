import {
  ref,
  nextTick,
  onMounted,
  onUnmounted,
  useTemplateRef,
  watch,
} from 'vue'
import { useRoute, useRouter } from 'vue-router'

export function useLandingNavigation() {
  const route = useRoute()
  const router = useRouter()
  const provider = useTemplateRef('scroller')
  const preference = globalThis.matchMedia('(prefers-reduced-motion: reduce)')
  const reduced = ref(preference.matches)
  const pastHero = ref(false)
  const doc = globalThis.document
  let header,
    ribbon,
    sizeObserver,
    active = true

  function headerInset() {
    return header && globalThis.getComputedStyle(header).position === 'sticky' ? header.offsetHeight : 0
  }
  function measure() {
    ribbon = doc.getElementById('ribbon')
    pastHero.value =
      !!ribbon &&
      ribbon.getBoundingClientRect().top <= headerInset() + 1
  }
  function jump(hash, immediate = false) {
    const target = doc.getElementById((hash || '#top').slice(1))
    if (!target) return
    const heading = target.querySelector('h1,h2') || target
    heading.setAttribute('tabindex', '-1')
    heading.focus({ preventScroll: true })
    const top =
      target.id === 'top'
        ? 0
        : Math.max(
            0,
            globalThis.scrollY +
              target.getBoundingClientRect().top -
              headerInset(),
          )
    const engine = provider.value?.lenis
    if (engine && !reduced.value)
      engine.scrollTo(top, { immediate, force: true })
    else globalThis.scrollTo({ top, behavior: 'instant' })
  }
  function follow(event) {
    const link = event.target.closest?.('a[href^="#"]')
    if (
      !link ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey ||
      event.shiftKey
    )
      return
    const hash = link.getAttribute('href')
    if (!doc.getElementById(hash.slice(1))) return
    event.preventDefault()
    if (route.hash === hash) jump(hash)
    else router.push({ path: route.path, query: route.query, hash })
  }
  function restoreFragmentFocus() {
    const hash = globalThis.location.hash || '#top'
    // History traversal can reset focus after the router has handled the fragment.
    globalThis.requestAnimationFrame(() => {
      if (!active || (route.hash || '#top') !== hash) return
      const section = doc.getElementById(hash.slice(1))
      if (doc.activeElement === doc.body || doc.activeElement === section)
        section?.querySelector('h1,h2')?.focus({ preventScroll: true })
    })
  }
  const syncPreference = () => {
    reduced.value = preference.matches
  }
  watch(
    () => route.fullPath,
    async () => {
      await nextTick()
      if (active) {
        measure()
        jump(route.hash)
      }
    },
    { flush: 'post' },
  )
  onMounted(async () => {
    header = doc.querySelector('header')
    preference.addEventListener('change', syncPreference)
    doc.addEventListener('click', follow)
    globalThis.addEventListener('scroll', measure, { passive: true })
    globalThis.addEventListener('resize', measure)
    globalThis.addEventListener('hashchange', restoreFragmentFocus)
    if (globalThis.ResizeObserver && header) {
      sizeObserver = new globalThis.ResizeObserver(measure)
      sizeObserver.observe(header)
      sizeObserver.observe(doc.body)
    }
    await router.isReady()
    await nextTick()
    if (!active) return
    measure()
    const initialHash = route.hash
    if (initialHash) {
      // Native fragment scrolling and font layout can finish after Vue mounts.
      await doc.fonts?.ready
      await new Promise((resolve) => globalThis.requestAnimationFrame(resolve))
      if (active && route.hash === initialHash) {
        provider.value?.lenis?.resize?.()
        jump(initialHash, true)
      }
    }
  })
  onUnmounted(() => {
    active = false
    preference.removeEventListener('change', syncPreference)
    doc.removeEventListener('click', follow)
    globalThis.removeEventListener('scroll', measure)
    globalThis.removeEventListener('resize', measure)
    globalThis.removeEventListener('hashchange', restoreFragmentFocus)
    sizeObserver?.disconnect()
  })
  return { reduced, pastHero }
}
