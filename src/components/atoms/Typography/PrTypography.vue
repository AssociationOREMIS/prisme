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
  h1: 'text-4xl lg:text-5xl font-extrabold leading-none',
  h2: 'mt-[var(--pr-space-10)] first:mt-0 pb-[var(--pr-space-3)] text-3xl font-extrabold leading-[1.2]',
  h3: 'text-2xl font-semibold leading-[var(--pr-line-height-tight)]',
  h4: 'text-xl font-semibold leading-[var(--pr-line-height-tight)]',
  p: 'not-first:mt-[var(--pr-space-6)] leading-[var(--pr-line-height-normal)]',
  blockquote: 'mt-[var(--pr-space-6)] border-l-2 border-[var(--pr-color-border)] pl-[var(--pr-space-6)] italic text-[color:var(--pr-color-text-muted)]',
  ul: 'my-[var(--pr-space-6)] list-disc pl-[var(--pr-space-6)] text-[color:var(--pr-color-text)] [&>li]:mt-[var(--pr-space-2)] [&>li]:text-inherit',
  ol: 'my-[var(--pr-space-6)] list-decimal pl-[var(--pr-space-6)] text-[color:var(--pr-color-text)] [&>li]:mt-[var(--pr-space-2)] [&>li]:text-inherit',
  'inline-code': 'rounded-[var(--pr-radius-sm)] bg-[var(--pr-color-surface-subtle)] px-[var(--pr-space-1)] py-[0.125rem] font-[var(--pr-font-mono)] text-[length:var(--pr-font-size-sm)]',
  'code-block': 'flex w-full overflow-x-auto rounded-[var(--pr-radius-sm)] bg-[var(--pr-color-surface-subtle)] p-[var(--pr-space-3)] text-[color:var(--pr-color-text)]',
  lead: 'text-xl leading-[var(--pr-line-height-normal)] text-[color:var(--pr-color-text-muted)]',
  large: 'text-[length:var(--pr-font-size-lg)] font-semibold leading-[var(--pr-line-height-normal)]',
  small: 'text-[length:var(--pr-font-size-sm)] font-medium leading-none',
  subtle: 'text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-normal)] text-[color:var(--pr-color-text-muted)]',
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
  <component :is="tag" class="pr-typography m-0 text-[color:var(--pr-color-text)]" :class="typographyVariantClass">
    <code v-if="normalizedVariant === 'code-block'" class="pr-typography__code-block-content whitespace-pre font-[var(--pr-font-mono)] text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-normal)] text-inherit">
      <slot />
    </code>
    <slot v-else />
  </component>
</template>
