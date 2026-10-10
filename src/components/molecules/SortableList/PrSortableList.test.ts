// @vitest-environment jsdom
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PrSortableList } from '.'
import { dragState } from './sortable'

interface Lesson {
  id: number
  title: string
}

const lessons = (): Lesson[] => [
  { id: 1, title: 'Les formes' },
  { id: 2, title: 'Les acteurs' },
  { id: 3, title: 'Les signes' },
]

const wrappers: VueWrapper[] = []

afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount())
  dragState.value = null
  document.body.innerHTML = ''
  vi.useRealTimers()
})

/** Two lists of one group, as the modules of a formation: their items, kept by v-model. */
function mountModules() {
  const first = ref<Lesson[]>(lessons())
  const second = ref<Lesson[]>([{ id: 4, title: 'La loi' }])
  const changes: unknown[] = []
  const wrapper = mount(defineComponent({
    components: { PrSortableList },
    setup: () => ({ first, second, changes }),
    template: `
      <PrSortableList v-model="first" group="lessons" list-id="m1" aria-label="Module 1" @change="changes.push($event)">
        <template #default="{ item }"><span>{{ item.title }}</span></template>
      </PrSortableList>
      <PrSortableList v-model="second" group="lessons" list-id="m2" aria-label="Module 2" @change="changes.push($event)">
        <template #default="{ item }"><span>{{ item.title }}</span></template>
      </PrSortableList>
    `,
  }), { attachTo: document.body })
  wrappers.push(wrapper)

  return { wrapper, first, second, changes }
}

const titles = (items: Lesson[]) => items.map((item) => item.title)
const grip = (wrapper: VueWrapper, name: string) => wrapper.find(`button[aria-label="Déplacer ${name}"]`)
const live = (wrapper: VueWrapper) => wrapper.findAll('[aria-live="assertive"]').map((region) => region.text()).join(' ')

async function press(wrapper: VueWrapper, name: string, key: string) {
  await grip(wrapper, name).trigger('keydown', { key })
  await nextTick()
  await nextTick()
}

describe('PrSortableList', () => {
  it('shows each item with a named grip that explains the keyboard', () => {
    const wrapper = mount(PrSortableList<Lesson>, {
      props: { defaultValue: lessons() },
      slots: { default: '<template #default="{ item }">{{ item.title }}</template>' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)

    expect(wrapper.findAll('li').map((row) => row.text())).toEqual(['Les formes', 'Les acteurs', 'Les signes'])
    const describedBy = grip(wrapper, 'Les formes').attributes('aria-describedby')
    expect(document.getElementById(describedBy!)?.textContent).toContain('flèches haut et bas')
  })

  it('moves an item down with the keyboard and tells where it landed', async () => {
    const { wrapper, first, changes } = mountModules()

    await press(wrapper, 'Les formes', ' ')
    expect(live(wrapper)).toContain('Déplacement de Les formes, position 1 sur 3.')

    await press(wrapper, 'Les formes', 'ArrowDown')
    expect(titles(first.value)).toEqual(['Les acteurs', 'Les formes', 'Les signes'])
    expect(live(wrapper)).toContain('Position 2 sur 3.')
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Déplacer Les formes')

    await press(wrapper, 'Les formes', 'Enter')
    expect(live(wrapper)).toContain('Déplacement terminé : Les formes, position 2 sur 3.')
    expect(changes).toEqual([{ item: { id: 1, title: 'Les formes' }, from: 'm1', to: 'm1', oldIndex: 0, newIndex: 1 }])
  })

  it('sends an item into the next list of its group past the end', async () => {
    const { wrapper, first, second, changes } = mountModules()

    await press(wrapper, 'Les signes', ' ')
    await press(wrapper, 'Les signes', 'ArrowDown')

    expect(titles(first.value)).toEqual(['Les formes', 'Les acteurs'])
    expect(titles(second.value)).toEqual(['Les signes', 'La loi'])
    expect(live(wrapper)).toContain('Module 2, position 1 sur 2.')
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Déplacer Les signes')

    await press(wrapper, 'Les signes', ' ')
    expect(changes).toEqual([{ item: { id: 3, title: 'Les signes' }, from: 'm1', to: 'm2', oldIndex: 2, newIndex: 0 }])
  })

  it('puts every list back on Escape', async () => {
    const { wrapper, first, second, changes } = mountModules()

    await press(wrapper, 'Les signes', ' ')
    await press(wrapper, 'Les signes', 'ArrowDown')
    await press(wrapper, 'Les signes', 'ArrowDown')
    await press(wrapper, 'Les signes', 'Escape')

    expect(titles(first.value)).toEqual(['Les formes', 'Les acteurs', 'Les signes'])
    expect(titles(second.value)).toEqual(['La loi'])
    expect(live(wrapper)).toContain('Déplacement annulé : Les signes reprend sa place.')
    expect(changes).toEqual([])
  })

  it('stays put at the top of the first list', async () => {
    const { wrapper, first } = mountModules()

    await press(wrapper, 'Les formes', ' ')
    await press(wrapper, 'Les formes', 'ArrowUp')

    expect(titles(first.value)).toEqual(['Les formes', 'Les acteurs', 'Les signes'])
  })

  it('posts the keys in their order with a native form', async () => {
    const wrapper = mount(PrSortableList<Lesson>, {
      props: { defaultValue: lessons(), name: 'lesson_ids' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)

    await press(wrapper, 'Les formes', ' ')
    await press(wrapper, 'Les formes', 'ArrowDown')

    const inputs = wrapper.findAll('input[type="hidden"]')
    expect(inputs.map((input) => input.attributes('name'))).toEqual(['lesson_ids[]', 'lesson_ids[]', 'lesson_ids[]'])
    expect(inputs.map((input) => (input.element as HTMLInputElement).value)).toEqual(['2', '1', '3'])
  })

  it('shows where to drop in an empty list', () => {
    const wrapper = mount(PrSortableList<Lesson>, { props: { defaultValue: [], emptyText: 'Aucune leçon' }, attachTo: document.body })
    wrappers.push(wrapper)

    expect(wrapper.find('.pr-sortable-list__empty').text()).toBe('Aucune leçon')
  })

  it('has no grips when disabled', () => {
    const wrapper = mount(PrSortableList<Lesson>, { props: { defaultValue: lessons(), disabled: true }, attachTo: document.body })
    wrappers.push(wrapper)

    expect(wrapper.findAll('button')).toHaveLength(0)
  })

  it('drags an item with the pointer to the height it is dropped at', async () => {
    vi.stubGlobal('requestAnimationFrame', () => 0)
    const { wrapper, first, changes } = mountModules()

    // jsdom lays nothing out: give the first list and its rows a place on the page, 40px apart.
    const lists = wrapper.findAll('.pr-sortable-list')
    lists[0]!.element.getBoundingClientRect = () => new DOMRect(0, 0, 300, 120)
    lists[1]!.element.getBoundingClientRect = () => new DOMRect(0, 500, 300, 40)
    const placeRows = () => lists[0]!.findAll('li').forEach((row, index) => {
      row.element.getBoundingClientRect = () => new DOMRect(0, index * 40, 300, 40)
    })
    placeRows()

    grip(wrapper, 'Les formes').element.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, button: 0, clientX: 10, clientY: 10 }))
    window.dispatchEvent(new MouseEvent('pointermove', { clientX: 10, clientY: 12 }))
    await nextTick()
    expect(dragState.value).toBeNull()

    window.dispatchEvent(new MouseEvent('pointermove', { clientX: 10, clientY: 100 }))
    await nextTick()
    expect(document.querySelector('.pr-sortable-list__overlay')).not.toBeNull()
    expect(titles(first.value)).toEqual(['Les acteurs', 'Les signes', 'Les formes'])

    window.dispatchEvent(new MouseEvent('pointerup'))
    await nextTick()
    expect(document.querySelector('.pr-sortable-list__overlay')).toBeNull()
    expect(changes).toEqual([{ item: { id: 1, title: 'Les formes' }, from: 'm1', to: 'm1', oldIndex: 0, newIndex: 2 }])
    vi.unstubAllGlobals()
  })
})
