import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrCarousel } from '../../../../components/molecules/Carousel'
import '../../../stories.css'

const meta = {
  title: 'Data Display/Carousel',
  component: PrCarousel,
  tags: ['autodocs'],
  args: {
    items: [
      { title: 'Etape 1', description: 'Preparation du dossier.' },
      { title: 'Etape 2', description: 'Verification des donnees.' },
      { title: 'Etape 3', description: 'Publication.' },
    ],
  },
} satisfies Meta<typeof PrCarousel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
