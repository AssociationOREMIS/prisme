import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrBadge } from '../../../../components/atoms/Badge'
import { PrLinkList } from '../../../../components/molecules/LinkList'
import { devopsNotes } from './demoItems'
import '../../../stories.css'

const meta = {
  title: 'Data Display/LinkList',
  component: PrLinkList,
  tags: ['autodocs'],
  argTypes: {
    headingLevel: { control: 'select', options: [2, 3, 4] },
  },
  args: {
    items: devopsNotes,
    headingLevel: 3,
  },
} satisfies Meta<typeof PrLinkList>

export default meta
type Story = StoryObj<typeof meta>

// A feed of articles: title link, description, tags and « date / author » under it.
export const Default: Story = {
  render: (args) => ({
    components: { PrLinkList },
    setup: () => ({ args }),
    template: `
      <section aria-labelledby="notes-title" style="max-width: 48rem;">
        <h2 id="notes-title" style="margin: 0 0 var(--pr-space-4); font-family: var(--pr-font-heading); color: var(--pr-color-heading);">Dernières notes</h2>
        <PrLinkList v-bind="args" />
      </section>
    `,
  }),
}

export const Empty: Story = {
  args: {
    items: [],
    emptyText: 'Aucune note publiée pour le moment.',
  },
}

// The `item` slot replaces the body of each entry.
export const CustomItem: Story = {
  render: (args) => ({
    components: { PrBadge, PrLinkList },
    setup: () => ({ args }),
    template: `
      <PrLinkList v-bind="args" style="max-width: 48rem;">
        <template #item="{ item }">
          <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--pr-space-2);">
            <a :href="item.href" style="color: var(--pr-color-text); font-weight: 600;">{{ item.title }}</a>
            <PrBadge shape="tag">{{ item.meta?.[0] }}</PrBadge>
          </div>
        </template>
      </PrLinkList>
    `,
  }),
}
