import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import { PrEmergencyContacts } from '../../../../components/molecules/EmergencyContacts'
import '../../../stories.css'

const meta = {
  title: 'Data Display/EmergencyContacts',
  component: PrEmergencyContacts,
  tags: ['autodocs'],
  argTypes: {
    headingLevel: { control: 'select', options: [undefined, 2, 3, 4] },
  },
} satisfies Meta<typeof PrEmergencyContacts>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrEmergencyContacts },
    setup() {
      return { args }
    },
    template: '<div style="max-width: 28rem;"><PrEmergencyContacts v-bind="args" /></div>',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('link', { name: '3018' })).toHaveAttribute('href', 'tel:3018')
    await expect(canvas.getByRole('link', { name: '3018' })).toHaveAccessibleDescription('Harcèlement et cyberharcèlement, gratuit et anonyme')
    await expect(canvas.getByRole('link', { name: '114 par SMS' })).toHaveAttribute('href', 'sms:114')
    // Target size: every link is at least 24 px high (WCAG 2.5.8), here 44.
    for (const link of canvas.getAllByRole('link')) {
      await expect(link.getBoundingClientRect().height).toBeGreaterThanOrEqual(24)
    }
  },
}

export const WithHeading: Story = {
  args: { headingLevel: 2 },
  render: Default.render,
}

export const CustomContacts: Story = {
  args: {
    title: 'Nous joindre',
    headingLevel: 3,
    contacts: [
      { number: '3018', label: 'Harcèlement et cyberharcèlement', channel: 'tel' },
      { number: '06 12 34 56 78', label: 'Permanence OREMIS par SMS, du lundi au vendredi', channel: 'sms' },
    ],
  },
  render: Default.render,
  play: undefined,
}

export const WithoutTitle: Story = {
  args: { title: '' },
  render: Default.render,
  play: undefined,
}
