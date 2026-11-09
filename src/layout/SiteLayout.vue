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
  <BackToTop :visible="pastHero" />
  <div class="overlays">
    <NotificationStack />
    <CookieNotice />
  </div>
</template>
<style scoped lang="scss">
.overlays {
  position: fixed;
  z-index: var(--layer-notice);
  bottom: max(20px, env(safe-area-inset-bottom));
  right: var(--gutter);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--gap);
  width: min(470px, calc(100% - 2 * var(--gutter) - 60px));
  max-height: 80dvh;
  pointer-events: none;
  font-size: 14px;
}
.overlays :deep(button) {
  flex: 0 0 44px;
  height: 44px;
  background: transparent;
  border: 0;
  color: inherit;
  font-size: 22px;
  cursor: pointer;
}
.overlays :deep(button:focus-visible) { outline-offset: -4px; }
</style>
