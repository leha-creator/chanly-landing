import { defineStore } from 'pinia'

export const useLandingMotion = defineStore('landing-motion', {
  state: () => ({ introPlayed: false, shown: {} }),
  actions: {
    takeIntro() {
      if (this.introPlayed) return false
      this.introPlayed = true
      return true
    },
    show(id) { this.shown[id] = true },
  },
})
