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
const previousBodyOverflow = ref('')

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
  if (isOpen) {
    previousBodyOverflow.value = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return
  }

  document.body.style.overflow = previousBodyOverflow.value
})

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = previousBodyOverflow.value
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
    class="pr-app-shell group/app-shell grid min-h-[100svh] grid-cols-[var(--pr-sidebar-width)_minmax(0,1fr)] grid-rows-[var(--pr-navbar-height)_minmax(0,1fr)] bg-[var(--pr-color-background)] text-[color:var(--pr-color-text)] transition-[grid-template-columns] duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)] data-[sidebar-collapsed=true]:grid-cols-[var(--pr-sidebar-collapsed-width)_minmax(0,1fr)] max-[780px]:grid-cols-[minmax(0,1fr)] max-[780px]:data-[sidebar-collapsed=true]:grid-cols-[minmax(0,1fr)]"
    :data-sidebar-collapsed="collapsed ? 'true' : 'false'"
    :data-mobile-open="mobileOpen ? 'true' : 'false'"
  >
    <slot name="navbar" />

    <button
      v-if="mobileOpen"
      class="pr-app-shell__backdrop fixed inset-[var(--pr-navbar-height)_0_0] z-[30] cursor-pointer bg-[var(--pr-color-overlay)]"
      type="button"
      aria-label="Fermer la navigation"
      @click="closeMobile"
    />

    <slot name="sidebar" />

    <main class="pr-app-shell__content col-[2] row-[2] min-h-[calc(100svh-var(--pr-navbar-height))] min-w-0 p-[var(--pr-space-6)] lg:p-[var(--pr-space-8)] max-[780px]:col-[1] max-[780px]:p-[var(--pr-space-4)]">
      <slot />
    </main>
  </div>
</template>
