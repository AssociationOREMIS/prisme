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
