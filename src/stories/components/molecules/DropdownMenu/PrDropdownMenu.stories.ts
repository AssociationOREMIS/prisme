import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
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
              <component :is="itemIndicator" class="pr:absolute pr:left-[var(--pr-space-3)] pr:inline-flex">
                <Check :size="14" aria-hidden="true" />
              </component>
              Afficher les archives
            </component>
            <component :is="checkboxItem" v-model="showDrafts" :class="checkboxItemClass">
              <component :is="itemIndicator" class="pr:absolute pr:left-[var(--pr-space-3)] pr:inline-flex">
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

// Keyboard use: Enter opens on the first item, arrows move, Escape closes and gives the focus back.
export const Keyboard: Story = {
  render: () => ({
    components: { PrButton, PrDropdownMenu },
    template: `
      <PrDropdownMenu label="Actions">
        <template #trigger><PrButton variant="secondary">Actions</PrButton></template>
        <template #default="{ item, itemClass }">
          <component :is="item" :class="itemClass">Modifier</component>
          <component :is="item" :class="itemClass">Dupliquer</component>
        </template>
      </PrDropdownMenu>
    `,
  }),
  play: async ({ canvasElement }) => {
    const body = within(document.body)
    const trigger = within(canvasElement).getByRole('button', { name: 'Actions' })

    trigger.focus()
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(body.getByRole('menuitem', { name: 'Modifier' })).toHaveFocus())
    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() => expect(body.getByRole('menuitem', { name: 'Dupliquer' })).toHaveFocus())

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull())
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}
