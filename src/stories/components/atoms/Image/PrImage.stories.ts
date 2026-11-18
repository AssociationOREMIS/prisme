import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrImage } from '../../../../components/atoms/Image'
import membre from '../../../assets/site-public/membre_obnl.svg'
import '../../../stories.css'

const meta = {
  title: 'Atoms/Image',
  component: PrImage,
  tags: ['autodocs'],
  argTypes: {
    align: { control: 'inline-radio', options: ['start', 'center'] },
    loading: { control: 'inline-radio', options: ['lazy', 'eager'] },
  },
  args: {
    src: membre,
    alt: '',
    width: 1000,
    height: 1000,
    maxWidth: '20rem',
    align: 'center',
    rounded: false,
  },
} satisfies Meta<typeof PrImage>

export default meta
type Story = StoryObj<typeof meta>

// An illustration that never grows wider than its column: at 320 px it simply shrinks. `alt=""`
// here, the text next to it says it all; give a real alternative when the image tells something.
export const Default: Story = {}

export const Rounded: Story = {
  args: { rounded: true, maxWidth: '14rem', align: 'start' },
}
