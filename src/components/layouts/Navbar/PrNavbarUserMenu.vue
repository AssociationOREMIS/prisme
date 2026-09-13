<script setup lang="ts">
import { ChevronDown, CircleUser } from '@lucide/vue'
import { computed, ref } from 'vue'
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
        class="pr-navbar-user-menu__trigger inline-flex cursor-pointer items-center gap-[var(--pr-space-2)] rounded-[var(--pr-radius-lg)] border-0 bg-transparent px-[var(--pr-space-3)] py-[var(--pr-space-2)] text-[color:var(--pr-color-navbar-text)] transition-[background-color] duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)] hover:bg-[var(--pr-color-navbar-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)]"
      >
        <CircleUser class="shrink-0" :size="22" :stroke-width="1.75" aria-hidden="true" />
        <span class="hidden max-w-[12rem] overflow-hidden text-ellipsis whitespace-nowrap text-[length:var(--pr-font-size-sm)] font-medium md:inline">{{ displayName }}</span>
        <ChevronDown
          class="shrink-0 transition-transform duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)]"
          :class="{ 'rotate-180': open }"
          :size="14"
          aria-hidden="true"
        />
      </button>
    </template>

    <template #default="{ item, separator, itemClass, dangerItemClass, separatorClass }">
      <div class="pr-navbar-user-menu__header mb-[var(--pr-space-1)] border-b border-[var(--pr-color-border)] px-[var(--pr-space-3)] pb-[var(--pr-space-2)]">
        <div class="overflow-hidden text-ellipsis whitespace-nowrap text-[length:var(--pr-font-size-sm)] font-semibold text-[color:var(--pr-color-text)]">{{ displayName }}</div>
        <div v-if="email" class="overflow-hidden text-ellipsis whitespace-nowrap text-[length:var(--pr-font-size-xs)] text-[color:var(--pr-color-text-muted)]">{{ email }}</div>
        <div class="overflow-hidden text-ellipsis whitespace-nowrap text-[length:var(--pr-font-size-xs)] text-[color:var(--pr-color-text-muted)]">{{ rolesLabel }}</div>
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
