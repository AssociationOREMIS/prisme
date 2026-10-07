import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import { PrBadge } from '../../../../components/atoms/Badge'
import { PrDescriptionItem, PrDescriptionList } from '../../../../components/molecules/DescriptionList'
import '../../../stories.css'

const meta = {
  title: 'Data Display/DescriptionList',
  component: PrDescriptionList,
  tags: ['autodocs'],
} satisfies Meta<typeof PrDescriptionList>

export default meta
type Story = StoryObj<typeof meta>

// The label / value pairs of a record. Plain text through `items`, richer values with PrDescriptionItem;
// an empty value reads « Non renseigné ». Labels on the left, one under the other on a narrow screen.
// noinspection JSUnusedGlobalSymbols
export const Default: Story = {
  render: () => ({
    components: { PrBadge, PrDescriptionItem, PrDescriptionList },
    setup: () => ({
      items: [
        { label: 'Type', value: 'Suspension' },
        { label: 'Motif', value: 'Propos inappropriés envers un élève lors d’une intervention.' },
        { label: 'Fin prévue', value: null },
      ],
    }),
    template: `
      <div style="display: grid; gap: 2rem;">
        <PrDescriptionList :items="items" data-testid="wide">
          <PrDescriptionItem label="Statut"><PrBadge variant="warning">En cours</PrBadge></PrDescriptionItem>
          <PrDescriptionItem label="Décidée par"><a href="#alex">Alex DURAND</a></PrDescriptionItem>
        </PrDescriptionList>
        <div style="width: 320px;">
          <PrDescriptionList :items="items.slice(0, 1)" data-testid="narrow" />
        </div>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const wide = canvas.getByTestId('wide')
    const terms = wide.querySelectorAll('dt')
    const values = wide.querySelectorAll('dd')
    await expect(Array.from(terms).map(term => term.textContent)).toEqual(['Type', 'Motif', 'Fin prévue', 'Statut', 'Décidée par'])
    await expect(values[2]).toHaveTextContent('Non renseigné')
    await expect(within(values[4] as HTMLElement).getByRole('link', { name: 'Alex DURAND' })).toBeTruthy()

    // Two columns: every value starts at the same x, right of the longest label.
    const lefts = Array.from(values).map(value => Math.round(value.getBoundingClientRect().left))
    await expect(new Set(lefts).size).toBe(1)
    await expect(lefts[0]).toBeGreaterThan(Math.round(terms[2].getBoundingClientRect().right))

    const narrow = canvas.getByTestId('narrow')
    await expect(narrow.querySelector('dd')!.getBoundingClientRect().top).toBeGreaterThanOrEqual(narrow.querySelector('dt')!.getBoundingClientRect().bottom)
  },
}
