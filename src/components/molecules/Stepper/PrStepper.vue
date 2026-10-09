<script setup lang="ts">
import { Check } from '@lucide/vue'
import {
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperRoot,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from 'reka-ui'

export interface PrStep {
  label: string
  description?: string
  disabled?: boolean
}

export interface PrStepperProps {
  modelValue?: number
  defaultValue?: number
  steps?: PrStep[]
  orientation?: 'horizontal' | 'vertical'
  linear?: boolean
}

withDefaults(defineProps<PrStepperProps>(), {
  modelValue: undefined,
  defaultValue: 1,
  steps: () => [],
  orientation: 'horizontal',
  linear: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()
</script>

<template>
  <!-- Horizontal steps keep one row and scroll sideways on a narrow screen instead of overflowing
       (p-1 keeps the focus rings inside the scroll area). -->
  <StepperRoot
    class="pr-stepper pr:flex pr:max-w-full"
    :class="orientation === 'vertical' ? 'pr:flex-col pr:gap-0' : 'pr:flex-row pr:items-start pr:overflow-x-auto pr:p-1'"
    :model-value="modelValue"
    :default-value="defaultValue"
    :linear="linear"
    :orientation="orientation"
    @update:model-value="(v) => v !== undefined && emit('update:modelValue', v)"
  >
    <StepperItem
      v-for="(step, index) in steps"
      :key="index"
      class="pr-stepper__item pr:group/item pr:flex pr:items-center"
      :class="orientation === 'vertical' ? 'pr:flex-row pr:gap-[var(--pr-space-3)]' : 'pr:flex-col'"
      :step="index + 1"
      :disabled="step.disabled"
    >
      <div
        class="pr:flex pr:items-center"
        :class="orientation === 'vertical' ? 'pr:flex-col' : 'pr:flex-row'"
      >
        <!-- A real <button> around the indicator (as-child made the indicator a focusable <span>
             with no role). Indicator text uses primary-contrast: white was invisible on the
             dark theme's near-white primary. -->
        <StepperTrigger
          class="pr-stepper__trigger pr:flex pr:cursor-pointer pr:items-center pr:justify-center pr:rounded-full pr:border-0 pr:bg-transparent pr:p-0 pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)] pr:group-data-[disabled]/item:cursor-not-allowed pr:group-data-[disabled]/item:opacity-50"
        >
          <StepperIndicator
            class="pr-stepper__indicator pr:flex pr:h-8 pr:w-8 pr:shrink-0 pr:items-center pr:justify-center pr:rounded-full pr:border-2 pr:text-[length:var(--pr-font-size-sm)] pr:font-semibold pr:transition-colors pr:duration-[var(--pr-duration-fast)] pr:ease-[var(--pr-ease-standard)] pr:group-data-[state=active]/item:border-[var(--pr-color-primary)] pr:group-data-[state=active]/item:bg-[var(--pr-color-primary)] pr:group-data-[state=active]/item:text-[color:var(--pr-color-primary-contrast)] pr:group-data-[state=completed]/item:border-[var(--pr-color-primary)] pr:group-data-[state=completed]/item:bg-[var(--pr-color-primary)] pr:group-data-[state=completed]/item:text-[color:var(--pr-color-primary-contrast)] pr:group-data-[state=incomplete]/item:border-[var(--pr-color-border-strong)] pr:group-data-[state=incomplete]/item:bg-[var(--pr-color-surface)] pr:group-data-[state=incomplete]/item:text-[color:var(--pr-color-text-muted)]"
          >
            <Check :size="14" aria-hidden="true" class="pr:hidden pr:group-data-[state=completed]/item:block" />
            <span class="pr:group-data-[state=completed]/item:hidden">{{ index + 1 }}</span>
          </StepperIndicator>
        </StepperTrigger>
        <StepperSeparator
          v-if="index < steps.length - 1"
          class="pr-stepper__separator pr:block pr:bg-[var(--pr-color-border)] pr:transition-colors pr:duration-[var(--pr-duration-fast)] pr:group-data-[state=completed]/item:bg-[var(--pr-color-primary)]"
          :class="orientation === 'vertical' ? 'pr:ms-[calc(1rem-1px)] pr:mt-1 pr:h-8 pr:w-0.5' : 'pr:ms-1 pr:h-0.5 pr:w-12'"
        />
      </div>
      <div
        class="pr-stepper__content"
        :class="orientation === 'vertical' ? 'pr:py-[var(--pr-space-2)]' : 'pr:mt-[var(--pr-space-2)] pr:text-center'"
      >
        <StepperTitle
          class="pr-stepper__title pr:text-[length:var(--pr-font-size-sm)] pr:font-semibold pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text)] pr:group-data-[state=incomplete]/item:text-[color:var(--pr-color-text-muted)]"
        >
          {{ step.label }}
        </StepperTitle>
        <StepperDescription
          v-if="step.description"
          class="pr-stepper__description pr:mt-0.5 pr:text-[length:var(--pr-font-size-xs)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text-muted)]"
        >
          {{ step.description }}
        </StepperDescription>
      </div>
    </StepperItem>
  </StepperRoot>
</template>
