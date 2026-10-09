import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { ref } from 'vue'
import { PrCombobox } from '../../../../components/molecules/Combobox'
import '../../../stories.css'

const options = [
  { label: 'France', value: 'fr' },
  { label: 'Belgique', value: 'be' },
  { label: 'Suisse', value: 'ch' },
  { label: 'Canada', value: 'ca' },
  { label: 'Luxembourg', value: 'lu' },
  { label: 'Maroc', value: 'ma' },
  { label: 'Tunisie', value: 'tn', disabled: true },
]

const meta = {
  title: 'Forms/Combobox',
  component: PrCombobox,
  tags: ['autodocs'],
  args: {
    label: 'Pays',
    placeholder: 'Sélectionner un pays',
    hint: '',
    error: '',
    options,
    disabled: false,
    required: false,
    multiple: false,
  },
} satisfies Meta<typeof PrCombobox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrCombobox },
    setup() {
      const value = ref('fr')
      return { args, value }
    },
    template: '<div class="story-column"><PrCombobox v-model="value" v-bind="args" /></div>',
  }),
}

export const Multiple: Story = {
  render: () => ({
    components: { PrCombobox },
    setup() {
      const value = ref(['fr', 'be'])
      return { value, options }
    },
    template: `
      <div class="story-column">
        <PrCombobox v-model="value" :options="options" label="Pays (multi)" multiple placeholder="Sélectionner des pays" />
      </div>
    `,
  }),
}

export const States: Story = {
  render: () => ({
    components: { PrCombobox },
    setup() {
      return { options }
    },
    template: `
      <div class="story-column">
        <PrCombobox label="Par défaut" :options="options" placeholder="Sélectionner" />
        <PrCombobox label="Avec erreur" model-value="fr" error="Ce pays n'est pas éligible." :options="options" />
        <PrCombobox label="Désactivé" model-value="be" disabled :options="options" />
      </div>
    `,
  }),
}

export const Playground: Story = {
  render: (args) => ({
    components: { PrCombobox },
    setup() {
      const value = ref('')
      return { args, value }
    },
    template: '<div class="story-column"><PrCombobox v-model="value" v-bind="args" /></div>',
  }),
}

const volunteers = [
  { label: 'Camille MARTIN', value: 'u1' },
  { label: 'Alex DURAND', value: 'u2' },
  { label: 'Camille BERNARD', value: 'u3' },
]

// Server-side search: `search` returns the options for what is typed, after a pause in typing and from
// `min-chars` characters; the previous request is cancelled. From Blade, `search-url` does the same.
// noinspection JSUnusedGlobalSymbols
export const ServerSearch: Story = {
  render: () => ({
    components: { PrCombobox },
    setup() {
      const queries = ref<string[]>([])
      const search = async (query: string, signal: AbortSignal) => {
        queries.value.push(query)
        await new Promise(resolve => setTimeout(resolve, 100))
        if (signal.aborted) return []
        return volunteers.filter(volunteer => volunteer.label.toLowerCase().includes(query.toLowerCase()))
      }
      return { search, queries }
    },
    template: `
      <form class="story-column">
        <PrCombobox label="Bénévole" name="user_id" :search="search" :debounce="150" placeholder="Nom du bénévole" />
        <p data-testid="queries">{{ queries.join(',') }}</p>
      </form>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    const input = canvas.getByRole('combobox', { name: 'Bénévole' })

    await userEvent.type(input, 'c')
    await waitFor(() => expect(body.getByRole('status')).toHaveTextContent('Tapez au moins 2 caractères'))

    await userEvent.type(input, 'am')
    await waitFor(() => expect(body.getByRole('option', { name: 'Camille MARTIN' })).toBeTruthy())
    await expect(body.getByRole('option', { name: 'Camille BERNARD' })).toBeTruthy()
    await expect(body.queryByRole('option', { name: 'Alex DURAND' })).toBeNull()
    // Typed quickly: one request, for the whole word.
    await expect(canvas.getByTestId('queries')).toHaveTextContent(/^cam$/)

    await userEvent.click(body.getByRole('option', { name: 'Camille MARTIN' }))
    await expect(new FormData(canvasElement.querySelector('form')!).get('user_id')).toBe('u1')
    await expect(input).toHaveValue('Camille MARTIN')
  },
}

// `search-url` from Blade: GET ?q=..., a Laravel resource collection in return.
// noinspection JSUnusedGlobalSymbols
export const SearchUrl: Story = {
  render: () => ({
    components: { PrCombobox },
    setup() {
      const requests: string[] = []
      ;(window as Window & { __requests?: string[] }).__requests = requests
      const realFetch = window.fetch.bind(window)
      window.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = new URL(String(input), window.location.href)
        if (!url.pathname.endsWith('/benevoles/recherche')) return realFetch(input, init)
        requests.push(url.search)
        const query = (url.searchParams.get('q') ?? '').toLowerCase()
        const data = volunteers.filter(volunteer => volunteer.label.toLowerCase().includes(query))
        return new Response(JSON.stringify({ data }), { headers: { 'content-type': 'application/json' } })
      }) as typeof fetch
      // An initial value (old('user_id')): its label comes from `options`.
      return { initial: [{ label: 'Alex DURAND', value: 'u2' }] }
    },
    template: `<div class="story-column"><PrCombobox label="Responsable" name="owner_id" search-url="/benevoles/recherche" :options="initial" default-value="u2" :debounce="50" /></div>`,
  }),
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox', { name: 'Responsable' })
    await expect(input).toHaveValue('Alex DURAND')

    await userEvent.clear(input)
    await userEvent.type(input, 'bern')
    await waitFor(() => expect(within(document.body).getByRole('option', { name: 'Camille BERNARD' })).toBeTruthy())
    await expect((window as Window & { __requests?: string[] }).__requests?.at(-1)).toBe('?q=bern')
  },
}

// `placeholder` at rest, `search-placeholder` once the field has the focus, to say what to type.
export const SearchPlaceholder: Story = {
  render: () => ({
    components: { PrCombobox },
    setup() {
      return { options }
    },
    template: '<PrCombobox label="Pays" :options="options" placeholder="Sélectionner un pays" search-placeholder="Rechercher un pays" />',
  }),
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox', { name: 'Pays' })
    await expect(input).toHaveAttribute('placeholder', 'Sélectionner un pays')

    await userEvent.click(input)
    await waitFor(() => expect(input).toHaveAttribute('placeholder', 'Rechercher un pays'))

    await userEvent.tab()
    await waitFor(() => expect(input).toHaveAttribute('placeholder', 'Sélectionner un pays'))
  },
}
