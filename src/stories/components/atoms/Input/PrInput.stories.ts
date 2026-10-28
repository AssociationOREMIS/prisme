import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import { ref } from 'vue'
import { PrInput } from '../../../../components/atoms/Input'
import { PrTextarea } from '../../../../components/atoms/Textarea'
import { PrSelect } from '../../../../components/molecules/Select'
import '../../../stories.css'

const meta = {
  title: 'Forms/Input',
  component: PrInput,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
    },
  },
  args: {
    label: 'Adresse e-mail',
    hint: '',
    error: '',
    disabled: false,
    required: false,
    type: 'email',
    placeholder: 'nom@exemple.fr',
  },
} satisfies Meta<typeof PrInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrInput },
    setup() {
      const value = ref('')
      return { args, value }
    },
    template: '<PrInput v-model="value" v-bind="args" />',
  }),
}

export const States: Story = {
  render: () => ({
    components: { PrInput },
    setup() {
      const email = ref('')
      return { email }
    },
    template: `
      <div class="story-column">
        <PrInput v-model="email" label="Adresse e-mail" placeholder="nom@exemple.fr" hint="Utilisee pour les notifications." />
        <PrInput model-value="contact@oremis.fr" label="Champ requis" required />
        <PrInput model-value="erreur" label="Avec erreur" error="Le format attendu n'est pas valide." />
        <PrInput model-value="Lecture seule" label="Desactive" disabled />
      </div>
    `,
  }),
}

export const Playground: Story = {
  render: (args) => ({
    components: { PrInput },
    setup() {
      const value = ref('')
      return { args, value }
    },
    template: '<PrInput v-model="value" v-bind="args" />',
  }),
}

// Laravel's errors for a field are an array: the field shows the first message.
// noinspection JSUnusedGlobalSymbols
export const LaravelErrorArray: Story = {
  render: () => ({
    components: { PrInput },
    template: `<PrInput label="Nom" name="name" :error="['Le nom est obligatoire.', 'Le nom est trop court.']" />`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Nom')
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(input).toHaveAccessibleDescription('Le nom est obligatoire.')
    await expect(canvas.queryByText('Le nom est trop court.')).toBeNull()
  },
}

// A compact form on one line: the label is kept for screen readers only.
// noinspection JSUnusedGlobalSymbols
export const HiddenLabel: Story = {
  render: () => ({
    components: { PrInput },
    template: `<PrInput label="Rechercher un bénévole" hide-label placeholder="Nom ou CIB" name="q" />`,
  }),
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: 'Rechercher un bénévole' })
    const label = canvasElement.querySelector('label')!
    await expect(label.getBoundingClientRect().width).toBeLessThanOrEqual(1)
    // The field starts at the top: no room left for the hidden label.
    await expect(input.getBoundingClientRect().top - canvasElement.querySelector('.pr-input')!.getBoundingClientRect().top).toBeLessThan(2)
  },
}

/**
 * Side by side in a form grid, one with a hint: the grid row takes the height of the taller field, and the other one
 * must not stretch its control to fill it. Every field root keeps its rows at the top (`align-content: start`).
 */
export const InAFormGrid: Story = {
  render: () => ({
    components: { PrInput, PrSelect, PrTextarea },
    template: `
      <div class="story-column" style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; max-width: 40rem;">
        <PrInput label="Site" type="url" placeholder="https://" />
        <PrInput label="SIRET" hint="14 chiffres." />
        <PrSelect label="Type" :options="[{ value: 'a', label: 'Entreprise' }]" default-value="a" />
        <PrInput label="Adresse" hint="Numéro, rue et ville, sur une seule ligne." />
        <PrTextarea label="Notes" :rows="2" />
        <PrInput label="Code postal" hint="5 chiffres." error="Ce code postal n'existe pas." />
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const height = (selector: string) => canvasElement.querySelector(selector)!.getBoundingClientRect().height
    const site = canvasElement.querySelectorAll('input')[0]!.getBoundingClientRect().height
    const siret = canvasElement.querySelectorAll('input')[1]!.getBoundingClientRect().height

    await expect(site).toBe(siret)
    await expect(height('.pr-select [role="combobox"]')).toBe(siret)
    await expect(Math.round(height('textarea'))).toBeLessThan(Math.round(height('.pr-textarea')))
  },
}
