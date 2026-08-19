<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue'
import { prAppShellContextKey } from './appShellContext'

export interface PrAppShellProps {
  collapsed?: boolean
  defaultCollapsed?: boolean
  mobileOpen?: boolean
}

const props = withDefaults(defineProps<PrAppShellProps>(), {
  collapsed: undefined,
  defaultCollapsed: false,
  mobileOpen: undefined,
})

const emit = defineEmits<{
  'update:collapsed': [value: boolean]
  'update:mobileOpen': [value: boolean]
}>()

const internalCollapsed = ref(props.defaultCollapsed)
const internalMobileOpen = ref(false)

const collapsed = computed({
  get: () => props.collapsed ?? internalCollapsed.value,
  set: (value) => {
    internalCollapsed.value = value
    emit('update:collapsed', value)
  },
})

const mobileOpen = computed({
  get: () => props.mobileOpen ?? internalMobileOpen.value,
  set: (value) => {
    internalMobileOpen.value = value
    emit('update:mobileOpen', value)
  },
})

function setCollapsed(value: boolean) {
  collapsed.value = value
}

function toggleCollapsed() {
  collapsed.value = !collapsed.value
}

function openMobile() {
  mobileOpen.value = true
}

function closeMobile() {
  mobileOpen.value = false
}

function toggleMobile() {
  mobileOpen.value = !mobileOpen.value
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeMobile()
  }
}

watch(mobileOpen, (isOpen) => {
  document.body.classList.toggle('pr-app-shell-mobile-open', isOpen)
})

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.classList.remove('pr-app-shell-mobile-open')
})

provide(prAppShellContextKey, {
  collapsed,
  mobileOpen,
  toggleCollapsed,
  setCollapsed,
  openMobile,
  closeMobile,
  toggleMobile,
})
</script>

<template>
  <div
    class="pr-app-shell"
    :data-sidebar-collapsed="collapsed ? 'true' : 'false'"
    :data-mobile-open="mobileOpen ? 'true' : 'false'"
  >
    <slot name="navbar" />

    <button
      v-if="mobileOpen"
      class="pr-app-shell__backdrop"
      type="button"
      aria-label="Fermer la navigation"
      @click="closeMobile"
    />

    <slot name="sidebar" />

    <main class="pr-app-shell__content">
      <slot />
    </main>
  </div>
</template>
