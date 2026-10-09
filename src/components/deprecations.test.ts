// @vitest-environment jsdom
//
// Names renamed in 0.20 keep working until 1.0, with a warning naming the new one:
// `checked`/`pressed` on PrCheckbox, PrSwitch and PrToggle (now `v-model`), and
// PrToast's `variant="default"` (now `neutral`, as on PrBadge).
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PrCheckbox } from './atoms/Checkbox'
import { PrSwitch } from './atoms/Switch'
import { PrToggle } from './atoms/Toggle'
import { PrToast } from './molecules/Toast'

const cases = [
  { name: 'PrCheckbox', component: PrCheckbox, oldProp: 'checked', control: 'button[role="checkbox"]' },
  { name: 'PrSwitch', component: PrSwitch, oldProp: 'checked', control: 'button[role="switch"]' },
  { name: 'PrToggle', component: PrToggle, oldProp: 'pressed', control: 'button' },
] as const

afterEach(() => {
  vi.restoreAllMocks()
})

describe.each(cases)('$name', ({ name, component, oldProp, control }) => {
  it('reads modelValue and emits update:modelValue', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(component, { props: { modelValue: true } })

    expect(wrapper.find(control).attributes('data-state')).toMatch(/checked|on/)

    await wrapper.find(control).trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    expect(warn).not.toHaveBeenCalled()
  })

  it(`still accepts the deprecated ${oldProp}, with a warning`, async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(component, { props: { [oldProp]: true } })

    expect(wrapper.find(control).attributes('data-state')).toMatch(/checked|on/)
    expect(warn).toHaveBeenCalledWith(expect.stringContaining(`${name}: \`${oldProp}\` is deprecated`))

    await wrapper.find(control).trigger('click')

    expect(wrapper.emitted(`update:${oldProp}`)).toEqual([[false]])
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })
})

describe('PrToast', () => {
  it('reads variant="default" as neutral, with a warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mount(PrToast, { props: { variant: 'default', defaultOpen: true, title: 'Enregistré' } })

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('PrToast: `variant="default"` is deprecated, use `variant="neutral"`'))
  })
})
