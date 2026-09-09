import type { Meta, StoryObj } from '@storybook/vue3-vite'
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
