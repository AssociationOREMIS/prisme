<script setup lang="ts">
import { computed, type Component } from 'vue'

export interface PrFabProps {
  /** Icon (a Lucide component) of the button. */
  icon: Component
  /** Accessible name of the button (it shows no text): « Discuter avec un bénévole ». */
  label: string
  /** Whether the panel it opens is shown: sets `aria-expanded`. Leave it out for a plain action. */
  expanded?: boolean
  /** Icon shown while `expanded` (a cross to close, for example). */
  iconExpanded?: Component
  /** Corner of the screen. */
  position?: 'bottom-right' | 'bottom-left'
  /** Distance from the edges of the screen (at most 0.75rem below 780px). */
  offset?: string
}

// The attributes (aria-controls, aria-haspopup, data-*...) go to the button, not the wrapper.
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<PrFabProps>(), {
  expanded: undefined,
  iconExpanded: undefined,
  position: 'bottom-right',
  offset: '1.5rem',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const currentIcon = computed(() => (props.expanded && props.iconExpanded ? props.iconExpanded : props.icon))

const fabPositionClass: Record<NonNullable<PrFabProps['position']>, string> = {
  'bottom-right': 'pr-fab--bottom-right pr:items-end pr:right-[var(--pr-fab-offset)] pr:max-[780px]:right-[min(var(--pr-fab-offset),0.75rem)]',
  'bottom-left': 'pr-fab--bottom-left pr:items-start pr:left-[var(--pr-fab-offset)] pr:max-[780px]:left-[min(var(--pr-fab-offset),0.75rem)]',
}

const fabClass = computed(() => [
  'pr-fab pr:fixed pr:z-[60] pr:flex pr:flex-col pr:gap-[var(--pr-space-3)]',
  'pr:bottom-[var(--pr-fab-offset)] pr:max-[780px]:bottom-[min(var(--pr-fab-offset),0.75rem)]',
  'pr:max-w-[calc(100vw-2*var(--pr-fab-offset))] pr:max-[780px]:max-w-[calc(100vw-2*min(var(--pr-fab-offset),0.75rem))]',
  fabPositionClass[props.position],
])

// A transparent border becomes visible in forced colors, where the background disappears. The
// focus ring is two rings, surface then focus colour, so it shows on a light or a dark page.
const buttonClass = [
  'pr-fab__button pr:inline-flex pr:size-[3.75rem] pr:shrink-0 pr:items-center pr:justify-center pr:cursor-pointer',
  'pr:rounded-[var(--pr-radius-full)] pr:border-2 pr:border-transparent pr:bg-[var(--pr-color-primary)] pr:text-[color:var(--pr-color-primary-contrast)] pr:shadow-[var(--pr-shadow-md)]',
  'pr:transition-[background-color,box-shadow,transform] pr:duration-[var(--pr-duration-fast)] pr:ease-[var(--pr-ease-standard)]',
  'pr:hover:bg-[var(--pr-color-primary-hover)] pr:active:bg-[var(--pr-color-primary-active)] pr:active:scale-95 pr:motion-reduce:active:scale-100',
  'pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)] pr:focus-visible:shadow-[0_0_0_2px_var(--pr-color-surface),var(--pr-shadow-md)]',
]
</script>

<template>
  <div :class="fabClass" :style="{ '--pr-fab-offset': offset }">
    <div v-if="$slots.default" class="pr-fab__panel pr:flex pr:max-w-full pr:flex-col">
      <slot />
    </div>
    <button
      v-bind="$attrs"
      type="button"
      :class="buttonClass"
      :aria-label="label"
      :aria-expanded="expanded"
      @click="emit('click', $event)"
    >
      <component :is="currentIcon" class="pr-fab__icon" :size="26" aria-hidden="true" />
    </button>
  </div>
</template>
