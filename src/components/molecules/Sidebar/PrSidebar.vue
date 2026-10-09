<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue'
import { prAppShellContextKey } from '../../layouts/AppShell/appShellContext'
import PrSidebarCollapseButton from './PrSidebarCollapseButton.vue'
import { prSidebarContextKey } from './sidebarContext'
import { usePrMessages } from '../../../i18n/context'
import { warnDeprecated } from '../../deprecation'

export interface PrSidebarProps {
  /** Name for screen readers (the element shows no text of its own). */
  ariaLabel?: string
  /** @deprecated Use `ariaLabel` (`aria-label`) instead: `label` is for visible text. Removed in 1.0. */
  label?: string
  collapsible?: boolean
  collapsed?: boolean
  defaultCollapsed?: boolean
}

const props = withDefaults(defineProps<PrSidebarProps>(), {
  ariaLabel: undefined,
  label: undefined,
  collapsible: true,
  collapsed: undefined,
  defaultCollapsed: undefined,
})

if (props.label !== undefined) warnDeprecated('PrSidebar', 'label', 'aria-label')

const messages = usePrMessages()

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

// Escape is only listened to while the mobile flyout is open.
watch(mobileExpanded, (open) => {
  if (open) window.addEventListener('keydown', handleKeydown)
  else window.removeEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})

// The open flyout covers the page: tabbing out of it would land on content hidden behind the
// backdrop, so leaving it with the focus closes it.
function handleFocusOut(event: FocusEvent) {
  const next = event.relatedTarget
  if (mobileExpanded.value && next instanceof Node && !(event.currentTarget as HTMLElement).contains(next)) {
    closeMobileFlyout()
  }
}

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
    class="pr-sidebar__backdrop pr:fixed pr:inset-0 pr:top-[var(--pr-navbar-height)] pr:z-[44] pr:bg-[var(--pr-color-overlay)] pr:animate-[pr-fade-in_150ms_var(--pr-ease-standard)]"
    aria-hidden="true"
    @click="closeMobileFlyout"
  />
  <aside
    class="pr-sidebar pr:sticky pr:top-[var(--pr-navbar-height)] pr:col-[1] pr:row-[2] pr:z-[40] pr:flex pr:h-[calc(100svh-var(--pr-navbar-height))] pr:w-[var(--pr-sidebar-width)] pr:flex-col pr:border-r pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-background)] pr:text-[color:var(--pr-color-text)] pr:transition-[width] pr:duration-[var(--pr-duration-fast)] pr:ease-[var(--pr-ease-standard)] pr:data-[collapsed=true]:w-[var(--pr-sidebar-collapsed-width)] pr:data-[collapsed=true]:[&_.pr-sidebar-item\_\_link]:min-h-12 pr:data-[collapsed=true]:[&_.pr-sidebar-item\_\_link]:justify-center pr:data-[collapsed=true]:[&_.pr-sidebar-item\_\_link]:px-0 pr:data-[collapsed=true]:[&_.pr-sidebar-item\_\_link]:py-0 pr:data-[collapsed=true]:[&_.pr-sidebar-item\_\_body]:hidden pr:data-[collapsed=true]:[&_.pr-sidebar-item\_\_chevron]:hidden pr:data-[collapsed=true]:[&_.pr-sidebar-item\_\_subitems]:hidden pr:data-[collapsed=true]:[&_.pr-sidebar\_\_collapse-label]:hidden pr:max-[780px]:w-[var(--pr-sidebar-collapsed-width)] pr:max-[780px]:[&_.pr-sidebar-item\_\_link]:min-h-12 pr:max-[780px]:[&_.pr-sidebar-item\_\_link]:justify-center pr:max-[780px]:[&_.pr-sidebar-item\_\_link]:px-0 pr:max-[780px]:[&_.pr-sidebar-item\_\_link]:py-0 pr:max-[780px]:[&_.pr-sidebar-item\_\_body]:hidden pr:max-[780px]:[&_.pr-sidebar-item\_\_chevron]:hidden pr:max-[780px]:[&_.pr-sidebar-item\_\_subitems]:hidden pr:max-[780px]:[&_.pr-sidebar\_\_collapse-label]:hidden pr:max-[780px]:data-[mobile-expanded=true]:fixed pr:max-[780px]:data-[mobile-expanded=true]:inset-[var(--pr-navbar-height)_auto_0_0] pr:max-[780px]:data-[mobile-expanded=true]:z-[45] pr:max-[780px]:data-[mobile-expanded=true]:h-[calc(100svh-var(--pr-navbar-height))] pr:max-[780px]:data-[mobile-expanded=true]:w-[min(var(--pr-sidebar-width),calc(100vw-3rem))] pr:max-[780px]:data-[mobile-expanded=true]:shadow-[var(--pr-shadow-md)] pr:max-[780px]:data-[mobile-expanded=true]:[&_.pr-sidebar-item\_\_link]:justify-start pr:max-[780px]:data-[mobile-expanded=true]:[&_.pr-sidebar-item\_\_body]:grid pr:max-[780px]:data-[mobile-expanded=true]:[&_.pr-sidebar-item\_\_chevron]:block pr:max-[780px]:data-[mobile-expanded=true]:[&_.pr-sidebar-item\_\_subitems]:grid pr:max-[780px]:data-[mobile-expanded=true]:[&_.pr-sidebar\_\_collapse-label]:inline"
    :aria-label="ariaLabel ?? label ?? messages.sidebar.label"
    :data-collapsed="collapsed ? 'true' : 'false'"
    :data-mobile-expanded="mobileExpanded ? 'true' : 'false'"
    @focusout="handleFocusOut"
  >
    <div class="pr-sidebar__scroll pr:min-h-0 pr:flex-auto pr:overflow-y-auto pr:px-[var(--pr-space-4)] pr:py-[var(--pr-space-5)]">
      <nav class="pr-sidebar__nav pr:grid pr:gap-[var(--pr-space-2)]">
        <slot />
      </nav>
    </div>

    <div v-if="$slots.footer" class="pr-sidebar__footer pr:grid pr:gap-[var(--pr-space-2)] pr:p-[var(--pr-space-3)]">
      <slot name="footer" />
    </div>
    <PrSidebarCollapseButton v-if="collapsible" />
  </aside>
</template>
