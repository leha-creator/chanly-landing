import { onMounted, onUnmounted, useTemplateRef } from 'vue'
import { useLandingMotion } from '../stores/landingMotion.js'

export function useSectionReveal() {
  const section = useTemplateRef('section')
  const motion = useLandingMotion()
  let dispose
  onMounted(() => {
    const el = section.value
    if (motion.shown[el.id]) return
    const preference = globalThis.matchMedia('(prefers-reduced-motion: reduce)')
    function show() {
      motion.show(el.id)
      el.removeAttribute('data-waiting')
      dispose?.()
    }
    if (preference.matches || !globalThis.IntersectionObserver) return show()
    const items = el.querySelectorAll('[data-reveal]')
    items.forEach((item, index) => item.style.setProperty('--order', String(index)))
    el.setAttribute('data-waiting', '')
    const observer = new globalThis.IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) show()
    })
    const onChange = () => { if (preference.matches) show() }
    preference.addEventListener('change', onChange)
    el.addEventListener('focusin', show)
    dispose = () => {
      observer.disconnect()
      preference.removeEventListener('change', onChange)
      el.removeEventListener('focusin', show)
    }
    observer.observe(el)
  })
  onUnmounted(() => dispose?.())
}
