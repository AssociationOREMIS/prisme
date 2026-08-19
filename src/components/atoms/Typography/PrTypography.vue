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
  <component :is="tag" class="pr-typography" :class="`pr-typography--${normalizedVariant}`">
    <code v-if="normalizedVariant === 'code-block'" class="pr-typography__code-block-content">
      <slot />
    </code>
    <slot v-else />
  </component>
</template>
