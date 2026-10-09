<script setup lang="ts">
import { CircleCheck, CircleX, FileUp, RotateCw, X } from '@lucide/vue'
import { computed, reactive, ref, useId, watch } from 'vue'
import { PrLabel } from '../../atoms/Label'
import { PrProgress } from '../../atoms/Progress'
import { useErrorText, type PrFieldError } from '../../fieldError'
import { usePrMessages } from '../../../i18n/context'

export interface PrRejectedFile {
  file: File
  reason: string
}

export type PrFileUploadStatus = 'idle' | 'uploading' | 'success' | 'error'

export interface PrFileUploadFileState {
  status: PrFileUploadStatus
  progress: number
  error?: PrFieldError
}

export interface PrFileUploadProps {
  modelValue?: File[]
  defaultValue?: File[]
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
  /**
   * When provided, each accepted file is uploaded through this function as soon
   * as it's added (call `onProgress` with 0-100 as the transfer advances). Per-file
   * status/progress/error then render inline in the file list — without it,
   * PrFileUpload only ever collects File[] for a native/manual form submission.
   */
  upload?: (file: File, onProgress: (percent: number) => void) => Promise<void>
}

const props = withDefaults(defineProps<PrFileUploadProps>(), {
  modelValue: undefined,
  defaultValue: () => [],
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
  upload: undefined,
})

const messages = usePrMessages()

// One message, or the first of Laravel's array of messages.
const errorText = useErrorText(() => props.error)

const emit = defineEmits<{
  'update:modelValue': [files: File[]]
  'reject': [rejected: PrRejectedFile[]]
  'uploaded': [file: File]
  'upload-error': [payload: { file: File, error: string }]
}>()

// Keyed by File identity (each selected File is a distinct object, even for
// same-name re-selections) rather than by index, so state survives list
// mutations (e.g. removing an earlier file) without shifting to the wrong item.
const uploadStates = reactive(new Map<File, PrFileUploadFileState>())

function extractUploadErrorMessage(err: unknown): string {
  if (err && typeof err === 'object') {
    const response = (err as { response?: { data?: { message?: string, errors?: Record<string, string[]> } } }).response
    const firstFieldError = response?.data?.errors && Object.values(response.data.errors)[0]?.[0]
    if (firstFieldError) return firstFieldError
    if (response?.data?.message) return response.data.message
  }
  if (err instanceof Error) return err.message
  return messages.fileUpload.uploadFailed
}

async function startUpload(file: File) {
  if (!props.upload) return
  uploadStates.set(file, { status: 'uploading', progress: 0 })
  try {
    await props.upload(file, (percent) => {
      const current = uploadStates.get(file)
      if (current) current.progress = Math.min(Math.max(percent, 0), 100)
    })
    uploadStates.set(file, { status: 'success', progress: 100 })
    emit('uploaded', file)
  }
  catch (err) {
    const message = extractUploadErrorMessage(err)
    uploadStates.set(file, { status: 'error', progress: 0, error: message })
    emit('upload-error', { file, error: message })
  }
}

function stateFor(file: File): PrFileUploadFileState {
  return uploadStates.get(file) ?? { status: 'idle', progress: 0 }
}

const generatedId = useId()
const fieldId = computed(() => props.id ?? `pr-file-upload-${generatedId}`)
const labelId = computed(() => `${fieldId.value}-label`)
const instructionsId = computed(() => `${fieldId.value}-instructions`)
const hintId = computed(() => `${fieldId.value}-hint`)
const errorId = computed(() => `${fieldId.value}-error`)
// Only the message actually shown: the error replaces the hint.
const describedBy = computed(() => {
  if (errorText.value) return errorId.value
  return props.hint ? hintId.value : undefined
})

const inputRef = ref<HTMLInputElement | null>(null)
const isDraggingOver = ref(false)

// The file list, kept locally so it works without a v-model (a real v-model still wins).
const internalFiles = ref<File[]>([...(props.modelValue ?? props.defaultValue)])
const currentFiles = computed(() => props.modelValue ?? internalFiles.value)

// A native form only posts what the <input type="file"> holds: mirror the list into it, so
// dropped files and files added over several picks are submitted (and `required` is met).
function syncInput(files: File[]) {
  if (!inputRef.value || typeof DataTransfer === 'undefined') return
  const transfer = new DataTransfer()
  for (const file of files) transfer.items.add(file)
  try {
    inputRef.value.files = transfer.files
  }
  catch {
    // `files` is read-only in some test environments; the v-model still holds the list.
  }
}

function setFiles(files: File[]) {
  internalFiles.value = files
  syncInput(files)
  emit('update:modelValue', files)
}

watch(() => props.modelValue, (files) => {
  if (files === undefined) return
  internalFiles.value = [...files]
  syncInput(files)
})

function openFilePicker() {
  if (!props.disabled) inputRef.value?.click()
}

const sizeFormatter = new Intl.NumberFormat(messages.locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })

function formatSize(bytes: number): string {
  const { bytes: b, kilobytes, megabytes } = messages.fileUpload
  if (bytes < 1024) return `${bytes} ${b}`
  if (bytes < 1024 * 1024) return `${sizeFormatter.format(bytes / 1024)} ${kilobytes}`
  return `${sizeFormatter.format(bytes / (1024 * 1024))} ${megabytes}`
}

function validateFiles(files: File[]): { accepted: File[]; rejected: PrRejectedFile[] } {
  const accepted: File[] = []
  const rejected: PrRejectedFile[] = []
  const currentCount = currentFiles.value.length

  for (const file of files) {
    if (props.maxSize && file.size > props.maxSize) {
      rejected.push({ file, reason: messages.fileUpload.tooLarge(formatSize(props.maxSize)) })
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
        rejected.push({ file, reason: messages.fileUpload.typeNotAccepted })
        continue
      }
    }
    accepted.push(file)
  }

  if (props.maxFiles) {
    const available = Math.max(props.maxFiles - currentCount, 0)
    const overflow = accepted.splice(available)
    for (const file of overflow) {
      rejected.push({ file, reason: messages.fileUpload.tooMany(props.maxFiles) })
    }
  }

  return { accepted, rejected }
}

function processFiles(rawFiles: FileList | null) {
  if (!rawFiles || props.disabled) return
  const { accepted, rejected } = validateFiles(Array.from(rawFiles))
  if (rejected.length) emit('reject', rejected)
  if (accepted.length) {
    setFiles(props.multiple ? [...currentFiles.value, ...accepted] : accepted.slice(0, 1))
    for (const file of accepted) startUpload(file)
  }
}

function onInputChange(event: Event) {
  processFiles((event.target as HTMLInputElement).files)
  // The picker replaced the input's files with the new pick only: put the whole list back.
  syncInput(currentFiles.value)
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
  const updated = [...currentFiles.value]
  const [removed] = updated.splice(index, 1)
  if (removed) uploadStates.delete(removed)
  setFiles(updated)
}

const hasFiles = computed(() => currentFiles.value.length > 0)
</script>

<template>
  <div class="pr-file-upload pr:grid pr:gap-[var(--pr-space-2)] pr:text-[color:var(--pr-color-text)]">
    <PrLabel v-if="label" :id="labelId" :for="fieldId" :disabled="disabled">{{ label }}</PrLabel>
    <!-- Outside the dropzone (a role="button" cannot hold another control) and out of the tab
         order: the dropzone is the keyboard target, this input only opens the picker and posts. -->
    <input
      :id="fieldId"
      ref="inputRef"
      type="file"
      class="pr:sr-only"
      tabindex="-1"
      :multiple="multiple"
      :accept="accept"
      :disabled="disabled"
      :required="required"
      :name="name"
      @change="onInputChange"
    >
    <div
      class="pr-file-upload__dropzone pr:flex pr:cursor-pointer pr:flex-col pr:items-center pr:justify-center pr:gap-[var(--pr-space-3)] pr:rounded-[var(--pr-radius-lg)] pr:border-2 pr:border-dashed pr:border-[var(--pr-color-border-strong)] pr:bg-[var(--pr-color-surface)] pr:px-[var(--pr-space-6)] pr:py-[var(--pr-space-8)] pr:text-center pr:transition-colors pr:duration-[var(--pr-duration-fast)] pr:ease-[var(--pr-ease-standard)]"
      :class="{
        'pr:border-[var(--pr-color-primary)] pr:bg-[var(--pr-color-surface-subtle)]': isDraggingOver,
        'pr:cursor-not-allowed pr:opacity-60': disabled,
        'pr:border-[var(--pr-color-danger)]': Boolean(errorText) && !isDraggingOver,
        'pr:hover:border-[var(--pr-color-primary)] pr:hover:bg-[var(--pr-color-surface-subtle)]': !disabled,
      }"
      :aria-disabled="disabled"
      :aria-invalid="errorText ? 'true' : undefined"
      :aria-labelledby="label ? `${labelId} ${instructionsId}` : undefined"
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
      <FileUp
        class="pr:text-[color:var(--pr-color-text-muted)]"
        :size="32"
        aria-hidden="true"
      />
      <div>
        <p :id="instructionsId" class="pr:m-0 pr:text-[length:var(--pr-font-size-sm)] pr:font-semibold pr:text-[color:var(--pr-color-text)]">
          {{ messages.fileUpload.drop }} <span class="pr:text-[color:var(--pr-color-primary)]">{{ messages.fileUpload.choose }}</span>
        </p>
        <p v-if="accept || maxSize" class="pr:m-0 pr:mt-[var(--pr-space-1)] pr:text-[length:var(--pr-font-size-xs)] pr:text-[color:var(--pr-color-text-muted)]">
          <span v-if="accept">{{ accept }}</span>
          <span v-if="accept && maxSize"> · </span>
          <span v-if="maxSize">Max {{ formatSize(maxSize) }}</span>
        </p>
      </div>
    </div>
    <ul v-if="hasFiles" class="pr-file-upload__list pr:m-0 pr:grid pr:gap-[var(--pr-space-2)] pr:p-0 pr:list-none">
      <li
        v-for="(file, index) in currentFiles"
        :key="`${file.name}-${index}`"
        class="pr-file-upload__item pr:flex pr:items-center pr:gap-[var(--pr-space-3)] pr:rounded-[var(--pr-radius-md)] pr:border pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface)] pr:px-[var(--pr-space-3)] pr:py-[var(--pr-space-2)]"
      >
        <div class="pr:min-w-0 pr:grow">
          <p class="pr:m-0 pr:truncate pr:text-[length:var(--pr-font-size-sm)] pr:font-semibold pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text)]">
            {{ file.name }}
          </p>
          <p class="pr:m-0 pr:text-[length:var(--pr-font-size-xs)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text-muted)]">
            {{ formatSize(file.size) }}
          </p>
          <PrProgress
            v-if="upload && stateFor(file).status === 'uploading'"
            :aria-label="messages.fileUpload.uploading(file.name)"
            class="pr-file-upload__progress pr:mt-[var(--pr-space-1)]"
            :model-value="stateFor(file).progress"
          />
          <p v-else-if="upload && stateFor(file).status === 'error'" class="pr-file-upload__item-error pr:m-0 pr:mt-[var(--pr-space-1)] pr:flex pr:items-center pr:gap-[var(--pr-space-1)] pr:text-[length:var(--pr-font-size-xs)] pr:text-[color:var(--pr-color-danger)]">
            <CircleX :size="12" aria-hidden="true" />
            {{ stateFor(file).error }}
          </p>
        </div>
        <CircleCheck
          v-if="upload && stateFor(file).status === 'success'"
          class="pr:shrink-0 pr:text-[color:var(--pr-color-success)]"
          :size="16"
          aria-hidden="true"
        />
        <button
          v-if="upload && stateFor(file).status === 'error'"
          type="button"
          class="pr:inline-grid pr:size-6 pr:shrink-0 pr:place-items-center pr:rounded-[var(--pr-radius-sm)] pr:text-[color:var(--pr-color-text-muted)] pr:transition-colors pr:duration-[var(--pr-duration-fast)] pr:hover:text-[color:var(--pr-color-text)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)]"
          :aria-label="messages.fileUpload.retry(file.name)"
          @click="startUpload(file)"
        >
          <RotateCw :size="16" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="pr:inline-grid pr:size-6 pr:shrink-0 pr:place-items-center pr:rounded-[var(--pr-radius-sm)] pr:text-[color:var(--pr-color-text-muted)] pr:transition-colors pr:duration-[var(--pr-duration-fast)] pr:hover:text-[color:var(--pr-color-text)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)]"
          :aria-label="messages.fileUpload.remove(file.name)"
          @click="removeFile(index)"
        >
          <X :size="16" aria-hidden="true" />
        </button>
      </li>
    </ul>
    <p v-if="errorText" :id="errorId" class="pr-field-message pr-field-message--error pr:m-0 pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-danger)]">{{ errorText }}</p>
    <p v-else-if="hint" :id="hintId" class="pr-field-message pr:m-0 pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text-muted)]">{{ hint }}</p>
  </div>
</template>
