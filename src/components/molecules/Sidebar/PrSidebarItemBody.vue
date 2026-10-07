<script setup lang="ts">
import { computed } from 'vue'
import {
  sidebarItemDescriptionClass,
  sidebarItemLabelActiveClass,
  sidebarItemLabelBaseClass,
} from './sidebarItemStyles'

const props = defineProps<{
  label: string
  description?: string
  active?: boolean
}>()

const labelClass = computed(() => [
  sidebarItemLabelBaseClass,
  props.active ? sidebarItemLabelActiveClass : '',
])
</script>

<template>
  <span class="pr-sidebar-item__body pr:grid pr:min-w-0 pr:flex-auto pr:gap-0.5">
    <span :class="labelClass">
      {{ label }}
    </span>
    <span v-if="description" :class="sidebarItemDescriptionClass">{{ description }}</span>
  </span>
</template>
