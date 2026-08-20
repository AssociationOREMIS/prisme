import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { MoreHorizontal } from '@lucide/vue'
import { PrButton } from '../../../../components/atoms/Button'
import { PrDropdownMenu } from '../../../../components/molecules/DropdownMenu'
import '../../../stories.css'

const meta = {
  title: 'Overlays/DropdownMenu',
  component: PrDropdownMenu,
  tags: ['autodocs'],
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
    },
  },
  args: {
    side: 'bottom',
    align: 'end',
    label: 'Actions',
  },
} satisfies Meta<typeof PrDropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { MoreHorizontal, PrButton, PrDropdownMenu },
    setup() {
      return { args }
    },
    template: `
      <div class="story-panel">
        <PrDropdownMenu v-bind="args">
          <template #trigger>
            <PrButton variant="secondary">
              Actions
              <MoreHorizontal :size="16" aria-hidden="true" />
            </PrButton>
          </template>
          <template #default="{ item, separator, itemClass, dangerItemClass, separatorClass }">
            <component :is="item" :class="itemClass">Modifier</component>
            <component :is="item" :class="itemClass">Dupliquer</component>
            <component :is="separator" :class="separatorClass" />
            <component :is="item" :class="dangerItemClass">
              Supprimer
            </component>
          </template>
        </PrDropdownMenu>
      </div>
    `,
  }),
}
