<script setup lang="ts">
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronsDownUp,
  Clapperboard,
  Code,
  GripVertical,
  Minus,
  Pilcrow,
  Strikethrough,
  Underline as UnderlineIcon,
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
  ScanText,
  Smile,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Table2,
  TriangleAlert,
  Undo2,
} from '@lucide/vue'
import type { AnyExtension, Editor } from '@tiptap/core'
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
import { TaskList } from '@tiptap/extension-task-list'
import { TextAlign } from '@tiptap/extension-text-align'
import { TextStyleKit } from '@tiptap/extension-text-style'
import { Typography } from '@tiptap/extension-typography'
import { StarterKit } from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import { BubbleMenu } from '@tiptap/vue-3/menus'
import type { SuggestionFloatingUiOptions, SuggestionProps } from '@tiptap/suggestion'
import { common, createLowlight } from 'lowlight'
import { computed, nextTick, onBeforeUnmount, onMounted, onUpdated, reactive, ref, useId, watch, type ComponentPublicInstance } from 'vue'
import { AccessibleImage, imageWidthAttributes, PR_IMAGE_WIDTHS, type PrImageWidth } from '../../../tiptap/accessible-image'
import { AccessibleTaskItem, taskText } from '../../../tiptap/accessible-task-item'
import { AccessibleYoutube } from '../../../tiptap/accessible-youtube'
import { Callout } from '../../../tiptap/callout'
import { ScopedTableHeader } from '../../../tiptap/scoped-table-header'
import { PrButton } from '../../atoms/Button'
import { PrCheckbox } from '../../atoms/Checkbox'
import { PrInput } from '../../atoms/Input'
import { PrLabel } from '../../atoms/Label'
import { useErrorText, type PrFieldError } from '../../fieldError'
import { usePrMessages } from '../../../i18n/context'
import type { PrRichTextEditorBlock } from '../../../i18n/messages'
import { BlockKeys, htmlToSource, SlashCommand, type PrBlockMoveResult, type PrRichTextEditorSlashItem, type PrSlashMenuRenderer } from './blocks'
import PrRichTextEditorBlockHandle from './PrRichTextEditorBlockHandle.vue'
import PrRichTextEditorSlashMenu from './PrRichTextEditorSlashMenu.vue'

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
   * editor). Resolve with the uploaded image's URL: the editor then asks for
   * its alternative text and inserts it. Reject (or throw) to surface an error
   * message instead. Without this prop, image insertion is disabled.
   */
  uploadImage?: (file: File, onProgress?: (percent: number) => void) => Promise<string>
  /**
   * `toolbar` (default): the fixed formatting toolbar. `blocks`: a Notion-like editor, with a "/"
   * menu to insert blocks, a handle and a menu to move them, a toolbar over selected text, and the
   * "Écrire" / "Aperçu" / "Code HTML" tabs. Read once, when the editor is created.
   */
  variant?: 'toolbar' | 'blocks'
  /** Extra tiptap extensions, added after the editor's own (an app's layout blocks). Read once. */
  extensions?: AnyExtension[]
  /** Extra items of the "/" menu (`variant="blocks"`), listed after the editor's own blocks. */
  slashItems?: PrRichTextEditorSlashItem[]
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
  variant: 'toolbar',
  extensions: () => [],
  slashItems: () => [],
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

const IMAGE_WIDTHS: { width: PrImageWidth, label: string }[] = [
  { width: 'small', label: messages.richTextEditor.imageWidthSmall },
  { width: 'medium', label: messages.richTextEditor.imageWidthMedium },
  { width: 'full', label: messages.richTextEditor.imageWidthFull },
]

// `!` (Tailwind v4 important marker) is required here: these classes are
// appended alongside `toolbarButtonClass`'s own `bg-transparent`/`border-transparent`/
// `text-[color:var(--pr-color-text-muted)]`, which target the same properties.
// Same specificity (single class selector each) means the winner is whichever
// rule Tailwind happens to emit later in the generated stylesheet, not DOM
// class order, so without `!` these "active" overrides can silently lose.
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
const emojiTriggerId = computed(() => `${fieldId.value}-emoji-trigger`)
const emojiMenuId = computed(() => `${fieldId.value}-emoji-menu`)
const imagePanelTitleId = computed(() => `${fieldId.value}-image-panel-title`)
const blocksHelpId = computed(() => `${fieldId.value}-blocks-help`)
const slashMenuId = computed(() => `${fieldId.value}-slash-menu`)
const blockMenuId = computed(() => `${fieldId.value}-block-menu`)
const sourceFieldId = computed(() => `${fieldId.value}-source`)
// Read once, like the extensions: switching variants would mean another editor.
const isBlocks = props.variant === 'blocks'
// The error, then the hint: the hint stays shown with the error (RGAA 11.10). In the blocks
// variant, the help line (the "/" menu, Alt+arrows) comes last.
const describedBy = computed(() => [
  errorText.value ? errorId.value : undefined,
  props.hint ? hintId.value : undefined,
  isBlocks ? blocksHelpId.value : undefined,
].filter(Boolean).join(' ') || undefined)

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
// Polite status of the image upload, for screen readers (the hourglass icon only shows it).
const uploadStatus = ref('')
const isEmojiPickerOpen = ref(false)
const emojiPickerRef = ref<HTMLElement | null>(null)
const emojiTriggerRef = ref<HTMLButtonElement | null>(null)
const emojiMenuRef = ref<HTMLElement | null>(null)
// Left shift of the emoji popover, in px: anchored to the left of its button, it ran off the right
// edge of a phone screen (320 px) when the button sat near the end of the toolbar.
const emojiPopoverShift = ref(0)
const toolbarRef = ref<HTMLElement | null>(null)
// Images without an `alt` attribute (older content): an author-facing warning under the editor.
const imagesMissingAlt = ref(0)

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
  uploadStatus.value = messages.richTextEditor.imageUploading
  isUploadingImage.value = true

  try {
    const url = await props.uploadImage(file, () => {})
    uploadStatus.value = messages.richTextEditor.imageUploaded

    return url
  }
  catch {
    uploadStatus.value = ''
    uploadError.value = messages.richTextEditor.uploadFailed

    return null
  }
  finally {
    isUploadingImage.value = false
  }
}

function countImagesMissingAlt(instance: Editor) {
  let count = 0
  instance.state.doc.descendants((node) => {
    if (node.type.name === AccessibleImage.name && typeof node.attrs.alt !== 'string') count++
  })
  imagesMissingAlt.value = count
}

/*
 * Blocks variant (`variant="blocks"`): live announcements, the "/" menu, the toolbar over selected
 * text, the block handle and the "Écrire" / "Aperçu" / "Code HTML" tabs.
 */
const blockStatus = ref('')
let announceTimer: ReturnType<typeof setTimeout> | undefined

/** Says `message` in the polite live region (emptied first, so the same message is said again). */
function announce(message: string) {
  blockStatus.value = ''
  clearTimeout(announceTimer)
  announceTimer = setTimeout(() => {
    blockStatus.value = message
  }, 30)
}

function announceMove(result: PrBlockMoveResult) {
  announce({
    up: messages.richTextEditor.blockMovedUp,
    down: messages.richTextEditor.blockMovedDown,
    first: messages.richTextEditor.blockAlreadyFirst,
    last: messages.richTextEditor.blockAlreadyLast,
  }[result])
}

function slashItem(block: PrRichTextEditorBlock, icon: PrRichTextEditorSlashItem['icon'], command: (instance: Editor) => void): PrRichTextEditorSlashItem {
  return { ...messages.richTextEditor.slashBlock(block), icon, command }
}

/** The editor's own blocks, then the app's (`slashItems`). The image needs `uploadImage`. */
const allSlashItems = computed<PrRichTextEditorSlashItem[]>(() => [
  slashItem('paragraph', Pilcrow, instance => instance.chain().focus().setParagraph().run()),
  slashItem('heading', Heading2, instance => instance.chain().focus().setHeading({ level: 2 }).run()),
  slashItem('subheading', Heading3, instance => instance.chain().focus().setHeading({ level: 3 }).run()),
  slashItem('bulletList', List, instance => instance.chain().focus().toggleBulletList().run()),
  slashItem('orderedList', ListOrdered, instance => instance.chain().focus().toggleOrderedList().run()),
  slashItem('taskList', ListChecks, instance => instance.chain().focus().toggleTaskList().run()),
  slashItem('blockquote', Quote, instance => instance.chain().focus().toggleBlockquote().run()),
  slashItem('calloutInfo', Info, instance => instance.chain().focus().toggleCallout('info').run()),
  slashItem('calloutSuccess', CircleCheck, instance => instance.chain().focus().toggleCallout('success').run()),
  slashItem('calloutWarning', TriangleAlert, instance => instance.chain().focus().toggleCallout('warning').run()),
  slashItem('calloutDanger', OctagonX, instance => instance.chain().focus().toggleCallout('danger').run()),
  ...(props.uploadImage ? [slashItem('image', Image, () => pickAndUploadImage())] : []),
  slashItem('table', Table2, () => insertTable()),
  slashItem('youtube', Clapperboard, () => promptForYoutubeVideo()),
  slashItem('details', ChevronsDownUp, instance => instance.chain().focus().setDetails().run()),
  slashItem('separator', Minus, instance => instance.chain().focus().setHorizontalRule().run()),
  ...props.slashItems,
])

/*
 * The "/" menu: the suggestion plugin finds the query and positions the list (Floating UI, `fixed`);
 * this component renders it and keeps it 8 px away from the edges of the screen.
 */
const slash = reactive({
  open: false,
  items: [] as PrRichTextEditorSlashItem[],
  index: 0,
})
let slashCommand: ((item: PrRichTextEditorSlashItem) => void) | null = null
let slashUnmount: (() => void) | null = null
const slashMenuRef = ref<ComponentPublicInstance<{ root: HTMLElement | null, optionId: (index: number) => string }> | null>(null)

const slashFloatingUi: SuggestionFloatingUiOptions = {
  strategy: 'fixed',
  middleware: [{
    name: 'prKeepOnScreen',
    fn: ({ x, y, rects }) => ({
      x: Math.max(8, Math.min(x, document.documentElement.clientWidth - rects.floating.width - 8)),
      y: Math.max(8, y),
    }),
  }],
}

/** The text field points to the list and to its active option (aria-controls, aria-activedescendant). */
function syncSlashAria() {
  const dom = editor.value?.view.dom
  if (!dom) return
  if (slash.open) dom.setAttribute('aria-controls', slashMenuId.value)
  else dom.removeAttribute('aria-controls')
  if (slash.open && slash.items.length > 0) dom.setAttribute('aria-activedescendant', `${slashMenuId.value}-option-${slash.index}`)
  else dom.removeAttribute('aria-activedescendant')
}

function takeSlashProps(suggestion: SuggestionProps<PrRichTextEditorSlashItem, PrRichTextEditorSlashItem>) {
  const sameItems = suggestion.items.length === slash.items.length && suggestion.items.every((item, index) => item === slash.items[index])
  slash.items = suggestion.items
  if (!sameItems) slash.index = 0
  slashCommand = suggestion.command
}

function slashRenderer(): PrSlashMenuRenderer {
  return {
    onStart: async (suggestion) => {
      takeSlashProps(suggestion)
      slash.index = 0
      slash.open = true
      await nextTick()
      const element = slashMenuRef.value?.root
      if (slash.open && element) {
        slashUnmount?.()
        slashUnmount = suggestion.mount(element)
      }
      syncSlashAria()
    },
    onUpdate: async (suggestion) => {
      takeSlashProps(suggestion)
      await nextTick()
      syncSlashAria()
    },
    onKeyDown: ({ event }) => {
      if (!slash.open) return false
      const count = Math.max(slash.items.length, 1)
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        slash.index = (slash.index + (event.key === 'ArrowDown' ? 1 : count - 1)) % count
        void nextTick(syncSlashAria)

        return true
      }
      if (event.key === 'Enter' || event.key === 'Tab') {
        const item = slash.items[slash.index]
        if (!item) return false
        selectSlashItem(slash.index)

        return true
      }

      // Escape: the plugin closes the menu; the focus never left the text.
      return event.key === 'Escape'
    },
    onExit: () => {
      slashUnmount?.()
      slashUnmount = null
      slash.open = false
      slash.items = []
      slashCommand = null
      syncSlashAria()
    },
  }
}

function selectSlashItem(index: number) {
  const item = slash.items[index]
  if (item) slashCommand?.(item)
}

/* Toolbar over selected text: shown while writing, over a text selection, in the focused editor. */
const selectionToolbarRef = ref<ComponentPublicInstance | null>(null)
const bubbleOptions = { placement: 'top' as const, offset: 8, flip: { padding: 8 }, shift: { padding: 8 } }

function selectionToolbarElement(): HTMLElement | null {
  const element = selectionToolbarRef.value?.$el

  return element instanceof HTMLElement ? element : null
}

function shouldShowSelectionToolbar({ editor: instance, view, from, to }: { editor: Editor, view: Editor['view'], from: number, to: number }) {
  const toolbar = selectionToolbarElement()

  return from !== to
    && currentView.value === 'write'
    && instance.isEditable
    && (view.hasFocus() || Boolean(toolbar?.contains(document.activeElement)))
    && !instance.isActive(AccessibleImage.name) && !instance.isActive('youtube') && !instance.isActive('table')
}

function selectionToolbarItems(): HTMLElement[] {
  return Array.from(selectionToolbarElement()?.querySelectorAll<HTMLElement>('button') ?? [])
}

function focusSelectionToolbar(): boolean {
  const toolbar = selectionToolbarElement()
  if (!toolbar || toolbar.style.visibility !== 'visible') return false
  const items = selectionToolbarItems()
  items.forEach((item, index) => item.setAttribute('tabindex', index === 0 ? '0' : '-1'))
  items[0]?.focus()

  return true
}

function onSelectionToolbarKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    focusEditor()

    return
  }
  const items = selectionToolbarItems()
  const current = items.indexOf(event.target as HTMLElement)
  if (current === -1) return
  const next = {
    ArrowRight: (current + 1) % items.length,
    ArrowLeft: (current - 1 + items.length) % items.length,
    Home: 0,
    End: items.length - 1,
  }[event.key]
  if (next === undefined) return
  event.preventDefault()
  items.forEach((item, index) => item.setAttribute('tabindex', index === next ? '0' : '-1'))
  items[next].focus()
}

const SELECTION_MARKS = [
  { mark: 'bold', label: messages.richTextEditor.bold, icon: Bold, toggle: (instance: Editor) => instance.chain().focus().toggleBold().run() },
  { mark: 'italic', label: messages.richTextEditor.italic, icon: Italic, toggle: (instance: Editor) => instance.chain().focus().toggleItalic().run() },
  { mark: 'underline', label: messages.richTextEditor.underline, icon: UnderlineIcon, toggle: (instance: Editor) => instance.chain().focus().toggleUnderline().run() },
  { mark: 'strike', label: messages.richTextEditor.strike, icon: Strikethrough, toggle: (instance: Editor) => instance.chain().focus().toggleStrike().run() },
]

/* Block handle, and its menu opened from the "Options du bloc" button. */
const surfaceRef = ref<HTMLElement | null>(null)
const blockHandleRef = ref<InstanceType<typeof PrRichTextEditorBlockHandle> | null>(null)

function openBlockMenu(event: MouseEvent) {
  blockHandleRef.value?.openMenuForCursor(event.currentTarget as HTMLElement)
}

function editImageAt(pos: number) {
  editor.value?.chain().focus().setNodeSelection(pos).run()
  openSelectedImageProperties()
}

/*
 * "Écrire" / "Aperçu" / "Code HTML" (WAI-ARIA APG "Tabs", automatic activation). The preview shows
 * the HTML read-only with the content styles; the code is one block per line, loaded back into the
 * editor (cleaned by its schema) when leaving the tab, or when the form is sent from it.
 */
type EditorView = 'write' | 'preview' | 'source'
const VIEWS: EditorView[] = ['write', 'preview', 'source']
const currentView = ref<EditorView>('write')
const previewHtml = ref('')
const sourceCode = ref('')
/** The code as shown when the tab opened: unchanged, nothing to load back. */
let shownSource = ''
const tablistRef = ref<HTMLElement | null>(null)

const viewLabels = computed<Record<EditorView, string>>(() => ({
  write: messages.richTextEditor.viewWrite,
  preview: messages.richTextEditor.viewPreview,
  source: messages.richTextEditor.viewSource,
}))

function tabId(view: EditorView) {
  return `${fieldId.value}-tab-${view}`
}

function panelId(view: EditorView) {
  return `${fieldId.value}-panel-${view}`
}

/** Loads the "Code HTML" tab into the editor, as one step "Annuler" can undo. */
function applySource() {
  if (!editor.value || sourceCode.value === shownSource) return
  editor.value.commands.setContent(sourceCode.value, { emitUpdate: true })
  shownSource = sourceCode.value
  announce(messages.richTextEditor.sourceLoaded)
}

function showView(view: EditorView, focus: 'editor' | 'tab' | 'none' = 'none') {
  if (currentView.value === 'source' && view !== 'source') applySource()
  currentView.value = view
  blockHandleRef.value?.closeMenu(false)
  const instance = editor.value
  if (view === 'preview' && instance) previewHtml.value = instance.isEmpty ? '' : instance.getHTML()
  if (view === 'source' && instance) {
    sourceCode.value = htmlToSource(instance.isEmpty ? '' : instance.getHTML())
    shownSource = sourceCode.value
  }
  if (view !== 'write') instance?.view.dispatch(instance.state.tr.setMeta('bubbleMenu', 'hide').setMeta('addToHistory', false))
  if (focus === 'editor' && view === 'write') focusEditor()
  else if (focus === 'tab') void nextTick(() => tablistRef.value?.querySelector<HTMLElement>(`[id="${tabId(view)}"]`)?.focus())
}

function onTabKeydown(event: KeyboardEvent, index: number) {
  const target = {
    ArrowLeft: VIEWS[(index + VIEWS.length - 1) % VIEWS.length],
    ArrowRight: VIEWS[(index + 1) % VIEWS.length],
    Home: VIEWS[0],
    End: VIEWS[VIEWS.length - 1],
  }[event.key]
  if (!target) return
  event.preventDefault()
  showView(target, 'tab')
}

function onLabelClick() {
  if (currentView.value === 'write') focusEditor()
  else showView('write', 'editor')
}

/*
 * The hidden input always sends the latest HTML: a form sent from the "Code HTML" tab loads the code
 * first, and the value is written into the input (and the form data) directly, as Vue would patch
 * the input too late. `submit` is listened to in the capture phase, before the app's own handlers.
 */
const hiddenInputRef = ref<HTMLInputElement | null>(null)
let watchedForm: HTMLFormElement | null = null

function syncHiddenInput(): string | null {
  if (!props.name || !editor.value) return null
  if (currentView.value === 'source') applySource()
  const latest = editor.value.getHTML()
  html.value = latest
  if (hiddenInputRef.value) hiddenInputRef.value.value = latest

  return latest
}

function onFormData(event: FormDataEvent) {
  const latest = syncHiddenInput()
  if (latest !== null && props.name) event.formData.set(props.name, latest)
}

function watchForm() {
  const form = hiddenInputRef.value?.form ?? null
  if (form === watchedForm) return
  watchedForm?.removeEventListener('submit', syncHiddenInput, true)
  watchedForm?.removeEventListener('formdata', onFormData)
  form?.addEventListener('submit', syncHiddenInput, true)
  form?.addEventListener('formdata', onFormData)
  watchedForm = form
}

onMounted(() => {
  if (isBlocks) watchForm()
})
onUpdated(() => {
  if (isBlocks) watchForm()
})

// What the hidden input submits. Without a v-model (a plain Blade form passing the initial
// HTML once), `modelValue` never follows the edits, so the form would post the original text.
const html = ref(props.modelValue)

const editor = useEditor({
  content: props.modelValue,
  editable: !props.disabled,
  extensions: [
    StarterKit.configure({ link: false, codeBlock: false }),
    Link.configure({ openOnClick: false, autolink: true }),
    AccessibleImage.configure({ minWidth: 80, maxWidth: PR_IMAGE_WIDTHS.full }),
    AccessibleYoutube.configure({ nocookie: true, width: 640, height: 360, defaultTitle: messages.richTextEditor.youtubeDefaultTitle }),
    TableKit.configure({ table: { resizable: true }, tableHeader: false }),
    ScopedTableHeader,
    Placeholder.configure({ placeholder: props.placeholder ?? (isBlocks ? messages.richTextEditor.blocksPlaceholder : messages.richTextEditor.placeholder) }),
    Highlight,
    TextStyleKit.configure({ fontFamily: false, fontSize: false, lineHeight: false, backgroundColor: false }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    TaskList,
    AccessibleTaskItem.configure({
      nested: true,
      a11y: { checkboxLabel: node => messages.richTextEditor.taskCheckbox(taskText(node)) },
    }),
    CodeBlockLowlight.configure({ lowlight }),
    CharacterCount,
    Details.configure({
      persist: true,
      renderToggleButton: ({ element, isOpen }) => {
        element.setAttribute('aria-label', isOpen ? messages.richTextEditor.detailsCollapse : messages.richTextEditor.detailsExpand)
      },
    }),
    DetailsSummary,
    DetailsContent,
    Subscript,
    Superscript,
    Typography,
    Emoji.configure({ emojis: defaultEmojis, enableEmoticons: true }),
    Callout.configure({
      prefixes: {
        info: messages.richTextEditor.calloutPrefixInfo,
        success: messages.richTextEditor.calloutPrefixSuccess,
        warning: messages.richTextEditor.calloutPrefixWarning,
        danger: messages.richTextEditor.calloutPrefixDanger,
      },
    }),
    ...(isBlocks
      ? [
          SlashCommand.configure({ items: () => allSlashItems.value, renderer: slashRenderer, floatingUi: slashFloatingUi }),
          BlockKeys.configure({ onMove: announceMove }),
        ]
      : []),
    ...props.extensions,
  ],
  editorProps: {
    attributes: () => contentAttributes(),
    handleKeyDown(_view, event) {
      // Alt+F10 goes to the toolbar of the selected text (the usual shortcut of rich text editors).
      if (isBlocks && event.altKey && event.key === 'F10') return focusSelectionToolbar()

      return false
    },
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
  onCreate: ({ editor: instance }) => countImagesMissingAlt(instance),
  onTransaction: ({ editor: instance, transaction }) => {
    if (transaction.docChanged) countImagesMissingAlt(instance)
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
  watchedForm?.removeEventListener('submit', syncHiddenInput, true)
  watchedForm?.removeEventListener('formdata', onFormData)
  clearTimeout(announceTimer)
})

function focusEditor() {
  editor.value?.chain().focus().run()
}

/*
 * Toolbar keyboard pattern (WAI-ARIA APG "Toolbar"): one tab stop for the whole toolbar, the
 * arrow keys (and Home/End) move between its controls, and Tab comes back to the control used last.
 * Controls are marked `data-toolbar-item`; disabled ones are skipped.
 */
const toolbarActiveIndex = ref(0)

function toolbarItems(): HTMLElement[] {
  return Array.from(toolbarRef.value?.querySelectorAll<HTMLElement>('[data-toolbar-item]') ?? [])
}

function isEnabled(item: HTMLElement) {
  return !(item as HTMLButtonElement).disabled
}

function syncToolbarTabStops() {
  const items = toolbarItems()
  let index = Math.min(toolbarActiveIndex.value, items.length - 1)
  // The remembered control got disabled (undo with nothing left to undo): keep a tab stop anyway.
  if (items[index] && !isEnabled(items[index])) {
    const firstEnabled = items.findIndex(isEnabled)
    if (firstEnabled !== -1) index = firstEnabled
  }
  items.forEach((item, itemIndex) => item.setAttribute('tabindex', itemIndex === index ? '0' : '-1'))
}

onMounted(syncToolbarTabStops)
onUpdated(syncToolbarTabStops)

function onToolbarFocusin(event: FocusEvent) {
  const index = toolbarItems().indexOf(event.target as HTMLElement)
  if (index === -1) return
  toolbarActiveIndex.value = index
  syncToolbarTabStops()
}

function onToolbarKeydown(event: KeyboardEvent) {
  const target = event.target as HTMLElement
  if (!target.matches('[data-toolbar-item]')) return

  const items = toolbarItems().filter(isEnabled)
  const current = items.indexOf(target)
  if (current === -1) return

  const next = {
    ArrowRight: (current + 1) % items.length,
    ArrowLeft: (current - 1 + items.length) % items.length,
    Home: 0,
    End: items.length - 1,
  }[event.key]
  if (next === undefined) return

  event.preventDefault()
  items[next].focus()
}

/*
 * Image alternative text: the editor never inserts an image without an `alt`. After the upload, a
 * panel under the toolbar asks for it, or for an explicit "decorative image" choice (`alt=""`); the
 * same panel edits the `alt` and the width of the selected image (the keyboard alternative to the
 * resize handles).
 */
type ImagePanel = { mode: 'insert', src: string } | { mode: 'edit', position: number }

const imagePanel = ref<ImagePanel | null>(null)
const imagePanelRef = ref<HTMLElement | null>(null)
const imageAlt = ref('')
const imageIsDecorative = ref(false)
const imageWidth = ref<PrImageWidth | null>(null)
const imageAltError = ref<string | undefined>(undefined)
let imagePanelReturnFocus: HTMLElement | null = null

function focusImageAltInput() {
  imagePanelRef.value?.querySelector<HTMLInputElement>('input[type="text"]')?.focus()
}

async function openImagePanel(panel: ImagePanel, alt: string | null = null, width: PrImageWidth | null = null) {
  const active = document.activeElement
  imagePanelReturnFocus = active instanceof HTMLElement && toolbarRef.value?.contains(active) ? active : null
  imagePanel.value = panel
  imageAlt.value = alt ?? ''
  imageIsDecorative.value = alt === ''
  imageWidth.value = width
  imageAltError.value = undefined
  await nextTick()
  if (imageIsDecorative.value) imagePanelRef.value?.querySelector<HTMLElement>('[role="checkbox"], input[type="checkbox"]')?.focus()
  else focusImageAltInput()
}

function closeImagePanel(returnFocus: boolean) {
  imagePanel.value = null
  if (returnFocus && imagePanelReturnFocus?.isConnected) imagePanelReturnFocus.focus()
  else if (returnFocus) focusEditor()
  imagePanelReturnFocus = null
}

function insertImage(src: string, alt: string, width: PrImageWidth | null = null) {
  editor.value?.chain().focus().insertContent({
    type: AccessibleImage.name,
    attrs: { src, alt, ...(width ? imageWidthAttributes(width) : {}) },
  }).run()
}

function confirmImagePanel() {
  const panel = imagePanel.value
  if (!panel || !editor.value) return

  const alt = imageIsDecorative.value ? '' : imageAlt.value.trim()
  if (!imageIsDecorative.value && !alt) {
    imageAltError.value = messages.richTextEditor.imageAltRequired
    focusImageAltInput()

    return
  }

  if (panel.mode === 'insert') {
    insertImage(panel.src, alt, imageWidth.value)
  }
  else {
    const width = imageWidth.value
    editor.value.chain().focus().command(({ tr }) => {
      const node = tr.doc.nodeAt(panel.position)
      if (node?.type.name !== AccessibleImage.name) return false
      tr.setNodeMarkup(panel.position, undefined, { ...node.attrs, alt, ...(width ? imageWidthAttributes(width) : {}) })

      return true
    }).run()
  }

  closeImagePanel(false)
}

function onImagePanelKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    closeImagePanel(true)
  }
  else if (event.key === 'Enter' && (event.target as HTMLElement).matches('input[type="text"]')) {
    // Enter in the text field confirms, without submitting the form around the editor.
    event.preventDefault()
    confirmImagePanel()
  }
}

function openSelectedImageProperties() {
  const instance = editor.value
  if (!instance?.isActive(AccessibleImage.name)) return

  const position = instance.state.selection.from
  const node = instance.state.doc.nodeAt(position)
  if (node?.type.name !== AccessibleImage.name) return

  const width = (Object.keys(PR_IMAGE_WIDTHS) as PrImageWidth[]).find(key => PR_IMAGE_WIDTHS[key] === Number(node.attrs.width)) ?? null
  openImagePanel({ mode: 'edit', position }, typeof node.attrs.alt === 'string' ? node.attrs.alt : null, width)
}

/**
 * Uploads `file` through the `uploadImage` prop and, on success, asks for its
 * alternative text before inserting it at the current cursor position. With
 * `alt` (`''` for a decorative image), inserts it right away instead. Used by
 * the toolbar's image button and drag-and-drop, also exposed (see
 * `defineExpose` below) so a consumer with its own image-picking UI (e.g. a
 * paste handler) can drive the same upload-then-insert flow, and so tests can
 * exercise it without simulating a real file input/drag-and-drop. Resolves
 * with the uploaded URL once the upload is done.
 */
async function insertImageFromFile(file: File, alt?: string): Promise<string | null> {
  const url = await handleImageUpload(file)

  if (url) {
    if (alt !== undefined) insertImage(url, alt)
    else void openImagePanel({ mode: 'insert', src: url })
  }

  return url
}

function pickAndUploadImage() {
  // `aria-disabled` rather than `disabled` while uploading: the button keeps the focus.
  if (isUploadingImage.value) return

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

  if (!url) {
    return
  }

  const title = window.prompt(messages.richTextEditor.youtubeTitlePrompt, messages.richTextEditor.youtubeDefaultTitle)

  if (title === null) {
    return
  }

  // `title` is an attribute of `AccessibleYoutube`, not of tiptap's command options type.
  const options = { src: url, title: title.trim() || messages.richTextEditor.youtubeDefaultTitle }
  editor.value?.chain().focus().setYoutubeVideo(options).run()
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

/*
 * Emoji picker: a menu button (WAI-ARIA APG "Menu Button"). Opening it focuses the first emoji
 * (the last one with ArrowUp), the arrow keys and Home/End move between emoji, Escape closes it and
 * gives the focus back to its button, Tab closes it and moves on.
 */
function emojiItems(): HTMLElement[] {
  return Array.from(emojiMenuRef.value?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])
}

function focusEmojiItem(index: number) {
  const items = emojiItems()
  items.forEach((item, itemIndex) => item.setAttribute('tabindex', itemIndex === index ? '0' : '-1'))
  items[index]?.focus()
}

async function openEmojiPicker(focus: 'first' | 'last' = 'first') {
  emojiPopoverShift.value = 0
  isEmojiPickerOpen.value = true
  await nextTick()
  keepEmojiPopoverOnScreen()
  focusEmojiItem(focus === 'first' ? 0 : emojiItems().length - 1)
}

/** Moves the open popover left until it fits the viewport, keeping an 8 px margin on both sides. */
function keepEmojiPopoverOnScreen() {
  const rect = emojiMenuRef.value?.getBoundingClientRect()
  if (!rect) return
  const margin = 8
  const overflow = rect.right - (document.documentElement.clientWidth - margin)
  if (overflow > 0) emojiPopoverShift.value = Math.min(overflow, Math.max(0, rect.left - margin))
}

function closeEmojiPicker(returnFocus: boolean) {
  isEmojiPickerOpen.value = false
  if (returnFocus) emojiTriggerRef.value?.focus()
}

function toggleEmojiPicker() {
  if (isEmojiPickerOpen.value) closeEmojiPicker(false)
  else void openEmojiPicker()
}

function onEmojiTriggerKeydown(event: KeyboardEvent) {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
  event.preventDefault()
  void openEmojiPicker(event.key === 'ArrowDown' ? 'first' : 'last')
}

function onEmojiMenuKeydown(event: KeyboardEvent) {
  const items = emojiItems()
  const current = items.indexOf(event.target as HTMLElement)

  if (event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    closeEmojiPicker(true)

    return
  }

  if (event.key === 'Tab') {
    closeEmojiPicker(false)

    return
  }

  const next = {
    ArrowRight: (current + 1) % items.length,
    ArrowDown: (current + 1) % items.length,
    ArrowLeft: (current - 1 + items.length) % items.length,
    ArrowUp: (current - 1 + items.length) % items.length,
    Home: 0,
    End: items.length - 1,
  }[event.key]
  if (next === undefined) return

  // Not up to the toolbar, whose own arrow keys would move away from the menu.
  event.preventDefault()
  event.stopPropagation()
  focusEmojiItem(next)
}

function insertEmoji(name: string) {
  editor.value?.chain().focus().setEmoji(name).run()
  isEmojiPickerOpen.value = false
}

// Exposed for advanced consumer use (e.g. programmatic focus/insert/upload)
// and for tests: driving the tiptap `Editor` instance directly through its
// command API is the standard way to exercise a tiptap-based editor, since
// jsdom cannot simulate real contenteditable typing/selection behavior.
defineExpose({ editor, insertImageFromFile })

// `border`/`border-transparent` are marked important (`!`): Bootstrap ships
// its own `.border{border:1px solid #dee2e6!important}` utility class under
// the EXACT same name. In a host page that loads Bootstrap (like
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
// our OWN non-important hover/active backgrounds below, not just at idle,
// which silently killed hover on Formation while looking fine in Storybook
// (no Bootstrap there). Using the bracket form changes the compiled class
// name so Bootstrap's `.bg-transparent` selector no longer matches this
// element at all, sidestepping the collision instead of fighting it with
// `!important` (which would have meant marking hover/active important too,
// risking active losing to hover when both apply at once).
const toolbarButtonClass = 'pr-rich-text-editor__btn pr:inline-flex pr:h-9 pr:w-9 pr:items-center pr:justify-center pr:rounded-[var(--pr-radius-md)] pr:border! pr:border-transparent! pr:bg-[transparent] pr:text-[color:var(--pr-color-text-muted)] pr:transition-colors pr:duration-[var(--pr-duration-fast)] pr:ease-[var(--pr-ease-standard)] pr:hover:not-disabled:bg-[var(--pr-color-surface-subtle)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)] pr:disabled:cursor-not-allowed pr:disabled:opacity-40 pr:aria-disabled:cursor-progress'
// `!` needed: see comment above `calloutVariantClass`, same base-class collision.
const toolbarButtonActiveClass = 'pr:bg-[var(--pr-color-primary)]! pr:text-[color:var(--pr-color-primary-contrast)]!'
</script>

<template>
  <!-- minmax(0, 1fr): an implicit grid column grows with its widest content, so a large image or table would
       widen the editor past its container. -->
  <div class="pr-rich-text-editor pr:grid pr:grid-cols-[minmax(0,1fr)] pr:gap-[var(--pr-space-2)] pr:text-[color:var(--pr-color-text)]" :class="{ 'pr-rich-text-editor--blocks': isBlocks }">
    <PrLabel
      v-if="label"
      :id="labelId"
      :for="fieldId"
      :required="required"
      :disabled="disabled"
      @click="onLabelClick"
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
        working the moment ANY ancestor has `overflow` other than `visible`:
        it changes what "nearest scrolling ancestor" sticky sticks to, and
        the root here never scrolls on its own, so sticky would silently
        become a no-op. Rounding the toolbar's own top corners keeps the
        card look without needing the root to clip it.

        `top-[var(--pr-rich-text-editor-sticky-offset,0px)]`: a host page
        can have its own fixed header (Formation's `.top-navbar` is 60px and
        `position:fixed`, sitting at the same `top:0` this toolbar would
        stick to). Sticking at a bare `top-0` then means an equally-fixed
        host header with a higher z-index paints over this toolbar the
        moment it sticks, so it just looks like sticky "does nothing". A
        page with such a header can set
        `--pr-rich-text-editor-sticky-offset: 60px` (its own header's
        height) on any ancestor of this component to stick the toolbar
        right below it instead; it defaults to `0px` for pages without one.

        Keyboard: one tab stop, arrow keys between controls (see `onToolbarKeydown`). Toggle
        buttons carry `aria-pressed`.
      -->
      <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -- a toolbar (roving focus): arrow keys move between its controls (WAI-ARIA toolbar pattern) -->
      <div
        v-if="!isBlocks"
        ref="toolbarRef"
        class="pr-rich-text-editor__toolbar pr:sticky pr:top-[var(--pr-rich-text-editor-sticky-offset,0px)] pr:z-10 pr:flex pr:flex-wrap pr:items-center pr:gap-[var(--pr-space-1)] pr:rounded-t-[var(--pr-radius-lg)] pr:border-b pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface)] pr:p-[var(--pr-space-2)]"
        role="toolbar"
        :aria-label="messages.richTextEditor.toolbar"
        @keydown="onToolbarKeydown"
        @focusin="onToolbarFocusin"
      >
        <button type="button" data-toolbar-item :class="[toolbarButtonClass, editor?.isActive('heading', { level: 2 }) ? toolbarButtonActiveClass : '']" :aria-pressed="Boolean(editor?.isActive('heading', { level: 2 }))"
                :disabled="!editor || disabled" :title="messages.richTextEditor.heading" :aria-label="messages.richTextEditor.heading" @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()">
          <Heading2 :size="16" aria-hidden="true" />
        </button>
        <button type="button" data-toolbar-item :class="[toolbarButtonClass, editor?.isActive('heading', { level: 3 }) ? toolbarButtonActiveClass : '']" :aria-pressed="Boolean(editor?.isActive('heading', { level: 3 }))"
                :disabled="!editor || disabled" :title="messages.richTextEditor.subheading" :aria-label="messages.richTextEditor.subheading" @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()">
          <Heading3 :size="16" aria-hidden="true" />
        </button>

        <span class="pr-rich-text-editor__separator pr:mx-[0.125rem] pr:my-[var(--pr-space-1)] pr:w-px pr:self-stretch pr:bg-[var(--pr-color-border)]" aria-hidden="true" />

        <button type="button" data-toolbar-item :class="[toolbarButtonClass, editor?.isActive('bold') ? toolbarButtonActiveClass : '']" :aria-pressed="Boolean(editor?.isActive('bold'))"
                :disabled="!editor || disabled" :title="messages.richTextEditor.bold" :aria-label="messages.richTextEditor.bold" @click="editor?.chain().focus().toggleBold().run()">
          <Bold :size="16" aria-hidden="true" />
        </button>
        <button type="button" data-toolbar-item :class="[toolbarButtonClass, editor?.isActive('italic') ? toolbarButtonActiveClass : '']" :aria-pressed="Boolean(editor?.isActive('italic'))"
                :disabled="!editor || disabled" :title="messages.richTextEditor.italic" :aria-label="messages.richTextEditor.italic" @click="editor?.chain().focus().toggleItalic().run()">
          <Italic :size="16" aria-hidden="true" />
        </button>
        <button type="button" data-toolbar-item :class="[toolbarButtonClass, editor?.isActive('subscript') ? toolbarButtonActiveClass : '']" :aria-pressed="Boolean(editor?.isActive('subscript'))"
                :disabled="!editor || disabled" :title="messages.richTextEditor.subscript" :aria-label="messages.richTextEditor.subscript" @click="editor?.chain().focus().toggleSubscript().run()">
          <SubscriptIcon :size="16" aria-hidden="true" />
        </button>
        <button type="button" data-toolbar-item :class="[toolbarButtonClass, editor?.isActive('superscript') ? toolbarButtonActiveClass : '']" :aria-pressed="Boolean(editor?.isActive('superscript'))"
                :disabled="!editor || disabled" :title="messages.richTextEditor.superscript" :aria-label="messages.richTextEditor.superscript" @click="editor?.chain().focus().toggleSuperscript().run()">
          <SuperscriptIcon :size="16" aria-hidden="true" />
        </button>
        <!-- An action (it asks for the URL), not a toggle: no aria-pressed. -->
        <button type="button" data-toolbar-item :class="[toolbarButtonClass, editor?.isActive('link') ? toolbarButtonActiveClass : '']"
                :disabled="!editor || disabled" :title="messages.richTextEditor.link" :aria-label="messages.richTextEditor.link" @click="promptForLink">
          <LinkIcon :size="16" aria-hidden="true" />
        </button>
        <button type="button" data-toolbar-item :class="[toolbarButtonClass, editor?.isActive('highlight') ? toolbarButtonActiveClass : '']" :aria-pressed="Boolean(editor?.isActive('highlight'))"
                :disabled="!editor || disabled" :title="messages.richTextEditor.highlight" :aria-label="messages.richTextEditor.highlight" @click="editor?.chain().focus().toggleHighlight().run()">
          <Highlighter :size="16" aria-hidden="true" />
        </button>
        <!-- The native color input is transparent over the icon: its focus ring is drawn on this label (rich-text-editor.css). -->
        <label class="pr-rich-text-editor__color pr:relative pr:inline-flex pr:h-9 pr:w-9 pr:items-center pr:justify-center pr:rounded-[var(--pr-radius-md)] pr:text-[color:var(--pr-color-text-muted)] pr:hover:bg-[var(--pr-color-surface-subtle)]" :title="messages.richTextEditor.textColor">
          <Palette :size="16" aria-hidden="true" />
          <input type="color" data-toolbar-item class="pr:absolute pr:inset-0 pr:h-full pr:w-full pr:cursor-pointer pr:opacity-0" :aria-label="messages.richTextEditor.textColor" :disabled="!editor || disabled"
                 :value="editor?.getAttributes('textStyle').color || '#000000'" @input="setTextColor">
        </label>
        <button type="button" data-toolbar-item :class="toolbarButtonClass" :disabled="!editor || disabled"
                :title="messages.richTextEditor.removeTextColorShort" :aria-label="messages.richTextEditor.removeTextColor" @click="unsetTextColor">
          <Eraser :size="16" aria-hidden="true" />
        </button>

        <span class="pr-rich-text-editor__separator pr:mx-[0.125rem] pr:my-[var(--pr-space-1)] pr:w-px pr:self-stretch pr:bg-[var(--pr-color-border)]" aria-hidden="true" />

        <button v-for="alignment in TEXT_ALIGNMENTS" :key="alignment.align" type="button" data-toolbar-item
                :class="[toolbarButtonClass, editor?.isActive({ textAlign: alignment.align }) ? toolbarButtonActiveClass : '']"
                :aria-pressed="Boolean(editor?.isActive({ textAlign: alignment.align }))"
                :disabled="!editor || disabled" :title="alignment.label" :aria-label="alignment.label"
                @click="editor?.chain().focus().setTextAlign(alignment.align).run()">
          <component :is="alignment.icon" :size="16" aria-hidden="true" />
        </button>

        <span class="pr-rich-text-editor__separator pr:mx-[0.125rem] pr:my-[var(--pr-space-1)] pr:w-px pr:self-stretch pr:bg-[var(--pr-color-border)]" aria-hidden="true" />

        <button type="button" data-toolbar-item :class="[toolbarButtonClass, editor?.isActive('bulletList') ? toolbarButtonActiveClass : '']" :aria-pressed="Boolean(editor?.isActive('bulletList'))"
                :disabled="!editor || disabled" :title="messages.richTextEditor.bulletList" :aria-label="messages.richTextEditor.bulletList" @click="editor?.chain().focus().toggleBulletList().run()">
          <List :size="16" aria-hidden="true" />
        </button>
        <button type="button" data-toolbar-item :class="[toolbarButtonClass, editor?.isActive('orderedList') ? toolbarButtonActiveClass : '']" :aria-pressed="Boolean(editor?.isActive('orderedList'))"
                :disabled="!editor || disabled" :title="messages.richTextEditor.orderedList" :aria-label="messages.richTextEditor.orderedList" @click="editor?.chain().focus().toggleOrderedList().run()">
          <ListOrdered :size="16" aria-hidden="true" />
        </button>
        <button type="button" data-toolbar-item :class="[toolbarButtonClass, editor?.isActive('taskList') ? toolbarButtonActiveClass : '']" :aria-pressed="Boolean(editor?.isActive('taskList'))"
                :disabled="!editor || disabled" :title="messages.richTextEditor.taskList" :aria-label="messages.richTextEditor.taskList" @click="editor?.chain().focus().toggleTaskList().run()">
          <ListChecks :size="16" aria-hidden="true" />
        </button>
        <button type="button" data-toolbar-item :class="[toolbarButtonClass, editor?.isActive('blockquote') ? toolbarButtonActiveClass : '']" :aria-pressed="Boolean(editor?.isActive('blockquote'))"
                :disabled="!editor || disabled" :title="messages.richTextEditor.blockquote" :aria-label="messages.richTextEditor.blockquote" @click="editor?.chain().focus().toggleBlockquote().run()">
          <Quote :size="16" aria-hidden="true" />
        </button>
        <button type="button" data-toolbar-item :class="[toolbarButtonClass, editor?.isActive('codeBlock') ? toolbarButtonActiveClass : '']" :aria-pressed="Boolean(editor?.isActive('codeBlock'))"
                :disabled="!editor || disabled" :title="messages.richTextEditor.codeBlock" :aria-label="messages.richTextEditor.codeBlock" @click="editor?.chain().focus().toggleCodeBlock().run()">
          <Code :size="16" aria-hidden="true" />
        </button>
        <button type="button" data-toolbar-item :class="[toolbarButtonClass, editor?.isActive('details') ? toolbarButtonActiveClass : '']" :aria-pressed="Boolean(editor?.isActive('details'))"
                :disabled="!editor || disabled" :title="messages.richTextEditor.details" :aria-label="messages.richTextEditor.details" @click="toggleDetails">
          <ChevronsDownUp :size="16" aria-hidden="true" />
        </button>

        <span class="pr-rich-text-editor__separator pr:mx-[0.125rem] pr:my-[var(--pr-space-1)] pr:w-px pr:self-stretch pr:bg-[var(--pr-color-border)]" aria-hidden="true" />

        <button v-for="callout in CALLOUT_VARIANTS" :key="callout.variant" type="button" data-toolbar-item
                :class="[toolbarButtonClass, editor?.isActive('callout', { variant: callout.variant }) ? calloutVariantClass[callout.variant] : '']"
                :aria-pressed="Boolean(editor?.isActive('callout', { variant: callout.variant }))"
                :disabled="!editor || disabled" :title="callout.label" :aria-label="callout.label"
                @click="editor?.chain().focus().toggleCallout(callout.variant).run()">
          <component :is="callout.icon" :size="16" aria-hidden="true" />
        </button>

        <span class="pr-rich-text-editor__separator pr:mx-[0.125rem] pr:my-[var(--pr-space-1)] pr:w-px pr:self-stretch pr:bg-[var(--pr-color-border)]" aria-hidden="true" />

        <button type="button" data-toolbar-item :class="toolbarButtonClass" :disabled="!editor || disabled" :aria-disabled="isUploadingImage || undefined"
                :title="messages.richTextEditor.image" :aria-label="messages.richTextEditor.image" @click="pickAndUploadImage">
          <Hourglass v-if="isUploadingImage" :size="16" aria-hidden="true" />
          <Image v-else :size="16" aria-hidden="true" />
        </button>
        <button type="button" data-toolbar-item :class="toolbarButtonClass" :disabled="!editor || disabled || !editor.isActive('imageResize')"
                :title="messages.richTextEditor.imageProperties" :aria-label="messages.richTextEditor.imageProperties" @click="openSelectedImageProperties">
          <ScanText :size="16" aria-hidden="true" />
        </button>
        <button type="button" data-toolbar-item :class="toolbarButtonClass" :disabled="!editor || disabled"
                :title="messages.richTextEditor.youtube" :aria-label="messages.richTextEditor.youtube" @click="promptForYoutubeVideo">
          <Clapperboard :size="16" aria-hidden="true" />
        </button>
        <button type="button" data-toolbar-item :class="toolbarButtonClass" :disabled="!editor || disabled"
                :title="messages.richTextEditor.table" :aria-label="messages.richTextEditor.table" @click="insertTable">
          <Table2 :size="16" aria-hidden="true" />
        </button>
        <div ref="emojiPickerRef" class="pr-rich-text-editor__emoji-picker pr:relative pr:inline-flex">
          <button :id="emojiTriggerId" ref="emojiTriggerRef" type="button" data-toolbar-item :class="toolbarButtonClass" :disabled="!editor || disabled"
                  :title="messages.richTextEditor.emoji" :aria-label="messages.richTextEditor.emoji"
                  aria-haspopup="menu" :aria-expanded="isEmojiPickerOpen" :aria-controls="isEmojiPickerOpen ? emojiMenuId : undefined"
                  @click="toggleEmojiPicker" @keydown="onEmojiTriggerKeydown">
            <Smile :size="16" aria-hidden="true" />
          </button>
          <!--
            `grid-cols-[repeat(6,2rem)]` (fixed 2rem tracks matching the
            items' own `h-8 w-8`) instead of `grid-cols-6` (`1fr` tracks):
            this popover is `position: absolute` inside a `relative` parent
            that's only as wide as the smiley button (~36px). With no
            `width` of its own, its `fr` columns divide up that tiny
            inherited width instead of the grid's actual content size,
            collapsing every column to ~1px and stacking all the emoji on
            top of each other. Fixed-length tracks aren't relative to the
            container's width, so they size correctly regardless of it.
          -->
          <!-- eslint-disable-next-line vuejs-accessibility/interactive-supports-focus -- roving focus: the emoji items take focus, not the menu (WAI-ARIA menu pattern) -->
          <div v-if="isEmojiPickerOpen" :id="emojiMenuId" ref="emojiMenuRef" :style="emojiPopoverShift ? { left: `${-emojiPopoverShift}px` } : undefined" class="pr-rich-text-editor__emoji-popover pr:absolute pr:left-0 pr:top-[calc(100%+0.25rem)] pr:z-20 pr:grid pr:grid-cols-[repeat(6,2rem)] pr:gap-[0.125rem] pr:rounded-[var(--pr-radius-lg)] pr:border! pr:border-[var(--pr-color-border)]! pr:bg-[var(--pr-color-surface)] pr:p-[var(--pr-space-2)] pr:shadow-[var(--pr-shadow-md)]"
               role="menu" :aria-labelledby="emojiTriggerId" @keydown="onEmojiMenuKeydown">
            <button v-for="item in emojiPickerEmojis" :key="item.name" type="button" tabindex="-1"
                    class="pr-rich-text-editor__emoji-item pr:inline-flex pr:h-8 pr:w-8 pr:items-center pr:justify-center pr:rounded-[var(--pr-radius-md)] pr:border-none pr:bg-[transparent] pr:text-[length:1.125rem] pr:hover:not-disabled:bg-[var(--pr-color-surface-subtle)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-0 pr:focus-visible:outline-[var(--pr-color-focus)] pr:focus-visible:bg-[var(--pr-color-surface-subtle)]" role="menuitem"
                    :aria-label="messages.richTextEditor.emojiName(item.name)" :title="messages.richTextEditor.emojiName(item.name)" @click="insertEmoji(item.name)">
              {{ item.emoji }}
            </button>
          </div>
        </div>

        <span class="pr-rich-text-editor__separator pr:mx-[0.125rem] pr:my-[var(--pr-space-1)] pr:w-px pr:self-stretch pr:bg-[var(--pr-color-border)]" aria-hidden="true" />

        <button type="button" data-toolbar-item :class="toolbarButtonClass" :disabled="!editor?.can().undo()"
                :title="messages.richTextEditor.undo" :aria-label="messages.richTextEditor.undo" @click="editor?.chain().focus().undo().run()">
          <Undo2 :size="16" aria-hidden="true" />
        </button>
        <button type="button" data-toolbar-item :class="toolbarButtonClass" :disabled="!editor?.can().redo()"
                :title="messages.richTextEditor.redo" :aria-label="messages.richTextEditor.redo" @click="editor?.chain().focus().redo().run()">
          <Redo2 :size="16" aria-hidden="true" />
        </button>
      </div>

      <!--
        Blocks variant: the tabs and a small toolbar (the block menu for the keyboard, undo, redo).
        The formatting is in the "/" menu and in the toolbar over selected text.
      -->
      <div
        v-else
        class="pr-rich-text-editor__topbar pr:sticky pr:top-[var(--pr-rich-text-editor-sticky-offset,0px)] pr:z-10 pr:flex pr:flex-wrap pr:items-center pr:justify-between pr:gap-[var(--pr-space-2)] pr:rounded-t-[var(--pr-radius-lg)] pr:border-b pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface)] pr:p-[var(--pr-space-2)]"
      >
        <div ref="tablistRef" class="pr-rich-text-editor__tabs pr:flex pr:flex-wrap pr:gap-[var(--pr-space-1)]" role="tablist" :aria-label="label ? `${messages.richTextEditor.views} : ${label}` : messages.richTextEditor.views">
          <button
            v-for="(view, index) in VIEWS"
            :id="tabId(view)"
            :key="view"
            type="button"
            role="tab"
            class="pr-rich-text-editor__tab pr:min-h-9 pr:rounded-[var(--pr-radius-md)] pr:border! pr:border-transparent! pr:bg-[transparent] pr:px-[var(--pr-space-3)] pr:text-[length:var(--pr-font-size-sm)] pr:font-semibold pr:text-[color:var(--pr-color-text-muted)] pr:transition-colors pr:duration-[var(--pr-duration-fast)] pr:hover:bg-[var(--pr-color-surface-subtle)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)] pr:motion-reduce:transition-none"
            :class="currentView === view ? 'pr:bg-[var(--pr-color-surface-subtle)]! pr:text-[color:var(--pr-color-text)]! pr:border-[var(--pr-color-border-strong)]!' : ''"
            :aria-selected="currentView === view"
            :aria-controls="panelId(view)"
            :tabindex="currentView === view ? 0 : -1"
            @click="showView(view, view === 'write' ? 'editor' : 'none')"
            @keydown="onTabKeydown($event, index)"
          >
            {{ viewLabels[view] }}
          </button>
        </div>
        <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -- a toolbar (roving focus): arrow keys move between its controls (WAI-ARIA toolbar pattern) -->
        <div
          ref="toolbarRef"
          class="pr-rich-text-editor__toolbar pr:flex pr:items-center pr:gap-[var(--pr-space-1)]"
          role="toolbar"
          :aria-label="messages.richTextEditor.toolbar"
          @keydown="onToolbarKeydown"
          @focusin="onToolbarFocusin"
        >
          <button type="button" data-toolbar-item :class="toolbarButtonClass" :disabled="!editor || disabled || currentView !== 'write'"
                  :title="messages.richTextEditor.blockMenu" :aria-label="messages.richTextEditor.blockMenu"
                  aria-haspopup="menu" @click="openBlockMenu">
            <GripVertical :size="16" aria-hidden="true" />
          </button>
          <button type="button" data-toolbar-item :class="toolbarButtonClass" :disabled="!editor?.can().undo() || currentView !== 'write'"
                  :title="messages.richTextEditor.undo" :aria-label="messages.richTextEditor.undo" @click="editor?.chain().focus().undo().run()">
            <Undo2 :size="16" aria-hidden="true" />
          </button>
          <button type="button" data-toolbar-item :class="toolbarButtonClass" :disabled="!editor?.can().redo() || currentView !== 'write'"
                  :title="messages.richTextEditor.redo" :aria-label="messages.richTextEditor.redo" @click="editor?.chain().focus().redo().run()">
            <Redo2 :size="16" aria-hidden="true" />
          </button>
        </div>
      </div>

      <!-- The "Écrire" panel (the whole editing area without tabs, in the toolbar variant). -->
      <div
        v-show="currentView === 'write'"
        :id="isBlocks ? panelId('write') : undefined"
        :role="isBlocks ? 'tabpanel' : undefined"
        :aria-labelledby="isBlocks ? tabId('write') : undefined"
        class="pr-rich-text-editor__write"
      >
        <!-- Alternative text (and width) of the image being inserted or of the selected image. -->
        <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -- Escape cancels and Enter confirms from the fields inside -->
        <div
          v-if="imagePanel"
          ref="imagePanelRef"
          class="pr-rich-text-editor__image-panel pr:grid pr:gap-[var(--pr-space-3)] pr:border-b pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface-subtle)] pr:px-[var(--pr-space-5)] pr:py-[var(--pr-space-4)]"
          role="group"
          :aria-labelledby="imagePanelTitleId"
          @keydown="onImagePanelKeydown"
        >
          <p :id="imagePanelTitleId" class="pr:m-0 pr:font-semibold">
            {{ messages.richTextEditor.imagePanelTitle }}
          </p>
          <PrInput
            v-model="imageAlt"
            :label="messages.richTextEditor.imageAlt"
            :hint="messages.richTextEditor.imageAltHint"
            :error="imageAltError"
            :disabled="imageIsDecorative"
            :required="!imageIsDecorative"
            type="text"
          />
          <PrCheckbox v-model="imageIsDecorative" :label="messages.richTextEditor.imageDecorative" />
          <div class="pr:flex pr:flex-wrap pr:items-center pr:gap-[var(--pr-space-2)]" role="group" :aria-label="messages.richTextEditor.imageWidth">
            <span class="pr:text-[length:var(--pr-font-size-sm)] pr:font-semibold" aria-hidden="true">{{ messages.richTextEditor.imageWidth }}</span>
            <PrButton
              v-for="option in IMAGE_WIDTHS"
              :key="option.width"
              size="sm"
              :variant="imageWidth === option.width ? 'primary' : 'secondary'"
              :aria-pressed="imageWidth === option.width"
              @click="imageWidth = imageWidth === option.width ? null : option.width"
            >
              {{ option.label }}
            </PrButton>
          </div>
          <div class="pr:flex pr:flex-wrap pr:gap-[var(--pr-space-2)]">
            <PrButton size="sm" @click="confirmImagePanel">
              {{ imagePanel.mode === 'insert' ? messages.richTextEditor.imageInsert : messages.richTextEditor.imageSave }}
            </PrButton>
            <PrButton size="sm" variant="ghost" @click="closeImagePanel(true)">
              {{ messages.richTextEditor.cancel }}
            </PrButton>
          </div>
        </div>

        <div ref="surfaceRef" class="pr-rich-text-editor__surface pr:relative">
          <EditorContent
            :id="fieldId"
            :editor="editor"
            class="pr-rich-text-editor__content pr-editor-content"
          />
          <PrRichTextEditorBlockHandle
            v-if="isBlocks && editor"
            ref="blockHandleRef"
            :editor="editor"
            :surface="surfaceRef"
            :menu-id="blockMenuId"
            :disabled="disabled"
            @announce="announce"
            @image-properties="editImageAt"
          />
        </div>

        <!-- Toolbar over selected text (blocks variant): Tab or Alt+F10 from the text, Escape goes back. -->
        <BubbleMenu
          v-if="isBlocks && editor"
          ref="selectionToolbarRef"
          :editor="editor"
          :should-show="shouldShowSelectionToolbar"
          :options="bubbleOptions"
          class="pr-rich-text-editor__selection-toolbar pr:z-20 pr:flex pr:max-w-[calc(100vw-1rem)] pr:flex-wrap pr:items-center pr:gap-[0.125rem] pr:rounded-[var(--pr-radius-lg)] pr:border! pr:border-[var(--pr-color-border)]! pr:bg-[var(--pr-color-surface)] pr:p-[var(--pr-space-1)] pr:shadow-[var(--pr-shadow-md)]"
          role="toolbar"
          :aria-label="messages.richTextEditor.selectionToolbar"
          @keydown="onSelectionToolbarKeydown"
        >
          <button v-for="(item, index) in SELECTION_MARKS" :key="item.mark" type="button" :tabindex="index === 0 ? 0 : -1"
                  :class="[toolbarButtonClass, editor.isActive(item.mark) ? toolbarButtonActiveClass : '']" :aria-pressed="editor.isActive(item.mark)"
                  :title="item.label" :aria-label="item.label" @mousedown.prevent @click="item.toggle(editor)">
            <component :is="item.icon" :size="16" aria-hidden="true" />
          </button>
          <button type="button" tabindex="-1" :class="[toolbarButtonClass, editor.isActive('link') ? toolbarButtonActiveClass : '']"
                  :title="messages.richTextEditor.link" :aria-label="messages.richTextEditor.link" @mousedown.prevent @click="promptForLink">
            <LinkIcon :size="16" aria-hidden="true" />
          </button>
          <button type="button" tabindex="-1" :class="[toolbarButtonClass, editor.isActive('highlight') ? toolbarButtonActiveClass : '']" :aria-pressed="editor.isActive('highlight')"
                  :title="messages.richTextEditor.highlight" :aria-label="messages.richTextEditor.highlight" @mousedown.prevent @click="editor.chain().focus().toggleHighlight().run()">
            <Highlighter :size="16" aria-hidden="true" />
          </button>
          <span class="pr-rich-text-editor__separator pr:mx-[0.125rem] pr:my-[var(--pr-space-1)] pr:w-px pr:self-stretch pr:bg-[var(--pr-color-border)]" aria-hidden="true" />
          <button type="button" tabindex="-1" :class="[toolbarButtonClass, editor.isActive('heading', { level: 2 }) ? toolbarButtonActiveClass : '']" :aria-pressed="editor.isActive('heading', { level: 2 })"
                  :title="messages.richTextEditor.heading" :aria-label="messages.richTextEditor.heading" @mousedown.prevent @click="editor.chain().focus().toggleHeading({ level: 2 }).run()">
            <Heading2 :size="16" aria-hidden="true" />
          </button>
          <button type="button" tabindex="-1" :class="[toolbarButtonClass, editor.isActive('heading', { level: 3 }) ? toolbarButtonActiveClass : '']" :aria-pressed="editor.isActive('heading', { level: 3 })"
                  :title="messages.richTextEditor.subheading" :aria-label="messages.richTextEditor.subheading" @mousedown.prevent @click="editor.chain().focus().toggleHeading({ level: 3 }).run()">
            <Heading3 :size="16" aria-hidden="true" />
          </button>
        </BubbleMenu>

        <PrRichTextEditorSlashMenu
          v-if="isBlocks && slash.open"
          :id="slashMenuId"
          ref="slashMenuRef"
          :items="slash.items"
          :active-index="slash.index"
          :label="messages.richTextEditor.slashMenu"
          :empty-text="messages.richTextEditor.slashEmpty"
          @select="selectSlashItem"
          @activate="slash.index = $event; syncSlashAria()"
        />
      </div>

      <template v-if="isBlocks">
        <div
          v-show="currentView === 'preview'"
          :id="panelId('preview')"
          class="pr-rich-text-editor__preview pr:min-h-[20rem] pr:px-[var(--pr-space-5)] pr:py-[var(--pr-space-4)]"
          role="tabpanel"
          :aria-labelledby="tabId('preview')"
          tabindex="0"
        >
          <!-- eslint-disable-next-line vue/no-v-html -- the editor's own HTML, already cleaned by its schema -->
          <div class="pr-editor-content" v-html="previewHtml" />
        </div>
        <div
          v-show="currentView === 'source'"
          :id="panelId('source')"
          class="pr-rich-text-editor__source pr:grid pr:gap-[var(--pr-space-2)] pr:px-[var(--pr-space-5)] pr:py-[var(--pr-space-4)]"
          role="tabpanel"
          :aria-labelledby="tabId('source')"
        >
          <label :for="sourceFieldId" class="pr:font-semibold">{{ label ? `${messages.richTextEditor.viewSource} : ${label}` : messages.richTextEditor.viewSource }}</label>
          <p :id="`${sourceFieldId}-hint`" class="pr:m-0 pr:text-[length:var(--pr-font-size-sm)] pr:text-[color:var(--pr-color-text-muted)]">
            {{ messages.richTextEditor.sourceHint }}
          </p>
          <textarea
            :id="sourceFieldId"
            v-model="sourceCode"
            class="pr-rich-text-editor__source-field pr:min-h-[20rem] pr:w-full pr:resize-y pr:rounded-[var(--pr-radius-md)] pr:border! pr:border-[var(--pr-color-border-strong)]! pr:bg-[var(--pr-color-surface)] pr:p-[var(--pr-space-3)] pr:font-mono pr:text-[length:var(--pr-font-size-sm)] pr:text-[color:var(--pr-color-text)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)]"
            :aria-describedby="`${sourceFieldId}-hint`"
            :disabled="disabled"
            spellcheck="false"
            autocapitalize="off"
            autocomplete="off"
            translate="no"
            wrap="soft"
          />
        </div>
        <p :id="blocksHelpId" class="pr-rich-text-editor__help pr:m-0 pr:border-t pr:border-[var(--pr-color-border)] pr:px-[var(--pr-space-5)] pr:py-[var(--pr-space-2)] pr:text-[length:var(--pr-font-size-sm)] pr:text-[color:var(--pr-color-text-muted)]" :hidden="currentView !== 'write'">
          {{ messages.richTextEditor.blocksHelp }}
        </p>
        <p class="pr:sr-only" role="status">
          {{ blockStatus }}
        </p>
      </template>

      <p class="pr:sr-only" role="status">
        {{ uploadStatus }}
      </p>

      <p v-if="uploadError" class="pr-rich-text-editor__upload-error pr:m-0 pr:rounded-b-[var(--pr-radius-lg)] pr:border-t pr:border-[var(--pr-color-border)] pr:px-[var(--pr-space-5)] pr:py-[var(--pr-space-2)] pr:text-[length:var(--pr-font-size-sm)] pr:text-[color:var(--pr-color-danger)]" role="alert">
        {{ uploadError }}
      </p>

      <p v-if="imagesMissingAlt > 0" class="pr-rich-text-editor__missing-alt pr:m-0 pr:border-t pr:border-[var(--pr-color-border)] pr:px-[var(--pr-space-5)] pr:py-[var(--pr-space-2)] pr:text-[length:var(--pr-font-size-sm)] pr:text-[color:var(--pr-color-warning)]">
        {{ messages.richTextEditor.imagesMissingAlt(imagesMissingAlt) }}
      </p>

      <p v-if="editor" class="pr-rich-text-editor__count pr:m-0 pr:rounded-b-[var(--pr-radius-lg)] pr:border-t pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface-subtle)] pr:px-[var(--pr-space-5)] pr:py-[var(--pr-space-2)] pr:text-[length:var(--pr-font-size-xs)] pr:text-[color:var(--pr-color-text-muted)]">
        {{ messages.richTextEditor.counts(editor.storage.characterCount.characters(), editor.storage.characterCount.words()) }}
      </p>
    </div>
    <input v-if="name" ref="hiddenInputRef" type="hidden" :name="name" :value="html">
    <p v-if="hint" :id="hintId" class="pr-rich-text-editor__message pr-field-message pr:m-0 pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text-muted)]">
      {{ hint }}
    </p>
    <p v-if="errorText" :id="errorId" class="pr-rich-text-editor__message pr-field-message pr:m-0 pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-danger)]">
      {{ errorText }}
    </p>
  </div>
</template>
