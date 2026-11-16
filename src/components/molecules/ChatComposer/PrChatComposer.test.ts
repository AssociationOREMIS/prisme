// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { PrChatComposer } from '.'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('PrChatComposer', () => {
  it('has a named field and a named send button', () => {
    const wrapper = mount(PrChatComposer)
    const input = wrapper.find('input')

    expect(wrapper.find(`label[for="${input.attributes('id')}"]`).text()).toBe('Votre message')
    expect(input.attributes('placeholder')).toBe('Écrivez votre message...')
    expect(wrapper.find('button[type="submit"]').attributes('aria-label')).toBe('Envoyer')
  })

  it('sends the trimmed text on submit, then empties the field', async () => {
    const wrapper = mount(PrChatComposer, { props: { modelValue: '', 'onUpdate:modelValue': (value: string) => wrapper.setProps({ modelValue: value }) } })

    await wrapper.find('input').setValue('  Bonjour  ')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('send')).toEqual([['Bonjour']])
    expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual([''])
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('')
  })

  it('works without v-model', async () => {
    const wrapper = mount(PrChatComposer)

    await wrapper.find('input').setValue('Salut')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('send')).toEqual([['Salut']])
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('')
  })

  it('sends nothing when the text is empty or blank, or when disabled', async () => {
    const wrapper = mount(PrChatComposer)

    await wrapper.find('form').trigger('submit')
    await wrapper.find('input').setValue('   ')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('send')).toBeUndefined()

    await wrapper.setProps({ modelValue: 'Bonjour', disabled: true })
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('send')).toBeUndefined()
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('passes maxlength to the field', () => {
    const wrapper = mount(PrChatComposer, { props: { maxlength: 500 } })

    expect(wrapper.find('input').attributes('maxlength')).toBe('500')
  })

  it('multiline: Enter sends, Shift+Enter does not', async () => {
    const wrapper = mount(PrChatComposer, { props: { multiline: true } })
    const textarea = wrapper.find('textarea')

    expect(textarea.attributes('aria-label')).toBe('Votre message')
    await textarea.setValue('Première ligne')
    const shiftEnter = new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true, cancelable: true })
    textarea.element.dispatchEvent(shiftEnter)
    expect(shiftEnter.defaultPrevented).toBe(false)
    expect(wrapper.emitted('send')).toBeUndefined()

    const enter = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true })
    textarea.element.dispatchEvent(enter)
    await wrapper.vm.$nextTick()
    expect(enter.defaultPrevented).toBe(true)
    expect(wrapper.emitted('send')).toEqual([['Première ligne']])
    expect((textarea.element as HTMLTextAreaElement).value).toBe('')
  })
})
