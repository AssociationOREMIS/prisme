<script setup lang="ts">
import {
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'reka-ui'

export interface PrDropdownMenuProps {
  open?: boolean
  defaultOpen?: boolean
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  label?: string
}

withDefaults(defineProps<PrDropdownMenuProps>(), {
  open: undefined,
  defaultOpen: false,
  side: 'bottom',
  align: 'end',
  label: undefined,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()
</script>

<template>
  <DropdownMenuRoot
    :open="open"
    :default-open="defaultOpen"
    @update:open="emit('update:open', $event)"
  >
    <DropdownMenuTrigger as-child>
      <slot name="trigger" />
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent
        class="pr-dropdown-menu"
        :side="side"
        :align="align"
        :side-offset="8"
      >
        <DropdownMenuLabel v-if="label" class="pr-dropdown-menu__label">
          {{ label }}
        </DropdownMenuLabel>
        <slot
          :item="DropdownMenuItem"
          :separator="DropdownMenuSeparator"
        />
        <DropdownMenuArrow class="pr-dropdown-menu__arrow" :width="12" :height="6" />
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
