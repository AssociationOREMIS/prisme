import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Check, MoreHorizontal } from '@lucide/vue'
import { ref } from 'vue'
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

export const WithCheckboxItems: Story = {
  render: () => ({
    components: { Check, MoreHorizontal, PrButton, PrDropdownMenu },
    setup() {
      const showArchived = ref(false)
      const showDrafts = ref(true)
      return { showArchived, showDrafts }
    },
    template: `
      <div class="story-panel">
        <PrDropdownMenu label="Affichage">
          <template #trigger>
            <PrButton variant="secondary">
              Filtres
              <MoreHorizontal :size="16" aria-hidden="true" />
            </PrButton>
          </template>
          <template #default="{ checkboxItem, itemIndicator, checkboxItemClass }">
            <component :is="checkboxItem" v-model="showArchived" :class="checkboxItemClass">
              <component :is="itemIndicator" class="absolute left-[var(--pr-space-3)] inline-flex">
                <Check :size="14" aria-hidden="true" />
              </component>
              Afficher les archives
            </component>
            <component :is="checkboxItem" v-model="showDrafts" :class="checkboxItemClass">
              <component :is="itemIndicator" class="absolute left-[var(--pr-space-3)] inline-flex">
                <Check :size="14" aria-hidden="true" />
              </component>
              Afficher les brouillons
            </component>
          </template>
        </PrDropdownMenu>
      </div>
    `,
  }),
}
