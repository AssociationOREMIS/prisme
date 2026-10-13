import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrAvatar } from '../../../../components/atoms/Avatar'
import '../../../stories.css'
import { IDENTICON, PHOTO } from './avatarSamples'

const meta = {
  title: 'Data Display/Avatar',
  component: PrAvatar,
  tags: ['autodocs'],
  argTypes: {
    size: { control: { type: 'number', min: 16, max: 128 } },
  },
  args: {
    src: PHOTO,
    size: 28,
  },
} satisfies Meta<typeof PrAvatar>

export default meta
type Story = StoryObj<typeof meta>

export const Photo: Story = {}

export const Identicon: Story = {
  args: { src: IDENTICON },
}

export const WithoutPicture: Story = {
  args: { src: null },
}

export const BrokenPicture: Story = {
  args: { src: '/does-not-exist.png' },
}

export const Sizes: Story = {
  render: () => ({
    components: { PrAvatar },
    setup() {
      return { PHOTO, IDENTICON }
    },
    template: `
      <div style="display: flex; gap: 16px; align-items: center;">
        <PrAvatar :src="PHOTO" :size="28" />
        <PrAvatar :src="PHOTO" :size="40" />
        <PrAvatar :src="IDENTICON" :size="64" />
        <PrAvatar :src="IDENTICON" :size="96" />
        <PrAvatar :size="40" />
      </div>
    `,
  }),
}
