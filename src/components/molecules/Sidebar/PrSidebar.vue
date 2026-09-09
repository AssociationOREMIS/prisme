<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, provide, ref } from 'vue'
import { prAppShellContextKey } from '../../layouts/AppShell/appShellContext'
import PrSidebarCollapseButton from './PrSidebarCollapseButton.vue'
import { prSidebarContextKey } from './sidebarContext'

export interface PrSidebarProps {
  label?: string
  collapsible?: boolean
  collapsed?: boolean
  defaultCollapsed?: boolean
}

const props = withDefaults(defineProps<PrSidebarProps>(), {
  label: 'Navigation principale',
  collapsible: true,
  collapsed: undefined,
  defaultCollapsed: undefined,
})

const emit = defineEmits<{
  'update:collapsed': [value: boolean]
}>()

const MOBILE_QUERY = '(max-width: 780px)'

// Optional bridge: when nested in a PrAppShell without an explicit `collapsed`
// prop, the sidebar mirrors the shell's collapse state so the pre-wired
// composition keeps working. It's never required for PrSidebar to function.
const shell = inject(prAppShellContextKey, null)

const isMobile = ref(typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches)
let mediaQuery: MediaQueryList | undefined

function handleMediaChange(event: MediaQueryListEvent) {
  isMobile.value = event.matches
}

onMounted(() => {
  mediaQuery = window.matchMedia(MOBILE_QUERY)
  isMobile.value = mediaQuery.matches
  mediaQuery.addEventListener('change', handleMediaChange)
})

onBeforeUnmount(() => {
  mediaQuery?.removeEventListener('change', handleMediaChange)
})

const internalCollapsed = ref(props.defaultCollapsed ?? shell?.collapsed.value ?? isMobile.value)

const collapsed = computed({
  get: () => props.collapsed ?? shell?.collapsed.value ?? internalCollapsed.value,
  set: (value) => {
    internalCollapsed.value = value
    emit('update:collapsed', value)
    if (props.collapsed === undefined) {
      shell?.setCollapsed(value)
    }
  },
})

const mobileExpanded = ref(false)
const isNarrow = computed(() => (isMobile.value ? !mobileExpanded.value : collapsed.value))

function toggle() {
  if (isMobile.value) {
    mobileExpanded.value = !mobileExpanded.value
    return
  }
  collapsed.value = !collapsed.value
}

function closeMobileFlyout() {
  if (isMobile.value) {
    mobileExpanded.value = false
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeMobileFlyout()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})

provide(prSidebarContextKey, {
  collapsed,
  isNarrow,
  isMobile,
  toggle,
  closeMobileFlyout,
})
</script>

<template>
  <div
    v-if="isMobile && mobileExpanded"
    class="pr-sidebar__backdrop fixed inset-0 top-[var(--pr-navbar-height)] z-[44] bg-[var(--pr-color-overlay)] animate-[pr-fade-in_150ms_var(--pr-ease-standard)]"
    aria-hidden="true"
    @click="closeMobileFlyout"
  />
  <aside
    class="pr-sidebar sticky top-[var(--pr-navbar-height)] col-[1] row-[2] z-[40] flex h-[calc(100svh-var(--pr-navbar-height))] w-[var(--pr-sidebar-width)] flex-col border-r border-[var(--pr-color-border)] bg-[var(--pr-color-surface)] text-[color:var(--pr-color-text)] transition-[width] duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)] data-[collapsed=true]:w-[var(--pr-sidebar-collapsed-width)] data-[collapsed=true]:[&_.pr-sidebar-item\_\_link]:min-h-12 data-[collapsed=true]:[&_.pr-sidebar-item\_\_link]:justify-center data-[collapsed=true]:[&_.pr-sidebar-item\_\_link]:px-0 data-[collapsed=true]:[&_.pr-sidebar-item\_\_link]:py-[var(--pr-space-1)] data-[collapsed=true]:[&_.pr-sidebar-item\_\_body]:hidden data-[collapsed=true]:[&_.pr-sidebar-item\_\_chevron]:hidden data-[collapsed=true]:[&_.pr-sidebar-item\_\_subitems]:hidden data-[collapsed=true]:[&_.pr-sidebar\_\_collapse-label]:hidden max-[780px]:w-[var(--pr-sidebar-collapsed-width)] max-[780px]:[&_.pr-sidebar-item\_\_link]:min-h-12 max-[780px]:[&_.pr-sidebar-item\_\_link]:justify-center max-[780px]:[&_.pr-sidebar-item\_\_link]:px-0 max-[780px]:[&_.pr-sidebar-item\_\_link]:py-[var(--pr-space-1)] max-[780px]:[&_.pr-sidebar-item\_\_body]:hidden max-[780px]:[&_.pr-sidebar-item\_\_chevron]:hidden max-[780px]:[&_.pr-sidebar-item\_\_subitems]:hidden max-[780px]:[&_.pr-sidebar\_\_collapse-label]:hidden max-[780px]:data-[mobile-expanded=true]:fixed max-[780px]:data-[mobile-expanded=true]:inset-[var(--pr-navbar-height)_auto_0_0] max-[780px]:data-[mobile-expanded=true]:z-[45] max-[780px]:data-[mobile-expanded=true]:h-[calc(100svh-var(--pr-navbar-height))] max-[780px]:data-[mobile-expanded=true]:w-[min(var(--pr-sidebar-width),calc(100vw-3rem))] max-[780px]:data-[mobile-expanded=true]:shadow-[var(--pr-shadow-md)] max-[780px]:data-[mobile-expanded=true]:[&_.pr-sidebar-item\_\_link]:justify-start max-[780px]:data-[mobile-expanded=true]:[&_.pr-sidebar-item\_\_link]:px-[var(--pr-space-3)] max-[780px]:data-[mobile-expanded=true]:[&_.pr-sidebar-item\_\_link]:py-[var(--pr-space-2)] max-[780px]:data-[mobile-expanded=true]:[&_.pr-sidebar-item\_\_body]:grid max-[780px]:data-[mobile-expanded=true]:[&_.pr-sidebar-item\_\_chevron]:block max-[780px]:data-[mobile-expanded=true]:[&_.pr-sidebar-item\_\_subitems]:grid max-[780px]:data-[mobile-expanded=true]:[&_.pr-sidebar\_\_collapse-label]:inline"
    :aria-label="label"
    :data-collapsed="collapsed ? 'true' : 'false'"
    :data-mobile-expanded="mobileExpanded ? 'true' : 'false'"
  >
    <div class="pr-sidebar__scroll min-h-0 flex-auto overflow-y-auto px-[var(--pr-space-3)] pt-[var(--pr-space-5)] pb-[var(--pr-space-4)]">
      <nav class="pr-sidebar__nav grid gap-[var(--pr-space-2)]">
        <slot />
      </nav>
    </div>

    <div v-if="$slots.footer || collapsible" class="pr-sidebar__footer grid gap-[var(--pr-space-2)] border-t border-[var(--pr-color-border)] p-[var(--pr-space-3)]">
      <slot name="footer" />
      <PrSidebarCollapseButton v-if="collapsible" />
    </div>
  </aside>
</template>
