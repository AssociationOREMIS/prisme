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
  <div class="pr-command">
    <label class="pr-command__search">
      <Search :size="16" aria-hidden="true" />
      <input v-model="query" class="pr-command__input" :placeholder="placeholder">
    </label>
    <div class="pr-command__list" role="listbox">
      <button
        v-for="item in filteredItems"
        :key="item.value"
        class="pr-command__item"
        type="button"
        role="option"
        :disabled="item.disabled"
        @click="emit('select', item)"
      >
        <span class="pr-command__item-label">{{ item.label }}</span>
        <span v-if="item.description" class="pr-command__item-description">{{ item.description }}</span>
      </button>
      <p v-if="filteredItems.length === 0" class="pr-command__empty">{{ emptyText }}</p>
    </div>
  </div>
</template>
