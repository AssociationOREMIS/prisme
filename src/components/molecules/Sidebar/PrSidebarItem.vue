<script setup lang="ts">
import { ChevronDown } from '@lucide/vue'
import { computed, inject, ref, useSlots, watch } from 'vue'
import { prAppShellContextKey } from '../../layouts/AppShell/appShellContext'
import PrSidebarIcon from './PrSidebarIcon.vue'
import PrSidebarItemBody from './PrSidebarItemBody.vue'
import PrSidebarItemSubItems from './PrSidebarItemSubItems.vue'
import {
  sidebarItemClass,
  sidebarItemLinkBaseClass,
  sidebarItemLinkDisabledClass,
} from './sidebarItemStyles'
import type { PrSidebarItemProps } from './types'

const props = withDefaults(defineProps<PrSidebarItemProps>(), {
  as: undefined,
  href: undefined,
  description: undefined,
  active: undefined,
  disabled: false,
  expanded: undefined,
  defaultExpanded: false,
})

const emit = defineEmits<{
  'update:expanded': [value: boolean]
}>()

const slots = useSlots()
const shell = inject(prAppShellContextKey, null)
const hasSubItems = computed(() => Boolean(slots.default))
const componentTag = computed(() => props.as ?? (props.href ? 'a' : 'button'))
const resolvedActive = computed(() => {
  if (props.active !== undefined) return props.active
  if (typeof window === 'undefined' || !props.href) return false
  return window.location.pathname === props.href
})
const internalExpanded = ref(props.defaultExpanded || resolvedActive.value)
const isExpanded = computed({
  get: () => props.expanded ?? internalExpanded.value,
  set: (value) => {
    internalExpanded.value = value
    emit('update:expanded', value)
  },
})

const componentAttrs = computed(() => {
  if (componentTag.value === 'button') {
    return {
      type: 'button',
      disabled: props.disabled,
    }
  }

  return {
    href: props.href,
    'aria-disabled': props.disabled ? 'true' : undefined,
    tabindex: props.disabled ? -1 : undefined,
  }
})
const itemLabel = computed(() => props.label)
const itemClass = computed(() => [
  sidebarItemClass,
  {
    'pr-sidebar-item--active': resolvedActive.value,
    'pr-sidebar-item--disabled': props.disabled,
    'pr-sidebar-item--with-subitems': hasSubItems.value,
    'pr-sidebar-item--expanded': isExpanded.value,
  },
])

const linkClass = computed(() => [
  sidebarItemLinkBaseClass,
  'group/sidebar-item',
  props.disabled ? sidebarItemLinkDisabledClass : '',
])

watch(
  resolvedActive,
  (active) => {
    if (active && hasSubItems.value) {
      isExpanded.value = true
    }
  },
)

function handleClick() {
  if (props.disabled) {
    return
  }

  if (hasSubItems.value && !props.href) {
    isExpanded.value = !isExpanded.value
    return
  }

  shell?.closeMobile()
}
</script>

<template>
  <div
    :class="itemClass"
    :data-expanded="isExpanded ? 'true' : 'false'"
  >
    <component
      :is="componentTag"
      :class="linkClass"
      v-bind="componentAttrs"
      :aria-current="resolvedActive ? 'page' : undefined"
      :aria-expanded="hasSubItems ? isExpanded : undefined"
      :title="shell?.collapsed.value && itemLabel ? itemLabel : undefined"
      @click="handleClick"
    >
      <PrSidebarIcon :icon="icon" :active="resolvedActive" />
      <PrSidebarItemBody :label="label" :description="description" :active="resolvedActive" />
      <ChevronDown
        v-if="hasSubItems"
        class="pr-sidebar-item__chevron shrink-0 text-[color:var(--pr-color-text-subtle)] transition-[color,transform] duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)]"
        :class="{ 'rotate-180': isExpanded }"
        aria-hidden="true"
        :size="16"
      />
    </component>

    <PrSidebarItemSubItems v-if="hasSubItems" v-show="isExpanded">
      <slot />
    </PrSidebarItemSubItems>
  </div>
</template>
