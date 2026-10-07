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
    class="pr-tabs pr:flex"
    :class="orientation === 'vertical' ? 'pr:flex-row pr:gap-[var(--pr-space-4)]' : 'pr:flex-col'"
    :model-value="modelValue"
    :default-value="defaultValue"
    :orientation="orientation"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <TabsList
      class="pr-tabs__list pr:relative pr:flex pr:shrink-0 pr:border-[var(--pr-color-border)]"
      :class="orientation === 'vertical' ? 'pr:flex-col pr:border-r' : 'pr:flex-row pr:overflow-x-auto pr:border-b'"
    >
      <TabsIndicator
        class="pr-tabs__indicator pr:absolute pr:bg-[var(--pr-color-primary)] pr:transition-all pr:duration-[var(--pr-duration-fast)] pr:ease-[var(--pr-ease-standard)]"
        :class="orientation === 'vertical' ? 'pr:right-0 pr:w-0.5 pr:translate-x-px' : 'pr:bottom-0 pr:h-0.5'"
      />
      <TabsTrigger
        v-for="tab in tabs"
        :key="tab.value"
        class="pr-tabs__trigger pr:relative pr:inline-flex pr:shrink-0 pr:cursor-pointer pr:items-center pr:gap-[var(--pr-space-2)] pr:px-[var(--pr-space-4)] pr:py-[var(--pr-space-3)] pr:text-[length:var(--pr-font-size-sm)] pr:font-semibold pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text-muted)] pr:transition-colors pr:duration-[var(--pr-duration-fast)] pr:ease-[var(--pr-ease-standard)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)] pr:hover:text-[color:var(--pr-color-text)] pr:data-[state=active]:text-[color:var(--pr-color-primary)] pr:data-[disabled]:cursor-not-allowed pr:data-[disabled]:opacity-50"
        :value="tab.value"
        :disabled="tab.disabled"
      >
        {{ tab.label }}
      </TabsTrigger>
    </TabsList>
    <TabsContent
      v-for="tab in tabs"
      :key="tab.value"
      class="pr-tabs__content pr:grow pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)]"
      :value="tab.value"
    >
      <slot :name="tab.value" />
    </TabsContent>
  </TabsRoot>
</template>
