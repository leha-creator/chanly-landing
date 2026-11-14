<script setup>
import { useLandingMotion } from '../stores/landingMotion.js'
import { ref, onUnmounted } from 'vue'
import BaseButton from './BaseButton.vue'
import BaseHeading from './BaseHeading.vue'
import { connectChannel } from '../composables/useConnectChannel.js'
const preference = globalThis.matchMedia('(prefers-reduced-motion: reduce)')
const playIntro = ref(useLandingMotion().takeIntro() && !preference.matches)
const stopIntro = () => { playIntro.value = false }
const onPreference = () => { if (preference.matches) stopIntro() }
preference.addEventListener('change', onPreference)
onUnmounted(() => preference.removeEventListener('change', onPreference))
</script>
<template>
  <section
    id="top"
    class="hero"
    :class="{ 'hero--intro': playIntro }"
  >
    <div class="wrap hero__content">
      <div class="hero__body">
        <BaseHeading
          :level="1"
          size="hero"
          class="hero__head"
        >
          Зарабатывайте на рекламе <br><em>в MAX</em>
        </BaseHeading>
        <p class="hero__copy">
          Вы собираете вокруг себя людей.<br>Мы помогаем превратить это в
          заработок<br class="hero__desktop-break"> на рекламных размещениях.
        </p>
        <div class="hero__commission">
          <strong class="hero__commission-value">0%</strong>
          <span class="hero__commission-label">Комиссия<br>для авторов</span>
        </div>
        <div class="hero__actions">
          <BaseButton
            class="hero__button"
            @click="connectChannel"
          >
            Подключить мой канал
          </BaseButton><a
            class="hero__link"
            href="#how"
          >Посмотреть, как это работает ↗</a>
        </div>
      </div>
      <div
        class="hero__sculpture"
        role="img"
        aria-label="Знак Chanly, карточка канала, комиссия для авторов 0% и пример размещения на 3 000 рублей"
        @animationend.self="stopIntro"
      >
        <img
          class="hero__art hero__orbit"
          src="../assets/images/orbit.svg"
          alt=""
        ><img
          class="hero__art hero__emblem"
          src="../assets/images/emblem.svg"
          alt=""
        ><img
          class="hero__art hero__identity"
          src="../assets/images/identity.svg"
          alt=""
        ><img
          class="hero__art hero__receipt"
          src="../assets/images/receipt.svg"
          alt=""
        >
        <div class="hero__sticker">
          <strong class="hero__sticker-value">0%</strong>
          <span class="hero__sticker-label">Комиссия<br>для авторов</span>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped lang="scss">
@use '../assets/styles/tools' as styles;

.hero {
  padding: clamp(32px, 5vw, 80px) var(--gutter) 44px;

  &__content {
    display: grid;
    grid-template-columns: 1.125fr 1fr;
    align-items: center;
    gap: 28px;
  }

  &__copy {
    max-width: 590px;
    margin: 28px 0;
    color: #606458;
    font-size: clamp(17px, 1.4vw, 20px);
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 24px;
    flex-wrap: wrap;
    margin-top: 42px;
  }

  &__commission {
    display: flex;
    align-items: center;
    gap: 14px;
    min-height: 60px;
    margin: 28px 0;
  }

  &__commission-value {
    color: var(--accent);
    font: 700 44px/1.25 var(--font-heading);
  }

  &__commission-label { font-size: 14px; line-height: 1.4; }
  &__button { --button-width: 280px; }

  &__link {
    font-size: 14px;
    text-decoration: none;

    @include styles.hover {
      &:hover { text-decoration: underline; color: var(--accent-hover); }
    }
  }

  &__sculpture {
    position: relative;
    overflow: hidden;
    aspect-ratio: 604 / 580;
    border-radius: 24px;
    background: #ece9e1;
  }

  &__art { position: absolute; }
  &__orbit { inset: 0; width: 100%; }
  &__emblem { width: 61.26%; left: 14.39%; top: 18.6%; }
  &__identity { width: 38.1%; top: 4.8%; left: 5%; }
  &__receipt { width: 43%; left: 49.7%; top: 70.7%; }

  &__sticker {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    width: 30.46%;
    aspect-ratio: 184 / 100;
    left: 62.91%;
    top: 5.9%;
    border-radius: 24px;
    background: var(--highlight);
    color: var(--ink);
    text-align: center;
    transform: rotate(7deg);
  }

  &__sticker-value {
    font: 700 clamp(22px, 2.36vw, 34px)/1.12 var(--font-heading);
    letter-spacing: -.03em;
  }

  &__sticker-label {
    font-size: clamp(8px, .764vw, 11px);
    line-height: 1.25;
    font-weight: 500;
    letter-spacing: .09em;
    text-transform: uppercase;
  }

  @media (min-width: 48.001rem) {
    &__body { align-self: start; }
  }

  @include styles.mobile {
    padding: 20px var(--gutter);

    &__content { grid-template-columns: 1fr; gap: 20px; }
    &__copy { margin: 20px 0; line-height: 1.4; }
    &__actions { display: grid; gap: 20px; }
    &__commission { justify-content: center; margin: 20px 0; }
    &__sticker { width: 33.14%; left: 61.71%; aspect-ratio: 116 / 68; border-radius: 16px; gap: 2px; }
    &__sticker-value { font-size: 24px; }
    &__sticker-label { font-size: 8px; }
    &__desktop-break { display: none; }
    &__button { --button-font: 15px; --button-height: 45px; width: 100%; }
    &__sculpture { width: 100%; max-width: 100%; }
    &__link { text-align: center; }
  }

  @media (max-width: 567px) {
    &__head { font-size: clamp(45px, 6vw, 72px); }
  }

  @media (prefers-reduced-motion: no-preference) {
    &--intro &__body,
    &--intro &__sculpture {
      animation: arrive var(--reveal-time) var(--reveal-ease) backwards;
    }

    &--intro &__sculpture { animation-delay: var(--reveal-step); }
    &__emblem { animation: float 4s ease-in-out infinite alternate; }
    &--intro &__emblem { animation-delay: calc(var(--reveal-time) + var(--reveal-step)); }
  }
}

@keyframes arrive {
  from { opacity: 0; translate: 0 var(--reveal-rise); }
  to { opacity: 1; translate: 0 0; }
}

@keyframes float {
  from { transform: translateY(0); }
  to { transform: translateY(-18px); }
}
</style>
