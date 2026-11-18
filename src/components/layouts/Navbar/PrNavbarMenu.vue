<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { Menu } from '@lucide/vue'
import { PrButton } from '../../atoms/Button'
import { PrSheet } from '../../molecules/Sheet'
import { providePrNavigationOrientation } from '../../molecules/NavigationMenu/context'
import { usePrMessages } from '../../../i18n/context'

export interface PrNavbarMenuProps {
  /** Open state, for `v-model:open`. Left empty, the menu keeps its own. */
  open?: boolean
  /** Name of the button, also the title of the panel. « Menu » by default. */
  label?: string
  /** Side the panel comes from. */
  side?: 'left' | 'right'
}

const props = withDefaults(defineProps<PrNavbarMenuProps>(), {
  open: undefined,
  label: undefined,
  side: 'right',
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const messages = usePrMessages()
const resolvedLabel = computed(() => props.label ?? messages.navbar.menu)

// Controlled with v-model:open, or on its own.
const localOpen = ref(props.open ?? false)
watch(() => props.open, (value) => {
  if (value !== undefined) localOpen.value = value
})
const isOpen = computed(() => props.open ?? localOpen.value)
function setOpen(value: boolean) {
  localOpen.value = value
  emit('update:open', value)
}

// The navigation menus put in the panel lay their links out one per line.
providePrNavigationOrientation('vertical')

// Following a link closes the menu: with a router the page changes without reloading, and the
// panel would otherwise stay open over the new page. A listener on the panel's content (rendered
// only while open), not a click handler on a <div>: the links themselves stay the only targets.
const content = ref<HTMLElement>()
function closeOnLink(event: MouseEvent) {
  if ((event.target as Element | null)?.closest('a[href]')) setOpen(false)
}
watch(content, (element, previous) => {
  previous?.removeEventListener('click', closeOnLink)
  element?.addEventListener('click', closeOnLink)
})
onBeforeUnmount(() => content.value?.removeEventListener('click', closeOnLink))

// The menu of a phone: a button that opens a side panel holding the site's navigation and
// actions. PrNavbar shows it below 780 px; it also works on its own. The panel is a dialog:
// the focus goes in, Escape and the close button close it and give the focus back.
// The trigger (reka's DialogTrigger) gives the button aria-haspopup, aria-expanded and aria-controls.
</script>

<template>
  <PrSheet
    :open="isOpen"
    :side="side"
    size="sm"
    :title="resolvedLabel"
    :close-label="messages.navbar.closeMenu"
    @update:open="setOpen"
  >
    <template #trigger>
      <PrButton
        class="pr-navbar-menu__button"
        variant="ghost"
        :icon="Menu"
        :label="resolvedLabel"
      />
    </template>
    <div ref="content" class="pr-navbar-menu__content pr:grid pr:gap-[var(--pr-space-6)]">
      <slot />
    </div>
  </PrSheet>
</template>
