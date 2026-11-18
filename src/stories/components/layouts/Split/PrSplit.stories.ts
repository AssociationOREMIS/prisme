import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrImage } from '../../../../components/atoms/Image'
import { PrReveal } from '../../../../components/atoms/Reveal'
import { PrStack } from '../../../../components/atoms/Stack'
import { PrSplit } from '../../../../components/layouts/Split'
import membre from '../../../assets/site-public/membre_obnl.svg'
import enLigne from '../../../assets/site-public/online_obnl.svg'
import '../../../stories.css'

const meta = {
  title: 'Layout/Split',
  component: PrSplit,
  tags: ['autodocs'],
  argTypes: {
    ratio: { control: 'inline-radio', options: ['7/5', '1/1', '5/7'] },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
    gap: { control: 'select', options: [4, 6, 8, 10, 12] },
  },
  args: {
    ratio: '7/5',
    reverse: false,
    align: 'center',
    gap: 10,
  },
} satisfies Meta<typeof PrSplit>

export default meta
type Story = StoryObj<typeof meta>

const heading = 'margin: 0; font-family: var(--pr-font-heading); color: var(--pr-color-heading);'

// A text and its illustration side by side; one column below 900 px, the text first.
export const Default: Story = {
  render: args => ({
    components: { PrImage, PrSplit, PrStack },
    setup: () => ({ args, membre }),
    template: `
      <PrSplit v-bind="args">
        <PrStack :gap="4">
          <h2 style="${heading}">Qu'est-ce que l'adhésion ?</h2>
          <p style="margin: 0;">
            En tant qu'adhérent, vous rejoignez l'assemblée générale, l'organe souverain de l'association,
            où chaque voix compte.
          </p>
        </PrStack>
        <template #media>
          <PrImage :src="membre" alt="" :width="1000" :height="1000" max-width="20rem" align="center" />
        </template>
      </PrSplit>
    `,
  }),
}

// The illustration on the left on wide screens, sliding in. The text stays first when read.
export const Reversed: Story = {
  args: { reverse: true },
  render: args => ({
    components: { PrImage, PrReveal, PrSplit, PrStack },
    setup: () => ({ args, enLigne }),
    template: `
      <PrSplit v-bind="args">
        <PrStack :gap="4">
          <h2 style="${heading}">Conçu pour tout le monde</h2>
          <p style="margin: 0;">L'assemblée générale se déroule en ligne : chacun peut s'impliquer, où qu'il soit.</p>
        </PrStack>
        <template #media>
          <PrReveal effect="fade-right">
            <PrImage :src="enLigne" alt="" :width="1000" :height="1000" max-width="20rem" align="center" />
          </PrReveal>
        </template>
      </PrSplit>
    `,
  }),
}
