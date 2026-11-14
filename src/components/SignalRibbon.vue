<script setup>
const words = ['КОНТЕНТ', 'АУДИТОРИЯ', 'РЕКЛАМА', 'ДОХОД']
</script>
<template>
  <div
    id="ribbon"
    class="ribbon"
  >
    <div class="ribbon__track">
      <div
        v-for="n in 4"
        :key="n"
        class="ribbon__repeat"
        :aria-hidden="n === 4 || undefined"
      >
        <template
          v-for="(word, index) in words"
          :key="word"
        >
          <span class="ribbon__word">{{ word }}</span>
          <span
            v-if="index <= words.length - 1"
            class="ribbon__arrow"
            aria-hidden="true"
          />
        </template>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@use '../assets/styles/tools' as styles;

.ribbon {
  overflow: hidden;
  background: var(--highlight);
  color: var(--ink);

  &__track {
    display: flex;
    width: max-content;

    @include styles.motion {
      animation: ticker 32s linear infinite;
    }
  }

  &__repeat {
    display: grid;
    grid-template-columns: repeat(4, minmax(max-content, 1fr) 60px);
    align-items: center;
    min-width: 100vw;
    gap: 2.5vw;
    padding: 24px;
    font: 700 clamp(18px, 1.95vw, 28px) / 1.12 var(--font-heading);
    letter-spacing: -0.03em;
    text-align: center;

    @include styles.mobile {
      display: flex;
      min-width: unset;
      padding: 12px;
      line-height: 1.4;
      gap: 16px;
      font-size: 16px;
    }
  }

  &__arrow {
    flex: 0 0 60px;
    height: 36px;
    background: url('../assets/images/ribbon-arrow.svg') center / contain no-repeat;

    @include styles.mobile {
      flex-basis: 17px;
      height: 22px;
      background-image: url('../assets/images/ribbon-arrow-small.svg');
    }
  }

  @include styles.reduced-motion {
    &__repeat[aria-hidden] {
      display: none;
    }

    @include styles.mobile {
      &__repeat {
        width: 100vw;
        gap: clamp(2px, 1vw, 8px);
        justify-content: space-between;
        font-size: clamp(12px, 3.65vw, 16px);
      }

      &__arrow {
        flex-basis: 1em;
      }
    }
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
</style>
