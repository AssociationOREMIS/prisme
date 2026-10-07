import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'
import { PrSwitch } from '../../../../components/atoms/Switch'
import '../../../stories.css'

const meta = {
  title: 'Forms/Switch',
  component: PrSwitch,
  tags: ['autodocs'],
  args: {
    label: 'Mode automatique',
    description: 'Active les regles configurees pour ce dossier.',
    checked: false,
    disabled: false,
  },
} satisfies Meta<typeof PrSwitch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrSwitch },
    setup() {
      const checked = ref(false)
      return { args, checked }
    },
    template: '<PrSwitch v-model:checked="checked" v-bind="args" />',
  }),
}

export const States: Story = {
  render: () => ({
    components: { PrSwitch },
    template: `
      <div class="story-column">
        <PrSwitch label="Inactif" />
        <PrSwitch checked label="Actif" />
        <PrSwitch disabled label="Desactive" />
      </div>
    `,
  }),
}

// With `unchecked-value`, the form sends a value when the switch is off too ("0"), so the server can turn
// the option off; when on, the switch's own value comes last and wins (Laravel keeps the last one).
// noinspection JSUnusedGlobalSymbols
export const UncheckedValue: Story = {
  render: () => ({
    components: { PrSwitch },
    template: `<form><PrSwitch label="Actif" name="active" value="1" unchecked-value="0" /><PrSwitch label="Archive" name="archived" value="1" unchecked-value="0" disabled /></form>`,
  }),
  play: async ({ canvasElement }) => {
    const form = canvasElement.querySelector('form')!
    await expect(new FormData(form).getAll('active')).toEqual(['0'])
    await expect(new FormData(form).has('archived')).toBe(false)

    await userEvent.click(within(canvasElement).getByRole('switch', { name: 'Actif' }))
    await expect(new FormData(form).getAll('active').at(-1)).toBe('1')
  },
}
