<script setup lang="ts">
import { FileUp, X } from '@lucide/vue'
import { computed, ref, useId } from 'vue'
import { PrLabel } from '../../atoms/Label'

export interface PrRejectedFile {
  file: File
  reason: string
}

export interface PrFileUploadProps {
  modelValue?: File[]
  multiple?: boolean
  accept?: string
  maxSize?: number
  maxFiles?: number
  disabled?: boolean
  required?: boolean
  label?: string
  hint?: string
  error?: string
  name?: string
  id?: string
}

const props = withDefaults(defineProps<PrFileUploadProps>(), {
  modelValue: () => [],
  multiple: false,
  accept: undefined,
  maxSize: undefined,
  maxFiles: undefined,
  disabled: false,
  required: false,
  label: undefined,
  hint: undefined,
  error: undefined,
  name: undefined,
  id: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [files: File[]]
  'reject': [rejected: PrRejectedFile[]]
}>()

const generatedId = useId()
const fieldId = computed(() => props.id ?? `pr-file-upload-${generatedId}`)
const hintId = computed(() => `${fieldId.value}-hint`)
const errorId = computed(() => `${fieldId.value}-error`)
const describedBy = computed(() => {
  const ids: string[] = []
  if (props.hint) ids.push(hintId.value)
  if (props.error) ids.push(errorId.value)
  return ids.length > 0 ? ids.join(' ') : undefined
})

const inputRef = ref<HTMLInputElement | null>(null)
const isDraggingOver = ref(false)

function openFilePicker() {
  if (!props.disabled) inputRef.value?.click()
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

function validateFiles(files: File[]): { accepted: File[]; rejected: PrRejectedFile[] } {
  const accepted: File[] = []
  const rejected: PrRejectedFile[] = []
  const currentCount = props.modelValue?.length ?? 0

  for (const file of files) {
    if (props.maxSize && file.size > props.maxSize) {
      rejected.push({ file, reason: `Taille maximale dépassée (${formatSize(props.maxSize)})` })
      continue
    }
    if (props.accept) {
      const acceptedTypes = props.accept.split(',').map(t => t.trim())
      const matches = acceptedTypes.some((type) => {
        if (type.startsWith('.')) return file.name.toLowerCase().endsWith(type.toLowerCase())
        if (type.endsWith('/*')) return file.type.startsWith(type.slice(0, -2))
        return file.type === type
      })
      if (!matches) {
        rejected.push({ file, reason: 'Type de fichier non accepté' })
        continue
      }
    }
    accepted.push(file)
  }

  if (props.maxFiles) {
    const available = props.maxFiles - currentCount
    const overflow = accepted.splice(available)
    for (const file of overflow) {
      rejected.push({ file, reason: `Nombre maximum de fichiers atteint (${props.maxFiles})` })
    }
  }

  return { accepted, rejected }
}

function processFiles(rawFiles: FileList | null) {
  if (!rawFiles || props.disabled) return
  const { accepted, rejected } = validateFiles(Array.from(rawFiles))
  if (rejected.length) emit('reject', rejected)
  if (accepted.length) {
    const current = props.modelValue ?? []
    emit('update:modelValue', props.multiple ? [...current, ...accepted] : accepted.slice(0, 1))
  }
}

function onInputChange(event: Event) {
  processFiles((event.target as HTMLInputElement).files)
  if (inputRef.value) inputRef.value.value = ''
}

function onDragEnter(event: DragEvent) {
  event.preventDefault()
  if (!props.disabled) isDraggingOver.value = true
}

function onDragOver(event: DragEvent) {
  event.preventDefault()
}

function onDragLeave(event: DragEvent) {
  if (!(event.currentTarget as Element).contains(event.relatedTarget as Node)) {
    isDraggingOver.value = false
  }
}

function onDrop(event: DragEvent) {
  event.preventDefault()
  isDraggingOver.value = false
  processFiles(event.dataTransfer?.files ?? null)
}

function removeFile(index: number) {
  const updated = [...(props.modelValue ?? [])]
  updated.splice(index, 1)
  emit('update:modelValue', updated)
}

const hasFiles = computed(() => (props.modelValue?.length ?? 0) > 0)
</script>

<template>
  <div class="pr-file-upload grid gap-[var(--pr-space-2)] text-[color:var(--pr-color-text)]">
    <PrLabel v-if="label" :for="fieldId" :disabled="disabled">{{ label }}</PrLabel>
    <div
      class="pr-file-upload__dropzone flex cursor-pointer flex-col items-center justify-center gap-[var(--pr-space-3)] rounded-[var(--pr-radius-lg)] border-2 border-dashed border-[var(--pr-color-border-strong)] bg-[var(--pr-color-surface)] px-[var(--pr-space-6)] py-[var(--pr-space-8)] text-center transition-colors duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)]"
      :class="{
        'border-[var(--pr-color-primary)] bg-[var(--pr-color-surface-subtle)]': isDraggingOver,
        'cursor-not-allowed opacity-60': disabled,
        'border-[var(--pr-color-danger)]': Boolean(error) && !isDraggingOver,
        'hover:border-[var(--pr-color-primary)] hover:bg-[var(--pr-color-surface-subtle)]': !disabled,
      }"
      :aria-disabled="disabled"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="describedBy"
      tabindex="0"
      role="button"
      @click="openFilePicker"
      @keydown.enter.prevent="openFilePicker"
      @keydown.space.prevent="openFilePicker"
      @dragenter="onDragEnter"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <input
        :id="fieldId"
        ref="inputRef"
        type="file"
        class="sr-only"
        :multiple="multiple"
        :accept="accept"
        :disabled="disabled"
        :required="required"
        :name="name"
        @change="onInputChange"
      />
      <FileUp
        class="text-[color:var(--pr-color-text-muted)]"
        :size="32"
        aria-hidden="true"
      />
      <div>
        <p class="m-0 text-[length:var(--pr-font-size-sm)] font-semibold text-[color:var(--pr-color-text)]">
          Glisser-déposer ou <span class="text-[color:var(--pr-color-primary)]">choisir un fichier</span>
        </p>
        <p v-if="accept || maxSize" class="m-0 mt-[var(--pr-space-1)] text-[length:var(--pr-font-size-xs)] text-[color:var(--pr-color-text-muted)]">
          <span v-if="accept">{{ accept }}</span>
          <span v-if="accept && maxSize"> · </span>
          <span v-if="maxSize">Max {{ formatSize(maxSize) }}</span>
        </p>
      </div>
    </div>
    <ul v-if="hasFiles" class="pr-file-upload__list m-0 grid gap-[var(--pr-space-2)] p-0 list-none">
      <li
        v-for="(file, index) in modelValue"
        :key="`${file.name}-${index}`"
        class="pr-file-upload__item flex items-center gap-[var(--pr-space-3)] rounded-[var(--pr-radius-md)] border border-[var(--pr-color-border)] bg-[var(--pr-color-surface)] px-[var(--pr-space-3)] py-[var(--pr-space-2)]"
      >
        <div class="min-w-0 grow">
          <p class="m-0 truncate text-[length:var(--pr-font-size-sm)] font-semibold leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-text)]">
            {{ file.name }}
          </p>
          <p class="m-0 text-[length:var(--pr-font-size-xs)] leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-text-muted)]">
            {{ formatSize(file.size) }}
          </p>
        </div>
        <button
          type="button"
          class="shrink-0 rounded-[var(--pr-radius-sm)] text-[color:var(--pr-color-text-muted)] transition-colors duration-[var(--pr-duration-fast)] hover:text-[color:var(--pr-color-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)]"
          :aria-label="`Supprimer ${file.name}`"
          @click="removeFile(index)"
        >
          <X :size="16" aria-hidden="true" />
        </button>
      </li>
    </ul>
    <p v-if="error" :id="errorId" class="pr-field-message pr-field-message--error m-0 text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-danger)]">{{ error }}</p>
    <p v-else-if="hint" :id="hintId" class="pr-field-message m-0 text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-text-muted)]">{{ hint }}</p>
  </div>
</template>
