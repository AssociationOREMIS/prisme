import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { expect, within } from 'storybook/test'
import { PrPagination } from '../../../../components/molecules/Pagination'
import '../../../stories.css'

const meta = {
  title: 'Navigation/Pagination',
  component: PrPagination,
  tags: ['autodocs'],
  args: {
    pageCount: 5,
    disabled: false,
  },
} satisfies Meta<typeof PrPagination>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrPagination },
    setup() {
      const page = ref(2)
      return { args, page }
    },
    template: '<PrPagination v-model:page="page" v-bind="args" />',
  }),
}

export const FromTotalRows: Story = {
  render: () => ({
    components: { PrPagination },
    setup() {
      const page = ref(1)
      // pageCount is derived (Math.ceil(132 / 20) = 7) instead of computed by hand —
      // convenient when totalRows/pageSize already come from fromLaravelPaginator.
      return { page }
    },
    template: '<PrPagination v-model:page="page" :total-rows="132" :page-size="20" />',
  }),
}

export const AsLinks: Story = {
  render: () => ({
    components: { PrPagination },
    // Server-paginated list (Laravel in Blade): real links, followed without reloading by Prisme's navigation.
    // Several paginations on one page each need their own aria-label.
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <PrPagination :page="1" :page-count="12" page-param="absent_page" fragment="absent-staff" aria-label="Pages des staffs absents" data-testid="first" />
        <PrPagination :page="3" :page-count="12" page-param="absent_page" fragment="absent-staff" aria-label="Pages des staffs absents, page 3" data-testid="middle" />
        <PrPagination :page="1" :page-count="12" aria-label="Pages en boutons" data-testid="buttons" />
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const first = within(canvas.getByTestId('first'))
    const middle = within(canvas.getByTestId('middle'))

    const previous = first.getByRole('link', { name: 'Page précédente' })
    await expect(previous).not.toHaveAttribute('href')
    await expect(previous).toHaveAttribute('aria-disabled', 'true')

    const next = new URL(first.getByRole('link', { name: 'Page suivante' }).getAttribute('href') ?? '')
    await expect(next.searchParams.get('absent_page')).toBe('2')
    await expect(next.hash).toBe('#absent-staff')

    const current = middle.getByRole('link', { name: '3' })
    await expect(current).toHaveAttribute('aria-current', 'page')
    await expect(new URL(middle.getByRole('link', { name: '4' }).getAttribute('href') ?? '').searchParams.get('absent_page')).toBe('4')

    // Same look as the buttons.
    const link = first.getByRole('link', { name: '2' })
    const button = within(canvas.getByTestId('buttons')).getByRole('button', { name: '2' })
    await expect(getComputedStyle(link).backgroundColor).toBe(getComputedStyle(button).backgroundColor)
    await expect(getComputedStyle(link).textDecorationLine).toBe('none')
    await expect(link.getBoundingClientRect().height).toBe(button.getBoundingClientRect().height)
  },
}
