<script setup lang="ts">
import { PrBadge } from '../../atoms/Badge'
import { usePrMessages } from '../../../i18n/context'

export interface PrLinkListTag {
  label: string
  /** A badge of this variant, or `plain`: small semibold text without a badge. */
  variant?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'plain'
}

export interface PrLinkListItem {
  /** Key of the entry (defaults to `href`, then its position). */
  id?: string | number
  title: string
  /** Makes the title a link. */
  href?: string
  description?: string
  tags?: PrLinkListTag[]
  /** Small details shown as given, joined by « / »: a date, an author... */
  meta?: string[]
}

export interface PrLinkListProps {
  items: PrLinkListItem[]
  /** Level of each entry's title, `h3` by default (under the `h2` of the section). */
  headingLevel?: 2 | 3 | 4
  /** Text shown when there is no entry. */
  emptyText?: string
}

withDefaults(defineProps<PrLinkListProps>(), {
  headingLevel: 3,
  emptyText: undefined,
})

defineSlots<{
  /** Replaces the body of an entry. */
  item?: (props: { item: PrLinkListItem }) => unknown
}>()

const messages = usePrMessages()

function itemKey(item: PrLinkListItem, index: number): string | number {
  return item.id ?? item.href ?? index
}
</script>

<template>
  <ul v-if="items.length" class="pr-link-list pr:m-0 pr:grid pr:list-none pr:p-0">
    <li
      v-for="(item, index) in items"
      :key="itemKey(item, index)"
      class="pr-link-list__item pr:grid pr:gap-[var(--pr-space-2)] pr:border-t pr:border-[var(--pr-color-border)] pr:py-[var(--pr-space-4)] pr:first:border-t-0 pr:first:pt-0 pr:last:pb-0"
    >
      <slot name="item" :item="item">
        <component
          :is="`h${headingLevel}`"
          class="pr-link-list__title pr:m-0 pr:font-[family-name:var(--pr-font-heading)] pr:text-[length:var(--pr-font-size-lg)] pr:font-semibold pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-heading)] pr:[overflow-wrap:break-word]"
        >
          <a
            v-if="item.href"
            :href="item.href"
            class="pr-link-list__link pr:rounded-[var(--pr-radius-xs)] pr:text-inherit pr:no-underline pr:hover:text-[color:var(--pr-color-primary)] pr:hover:underline pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)]"
          >{{ item.title }}</a>
          <template v-else>{{ item.title }}</template>
        </component>
        <p
          v-if="item.description"
          class="pr-link-list__description pr:m-0 pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-normal)] pr:text-[color:var(--pr-color-text-muted)]"
        >
          {{ item.description }}
        </p>
        <div
          v-if="item.tags?.length || item.meta?.length"
          class="pr-link-list__details pr:flex pr:flex-wrap pr:items-center pr:gap-x-[var(--pr-space-3)] pr:gap-y-[var(--pr-space-1)]"
        >
          <template v-for="tag in item.tags" :key="tag.label">
            <span
              v-if="tag.variant === 'plain'"
              class="pr-link-list__tag pr:text-[length:var(--pr-font-size-xs)] pr:font-semibold pr:text-[color:var(--pr-color-text-muted)]"
            >{{ tag.label }}</span>
            <PrBadge v-else class="pr-link-list__tag" :variant="tag.variant ?? 'neutral'" shape="tag">
              {{ tag.label }}
            </PrBadge>
          </template>
          <p
            v-if="item.meta?.length"
            class="pr-link-list__meta pr:m-0 pr:text-[length:var(--pr-font-size-xs)] pr:text-[color:var(--pr-color-text-muted)]"
          >
            {{ item.meta.join(' / ') }}
          </p>
        </div>
      </slot>
    </li>
  </ul>
  <p v-else class="pr-link-list__empty pr:m-0 pr:text-[length:var(--pr-font-size-sm)] pr:text-[color:var(--pr-color-text-muted)]">
    {{ emptyText ?? messages.linkList.empty }}
  </p>
</template>
