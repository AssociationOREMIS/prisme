import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { ref } from 'vue'
import { PrCheckbox } from '../../components/atoms/Checkbox'
import { PrSwitch } from '../../components/atoms/Switch'
import { PrToggle } from '../../components/atoms/Toggle'
import { PrDatePicker } from '../../components/molecules/DatePicker'
import { PrPagination } from '../../components/molecules/Pagination'
import './../stories.css'

// Each control used as a volunteer would: clicked or typed into, then checked through what the
// form posts (no v-model, as in Blade) or what the v-model receives.
const meta = {
  title: 'Forms/Controls interaction',
} satisfies Meta

type Story = StoryObj<typeof meta>

// noinspection JSUnusedGlobalSymbols
export default meta

// noinspection JSUnusedGlobalSymbols
export const WithoutVModel: Story = {
  render: () => ({
    components: { PrCheckbox, PrDatePicker, PrPagination, PrSwitch },
    template: `
      <form data-testid="form" style="display: grid; gap: 1.25rem; max-width: 28rem;" @submit.prevent>
        <PrCheckbox name="consent" value="yes" label="J'accepte" default-checked />
        <PrSwitch name="newsletter" label="Recevoir les nouvelles" />
        <PrDatePicker name="start" label="Début" />
        <PrPagination :page-count="5" />
      </form>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const form = canvas.getByTestId('form') as HTMLFormElement
    const data = () => new FormData(form)

    await expect(data().get('consent')).toBe('yes')
    await userEvent.click(canvas.getByRole('checkbox', { name: "J'accepte" }))
    await waitFor(() => expect(data().get('consent')).toBeNull())

    await expect(data().get('newsletter')).toBeNull()
    await userEvent.click(canvas.getByRole('switch', { name: 'Recevoir les nouvelles' }))
    await waitFor(() => expect(data().get('newsletter')).toBe('on'))

    const date = canvas.getByLabelText('Début') as HTMLInputElement
    date.value = '2026-10-07'
    date.dispatchEvent(new Event('input', { bubbles: true }))
    await waitFor(() => expect(data().get('start')).toBe('2026-10-07'))

    // The current page moves without v-model:page.
    await expect(canvas.getByRole('button', { name: 'Page précédente' })).toBeDisabled()
    await userEvent.click(canvas.getByRole('button', { name: 'Page suivante' }))
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Page précédente' })).toBeEnabled())
    await expect(canvasElement.querySelector('[aria-current="page"]')).toHaveTextContent('2')
  },
}

// noinspection JSUnusedGlobalSymbols
export const WithVModel: Story = {
  render: () => ({
    components: { PrCheckbox, PrPagination, PrSwitch, PrToggle },
    setup() {
      const consent = ref(false)
      const newsletter = ref(true)
      const bold = ref(false)
      const page = ref(3)
      return { bold, consent, newsletter, page }
    },
    template: `
      <div style="display: grid; gap: 1.25rem; max-width: 28rem;">
        <PrCheckbox v-model="consent" label="J'accepte" />
        <PrSwitch v-model="newsletter" label="Recevoir les nouvelles" />
        <PrToggle v-model="bold" aria-label="Gras">G</PrToggle>
        <PrPagination v-model:page="page" :page-count="5" />
        <output data-testid="state">{{ consent }}|{{ newsletter }}|{{ bold }}|{{ page }}</output>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const state = canvas.getByTestId('state')
    await expect(state).toHaveTextContent('false|true|false|3')

    await userEvent.click(canvas.getByRole('checkbox', { name: "J'accepte" }))
    await userEvent.click(canvas.getByRole('switch', { name: 'Recevoir les nouvelles' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Gras' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Page suivante' }))

    await waitFor(() => expect(state).toHaveTextContent('true|false|true|4'))
    await expect(canvas.getByRole('button', { name: 'Gras' })).toHaveAttribute('aria-pressed', 'true')
  },
}
