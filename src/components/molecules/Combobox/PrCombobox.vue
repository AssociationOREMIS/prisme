<script setup lang="ts">
import { Check, ChevronDown, X } from '@lucide/vue'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxViewport,
} from 'reka-ui'
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'
import { PrLabel } from '../../atoms/Label'
import { useErrorText, type PrFieldError } from '../../fieldError'
import { usePrMessages } from '../../../i18n/context'
import { useFieldValue } from '../../fieldValue'
import { useLiveAnnouncer } from '../../liveAnnouncer'
import { useControlAttrs } from '../../controlAttrs'
import { warnWithoutName } from '../../accessibleName'

export interface PrComboboxOption {
  label: string
  value: string
  disabled?: boolean
}

export interface PrComboboxProps {
  modelValue?: string | string[]
  defaultValue?: string | string[]
  options?: PrComboboxOption[]
  placeholder?: string
  /** Shown once the field has the focus, where the user types to search (« Rechercher un bénévole »). Defaults to `placeholder`. */
  searchPlaceholder?: string
  label?: string
  hint?: string
  error?: PrFieldError
  disabled?: boolean
  required?: boolean
  multiple?: boolean
  name?: string
  id?: string
  /**
   * Searches on the server as the person types: returns the options for a query. `options` then
   * only gives the labels of the values already selected (`old('city_id')`).
   */
  search?: (query: string, signal: AbortSignal) => Promise<PrComboboxOption[]>
  /**
   * The same from Blade, without JavaScript: `GET search-url?q=...` answers JSON, an array of
   * `{ label, value }` or a Laravel resource collection (`{ data: [...] }`).
   */
  searchUrl?: string
  /** Name of the query parameter sent to `search-url`. */
  searchParam?: string
  /** Characters to type before searching. */
  minChars?: number
  /** Milliseconds without typing before searching. */
  debounce?: number
}

const props = withDefaults(defineProps<PrComboboxProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  options: () => [],
  placeholder: undefined,
  searchPlaceholder: undefined,
  label: undefined,
  hint: undefined,
  error: undefined,
  disabled: false,
  required: false,
  multiple: false,
  name: undefined,
  id: undefined,
  search: undefined,
  searchUrl: undefined,
  searchParam: 'q',
  minChars: 2,
  debounce: 250,
})

warnWithoutName('PrCombobox', props.label)

const messages = usePrMessages()

// `autocomplete`, `aria-*`... reach the search field, class and style stay on the wrapper.
defineOptions({ inheritAttrs: false })
const { rootAttrs, controlAttrs } = useControlAttrs()

// One message, or the first of Laravel's array of messages.
const errorText = useErrorText(() => props.error)

const emit = defineEmits<{
  'update:modelValue': [value: string | string[]]
}>()

const generatedId = useId()
const inputId = computed(() => props.id ?? `pr-combobox-${generatedId}`)
const hintId = computed(() => `${inputId.value}-hint`)
const errorId = computed(() => `${inputId.value}-error`)
// The error, then the hint: the hint stays shown with the error, the format it gives is what
// fixing the error needs (RGAA 11.10).
const describedBy = computed(() => [
  errorText.value ? errorId.value : undefined,
  props.hint ? hintId.value : undefined,
].filter(Boolean).join(' ') || undefined)

// Without a v-model (a plain Blade form), keep the selection locally so it shows and gets
// submitted through the hidden inputs; a real v-model still takes priority.
const { value: currentValue, set: setCurrentValue } = useFieldValue(props, () => (props.multiple ? [] : undefined))

// Server-side search: results replace the options; every label seen is kept, so a selected value
// still shows its label once the results have changed.
const isRemote = computed(() => Boolean(props.search || props.searchUrl))
const remoteOptions = ref<PrComboboxOption[]>([])
const searchState = ref<'idle' | 'short' | 'loading' | 'done' | 'failed'>('short')
const knownLabels = new Map<string, string>()
const visibleOptions = computed(() => (isRemote.value ? remoteOptions.value : props.options))

function remember(options: PrComboboxOption[]) {
  for (const option of options) knownLabels.set(option.value, option.label)
}

watch(() => props.options, remember, { immediate: true })

async function fetchOptions(query: string, signal: AbortSignal): Promise<PrComboboxOption[]> {
  if (props.search) return props.search(query, signal)
  const url = new URL(props.searchUrl as string, window.location.href)
  url.searchParams.set(props.searchParam, query)
  const response = await fetch(url, { headers: { Accept: 'application/json' }, credentials: 'same-origin', signal })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const body = await response.json()
  return (Array.isArray(body) ? body : body.data ?? []) as PrComboboxOption[]
}

let searchTimer: ReturnType<typeof setTimeout> | undefined
let searchController: AbortController | undefined

function onSearchTerm(term: string) {
  if (!isRemote.value) return
  clearTimeout(searchTimer)
  searchController?.abort()
  const query = term.trim()
  if (query.length < props.minChars) {
    remoteOptions.value = []
    searchState.value = 'short'
    return
  }
  searchState.value = 'loading'
  searchTimer = setTimeout(async () => {
    const controller = new AbortController()
    searchController = controller
    try {
      const options = await fetchOptions(query, controller.signal)
      if (controller.signal.aborted) return
      remember(options)
      remoteOptions.value = options
      searchState.value = 'done'
    } catch {
      if (controller.signal.aborted) return
      remoteOptions.value = []
      searchState.value = 'failed'
    }
  }, props.debounce)
}

onBeforeUnmount(() => {
  clearTimeout(searchTimer)
  searchController?.abort()
})

// For screen readers, the number of results once a search is done.
const remoteStatus = computed(() => (searchState.value === 'done' ? messages.combobox.results(remoteOptions.value.length) : remoteMessage.value))

const remoteMessage = computed(() => {
  switch (searchState.value) {
    case 'short': return props.minChars > 1 ? messages.combobox.typeAtLeast(props.minChars) : messages.combobox.typeToSearch
    case 'loading': return messages.combobox.searching
    case 'failed': return messages.combobox.searchFailed
    default: return remoteOptions.value.length ? '' : messages.common.noResults
  }
})

const { message: liveMessage, announce } = useLiveAnnouncer()

function setValue(value: string | string[]) {
  // A value picked in a multiple combobox only shows as a new chip: say it.
  const before = Array.isArray(currentValue.value) ? currentValue.value : []
  if (Array.isArray(value)) {
    const added = value.filter(v => !before.includes(v))
    if (added.length) announce(added.map(v => messages.combobox.selected(labelFor(v))).join(', '))
  }
  setCurrentValue(value)
  emit('update:modelValue', value)
}

/** What PrCombobox reads of reka's ComboboxRoot: its highlighted option and its filtered count. */
interface ComboboxRootExposed {
  highlightedElement?: HTMLElement | null
  filtered?: { count?: number }
}
const rootRef = ref<ComboboxRootExposed | null>(null)
const anchorRef = ref<{ $el: HTMLElement } | null>(null)

// reka points aria-activedescendant at the highlighted option, and keeps doing so once a new
// search has removed it from the list: an id that no longer exists (axe aria-valid-attr-value).
// Checked after each change of the list, the attribute is dropped until an option is highlighted.
const activeDescendant = ref<string>()
const isOpen = ref(false)
async function syncActiveDescendant() {
  await nextTick()
  const element = rootRef.value?.highlightedElement
  activeDescendant.value = isOpen.value && element && element.isConnected && element.id ? element.id : undefined
}
watch(
  [() => rootRef.value?.highlightedElement, visibleOptions, searchState],
  syncActiveDescendant,
  { flush: 'post', immediate: true },
)

// Closed, the list is gone (once its animation ends): no active option to point at.
function onOpenChange(open: boolean) {
  isOpen.value = open
  if (open) void syncActiveDescendant()
  else activeDescendant.value = undefined
}

// The number of options left as the person types, read once they pause.
function onSearchInput(term: string) {
  onSearchTerm(term)
  if (isRemote.value) return
  void nextTick(() => {
    const count = rootRef.value?.filtered?.count
    if (count !== undefined && term.trim() !== '') announce(messages.combobox.results(count), 600)
  })
}

const displayValue = computed(() => (val: string | string[]) => {
  if (Array.isArray(val)) return val.map(labelFor).join(', ')
  return val ? labelFor(val) : ''
})

const isFocused = ref(false)
const fieldPlaceholder = computed(() => {
  const placeholder = props.placeholder ?? messages.common.select
  if (isFocused.value) return props.searchPlaceholder ?? placeholder
  return hasValue.value ? undefined : placeholder
})

const hasValue = computed(() => {
  if (Array.isArray(currentValue.value)) return currentValue.value.length > 0
  return Boolean(currentValue.value)
})

function clearValueAndFocus() {
  setValue(props.multiple ? [] : '')
  // The clear button disappears with the value: the focus goes back to the field.
  void nextTick(() => document.getElementById(inputId.value)?.focus())
}

function removeValue(value: string) {
  if (!Array.isArray(currentValue.value)) return
  const index = currentValue.value.indexOf(value)
  setValue(currentValue.value.filter(v => v !== value))
  announce(messages.combobox.removed(labelFor(value)))
  // The chip's button had the focus and is gone: the next chip's button takes it, or the previous
  // one, or the field (the focus fell on <body> otherwise).
  void nextTick(() => {
    const anchor = anchorRef.value?.$el as HTMLElement | undefined
    const buttons = anchor ? Array.from(anchor.querySelectorAll<HTMLElement>('.pr-combobox__tag-remove')) : []
    const target = buttons[index] ?? buttons[index - 1] ?? document.getElementById(inputId.value)
    target?.focus()
  })
}

function labelFor(value: string) {
  return props.options?.find(o => o.value === value)?.label ?? knownLabels.get(value) ?? value
}
</script>

<template>
  <div v-bind="rootAttrs()" class="pr-combobox pr:grid pr:content-start pr:gap-[var(--pr-space-2)] pr:text-[color:var(--pr-color-text)]">
    <PrLabel v-if="label" :for="inputId" :required="required" :disabled="disabled">{{ label }}</PrLabel>
    <ComboboxRoot
      ref="rootRef"
      class="pr:relative"
      :model-value="currentValue"
      :multiple="multiple"
      :disabled="disabled"
      :ignore-filter="isRemote"
      @update:open="onOpenChange"
      @update:model-value="setValue($event as string | string[])"
    >
      <ComboboxAnchor
        ref="anchorRef"
        class="pr-combobox__anchor pr:inline-flex pr:min-h-[2.375rem] pr:w-full pr:flex-wrap pr:items-center pr:gap-[var(--pr-space-2)] pr:rounded-[var(--pr-radius-md)] pr:border pr:border-[var(--pr-color-border-strong)] pr:bg-[var(--pr-color-surface)] pr:px-[var(--pr-space-3)] pr:py-[var(--pr-space-1)] pr:focus-within:outline-2 pr:focus-within:outline-offset-2 pr:focus-within:outline-[var(--pr-color-focus)]"
        :class="{ 'pr:border-[var(--pr-color-danger)]': Boolean(errorText) }"
      >
        <span
          v-for="value in multiple && Array.isArray(currentValue) ? currentValue : []"
          :key="value"
          class="pr-combobox__tag pr:inline-flex pr:items-center pr:gap-[var(--pr-space-1)] pr:rounded-[var(--pr-radius-sm)] pr:bg-[var(--pr-color-surface-subtle)] pr:px-[var(--pr-space-2)] pr:py-0.5 pr:text-[length:var(--pr-font-size-xs)] pr:font-semibold pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text)]"
        >
          {{ labelFor(value) }}
          <button
            v-if="!disabled"
            type="button"
            class="pr-combobox__tag-remove pr:-my-1 pr:-mr-1.5 pr:inline-grid pr:size-6 pr:place-items-center pr:rounded-[0.25rem] pr:text-[color:var(--pr-color-text-muted)] pr:transition-colors pr:hover:text-[color:var(--pr-color-text)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)]"
            :aria-label="messages.combobox.remove(labelFor(value))"
            @click.stop="removeValue(value)"
          >
            <X :size="10" aria-hidden="true" />
          </button>
        </span>
        <ComboboxInput
          v-bind="controlAttrs()"
          :id="inputId"
          class="pr-combobox__input pr:min-w-0 pr:grow pr:border-0 pr:bg-transparent pr:py-[var(--pr-space-2)] pr:text-[length:var(--pr-font-size-md)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text)] pr:outline-none pr:placeholder:text-[color:var(--pr-color-text-subtle)] pr:disabled:cursor-not-allowed"
          :display-value="multiple ? undefined : displayValue"
          :placeholder="fieldPlaceholder"
          :required="required && !hasValue"
          :aria-required="required || undefined"
          :aria-invalid="errorText ? 'true' : undefined"
          :aria-describedby="describedBy"
          :aria-activedescendant="activeDescendant"
          @update:model-value="onSearchInput"
          @focus="isFocused = true"
          @blur="isFocused = false"
        />
        <button
          v-if="hasValue && !disabled"
          type="button"
          class="pr-combobox__clear pr:inline-grid pr:size-6 pr:shrink-0 pr:place-items-center pr:rounded-[0.25rem] pr:text-[color:var(--pr-color-text-muted)] pr:transition-colors pr:hover:text-[color:var(--pr-color-text)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)]"
          :aria-label="messages.combobox.clear"
          @click.stop="clearValueAndFocus"
        >
          <X :size="14" aria-hidden="true" />
        </button>
        <ChevronDown
          class="pr-combobox__icon pr:shrink-0 pr:text-[color:var(--pr-color-text-muted)]"
          :size="16"
          aria-hidden="true"
        />
      </ComboboxAnchor>
      <ComboboxPortal>
        <ComboboxContent
          class="pr-combobox__content pr:z-[95] pr:max-h-[min(20rem,calc(100vh-var(--pr-space-8)))] pr:w-[var(--reka-combobox-trigger-width)] pr:overflow-hidden pr:rounded-[var(--pr-radius-lg)] pr:border pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface)] pr:text-[color:var(--pr-color-text)] pr:shadow-[var(--pr-shadow-md)] pr:data-[state=open]:animate-[pr-floating-in_var(--pr-duration-fast)_var(--pr-ease-standard)] pr:data-[state=closed]:animate-[pr-floating-out_var(--pr-duration-fast)_var(--pr-ease-standard)] pr:data-[side=top]:origin-bottom pr:data-[side=bottom]:origin-top"
          position="popper"
          :side-offset="8"
        >
          <ComboboxViewport class="pr-combobox__viewport pr:p-[var(--pr-space-2)]">
            <!-- Server-side search says where it stands: type more, searching, no result, failure.
                 A plain div in the listbox; screen readers hear it from the status region below. -->
            <div v-if="isRemote && remoteMessage" class="pr-combobox__status pr:py-[var(--pr-space-4)] pr:text-center pr:text-[length:var(--pr-font-size-sm)] pr:text-[color:var(--pr-color-text-muted)]">
              {{ remoteMessage }}
            </div>
            <ComboboxEmpty v-if="!isRemote" class="pr-combobox__empty pr:py-[var(--pr-space-4)] pr:text-center pr:text-[length:var(--pr-font-size-sm)] pr:text-[color:var(--pr-color-text-muted)]">
              {{ messages.common.noResults }}
            </ComboboxEmpty>
            <ComboboxItem
              v-for="option in visibleOptions"
              :key="option.value"
              class="pr-combobox__item pr:relative pr:flex pr:min-h-9 pr:cursor-pointer pr:items-center pr:rounded-[var(--pr-radius-md)] pr:py-0 pr:pr-[var(--pr-space-8)] pr:pl-[var(--pr-space-3)] pr:text-[length:var(--pr-font-size-sm)] pr:font-semibold pr:leading-[var(--pr-line-height-tight)] pr:data-[highlighted]:bg-[var(--pr-color-surface-subtle)] pr:data-[highlighted]:outline-solid pr:data-[highlighted]:outline-2 pr:data-[highlighted]:-outline-offset-2 pr:data-[highlighted]:outline-[var(--pr-color-focus)] pr:data-[disabled]:cursor-not-allowed pr:data-[disabled]:opacity-50"
              :value="option.value"
              :disabled="option.disabled"
            >
              {{ option.label }}
              <ComboboxItemIndicator class="pr-combobox__item-indicator pr:absolute pr:right-[var(--pr-space-3)] pr:inline-flex pr:text-[color:var(--pr-color-primary)]">
                <Check :size="14" aria-hidden="true" />
              </ComboboxItemIndicator>
            </ComboboxItem>
          </ComboboxViewport>
        </ComboboxContent>
      </ComboboxPortal>
    </ComboboxRoot>
    <p v-if="isRemote" class="pr:sr-only" role="status">{{ remoteStatus }}</p>
    <p class="pr:sr-only" role="status">{{ liveMessage }}</p>
    <!-- ComboboxInput only ever carries the search text, not the selected
         value(s), so native form submission goes through these hidden inputs. -->
    <template v-if="name">
      <input v-if="!multiple" type="hidden" :name="name" :value="typeof currentValue === 'string' ? currentValue : ''">
      <input v-for="value in Array.isArray(currentValue) ? currentValue : []" v-else :key="value" type="hidden" :name="name" :value="value">
    </template>
    <p v-if="hint" :id="hintId" class="pr-field-message pr:m-0 pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text-muted)]">{{ hint }}</p>
    <p v-if="errorText" :id="errorId" class="pr-field-message pr-field-message--error pr:m-0 pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-danger)]">{{ errorText }}</p>
  </div>
</template>
