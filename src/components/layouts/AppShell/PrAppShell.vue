<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { prAppShellContextKey } from './appShellContext'

export interface PrAppShellProps {
  collapsed?: boolean
  defaultCollapsed?: boolean
}

const props = withDefaults(defineProps<PrAppShellProps>(), {
  collapsed: undefined,
  defaultCollapsed: false,
})

const emit = defineEmits<{
  'update:collapsed': [value: boolean]
}>()

const internalCollapsed = ref(props.defaultCollapsed)

const collapsed = computed({
  get: () => props.collapsed ?? internalCollapsed.value,
  set: (value) => {
    internalCollapsed.value = value
    emit('update:collapsed', value)
  },
})

function setCollapsed(value: boolean) {
  collapsed.value = value
}

function toggleCollapsed() {
  collapsed.value = !collapsed.value
}

provide(prAppShellContextKey, {
  collapsed,
  toggleCollapsed,
  setCollapsed,
})
</script>

<template>
  <div
    class="pr-app-shell pr-shell-grid bg-[var(--pr-color-surface-subtle)] text-[color:var(--pr-color-text)]"
    :data-sidebar-collapsed="collapsed ? 'true' : 'false'"
  >
    <slot name="navbar" />

    <slot name="sidebar" />

    <main class="pr-app-shell__content pr-shell-grid__content">
      <slot />
    </main>
  </div>
</template>
