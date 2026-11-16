<script setup lang="ts">
import { computed, onMounted, onUnmounted, useId, type Component } from 'vue'
import { LogOut } from '@lucide/vue'
import { PrButton } from '../../atoms/Button'
import { PrVisuallyHidden } from '../../atoms/VisuallyHidden'
import { usePrMessages } from '../../../i18n/context'

export interface PrQuickExitProps {
  /** Neutral page opened in place of the site (the weather by default). */
  href?: string
  /** Text of the button, `messages.quickExit.label` (« Quitter vite ») by default. */
  label?: string
  size?: 'sm' | 'md' | 'lg'
  /** Icon (a Lucide component) before the label. */
  icon?: Component
  /** Pressing Escape twice within a second, anywhere on the page, also leaves. */
  shortcut?: boolean
  /** Also opens the neutral page in a new tab (the site's tab is replaced anyway). */
  newTab?: boolean
}

const props = withDefaults(defineProps<PrQuickExitProps>(), {
  href: 'https://www.google.fr/search?q=m%C3%A9t%C3%A9o',
  label: undefined,
  size: 'sm',
  icon: () => LogOut,
  shortcut: true,
  newTab: false,
})

const emit = defineEmits<{
  /** Just before leaving, to clear what the app keeps (a draft, a session). */
  exit: []
}>()

/** Delay (ms) within which the second Escape must come. */
const DOUBLE_ESCAPE_DELAY = 1000

const messages = usePrMessages()
const descriptionId = `pr-quick-exit-${useId()}-description`
const description = computed(() => messages.quickExit.description + (props.shortcut ? ` ${messages.quickExit.shortcut}` : ''))

// `replace`, not a link: the site leaves the history, Back does not bring it on screen again.
function exit() {
  emit('exit')
  if (props.newTab) window.open(props.href, '_blank', 'noopener')
  window.location.replace(props.href)
}

let lastEscape = Number.NEGATIVE_INFINITY

function onKeydown(event: KeyboardEvent) {
  if (!props.shortcut || event.key !== 'Escape') return
  const now = Date.now()
  if (now - lastEscape <= DOUBLE_ESCAPE_DELAY) {
    lastEscape = Number.NEGATIVE_INFINITY
    exit()
    return
  }
  lastEscape = now
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <span class="pr-quick-exit pr:inline-flex">
    <PrButton
      class="pr-quick-exit__button"
      variant="danger"
      :size="size"
      :icon="icon"
      :aria-describedby="descriptionId"
      @click="exit"
    >
      {{ label ?? messages.quickExit.label }}
    </PrButton>
    <PrVisuallyHidden :id="descriptionId" class="pr-quick-exit__description">
      {{ description }}
    </PrVisuallyHidden>
  </span>
</template>
