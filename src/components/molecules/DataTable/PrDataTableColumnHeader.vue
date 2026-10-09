<script setup lang="ts">
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from '@lucide/vue'
import { PrButton } from '../../atoms/Button'
import { PrDropdownMenu } from '../DropdownMenu'
import type { PrDataTableColumn } from './types'
import { usePrMessages } from '../../../i18n/context'

defineProps<{
  column: PrDataTableColumn
  sortKey: string
  sortDirection: 'asc' | 'desc'
}>()

const messages = usePrMessages()

const emit = defineEmits<{
  sort: [column: PrDataTableColumn, direction: 'asc' | 'desc']
  hide: [column: PrDataTableColumn]
}>()
</script>

<template>
  <PrDropdownMenu v-if="column.sortable || column.hideable !== false" align="start">
    <template #trigger>
      <PrButton class="pr:-ml-3 pr:h-8" variant="ghost" size="sm">
        <span>{{ column.label }}</span>
        <ArrowDown v-if="sortKey === column.key && sortDirection === 'desc'" :size="16" aria-hidden="true" />
        <ArrowUp v-else-if="sortKey === column.key" :size="16" aria-hidden="true" />
        <ChevronsUpDown v-else-if="column.sortable" :size="16" aria-hidden="true" />
      </PrButton>
    </template>
    <template #default="{ item, separator, itemClass, separatorClass }">
      <component :is="item" v-if="column.sortable" :class="itemClass" @click="emit('sort', column, 'asc')">
        <ArrowUp :size="14" aria-hidden="true" />
        {{ messages.dataTable.sortAscending }}
      </component>
      <component :is="item" v-if="column.sortable" :class="itemClass" @click="emit('sort', column, 'desc')">
        <ArrowDown :size="14" aria-hidden="true" />
        {{ messages.dataTable.sortDescending }}
      </component>
      <component :is="separator" v-if="column.sortable && column.hideable !== false" :class="separatorClass" />
      <component :is="item" v-if="column.hideable !== false" :class="itemClass" @click="emit('hide', column)">
        <EyeOff :size="14" aria-hidden="true" />
        {{ messages.dataTable.hideColumn }}
      </component>
    </template>
  </PrDropdownMenu>
  <span v-else>{{ column.label }}</span>
</template>
