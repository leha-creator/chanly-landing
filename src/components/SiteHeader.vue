<script setup>
import BaseButton from './BaseButton.vue'
import { connectChannel } from '../composables/useConnectChannel.js'
</script>
<template>
  <header class="header">
    <div class="header-row">
      <a href="#top" aria-label="Chanly, к началу"
        ><img
          src="../assets/images/logo.svg"
          width="148"
          height="45"
          alt="Chanly"
      /></a>
      <nav aria-label="Разделы страницы">
        <a href="#how">Как это работает</a><a href="#income">Доход</a
        ><a href="#faq">Вопросы</a>
      </nav>
      <BaseButton @click="connectChannel">Подключить канал</BaseButton>
    </div>
  </header>
</template>
<style scoped lang="scss">
.header {
  --button-fill: var(--ink);
  position: sticky;
  top: 0;
  z-index: var(--layer-sticky);
  background: var(--paper);
  padding: 0 var(--gutter);
}
.header-row {
  max-width: 1440px;
  margin: auto;
  display: flex;
  align-items: center;
  gap: 3vw;
  padding: 22px 0;
  border-bottom: 1px solid #cbc9c1;
}
img {
  display: block;
  max-width: 100%;
  height: auto;
}
nav {
  font-size: 14px;
  display: flex;
  gap: 32px;
  flex: 1;
  justify-content: center;
}
a {
  text-decoration: none;
}
@media (min-width: 64rem) {
  nav { gap: 40px; }
  nav a:nth-child(1) { width: 150px; }
  nav a:nth-child(2) { width: 65px; }
  nav a:nth-child(3) { width: 90px; }
}
@media (max-width: 48rem) {
  .header { position: static; }
  .header-row {
    padding: 20px 0 0;
    border: 0;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 20px 4px;
  }
  img {
    width: 116px;
  }
  nav {
    order: 3;
    flex-basis: 100%;
    justify-content: space-between;
    gap: 4px;
    font-size: 14px;
  }
  nav a {
    display: grid;
    place-items: center;
    min-height: 44px;
  }
}
</style>
