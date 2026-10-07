import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'
import { PrCheckbox } from '../../../../components/atoms/Checkbox'
import '../../../stories.css'

const meta = {
  title: 'Forms/Checkbox',
  component: PrCheckbox,
  tags: ['autodocs'],
  args: {
    label: 'Recevoir les notifications',
    description: 'Les alertes importantes restent toujours envoyees.',
    checked: false,
    disabled: false,
    required: false,
  },
} satisfies Meta<typeof PrCheckbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrCheckbox },
    setup() {
      const checked = ref(false)
      return { args, checked }
    },
    template: '<PrCheckbox v-model:checked="checked" v-bind="args" />',
  }),
}

export const States: Story = {
  render: () => ({
    components: { PrCheckbox },
    template: `
      <div class="story-column">
        <PrCheckbox label="Non coche" />
        <PrCheckbox checked label="Coche" />
        <PrCheckbox checked="indeterminate" label="Indetermine" />
        <PrCheckbox disabled label="Desactive" />
      </div>
    `,
  }),
}

// With `unchecked-value`, the form sends a value when the checkbox is off too ("0"), so the server can turn
// the option off; when on, the checkbox's own value comes last and wins (Laravel keeps the last one).
// noinspection JSUnusedGlobalSymbols
export const UncheckedValue: Story = {
  render: () => ({
    components: { PrCheckbox },
    template: `<form><PrCheckbox label="Actif" name="active" value="1" unchecked-value="0" /><PrCheckbox label="Archive" name="archived" value="1" unchecked-value="0" disabled /></form>`,
  }),
  play: async ({ canvasElement }) => {
    const form = canvasElement.querySelector('form')!
    await expect(new FormData(form).getAll('active')).toEqual(['0'])
    await expect(new FormData(form).has('archived')).toBe(false)

    await userEvent.click(within(canvasElement).getByRole('checkbox', { name: 'Actif' }))
    await expect(new FormData(form).getAll('active').at(-1)).toBe('1')
  },
}
