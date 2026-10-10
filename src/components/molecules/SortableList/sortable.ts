import { shallowRef } from 'vue'

/** What a list gives the other lists of its group so that an item can travel between them. */
export interface SortableListHandle {
  group: () => string | undefined
  listId: () => string | number | undefined
  /** The list's `aria-label`, read out when an item arrives in it from the keyboard. */
  name: () => string | undefined
  /** The whole list, empty area included: what the pointer has to be over to drop in it. */
  element: () => HTMLElement | null
  items: () => unknown[]
  keyOf: (item: unknown) => string
  setItems: (items: unknown[]) => void
  emitChange: (change: PrSortableListChange<unknown>) => void
  /** Index where the dragged item would land at this height, among the other items of the list. */
  dropIndex: (clientY: number, draggedKey: string) => number
  focusHandle: (key: string) => void
  announce: (text: string) => void
}

/** Emitted by the list an item was dropped in, once the move is over (not on every step). */
export interface PrSortableListChange<T> {
  item: T
  /** `list-id` of the list the item came from, and of the one it is in now. */
  from: string | number | undefined
  to: string | number | undefined
  oldIndex: number
  newIndex: number
}

interface DragState {
  key: string
  item: unknown
  mode: 'pointer' | 'keyboard'
  origin: SortableListHandle
  originIndex: number
  current: SortableListHandle
  /** Every list of the group as it was before the move, to put them back on Escape. */
  snapshots: Map<SortableListHandle, unknown[]>
}

const groups = new Map<string, Set<SortableListHandle>>()

/** The move in progress, shared by every list on the page: only one item moves at a time. */
export const dragState = shallowRef<DragState | null>(null)

export function joinGroup(handle: SortableListHandle): void {
  const group = handle.group()
  if (group === undefined) {
    return
  }
  if (!groups.has(group)) {
    groups.set(group, new Set())
  }
  groups.get(group)?.add(handle)
}

export function leaveGroup(handle: SortableListHandle): void {
  for (const [name, members] of groups) {
    members.delete(handle)
    if (members.size === 0) {
      groups.delete(name)
    }
  }
  if (dragState.value?.current === handle || dragState.value?.origin === handle) {
    dragState.value = null
  }
}

/** The lists an item of this one can go to, itself included, in page order. */
export function listsInGroup(handle: SortableListHandle): SortableListHandle[] {
  const group = handle.group()
  const members = group === undefined ? [handle] : [...(groups.get(group) ?? [handle])]

  return members
    .filter((member) => member.element())
    .sort((a, b) => {
      const position = a.element()!.compareDocumentPosition(b.element()!)
      return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
    })
}

export function startDrag(handle: SortableListHandle, item: unknown, mode: DragState['mode']): void {
  const key = handle.keyOf(item)
  dragState.value = {
    key,
    item,
    mode,
    origin: handle,
    originIndex: handle.items().findIndex((candidate) => handle.keyOf(candidate) === key),
    current: handle,
    snapshots: new Map(listsInGroup(handle).map((list) => [list, [...list.items()]])),
  }
}

const sameOrder = (list: SortableListHandle, a: unknown[], b: unknown[]): boolean =>
  a.length === b.length && a.every((item, index) => list.keyOf(item) === list.keyOf(b[index]))

/** Put the dragged item at `index` of `target` (counted without the item itself). */
export function moveTo(target: SortableListHandle, index: number): void {
  const state = dragState.value
  if (!state) {
    return
  }

  const without = (list: SortableListHandle) => list.items().filter((item) => list.keyOf(item) !== state.key)

  if (target === state.current) {
    const next = without(target)
    next.splice(index, 0, state.item)
    if (!sameOrder(target, next, target.items())) {
      target.setItems(next)
    }
    return
  }

  state.current.setItems(without(state.current))
  const next = without(target)
  next.splice(index, 0, state.item)
  target.setItems(next)
  dragState.value = { ...state, current: target }
}

/** Position of the dragged item in its current list: [index, total]. */
export function currentPosition(): [number, number] {
  return dragState.value ? currentPositionOf(dragState.value) : [-1, 0]
}

/** One step up or down from the keyboard; past the ends, into the previous or next list of the group. */
export function step(direction: -1 | 1, messages: { moved: (position: number, total: number, list?: string) => string }): void {
  const state = dragState.value
  if (!state) {
    return
  }

  const [index, total] = currentPosition()
  const target = index + direction

  if (target >= 0 && target < total) {
    moveTo(state.current, target)
    state.current.announce(messages.moved(target + 1, total))
  } else {
    const lists = listsInGroup(state.current)
    const next = lists[lists.indexOf(state.current) + direction]
    if (!next) {
      return
    }
    moveTo(next, direction < 0 ? next.items().length : 0)
    const [newIndex, newTotal] = currentPosition()
    next.announce(messages.moved(newIndex + 1, newTotal, next.name()))
  }

  dragState.value?.current.focusHandle(state.key)
}

/** End the move where the item is, and tell the list it landed in. */
export function finishDrag(): DragState | null {
  const state = dragState.value
  if (!state) {
    return null
  }
  dragState.value = null

  const [newIndex] = currentPositionOf(state)
  if (state.current !== state.origin || newIndex !== state.originIndex) {
    state.current.emitChange({
      item: state.item,
      from: state.origin.listId(),
      to: state.current.listId(),
      oldIndex: state.originIndex,
      newIndex,
    })
  }

  return state
}

/** Put every list back as it was before the move. */
export function cancelDrag(): DragState | null {
  const state = dragState.value
  if (!state) {
    return null
  }
  dragState.value = null

  for (const [list, items] of state.snapshots) {
    if (!sameOrder(list, items, list.items())) {
      list.setItems(items)
    }
  }

  return state
}

function currentPositionOf(state: DragState): [number, number] {
  const items = state.current.items()

  return [items.findIndex((item) => state.current.keyOf(item) === state.key), items.length]
}
