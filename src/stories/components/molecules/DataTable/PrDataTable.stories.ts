import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { reactive } from 'vue'
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Circle,
  CircleCheck,
  CircleDashed,
  CircleOff,
  Timer,
} from '@lucide/vue'
import { PrBadge } from '../../../../components/atoms/Badge'
import { PrDataTable } from '../../../../components/molecules/DataTable'
import '../../../stories.css'

const labels = [
  { value: 'bug', label: 'Bug' },
  { value: 'feature', label: 'Feature' },
  { value: 'documentation', label: 'Documentation' },
]

const statuses = [
  { value: 'backlog', label: 'Backlog', icon: CircleDashed },
  { value: 'todo', label: 'Todo', icon: Circle },
  { value: 'in progress', label: 'In Progress', icon: Timer },
  { value: 'done', label: 'Done', icon: CircleCheck },
  { value: 'canceled', label: 'Canceled', icon: CircleOff },
]

const priorities = [
  { value: 'low', label: 'Low', icon: ArrowDown },
  { value: 'medium', label: 'Medium', icon: ArrowRight },
  { value: 'high', label: 'High', icon: ArrowUp },
]

const data = [
  { id: 'TASK-8782', title: 'You cannot compress the program without quantifying the open-source SSD pixel!', status: 'in progress', label: 'documentation', priority: 'medium' },
  { id: 'TASK-7878', title: 'Try to calculate the EXE feed, maybe it will index the multi-byte pixel!', status: 'backlog', label: 'documentation', priority: 'medium' },
  { id: 'TASK-7839', title: 'We need to bypass the neural TCP card!', status: 'todo', label: 'bug', priority: 'high' },
  { id: 'TASK-5562', title: 'The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!', status: 'backlog', label: 'feature', priority: 'medium' },
  { id: 'TASK-8686', title: 'I will parse the wireless SSL protocol, that should driver the API panel!', status: 'canceled', label: 'feature', priority: 'medium' },
  { id: 'TASK-1280', title: 'Use the digital TLS panel, then you can transmit the haptic system!', status: 'done', label: 'bug', priority: 'high' },
  { id: 'TASK-7262', title: 'The UTF8 application is down, parse the neural bandwidth so we can back up the PNG firewall!', status: 'done', label: 'feature', priority: 'high' },
  { id: 'TASK-1138', title: 'Generating the driver will not do anything, we need to quantify the 1080p SMTP bandwidth!', status: 'in progress', label: 'feature', priority: 'medium' },
  { id: 'TASK-7184', title: 'We need to program the back-end THX pixel!', status: 'todo', label: 'feature', priority: 'low' },
  { id: 'TASK-5160', title: 'Calculating the bus will not do anything, we need to navigate the back-end JSON protocol!', status: 'in progress', label: 'documentation', priority: 'high' },
  { id: 'TASK-5618', title: 'Generating the driver will not do anything, we need to index the online SSL application!', status: 'done', label: 'documentation', priority: 'medium' },
  { id: 'TASK-6699', title: 'I will transmit the wireless JBOD capacitor, that should hard drive the SSD feed!', status: 'backlog', label: 'documentation', priority: 'medium' },
]

const columns = [
  { key: 'id', label: 'Task', sortable: true, hideable: false, width: '7rem' },
  { key: 'title', label: 'Title', sortable: true, filterable: true, class: 'min-w-[24rem]' },
  { key: 'status', label: 'Status', sortable: true, width: '10rem' },
  { key: 'priority', label: 'Priority', sortable: true, width: '9rem' },
]

const meta = {
  title: 'Data Display/DataTable',
  component: PrDataTable,
  tags: ['autodocs'],
  args: {
    columns,
    data,
    selectable: true,
    pageSize: 10,
    filterKey: 'title',
    filterPlaceholder: 'Filter tasks...',
    hideSelectedRowsCount: false,
    rowActions: [{ label: 'Edit' }, { label: 'Delete', danger: true }],
  },
} satisfies Meta<typeof PrDataTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrBadge, PrDataTable },
    setup() {
      return { args, labels, priorities, statuses }
    },
    template: `
      <PrDataTable v-bind="args">
        <template #cell-title="{ value, row }">
          <div class="flex items-center gap-[var(--pr-space-2)]">
            <PrBadge variant="neutral">{{ labels.find((label) => label.value === row.label)?.label }}</PrBadge>
            <span class="block max-w-[32rem] truncate font-semibold">{{ value }}</span>
          </div>
        </template>

        <template #cell-status="{ value }">
          <div class="flex w-[8rem] items-center">
            <component :is="statuses.find((status) => status.value === value)?.icon" class="mr-[var(--pr-space-2)] size-4 text-[color:var(--pr-color-text-muted)]" aria-hidden="true" />
            <span>{{ statuses.find((status) => status.value === value)?.label }}</span>
          </div>
        </template>

        <template #cell-priority="{ value }">
          <div class="flex items-center">
            <component :is="priorities.find((priority) => priority.value === value)?.icon" class="mr-[var(--pr-space-2)] size-4 text-[color:var(--pr-color-text-muted)]" aria-hidden="true" />
            <span>{{ priorities.find((priority) => priority.value === value)?.label }}</span>
          </div>
        </template>
      </PrDataTable>
    `,
  }),
}

export const Loading: Story = {
  args: {
    isLoading: true,
  },
  render: Default.render,
}

export const Empty: Story = {
  args: {
    data: [],
  },
  render: Default.render,
}

export const ServerSide: Story = {
  args: {
    serverSide: true,
  },
  render: (args) => ({
    components: { PrDataTable },
    setup() {
      // Simulates a Laravel `Model::paginate()` endpoint: sorting, filtering
      // and pagination all happen "server-side" instead of in the browser.
      const state = reactive({
        rows: [] as typeof data,
        page: 1,
        pageSize: args.pageSize ?? 10,
        totalRows: 0,
        sort: null as { key: string, direction: 'asc' | 'desc' } | null,
        filter: '',
        isLoading: false,
      })

      async function fetchPage() {
        state.isLoading = true
        await new Promise((resolve) => setTimeout(resolve, 300))

        let rows = args.filterKey && state.filter
          ? data.filter((row) => String(row[args.filterKey as keyof typeof row]).toLocaleLowerCase().includes(state.filter.toLocaleLowerCase()))
          : [...data]

        if (state.sort) {
          const { key, direction } = state.sort
          rows = rows.sort((a, b) => {
            const result = String(a[key as keyof typeof a]).localeCompare(String(b[key as keyof typeof b]))
            return direction === 'asc' ? result : -result
          })
        }

        state.totalRows = rows.length
        const start = (state.page - 1) * state.pageSize
        state.rows = rows.slice(start, start + state.pageSize)
        state.isLoading = false
      }

      fetchPage()

      return {
        args,
        state,
        onPage: (page: number) => { state.page = page; fetchPage() },
        onPageSize: (pageSize: number) => { state.pageSize = pageSize; fetchPage() },
        onSort: (sort: typeof state.sort) => { state.sort = sort; fetchPage() },
        onFilter: (filter: string) => { state.filter = filter; fetchPage() },
      }
    },
    template: `
      <PrDataTable
        v-bind="args"
        :rows="state.rows"
        :total-rows="state.totalRows"
        :page="state.page"
        :page-size="state.pageSize"
        :sort="state.sort"
        :filter="state.filter"
        :is-loading="state.isLoading"
        @update:page="onPage"
        @update:page-size="onPageSize"
        @update:sort="onSort"
        @update:filter="onFilter"
      />
    `,
  }),
}
