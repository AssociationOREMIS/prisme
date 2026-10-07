import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { ref } from 'vue'
import { PrSelect } from '../../../../components/molecules/Select'
import '../../../stories.css'

const options = [
  { label: 'Brouillon', value: 'draft' },
  { label: 'En revue', value: 'review' },
  { label: 'Publie', value: 'published' },
  { label: 'Archive', value: 'archived', disabled: true },
]

const meta = {
  title: 'Forms/Select',
  component: PrSelect,
  tags: ['autodocs'],
  args: {
    label: 'Statut',
    placeholder: 'Choisir un statut',
    hint: '',
    error: '',
    options,
    disabled: false,
    required: false,
  },
} satisfies Meta<typeof PrSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrSelect },
    setup() {
      const value = ref('review')
      return { args, value }
    },
    template: '<PrSelect v-model="value" v-bind="args" />',
  }),
}

export const States: Story = {
  render: () => ({
    components: { PrSelect },
    setup() {
      return { options }
    },
    template: `
      <div class="story-column">
        <PrSelect label="Statut" placeholder="Choisir" :options="options" />
        <PrSelect label="Avec erreur" model-value="draft" error="Ce statut n'est plus disponible." :options="options" />
        <PrSelect label="Desactive" model-value="review" disabled :options="options" />
      </div>
    `,
  }),
}

export const Playground: Story = {
  render: (args) => ({
    components: { PrSelect },
    setup() {
      const value = ref('')
      return { args, value }
    },
    template: '<PrSelect v-model="value" v-bind="args" />',
  }),
}

// An empty value ("Aucun") works as any other option: v-model and the form both get ''.
// noinspection JSUnusedGlobalSymbols
export const EmptyOption: Story = {
  render: () => ({
    components: { PrSelect },
    setup() {
      const value = ref('a')
      const options = [
        { label: 'Aucun type', value: '' },
        { label: 'Retard', value: 'a' },
      ]
      return { options, value }
    },
    template: `
      <form data-testid="form" style="max-width: 20rem;" @submit.prevent>
        <PrSelect v-model="value" name="type" label="Type" :options="options" />
        <output data-testid="value">[{{ value }}]</output>
      </form>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const form = canvas.getByTestId('form') as HTMLFormElement
    await expect(new FormData(form).get('type')).toBe('a')

    await userEvent.click(canvas.getByLabelText('Type'))
    await userEvent.click(await within(document.body).findByRole('option', { name: 'Aucun type' }))

    await waitFor(() => expect(canvas.getByTestId('value')).toHaveTextContent('[]'))
    await expect(new FormData(form).get('type')).toBe('')
    await expect(canvas.getByLabelText('Type')).toHaveTextContent('Aucun type')

    // Let the list finish closing: until then reka keeps the page aria-hidden.
    await waitFor(() => expect(document.querySelector('[role="listbox"]')).toBeNull())
    await waitFor(() => expect(canvasElement.closest('[aria-hidden="true"]')).toBeNull())
  },
}
