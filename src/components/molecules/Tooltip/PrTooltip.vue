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
        <TooltipContent
          class="pr-tooltip z-[70] rounded-[var(--pr-radius-md)] bg-[var(--pr-neutral-900)] px-[var(--pr-space-2)] py-[var(--pr-space-1)] text-[length:var(--pr-font-size-xs)] font-semibold leading-[var(--pr-line-height-tight)] text-[color:var(--pr-neutral-0)] shadow-[var(--pr-shadow-sm)] data-[state=delayed-open]:animate-[pr-floating-in_var(--pr-duration-fast)_var(--pr-ease-standard)] data-[state=instant-open]:animate-[pr-floating-in_var(--pr-duration-fast)_var(--pr-ease-standard)] data-[state=closed]:animate-[pr-floating-out_var(--pr-duration-fast)_var(--pr-ease-standard)] data-[side=top]:origin-bottom data-[side=right]:origin-left data-[side=bottom]:origin-top data-[side=left]:origin-right"
          :side="side"
          :align="align"
          :side-offset="8"
        >
          <slot name="content">
            {{ content }}
          </slot>
          <TooltipArrow class="pr-tooltip__arrow fill-current" :width="10" :height="5" />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>
