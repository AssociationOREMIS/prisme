// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { PrLinkList, type PrLinkListItem } from '.'

const items: PrLinkListItem[] = [
  {
    id: 1,
    title: 'Nouvelle sauvegarde',
    href: '/notes/sauvegarde',
    description: 'Les bases sont copiées chaque nuit.',
    tags: [{ label: 'Infra', variant: 'primary' }, { label: 'Lecture 3 min', variant: 'plain' }],
    meta: ['12 novembre 2026', 'Camille MARTIN'],
  },
  { title: 'Sans lien' },
]

describe('PrLinkList', () => {
  it('renders a list of entries with heading links, tags and meta', () => {
    const wrapper = mount(PrLinkList, { props: { items } })
    const entries = wrapper.findAll('ul.pr-link-list > li')
    expect(entries).toHaveLength(2)

    const link = entries[0].find('h3 a')
    expect(link.attributes('href')).toBe('/notes/sauvegarde')
    expect(link.text()).toBe('Nouvelle sauvegarde')
    expect(entries[0].find('.pr-badge').text()).toBe('Infra')
    expect(entries[0].find('.pr-link-list__tag:not(.pr-badge)').text()).toBe('Lecture 3 min')
    expect(entries[0].find('.pr-link-list__meta').text()).toBe('12 novembre 2026 / Camille MARTIN')

    expect(entries[1].find('h3').text()).toBe('Sans lien')
    expect(entries[1].find('a').exists()).toBe(false)
    expect(entries[1].find('.pr-link-list__details').exists()).toBe(false)
  })

  it('takes the heading level and the item slot', () => {
    const wrapper = mount(PrLinkList, {
      props: { items, headingLevel: 2 },
      slots: { item: '<template #item="{ item }"><strong>{{ item.title }}</strong></template>' },
    })
    expect(wrapper.find('h2').exists()).toBe(false)
    expect(wrapper.findAll('strong').map(el => el.text())).toEqual(['Nouvelle sauvegarde', 'Sans lien'])

    expect(mount(PrLinkList, { props: { items, headingLevel: 2 } }).findAll('h2')).toHaveLength(2)
  })

  it('says when the list is empty', () => {
    expect(mount(PrLinkList, { props: { items: [] } }).text()).toBe('Aucun élément.')
    expect(mount(PrLinkList, { props: { items: [], emptyText: 'Aucune note.' } }).text()).toBe('Aucune note.')
  })
})
