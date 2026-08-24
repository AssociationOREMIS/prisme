<script setup lang="ts">
import { X } from '@lucide/vue'
import { computed, ref, useId } from 'vue'

export interface PrTagInputProps {
  modelValue?: string[]
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  required?: boolean
  placeholder?: string
  maxTags?: number
  id?: string
  name?: string
}

const props = withDefaults(defineProps<PrTagInputProps>(), {
  modelValue: () => [],
  label: undefined,
  hint: undefined,
  error: undefined,
  disabled: false,
  required: false,
  placeholder: 'Ajouter...',
  maxTags: undefined,
  id: undefined,
  name: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const generatedId = useId()
const inputId = computed(() => props.id ?? `pr-tag-input-${generatedId}`)
const hintId = computed(() => `${inputId.value}-hint`)
const errorId = computed(() => `${inputId.value}-error`)
const describedBy = computed(() => {
  const ids: string[] = []
  if (props.hint) ids.push(hintId.value)
  if (props.error) ids.push(errorId.value)
  return ids.length > 0 ? ids.join(' ') : undefined
})
const inputRef = ref<HTMLInputElement | null>(null)
const inputValue = ref('')

const canAddMore = computed(() =>
  props.maxTags === undefined || (props.modelValue?.length ?? 0) < props.maxTags,
)

function focusInput() {
  if (!props.disabled) inputRef.value?.focus()
}

function addTag(raw: string) {
  const tag = raw.trim()
  if (!tag || !canAddMore.value) return
  if (props.modelValue?.some(t => t.toLowerCase() === tag.toLowerCase())) return
  emit('update:modelValue', [...(props.modelValue ?? []), tag])
}

function addTags(rawList: string[]) {
  let next = [...(props.modelValue ?? [])]
  for (const raw of rawList) {
    const tag = raw.trim()
    if (!tag) continue
    if (props.maxTags !== undefined && next.length >= props.maxTags) break
    if (next.some(t => t.toLowerCase() === tag.toLowerCase())) continue
    next = [...next, tag]
  }
  emit('update:modelValue', next)
}

function removeTag(index: number) {
  const updated = [...(props.modelValue ?? [])]
  updated.splice(index, 1)
  emit('update:modelValue', updated)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ',') {
    event.preventDefault()
    addTag(inputValue.value)
    inputValue.value = ''
  }
  else if (event.key === 'Backspace' && inputValue.value === '') {
    const tags = props.modelValue ?? []
    if (tags.length > 0) removeTag(tags.length - 1)
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
</script>

<template>
  <div class="pr-tag-input grid gap-[var(--pr-space-2)] text-[color:var(--pr-color-text)]">
    <label
      v-if="label"
      class="pr-tag-input__label inline-flex w-fit items-baseline gap-[var(--pr-space-1)] text-[length:var(--pr-font-size-sm)] font-semibold leading-[var(--pr-line-height-tight)]"
      :for="inputId"
    >
      <span>{{ label }}</span>
      <span v-if="required" class="text-[color:var(--pr-color-danger)]" aria-hidden="true">*</span>
    </label>
    <div
      class="pr-tag-input__field flex min-h-[2.375rem] w-full flex-wrap items-center gap-[var(--pr-space-1)] rounded-[var(--pr-radius-md)] border border-[var(--pr-color-border-strong)] bg-[var(--pr-color-surface)] px-[var(--pr-space-2)] py-[var(--pr-space-1)] transition-[border-color] duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--pr-color-focus)]"
      :class="{
        'border-[var(--pr-color-danger)]': Boolean(error),
        'cursor-text': !disabled,
        'cursor-not-allowed opacity-60': disabled,
      }"
      @click="focusInput"
    >
      <span
        v-for="(tag, index) in modelValue"
        :key="index"
        class="pr-tag-input__tag inline-flex items-center gap-[var(--pr-space-1)] rounded-[var(--pr-radius-sm)] bg-[var(--pr-color-surface-subtle)] px-[var(--pr-space-2)] py-0.5 text-[length:var(--pr-font-size-xs)] font-semibold leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-text)]"
      >
        {{ tag }}
        <button
          v-if="!disabled"
          type="button"
          class="inline-flex items-center rounded-sm text-[color:var(--pr-color-text-muted)] transition-colors hover:text-[color:var(--pr-color-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)]"
          :aria-label="`Supprimer ${tag}`"
          @click.stop="removeTag(index)"
        >
          <X :size="10" aria-hidden="true" />
        </button>
      </span>
      <input
        :id="inputId"
        ref="inputRef"
        v-model="inputValue"
        class="pr-tag-input__input min-w-[6rem] grow bg-transparent py-[var(--pr-space-1)] text-[length:var(--pr-font-size-sm)] text-[color:var(--pr-color-text)] outline-none placeholder:text-[color:var(--pr-color-text-subtle)] disabled:cursor-not-allowed"
        type="text"
        :placeholder="(modelValue?.length ?? 0) === 0 ? placeholder : undefined"
        :disabled="disabled || !canAddMore"
        :required="required && (modelValue?.length ?? 0) === 0"
        :name="name"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="describedBy"
        @keydown="onKeydown"
        @blur="onBlur"
        @paste="onPaste"
      />
    </div>
    <p v-if="error" :id="errorId" class="pr-tag-input__message pr-field-message pr-field-message--error m-0 text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-danger)]">{{ error }}</p>
    <p v-else-if="hint" :id="hintId" class="pr-tag-input__message pr-field-message m-0 text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-text-muted)]">{{ hint }}</p>
  </div>
</template>
