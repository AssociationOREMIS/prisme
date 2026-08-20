<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronLeft, ChevronRight } from '@lucide/vue'

export interface PrCalendarProps {
  modelValue?: string
}

const props = withDefaults(defineProps<PrCalendarProps>(), {
  modelValue: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const cursor = ref(props.modelValue ? new Date(props.modelValue) : new Date())
const formatter = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' })
const weekdays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

const days = computed(() => {
  const year = cursor.value.getFullYear()
  const month = cursor.value.getMonth()
  const first = new Date(year, month, 1)
  const offset = (first.getDay() + 6) % 7
  const count = new Date(year, month + 1, 0).getDate()
  return [
    ...Array.from({ length: offset }, () => ''),
    ...Array.from({ length: count }, (_, index) => String(index + 1)),
  ]
})

const label = computed(() => formatter.format(cursor.value))

function move(delta: number) {
  cursor.value = new Date(cursor.value.getFullYear(), cursor.value.getMonth() + delta, 1)
}

function select(day: string) {
  if (!day) return
  const date = new Date(cursor.value.getFullYear(), cursor.value.getMonth(), Number(day))
  emit('update:modelValue', date.toISOString().slice(0, 10))
}
</script>

<template>
  <div class="pr-calendar grid w-[min(21rem,100%)] gap-[var(--pr-space-3)] rounded-[var(--pr-radius-lg)] border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)] p-[var(--pr-space-4)]">
    <div class="pr-calendar__header flex items-center justify-between gap-[var(--pr-space-3)]">
      <button type="button" class="pr-calendar__nav inline-grid size-8 cursor-pointer place-items-center rounded-[var(--pr-radius-md)] border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)] text-[color:var(--pr-color-text)] hover:bg-[var(--pr-color-surface-subtle)]" aria-label="Mois precedent" @click="move(-1)">
        <ChevronLeft :size="16" />
      </button>
      <strong class="pr-calendar__label capitalize">{{ label }}</strong>
      <button type="button" class="pr-calendar__nav inline-grid size-8 cursor-pointer place-items-center rounded-[var(--pr-radius-md)] border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)] text-[color:var(--pr-color-text)] hover:bg-[var(--pr-color-surface-subtle)]" aria-label="Mois suivant" @click="move(1)">
        <ChevronRight :size="16" />
      </button>
    </div>
    <div class="pr-calendar__grid grid grid-cols-7 gap-[var(--pr-space-1)]">
      <span v-for="weekday in weekdays" :key="weekday" class="pr-calendar__weekday text-center text-[length:var(--pr-font-size-xs)] font-[750] text-[color:var(--pr-color-text-muted)]">{{ weekday }}</span>
      <button
        v-for="(day, index) in days"
        :key="`${day}-${index}`"
        class="pr-calendar__day inline-grid aspect-square min-w-0 cursor-pointer place-items-center rounded-[var(--pr-radius-md)] border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)] text-[length:var(--pr-font-size-sm)] text-[color:var(--pr-color-text)] hover:not-disabled:bg-[var(--pr-color-surface-subtle)] disabled:invisible"
        type="button"
        :disabled="!day"
        @click="select(day)"
      >
        {{ day }}
      </button>
    </div>
  </div>
</template>
