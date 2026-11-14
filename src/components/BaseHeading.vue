<script setup lang="ts">
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
type HeadingSize = 'hero' | 'section' | 'card'

withDefaults(defineProps<{
  level?: HeadingLevel
  size?: HeadingSize
  italic?: boolean
}>(), {
  level: 2,
  size: 'section',
  italic: false,
})
</script>

<template>
  <component
    :is="`h${level}`"
    class="heading"
    :class="[`heading--${size}`, { 'heading--italic': italic }]"
  >
    <slot />
  </component>
</template>

<style scoped lang="scss">
@use '../assets/styles/tools' as styles;

.heading {
  margin: 0;
  font: 700 1em/1.12 var(--font-heading);
  letter-spacing: -.03em;

  &--hero {
    font-size: clamp(48px, 6vw, 92px);
    line-height: 1;

    @include styles.mobile {
      font-size: clamp(45px, 13.1vw, 72px);
      line-height: 1.09;
    }
  }

  &--section {
    font-size: clamp(34px, 3.62vw, 52px);
  }

  &--card {
    font-size: clamp(26px, 2.36vw, 34px);

    @include styles.mobile {
      font-size: 28px;
      line-height: 32px;
    }
  }

  &--italic {
    font-family: var(--font-display);
    font-style: italic;
    font-weight: 400;
    letter-spacing: -.04em;
  }

  :deep(em) {
    color: var(--accent);
    font: italic 400 1em/1 var(--font-display);
  }
}
</style>
