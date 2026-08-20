<script setup lang="ts">
import { inject, nextTick, ref, watch } from 'vue'
import { prAppShellContextKey } from '../../layouts/AppShell/appShellContext'
import PrSidebarCollapseButton from './PrSidebarCollapseButton.vue'

export interface PrSidebarProps {
  label?: string
  collapsible?: boolean
}

withDefaults(defineProps<PrSidebarProps>(), {
  label: 'Navigation principale',
  collapsible: true,
})

const shell = inject(prAppShellContextKey, null)
const sidebarElement = ref<HTMLElement | null>(null)

watch(
  () => shell?.mobileOpen.value,
  async (isOpen) => {
    if (isOpen) {
      await nextTick()
      sidebarElement.value?.focus()
    }
  },
)
</script>

<template>
  <aside
    ref="sidebarElement"
    class="pr-sidebar sticky top-[var(--pr-navbar-height)] col-[1] row-[2] z-[40] flex h-[calc(100svh-var(--pr-navbar-height))] w-[var(--pr-sidebar-width)] flex-col border-r border-[var(--pr-color-border)] bg-[var(--pr-color-surface)] text-[color:var(--pr-color-text)] transition-[width,transform] duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)] data-[collapsed=true]:w-[var(--pr-sidebar-collapsed-width)] data-[collapsed=true]:[&_.pr-sidebar-item\_\_link]:min-h-12 data-[collapsed=true]:[&_.pr-sidebar-item\_\_link]:justify-center data-[collapsed=true]:[&_.pr-sidebar-item\_\_link]:px-0 data-[collapsed=true]:[&_.pr-sidebar-item\_\_link]:py-[var(--pr-space-1)] data-[collapsed=true]:[&_.pr-sidebar-item\_\_body]:hidden data-[collapsed=true]:[&_.pr-sidebar-item\_\_chevron]:hidden data-[collapsed=true]:[&_.pr-sidebar-item\_\_subitems]:hidden data-[collapsed=true]:[&_.pr-sidebar\_\_collapse-label]:hidden max-[780px]:fixed max-[780px]:inset-[var(--pr-navbar-height)_auto_0_0] max-[780px]:h-[calc(100svh-var(--pr-navbar-height))] max-[780px]:w-[min(var(--pr-sidebar-width),calc(100vw-3rem))] max-[780px]:-translate-x-full max-[780px]:data-[collapsed=true]:w-[min(var(--pr-sidebar-width),calc(100vw-3rem))] max-[780px]:data-[collapsed=true]:[&_.pr-sidebar-item\_\_link]:justify-start max-[780px]:data-[collapsed=true]:[&_.pr-sidebar-item\_\_link]:px-[var(--pr-space-3)] max-[780px]:data-[collapsed=true]:[&_.pr-sidebar-item\_\_link]:py-[var(--pr-space-2)] max-[780px]:data-[collapsed=true]:[&_.pr-sidebar-item\_\_body]:grid max-[780px]:data-[collapsed=true]:[&_.pr-sidebar-item\_\_chevron]:block max-[780px]:data-[collapsed=true]:[&_.pr-sidebar-item\_\_subitems]:grid max-[780px]:data-[collapsed=true]:[&_.pr-sidebar\_\_collapse-label]:inline group-data-[mobile-open=true]/app-shell:max-[780px]:translate-x-0"
    :aria-label="label"
    :data-collapsed="shell?.collapsed.value ? 'true' : 'false'"
    tabindex="-1"
  >
    <div class="pr-sidebar__scroll min-h-0 flex-auto overflow-y-auto px-[var(--pr-space-3)] pt-[var(--pr-space-5)] pb-[var(--pr-space-4)]">
      <nav class="pr-sidebar__nav grid gap-[var(--pr-space-2)]">
        <slot />
      </nav>
    </div>

    <div v-if="$slots.footer || collapsible" class="pr-sidebar__footer grid gap-[var(--pr-space-2)] border-t border-[var(--pr-color-border)] p-[var(--pr-space-3)]">
      <slot name="footer" />
      <PrSidebarCollapseButton v-if="collapsible && shell" />
    </div>
  </aside>
</template>
