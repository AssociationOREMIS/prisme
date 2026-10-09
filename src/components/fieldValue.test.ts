// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { PrInput } from './atoms/Input'
import { PrTextarea } from './atoms/Textarea'
import { PrDatePicker } from './molecules/DatePicker'

describe.each([['PrInput', PrInput, 'input'], ['PrTextarea', PrTextarea, 'textarea']] as const)('%s value', (_name, component, tag) => {
  it('keeps what is typed when a Blade model-value has no listener, through a re-render', async () => {
    const wrapper = mount(component, { props: { modelValue: 'Camille' } })
    await wrapper.find(tag).setValue('Camille MARTIN')

    await wrapper.setProps({ error: 'Ce nom est déjà pris.' })

    expect((wrapper.find(tag).element as HTMLInputElement).value).toBe('Camille MARTIN')
  })

  it('starts from defaultValue', () => {
    const wrapper = mount(component, { props: { defaultValue: 'Alex' } })
    expect((wrapper.find(tag).element as HTMLInputElement).value).toBe('Alex')
  })

  it('follows a real v-model', async () => {
    const Parent = defineComponent({
      components: { Field: component },
      setup: () => ({ name: ref('Camille') }),
      template: '<Field v-model="name" /><button @click="name = \'Alex\'">reset</button>',
    })
    const wrapper = mount(Parent)
    await wrapper.find(tag).setValue('Camille MARTIN')
    expect((wrapper.vm as unknown as { name: string }).name).toBe('Camille MARTIN')

    await wrapper.find('button').trigger('click')
    expect((wrapper.find(tag).element as HTMLInputElement).value).toBe('Alex')
  })
})

describe('PrDatePicker value', () => {
  it('starts from defaultValue', () => {
    const wrapper = mount(PrDatePicker, { props: { defaultValue: '2026-10-09' } })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('2026-10-09')
  })
})
