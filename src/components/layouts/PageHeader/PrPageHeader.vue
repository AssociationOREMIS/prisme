<script setup lang="ts">
import { ArrowLeft } from '@lucide/vue'
import { PrTypography } from '../../atoms/Typography'
import { usePrMessages } from '../../../i18n/context'

export interface PrPageHeaderProps {
  /** Title of the page, its `h1` (or the `title` slot). */
  title?: string
  /** Line under the title (or the `description` slot). */
  description?: string
  /** Address of the link back above the title (the list, the volunteer's page...). */
  backHref?: string
  /** Text of the link back. */
  backLabel?: string
}

withDefaults(defineProps<PrPageHeaderProps>(), {
  title: undefined,
  description: undefined,
  backHref: undefined,
  backLabel: undefined,
})

const messages = usePrMessages()
</script>

<template>
  <!-- Link back, title and description on the left, actions on the right; the actions go below
       the title when there is no room. A div, not a <header>: outside <main> that would be a second
       banner landmark next to the navbar's. -->
  <div class="pr-page-header pr:grid pr:gap-[var(--pr-space-2)]">
    <a
      v-if="backHref"
      :href="backHref"
      class="pr-page-header__back pr:inline-flex pr:w-fit pr:items-center pr:gap-[var(--pr-space-1)] pr:rounded-[var(--pr-radius-sm)] pr:text-[length:var(--pr-font-size-sm)] pr:text-[color:var(--pr-color-text-muted)] pr:no-underline pr:hover:text-[color:var(--pr-color-text)] pr:hover:underline pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)]"
    >
      <ArrowLeft :size="16" aria-hidden="true" />
      {{ backLabel ?? messages.common.back }}
    </a>
    <div class="pr:flex pr:flex-wrap pr:items-start pr:justify-between pr:gap-[var(--pr-space-4)]">
      <div class="pr-page-header__heading pr:grid pr:min-w-0 pr:flex-[1_1_20rem] pr:gap-[var(--pr-space-2)]">
        <PrTypography variant="h1" class="pr-page-header__title">
          <slot name="title">{{ title }}</slot>
        </PrTypography>
        <div v-if="description || $slots.description" class="pr-page-header__description pr:text-[length:var(--pr-font-size-md)] pr:leading-[var(--pr-line-height-normal)] pr:text-[color:var(--pr-color-text-muted)]">
          <slot name="description">{{ description }}</slot>
        </div>
      </div>
      <div v-if="$slots.actions" class="pr-page-header__actions pr:flex pr:flex-wrap pr:items-center pr:gap-[var(--pr-space-2)]">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>
