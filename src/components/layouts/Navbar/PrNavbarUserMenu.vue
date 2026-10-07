<script setup lang="ts">
import { ChevronDown, CircleUser } from '@lucide/vue'
import { computed, ref, type Component } from 'vue'
import PrDropdownMenu from '../../molecules/DropdownMenu/PrDropdownMenu.vue'

export interface PrNavbarUserMenuProps {
  /** Full display name, shown in the trigger and in the dropdown header. */
  name: string
  /** Appended in parentheses after the name (e.g. a member/staff identifier). */
  identifier?: string
  /** Shown as a muted line in the dropdown header. */
  email?: string
  /** Joined with " | " as the last muted line in the dropdown header. */
  roles?: string[]
  /** Shown instead of `roles` when it's empty. */
  rolesFallback?: string
}

const props = withDefaults(defineProps<PrNavbarUserMenuProps>(), {
  identifier: undefined,
  email: undefined,
  roles: () => [],
  rolesFallback: 'Rôle inconnu',
})

// Declared rather than inferred: the inferred slot type copied reka's whole DropdownMenuItem
// type into the published .d.ts, which fails type checking in apps with other Vue/TS versions.
defineSlots<{
  header?: () => unknown
  default?: (props: {
    item: Component
    separator: Component
    itemClass: string
    dangerItemClass: string
    separatorClass: string
  }) => unknown
}>()

const open = ref(false)

const displayName = computed(() => (
  props.identifier ? `${props.name} (${props.identifier})` : props.name
))
const rolesLabel = computed(() => (
  props.roles.length ? props.roles.join(' | ') : props.rolesFallback
))
</script>

<template>
  <PrDropdownMenu v-model:open="open" side="bottom" align="end">
    <template #trigger>
      <button
        type="button"
        class="pr-navbar-user-menu__trigger pr:inline-flex pr:cursor-pointer pr:items-center pr:gap-[var(--pr-space-2)] pr:rounded-[var(--pr-radius-lg)] pr:border-0 pr:bg-transparent pr:px-[var(--pr-space-3)] pr:py-[var(--pr-space-2)] pr:text-[color:var(--pr-color-navbar-text)] pr:transition-[background-color] pr:duration-[var(--pr-duration-fast)] pr:ease-[var(--pr-ease-standard)] pr:hover:bg-[var(--pr-color-navbar-muted)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)]"
      >
        <CircleUser class="pr:shrink-0" :size="22" :stroke-width="1.75" aria-hidden="true" />
        <span class="pr:hidden pr:max-w-[12rem] pr:overflow-hidden pr:text-ellipsis pr:whitespace-nowrap pr:text-[length:var(--pr-font-size-sm)] pr:font-medium pr:md:inline">{{ displayName }}</span>
        <ChevronDown
          class="pr:shrink-0 pr:transition-transform pr:duration-[var(--pr-duration-fast)] pr:ease-[var(--pr-ease-standard)]"
          :class="{ 'pr:rotate-180': open }"
          :size="14"
          aria-hidden="true"
        />
      </button>
    </template>

    <template #default="{ item, separator, itemClass, dangerItemClass, separatorClass }">
      <div class="pr-navbar-user-menu__header pr:mb-[var(--pr-space-1)] pr:border-b pr:border-[var(--pr-color-border)] pr:px-[var(--pr-space-3)] pr:pb-[var(--pr-space-2)]">
        <div class="pr:overflow-hidden pr:text-ellipsis pr:whitespace-nowrap pr:text-[length:var(--pr-font-size-sm)] pr:font-semibold pr:text-[color:var(--pr-color-text)]">{{ displayName }}</div>
        <div v-if="email" class="pr:overflow-hidden pr:text-ellipsis pr:whitespace-nowrap pr:text-[length:var(--pr-font-size-xs)] pr:text-[color:var(--pr-color-text-muted)]">{{ email }}</div>
        <div class="pr:overflow-hidden pr:text-ellipsis pr:whitespace-nowrap pr:text-[length:var(--pr-font-size-xs)] pr:text-[color:var(--pr-color-text-muted)]">{{ rolesLabel }}</div>
        <!-- Extra lines of the header (e.g. the role in the current app), below the roles. -->
        <slot name="header" />
      </div>

      <slot
        :item="item"
        :separator="separator"
        :item-class="itemClass"
        :danger-item-class="dangerItemClass"
        :separator-class="separatorClass"
      />
    </template>
  </PrDropdownMenu>
</template>
