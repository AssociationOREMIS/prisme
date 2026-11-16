// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { PrEmergencyContacts } from '.'

describe('PrEmergencyContacts', () => {
  it('lists the French emergency numbers by default, as call or SMS links', () => {
    const wrapper = mount(PrEmergencyContacts)
    const links = wrapper.findAll('a')

    expect(wrapper.find('p.pr-emergency-contacts__title').text()).toBe("En cas d'urgence, n'attendez pas")
    expect(links.map(link => link.attributes('href'))).toEqual(['tel:15', 'tel:112', 'tel:3114', 'tel:119', 'tel:3018', 'sms:114'])
    expect(links[0].text()).toBe('15')
    expect(links[5].text()).toBe('114 par SMS')
    expect(links[5].find('.pr-visually-hidden').exists()).toBe(true)
  })

  it('describes each link with its label', () => {
    const wrapper = mount(PrEmergencyContacts, { attachTo: document.body })
    const link = wrapper.find('a')

    expect(document.getElementById(link.attributes('aria-describedby')!)?.textContent?.trim()).toBe('SAMU, urgence médicale')
    expect(wrapper.find('ul').attributes('aria-labelledby')).toBe(wrapper.find('.pr-emergency-contacts__title').attributes('id'))
    wrapper.unmount()
  })

  it('takes its own contacts, a heading level, and strips spaces from the link', () => {
    const wrapper = mount(PrEmergencyContacts, {
      props: { title: 'Nous joindre', headingLevel: 3, contacts: [{ number: '01 23 45 67 89', label: 'Permanence', channel: 'tel' }] },
    })

    expect(wrapper.find('h3').text()).toBe('Nous joindre')
    expect(wrapper.find('a').attributes('href')).toBe('tel:0123456789')
    expect(wrapper.find('a').text()).toBe('01 23 45 67 89')
  })

  it('hides the title with an empty one', () => {
    const wrapper = mount(PrEmergencyContacts, { props: { title: '' } })

    expect(wrapper.find('.pr-emergency-contacts__title').exists()).toBe(false)
    expect(wrapper.find('ul').attributes('aria-labelledby')).toBeUndefined()
  })
})
