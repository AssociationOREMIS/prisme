<script setup lang="ts">
import { computed } from 'vue'

export interface PrTypographyProps {
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'p'
    | 'blockquote'
    | 'ul'
    | 'ol'
    | 'table'
    | 'inline-code'
    | 'code'
    | 'code-block'
    | 'lead'
    | 'large'
    | 'small'
    | 'subtle'
}

const props = withDefaults(defineProps<PrTypographyProps>(), {
  variant: 'p',
})

const normalizedVariant = computed(() => (props.variant === 'code' ? 'inline-code' : props.variant))
const typographyVariantClass = computed(() => ({
  h1: 'pr:font-[family-name:var(--pr-font-heading)] pr:text-4xl pr:lg:text-5xl pr:font-bold pr:leading-none',
  h2: 'pr:font-[family-name:var(--pr-font-heading)] pr:mt-[var(--pr-space-10)] pr:first:mt-0 pr:pb-[var(--pr-space-3)] pr:text-3xl pr:font-bold pr:leading-[1.2]',
  h3: 'pr:font-[family-name:var(--pr-font-heading)] pr:text-2xl pr:font-semibold pr:leading-[var(--pr-line-height-tight)]',
  h4: 'pr:font-[family-name:var(--pr-font-heading)] pr:text-xl pr:font-semibold pr:leading-[var(--pr-line-height-tight)]',
  p: 'pr:not-first:mt-[var(--pr-space-6)] pr:leading-[var(--pr-line-height-normal)]',
  blockquote: 'pr:mt-[var(--pr-space-6)] pr:border-l-2 pr:border-[var(--pr-color-border)] pr:pl-[var(--pr-space-6)] pr:italic pr:text-[color:var(--pr-color-text-muted)]',
  ul: 'pr:my-[var(--pr-space-6)] pr:list-disc pr:pl-[var(--pr-space-6)] pr:text-[color:var(--pr-color-text)] pr:[&>li]:mt-[var(--pr-space-2)] pr:[&>li]:text-inherit',
  ol: 'pr:my-[var(--pr-space-6)] pr:list-decimal pr:pl-[var(--pr-space-6)] pr:text-[color:var(--pr-color-text)] pr:[&>li]:mt-[var(--pr-space-2)] pr:[&>li]:text-inherit',
  table: 'pr:my-[var(--pr-space-6)] pr:w-full pr:border-collapse pr:text-left pr:text-[length:var(--pr-font-size-sm)] pr:[&_th]:border-b pr:[&_th]:border-[var(--pr-color-border)] pr:[&_th]:px-[var(--pr-space-3)] pr:[&_th]:py-[var(--pr-space-2)] pr:[&_th]:font-[750] pr:[&_th]:text-[color:var(--pr-color-text-muted)] pr:[&_td]:border-b pr:[&_td]:border-[var(--pr-color-border)] pr:[&_td]:px-[var(--pr-space-3)] pr:[&_td]:py-[var(--pr-space-2)] pr:[&_td]:text-[color:var(--pr-color-text)] pr:[&_tr:last-child>td]:border-b-0',
  'inline-code': 'pr:rounded-[var(--pr-radius-sm)] pr:bg-[var(--pr-color-surface-subtle)] pr:px-[var(--pr-space-1)] pr:py-[0.125rem] pr:font-[var(--pr-font-mono)] pr:text-[length:var(--pr-font-size-sm)]',
  'code-block': 'pr:flex pr:w-full pr:overflow-x-auto pr:rounded-[var(--pr-radius-sm)] pr:bg-[var(--pr-color-surface-subtle)] pr:p-[var(--pr-space-3)] pr:text-[color:var(--pr-color-text)]',
  lead: 'pr:text-xl pr:leading-[var(--pr-line-height-normal)] pr:text-[color:var(--pr-color-text-muted)]',
  large: 'pr:text-[length:var(--pr-font-size-lg)] pr:font-semibold pr:leading-[var(--pr-line-height-normal)]',
  small: 'pr:text-[length:var(--pr-font-size-sm)] pr:font-medium pr:leading-none',
  subtle: 'pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-normal)] pr:text-[color:var(--pr-color-text-muted)]',
})[normalizedVariant.value])
const tag = computed(() => {
  switch (normalizedVariant.value) {
    case 'lead':
    case 'subtle':
      return 'p'
    case 'large':
      return 'div'
    case 'small':
      return 'small'
    case 'inline-code':
      return 'code'
    case 'code-block':
      return 'pre'
    default:
      return normalizedVariant.value
  }
})
</script>

<template>
  <component :is="tag" class="pr-typography pr:m-0 pr:text-[color:var(--pr-color-text)]" :class="typographyVariantClass">
    <code v-if="normalizedVariant === 'code-block'" class="pr-typography__code-block-content pr:whitespace-pre pr:font-[var(--pr-font-mono)] pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-normal)] pr:text-inherit">
      <slot />
    </code>
    <slot v-else />
  </component>
</template>
