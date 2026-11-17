<script setup>
import { computed, onMounted, onUnmounted, ref, useId } from 'vue'
import { supportLinks, validSupportUrl } from '../data/support.js'

const props = defineProps({
  telegramUrl: { type: String, default: supportLinks.telegram },
  maxUrl: { type: String, default: supportLinks.max },
  floating: Boolean,
})
const channels = computed(() => [
  { name: 'Telegram', url: validSupportUrl(props.telegramUrl), icon: 'M20.8 4.1 17.7 19c-.2 1.1-.8 1.4-1.7.9l-4.7-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.4-4.8 8.8-8c.4-.3-.1-.5-.6-.2L5.8 13 1.2 11.5c-1-.3-1-1 .2-1.4L19.3 3.2c.8-.3 1.6.2 1.5.9Z' },
  { name: 'MAX', url: validSupportUrl(props.maxUrl), icon: 'M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.4A10 10 0 1 0 12 2Zm0 5a5 5 0 0 1 5 5v4h-4a5 5 0 1 1-1-9Z' },
])
const open = ref(false)
const root = ref(null)
const trigger = ref(null)
const menuId = useId()

function close(event) {
  if (event && root.value?.contains(event.target)) return
  open.value = false
}
function escape() {
  open.value = false
  trigger.value?.focus()
}
function leave(event) {
  if (!root.value?.contains(event.relatedTarget)) open.value = false
}
function resize() {
  open.value = false
}
onMounted(() => {
  globalThis.document.addEventListener('pointerdown', close)
  globalThis.addEventListener('resize', resize)
})
onUnmounted(() => {
  globalThis.document.removeEventListener('pointerdown', close)
  globalThis.removeEventListener('resize', resize)
})
</script>

<template>
  <div
    ref="root"
    class="support"
    :class="{ 'support--floating': floating }"
    @keydown.esc.stop.prevent="escape"
    @focusout="leave"
  >
    <button
      ref="trigger"
      class="support__trigger"
      type="button"
      :aria-expanded="open"
      :aria-controls="menuId"
      :aria-label="floating ? 'Поддержка' : undefined"
      :title="floating ? (open ? 'Закрыть поддержку' : 'Поддержка') : undefined"
      @click="open = !open"
    >
      <svg
        v-if="floating"
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path
          v-if="open"
          d="m6 6 12 12M18 6 6 18"
        />
        <template v-else>
          <path d="M4 13v-2a8 8 0 0 1 16 0v2M20 16v1a4 4 0 0 1-4 4h-3" />
          <rect
            x="3"
            y="10"
            width="4"
            height="7"
            rx="2"
          />
          <rect
            x="17"
            y="10"
            width="4"
            height="7"
            rx="2"
          />
        </template>
      </svg>
      <template v-else>
        Поддержка
      </template>
      <svg
        v-if="!floating"
        class="support__chevron"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden="true"
        :class="{ 'support__chevron--expanded': open }"
      >
        <path
          d="m3 4.5 3 3 3-3"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
    <div
      v-if="open"
      :id="menuId"
      class="support__popup"
      data-lenis-prevent
    >
      <div
        v-if="floating"
        class="support__header"
      >
        <h2 class="support__title">
          Мы на связи
        </h2>
        <p class="support__description">
          Выберите удобный мессенджер для связи с поддержкой
        </p>
      </div>
      <ul
        class="support__links"
        aria-label="Связаться с поддержкой"
      >
        <li
          v-for="channel in channels"
          :key="channel.name"
        >
          <component
            :is="channel.url ? 'a' : 'span'"
            class="support__link"
            :href="channel.url || undefined"
            :target="channel.url ? '_blank' : undefined"
            :rel="channel.url ? 'noopener noreferrer' : undefined"
            :role="channel.url ? undefined : 'group'"
            :aria-disabled="channel.url ? undefined : true"
            :aria-label="channel.url ? channel.name : `${channel.name} — ссылка пока недоступна`"
            @click="channel.url && close()"
          >
            <span
              v-if="floating"
              class="support__brand"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  :d="channel.icon"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            <span class="support__text">
              <span class="support__name">{{ channel.name }}</span>
              <span
                v-if="floating"
                class="support__hint"
              >{{ channel.url ? 'Написать в поддержку' : 'Ссылка пока недоступна' }}</span>
            </span>
            <span
              v-if="channel.url"
              class="support__arrow"
              aria-hidden="true"
            >↗</span>
          </component>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../assets/styles/tools' as styles;

.support {
  position: relative;

  &__trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 44px;
    padding: 0;
    border: 0;
    background: none;
    color: var(--ink);
    font: inherit;
    cursor: pointer;

    @include styles.hover {
      &:hover {
        color: var(--accent);
      }
    }

    @include styles.mobile {
      width: 100%;
      font-size: 13px;
    }
  }

  &__chevron {
    flex: none;
    transition: transform var(--motion-fast);

    &--expanded {
      transform: rotate(180deg);
    }
  }

  &__popup {
    position: absolute;
    z-index: 1;
    top: calc(100% + 8px);
    right: 0;
    width: 200px;
    margin: 0;
    padding: 6px;
    border: 1px solid var(--rule);
    border-radius: 14px;
    background: var(--paper);
    box-shadow: 0 12px 32px #20221f1a;
    font-size: 14px;
  }

  &__links {
    display: grid;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 44px;
    padding: 10px 14px;
    border-radius: 8px;
    text-decoration: none;
  }

  &__link[aria-disabled='true'] {
    color: var(--placeholder);
  }

  a.support__link {
    &:focus-visible {
      outline-offset: -3px;
    }

    @include styles.hover {
      &:hover {
        background: var(--highlight);
      }
    }
  }

  &--floating {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 12px;
    min-width: 0;
    pointer-events: auto;
  }

  &--floating &__trigger {
    flex: none;
    width: 56px;
    height: 56px;
    border: 1px solid var(--on-accent);
    border-radius: 50%;
    background: var(--accent);
    color: var(--white);
    box-shadow: 0 4px 20px #20221f26;

    @include styles.hover {
      &:hover { background: var(--accent-hover); }
    }

    &:active { background: var(--accent-pressed); }
  }

  &--floating &__popup {
    position: relative;
    top: auto;
    order: -1;
    width: min(320px, calc(100vw - 24px));
    max-height: var(--support-panel-height, calc(100dvh - 112px));
    overflow: auto;
    overscroll-behavior: contain;
    padding: 20px;
    border-radius: 20px;
    animation: support-appear var(--motion-fast) ease-out;
  }

  &__header { margin-bottom: 20px; }
  &__title { font: 600 24px/1.25 var(--font-heading); }
  &__description { margin: 8px 0 0; font-size: 14px; line-height: 1.5; }

  &--floating &__link {
    justify-content: flex-start;
    gap: 12px;
    min-height: 76px;
    padding: 12px;
    border: 1px solid var(--rule);
    border-radius: 12px;
    background: var(--white);

    &[aria-disabled='true'] { color: #606258; background: transparent; }

    @include styles.hover {
      &[href]:hover { background: var(--highlight); border-color: var(--ink); }
    }
  }

  &__brand {
    display: grid;
    flex: none;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: var(--highlight);
    color: var(--ink);
  }

  &__text { flex: 1; display: grid; gap: 4px; }
  &--floating &__name { font-weight: 600; }
  &__hint { font-size: 12px; line-height: 1.4; }
  &__arrow { flex: none; }

  @include styles.reduced-motion {
    &--floating &__popup { animation: none; }
  }
}

@keyframes support-appear {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
