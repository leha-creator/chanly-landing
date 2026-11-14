<script setup>
import { ref } from 'vue'
import BaseHeading from './BaseHeading.vue'

const key = 'chanly:cookie-notice-dismissed'
function previouslyDismissed() {
  try {
    return globalThis.localStorage.getItem(key) === '1'
  } catch {
    return false
  }
}
const visible = ref(!previouslyDismissed())
function accept() {
  visible.value = false
  try {
    globalThis.localStorage.setItem(key, '1')
  } catch {
    // При недоступном хранилище выбор действует на открытой странице.
  }
}
</script>
<template>
  <aside
    v-if="visible"
    class="cookie-notice"
    aria-label="Cookie и хранение данных"
  >
    <div class="cookie-notice__body">
      <BaseHeading
        class="cookie-notice__head"
        size="card"
      >
        Файлы cookie
      </BaseHeading>
      <p class="cookie-notice__copy">
        Мы используем файлы cookie для работы сайта. Если вы нажмёте «Отклонить», это сообщение появится снова при следующем посещении.
      </p>
    </div>
    <div class="cookie-notice__actions">
      <button
        type="button"
        class="cookie-notice__action cookie-notice__action--accept"
        @click="accept"
      >
        Принять
      </button>
      <button
        type="button"
        class="cookie-notice__action"
        @click="visible = false"
      >
        Отклонить
      </button>
    </div>
  </aside>
</template>
<style scoped lang="scss">
@use '../assets/styles/tools' as styles;

.cookie-notice {
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 18px;
  min-height: 184px;
  max-height: 55dvh;
  overflow: auto;
  padding: 24px;
  border-radius: 12px;
  background: #efede6;
  box-shadow: 0 4px 24px #20221f29, inset 0 0 0 1px var(--rule);
  color: var(--ink);

  &__head {
    font: 500 20px/26px var(--font-body);
    letter-spacing: normal;
  }

  &__copy {
    margin: 8px 0 0;
    color: #474941;
    font-size: 14px;
    line-height: 20px;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }

  &__action {
    min-height: 44px;
    padding: 0 20px;
    border-radius: 24px;
    border: 1px solid var(--rule);
    background: var(--white);
    color: var(--ink);
    font: 500 14px/1.4 var(--font-body);
    cursor: pointer;

    @include styles.hover {
      &:hover {
        background: #e3e2fc;
      }
    }

    &:active {
      background: #d2d1f8;
    }

    &--accept {
      color: var(--white);
      background: var(--ink);
      border-color: transparent;

      @include styles.hover {
        &:hover {
          background: var(--accent-hover);
        }
      }

      &:active {
        background: var(--accent-pressed);
      }
    }
  }

  @include styles.mobile {
    padding: 18px;
    min-height: min(224px, 55dvh);

    &__actions {
      gap: 6px;
    }

    &__action {
      padding-inline: 13px;
      flex-grow: 1;
    }
  }
}
</style>
