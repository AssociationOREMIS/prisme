<script setup lang="ts">
import {
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from 'reka-ui'

export interface PrTab {
  value: string
  label: string
  disabled?: boolean
}

export interface PrTabsProps {
  modelValue?: string
  defaultValue?: string
  tabs: PrTab[]
  orientation?: 'horizontal' | 'vertical'
}

withDefaults(defineProps<PrTabsProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  tabs: () => [],
  orientation: 'horizontal',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <TabsRoot
    class="pr-tabs flex"
    :class="orientation === 'vertical' ? 'flex-row gap-[var(--pr-space-4)]' : 'flex-col'"
    :model-value="modelValue"
    :default-value="defaultValue"
    :orientation="orientation"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <TabsList
      class="pr-tabs__list relative flex shrink-0 border-[var(--pr-color-border)]"
      :class="orientation === 'vertical' ? 'flex-col border-r' : 'flex-row overflow-x-auto border-b'"
    >
      <TabsIndicator
        class="pr-tabs__indicator absolute bg-[var(--pr-color-primary)] transition-all duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)]"
        :class="orientation === 'vertical' ? 'right-0 w-0.5 translate-x-px' : 'bottom-0 h-0.5'"
      />
      <TabsTrigger
        v-for="tab in tabs"
        :key="tab.value"
        class="pr-tabs__trigger relative inline-flex shrink-0 cursor-pointer items-center gap-[var(--pr-space-2)] px-[var(--pr-space-4)] py-[var(--pr-space-3)] text-[length:var(--pr-font-size-sm)] font-semibold leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-text-muted)] transition-colors duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)] hover:text-[color:var(--pr-color-text)] data-[state=active]:text-[color:var(--pr-color-primary)] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
        :value="tab.value"
        :disabled="tab.disabled"
      >
        {{ tab.label }}
      </TabsTrigger>
    </TabsList>
    <TabsContent
      v-for="tab in tabs"
      :key="tab.value"
      class="pr-tabs__content grow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)]"
      :value="tab.value"
    >
      <slot :name="tab.value" />
    </TabsContent>
  </TabsRoot>
</template>
