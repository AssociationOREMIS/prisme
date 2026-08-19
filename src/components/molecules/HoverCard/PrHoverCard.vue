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
      <HoverCardContent class="pr-hover-card" :side="side" :align="align" :side-offset="8">
        <slot />
        <HoverCardArrow class="pr-hover-card__arrow" :width="12" :height="6" />
      </HoverCardContent>
    </HoverCardPortal>
  </HoverCardRoot>
</template>
