<script setup lang="ts">
import { X } from '@lucide/vue'
import { computed, nextTick, ref, useId } from 'vue'
import { useErrorText, type PrFieldError } from '../../fieldError'
import { usePrMessages } from '../../../i18n/context'
import { useFieldValue } from '../../fieldValue'
import { useLiveAnnouncer } from '../../liveAnnouncer'
import { warnWithoutName } from '../../accessibleName'

export interface PrTagInputProps {
  modelValue?: string[]
  defaultValue?: string[]
  label?: string
  hint?: string
  error?: PrFieldError
  disabled?: boolean
  required?: boolean
  placeholder?: string
  maxTags?: number
  id?: string
  name?: string
}

const props = withDefaults(defineProps<PrTagInputProps>(), {
  modelValue: undefined,
  defaultValue: () => [],
  label: undefined,
  hint: undefined,
  error: undefined,
  disabled: false,
  required: false,
  placeholder: undefined,
  maxTags: undefined,
  id: undefined,
  name: undefined,
})

warnWithoutName('PrTagInput', props.label)

const messages = usePrMessages()

// One message, or the first of Laravel's array of messages.
const errorText = useErrorText(() => props.error)

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const generatedId = useId()
const inputId = computed(() => props.id ?? `pr-tag-input-${generatedId}`)
const hintId = computed(() => `${inputId.value}-hint`)
const errorId = computed(() => `${inputId.value}-error`)
const limitId = computed(() => `${inputId.value}-limit`)
// The error, then the hint, which stays shown with the error (RGAA 11.10), then the limit once reached.
const describedBy = computed(() => [
  errorText.value ? errorId.value : undefined,
  props.hint ? hintId.value : undefined,
  canAddMore.value ? undefined : limitId.value,
].filter(Boolean).join(' ') || undefined)
const rootRef = ref<HTMLElement | null>(null)
const { message: liveMessage, announce } = useLiveAnnouncer()
const inputRef = ref<HTMLInputElement | null>(null)
const inputValue = ref('')

// Without a v-model (a plain Blade form), `modelValue` stays undefined: keep the tags locally
// so they show and get submitted, while a real v-model still takes priority.
const { value: currentTags, set: setCurrentTags } = useFieldValue(props, () => [])
const tags = computed(() => currentTags.value ?? [])

function setTags(next: string[]) {
  setCurrentTags(next)
  emit('update:modelValue', next)
}

const canAddMore = computed(() =>
  props.maxTags === undefined || tags.value.length < props.maxTags,
)

function focusInput() {
  if (!props.disabled) inputRef.value?.focus()
}

function addTag(raw: string) {
  const tag = raw.trim()
  if (!tag || !canAddMore.value) return
  if (tags.value.some(t => t.toLowerCase() === tag.toLowerCase())) return
  setTags([...tags.value, tag])
  announce(messages.tagInput.added(tag))
}

function addTags(rawList: string[]) {
  let next = [...tags.value]
  for (const raw of rawList) {
    const tag = raw.trim()
    if (!tag) continue
    if (props.maxTags !== undefined && next.length >= props.maxTags) break
    if (next.some(t => t.toLowerCase() === tag.toLowerCase())) continue
    next = [...next, tag]
  }
  const added = next.slice(tags.value.length)
  setTags(next)
  if (added.length) announce(added.map(tag => messages.tagInput.added(tag)).join(', '))
}

function removeTag(index: number) {
  const updated = [...tags.value]
  const [removed] = updated.splice(index, 1)
  setTags(updated)
  if (removed !== undefined) announce(messages.tagInput.removed(removed))
}

// Removed with its button, the tag took the focus with it: the next tag's button gets it, or the
// previous one, or the field (the focus fell on <body> otherwise).
function removeTagAndFocus(index: number) {
  removeTag(index)
  void nextTick(() => {
    const buttons = Array.from(rootRef.value?.querySelectorAll<HTMLElement>('.pr-tag-input__remove') ?? [])
    const target = buttons[index] ?? buttons[index - 1] ?? inputRef.value
    target?.focus()
  })
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ',') {
    event.preventDefault()
    addTag(inputValue.value)
    inputValue.value = ''
  }
  else if (event.key === 'Backspace' && inputValue.value === '') {
    if (tags.value.length > 0) removeTag(tags.value.length - 1)
  }
}

function onBlur() {
  if (inputValue.value.trim()) addTag(inputValue.value)
  inputValue.value = ''
}

const PASTE_SPLIT_PATTERN = /[,;\n\t]+/

function onPaste(event: ClipboardEvent) {
  const text = event.clipboardData?.getData('text') ?? ''
  const tokens = text.split(PASTE_SPLIT_PATTERN).map(t => t.trim()).filter(Boolean)
  if (tokens.length <= 1) return
  event.preventDefault()
  addTags(tokens)
  inputValue.value = ''
}

// The template root is a wrapper <div>, not the draft <input> — forward
// fallthrough attrs (autocomplete, data-*, ...) to that control.
defineOptions({ inheritAttrs: false })
</script>

<template>
  <div ref="rootRef" class="pr-tag-input pr:grid pr:content-start pr:gap-[var(--pr-space-2)] pr:text-[color:var(--pr-color-text)]">
    <label
      v-if="label"
      class="pr-tag-input__label pr:inline-flex pr:w-fit pr:items-baseline pr:gap-[var(--pr-space-1)] pr:text-[length:var(--pr-font-size-sm)] pr:font-semibold pr:leading-[var(--pr-line-height-tight)]"
      :for="inputId"
    >
      <span>{{ label }}</span>
      <span v-if="required" class="pr:text-[color:var(--pr-color-danger)]" aria-hidden="true">*</span>
    </label>
    <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/no-static-element-interactions -- a mouse shortcut to the inner input, which keyboard users reach directly -->
    <div
      class="pr-tag-input__field pr:flex pr:min-h-[2.375rem] pr:w-full pr:flex-wrap pr:items-center pr:gap-[var(--pr-space-1)] pr:rounded-[var(--pr-radius-md)] pr:border pr:border-[var(--pr-color-border-strong)] pr:bg-[var(--pr-color-surface)] pr:px-[var(--pr-space-2)] pr:py-[var(--pr-space-1)] pr:transition-[border-color] pr:duration-[var(--pr-duration-fast)] pr:ease-[var(--pr-ease-standard)] pr:focus-within:outline-2 pr:focus-within:outline-offset-2 pr:focus-within:outline-[var(--pr-color-focus)]"
      :class="{
        'pr:border-[var(--pr-color-danger)]': Boolean(errorText),
        'pr:cursor-text': !disabled,
        'pr:cursor-not-allowed pr:opacity-60': disabled,
      }"
      :aria-disabled="disabled || undefined"
      @click="focusInput"
    >
      <span
        v-for="(tag, index) in tags"
        :key="index"
        class="pr-tag-input__tag pr:inline-flex pr:items-center pr:gap-[var(--pr-space-1)] pr:rounded-[var(--pr-radius-sm)] pr:bg-[var(--pr-color-surface-subtle)] pr:px-[var(--pr-space-2)] pr:py-0.5 pr:text-[length:var(--pr-font-size-xs)] pr:font-semibold pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text)]"
      >
        {{ tag }}
        <button
          v-if="!disabled"
          type="button"
          class="pr-tag-input__remove pr:-my-1 pr:-mr-1.5 pr:inline-grid pr:size-6 pr:place-items-center pr:rounded-[0.25rem] pr:text-[color:var(--pr-color-text-muted)] pr:transition-colors pr:hover:text-[color:var(--pr-color-text)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)]"
          :aria-label="messages.tagInput.remove(tag)"
          @click.stop="removeTagAndFocus(index)"
        >
          <X :size="10" aria-hidden="true" />
        </button>
      </span>
      <input
        :id="inputId"
        ref="inputRef"
        v-bind="$attrs"
        v-model="inputValue"
        class="pr-tag-input__input pr:min-w-[6rem] pr:grow pr:border-0 pr:bg-transparent pr:py-[var(--pr-space-1)] pr:text-[length:var(--pr-font-size-sm)] pr:text-[color:var(--pr-color-text)] pr:outline-none pr:placeholder:text-[color:var(--pr-color-text-subtle)] pr:disabled:cursor-not-allowed"
        type="text"
        :placeholder="tags.length === 0 ? (placeholder ?? messages.tagInput.placeholder) : undefined"
        :disabled="disabled"
        :readonly="!canAddMore || undefined"
        :required="required && tags.length === 0"
        :aria-invalid="errorText ? 'true' : undefined"
        :aria-describedby="describedBy"
        @keydown="onKeydown"
        @blur="onBlur"
        @paste="onPaste"
      >
    </div>
    <!-- The draft input above only ever holds in-progress text, so the
         committed tags are submitted natively through these hidden inputs. -->
    <template v-if="name">
      <input v-for="(tag, index) in tags" :key="`${inputId}-${index}`" type="hidden" :name="name" :value="tag">
    </template>
    <!-- Once the limit is reached the field stays focusable (read only), and says why it no longer takes tags. -->
    <p v-if="!canAddMore" :id="limitId" class="pr-tag-input__message pr-tag-input__limit pr-field-message pr:m-0 pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text-muted)]">{{ messages.tagInput.limit(maxTags ?? 0) }}</p>
    <p class="pr:sr-only" role="status">{{ liveMessage }}</p>
    <p v-if="hint" :id="hintId" class="pr-tag-input__message pr-field-message pr:m-0 pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text-muted)]">{{ hint }}</p>
    <p v-if="errorText" :id="errorId" class="pr-tag-input__message pr-field-message pr-field-message--error pr:m-0 pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-danger)]">{{ errorText }}</p>
  </div>
</template>
