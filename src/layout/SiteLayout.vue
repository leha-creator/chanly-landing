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
  <VueLenis
    v-if="!reduced"
    ref="scroller"
    root
    :options="scrollOptions"
  />
  <SiteHeader />
  <main><slot /></main>
  <SiteFooter />
  <div class="overlays">
    <BackToTop
      class="overlays__back"
      :visible="pastHero"
    />
    <NotificationStack class="overlays__notifications" />
    <CookieNotice class="overlays__cookies" />
  </div>
</template>
<style scoped lang="scss">
@use '../assets/styles/tools' as styles;

.overlays {
  position: fixed;
  z-index: var(--layer-notice);
  inset: auto max(24px, env(safe-area-inset-right)) max(24px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left));
  display: grid;
  grid-template-columns: 1fr minmax(0, 592px) 1fr;
  align-items: end;
  gap: 12px;
  pointer-events: none;

  &__back { grid-area: 1 / 1; margin-bottom: 4px; }
  &__notifications { grid-area: 1 / 3; justify-self: end; }
  &__cookies { grid-area: 1 / 2; position: relative; left: 4px; }

  @media (max-width: 82rem) {
    inset: auto max(12px, env(safe-area-inset-right)) max(12px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left));
    grid-template-columns: 48px minmax(0, 1fr);
    gap: 12px 14px;

    &__back { margin-bottom: 0; }
    &__notifications { grid-area: 1 / 2; }
    &__cookies {
      grid-row: 2;
      grid-column: 1 / -1;
      left: auto;
      width: min(100%, 592px);
      justify-self: center;
    }
  }

  @include styles.mobile {
    &__notifications { position: relative; top: 1px; }
  }
}
</style>
