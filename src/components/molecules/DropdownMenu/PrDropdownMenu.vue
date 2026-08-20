<script setup lang="ts">
import {
  DropdownMenuArrow,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemIndicator,
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

const itemClass = 'pr-dropdown-menu__item flex min-h-9 cursor-pointer items-center gap-[var(--pr-space-2)] rounded-[var(--pr-radius-md)] px-[var(--pr-space-3)] text-[length:var(--pr-font-size-sm)] font-semibold leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-text)] outline-none data-[highlighted]:bg-[var(--pr-color-surface-subtle)] data-[disabled]:cursor-not-allowed data-[disabled]:text-[color:var(--pr-color-text-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)]'
const checkboxItemClass = 'pr-dropdown-menu__checkbox-item relative flex min-h-9 cursor-pointer items-center gap-[var(--pr-space-2)] rounded-[var(--pr-radius-md)] py-0 pr-[var(--pr-space-3)] pl-[var(--pr-space-8)] text-[length:var(--pr-font-size-sm)] font-semibold leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-text)] outline-none data-[highlighted]:bg-[var(--pr-color-surface-subtle)] data-[disabled]:cursor-not-allowed data-[disabled]:text-[color:var(--pr-color-text-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)]'
const dangerItemClass = `${itemClass} pr-dropdown-menu__item--danger text-[color:var(--pr-color-danger)] data-[highlighted]:bg-[var(--pr-color-danger-soft)]`
const separatorClass = 'pr-dropdown-menu__separator my-[var(--pr-space-1)] h-px bg-[var(--pr-color-border)]'
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
        class="pr-dropdown-menu z-[70] min-w-[12rem] rounded-[var(--pr-radius-lg)] border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)] p-[var(--pr-space-2)] text-[color:var(--pr-color-text)] shadow-[var(--pr-shadow-md)] data-[state=open]:animate-[pr-floating-in_var(--pr-duration-fast)_var(--pr-ease-standard)] data-[state=closed]:animate-[pr-floating-out_var(--pr-duration-fast)_var(--pr-ease-standard)] data-[side=top]:origin-bottom data-[side=right]:origin-left data-[side=bottom]:origin-top data-[side=left]:origin-right"
        :side="side"
        :align="align"
        :side-offset="8"
      >
        <DropdownMenuLabel v-if="label" class="pr-dropdown-menu__label px-[var(--pr-space-3)] py-[var(--pr-space-2)] text-[length:var(--pr-font-size-xs)] font-[750] uppercase tracking-[0.04em] text-[color:var(--pr-color-text-muted)]">
          {{ label }}
        </DropdownMenuLabel>
        <slot
          :item="DropdownMenuItem"
          :checkbox-item="DropdownMenuCheckboxItem"
          :item-indicator="DropdownMenuItemIndicator"
          :separator="DropdownMenuSeparator"
          :item-class="itemClass"
          :checkbox-item-class="checkboxItemClass"
          :danger-item-class="dangerItemClass"
          :separator-class="separatorClass"
        />
        <DropdownMenuArrow class="pr-dropdown-menu__arrow fill-[var(--pr-color-surface)]" :width="12" :height="6" />
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
