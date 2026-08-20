<script setup lang="ts">
import { computed, ref } from 'vue'
import { Search } from '@lucide/vue'

export interface PrCommandItem {
  label: string
  value: string
  description?: string
  disabled?: boolean
}

export interface PrCommandProps {
  items?: PrCommandItem[]
  placeholder?: string
  emptyText?: string
}

const props = withDefaults(defineProps<PrCommandProps>(), {
  items: () => [],
  placeholder: 'Rechercher',
  emptyText: 'Aucun resultat',
})

const emit = defineEmits<{
  select: [item: PrCommandItem]
}>()

const query = ref('')
const filteredItems = computed(() => {
  const value = query.value.trim().toLowerCase()
  if (!value) return props.items
  return props.items.filter((item) =>
    `${item.label} ${item.description ?? ''}`.toLowerCase().includes(value),
  )
})
</script>

<template>
  <div class="pr-command grid w-[min(26rem,100%)] overflow-hidden rounded-[var(--pr-radius-lg)] border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)] text-[color:var(--pr-color-text)]">
    <label class="pr-command__search flex items-center gap-[var(--pr-space-2)] border-b border-[var(--pr-color-border)] px-[var(--pr-space-3)] text-[color:var(--pr-color-text-muted)]">
      <Search :size="16" aria-hidden="true" />
      <input v-model="query" class="pr-command__input min-h-11 flex-auto border-0 bg-transparent font-[inherit] text-[length:var(--pr-font-size-sm)] text-[color:var(--pr-color-text)] placeholder:text-[color:var(--pr-color-text-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)]" :placeholder="placeholder">
    </label>
    <div class="pr-command__list grid max-h-72 overflow-y-auto p-[var(--pr-space-2)]" role="listbox">
      <button
        v-for="item in filteredItems"
        :key="item.value"
        class="pr-command__item grid cursor-pointer gap-[var(--pr-space-1)] rounded-[var(--pr-radius-md)] border-0 bg-transparent p-[var(--pr-space-3)] text-left text-[color:var(--pr-color-text)] hover:not-disabled:bg-[var(--pr-color-surface-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)] disabled:cursor-not-allowed disabled:opacity-[0.58]"
        type="button"
        role="option"
        :disabled="item.disabled"
        @click="emit('select', item)"
      >
        <span class="pr-command__item-label text-[length:var(--pr-font-size-sm)] font-bold leading-[var(--pr-line-height-tight)]">{{ item.label }}</span>
        <span v-if="item.description" class="pr-command__item-description text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-text-muted)]">{{ item.description }}</span>
      </button>
      <p v-if="filteredItems.length === 0" class="pr-command__empty m-0 p-[var(--pr-space-4)] text-center text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-text-muted)]">{{ emptyText }}</p>
    </div>
  </div>
</template>
