<script setup lang="ts">
import { ChevronDown } from '@lucide/vue'
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from 'reka-ui'

export interface PrCollapsibleProps {
  open?: boolean
  defaultOpen?: boolean
  title?: string
  disabled?: boolean
}

withDefaults(defineProps<PrCollapsibleProps>(), {
  open: undefined,
  defaultOpen: false,
  title: undefined,
  disabled: false,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()
</script>

<template>
  <CollapsibleRoot
    class="pr-collapsible"
    :open="open"
    :default-open="defaultOpen"
    :disabled="disabled"
    @update:open="emit('update:open', $event)"
  >
    <CollapsibleTrigger class="pr-collapsible__trigger">
      <slot name="trigger">
        {{ title }}
        <ChevronDown class="pr-collapsible__icon" :size="16" aria-hidden="true" />
      </slot>
    </CollapsibleTrigger>
    <CollapsibleContent class="pr-collapsible__content">
      <div class="pr-collapsible__content-inner">
        <slot />
      </div>
    </CollapsibleContent>
  </CollapsibleRoot>
</template>
