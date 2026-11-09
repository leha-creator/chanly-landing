<script setup>
import { useLandingMotion } from '../stores/landingMotion.js'
import { ref, onUnmounted } from 'vue'
import BaseButton from './BaseButton.vue'
import { connectChannel } from '../composables/useConnectChannel.js'
const preference = globalThis.matchMedia('(prefers-reduced-motion: reduce)')
const playIntro = ref(useLandingMotion().takeIntro() && !preference.matches)
const stopIntro = () => { playIntro.value = false }
const onPreference = () => { if (preference.matches) stopIntro() }
preference.addEventListener('change', onPreference)
onUnmounted(() => preference.removeEventListener('change', onPreference))
</script>
<template>
  <section id="top" class="hero" :class="{ intro: playIntro }">
    <div class="wrap">
      <div class="words">
        <h1>Канал ваш.<br />Доход <em>тоже.</em></h1>
        <p>
          Вы собираете вокруг себя людей.<br />Мы помогаем превратить это в
          заработок<br class="desktop-break" /> на рекламных размещениях.
        </p>
        <div class="actions">
          <BaseButton @click="connectChannel">Подключить мой канал</BaseButton
          ><a href="#how">Посмотреть, как это работает ↗</a>
        </div>
      </div>
      <div
        class="sculpture"
        @animationend.self="stopIntro"
        role="img"
        aria-label="Знак Chanly, карточка канала и пример размещения на 3 000 рублей"
      >
        <img class="orbit" src="../assets/images/orbit.svg" alt="" /><img
          class="emblem"
          src="../assets/images/emblem.svg"
          alt=""
        /><img
          class="identity"
          src="../assets/images/identity.svg"
          alt=""
        /><img class="receipt" src="../assets/images/receipt.svg" alt="" /><img
          class="sticker"
          src="../assets/images/sticker.svg"
          alt=""
        />
      </div>
    </div>
  </section>
</template>
<style scoped lang="scss">
.hero {
  padding: clamp(32px, 5vw, 80px) var(--gutter) 44px;
}
.wrap {
  display: grid;
  grid-template-columns: 1.125fr 1fr;
  align-items: center;
  gap: 28px;
}
h1 {
  font-size: clamp(48px, 6.8vw, 98px);
  line-height: 1;
}
em {
  font: italic 400 1em/1 var(--font-display);
  color: var(--accent);
}
p {
  font-size: clamp(17px, 1.4vw, 20px);
  max-width: 590px;
  color: #606458;
  margin: 28px 0;
}
.actions {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}
.actions button {
  --button-width: 280px;
}
.actions a {
  font-size: 14px;
  text-decoration: none;
}
@media (hover: hover) and (pointer: fine) { .actions a:hover { text-decoration: underline; color: var(--accent-hover); } }
.sculpture {
  aspect-ratio: 604/580;
  background: #ece9e1;
  position: relative;
  overflow: hidden;
  border-radius: 24px;
}
.sculpture img {
  position: absolute;
}
@media (min-width: 48.001rem) {
  .words { align-self: start; }
}
.orbit {
  inset: 0;
  width: 100%;
}
.emblem {
  width: 61.26%;
  left: 14.39%;
  top: 18.6%;
}
.identity {
  width: 38.1%;
  top: 4.8%;
  left: 5%;
}
.receipt {
  width: 43%;
  left: 49.7%;
  top: 70.7%;
}
.sticker {
  width: 26.99%;
  left: 66.62%;
  top: 5.9%;
}
@media (max-width: 48rem) {
  .hero {
    padding: 20px var(--gutter);
  }
  .wrap {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  h1 {
    font-size: clamp(45px, 13.1vw, 72px);
    line-height: 1.09;
  }
  p {
    margin: 20px 0;
    line-height: 1.4;
  }
  .actions {
    display: grid;
    gap: 20px;
  }
  .desktop-break { display: none; }
  .actions button {
    --button-font: 15px;
    --button-height: 45px;
    width: 100%;
  }
  .sculpture {
    width: 100%;
    max-width: 604px;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .intro .words,
  .intro .sculpture {
    animation: arrive var(--reveal-time) var(--reveal-ease) backwards;
  }
  .intro .sculpture {
    animation-delay: var(--reveal-step);
  }
  .emblem {
    animation: float 4s ease-in-out infinite alternate;
  }
  .intro .emblem {
    animation-delay: calc(var(--reveal-time) + var(--reveal-step));
  }
}
@keyframes arrive {
  from {
    opacity: 0;
    translate: 0 var(--reveal-rise);
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
}
@keyframes float {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-18px);
  }
}
</style>
