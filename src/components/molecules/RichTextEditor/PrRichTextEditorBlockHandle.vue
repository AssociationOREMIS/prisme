<script setup lang="ts">
import { ArrowDown, ArrowUp, Copy, GripVertical, ScanText, Trash2 } from '@lucide/vue'
import type { Editor } from '@tiptap/core'
import { NodeSelection } from '@tiptap/pm/state'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { usePrMessages } from '../../../i18n/context'
import { AccessibleImage } from '../../../tiptap/accessible-image'
import { deleteBlock, duplicateBlock, moveBlock, topBlockPos } from './blocks'

/*
 * The handle of the block under the pointer (or holding the cursor) in `PrRichTextEditor`
 * (`variant="blocks"`): dragged, it moves the block; clicked, it opens the block's menu (Monter,
 * Descendre, Dupliquer, Supprimer). Dragging is never the only way (WCAG 2.5.7): the menu, also
 * opened from the editor's "Options du bloc" button, and Alt+ArrowUp/ArrowDown do the same.
 */
const props = defineProps<{
  editor: Editor
  /** The positioned element around the text: the handle follows the blocks inside it. */
  surface: HTMLElement | null
  menuId: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  announce: [message: string]
  imageProperties: [pos: number]
}>()

const messages = usePrMessages()

/** Position of the top-level block the handle stands for, or null (no handle). */
const blockPos = ref<number | null>(null)
const handleTop = ref(0)
const hovering = ref(false)
const isMenuOpen = ref(false)
const menuPos = ref<number | null>(null)
const menuRef = ref<HTMLElement | null>(null)
const handleRef = ref<HTMLButtonElement | null>(null)
const menuStyle = ref<Record<string, string>>({})
let menuReturnFocus: HTMLElement | null = null

const menuNodeIsImage = computed(() => {
  if (menuPos.value === null) return false

  return props.editor.state.doc.nodeAt(menuPos.value)?.type.name === AccessibleImage.name
})

/** The top-level block element of the editor that holds `target`, with its position. */
function blockFromTarget(target: EventTarget | null): { pos: number, element: HTMLElement } | null {
  const root = props.editor.view.dom
  let element = target instanceof Node ? (target instanceof HTMLElement ? target : target.parentElement) : null
  while (element && element.parentElement !== root) element = element.parentElement
  if (!element) return null

  let found: number | null = null
  props.editor.state.doc.forEach((_node, offset) => {
    if (found === null && props.editor.view.nodeDOM(offset) === element) found = offset
  })

  return found === null ? null : { pos: found, element }
}

function place(pos: number | null) {
  blockPos.value = pos
  if (pos === null || !props.surface) return
  const element = props.editor.view.nodeDOM(pos)
  if (!(element instanceof HTMLElement)) return
  handleTop.value = element.getBoundingClientRect().top - props.surface.getBoundingClientRect().top
}

function placeOnCursor() {
  if (hovering.value || isMenuOpen.value) return
  place(props.editor.isFocused && props.editor.isEditable ? topBlockPos(props.editor) : null)
}

function onPointerMove(event: MouseEvent) {
  if (isMenuOpen.value || props.disabled) return
  if (handleRef.value?.contains(event.target as Node)) return
  const block = blockFromTarget(event.target)
  hovering.value = Boolean(block)
  if (block) place(block.pos)
  else placeOnCursor()
}

function onPointerLeave() {
  hovering.value = false
  placeOnCursor()
}

watch(() => props.surface, (surface, previous) => {
  previous?.removeEventListener('mousemove', onPointerMove)
  previous?.removeEventListener('mouseleave', onPointerLeave)
  surface?.addEventListener('mousemove', onPointerMove)
  surface?.addEventListener('mouseleave', onPointerLeave)
}, { immediate: true })

function onEditorChange() {
  // The block pointed at may be gone or moved: follow the cursor again.
  if (!isMenuOpen.value) {
    hovering.value = false
    placeOnCursor()
  }
}

onMounted(() => {
  props.editor.on('selectionUpdate', onEditorChange)
  props.editor.on('update', onEditorChange)
  props.editor.on('focus', placeOnCursor)
  props.editor.on('blur', placeOnCursor)
  document.addEventListener('pointerdown', closeMenuOnOutsidePointer, true)
})

onBeforeUnmount(() => {
  props.editor.off('selectionUpdate', onEditorChange)
  props.editor.off('update', onEditorChange)
  props.editor.off('focus', placeOnCursor)
  props.editor.off('blur', placeOnCursor)
  props.surface?.removeEventListener('mousemove', onPointerMove)
  props.surface?.removeEventListener('mouseleave', onPointerLeave)
  document.removeEventListener('pointerdown', closeMenuOnOutsidePointer, true)
})

/*
 * Dragging the handle drags the block: ProseMirror moves the selected node when it is dropped in the
 * text (`view.dragging` with `move: true`), the way its own node dragging works.
 */
function onDragStart(event: DragEvent) {
  const pos = blockPos.value
  const { view } = props.editor
  if (pos === null || !event.dataTransfer || props.disabled) {
    event.preventDefault()

    return
  }
  const selection = NodeSelection.create(view.state.doc, pos)
  view.dispatch(view.state.tr.setSelection(selection))
  view.dragging = { slice: selection.content(), move: true }
  event.dataTransfer.effectAllowed = 'copyMove'
  event.dataTransfer.setData('text/plain', selection.node.textContent)
  const element = view.nodeDOM(pos)
  if (element instanceof HTMLElement) event.dataTransfer.setDragImage(element, 0, 0)
}

function onDragEnd() {
  const { view } = props.editor
  view.dragging = null
}

/* Block menu (WAI-ARIA APG "Menu Button"): arrows, Home/End, Escape and Tab close it. */
function menuItems(): HTMLElement[] {
  return Array.from(menuRef.value?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])
}

async function openMenu(pos: number | null, anchor: HTMLElement) {
  if (pos === null || !props.editor.state.doc.nodeAt(pos)) return
  menuPos.value = pos
  menuReturnFocus = anchor === handleRef.value ? null : anchor
  menuStyle.value = { position: 'fixed', left: '0px', top: '0px', visibility: 'hidden' }
  isMenuOpen.value = true
  await nextTick()
  placeMenu(anchor)
  // Shown once placed: a hidden element cannot take the focus.
  await nextTick()
  menuItems()[0]?.focus()
}

/** Under its button, 8 px away from the edges of the screen, above when there is no room below. */
function placeMenu(anchor: HTMLElement) {
  const menu = menuRef.value
  if (!menu) return
  const box = anchor.getBoundingClientRect()
  const margin = 8
  const width = menu.offsetWidth
  const height = menu.offsetHeight
  const viewportWidth = document.documentElement.clientWidth
  const viewportHeight = window.innerHeight
  const left = Math.max(margin, Math.min(box.left, viewportWidth - width - margin))
  const below = box.bottom + 4
  const top = below + height + margin <= viewportHeight ? below : Math.max(margin, box.top - height - 4)
  menuStyle.value = { position: 'fixed', left: `${left}px`, top: `${top}px` }
}

function closeMenu(returnFocus: boolean) {
  if (!isMenuOpen.value) return
  isMenuOpen.value = false
  menuPos.value = null
  if (returnFocus) {
    if (menuReturnFocus?.isConnected) menuReturnFocus.focus()
    else props.editor.commands.focus()
  }
  menuReturnFocus = null
}

function closeMenuOnOutsidePointer(event: PointerEvent) {
  const target = event.target as Node
  if (isMenuOpen.value && !menuRef.value?.contains(target) && !handleRef.value?.contains(target)) closeMenu(false)
}

function toggleMenuFromHandle() {
  if (isMenuOpen.value) closeMenu(true)
  else if (handleRef.value) void openMenu(blockPos.value, handleRef.value)
}

function onMenuKeydown(event: KeyboardEvent) {
  const items = menuItems()
  const current = items.indexOf(event.target as HTMLElement)
  if (event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    closeMenu(true)

    return
  }
  if (event.key === 'Tab') {
    event.preventDefault()
    closeMenu(true)

    return
  }
  const next = {
    ArrowDown: (current + 1) % items.length,
    ArrowUp: (current - 1 + items.length) % items.length,
    Home: 0,
    End: items.length - 1,
  }[event.key]
  if (next === undefined) return
  event.preventDefault()
  event.stopPropagation()
  items[next]?.focus()
}

/** Puts the cursor in the block at `pos` (selects it when it holds no text). */
function selectBlock(pos: number) {
  const node = props.editor.state.doc.nodeAt(pos)
  if (!node) return
  if (node.isAtom) props.editor.chain().focus().setNodeSelection(pos).run()
  else props.editor.chain().focus().setTextSelection(pos + 1).run()
}

function runAction(action: 'up' | 'down' | 'duplicate' | 'delete' | 'image') {
  const pos = menuPos.value
  closeMenu(false)
  if (pos === null || !props.editor.state.doc.nodeAt(pos)) {
    props.editor.commands.focus()

    return
  }

  if (action === 'up' || action === 'down') {
    const target = moveBlock(props.editor, pos, action === 'up' ? -1 : 1)
    if (target === null) {
      emit('announce', action === 'up' ? messages.richTextEditor.blockAlreadyFirst : messages.richTextEditor.blockAlreadyLast)
      selectBlock(pos)
    }
    else {
      selectBlock(target)
      emit('announce', action === 'up' ? messages.richTextEditor.blockMovedUp : messages.richTextEditor.blockMovedDown)
    }
  }
  else if (action === 'duplicate') {
    const copy = duplicateBlock(props.editor, pos)
    if (copy !== null) selectBlock(copy)
    emit('announce', messages.richTextEditor.blockDuplicated)
  }
  else if (action === 'delete') {
    deleteBlock(props.editor, pos)
    emit('announce', messages.richTextEditor.blockDeleted)
  }
  else {
    emit('imageProperties', pos)
  }
}

defineExpose({
  /** Opens the menu of the block holding the cursor, under `anchor`, which gets the focus back. */
  openMenuForCursor: (anchor: HTMLElement) => openMenu(topBlockPos(props.editor), anchor),
  closeMenu,
})

const menuItemClass = 'pr-rich-text-editor__block-menu-item pr:flex pr:w-full pr:items-center pr:gap-[var(--pr-space-2)] pr:rounded-[var(--pr-radius-md)] pr:border-none pr:bg-[transparent] pr:px-[var(--pr-space-2)] pr:py-[var(--pr-space-2)] pr:text-left pr:text-[color:var(--pr-color-text)] pr:hover:bg-[var(--pr-color-surface-subtle)] pr:focus-visible:bg-[var(--pr-color-surface-subtle)] pr:focus-visible:outline-2 pr:focus-visible:outline-offset-0 pr:focus-visible:outline-[var(--pr-color-focus)]'
</script>

<template>
  <!--
    tabindex="-1": a handle that jumps from block to block would be a confusing tab stop. The keyboard
    reaches the same menu with the editor's "Options du bloc" button, and moves blocks with Alt+arrows.
  -->
  <button
    v-show="blockPos !== null && !disabled"
    ref="handleRef"
    type="button"
    tabindex="-1"
    draggable="true"
    class="pr-rich-text-editor__block-handle pr:absolute pr:left-[var(--pr-space-2)] pr:z-10 pr:inline-flex pr:h-6 pr:w-6 pr:cursor-grab pr:items-center pr:justify-center pr:rounded-[var(--pr-radius-sm)] pr:border-none pr:bg-[transparent] pr:p-0 pr:text-[color:var(--pr-color-text-muted)] pr:transition-colors pr:duration-[var(--pr-duration-fast)] pr:hover:bg-[var(--pr-color-surface-subtle)] pr:active:cursor-grabbing pr:motion-reduce:transition-none"
    :style="{ top: `${handleTop}px` }"
    :title="messages.richTextEditor.blockHandleTitle"
    :aria-label="messages.richTextEditor.blockHandle"
    aria-haspopup="menu"
    :aria-expanded="isMenuOpen"
    :aria-controls="isMenuOpen ? menuId : undefined"
    @click="toggleMenuFromHandle"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <GripVertical :size="16" aria-hidden="true" />
  </button>

  <!-- eslint-disable-next-line vuejs-accessibility/interactive-supports-focus -- roving focus: the items take the focus, not the menu (WAI-ARIA menu pattern) -->
  <div
    v-if="isMenuOpen"
    :id="menuId"
    ref="menuRef"
    class="pr-rich-text-editor__block-menu pr:z-30 pr:grid pr:min-w-[12rem] pr:max-w-[calc(100vw-1rem)] pr:gap-[0.125rem] pr:rounded-[var(--pr-radius-lg)] pr:border! pr:border-[var(--pr-color-border)]! pr:bg-[var(--pr-color-surface)] pr:p-[var(--pr-space-1)] pr:shadow-[var(--pr-shadow-md)]"
    :style="menuStyle"
    role="menu"
    :aria-label="messages.richTextEditor.blockMenu"
    @keydown="onMenuKeydown"
  >
    <button type="button" role="menuitem" tabindex="-1" :class="menuItemClass" aria-keyshortcuts="Alt+ArrowUp" @click="runAction('up')">
      <ArrowUp :size="16" aria-hidden="true" />
      <span class="pr:flex-1">{{ messages.richTextEditor.blockMoveUp }}</span>
      <kbd class="pr:text-[length:var(--pr-font-size-xs)] pr:text-[color:var(--pr-color-text-muted)]" aria-hidden="true">Alt ↑</kbd>
    </button>
    <button type="button" role="menuitem" tabindex="-1" :class="menuItemClass" aria-keyshortcuts="Alt+ArrowDown" @click="runAction('down')">
      <ArrowDown :size="16" aria-hidden="true" />
      <span class="pr:flex-1">{{ messages.richTextEditor.blockMoveDown }}</span>
      <kbd class="pr:text-[length:var(--pr-font-size-xs)] pr:text-[color:var(--pr-color-text-muted)]" aria-hidden="true">Alt ↓</kbd>
    </button>
    <button type="button" role="menuitem" tabindex="-1" :class="menuItemClass" @click="runAction('duplicate')">
      <Copy :size="16" aria-hidden="true" />
      <span class="pr:flex-1">{{ messages.richTextEditor.blockDuplicate }}</span>
    </button>
    <button v-if="menuNodeIsImage" type="button" role="menuitem" tabindex="-1" :class="menuItemClass" @click="runAction('image')">
      <ScanText :size="16" aria-hidden="true" />
      <span class="pr:flex-1">{{ messages.richTextEditor.imageProperties }}</span>
    </button>
    <button type="button" role="menuitem" tabindex="-1" :class="[menuItemClass, 'pr:text-[color:var(--pr-color-danger)]!']" @click="runAction('delete')">
      <Trash2 :size="16" aria-hidden="true" />
      <span class="pr:flex-1">{{ messages.richTextEditor.blockDelete }}</span>
    </button>
  </div>
</template>
