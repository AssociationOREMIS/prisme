<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
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

const generatedId = useId()
const listId = computed(() => `pr-command-${generatedId}-list`)
function itemId(item: PrCommandItem) {
  return `pr-command-${generatedId}-option-${item.value}`
}

const highlightedIndex = ref(-1)
const activeDescendant = computed(() => {
  const item = filteredItems.value[highlightedIndex.value]
  return item ? itemId(item) : undefined
})

function enabledIndices() {
  const indices: number[] = []
  filteredItems.value.forEach((item, index) => { if (!item.disabled) indices.push(index) })
  return indices
}

function highlightFirst() {
  highlightedIndex.value = enabledIndices()[0] ?? -1
}

function highlightLast() {
  const indices = enabledIndices()
  highlightedIndex.value = indices[indices.length - 1] ?? -1
}

function highlightStep(step: 1 | -1) {
  const indices = enabledIndices()
  if (indices.length === 0) {
    highlightedIndex.value = -1
    return
  }
  const currentPos = indices.indexOf(highlightedIndex.value)
  const nextPos = currentPos === -1
    ? (step === 1 ? 0 : indices.length - 1)
    : (currentPos + step + indices.length) % indices.length
  highlightedIndex.value = indices[nextPos]
}

// Re-highlight the first result whenever the filtered list changes (typing,
// or the `items` prop itself), so keyboard users always have a sane default.
watch(filteredItems, highlightFirst, { immediate: true })

function selectHighlighted() {
  const item = filteredItems.value[highlightedIndex.value]
  if (item && !item.disabled) emit('select', item)
}

function onKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      highlightStep(1)
      break
    case 'ArrowUp':
      event.preventDefault()
      highlightStep(-1)
      break
    case 'Home':
      event.preventDefault()
      highlightFirst()
      break
    case 'End':
      event.preventDefault()
      highlightLast()
      break
    case 'Enter':
      event.preventDefault()
      selectHighlighted()
      break
  }
}
</script>

<template>
  <div class="pr-command grid w-[min(26rem,100%)] overflow-hidden rounded-[var(--pr-radius-lg)] border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)] text-[color:var(--pr-color-text)]">
    <label class="pr-command__search flex items-center gap-[var(--pr-space-2)] border-b border-[var(--pr-color-border)] px-[var(--pr-space-3)] text-[color:var(--pr-color-text-muted)]">
      <Search :size="16" aria-hidden="true" />
      <input
        v-model="query"
        class="pr-command__input min-h-11 flex-auto border-0 bg-transparent font-[inherit] text-[length:var(--pr-font-size-sm)] text-[color:var(--pr-color-text)] placeholder:text-[color:var(--pr-color-text-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)]"
        :placeholder="placeholder"
        role="combobox"
        aria-autocomplete="list"
        :aria-expanded="true"
        :aria-controls="listId"
        :aria-activedescendant="activeDescendant"
        @keydown="onKeydown"
      >
    </label>
    <div :id="listId" class="pr-command__list grid max-h-72 overflow-y-auto p-[var(--pr-space-2)]" role="listbox">
      <button
        v-for="(item, index) in filteredItems"
        :id="itemId(item)"
        :key="item.value"
        class="pr-command__item grid cursor-pointer gap-[var(--pr-space-1)] rounded-[var(--pr-radius-md)] border-0 bg-transparent p-[var(--pr-space-3)] text-left text-[color:var(--pr-color-text)] hover:not-disabled:bg-[var(--pr-color-surface-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)] disabled:cursor-not-allowed disabled:opacity-[0.58]"
        :class="{ 'bg-[var(--pr-color-surface-subtle)]': index === highlightedIndex }"
        type="button"
        role="option"
        :aria-selected="index === highlightedIndex ? 'true' : undefined"
        :disabled="item.disabled"
        @mouseenter="!item.disabled && (highlightedIndex = index)"
        @click="emit('select', item)"
      >
        <span class="pr-command__item-label text-[length:var(--pr-font-size-sm)] font-bold leading-[var(--pr-line-height-tight)]">{{ item.label }}</span>
        <span v-if="item.description" class="pr-command__item-description text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-text-muted)]">{{ item.description }}</span>
      </button>
      <p v-if="filteredItems.length === 0" class="pr-command__empty m-0 p-[var(--pr-space-4)] text-center text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-text-muted)]">{{ emptyText }}</p>
    </div>
  </div>
</template>
