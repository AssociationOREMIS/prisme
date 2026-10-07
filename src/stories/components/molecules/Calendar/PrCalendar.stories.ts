import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { ref } from 'vue'
import { PrCalendar } from '../../../../components/molecules/Calendar'
import '../../../stories.css'

const meta = {
  title: 'Data Display/Calendar',
  component: PrCalendar,
  tags: ['autodocs'],
} satisfies Meta<typeof PrCalendar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { PrCalendar },
    setup() {
      const value = ref('')
      return { value }
    },
    template: '<PrCalendar v-model="value" />',
  }),
}

// Arrow keys move day by day or week by week, Page Down changes month (keeping the day), Enter
// picks the focused day, and the grid announces the selection and full dates.
export const KeyboardNavigation: Story = {
  render: () => ({
    components: { PrCalendar },
    setup() {
      const value = ref('2026-01-15')
      return { value }
    },
    template: '<div><PrCalendar v-model="value" /><output data-testid="value">{{ value }}</output></div>',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const grid = canvas.getByRole('grid', { name: /janvier 2026/i })
    const selectedDay = canvas.getByRole('button', { name: 'jeudi 15 janvier 2026' })

    await expect(selectedDay.closest('td')).toHaveAttribute('aria-selected', 'true')
    await expect(selectedDay).toHaveAttribute('tabindex', '0')
    await expect(grid.querySelectorAll('button[tabindex="0"]')).toHaveLength(1)

    selectedDay.focus()
    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() => expect(document.activeElement).toHaveAccessibleName('vendredi 16 janvier 2026'))
    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() => expect(document.activeElement).toHaveAccessibleName('vendredi 23 janvier 2026'))
    await userEvent.keyboard('{PageDown}')
    await waitFor(() => expect(document.activeElement).toHaveAccessibleName('lundi 23 février 2026'))
    await expect(canvas.getByRole('grid', { name: /février 2026/i })).toBeTruthy()

    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(canvas.getByTestId('value')).toHaveTextContent('2026-02-23'))
    await expect((document.activeElement as HTMLElement).closest('td')).toHaveAttribute('aria-selected', 'true')
  },
}
