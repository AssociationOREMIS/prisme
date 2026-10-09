<script setup lang="ts">
import { Check, Settings2 } from '@lucide/vue'
import { PrButton } from '../../atoms/Button'
import { PrDropdownMenu } from '../DropdownMenu'
import type { PrDataTableColumn } from './types'
import { usePrMessages } from '../../../i18n/context'

defineProps<{
  columns: PrDataTableColumn[]
  hiddenColumnKeys: Set<string>
}>()

const messages = usePrMessages()

const emit = defineEmits<{
  toggleColumn: [column: PrDataTableColumn, checked: boolean]
}>()
</script>

<template>
  <PrDropdownMenu :label="messages.dataTable.columns" align="end">
    <template #trigger>
      <PrButton class="pr-data-table__view-button pr:ml-auto pr:h-8" variant="secondary" size="sm">
        <Settings2 :size="16" aria-hidden="true" />
        {{ messages.dataTable.view }}
      </PrButton>
    </template>
    <template #default="{ checkboxItem, itemIndicator, checkboxItemClass }">
      <component
        :is="checkboxItem"
        v-for="column in columns.filter((column) => column.hideable !== false)"
        :key="column.key"
        :class="checkboxItemClass"
        :model-value="!hiddenColumnKeys.has(column.key)"
        @select.prevent
        @update:model-value="emit('toggleColumn', column, Boolean($event))"
      >
        <component :is="itemIndicator" class="pr:absolute pr:left-[var(--pr-space-3)] pr:inline-flex pr:text-[color:var(--pr-color-primary)]">
          <Check :size="14" aria-hidden="true" />
        </component>
        <span class="pr:capitalize">{{ column.label }}</span>
      </component>
    </template>
  </PrDropdownMenu>
</template>
