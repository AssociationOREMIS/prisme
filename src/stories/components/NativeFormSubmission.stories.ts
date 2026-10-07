import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { PrNumberInput } from '../../components/atoms/NumberInput'
import { PrTagInput } from '../../components/atoms/TagInput'
import { PrCombobox } from '../../components/molecules/Combobox'
import { PrFileUpload } from '../../components/molecules/FileUpload'
import { PrRadioGroup } from '../../components/molecules/RadioGroup'
import { PrToggleGroup } from '../../components/molecules/ToggleGroup'
import './../stories.css'

// The Blade usage the README documents: fields inside a plain <form>, no v-model, only `name`
// and `default-value`. Each field must still react to the user and post its value.
const meta = {
  title: 'Forms/Native submission',
} satisfies Meta

type Story = StoryObj<typeof meta>

// noinspection JSUnusedGlobalSymbols
export default meta

// noinspection JSUnusedGlobalSymbols
export const WithoutVModel: Story = {
  render: () => ({
    components: { PrCombobox, PrFileUpload, PrNumberInput, PrRadioGroup, PrTagInput, PrToggleGroup },
    setup() {
      const fruits = [
        { label: 'Pomme', value: 'apple' },
        { label: 'Poire', value: 'pear' },
      ]
      const views = [
        { label: 'Liste', value: 'list' },
        { label: 'Grille', value: 'grid' },
      ]
      return { fruits, views }
    },
    template: `
      <form data-testid="form" style="display: grid; gap: 1.5rem; max-width: 28rem;" @submit.prevent>
        <PrRadioGroup
          name="choice"
          label="Choix"
          default-value="a"
          :options="[{ label: 'Option A', value: 'a' }, { label: 'Option B', value: 'b' }]"
        />
        <PrTagInput name="tags[]" label="Tags" />
        <PrNumberInput name="quantity" label="Quantite" :default-value="2" />
        <PrToggleGroup name="view" aria-label="Affichage" :items="views" />
        <PrCombobox name="fruit" label="Fruit" :options="fruits" />
        <PrFileUpload name="documents[]" label="Documents" multiple />
      </form>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const form = canvas.getByTestId('form') as HTMLFormElement
    const data = () => new FormData(form)

    // Radio group: the selection moves away from its default-value.
    await userEvent.click(canvas.getByText('Option B'))
    await waitFor(() => expect(data().get('choice')).toBe('b'))
    await expect(canvas.getByRole('radiogroup', { name: /Choix/ })).toBeTruthy()

    // Tag input: the typed tag shows and is posted.
    await userEvent.type(canvas.getByLabelText('Tags'), 'alpha{Enter}')
    await expect(canvas.getByText('alpha')).toBeTruthy()
    await expect(data().getAll('tags[]')).toEqual(['alpha'])

    // Number input: the + button changes the posted value.
    await userEvent.click(canvas.getByRole('button', { name: 'Incrémenter' }))
    await waitFor(() => expect(data().get('quantity')).toBe('3'))

    // Toggle group: the picked item is posted and the sliding indicator shows.
    await userEvent.click(canvas.getByText('Grille'))
    await waitFor(() => expect(data().get('view')).toBe('grid'))
    const group = canvasElement.querySelector<HTMLElement>('.pr-toggle-group') as HTMLElement
    await expect(group.style.getPropertyValue('--pr-toggle-group-indicator-opacity')).toBe('1')

    // Combobox: the picked option is posted through its hidden input.
    await userEvent.type(canvas.getByLabelText('Fruit'), 'Poi')
    await userEvent.click(await within(document.body).findByRole('option', { name: 'Poire' }))
    await waitFor(() => expect(data().get('fruit')).toBe('pear'))

    // File upload: files dropped in two goes are all posted (drag and drop used to post nothing).
    const dropzone = canvasElement.querySelector<HTMLElement>('.pr-file-upload__dropzone') as HTMLElement
    for (const name of ['a.txt', 'b.txt']) {
      const transfer = new DataTransfer()
      transfer.items.add(new File([name], name, { type: 'text/plain' }))
      dropzone.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: transfer }))
    }
    await waitFor(() => expect(data().getAll('documents[]').map((file) => (file as File).name)).toEqual(['a.txt', 'b.txt']))
  },
}
