<script setup lang="ts">
import { inject, nextTick, ref, watch } from 'vue'
import { prAppShellContextKey } from '../AppShell/appShellContext'
import { PrSidebarCollapseButton } from '../../molecules/SidebarCollapseButton'

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
    class="pr-sidebar"
    :aria-label="label"
    :data-collapsed="shell?.collapsed.value ? 'true' : 'false'"
    tabindex="-1"
  >
    <div class="pr-sidebar__scroll">
      <nav class="pr-sidebar__nav">
        <slot />
      </nav>
    </div>

    <div v-if="$slots.footer || collapsible" class="pr-sidebar__footer">
      <slot name="footer" />
      <PrSidebarCollapseButton v-if="collapsible && shell" />
    </div>
  </aside>
</template>
