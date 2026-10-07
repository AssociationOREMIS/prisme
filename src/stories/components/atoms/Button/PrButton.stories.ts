import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import { PrButton } from '../../../../components/atoms/Button'
import '../../../stories.css'

const meta = {
  title: 'Actions/Button',
  component: PrButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
    },
  },
  args: {
    variant: 'primary',
    size: 'md',
    type: 'button',
    disabled: false,
    loading: false,
  },
} satisfies Meta<typeof PrButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrButton },
    setup() {
      return { args }
    },
    template: '<PrButton v-bind="args">Enregistrer</PrButton>',
  }),
}

export const Variants: Story = {
  render: () => ({
    components: { PrButton },
    template: `
      <div class="story-stack">
        <PrButton>Primary</PrButton>
        <PrButton variant="secondary">Secondary</PrButton>
        <PrButton variant="ghost">Ghost</PrButton>
        <PrButton variant="danger">Danger</PrButton>
      </div>
    `,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { PrButton },
    template: `
      <div class="story-stack">
        <PrButton size="sm">Small</PrButton>
        <PrButton size="md">Medium</PrButton>
        <PrButton size="lg">Large</PrButton>
      </div>
    `,
  }),
}

export const States: Story = {
  render: () => ({
    components: { PrButton },
    template: `
      <div class="story-stack">
        <PrButton>Default</PrButton>
        <PrButton disabled>Disabled</PrButton>
        <PrButton loading>Loading</PrButton>
        <PrButton variant="danger" loading>Supprimer</PrButton>
      </div>
    `,
  }),
}

export const Playground: Story = {
  render: (args) => ({
    components: { PrButton },
    setup() {
      return { args }
    },
    template: '<PrButton v-bind="args">Action</PrButton>',
  }),
}

// With `href`, PrButton is a real link styled as a button (navigation must not be a <button>
// inside an <a>). A disabled link loses its href and is announced as disabled.
// noinspection JSUnusedGlobalSymbols
export const AsLink: Story = {
  render: () => ({
    components: { PrButton },
    template: `
      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
        <PrButton>Bouton</PrButton>
        <PrButton href="#fiche">Voir la fiche</PrButton>
        <PrButton href="#fiche" variant="secondary">Retour</PrButton>
        <PrButton href="#fiche" disabled>Indisponible</PrButton>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const link = canvas.getByRole('link', { name: 'Voir la fiche' })
    await expect(link.tagName).toBe('A')
    await expect(link).toHaveAttribute('href', '#fiche')
    await expect(link).not.toHaveAttribute('type')
    // Same look as a real button of the same variant.
    await expect(getComputedStyle(link).backgroundColor).toBe(getComputedStyle(canvas.getByRole('button', { name: 'Bouton' })).backgroundColor)

    const disabled = canvas.getByRole('link', { name: 'Indisponible' })
    await expect(disabled).not.toHaveAttribute('href')
    await expect(disabled).toHaveAttribute('aria-disabled', 'true')
  },
}
