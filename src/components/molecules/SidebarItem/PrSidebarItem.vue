<script setup lang="ts">
import { ChevronDown } from '@lucide/vue'
import type { Component } from 'vue'
import { computed, inject, ref, useSlots, watch } from 'vue'
import { PrSidebarIcon } from '../../atoms/SidebarIcon'
import { prAppShellContextKey } from '../../layouts/AppShell/appShellContext'

export interface PrSidebarItemProps {
  as?: string | Component
  href?: string
  icon: Component
  label: string
  description?: string
  active?: boolean
  disabled?: boolean
  expanded?: boolean
  defaultExpanded?: boolean
}

const props = withDefaults(defineProps<PrSidebarItemProps>(), {
  as: undefined,
  href: undefined,
  description: undefined,
  active: false,
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
const internalExpanded = ref(props.defaultExpanded || props.active)
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

watch(
  () => props.active,
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
    class="pr-sidebar-item"
    :class="{
      'pr-sidebar-item--active': active,
      'pr-sidebar-item--disabled': disabled,
      'pr-sidebar-item--with-subitems': hasSubItems,
      'pr-sidebar-item--expanded': isExpanded,
    }"
    :data-expanded="isExpanded ? 'true' : 'false'"
  >
    <component
      :is="componentTag"
      class="pr-sidebar-item__link"
      v-bind="componentAttrs"
      :aria-current="active ? 'page' : undefined"
      :aria-expanded="hasSubItems ? isExpanded : undefined"
      :title="shell?.collapsed.value && itemLabel ? itemLabel : undefined"
      @click="handleClick"
    >
      <PrSidebarIcon :icon="icon" />
      <span class="pr-sidebar-item__body">
        <span class="pr-sidebar-item__label">
          {{ label }}
        </span>
        <span v-if="description" class="pr-sidebar-item__description">{{ description }}</span>
      </span>
      <ChevronDown
        v-if="hasSubItems"
        class="pr-sidebar-item__chevron"
        aria-hidden="true"
        :size="16"
      />
    </component>

    <div v-if="hasSubItems" v-show="isExpanded" class="pr-sidebar-item__subitems">
      <slot />
    </div>
  </div>
</template>
