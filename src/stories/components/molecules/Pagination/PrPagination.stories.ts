import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
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
