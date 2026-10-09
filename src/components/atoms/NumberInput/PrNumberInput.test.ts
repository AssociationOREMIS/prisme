// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { PrNumberInput } from '.'

describe('PrNumberInput', () => {
  it('can be emptied: it emits null instead of taking the old value back', async () => {
    const wrapper = mount(PrNumberInput, { props: { modelValue: 4, 'onUpdate:modelValue': () => {} } })
    const input = wrapper.find('input')

    await input.trigger('focus')
    await input.setValue('')
    await input.trigger('blur')

    expect(wrapper.emitted('update:modelValue')).toEqual([[null]])
  })

  it('rounds the steps to their decimals', async () => {
    const wrapper = mount(PrNumberInput, { props: { defaultValue: 0.2, step: 0.1 } })

    await wrapper.find('button[aria-label="Incrémenter"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[0.3]])
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('0.3')
  })

  it('shows empty for a v-model set to null', async () => {
    const wrapper = mount(PrNumberInput, { props: { modelValue: 4, 'onUpdate:modelValue': () => {} } })

    await wrapper.setProps({ modelValue: null })

    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('')
  })
})
