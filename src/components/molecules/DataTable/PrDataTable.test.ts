// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { PrDataTable } from '.'

const columns = [{ key: 'name', label: 'Nom' }]
const rows = [{ id: 1, name: 'Camille MARTIN' }, { id: 2, name: 'Alex DURAND' }]

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

})
