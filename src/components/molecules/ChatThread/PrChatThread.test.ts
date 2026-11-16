// @vitest-environment jsdom
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { PrChatThread } from '.'

afterEach(() => {
  document.body.innerHTML = ''
})

/** jsdom has no layout: the list's sizes are given by hand. */
function fakeLayout(element: HTMLElement, sizes: { scrollHeight: number, clientHeight: number }) {
  Object.defineProperty(element, 'scrollHeight', { configurable: true, get: () => sizes.scrollHeight })
  Object.defineProperty(element, 'clientHeight', { configurable: true, get: () => sizes.clientHeight })
}

const Host = defineComponent({
  props: { initial: { type: Number, default: 2 } },
  setup(props, { expose }) {
    const items = ref(Array.from({ length: props.initial }, (_, index) => `Message ${index + 1}`))
    expose({ items })
    return () => h(PrChatThread, { count: items.value.length }, () => items.value.map(text => h('li', { key: text }, text)))
  },
})

describe('PrChatThread', () => {
  it('is a named, polite and focusable list', () => {
    const wrapper = mount(PrChatThread, { slots: { default: () => h('li', 'Bonjour') } })
    const list = wrapper.find('ol')

    expect(list.attributes()).toMatchObject({ 'aria-live': 'polite', 'aria-label': 'Conversation', tabindex: '0' })
    expect(mount(PrChatThread, { props: { label: 'Échange avec OREMIS' } }).find('ol').attributes('aria-label')).toBe('Échange avec OREMIS')
  })

  it('follows new messages while the reader is at the bottom', async () => {
    const wrapper = mount(Host, { attachTo: document.body })
    const list = wrapper.find('ol').element as HTMLElement
    const sizes = { scrollHeight: 1000, clientHeight: 300 }
    fakeLayout(list, sizes)
    list.scrollTop = 700
    list.dispatchEvent(new Event('scroll'))

    sizes.scrollHeight = 1200
    ;(wrapper.vm as unknown as { items: string[] }).items.push('Nouveau')
    await flushPromises()

    expect(list.scrollTop).toBe(1200)
  })

  it('stays put once the reader scrolled up, and follows again back at the bottom', async () => {
    const wrapper = mount(Host, { attachTo: document.body })
    const vm = wrapper.vm as unknown as { items: string[] }
    const list = wrapper.find('ol').element as HTMLElement
    const sizes = { scrollHeight: 1000, clientHeight: 300 }
    fakeLayout(list, sizes)
    list.scrollTop = 200
    list.dispatchEvent(new Event('scroll'))

    sizes.scrollHeight = 1200
    vm.items.push('Nouveau')
    await flushPromises()
    expect(list.scrollTop).toBe(200)

    list.scrollTop = 900
    list.dispatchEvent(new Event('scroll'))
    sizes.scrollHeight = 1400
    vm.items.push('Encore')
    await flushPromises()
    expect(list.scrollTop).toBe(1400)
  })

  it('follows a change of text inside a message too (MutationObserver)', async () => {
    const text = ref('Bon')
    const wrapper = mount(defineComponent({ setup: () => () => h(PrChatThread, null, () => [h('li', text.value)]) }), { attachTo: document.body })
    const list = wrapper.find('ol').element as HTMLElement
    const sizes = { scrollHeight: 500, clientHeight: 300 }
    fakeLayout(list, sizes)
    list.scrollTop = 200

    sizes.scrollHeight = 700
    text.value = 'Bonjour, comment allez-vous ?'
    await flushPromises()

    expect(list.scrollTop).toBe(700)
  })
})
