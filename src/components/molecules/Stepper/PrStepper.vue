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
  steps: PrStep[]
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
  <StepperRoot
    class="pr-stepper flex"
    :class="orientation === 'vertical' ? 'flex-col gap-0' : 'flex-row items-start'"
    :model-value="modelValue"
    :default-value="defaultValue"
    :linear="linear"
    :orientation="orientation"
    @update:model-value="(v) => v !== undefined && emit('update:modelValue', v)"
  >
    <StepperItem
      v-for="(step, index) in steps"
      :key="index"
      class="pr-stepper__item group/item flex items-center"
      :class="orientation === 'vertical' ? 'flex-row gap-[var(--pr-space-3)]' : 'flex-col'"
      :step="index + 1"
      :disabled="step.disabled"
    >
      <div
        class="flex items-center"
        :class="orientation === 'vertical' ? 'flex-col' : 'flex-row'"
      >
        <StepperTrigger
          class="pr-stepper__trigger flex cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)] group-data-[disabled]/item:cursor-not-allowed group-data-[disabled]/item:opacity-50"
          as-child
        >
          <StepperIndicator
            class="pr-stepper__indicator flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-[length:var(--pr-font-size-sm)] font-semibold transition-colors duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)] group-data-[state=active]/item:border-[var(--pr-color-primary)] group-data-[state=active]/item:bg-[var(--pr-color-primary)] group-data-[state=active]/item:text-white group-data-[state=completed]/item:border-[var(--pr-color-primary)] group-data-[state=completed]/item:bg-[var(--pr-color-primary)] group-data-[state=completed]/item:text-white group-data-[state=incomplete]/item:border-[var(--pr-color-border-strong)] group-data-[state=incomplete]/item:bg-[var(--pr-color-surface)] group-data-[state=incomplete]/item:text-[color:var(--pr-color-text-muted)]"
          >
            <Check :size="14" aria-hidden="true" class="hidden group-data-[state=completed]/item:block" />
            <span class="group-data-[state=completed]/item:hidden">{{ index + 1 }}</span>
          </StepperIndicator>
        </StepperTrigger>
        <StepperSeparator
          v-if="index < steps.length - 1"
          class="pr-stepper__separator block bg-[var(--pr-color-border)] transition-colors duration-[var(--pr-duration-fast)] group-data-[state=completed]/item:bg-[var(--pr-color-primary)]"
          :class="orientation === 'vertical' ? 'ms-[calc(1rem-1px)] mt-1 h-8 w-0.5' : 'ms-1 h-0.5 w-12'"
        />
      </div>
      <div
        class="pr-stepper__content"
        :class="orientation === 'vertical' ? 'py-[var(--pr-space-2)]' : 'mt-[var(--pr-space-2)] text-center'"
      >
        <StepperTitle
          class="pr-stepper__title text-[length:var(--pr-font-size-sm)] font-semibold leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-text)] group-data-[state=incomplete]/item:text-[color:var(--pr-color-text-muted)]"
        >
          {{ step.label }}
        </StepperTitle>
        <StepperDescription
          v-if="step.description"
          class="pr-stepper__description mt-0.5 text-[length:var(--pr-font-size-xs)] leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-text-muted)]"
        >
          {{ step.description }}
        </StepperDescription>
      </div>
    </StepperItem>
  </StepperRoot>
</template>
