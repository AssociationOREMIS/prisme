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
import '../../../styles/editor-content.css'
import './rich-text-editor.css'
import { PrLabel } from '../../atoms/Label'

export interface PrRichTextEditorProps {
  modelValue?: string
  label?: string
  hint?: string
  error?: string
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
  placeholder: 'Rédigez votre contenu…',
  id: undefined,
  name: undefined,
  uploadImage: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

defineOptions({ inheritAttrs: false })

const lowlight = createLowlight(common)

const TEXT_ALIGNMENTS = [
  { align: 'left' as const, label: 'Aligner à gauche', icon: AlignLeft },
  { align: 'center' as const, label: 'Centrer', icon: AlignCenter },
  { align: 'right' as const, label: 'Aligner à droite', icon: AlignRight },
]

const EMOJI_PICKER_ITEMS = [
  'bulb', 'white_check_mark', 'warning', 'pushpin', 'dart', 'thumbsup',
  'fire', 'memo', 'clock3', 'date', 'sparkles', 'rocket',
  'mortar_board', 'books', 'bell', 'exclamation', 'question', 'clap',
  'raised_hands', 'speech_balloon', 'paperclip', 'framed_picture', 'tada', 'blush',
]

const CALLOUT_VARIANTS = [
  { variant: 'info' as const, label: 'Encadré info', icon: Info },
  { variant: 'success' as const, label: 'Encadré succès', icon: CircleCheck },
  { variant: 'warning' as const, label: 'Encadré avertissement', icon: TriangleAlert },
  { variant: 'danger' as const, label: 'Encadré danger', icon: OctagonX },
]

// `!` (Tailwind v4 important marker) is required here: these classes are
// appended alongside `toolbarButtonClass`'s own `bg-transparent`/`border-transparent`/
// `text-[color:var(--pr-color-text-muted)]`, which target the same properties.
// Same specificity (single class selector each) means the winner is whichever
// rule Tailwind happens to emit later in the generated stylesheet — not DOM
// class order — so without `!` these "active" overrides can silently lose.
const calloutVariantClass: Record<typeof CALLOUT_VARIANTS[number]['variant'], string> = {
  info: 'border-[var(--pr-color-info-border)]! bg-[var(--pr-color-info-soft)]! text-[color:var(--pr-color-info)]!',
  success: 'border-[var(--pr-color-success-border)]! bg-[var(--pr-color-success-soft)]! text-[color:var(--pr-color-success)]!',
  warning: 'border-[var(--pr-color-warning-border)]! bg-[var(--pr-color-warning-soft)]! text-[color:var(--pr-color-warning)]!',
  danger: 'border-[var(--pr-color-danger-border)]! bg-[var(--pr-color-danger-soft)]! text-[color:var(--pr-color-danger)]!',
}

const generatedId = useId()
const fieldId = computed(() => props.id ?? `pr-rich-text-editor-${generatedId}`)
const hintId = computed(() => `${fieldId.value}-hint`)
const errorId = computed(() => `${fieldId.value}-error`)
const describedBy = computed(() => {
  const ids: string[] = []

  if (props.hint) ids.push(hintId.value)
  if (props.error) ids.push(errorId.value)

  return ids.length > 0 ? ids.join(' ') : undefined
})

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
    uploadError.value = 'Aucun gestionnaire d\'envoi d\'image n\'est configuré pour cet éditeur.'

    return null
  }

  uploadError.value = null
  isUploadingImage.value = true

  try {
    return await props.uploadImage(file, () => {})
  }
  catch {
    uploadError.value = 'L\'envoi de l\'image a échoué. Réessayez avec un fichier JPG, PNG ou WebP de moins de 8 Mo.'

    return null
  }
  finally {
    isUploadingImage.value = false
  }
}

const editor = useEditor({
  content: props.modelValue,
  editable: !props.disabled,
  extensions: [
    StarterKit.configure({ link: false, codeBlock: false }),
    Link.configure({ openOnClick: false, autolink: true }),
    ImageResize.configure({ minWidth: 80, maxWidth: 1200 }),
    Youtube.configure({ nocookie: true, width: 640, height: 360 }),
    TableKit.configure({ table: { resizable: true } }),
    Placeholder.configure({ placeholder: props.placeholder }),
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
    emit('update:modelValue', instance.getHTML())
  },
})

watch(() => props.modelValue, (value) => {
  if (editor.value && value !== editor.value.getHTML()) {
    editor.value.commands.setContent(value, { emitUpdate: false })
  }
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
  const url = window.prompt('Collez le lien de la vidéo YouTube :')

  if (url) {
    editor.value?.chain().focus().setYoutubeVideo({ src: url }).run()
  }
}

function promptForLink() {
  const previousUrl = editor.value?.getAttributes('link').href ?? ''
  const url = window.prompt('URL du lien :', previousUrl)

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
const toolbarButtonClass = 'pr-rich-text-editor__btn inline-flex h-9 w-9 items-center justify-center rounded-[var(--pr-radius-md)] border! border-transparent! bg-[transparent] text-[color:var(--pr-color-text-muted)] transition-colors duration-[var(--pr-duration-fast)] ease-[var(--pr-ease-standard)] hover:not-disabled:bg-[var(--pr-color-surface-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pr-color-focus)] disabled:cursor-not-allowed disabled:opacity-40'
// `!` needed: see comment above `calloutVariantClass` — same base-class collision.
const toolbarButtonActiveClass = 'bg-[var(--pr-color-primary)]! text-[color:var(--pr-color-primary-contrast)]!'
</script>

<template>
  <div class="pr-rich-text-editor grid gap-[var(--pr-space-2)] text-[color:var(--pr-color-text)]">
    <PrLabel
      v-if="label"
      :for="fieldId"
      :required="required"
      :disabled="disabled"
      @click="focusEditor"
    >
      {{ label }}
    </PrLabel>
    <div
      v-bind="$attrs"
      class="pr-rich-text-editor__root rounded-[var(--pr-radius-lg)] border! bg-[var(--pr-color-surface)]"
      :class="[error ? 'border-[var(--pr-color-danger)]!' : 'border-[var(--pr-color-border-strong)]!', disabled ? 'opacity-60' : '']"
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
      <div class="pr-rich-text-editor__toolbar sticky top-[var(--pr-rich-text-editor-sticky-offset,0px)] z-10 flex flex-wrap items-center gap-[var(--pr-space-1)] rounded-t-[var(--pr-radius-lg)] border-b border-[var(--pr-color-border)] bg-[var(--pr-color-surface)] p-[var(--pr-space-2)]" role="toolbar" aria-label="Mise en forme du contenu">
        <button type="button" :class="[toolbarButtonClass, editor?.isActive('heading', { level: 2 }) ? toolbarButtonActiveClass : '']"
                :disabled="!editor || disabled" title="Titre" aria-label="Titre" @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()">
          <Heading2 :size="16" aria-hidden="true" />
        </button>
        <button type="button" :class="[toolbarButtonClass, editor?.isActive('heading', { level: 3 }) ? toolbarButtonActiveClass : '']"
                :disabled="!editor || disabled" title="Sous-titre" aria-label="Sous-titre" @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()">
          <Heading3 :size="16" aria-hidden="true" />
        </button>

        <span class="pr-rich-text-editor__separator mx-[0.125rem] my-[var(--pr-space-1)] w-px self-stretch bg-[var(--pr-color-border)]" aria-hidden="true" />

        <button type="button" :class="[toolbarButtonClass, editor?.isActive('bold') ? toolbarButtonActiveClass : '']"
                :disabled="!editor || disabled" title="Gras" aria-label="Gras" @click="editor?.chain().focus().toggleBold().run()">
          <Bold :size="16" aria-hidden="true" />
        </button>
        <button type="button" :class="[toolbarButtonClass, editor?.isActive('italic') ? toolbarButtonActiveClass : '']"
                :disabled="!editor || disabled" title="Italique" aria-label="Italique" @click="editor?.chain().focus().toggleItalic().run()">
          <Italic :size="16" aria-hidden="true" />
        </button>
        <button type="button" :class="[toolbarButtonClass, editor?.isActive('subscript') ? toolbarButtonActiveClass : '']"
                :disabled="!editor || disabled" title="Indice" aria-label="Indice" @click="editor?.chain().focus().toggleSubscript().run()">
          <SubscriptIcon :size="16" aria-hidden="true" />
        </button>
        <button type="button" :class="[toolbarButtonClass, editor?.isActive('superscript') ? toolbarButtonActiveClass : '']"
                :disabled="!editor || disabled" title="Exposant" aria-label="Exposant" @click="editor?.chain().focus().toggleSuperscript().run()">
          <SuperscriptIcon :size="16" aria-hidden="true" />
        </button>
        <button type="button" :class="[toolbarButtonClass, editor?.isActive('link') ? toolbarButtonActiveClass : '']"
                :disabled="!editor || disabled" title="Lien" aria-label="Lien" @click="promptForLink">
          <LinkIcon :size="16" aria-hidden="true" />
        </button>
        <button type="button" :class="[toolbarButtonClass, editor?.isActive('highlight') ? toolbarButtonActiveClass : '']"
                :disabled="!editor || disabled" title="Surligner" aria-label="Surligner" @click="editor?.chain().focus().toggleHighlight().run()">
          <Highlighter :size="16" aria-hidden="true" />
        </button>
        <label class="pr-rich-text-editor__color relative inline-flex h-9 w-9 items-center justify-center rounded-[var(--pr-radius-md)] text-[color:var(--pr-color-text-muted)] hover:bg-[var(--pr-color-surface-subtle)]" title="Couleur du texte">
          <Palette :size="16" aria-hidden="true" />
          <input type="color" class="absolute inset-0 h-full w-full cursor-pointer opacity-0" aria-label="Couleur du texte" :disabled="!editor || disabled"
                 :value="editor?.getAttributes('textStyle').color || '#000000'" @input="setTextColor">
        </label>
        <button type="button" :class="toolbarButtonClass" :disabled="!editor || disabled"
                title="Retirer la couleur" aria-label="Retirer la couleur du texte" @click="unsetTextColor">
          <Eraser :size="16" aria-hidden="true" />
        </button>

        <span class="pr-rich-text-editor__separator mx-[0.125rem] my-[var(--pr-space-1)] w-px self-stretch bg-[var(--pr-color-border)]" aria-hidden="true" />

        <button v-for="alignment in TEXT_ALIGNMENTS" :key="alignment.align" type="button"
                :class="[toolbarButtonClass, editor?.isActive({ textAlign: alignment.align }) ? toolbarButtonActiveClass : '']"
                :disabled="!editor || disabled" :title="alignment.label" :aria-label="alignment.label"
                @click="editor?.chain().focus().setTextAlign(alignment.align).run()">
          <component :is="alignment.icon" :size="16" aria-hidden="true" />
        </button>

        <span class="pr-rich-text-editor__separator mx-[0.125rem] my-[var(--pr-space-1)] w-px self-stretch bg-[var(--pr-color-border)]" aria-hidden="true" />

        <button type="button" :class="[toolbarButtonClass, editor?.isActive('bulletList') ? toolbarButtonActiveClass : '']"
                :disabled="!editor || disabled" title="Liste à puces" aria-label="Liste à puces" @click="editor?.chain().focus().toggleBulletList().run()">
          <List :size="16" aria-hidden="true" />
        </button>
        <button type="button" :class="[toolbarButtonClass, editor?.isActive('orderedList') ? toolbarButtonActiveClass : '']"
                :disabled="!editor || disabled" title="Liste numérotée" aria-label="Liste numérotée" @click="editor?.chain().focus().toggleOrderedList().run()">
          <ListOrdered :size="16" aria-hidden="true" />
        </button>
        <button type="button" :class="[toolbarButtonClass, editor?.isActive('taskList') ? toolbarButtonActiveClass : '']"
                :disabled="!editor || disabled" title="Liste à cocher" aria-label="Liste à cocher" @click="editor?.chain().focus().toggleTaskList().run()">
          <ListChecks :size="16" aria-hidden="true" />
        </button>
        <button type="button" :class="[toolbarButtonClass, editor?.isActive('blockquote') ? toolbarButtonActiveClass : '']"
                :disabled="!editor || disabled" title="Citation" aria-label="Citation" @click="editor?.chain().focus().toggleBlockquote().run()">
          <Quote :size="16" aria-hidden="true" />
        </button>
        <button type="button" :class="[toolbarButtonClass, editor?.isActive('codeBlock') ? toolbarButtonActiveClass : '']"
                :disabled="!editor || disabled" title="Bloc de code" aria-label="Bloc de code" @click="editor?.chain().focus().toggleCodeBlock().run()">
          <Code :size="16" aria-hidden="true" />
        </button>
        <button type="button" :class="[toolbarButtonClass, editor?.isActive('details') ? toolbarButtonActiveClass : '']"
                :disabled="!editor || disabled" title="Section repliable" aria-label="Section repliable" @click="toggleDetails">
          <ChevronsDownUp :size="16" aria-hidden="true" />
        </button>

        <span class="pr-rich-text-editor__separator mx-[0.125rem] my-[var(--pr-space-1)] w-px self-stretch bg-[var(--pr-color-border)]" aria-hidden="true" />

        <button v-for="callout in CALLOUT_VARIANTS" :key="callout.variant" type="button"
                :class="[toolbarButtonClass, editor?.isActive('callout', { variant: callout.variant }) ? calloutVariantClass[callout.variant] : '']"
                :disabled="!editor || disabled" :title="callout.label" :aria-label="callout.label"
                @click="editor?.chain().focus().toggleCallout(callout.variant).run()">
          <component :is="callout.icon" :size="16" aria-hidden="true" />
        </button>

        <span class="pr-rich-text-editor__separator mx-[0.125rem] my-[var(--pr-space-1)] w-px self-stretch bg-[var(--pr-color-border)]" aria-hidden="true" />

        <button type="button" :class="toolbarButtonClass" :disabled="!editor || disabled || isUploadingImage"
                title="Insérer une image" aria-label="Insérer une image" @click="pickAndUploadImage">
          <Hourglass v-if="isUploadingImage" :size="16" aria-hidden="true" />
          <Image v-else :size="16" aria-hidden="true" />
        </button>
        <button type="button" :class="toolbarButtonClass" :disabled="!editor || disabled"
                title="Intégrer une vidéo YouTube" aria-label="Intégrer une vidéo YouTube" @click="promptForYoutubeVideo">
          <Clapperboard :size="16" aria-hidden="true" />
        </button>
        <button type="button" :class="toolbarButtonClass" :disabled="!editor || disabled"
                title="Insérer un tableau" aria-label="Insérer un tableau" @click="insertTable">
          <Table2 :size="16" aria-hidden="true" />
        </button>
        <div ref="emojiPickerRef" class="pr-rich-text-editor__emoji-picker relative inline-flex">
          <button type="button" :class="toolbarButtonClass" :disabled="!editor || disabled"
                  title="Insérer un emoji" aria-label="Insérer un emoji"
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
          <div v-if="isEmojiPickerOpen" class="pr-rich-text-editor__emoji-popover absolute left-0 top-[calc(100%+0.25rem)] z-20 grid grid-cols-[repeat(6,2rem)] gap-[0.125rem] rounded-[var(--pr-radius-lg)] border! border-[var(--pr-color-border)]! bg-[var(--pr-color-surface)] p-[var(--pr-space-2)] shadow-[var(--pr-shadow-md)]" role="menu">
            <button v-for="item in emojiPickerEmojis" :key="item.name" type="button"
                    class="pr-rich-text-editor__emoji-item inline-flex h-8 w-8 items-center justify-center rounded-[var(--pr-radius-md)] border-none bg-[transparent] text-[length:1.125rem] hover:not-disabled:bg-[var(--pr-color-surface-subtle)]" role="menuitem"
                    :aria-label="item.name" @click="insertEmoji(item.name)">
              {{ item.emoji }}
            </button>
          </div>
        </div>

        <span class="pr-rich-text-editor__separator mx-[0.125rem] my-[var(--pr-space-1)] w-px self-stretch bg-[var(--pr-color-border)]" aria-hidden="true" />

        <button type="button" :class="toolbarButtonClass" :disabled="!editor?.can().undo()"
                title="Annuler" aria-label="Annuler" @click="editor?.chain().focus().undo().run()">
          <Undo2 :size="16" aria-hidden="true" />
        </button>
        <button type="button" :class="toolbarButtonClass" :disabled="!editor?.can().redo()"
                title="Rétablir" aria-label="Rétablir" @click="editor?.chain().focus().redo().run()">
          <Redo2 :size="16" aria-hidden="true" />
        </button>
      </div>

      <EditorContent
        :id="fieldId"
        :editor="editor"
        class="pr-rich-text-editor__content pr-editor-content"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="describedBy"
        :aria-required="required"
      />

      <p v-if="uploadError" class="pr-rich-text-editor__upload-error m-0 rounded-b-[var(--pr-radius-lg)] border-t border-[var(--pr-color-border)] px-[var(--pr-space-5)] py-[var(--pr-space-2)] text-[length:var(--pr-font-size-sm)] text-[color:var(--pr-color-danger)]" role="alert">
        {{ uploadError }}
      </p>

      <p v-if="editor" class="pr-rich-text-editor__count m-0 rounded-b-[var(--pr-radius-lg)] border-t border-[var(--pr-color-border)] bg-[var(--pr-color-surface-subtle)] px-[var(--pr-space-5)] py-[var(--pr-space-2)] text-[length:var(--pr-font-size-xs)] text-[color:var(--pr-color-text-muted)]">
        {{ editor.storage.characterCount.characters() }} caractères · {{ editor.storage.characterCount.words() }} mots
      </p>
    </div>
    <input v-if="name" type="hidden" :name="name" :value="modelValue">
    <p v-if="error" :id="errorId" class="pr-rich-text-editor__message pr-field-message m-0 text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-danger)]">
      {{ error }}
    </p>
    <p v-else-if="hint" :id="hintId" class="pr-rich-text-editor__message pr-field-message m-0 text-[length:var(--pr-font-size-sm)] leading-[var(--pr-line-height-tight)] text-[color:var(--pr-color-text-muted)]">
      {{ hint }}
    </p>
  </div>
</template>
