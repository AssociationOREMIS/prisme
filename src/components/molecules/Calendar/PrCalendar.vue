<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue'
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import { parseIsoDate, toIsoDate } from './utils'

export interface PrCalendarProps {
  modelValue?: string
  defaultValue?: string
}

const props = withDefaults(defineProps<PrCalendarProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// Date grid following the WAI-ARIA pattern: each day is named by its full date, the chosen day
// is aria-selected, today is aria-current, and only one day is in the tab order (roving
// tabindex) so arrow keys move inside the month instead of tabbing through 31 buttons.

const internalValue = ref(props.modelValue ?? props.defaultValue)

watch(() => props.modelValue, (value) => {
  if (value !== undefined) internalValue.value = value
})

const selected = computed(() => props.modelValue ?? internalValue.value)
const today = toIsoDate(new Date())

const focused = ref<Date>(selected.value ? parseIsoDate(selected.value) : new Date())
const cursor = computed(() => new Date(focused.value.getFullYear(), focused.value.getMonth(), 1))

const monthFormatter = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' })
const dayFormatter = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
const weekdays = [
  ['Lun', 'lundi'], ['Mar', 'mardi'], ['Mer', 'mercredi'], ['Jeu', 'jeudi'],
  ['Ven', 'vendredi'], ['Sam', 'samedi'], ['Dim', 'dimanche'],
]

const labelId = `pr-calendar-${useId()}-label`
const label = computed(() => monthFormatter.format(cursor.value))

interface CalendarDay {
  date: Date
  iso: string
}

/** The month as weeks of 7 slots (Monday first), `null` for the slots outside the month. */
const weeks = computed(() => {
  const year = cursor.value.getFullYear()
  const month = cursor.value.getMonth()
  const offset = (cursor.value.getDay() + 6) % 7
  const count = new Date(year, month + 1, 0).getDate()
  const slots: Array<CalendarDay | null> = Array.from({ length: offset }, () => null)
  for (let day = 1; day <= count; day++) {
    const date = new Date(year, month, day)
    slots.push({ date, iso: toIsoDate(date) })
  }
  while (slots.length % 7 !== 0) slots.push(null)
  return Array.from({ length: slots.length / 7 }, (_, week) => slots.slice(week * 7, week * 7 + 7))
})

const focusedIso = computed(() => toIsoDate(focused.value))
const gridRef = ref<HTMLElement | null>(null)

/** The same day of the month in another month, or its last day (31 January -> 28 February). */
function sameDayIn(year: number, month: number, day: number): Date {
  const lastDay = new Date(year, month + 1, 0).getDate()
  return new Date(year, month, Math.min(day, lastDay))
}

async function focusDay(date: Date) {
  focused.value = date
  await nextTick()
  gridRef.value?.querySelector<HTMLButtonElement>(`[data-date="${toIsoDate(date)}"]`)?.focus()
}

function move(months: number) {
  const date = focused.value
  focused.value = sameDayIn(date.getFullYear(), date.getMonth() + months, date.getDate())
}

function select(day: CalendarDay) {
  internalValue.value = day.iso
  focused.value = day.date
  emit('update:modelValue', day.iso)
}

function onKeydown(event: KeyboardEvent) {
  const date = focused.value
  const shift = (days: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
  const weekday = (date.getDay() + 6) % 7
  const months = event.shiftKey ? 12 : 1
  const byKey: Record<string, () => Date> = {
    ArrowLeft: () => shift(-1),
    ArrowRight: () => shift(1),
    ArrowUp: () => shift(-7),
    ArrowDown: () => shift(7),
    Home: () => shift(-weekday),
    End: () => shift(6 - weekday),
    PageUp: () => sameDayIn(date.getFullYear(), date.getMonth() - months, date.getDate()),
    PageDown: () => sameDayIn(date.getFullYear(), date.getMonth() + months, date.getDate()),
  }
  const target = byKey[event.key]
  if (!target) return
  event.preventDefault()
  void focusDay(target())
}
</script>

<template>
  <div class="pr-calendar grid w-[min(21rem,100%)] gap-[var(--pr-space-3)] rounded-[var(--pr-radius-lg)] border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)] p-[var(--pr-space-4)]">
    <div class="pr-calendar__header flex items-center justify-between gap-[var(--pr-space-3)]">
      <button type="button" class="pr-calendar__nav inline-grid size-8 cursor-pointer place-items-center rounded-[var(--pr-radius-md)] border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)] text-[color:var(--pr-color-text)] hover:bg-[var(--pr-color-surface-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)]" aria-label="Mois précédent" @click="move(-1)">
        <ChevronLeft :size="16" aria-hidden="true" />
      </button>
      <strong :id="labelId" class="pr-calendar__label capitalize" aria-live="polite">{{ label }}</strong>
      <button type="button" class="pr-calendar__nav inline-grid size-8 cursor-pointer place-items-center rounded-[var(--pr-radius-md)] border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)] text-[color:var(--pr-color-text)] hover:bg-[var(--pr-color-surface-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)]" aria-label="Mois suivant" @click="move(1)">
        <ChevronRight :size="16" aria-hidden="true" />
      </button>
    </div>
    <table ref="gridRef" class="pr-calendar__grid w-full border-separate border-spacing-[var(--pr-space-1)]" role="grid" :aria-labelledby="labelId" @keydown="onKeydown">
      <thead>
        <tr>
          <th v-for="[short, long] in weekdays" :key="short" scope="col" :abbr="long" class="pr-calendar__weekday p-0 text-center text-[length:var(--pr-font-size-xs)] font-[750] text-[color:var(--pr-color-text-muted)]">{{ short }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(week, weekIndex) in weeks" :key="weekIndex">
          <td v-for="(day, dayIndex) in week" :key="day?.iso ?? `empty-${weekIndex}-${dayIndex}`" class="p-0" :aria-selected="day ? day.iso === selected : undefined">
            <button
              v-if="day"
              type="button"
              class="pr-calendar__day inline-grid aspect-square w-full min-w-0 cursor-pointer place-items-center rounded-[var(--pr-radius-md)] border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)] text-[length:var(--pr-font-size-sm)] text-[color:var(--pr-color-text)] hover:bg-[var(--pr-color-surface-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)] aria-[current=date]:border-[var(--pr-color-primary)] aria-[current=date]:font-[750] data-[selected=true]:border-[var(--pr-color-primary)] data-[selected=true]:bg-[var(--pr-color-primary)] data-[selected=true]:text-[color:var(--pr-color-primary-contrast)] data-[selected=true]:hover:bg-[var(--pr-color-primary-hover)]"
              :data-date="day.iso"
              :data-selected="day.iso === selected"
              :aria-label="dayFormatter.format(day.date)"
              :aria-current="day.iso === today ? 'date' : undefined"
              :tabindex="day.iso === focusedIso ? 0 : -1"
              @click="select(day)"
              @focus="focused = day.date"
            >
              {{ day.date.getDate() }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
