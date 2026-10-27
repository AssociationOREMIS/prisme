<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { prAppShellContextKey } from './appShellContext'
import { usePrMessages } from '../../../i18n/context'

export interface PrAppShellProps {
  collapsed?: boolean
  defaultCollapsed?: boolean
  /**
   * Id of the `<main>` element, target of the skip link (« Aller au contenu ») shown on the first
   * press of Tab. Change it only if the page already uses this id.
   */
  mainId?: string
  /** Text of the skip link, when it should say more than `messages.appShell.skipLink`. */
  skipLinkLabel?: string
  /** Leaves out the skip link, for a page that already has its own. */
  hideSkipLink?: boolean
}

const props = withDefaults(defineProps<PrAppShellProps>(), {
  collapsed: undefined,
  defaultCollapsed: false,
  mainId: 'main-content',
  skipLinkLabel: undefined,
  hideSkipLink: false,
})

const messages = usePrMessages()

// The link moves the focus itself: a page with a <base> element, or a script that takes over
// links, would otherwise load another address instead of reaching the content.
function skipToContent(event: MouseEvent) {
  const main = document.getElementById(props.mainId)
  if (!main) return
  event.preventDefault()
  main.focus({ preventScroll: true })
  main.scrollIntoView({ block: 'start' })
}

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
    class="pr-app-shell pr-shell-grid pr:bg-[var(--pr-color-surface-subtle)] pr:text-[color:var(--pr-color-text)]"
    :data-sidebar-collapsed="collapsed ? 'true' : 'false'"
  >
    <!-- First stop of the keyboard on every page (RGAA 12.7, WCAG 2.4.1): hidden until it has the
         focus, then shown above the navbar. -->
    <a v-if="!hideSkipLink" class="pr-skip-link" :href="`#${mainId}`" @click="skipToContent">{{ skipLinkLabel ?? messages.appShell.skipLink }}</a>

    <slot name="navbar" />

    <slot name="sidebar" />

    <!-- tabindex="-1": the skip link (and Prisme's page navigation) moves the focus here, so the
         next Tab starts from the content. -->
    <main :id="mainId" class="pr-app-shell__content pr-shell-grid__content" tabindex="-1">
      <slot />
    </main>

    <!-- The footer (contentinfo landmark): where an app puts the « Accessibilité : partiellement
         conforme » link of its accessibility statement, the legal notice and the contact. -->
    <footer v-if="$slots.footer" class="pr-app-shell__footer pr-shell-grid__footer">
      <slot name="footer" />
    </footer>
  </div>
</template>
