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
        class="pr-hover-card pr:z-[95] pr:w-[min(20rem,calc(100vw-var(--pr-space-6)))] pr:rounded-[var(--pr-radius-lg)] pr:border pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface)] pr:p-[var(--pr-space-4)] pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-normal)] pr:text-[color:var(--pr-color-text)] pr:shadow-[var(--pr-shadow-md)] pr:origin-[var(--reka-hover-card-content-transform-origin)] pr:data-[state=open]:animate-[pr-floating-in_var(--pr-duration-fast)_var(--pr-ease-standard)] pr:data-[state=closed]:animate-[pr-floating-out_var(--pr-duration-fast)_var(--pr-ease-standard)] pr:data-[side=top]:origin-bottom pr:data-[side=right]:origin-left pr:data-[side=bottom]:origin-top pr:data-[side=left]:origin-right"
        :side="side"
        :align="align"
        :side-offset="8"
      >
        <slot />
        <HoverCardArrow class="pr-hover-card__arrow pr:fill-[var(--pr-color-surface)]" :width="12" :height="6" />
      </HoverCardContent>
    </HoverCardPortal>
  </HoverCardRoot>
</template>
