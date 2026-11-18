import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import { PrButton } from '../../../../components/atoms/Button'
import { PrPageHeader } from '../../../../components/layouts/PageHeader'
import '../../../stories.css'

const meta = {
  title: 'Layout/PageHeader',
  component: PrPageHeader,
  tags: ['autodocs'],
  args: {
    title: 'Camille MARTIN',
    description: 'Bénévole depuis mars 2024, antenne de Lyon.',
    backHref: '#benevoles',
    backLabel: 'Retour aux bénévoles',
  },
} satisfies Meta<typeof PrPageHeader>

export default meta
type Story = StoryObj<typeof meta>

// Link back, h1, description and actions on the right, below the title when there is no room.
// In Blade: <pr-page-header title="..." back-href="{{ route('users.index') }}"><template #actions>...</template></pr-page-header>
// noinspection JSUnusedGlobalSymbols
export const Default: Story = {
  render: (args) => ({
    components: { PrButton, PrPageHeader },
    setup: () => ({ args }),
    template: `
      <div style="display: grid; gap: 2rem;">
        <PrPageHeader v-bind="args" data-testid="wide">
          <template #actions>
            <PrButton action="edit" variant="secondary" href="#modifier">Modifier</PrButton>
            <PrButton action="add">Nouvelle sanction</PrButton>
          </template>
        </PrPageHeader>
        <div style="width: min(320px, 100%);">
          <PrPageHeader title="Nouvelle sanction" data-testid="narrow">
            <template #actions>
              <PrButton action="back" variant="secondary">Annuler</PrButton>
            </template>
          </PrPageHeader>
        </div>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { level: 1, name: 'Camille MARTIN' })).toBeTruthy()
    await expect(canvas.getByRole('link', { name: 'Retour aux bénévoles' })).toHaveAttribute('href', '#benevoles')

    const box = (id: string, selector: string) => canvas.getByTestId(id).querySelector(selector)!.getBoundingClientRect()
    // Beside the title only when there is room for the heading (20rem at least) and the actions:
    // on a phone the wide header wraps too, which is the expected layout there.
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
    const actions = box('wide', '.pr-page-header__actions')
    if (canvas.getByTestId('wide').clientWidth >= 20 * rem + actions.width + rem) {
      await expect(actions.top).toBeLessThan(box('wide', '.pr-page-header__title').bottom)
    }
    await expect(box('narrow', '.pr-page-header__actions').top).toBeGreaterThanOrEqual(box('narrow', '.pr-page-header__title').bottom)
  },
}
