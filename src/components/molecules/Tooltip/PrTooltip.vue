<script setup lang="ts">
import {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from 'reka-ui'

export interface PrTooltipProps {
  content?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  delayDuration?: number
  disabled?: boolean
}

withDefaults(defineProps<PrTooltipProps>(), {
  content: undefined,
  side: 'top',
  align: 'center',
  delayDuration: 250,
  disabled: false,
})
</script>

<template>
  <TooltipProvider :delay-duration="delayDuration">
    <TooltipRoot :disabled="disabled">
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipPortal>
        <!-- collision-padding: keeps 8 px between the popup and the edges of a phone screen instead of touching them; the available-width/height variables of reka-ui cap it to the room left. -->
        <TooltipContent
          class="pr-tooltip pr:z-[95] pr:max-w-[min(20rem,var(--reka-tooltip-content-available-width))] pr:[overflow-wrap:anywhere] pr:rounded-[var(--pr-radius-md)] pr:bg-[var(--pr-neutral-900)] pr:px-[var(--pr-space-2)] pr:py-[var(--pr-space-1)] pr:text-[length:var(--pr-font-size-xs)] pr:font-semibold pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-neutral-0)] pr:shadow-[var(--pr-shadow-sm)] pr:data-[state=delayed-open]:animate-[pr-floating-in_var(--pr-duration-fast)_var(--pr-ease-standard)] pr:data-[state=instant-open]:animate-[pr-floating-in_var(--pr-duration-fast)_var(--pr-ease-standard)] pr:data-[state=closed]:animate-[pr-floating-out_var(--pr-duration-fast)_var(--pr-ease-standard)] pr:data-[side=top]:origin-bottom pr:data-[side=right]:origin-left pr:data-[side=bottom]:origin-top pr:data-[side=left]:origin-right"
          :side="side"
          :align="align"
          :side-offset="8"
          :collision-padding="8"
        >
          <slot name="content">
            {{ content }}
          </slot>
          <TooltipArrow class="pr-tooltip__arrow pr:fill-current" :width="10" :height="5" aria-hidden="true" />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>
