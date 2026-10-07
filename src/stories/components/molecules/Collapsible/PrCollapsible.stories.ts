import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { PrInput } from '../../../../components/atoms/Input'
import { ref } from 'vue'
import { PrButton } from '../../../../components/atoms/Button'
import { PrCollapsible } from '../../../../components/molecules/Collapsible'
import '../../../stories.css'

const meta = {
  title: 'Navigation/Collapsible',
  component: PrCollapsible,
  tags: ['autodocs'],
  args: {
    title: 'Filtres avances',
    defaultOpen: false,
  },
} satisfies Meta<typeof PrCollapsible>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrCollapsible },
    setup() {
      return { args }
    },
    template: '<PrCollapsible v-bind="args"><p class="story-muted">Les filtres avances apparaissent ici.</p></PrCollapsible>',
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { PrCollapsible },
    template: `
      <PrCollapsible title="Filtres avances" disabled default-open>
        <p class="story-muted">Contenu non accessible tant que le declencheur est desactive.</p>
      </PrCollapsible>
    `,
  }),
}

export const ControlledOpen: Story = {
  render: () => ({
    components: { PrButton, PrCollapsible },
    setup() {
      const open = ref(false)
      return { open }
    },
    template: `
      <div class="story-column">
        <PrButton variant="secondary" @click="open = !open">{{ open ? 'Fermer' : 'Ouvrir' }} depuis l'exterieur</PrButton>
        <PrCollapsible v-model:open="open" title="Filtres avances">
          <p class="story-muted">L'etat ouvert/ferme est piloté par le parent, pas seulement par le declencheur interne.</p>
        </PrCollapsible>
      </div>
    `,
  }),
}

// In a form: with keep-mounted, the closed section keeps its fields, which are still submitted.
// The compact variant is a small trigger like a link, without a frame.
// noinspection JSUnusedGlobalSymbols
export const InForm: Story = {
  render: () => ({
    components: { PrCollapsible, PrInput },
    template: `
      <form class="story-column" style="display: grid; gap: 1rem;">
        <PrInput label="Nom" name="name" value="Camille MARTIN" />
        <PrCollapsible title="Options avancées" variant="compact" keep-mounted>
          <PrInput label="Code interne" name="code" value="A-42" />
        </PrCollapsible>
        <PrCollapsible title="Notes" variant="compact">
          <PrInput label="Note" name="note" value="non envoyée fermée" />
        </PrCollapsible>
      </form>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const form = canvasElement.querySelector('form')!
    await expect(new FormData(form).get('code')).toBe('A-42')
    await expect(new FormData(form).has('note')).toBe(false)
    // Closed: still in the page, under hidden="until-found" (shown again by the browser's search).
    await expect(canvasElement.querySelector('[name=code]')!.closest('[hidden]')).toHaveAttribute('hidden', 'until-found')

    const trigger = canvas.getByRole('button', { name: 'Options avancées' })
    await expect(getComputedStyle(trigger.closest('.pr-collapsible')!).borderTopWidth).toBe('0px')
    await userEvent.click(trigger)
    await expect(canvasElement.querySelector('[name=code]')!.closest('[hidden]')).toBeNull()
    await expect(canvas.getByRole('textbox', { name: 'Code interne' })).toBeVisible()
  },
}
