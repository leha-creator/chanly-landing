<script setup>
const words = ['КОНТЕНТ', '→', 'АУДИТОРИЯ', '→', 'РЕКЛАМА', '→', 'ДОХОД', '→']
</script>
<template>
  <div id="ribbon" class="ribbon">
    <div class="track">
      <div
        v-for="n in 2"
        :key="n"
        class="repeat"
        :aria-hidden="n === 2 || undefined"
      >
        <span v-for="(word, i) in words" :key="i" :class="{ arrow: word === '→' }" :aria-hidden="word === '→' || undefined">{{ word }}</span>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.ribbon {
  overflow: hidden;
  background: var(--highlight);
  color: var(--ink);
}
.track {
  display: flex;
  width: max-content;
}
.repeat {
  display: flex;
  align-items: center;
  justify-content: space-around;
  min-width: 100vw;
  gap: 2rem;
  padding: 18px 2rem;
  font: 700 clamp(18px, 2.25vw, 32px) / 1.5 var(--font-heading);
  letter-spacing: 0.04em;
}
.arrow { flex: 0 0 60px; font: 700 32px/36px var(--font-heading); text-align: center; }
@media (max-width: 48rem) {
  .repeat {
    padding: 10px 16px;
    gap: 16px;
    font-size: 16px;
  }
}

@media (max-width: 48rem) { .arrow { flex-basis: 17px; font-size: 16px; line-height: 22px; } }
@media (prefers-reduced-motion: no-preference) {
  .track {
    animation: ticker 32s linear infinite;
  }
}
@keyframes ticker {
  from {
    transform: translateX(-50%);
  }
  to {
    transform: translateX(0);
  }
}
@media (prefers-reduced-motion: reduce) {
  .repeat {
    min-width: 100vw;
    max-width: 100vw;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5em;
  }
  .repeat .arrow:last-child,
  .repeat[aria-hidden] {
    display: none;
  }
}
</style>
