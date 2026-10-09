// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, expect, it } from 'vitest'
import Prisme from '../plugin'
import { PrButton } from '../components/atoms/Button'
import { PrPagination } from '../components/molecules/Pagination'
import { required, minLength } from '../composables/usePrForm'
import { prMessagesEn } from './en'
import { prMessagesFr } from './messages'
import { resolvePrMessages } from './context'

describe('resolvePrMessages', () => {
  it('is French without an override', () => {
    expect(resolvePrMessages()).toEqual(prMessagesFr)
  })

  it('replaces only the texts given, section by section', () => {
    const messages = resolvePrMessages({ dataTable: { empty: 'Aucun bénévole' } })

    expect(messages.dataTable.empty).toBe('Aucun bénévole')
    expect(messages.dataTable.columns).toBe('Colonnes')
    expect(messages.common.close).toBe('Fermer')
  })

  it('takes a whole pack', () => {
    expect(resolvePrMessages(prMessagesEn)).toEqual(prMessagesEn)
  })
})

describe('components', () => {
  it('write French by default', () => {
    const wrapper = mount(PrPagination, { props: { pageCount: 3 } })

    expect(wrapper.find('.pr-pagination__prev').attributes('aria-label')).toBe('Page précédente')
  })

  it('write the texts given to app.use(Prisme, { messages })', () => {
    const wrapper = mount(PrPagination, {
      props: { pageCount: 3 },
      global: { plugins: [[Prisme, { messages: prMessagesEn }]] },
    })

    expect(wrapper.find('nav').attributes('aria-label')).toBe('Pagination')
    expect(wrapper.find('.pr-pagination__prev').attributes('aria-label')).toBe('Previous page')
  })

  it('still let a prop win for one instance', () => {
    const wrapper = mount(PrButton, {
      props: { action: 'edit', label: 'Modifier la fiche' },
      global: { plugins: [[Prisme, { messages: { actions: { edit: 'Éditer' } } }]] },
    })

    expect(wrapper.find('button').attributes('aria-label')).toBe('Modifier la fiche')
  })

  it('name a preset action from the messages', () => {
    const wrapper = mount(PrButton, {
      props: { action: 'edit' },
      global: { plugins: [[Prisme, { messages: { actions: { edit: 'Éditer' } } }]] },
    })

    expect(wrapper.find('button').attributes('aria-label')).toBe('Éditer')
  })
})

describe('usePrForm rules', () => {
  it('use the app messages when made in a component', () => {
    let rules: Array<(value: string) => string | true> = []
    const Form = defineComponent({
      setup() {
        rules = [required(), minLength(3)]
        return () => h('form')
      },
    })

    mount(Form, { global: { plugins: [[Prisme, { messages: prMessagesEn }]] } })

    expect(rules[0]('')).toBe('This field is required')
    expect(rules[1]('ab')).toBe('At least 3 characters')
  })

  it('are French when made outside a component', () => {
    expect(required()('')).toBe('Ce champ est requis')
  })
})
