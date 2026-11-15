<script setup>
import { ref } from 'vue'

import BaseHeading from './BaseHeading.vue'
import { useSectionReveal } from '../composables/useSectionReveal.js'

useSectionReveal()

const opened = ref(0)

const questions = [
  {
    question: 'Кто может подключить канал?',
    answer: [
      {
        text: 'Самозанятые, ИП и юридические лица — владельцы MAX-каналов. Понадобятся данные владельца, реквизиты и подключение бота.',
      },
    ],
  },
  {
    question: 'Нужно ли публиковать пост вручную?',
    answer: [
      {
        text: 'Публикация проходит по согласованному расписанию. За статусом заказа можно следить в кабинете.',
      },
    ],
  },
  {
    question: 'Можно ли отказаться от рекламы?',
    answer: [
      {
        text: 'Конечно! Вы сами решаете, с кем сотрудничать. Перед принятием заказа вы можете ознакомиться с его условиями и отказаться, если предложение вам не подходит.',
      },
    ],
  },
  {
    question: 'Когда придёт выплата?',
    answer: [
      {
        text: 'После завершения размещения рекламодатель может принять работу или предъявить претензию в течение 24 часов. Если претензий нет, размещение принимается автоматически, и мы запускаем выплату. Самозанятые и ИП получают выплаты через Rocket Work, юридические лица — банковским переводом.',
      },
    ],
  },
  {
    question: 'Можно ли добавить несколько каналов?',
    answer: [
      {
        text: 'Да! Каналы доступны в разделе «Мои каналы». Для подключения каждого канала потребуется подтверждение.',
      },
    ],
  },
  {
    question: 'Как связаться с поддержкой?',
    answer: [
      {
        text: 'Мы всегда готовы помочь! Вы можете написать нам напрямую в ',
      },
      {
        text: 'Telegram',
        href: 'https://t.me/sup_chanly',
      },
      {
        text: ', либо оставить заявку через форму обратной связи на сайте. Расскажите, что произошло, и наша команда поможет разобраться.',
      },
    ],
  },
]
</script>

<template>
  <section
    id="faq"
    ref="section"
    class="faq slice"
  >
    <div class="faq__content wrap split">
      <BaseHeading
        italic
        class="faq__head"
        data-reveal
      >
        Как всё устроено?
      </BaseHeading>

      <div>
        <article
          v-for="(item, index) in questions"
          :key="item.question"
          class="faq__item"
          data-reveal
        >
          <BaseHeading
            :level="3"
            size="card"
            class="faq__question"
          >
            <button
              class="faq__toggle"
              type="button"
              :aria-expanded="opened === index"
              :aria-controls="'faq-answer-' + index"
              @click="opened = opened === index ? null : index"
            >
              {{ item.question }}

              <span
                class="faq__icon"
                aria-hidden="true"
              >
                {{ opened === index ? '−' : '+' }}
              </span>
            </button>
          </BaseHeading>

          <div
            :id="'faq-answer-' + index"
            class="faq__answer"
            :inert="opened !== index || undefined"
            :class="{ 'faq__answer--open': opened === index }"
          >
            <div class="faq__answer-body">
              <p class="faq__copy">
                <template
                  v-for="(part, partIndex) in item.answer"
                  :key="partIndex"
                >
                  <a
                    v-if="part.href"
                    :href="part.href"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {{ part.text }}
                  </a>

                  <template v-else>
                    {{ part.text }}
                  </template>
                </template>
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '../assets/styles/tools' as styles;

.faq {
  &__head {
    font-size: clamp(40px, 3.89vw, 56px);
  }

  &__item {
    padding: 0 0 2px;
    margin-bottom: 24px;
    border-bottom: 1px solid var(--rule);

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__question {
    font: 500 20px/1.5 var(--font-body);
    letter-spacing: normal;
  }

  &__toggle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    width: 100%;
    min-height: 44px;
    padding: 6px 0;
    background: transparent;
    color: inherit;
    border: 0;
    text-align: left;
    font: inherit;
    cursor: pointer;

    @include styles.hover {
      &:hover {
        color: var(--accent-hover);
      }
    }

    &:active {
      color: var(--accent-pressed);
    }

    &[aria-expanded=true] .faq__icon {
      background-image: url('../assets/images/faq-close.svg');
    }
  }

  &__icon {
    flex: 0 0 24px;
    height: 24px;
    font-size: 0;
    background: url('../assets/images/faq-plus.svg') center / contain no-repeat;
  }

  &__copy {
    color: #606458;
    margin: 2px 0 14px;
  }

  &__answer {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows var(--motion-fast) var(--ease);

    &--open {
      grid-template-rows: 1fr;
    }
  }

  &__answer-body {
    overflow: hidden;
    min-height: 0;
  }

  @media (min-width: 48.001rem) {
    &__content {
      grid-template-columns: 0.64fr 1fr;
    }
  }

  @include styles.mobile {
    &__head {
      font-size: 40px;
      line-height: 1.09;
    }

    &__question {
      font-size: 17px;
      line-height: 1.4;
    }

    &__content {
      gap: 20px;
    }

    &__item {
      padding: 8px 0 10px;
      margin-bottom: 0;
    }

    &__copy {
      margin: 0 0 12px;
      font-size: 15px;
      line-height: 1.4;
    }

    &__icon,
    &__toggle[aria-expanded=true] .faq__icon {
      background: none;
      font: 500 21px/24px var(--font-body);
    }
  }
}
</style>