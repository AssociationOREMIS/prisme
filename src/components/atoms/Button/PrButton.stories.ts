import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrButton } from './'
import '../../stories.css'

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
