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

const itemClass = 'pr-dropdown-menu__item pr:flex pr:min-h-9 pr:cursor-pointer pr:items-center pr:gap-[var(--pr-space-2)] pr:rounded-[var(--pr-radius-md)] pr:px-[var(--pr-space-3)] pr:text-[length:var(--pr-font-size-sm)] pr:font-semibold pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text)] pr:outline-none pr:data-[highlighted]:bg-[var(--pr-color-surface-subtle)] pr:data-[disabled]:cursor-not-allowed pr:data-[disabled]:text-[color:var(--pr-color-text-subtle)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)]'
const checkboxItemClass = 'pr-dropdown-menu__checkbox-item pr:relative pr:flex pr:min-h-9 pr:cursor-pointer pr:items-center pr:gap-[var(--pr-space-2)] pr:rounded-[var(--pr-radius-md)] pr:py-0 pr:pr-[var(--pr-space-3)] pr:pl-[var(--pr-space-8)] pr:text-[length:var(--pr-font-size-sm)] pr:font-semibold pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text)] pr:outline-none pr:data-[highlighted]:bg-[var(--pr-color-surface-subtle)] pr:data-[disabled]:cursor-not-allowed pr:data-[disabled]:text-[color:var(--pr-color-text-subtle)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)]'
const dangerItemClass = `${itemClass} pr-dropdown-menu__item--danger pr:text-[color:var(--pr-color-danger)]! pr:data-[highlighted]:bg-[var(--pr-color-danger-soft)]`
const separatorClass = 'pr-dropdown-menu__separator pr:my-[var(--pr-space-1)] pr:h-px pr:bg-[var(--pr-color-border)]'
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
        class="pr-dropdown-menu pr:z-[95] pr:min-w-[12rem] pr:rounded-[var(--pr-radius-lg)] pr:border pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface)] pr:p-[var(--pr-space-2)] pr:text-[color:var(--pr-color-text)] pr:shadow-[var(--pr-shadow-md)] pr:data-[state=open]:animate-[pr-floating-in_var(--pr-duration-fast)_var(--pr-ease-standard)] pr:data-[state=closed]:animate-[pr-floating-out_var(--pr-duration-fast)_var(--pr-ease-standard)] pr:data-[side=top]:origin-bottom pr:data-[side=right]:origin-left pr:data-[side=bottom]:origin-top pr:data-[side=left]:origin-right"
        :side="side"
        :align="align"
        :side-offset="8"
      >
        <DropdownMenuLabel v-if="label" class="pr-dropdown-menu__label pr:px-[var(--pr-space-3)] pr:py-[var(--pr-space-2)] pr:text-[length:var(--pr-font-size-xs)] pr:font-[750] pr:uppercase pr:tracking-[0.04em] pr:text-[color:var(--pr-color-text-muted)]">
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
        <DropdownMenuArrow class="pr-dropdown-menu__arrow pr:fill-[var(--pr-color-surface)]" :width="12" :height="6" />
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
