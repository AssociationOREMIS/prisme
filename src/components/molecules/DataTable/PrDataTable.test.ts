// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PrDataTable } from '.'

const columns = [{ key: 'name', label: 'Nom' }]
const rows = [{ id: 1, name: 'Camille MARTIN' }, { id: 2, name: 'Alex DURAND' }]

afterEach(() => {
  vi.restoreAllMocks()
})

describe('PrDataTable empty states', () => {
  it('says the table is empty when it has no row', () => {
    const wrapper = mount(PrDataTable, { props: { columns, rows: [], emptyText: 'Aucun bénévole', noResultsMessage: 'Aucun bénévole ne correspond' } })

    expect(wrapper.find('tbody').text()).toBe('Aucun bénévole')
  })

  it('says the search matches nothing when a filter finds no row', async () => {
    const wrapper = mount(PrDataTable, { props: { columns, rows, filterKey: 'name', emptyText: 'Aucun bénévole', noResultsMessage: 'Aucun bénévole ne correspond' } })

    await wrapper.find('.pr-data-table__toolbar input').setValue('zzz')

    expect(wrapper.find('tbody').text()).toBe('Aucun bénévole ne correspond')
  })
})

describe('PrDataTable props', () => {
  it('hides the pagination with hide-pagination', () => {
    const wrapper = mount(PrDataTable, { props: { columns, rows, hidePagination: true } })

    expect(wrapper.find('.pr-data-table__pagination').exists()).toBe(false)
  })

  it('still accepts the deprecated names, with a warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(PrDataTable, { props: { columns, data: rows, displayPagination: false } })

    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    expect(wrapper.find('.pr-data-table__pagination').exists()).toBe(false)
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('PrDataTable: `data` is deprecated, use `rows`'))
  })
})
