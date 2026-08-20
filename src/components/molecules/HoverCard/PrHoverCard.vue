<script setup lang="ts">
import {
  HoverCardArrow,
  HoverCardContent,
  HoverCardPortal,
  HoverCardRoot,
  HoverCardTrigger,
} from 'reka-ui'

export interface PrHoverCardProps {
  openDelay?: number
  closeDelay?: number
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
}

withDefaults(defineProps<PrHoverCardProps>(), {
  openDelay: 250,
  closeDelay: 150,
  side: 'top',
  align: 'center',
})
</script>

<template>
  <HoverCardRoot :open-delay="openDelay" :close-delay="closeDelay">
    <HoverCardTrigger as-child>
      <slot name="trigger" />
    </HoverCardTrigger>
    <HoverCardPortal>
      <HoverCardContent
        class="pr-hover-card z-[70] w-[min(20rem,calc(100vw-var(--pr-space-6)))] rounded-[var(--pr-radius-lg)] border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)] p-[var(--pr-space-4)] text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-normal)] text-[color:var(--pr-color-text)] shadow-[var(--pr-shadow-md)] origin-[var(--reka-hover-card-content-transform-origin)] data-[state=open]:animate-[pr-floating-in_var(--pr-duration-fast)_var(--pr-ease-standard)] data-[state=closed]:animate-[pr-floating-out_var(--pr-duration-fast)_var(--pr-ease-standard)] data-[side=top]:origin-bottom data-[side=right]:origin-left data-[side=bottom]:origin-top data-[side=left]:origin-right"
        :side="side"
        :align="align"
        :side-offset="8"
      >
        <slot />
        <HoverCardArrow class="pr-hover-card__arrow fill-[var(--pr-color-surface)]" :width="12" :height="6" />
      </HoverCardContent>
    </HoverCardPortal>
  </HoverCardRoot>
</template>
