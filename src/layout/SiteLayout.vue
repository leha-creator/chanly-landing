<script setup>
import { VueLenis } from 'lenis/vue'
import 'lenis/dist/lenis.css'
import { useLandingNavigation } from '../composables/useLandingNavigation.js'
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'
import BackToTop from '../components/BackToTop.vue'

import NotificationStack from '../components/NotificationStack.vue'
import CookieNotice from '../components/CookieNotice.vue'

const { reduced, pastHero } = useLandingNavigation()
const scrollOptions = { lerp: 0.085 }
</script>
<template>
  <VueLenis v-if="!reduced" ref="scroller" root :options="scrollOptions" />
  <SiteHeader />
  <main><slot /></main>
  <SiteFooter />
  <div class="overlays">
    <BackToTop :visible="pastHero" />
    <NotificationStack />
    <CookieNotice />
  </div>
</template>
<style scoped lang="scss">
.overlays {
  position: fixed;
  z-index: var(--layer-notice);
  inset: auto max(24px, env(safe-area-inset-right)) max(24px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left));
  display: grid;
  grid-template-columns: 1fr minmax(0, 592px) 1fr;
  align-items: end;
  gap: 12px;
  pointer-events: none;
}
.overlays :deep(.back) { grid-area: 1 / 1; margin-bottom: 4px; }
.overlays :deep(.notifications) { grid-area: 1 / 3; justify-self: end; }
.overlays :deep(.cookie-notice) { grid-area: 1 / 2; position: relative; left: 4px; }
@media (max-width: 82rem) {
  .overlays {
    inset: auto max(12px, env(safe-area-inset-right)) max(12px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left));
    grid-template-columns: 48px minmax(0, 1fr);
    gap: 12px 14px;
  }
  .overlays :deep(.back) { margin-bottom: 0; }
  .overlays :deep(.notifications) { grid-area: 1 / 2; }
  @media (max-width: 48rem) {
    .overlays :deep(.notifications) { position: relative; top: 1px; }
  }
  .overlays :deep(.cookie-notice) { grid-row: 2; grid-column: 1 / -1; left: auto; width: min(100%, 592px); justify-self: center; }
}
</style>
