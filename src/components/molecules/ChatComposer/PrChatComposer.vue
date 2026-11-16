<script setup lang="ts">
import { ref, watch } from 'vue'
import { Send } from '@lucide/vue'
import { PrButton } from '../../atoms/Button'
import { PrInput } from '../../atoms/Input'
import { PrTextarea } from '../../atoms/Textarea'
import { usePrMessages } from '../../../i18n/context'

export interface PrChatComposerProps {
  /** The text being written (`v-model`). */
  modelValue?: string
  /** A text area of a few lines: Enter sends, Shift+Enter starts a new line. A single-line field by default. */
  multiline?: boolean
  disabled?: boolean
  /** Maximum length of a message. */
  maxlength?: number
  /** Name of the field, `messages.chat.composerLabel` (« Votre message ») by default. */
  label?: string
  /** `messages.chat.placeholder` by default. */
  placeholder?: string
}

const props = withDefaults(defineProps<PrChatComposerProps>(), {
  modelValue: undefined,
  multiline: false,
  disabled: false,
  maxlength: undefined,
  label: undefined,
  placeholder: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  /** The message, trimmed, never empty. The field is emptied after it. */
  send: [text: string]
}>()

const messages = usePrMessages()

// Works with or without `v-model`.
const text = ref(props.modelValue ?? '')
watch(() => props.modelValue, (value) => {
  if (value !== undefined) text.value = value
})

function update(value: string) {
  text.value = value
  emit('update:modelValue', value)
}

function send() {
  if (props.disabled) return
  const message = text.value.trim()
  if (!message) return
  emit('send', message)
  update('')
}

function onKeydown(event: KeyboardEvent) {
  // Enter while an input method composes a word (Japanese, Chinese...) only validates the word.
  if (event.key !== 'Enter' || event.shiftKey || event.isComposing) return
  event.preventDefault()
  send()
}
</script>

<template>
  <form
    class="pr-chat-composer pr:flex pr:items-end pr:gap-[var(--pr-space-2)] pr:border-t pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface)] pr:p-[var(--pr-space-3)]"
    @submit.prevent="send"
  >
    <div class="pr-chat-composer__field pr:min-w-0 pr:flex-1">
      <PrTextarea
        v-if="multiline"
        :model-value="text"
        :aria-label="label ?? messages.chat.composerLabel"
        :placeholder="placeholder ?? messages.chat.placeholder"
        :disabled="disabled"
        :maxlength="maxlength"
        :rows="2"
        resize="none"
        class="pr:min-h-0!"
        @update:model-value="update"
        @keydown="onKeydown"
      />
      <PrInput
        v-else
        :model-value="text"
        :label="label ?? messages.chat.composerLabel"
        hide-label
        :placeholder="placeholder ?? messages.chat.placeholder"
        :disabled="disabled"
        :maxlength="maxlength"
        autocomplete="off"
        @update:model-value="update"
      />
    </div>
    <PrButton
      class="pr-chat-composer__send"
      type="submit"
      :icon="Send"
      :label="messages.chat.send"
      :disabled="disabled"
    />
  </form>
</template>
