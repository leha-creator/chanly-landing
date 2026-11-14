<script setup>
import { onMounted, onUnmounted, ref, useId } from 'vue'

const props = defineProps({
  telegramUrl: { type: String, default: 'https://t.me/sup_chanly' },
  maxUrl: { type: String, default: '' },
})
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
onMounted(() => globalThis.document.addEventListener('pointerdown', close))
onUnmounted(() => globalThis.document.removeEventListener('pointerdown', close))
</script>

<template>
  <div
    ref="root"
    class="support"
    @keydown.esc.stop.prevent="escape"
    @focusout="leave"
  >
    <button
      ref="trigger"
      class="support__trigger"
      type="button"
      :aria-expanded="open"
      :aria-controls="menuId"
      @click="open = !open"
    >
      Поддержка
      <svg
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
    <ul
      v-if="open"
      :id="menuId"
      class="support__links"
      aria-label="Служба поддержки"
    >
      <li>
        <a
          class="support__link"
          :href="props.telegramUrl"
          target="_blank"
          rel="noopener noreferrer"
          @click="close()"
        >Telegram <span aria-hidden="true">↗</span></a>
      </li>
      <li>
        <a
          v-if="props.maxUrl"
          class="support__link"
          :href="props.maxUrl"
          target="_blank"
          rel="noopener noreferrer"
          @click="close()"
        >MAX <span aria-hidden="true">↗</span></a>
        <span
          v-else
          class="support__unavailable"
          aria-disabled="true"
        >MAX</span>
      </li>
    </ul>
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

  &__links {
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
    list-style: none;
    font-size: 14px;
  }

  &__link,
  &__unavailable {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 44px;
    padding: 10px 14px;
    border-radius: 8px;
    text-decoration: none;
  }

  &__unavailable {
    color: var(--placeholder);
  }

  &__link {
    &:focus-visible {
      outline-offset: -3px;
    }

    @include styles.hover {
      &:hover {
        background: var(--highlight);
      }
    }
  }
}
</style>
