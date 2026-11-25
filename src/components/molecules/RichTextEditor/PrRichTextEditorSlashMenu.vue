<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { groupSlashItems, type PrRichTextEditorSlashItem } from './blocks'

/*
 * The list of the "/" menu of `PrRichTextEditor` (`variant="blocks"`). The focus stays in the text
 * (WAI-ARIA APG "listbox" driven from a text field): the editor moves the active option with the
 * arrow keys and points to it with `aria-activedescendant`. Positioned by the suggestion plugin.
 */
const props = defineProps<{
  id: string
  items: PrRichTextEditorSlashItem[]
  activeIndex: number
  label: string
  emptyText: string
}>()

const emit = defineEmits<{
  select: [index: number]
  activate: [index: number]
}>()

const root = ref<HTMLElement | null>(null)

/** The groups shown, each item with its index in `items` (the keyboard order). */
const sections = computed(() => {
  let index = 0

  return groupSlashItems(props.items).map((group, groupIndex) => ({
    key: group.name ?? `pr-default-${groupIndex}`,
    name: group.name,
    items: group.items.map(item => ({ item, index: index++ })),
  }))
})

function optionId(index: number) {
  return `${props.id}-option-${index}`
}

// Keeps the active option visible in a list taller than the room left on screen.
watch(() => props.activeIndex, async () => {
  await nextTick()
  root.value?.querySelector<HTMLElement>('[aria-selected="true"]')?.scrollIntoView?.({ block: 'nearest' })
})

defineExpose({ root, optionId })

const optionClass = 'pr-rich-text-editor__slash-option pr:flex pr:cursor-pointer pr:items-center pr:gap-[var(--pr-space-3)] pr:rounded-[var(--pr-radius-md)] pr:px-[var(--pr-space-2)] pr:py-[var(--pr-space-1)] pr:text-left'
</script>

<template>
  <div
    :id="id"
    ref="root"
    class="pr-rich-text-editor__slash-menu pr:z-30 pr:grid pr:max-h-[min(22rem,calc(100dvh-1rem))] pr:w-[min(20rem,calc(100vw-1rem))] pr:max-w-[calc(100vw-1rem)] pr:gap-[0.125rem] pr:overflow-y-auto pr:rounded-[var(--pr-radius-lg)] pr:border! pr:border-[var(--pr-color-border)]! pr:bg-[var(--pr-color-surface)] pr:p-[var(--pr-space-1)] pr:text-[color:var(--pr-color-text)] pr:shadow-[var(--pr-shadow-md)]"
    role="listbox"
    :aria-label="label"
    @mousedown.prevent
  >
    <p v-if="items.length === 0" class="pr:m-0 pr:px-[var(--pr-space-2)] pr:py-[var(--pr-space-2)] pr:text-[length:var(--pr-font-size-sm)] pr:text-[color:var(--pr-color-text-muted)]" role="presentation">
      {{ emptyText }}
    </p>
    <div
      v-for="section in sections"
      :key="section.key"
      class="pr:grid pr:gap-[0.125rem]"
      :role="section.name ? 'group' : 'presentation'"
      :aria-label="section.name"
    >
      <span v-if="section.name" class="pr-rich-text-editor__slash-group pr:block pr:px-[var(--pr-space-2)] pr:pt-[var(--pr-space-2)] pr:pb-[var(--pr-space-1)] pr:text-[length:var(--pr-font-size-xs)] pr:font-semibold pr:uppercase pr:tracking-[0.04em] pr:text-[color:var(--pr-color-text-muted)]" aria-hidden="true">
        {{ section.name }}
      </span>
      <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/mouse-events-have-key-events, vuejs-accessibility/interactive-supports-focus -- the keyboard drives this list from the text (aria-activedescendant) -->
      <div
        v-for="{ item, index } in section.items"
        :id="optionId(index)"
        :key="index"
        :class="[optionClass, index === activeIndex ? 'pr:bg-[var(--pr-color-surface-subtle)]' : '']"
        role="option"
        :aria-selected="index === activeIndex"
        @mousedown.prevent="emit('select', index)"
        @mousemove="index !== activeIndex && emit('activate', index)"
      >
        <span class="pr-rich-text-editor__slash-icon pr:inline-flex pr:h-8 pr:w-8 pr:shrink-0 pr:items-center pr:justify-center pr:rounded-[var(--pr-radius-md)] pr:border! pr:border-[var(--pr-color-border)]! pr:bg-[var(--pr-color-surface)] pr:font-semibold pr:text-[color:var(--pr-color-text-muted)]" aria-hidden="true">
          <template v-if="typeof item.icon === 'string'">{{ item.icon }}</template>
          <component :is="item.icon" v-else-if="item.icon" :size="16" />
        </span>
        <span class="pr:grid pr:min-w-0">
          <span class="pr-rich-text-editor__slash-title pr:font-semibold">{{ item.title }}</span>
          <span v-if="item.hint" class="pr:text-[length:var(--pr-font-size-xs)] pr:text-[color:var(--pr-color-text-muted)]">{{ item.hint }}</span>
        </span>
      </div>
    </div>
  </div>
</template>
