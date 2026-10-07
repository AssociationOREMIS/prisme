import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { Eye, Pencil, Save, Trash2 } from '@lucide/vue'
import { PrButton, prButtonActions } from '../../../../components/atoms/Button'
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

// A button in a table column as narrow as possible keeps its words whole (« Gérer », not « Gé / rer »).
// noinspection JSUnusedGlobalSymbols
export const InNarrowColumn: Story = {
  render: () => ({
    components: { PrButton },
    template: `
      <table style="width: 1px; border-collapse: collapse;">
        <tbody><tr><td style="width: 1px; padding: 0;"><PrButton size="sm">Gérer</PrButton></td></tr></tbody>
      </table>
    `,
  }),
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Gérer' })
    const lineHeight = parseFloat(getComputedStyle(button).minHeight)
    await expect(button.getBoundingClientRect().height).toBeLessThanOrEqual(lineHeight + 1)
    await expect(button.scrollWidth).toBeLessThanOrEqual(button.clientWidth)
  },
}

// An icon before the label.
// noinspection JSUnusedGlobalSymbols
export const WithIcon: Story = {
  render: () => ({
    components: { PrButton },
    setup: () => ({ Save }),
    template: `<PrButton :icon="Save">Enregistrer</PrButton>`,
  }),
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Enregistrer' })
    const icon = button.querySelector('svg.pr-button__icon')
    await expect(icon).not.toBeNull()
    await expect(icon).toHaveAttribute('aria-hidden', 'true')
  },
}

// Row actions of a table: square icon-only buttons named by their label, shown as a tooltip,
// and a discreet red tone for destructive actions.
// noinspection JSUnusedGlobalSymbols
export const RowActions: Story = {
  render: () => ({
    components: { PrButton },
    setup: () => ({ Eye, Pencil, Trash2 }),
    template: `
      <div class="story-stack">
        <PrButton variant="ghost" size="sm" :icon="Eye" label="Voir" href="#fiche" />
        <PrButton variant="ghost" size="sm" :icon="Pencil" label="Modifier" />
        <PrButton variant="ghost" size="sm" tone="danger" :icon="Trash2" label="Supprimer" />
        <PrButton variant="ghost" tone="danger">Retirer</PrButton>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const edit = canvas.getByRole('button', { name: 'Modifier' })
    const { width, height } = edit.getBoundingClientRect()
    await expect(width).toBeCloseTo(height, 0)
    await expect(canvas.getByRole('link', { name: 'Voir' })).toHaveAttribute('href', '#fiche')

    await userEvent.hover(edit)
    // Reka's role="tooltip" node is aria-hidden (it only feeds aria-describedby): check the visible bubble.
    await waitFor(() => expect(document.querySelector('.pr-tooltip')).toHaveTextContent('Modifier'))

    const remove = canvas.getByRole('button', { name: 'Supprimer' })
    const ghost = canvas.getByRole('button', { name: 'Modifier' })
    await expect(getComputedStyle(remove).color).not.toBe(getComputedStyle(ghost).color)
    await expect(getComputedStyle(canvas.getByRole('button', { name: 'Retirer' })).color).toBe(getComputedStyle(remove).color)
  },
}

// Usual actions, ready to use with `action`: icon, label (accessible name and tooltip) and tone.
// In Blade: <pr-button action="edit" href="{{ route('users.edit', $user) }}"></pr-button>
// noinspection JSUnusedGlobalSymbols
export const Actions: Story = {
  render: () => ({
    components: { PrButton },
    setup: () => ({ actions: Object.entries(prButtonActions) }),
    template: `
      <div style="display: grid; gap: 1.5rem;">
        <div class="story-stack">
          <PrButton v-for="[name] in actions" :key="name" :action="name" size="sm" />
        </div>
        <div class="story-stack">
          <PrButton v-for="[name] in actions" :key="name" :action="name" variant="secondary" />
        </div>
        <div class="story-stack">
          <PrButton action="add" variant="primary">Ajouter un bénévole</PrButton>
          <PrButton action="download" variant="secondary">Exporter en CSV</PrButton>
          <PrButton action="delete" variant="danger">Supprimer le compte</PrButton>
        </div>
        <table class="story-table" style="border-collapse: collapse;">
          <tbody>
            <tr>
              <td style="padding: 0.5rem 1rem 0.5rem 0;">Camille MARTIN</td>
              <td style="padding: 0.5rem 0; white-space: nowrap;">
                <PrButton action="view" size="sm" href="#fiche" />
                <PrButton action="edit" size="sm" href="#modifier" />
                <PrButton action="delete" size="sm" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const preset of Object.values(prButtonActions)) {
      await expect(canvas.getAllByRole('button', { name: preset.label }).length + canvas.queryAllByRole('link', { name: preset.label }).length).toBeGreaterThan(0)
    }
    const [deleteButton] = canvas.getAllByRole('button', { name: 'Supprimer' })
    const [editButton] = canvas.getAllByRole('button', { name: 'Modifier' })
    await expect(getComputedStyle(deleteButton).color).not.toBe(getComputedStyle(editButton).color)
    await expect(getComputedStyle(editButton).backgroundColor).toBe('rgba(0, 0, 0, 0)')

    const add = canvas.getByRole('button', { name: 'Ajouter un bénévole' })
    await expect(add.querySelector('svg.pr-button__icon')).not.toBeNull()
    await expect(canvas.getByRole('link', { name: 'Voir' })).toHaveAttribute('href', '#fiche')
  },
}
