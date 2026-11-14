<script setup>
import BaseButton from './BaseButton.vue'
import SupportMenu from './SupportMenu.vue'
import { connectChannel } from '../composables/useConnectChannel.js'
</script>
<template>
  <header class="header">
    <div class="header__content">
      <a
        class="header__home"
        href="#top"
        aria-label="Chanly, к началу"
      ><img
        class="header__logo"
        src="../assets/images/logo.svg"
        width="148"
        height="45"
        alt="Chanly"
      ></a>
      <nav
        class="header__nav"
        aria-label="Разделы страницы"
      >
        <a
          class="header__link"
          href="#how"
        >Как это работает</a><a
          class="header__link"
          href="#income"
        >Доход</a><a
          class="header__link"
          href="#faq"
        >Вопросы</a>
        <SupportMenu />
      </nav>
      <BaseButton @click="connectChannel">
        Подключить канал
      </BaseButton>
    </div>
  </header>
</template>
<style scoped lang="scss">
@use '../assets/styles/tools' as styles;

.header {
  --button-fill: var(--ink);
  position: sticky;
  top: 0;
  z-index: var(--layer-sticky);
  background: var(--paper);
  padding-inline: var(--gutter);

  &__content {
    @include styles.container;
    display: flex;
    align-items: center;
    gap: 3vw;
    padding: 22px 0;
    border-bottom: 1px solid var(--rule);
  }

  &__logo {
    display: block;
    max-width: 100%;
    height: auto;
  }

  &__nav {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    gap: 32px;
    font-size: 14px;
  }

  &__home,
  &__link { text-decoration: none; }

  @media (min-width: 64rem) {
    &__nav { gap: 40px; }
    &__link {
      &:nth-child(1) { width: 150px; }
      &:nth-child(2) { width: 65px; }
      &:nth-child(3) { width: 90px; }
    }
  }

  @media (min-width: 48.001rem) and (max-width: 64rem) {
    &__content { flex-wrap: wrap; justify-content: space-between; gap: 12px; }
    &__nav { order: 3; flex-basis: 100%; justify-content: space-between; gap: 16px; }
  }

  @include styles.mobile {
    position: static;

    &__content {
      padding: 20px 0 0;
      border: 0;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 20px 4px;
    }

    &__logo { width: 116px; }

    &__nav {
      order: 3;
      flex-basis: 100%;
      display: grid;
      grid-template-columns: 1.25fr .65fr .85fr 1.1fr;
      gap: 4px;
      font-size: 13px;
      line-height: 1.3;
    }

    &__link {
      display: grid;
      place-items: center;
      min-height: 44px;
    }
  }
}
</style>
