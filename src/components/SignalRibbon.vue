<script setup>
const words = ['КОНТЕНТ', 'АУДИТОРИЯ', 'РЕКЛАМА', 'ДОХОД']
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
        <template v-for="(word, index) in words" :key="word">
          <span>{{ word }}</span>
          <span v-if="index < words.length - 1" class="arrow" aria-hidden="true"></span>
        </template>
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
  display: grid;
  grid-template-columns: repeat(3, minmax(max-content, 1fr) 60px) minmax(max-content, 1fr);
  align-items: center;
  min-width: 100vw;
  gap: 2.5vw;
  padding: 24px 5.55vw 24px 24px;
  font: 700 clamp(18px, 1.95vw, 28px) / 1.12 var(--font-heading);
  letter-spacing: -0.03em;
}
.arrow { flex: 0 0 60px; height: 36px; background: url('../assets/images/ribbon-arrow.svg') center / contain no-repeat; }
@media (max-width: 48rem) {
  .repeat {
    display: flex;
    padding: 12px;
    line-height: 1.4;
    gap: 16px;
    font-size: 16px;
  }
}

@media (max-width: 48rem) { .arrow { flex-basis: 17px; height: 22px; background-image: url('../assets/images/ribbon-arrow-small.svg'); } }
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
  .repeat[aria-hidden] {
    display: none;
  }
  @media (max-width: 48rem) {
    .repeat { width: 100vw; gap: clamp(2px, 1vw, 8px); justify-content: space-between; font-size: clamp(12px, 3.65vw, 16px); }
    .arrow { flex-basis: 1em; }
  }
}
</style>
