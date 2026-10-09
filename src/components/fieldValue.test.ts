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

describe('reset to an undefined initial value', () => {
  it('clears a radio group and a tag input bound with v-model', async () => {
    const { usePrForm } = await import('../composables/usePrForm')
    const { PrRadioGroup } = await import('./molecules/RadioGroup')
    const { PrTagInput } = await import('./atoms/TagInput')
    const Form = defineComponent({
      components: { PrRadioGroup, PrTagInput },
      setup: () => usePrForm({
        role: { initialValue: undefined as string | undefined },
        tags: { initialValue: undefined as string[] | undefined },
      }),
      template: `
        <PrRadioGroup v-model="fields.role.value" label="Rôle" :options="[{ label: 'Bénévole', value: 'volunteer' }, { label: 'Formateur', value: 'trainer' }]" />
        <PrTagInput v-model="fields.tags.value" label="Compétences" />
      `,
    })
    const wrapper = mount(Form, { attachTo: document.body })
    const vm = wrapper.vm as unknown as { fields: { role: { value?: string }, tags: { value?: string[] } }, reset: () => void }

    vm.fields.role.value = 'trainer'
    vm.fields.tags.value = ['Écoute']
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[role="radio"][data-state="checked"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Écoute')

    vm.reset()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[role="radio"][data-state="checked"]').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Écoute')
    wrapper.unmount()
  })
})
