import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { PrSlider } from '../../../../components/atoms/Slider'
import '../../../stories.css'

const meta = {
  title: 'Forms/Slider',
  component: PrSlider,
  tags: ['autodocs'],
  args: {
    label: 'Priorite',
    min: 0,
    max: 10,
    step: 1,
    disabled: false,
    showValue: true,
  },
} satisfies Meta<typeof PrSlider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PrSlider },
    setup() {
      const value = ref(4)
      return { args, value }
    },
    template: '<PrSlider v-model="value" v-bind="args" />',
  }),
}

export const States: Story = {
  render: () => ({
    components: { PrSlider },
    template: `
      <div class="story-column">
        <PrSlider label="Standard" :model-value="40" />
        <PrSlider label="Desactive" :model-value="60" disabled />
      </div>
    `,
  }),
}
