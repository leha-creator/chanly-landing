<script setup>
import { VueLenis } from 'lenis/vue'
import 'lenis/dist/lenis.css'
import { useLandingNavigation } from '../composables/useLandingNavigation.js'
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'
import BackToTop from '../components/BackToTop.vue'

const { reduced, pastHero } = useLandingNavigation()
const scrollOptions = { lerp: 0.085 }
</script>
<template>
  <VueLenis v-if="!reduced" ref="scroller" root :options="scrollOptions" />
  <SiteHeader />
  <main><slot /></main>
  <SiteFooter />
  <BackToTop :visible="pastHero" />
</template>
