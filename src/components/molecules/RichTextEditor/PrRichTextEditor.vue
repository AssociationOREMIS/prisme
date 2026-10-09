<script setup lang="ts">
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronsDownUp,
  Clapperboard,
  Code,
  Eraser,
  Heading2,
  Heading3,
  Highlighter,
  Hourglass,
  Image,
  Info,
  Italic,
  Link as LinkIcon,
  List,
  ListChecks,
  ListOrdered,
  CircleCheck,
  OctagonX,
  Palette,
  Quote,
  Redo2,
  Smile,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Table2,
  TriangleAlert,
  Undo2,
} from '@lucide/vue'
import { CharacterCount } from '@tiptap/extension-character-count'
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'
import { Details, DetailsContent, DetailsSummary } from '@tiptap/extension-details'
import { Emoji, emojis as defaultEmojis } from '@tiptap/extension-emoji'
import { Highlight } from '@tiptap/extension-highlight'
import { Link } from '@tiptap/extension-link'
import { Placeholder } from '@tiptap/extension-placeholder'
import { Subscript } from '@tiptap/extension-subscript'
import { Superscript } from '@tiptap/extension-superscript'
import { TableKit } from '@tiptap/extension-table'
import { TaskItem } from '@tiptap/extension-task-item'
import { TaskList } from '@tiptap/extension-task-list'
import { TextAlign } from '@tiptap/extension-text-align'
import { TextStyleKit } from '@tiptap/extension-text-style'
import { Typography } from '@tiptap/extension-typography'
import { Youtube } from '@tiptap/extension-youtube'
import { StarterKit } from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import { common, createLowlight } from 'lowlight'
import { ImageResize } from 'tiptap-extension-resize-image'
import { computed, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
import { Callout } from '../../../tiptap/callout'
import { PrLabel } from '../../atoms/Label'
import { useErrorText, type PrFieldError } from '../../fieldError'
import { usePrMessages } from '../../../i18n/context'

export interface PrRichTextEditorProps {
  modelValue?: string
  label?: string
  hint?: string
  error?: PrFieldError
  disabled?: boolean
  required?: boolean
  placeholder?: string
  id?: string
  name?: string
  /**
   * Called when an image is inserted (toolbar button, or dropped into the
   * editor). Resolve with the uploaded image's URL — it's then inserted
   * into the document. Reject (or throw) to surface an error message
   * instead. Without this prop, image insertion is disabled.
   */
  uploadImage?: (file: File, onProgress?: (percent: number) => void) => Promise<string>
}

const props = withDefaults(defineProps<PrRichTextEditorProps>(), {
  modelValue: '',
  label: undefined,
  hint: undefined,
  error: undefined,
  disabled: false,
  required: false,
  placeholder: undefined,
  id: undefined,
  name: undefined,
  uploadImage: undefined,
})

const messages = usePrMessages()

// One message, or the first of Laravel's array of messages.
const errorText = useErrorText(() => props.error)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

defineOptions({ inheritAttrs: false })

const lowlight = createLowlight(common)

const TEXT_ALIGNMENTS = [
  { align: 'left' as const, label: messages.richTextEditor.alignLeft, icon: AlignLeft },
  { align: 'center' as const, label: messages.richTextEditor.alignCenter, icon: AlignCenter },
  { align: 'right' as const, label: messages.richTextEditor.alignRight, icon: AlignRight },
]

const EMOJI_PICKER_ITEMS = [
  'bulb', 'white_check_mark', 'warning', 'pushpin', 'dart', 'thumbsup',
  'fire', 'memo', 'clock3', 'date', 'sparkles', 'rocket',
  'mortar_board', 'books', 'bell', 'exclamation', 'question', 'clap',
  'raised_hands', 'speech_balloon', 'paperclip', 'framed_picture', 'tada', 'blush',
]

const CALLOUT_VARIANTS = [
  { variant: 'info' as const, label: messages.richTextEditor.calloutInfo, icon: Info },
  { variant: 'success' as const, label: messages.richTextEditor.calloutSuccess, icon: CircleCheck },
  { variant: 'warning' as const, label: messages.richTextEditor.calloutWarning, icon: TriangleAlert },
  { variant: 'danger' as const, label: messages.richTextEditor.calloutDanger, icon: OctagonX },
]

// `!` (Tailwind v4 important marker) is required here: these classes are
// appended alongside `toolbarButtonClass`'s own `bg-transparent`/`border-transparent`/
// `text-[color:var(--pr-color-text-muted)]`, which target the same properties.
// Same specificity (single class selector each) means the winner is whichever
// rule Tailwind happens to emit later in the generated stylesheet — not DOM
// class order — so without `!` these "active" overrides can silently lose.
const calloutVariantClass: Record<typeof CALLOUT_VARIANTS[number]['variant'], string> = {
  info: 'pr:border-[var(--pr-color-info-border)]! pr:bg-[var(--pr-color-info-soft)]! pr:text-[color:var(--pr-color-info)]!',
  success: 'pr:border-[var(--pr-color-success-border)]! pr:bg-[var(--pr-color-success-soft)]! pr:text-[color:var(--pr-color-success)]!',
  warning: 'pr:border-[var(--pr-color-warning-border)]! pr:bg-[var(--pr-color-warning-soft)]! pr:text-[color:var(--pr-color-warning)]!',
  danger: 'pr:border-[var(--pr-color-danger-border)]! pr:bg-[var(--pr-color-danger-soft)]! pr:text-[color:var(--pr-color-danger)]!',
}

const generatedId = useId()
const fieldId = computed(() => props.id ?? `pr-rich-text-editor-${generatedId}`)
const hintId = computed(() => `${fieldId.value}-hint`)
const errorId = computed(() => `${fieldId.value}-error`)
const labelId = computed(() => `${fieldId.value}-label`)
// Only the message actually shown: the error replaces the hint.
const describedBy = computed(() => {
  if (errorText.value) return errorId.value
  return props.hint ? hintId.value : undefined
})

// Name and state go on ProseMirror's contenteditable itself, the element screen readers
// announce as the text field (they were on the wrapper <div>, leaving the field unnamed).
function contentAttributes(): Record<string, string> {
  const attributes: Record<string, string> = { 'role': 'textbox', 'aria-multiline': 'true' }
  if (props.label) attributes['aria-labelledby'] = labelId.value
  if (describedBy.value) attributes['aria-describedby'] = describedBy.value
  if (errorText.value) attributes['aria-invalid'] = 'true'
  if (props.required) attributes['aria-required'] = 'true'
  if (props.disabled) attributes['aria-disabled'] = 'true'
  return attributes
}

const isUploadingImage = ref(false)
const uploadError = ref<string | null>(null)
const isEmojiPickerOpen = ref(false)
const emojiPickerRef = ref<HTMLElement | null>(null)

const emojiPickerEmojis = computed(() => EMOJI_PICKER_ITEMS
  .map(name => defaultEmojis.find(emoji => emoji.name === name))
  .filter((emoji): emoji is NonNullable<typeof emoji> => Boolean(emoji)))

function closeEmojiPickerOnOutsideClick(event: MouseEvent) {
  if (isEmojiPickerOpen.value && emojiPickerRef.value && !emojiPickerRef.value.contains(event.target as Node)) {
    isEmojiPickerOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeEmojiPickerOnOutsideClick)
})

async function handleImageUpload(file: File): Promise<string | null> {
  if (!props.uploadImage) {
    uploadError.value = messages.richTextEditor.noUploadHandler

    return null
  }

  uploadError.value = null
  isUploadingImage.value = true

  try {
    return await props.uploadImage(file, () => {})
  }
  catch {
    uploadError.value = messages.richTextEditor.uploadFailed

    return null
  }
  finally {
    isUploadingImage.value = false
  }
}

// What the hidden input submits. Without a v-model (a plain Blade form passing the initial
// HTML once), `modelValue` never follows the edits, so the form would post the original text.
const html = ref(props.modelValue)

const editor = useEditor({
  content: props.modelValue,
  editable: !props.disabled,
  extensions: [
    StarterKit.configure({ link: false, codeBlock: false }),
    Link.configure({ openOnClick: false, autolink: true }),
    ImageResize.configure({ minWidth: 80, maxWidth: 1200 }),
    Youtube.configure({ nocookie: true, width: 640, height: 360 }),
    TableKit.configure({ table: { resizable: true } }),
    Placeholder.configure({ placeholder: props.placeholder ?? messages.richTextEditor.placeholder }),
    Highlight,
    TextStyleKit.configure({ fontFamily: false, fontSize: false, lineHeight: false, backgroundColor: false }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    TaskList,
    TaskItem.configure({ nested: true }),
    CodeBlockLowlight.configure({ lowlight }),
    CharacterCount,
    Details.configure({ persist: true }),
    DetailsSummary,
    DetailsContent,
    Subscript,
    Superscript,
    Typography,
    Emoji.configure({ emojis: defaultEmojis, enableEmoticons: true }),
    Callout,
  ],
  editorProps: {
    attributes: () => contentAttributes(),
    handleDrop(_view, event) {
      const file = event.dataTransfer?.files?.[0]

      if (!file || !file.type.startsWith('image/')) {
        return false
      }

      event.preventDefault()

      insertImageFromFile(file)

      return true
    },
  },
  onUpdate: ({ editor: instance }) => {
    html.value = instance.getHTML()
    emit('update:modelValue', html.value)
  },
})

watch(() => props.modelValue, (value) => {
  html.value = value
  if (editor.value && value !== editor.value.getHTML()) {
    editor.value.commands.setContent(value, { emitUpdate: false })
  }
})

// ProseMirror reads `attributes` on each update: refresh them when the label or messages change.
watch(() => [props.label, errorText.value, props.hint, props.required, props.disabled], () => {
  editor.value?.view.dispatch(editor.value.state.tr.setMeta('addToHistory', false))
})

watch(() => props.disabled, (disabled) => {
  editor.value?.setEditable(!disabled)
})

onBeforeUnmount(() => {
  editor.value?.destroy()
  document.removeEventListener('click', closeEmojiPickerOnOutsideClick)
})

function focusEditor() {
  editor.value?.chain().focus().run()
}

/**
 * Uploads `file` through the `uploadImage` prop and, on success, inserts it
 * at the current cursor position. Used by the toolbar's image button and
 * drag-and-drop — also exposed (see `defineExpose` below) so a consumer
 * with its own image-picking UI (e.g. a paste handler) can drive the same
 * upload-then-insert flow, and so tests can exercise it without simulating
 * a real file input/drag-and-drop.
 */
async function insertImageFromFile(file: File): Promise<string | null> {
  const url = await handleImageUpload(file)

  if (url) {
    editor.value?.chain().focus().setImage({ src: url }).run()
  }

  return url
}

function pickAndUploadImage() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/jpeg,image/png,image/webp'
  input.addEventListener('change', async () => {
    const file = input.files?.[0]

    if (!file) {
      return
    }

    await insertImageFromFile(file)
  })
  input.click()
}

function promptForYoutubeVideo() {
  const url = window.prompt(messages.richTextEditor.youtubePrompt)

  if (url) {
    editor.value?.chain().focus().setYoutubeVideo({ src: url }).run()
  }
}

function promptForLink() {
  const previousUrl = editor.value?.getAttributes('link').href ?? ''
  const url = window.prompt(messages.richTextEditor.linkPrompt, previousUrl)

  if (url === null) {
    return
  }

  if (url === '') {
    editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()

    return
  }

  editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

function insertTable() {
  editor.value?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
}

function setTextColor(event: Event) {
  editor.value?.chain().focus().setColor((event.target as HTMLInputElement).value).run()
}

function unsetTextColor() {
  editor.value?.chain().focus().unsetColor().run()
}

function toggleDetails() {
  if (editor.value?.isActive('details')) {
    editor.value.chain().focus().unsetDetails().run()
  }
  else {
    editor.value?.chain().focus().setDetails().run()
  }
}

function insertEmoji(name: string) {
  editor.value?.chain().focus().setEmoji(name).run()
  isEmojiPickerOpen.value = false
}

// Exposed for advanced consumer use (e.g. programmatic focus/insert/upload)
// and for tests — driving the tiptap `Editor` instance directly through its
// command API is the standard way to exercise a tiptap-based editor, since
// jsdom cannot simulate real contenteditable typing/selection behavior.
defineExpose({ editor, insertImageFromFile })

// `border`/`border-transparent` are marked important (`!`): Bootstrap ships
// its own `.border{border:1px solid #dee2e6!important}` utility class under
// the EXACT same name — in a host page that loads Bootstrap (like
// Formation), a plain `<button class="... border border-transparent ...">`
// collides with it and loses, showing Bootstrap's gray border instead of
// ours. `!` makes sure our own border color always wins regardless of what
// utility CSS the host page loads. This is safe here because nothing else
// on this button (hover, active) ever sets border-color, so there's no
// internal fight to break.
//
// `bg-[transparent]` (arbitrary value) instead of the named `bg-transparent`
// utility: Bootstrap also ships `.bg-transparent{background-color:
// transparent!important}` under that exact name. It looked harmless at
// first (same value at idle), but its `!important` also permanently beats
// our OWN non-important hover/active backgrounds below — not just at idle —
// which silently killed hover on Formation while looking fine in Storybook
// (no Bootstrap there). Using the bracket form changes the compiled class
// name so Bootstrap's `.bg-transparent` selector no longer matches this
// element at all, sidestepping the collision instead of fighting it with
// `!important` (which would have meant marking hover/active important too,
// risking active losing to hover when both apply at once).
const toolbarButtonClass = 'pr-rich-text-editor__btn pr:inline-flex pr:h-9 pr:w-9 pr:items-center pr:justify-center pr:rounded-[var(--pr-radius-md)] pr:border! pr:border-transparent! pr:bg-[transparent] pr:text-[color:var(--pr-color-text-muted)] pr:transition-colors pr:duration-[var(--pr-duration-fast)] pr:ease-[var(--pr-ease-standard)] pr:hover:not-disabled:bg-[var(--pr-color-surface-subtle)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)] pr:disabled:cursor-not-allowed pr:disabled:opacity-40'
// `!` needed: see comment above `calloutVariantClass` — same base-class collision.
const toolbarButtonActiveClass = 'pr:bg-[var(--pr-color-primary)]! pr:text-[color:var(--pr-color-primary-contrast)]!'
</script>

<template>
  <div class="pr-rich-text-editor pr:grid pr:gap-[var(--pr-space-2)] pr:text-[color:var(--pr-color-text)]">
    <PrLabel
      v-if="label"
      :id="labelId"
      :for="fieldId"
      :required="required"
      :disabled="disabled"
      @click="focusEditor"
    >
      {{ label }}
    </PrLabel>
    <div
      v-bind="$attrs"
      class="pr-rich-text-editor__root pr:rounded-[var(--pr-radius-lg)] pr:border! pr:bg-[var(--pr-color-surface)]"
      :class="[errorText ? 'pr:border-[var(--pr-color-danger)]!' : 'pr:border-[var(--pr-color-border-strong)]!', disabled ? 'pr:opacity-60' : '']"
      :aria-disabled="disabled || undefined"
    >
      <!--
        `rounded-t-[...]` here (rather than `overflow-hidden` on the root
        above) is deliberate: `position: sticky` on this toolbar stops
        working the moment ANY ancestor has `overflow` other than `visible`
        — it changes what "nearest scrolling ancestor" sticky sticks to, and
        the root here never scrolls on its own, so sticky would silently
        become a no-op. Rounding the toolbar's own top corners keeps the
        card look without needing the root to clip it.

        `top-[var(--pr-rich-text-editor-sticky-offset,0px)]`: a host page
        can have its own fixed header (Formation's `.top-navbar` is 60px and
        `position:fixed`, sitting at the same `top:0` this toolbar would
        stick to) — sticking at a bare `top-0` then means an equally-fixed
        host header with a higher z-index paints over this toolbar the
        moment it sticks, so it just looks like sticky "does nothing". A
        page with such a header can set
        `--pr-rich-text-editor-sticky-offset: 60px` (its own header's
        height) on any ancestor of this component to stick the toolbar
        right below it instead; it defaults to `0px` for pages without one.
      -->
      <div class="pr-rich-text-editor__toolbar pr:sticky pr:top-[var(--pr-rich-text-editor-sticky-offset,0px)] pr:z-10 pr:flex pr:flex-wrap pr:items-center pr:gap-[var(--pr-space-1)] pr:rounded-t-[var(--pr-radius-lg)] pr:border-b pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface)] pr:p-[var(--pr-space-2)]" role="toolbar" :aria-label="messages.richTextEditor.toolbar">
        <button type="button" :class="[toolbarButtonClass, editor?.isActive('heading', { level: 2 }) ? toolbarButtonActiveClass : '']"
                :disabled="!editor || disabled" :title="messages.richTextEditor.heading" :aria-label="messages.richTextEditor.heading" @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()">
          <Heading2 :size="16" aria-hidden="true" />
        </button>
        <button type="button" :class="[toolbarButtonClass, editor?.isActive('heading', { level: 3 }) ? toolbarButtonActiveClass : '']"
                :disabled="!editor || disabled" :title="messages.richTextEditor.subheading" :aria-label="messages.richTextEditor.subheading" @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()">
          <Heading3 :size="16" aria-hidden="true" />
        </button>

        <span class="pr-rich-text-editor__separator pr:mx-[0.125rem] pr:my-[var(--pr-space-1)] pr:w-px pr:self-stretch pr:bg-[var(--pr-color-border)]" aria-hidden="true" />

        <button type="button" :class="[toolbarButtonClass, editor?.isActive('bold') ? toolbarButtonActiveClass : '']"
                :disabled="!editor || disabled" :title="messages.richTextEditor.bold" :aria-label="messages.richTextEditor.bold" @click="editor?.chain().focus().toggleBold().run()">
          <Bold :size="16" aria-hidden="true" />
        </button>
        <button type="button" :class="[toolbarButtonClass, editor?.isActive('pr:italic') ? toolbarButtonActiveClass : '']"
                :disabled="!editor || disabled" :title="messages.richTextEditor.italic" :aria-label="messages.richTextEditor.italic" @click="editor?.chain().focus().toggleItalic().run()">
          <Italic :size="16" aria-hidden="true" />
        </button>
        <button type="button" :class="[toolbarButtonClass, editor?.isActive('subscript') ? toolbarButtonActiveClass : '']"
                :disabled="!editor || disabled" :title="messages.richTextEditor.subscript" :aria-label="messages.richTextEditor.subscript" @click="editor?.chain().focus().toggleSubscript().run()">
          <SubscriptIcon :size="16" aria-hidden="true" />
        </button>
        <button type="button" :class="[toolbarButtonClass, editor?.isActive('superscript') ? toolbarButtonActiveClass : '']"
                :disabled="!editor || disabled" :title="messages.richTextEditor.superscript" :aria-label="messages.richTextEditor.superscript" @click="editor?.chain().focus().toggleSuperscript().run()">
          <SuperscriptIcon :size="16" aria-hidden="true" />
        </button>
        <button type="button" :class="[toolbarButtonClass, editor?.isActive('link') ? toolbarButtonActiveClass : '']"
                :disabled="!editor || disabled" :title="messages.richTextEditor.link" :aria-label="messages.richTextEditor.link" @click="promptForLink">
          <LinkIcon :size="16" aria-hidden="true" />
        </button>
        <button type="button" :class="[toolbarButtonClass, editor?.isActive('highlight') ? toolbarButtonActiveClass : '']"
                :disabled="!editor || disabled" :title="messages.richTextEditor.highlight" :aria-label="messages.richTextEditor.highlight" @click="editor?.chain().focus().toggleHighlight().run()">
          <Highlighter :size="16" aria-hidden="true" />
        </button>
        <label class="pr-rich-text-editor__color pr:relative pr:inline-flex pr:h-9 pr:w-9 pr:items-center pr:justify-center pr:rounded-[var(--pr-radius-md)] pr:text-[color:var(--pr-color-text-muted)] pr:hover:bg-[var(--pr-color-surface-subtle)]" :title="messages.richTextEditor.textColor">
          <Palette :size="16" aria-hidden="true" />
          <input type="color" class="pr:absolute pr:inset-0 pr:h-full pr:w-full pr:cursor-pointer pr:opacity-0" :aria-label="messages.richTextEditor.textColor" :disabled="!editor || disabled"
                 :value="editor?.getAttributes('textStyle').color || '#000000'" @input="setTextColor">
        </label>
        <button type="button" :class="toolbarButtonClass" :disabled="!editor || disabled"
                :title="messages.richTextEditor.removeTextColorShort" :aria-label="messages.richTextEditor.removeTextColor" @click="unsetTextColor">
          <Eraser :size="16" aria-hidden="true" />
        </button>

        <span class="pr-rich-text-editor__separator pr:mx-[0.125rem] pr:my-[var(--pr-space-1)] pr:w-px pr:self-stretch pr:bg-[var(--pr-color-border)]" aria-hidden="true" />

        <button v-for="alignment in TEXT_ALIGNMENTS" :key="alignment.align" type="button"
                :class="[toolbarButtonClass, editor?.isActive({ textAlign: alignment.align }) ? toolbarButtonActiveClass : '']"
                :disabled="!editor || disabled" :title="alignment.label" :aria-label="alignment.label"
                @click="editor?.chain().focus().setTextAlign(alignment.align).run()">
          <component :is="alignment.icon" :size="16" aria-hidden="true" />
        </button>

        <span class="pr-rich-text-editor__separator pr:mx-[0.125rem] pr:my-[var(--pr-space-1)] pr:w-px pr:self-stretch pr:bg-[var(--pr-color-border)]" aria-hidden="true" />

        <button type="button" :class="[toolbarButtonClass, editor?.isActive('bulletList') ? toolbarButtonActiveClass : '']"
                :disabled="!editor || disabled" :title="messages.richTextEditor.bulletList" :aria-label="messages.richTextEditor.bulletList" @click="editor?.chain().focus().toggleBulletList().run()">
          <List :size="16" aria-hidden="true" />
        </button>
        <button type="button" :class="[toolbarButtonClass, editor?.isActive('orderedList') ? toolbarButtonActiveClass : '']"
                :disabled="!editor || disabled" :title="messages.richTextEditor.orderedList" :aria-label="messages.richTextEditor.orderedList" @click="editor?.chain().focus().toggleOrderedList().run()">
          <ListOrdered :size="16" aria-hidden="true" />
        </button>
        <button type="button" :class="[toolbarButtonClass, editor?.isActive('taskList') ? toolbarButtonActiveClass : '']"
                :disabled="!editor || disabled" :title="messages.richTextEditor.taskList" :aria-label="messages.richTextEditor.taskList" @click="editor?.chain().focus().toggleTaskList().run()">
          <ListChecks :size="16" aria-hidden="true" />
        </button>
        <button type="button" :class="[toolbarButtonClass, editor?.isActive('blockquote') ? toolbarButtonActiveClass : '']"
                :disabled="!editor || disabled" :title="messages.richTextEditor.blockquote" :aria-label="messages.richTextEditor.blockquote" @click="editor?.chain().focus().toggleBlockquote().run()">
          <Quote :size="16" aria-hidden="true" />
        </button>
        <button type="button" :class="[toolbarButtonClass, editor?.isActive('codeBlock') ? toolbarButtonActiveClass : '']"
                :disabled="!editor || disabled" :title="messages.richTextEditor.codeBlock" :aria-label="messages.richTextEditor.codeBlock" @click="editor?.chain().focus().toggleCodeBlock().run()">
          <Code :size="16" aria-hidden="true" />
        </button>
        <button type="button" :class="[toolbarButtonClass, editor?.isActive('details') ? toolbarButtonActiveClass : '']"
                :disabled="!editor || disabled" :title="messages.richTextEditor.details" :aria-label="messages.richTextEditor.details" @click="toggleDetails">
          <ChevronsDownUp :size="16" aria-hidden="true" />
        </button>

        <span class="pr-rich-text-editor__separator pr:mx-[0.125rem] pr:my-[var(--pr-space-1)] pr:w-px pr:self-stretch pr:bg-[var(--pr-color-border)]" aria-hidden="true" />

        <button v-for="callout in CALLOUT_VARIANTS" :key="callout.variant" type="button"
                :class="[toolbarButtonClass, editor?.isActive('callout', { variant: callout.variant }) ? calloutVariantClass[callout.variant] : '']"
                :disabled="!editor || disabled" :title="callout.label" :aria-label="callout.label"
                @click="editor?.chain().focus().toggleCallout(callout.variant).run()">
          <component :is="callout.icon" :size="16" aria-hidden="true" />
        </button>

        <span class="pr-rich-text-editor__separator pr:mx-[0.125rem] pr:my-[var(--pr-space-1)] pr:w-px pr:self-stretch pr:bg-[var(--pr-color-border)]" aria-hidden="true" />

        <button type="button" :class="toolbarButtonClass" :disabled="!editor || disabled || isUploadingImage"
                :title="messages.richTextEditor.image" :aria-label="messages.richTextEditor.image" @click="pickAndUploadImage">
          <Hourglass v-if="isUploadingImage" :size="16" aria-hidden="true" />
          <Image v-else :size="16" aria-hidden="true" />
        </button>
        <button type="button" :class="toolbarButtonClass" :disabled="!editor || disabled"
                :title="messages.richTextEditor.youtube" :aria-label="messages.richTextEditor.youtube" @click="promptForYoutubeVideo">
          <Clapperboard :size="16" aria-hidden="true" />
        </button>
        <button type="button" :class="toolbarButtonClass" :disabled="!editor || disabled"
                :title="messages.richTextEditor.table" :aria-label="messages.richTextEditor.table" @click="insertTable">
          <Table2 :size="16" aria-hidden="true" />
        </button>
        <div ref="emojiPickerRef" class="pr-rich-text-editor__emoji-picker pr:relative pr:inline-flex">
          <button type="button" :class="toolbarButtonClass" :disabled="!editor || disabled"
                  :title="messages.richTextEditor.emoji" :aria-label="messages.richTextEditor.emoji"
                  :aria-expanded="isEmojiPickerOpen" @click="isEmojiPickerOpen = !isEmojiPickerOpen">
            <Smile :size="16" aria-hidden="true" />
          </button>
          <!--
            `grid-cols-[repeat(6,2rem)]` (fixed 2rem tracks matching the
            items' own `h-8 w-8`) instead of `grid-cols-6` (`1fr` tracks):
            this popover is `position: absolute` inside a `relative` parent
            that's only as wide as the smiley button (~36px) — with no
            `width` of its own, its `fr` columns divide up that tiny
            inherited width instead of the grid's actual content size,
            collapsing every column to ~1px and stacking all the emoji on
            top of each other. Fixed-length tracks aren't relative to the
            container's width, so they size correctly regardless of it.
          -->
          <div v-if="isEmojiPickerOpen" class="pr-rich-text-editor__emoji-popover pr:absolute pr:left-0 pr:top-[calc(100%+0.25rem)] pr:z-20 pr:grid pr:grid-cols-[repeat(6,2rem)] pr:gap-[0.125rem] pr:rounded-[var(--pr-radius-lg)] pr:border! pr:border-[var(--pr-color-border)]! pr:bg-[var(--pr-color-surface)] pr:p-[var(--pr-space-2)] pr:shadow-[var(--pr-shadow-md)]" role="menu">
            <button v-for="item in emojiPickerEmojis" :key="item.name" type="button"
                    class="pr-rich-text-editor__emoji-item pr:inline-flex pr:h-8 pr:w-8 pr:items-center pr:justify-center pr:rounded-[var(--pr-radius-md)] pr:border-none pr:bg-[transparent] pr:text-[length:1.125rem] pr:hover:not-disabled:bg-[var(--pr-color-surface-subtle)]" role="menuitem"
                    :aria-label="item.name" @click="insertEmoji(item.name)">
              {{ item.emoji }}
            </button>
          </div>
        </div>

        <span class="pr-rich-text-editor__separator pr:mx-[0.125rem] pr:my-[var(--pr-space-1)] pr:w-px pr:self-stretch pr:bg-[var(--pr-color-border)]" aria-hidden="true" />

        <button type="button" :class="toolbarButtonClass" :disabled="!editor?.can().undo()"
                :title="messages.richTextEditor.undo" :aria-label="messages.richTextEditor.undo" @click="editor?.chain().focus().undo().run()">
          <Undo2 :size="16" aria-hidden="true" />
        </button>
        <button type="button" :class="toolbarButtonClass" :disabled="!editor?.can().redo()"
                :title="messages.richTextEditor.redo" :aria-label="messages.richTextEditor.redo" @click="editor?.chain().focus().redo().run()">
          <Redo2 :size="16" aria-hidden="true" />
        </button>
      </div>

      <EditorContent
        :id="fieldId"
        :editor="editor"
        class="pr-rich-text-editor__content pr-editor-content"
      />

      <p v-if="uploadError" class="pr-rich-text-editor__upload-error pr:m-0 pr:rounded-b-[var(--pr-radius-lg)] pr:border-t pr:border-[var(--pr-color-border)] pr:px-[var(--pr-space-5)] pr:py-[var(--pr-space-2)] pr:text-[length:var(--pr-font-size-sm)] pr:text-[color:var(--pr-color-danger)]" role="alert">
        {{ uploadError }}
      </p>

      <p v-if="editor" class="pr-rich-text-editor__count pr:m-0 pr:rounded-b-[var(--pr-radius-lg)] pr:border-t pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface-subtle)] pr:px-[var(--pr-space-5)] pr:py-[var(--pr-space-2)] pr:text-[length:var(--pr-font-size-xs)] pr:text-[color:var(--pr-color-text-muted)]">
        {{ messages.richTextEditor.counts(editor.storage.characterCount.characters(), editor.storage.characterCount.words()) }}
      </p>
    </div>
    <input v-if="name" type="hidden" :name="name" :value="html">
    <p v-if="errorText" :id="errorId" class="pr-rich-text-editor__message pr-field-message pr:m-0 pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-danger)]">
      {{ errorText }}
    </p>
    <p v-else-if="hint" :id="hintId" class="pr-rich-text-editor__message pr-field-message pr:m-0 pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text-muted)]">
      {{ hint }}
    </p>
  </div>
</template>
