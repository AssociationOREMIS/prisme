import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, type ConcreteComponent } from 'vue'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { PrBadge } from '../../../../components/atoms/Badge'
import { PrListItem } from '../../../../components/molecules/ListItem'
import { PrSortableList, type PrSortableListChange } from '../../../../components/molecules/SortableList'
import '../../../stories.css'

interface Lesson {
  id: number
  title: string
  minutes: number
}

// A generic component (its items are typed by v-model): Meta<typeof PrSortableList> cannot infer its props.
const meta = {
  title: 'Data Display/SortableList',
  component: PrSortableList as ConcreteComponent,
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

const titles = (list: HTMLElement) => within(list).getAllByRole('listitem').map((item) => item.textContent?.replace(/\d+ min/, '').trim())

/** The plan of a formation: lessons move inside a module, or from one module to the other. */
export const Modules: Story = {
  render: () => ({
    components: { PrBadge, PrListItem, PrSortableList },
    setup() {
      const understand = ref<Lesson[]>([
        { id: 1, title: 'Les formes du harcelement', minutes: 8 },
        { id: 2, title: 'Les acteurs', minutes: 6 },
        { id: 3, title: 'Les signes a reperer', minutes: 7 },
      ])
      const act = ref<Lesson[]>([{ id: 4, title: 'Mesurer l urgence', minutes: 6 }])
      const lastChange = ref('')
      const onChange = (change: PrSortableListChange<Lesson>) => {
        lastChange.value = `${change.item.title} : ${change.from} > ${change.to}`
      }

      return { understand, act, lastChange, onChange }
    },
    template: `
      <div class="story-column" style="max-width: 32rem">
        <strong>Module 1 : Comprendre</strong>
        <PrSortableList v-model="understand" group="lessons" list-id="m1" aria-label="Module 1" data-testid="m1" @change="onChange">
          <template #default="{ item }">
            <PrListItem :title="item.title"><template #actions><PrBadge>{{ item.minutes }} min</PrBadge></template></PrListItem>
          </template>
        </PrSortableList>
        <strong>Module 2 : Agir</strong>
        <PrSortableList v-model="act" group="lessons" list-id="m2" aria-label="Module 2" data-testid="m2" empty-text="Deposez une lecon ici" @change="onChange">
          <template #default="{ item }">
            <PrListItem :title="item.title"><template #actions><PrBadge>{{ item.minutes }} min</PrBadge></template></PrListItem>
          </template>
        </PrSortableList>
        <p data-testid="last-change">{{ lastChange }}</p>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const first = canvas.getByTestId('m1')
    const second = canvas.getByTestId('m2')

    // Keyboard: pick up the last lesson of module 1, step past the end into module 2, drop it.
    canvas.getByRole('button', { name: 'Déplacer Les signes a reperer' }).focus()
    await userEvent.keyboard(' ')
    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() => expect(titles(second)).toEqual(['Les signes a reperer', 'Mesurer l urgence']))
    await expect(canvas.getByRole('button', { name: 'Déplacer Les signes a reperer' })).toHaveFocus()
    await userEvent.keyboard(' ')
    await expect(canvas.getByTestId('last-change')).toHaveTextContent('Les signes a reperer : m1 > m2')

    // Mouse: drag the first lesson of module 1 below the second one.
    const grip = canvas.getByRole('button', { name: 'Déplacer Les formes du harcelement' })
    const target = within(first).getAllByRole('listitem')[1]!.getBoundingClientRect()
    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: grip },
      { coords: { clientX: target.left + 20, clientY: target.top + 5 } },
      { coords: { clientX: target.left + 20, clientY: target.bottom - 2 } },
      { keys: '[/MouseLeft]' },
    ])
    await waitFor(() => expect(titles(first)).toEqual(['Les acteurs', 'Les formes du harcelement']))
  },
}

/** Without v-model, in a Blade form: the keys are posted in their order as `lesson_ids[]`. */
export const InAForm: Story = {
  render: () => ({
    components: { PrSortableList },
    template: `
      <form class="story-column" style="max-width: 32rem">
        <PrSortableList
          name="lesson_ids"
          aria-label="Lecons du module"
          :default-value="[{ id: 1, title: 'Les formes' }, { id: 2, title: 'Les acteurs' }, { id: 3, title: 'Les signes' }]"
        >
          <template #default="{ item }"><span>{{ item.title }}</span></template>
        </PrSortableList>
      </form>
    `,
  }),
}
