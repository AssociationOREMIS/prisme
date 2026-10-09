// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import { PrErrorSummary } from '../components/atoms/ErrorSummary'
import { PrInput } from '../components/atoms/Input'
import { PrRadioGroup } from '../components/molecules/RadioGroup'
import { email, required, usePrForm } from './usePrForm'

afterEach(() => {
  document.body.innerHTML = ''
})

function mountForm(options: { focusOnError?: boolean, useFormRef?: boolean } = {}) {
  let form!: ReturnType<typeof usePrForm<{
    name: { initialValue: string, rules: ReturnType<typeof required>[], label: string }
    email: { initialValue: string, rules: ReturnType<typeof email>[], label: string }
    role: { initialValue: string, rules: ReturnType<typeof required>[], label: string }
  }>>

  const Form = defineComponent({
    components: { PrErrorSummary, PrInput, PrRadioGroup },
    setup() {
      const formRef = ref<HTMLFormElement | null>(null)
      form = usePrForm({
        name: { initialValue: 'Camille', rules: [required()], label: 'Nom' },
        email: { initialValue: '', rules: [email()], label: 'Email' },
        role: { initialValue: '', rules: [required()], label: 'Rôle' },
      }, { focusOnError: options.focusOnError, form: options.useFormRef ? formRef : undefined })
      return { ...form, formRef }
    },
    template: `
      <form ref="formRef">
        <PrErrorSummary :errors="errorList" />
        <PrInput v-model="fields.name.value" :error="errors.name.value ?? undefined" label="Nom" />
        <PrInput v-model="fields.email.value" :error="errors.email.value ?? undefined" label="Email" />
        <PrRadioGroup
          v-model="fields.role.value"
          :error="errors.role.value ?? undefined"
          label="Rôle"
          :options="[{ label: 'Bénévole', value: 'volunteer' }, { label: 'Formateur', value: 'trainer' }]"
        />
        <button type="submit">Envoyer</button>
      </form>
    `,
  })

  const wrapper = mount(Form, { attachTo: document.body })
  return { wrapper, form: () => form }
}

describe('usePrForm focus on error', () => {
  it('focuses the first invalid field after a refused submit', async () => {
    const { wrapper, form } = mountForm()
    form().fields.email.value = 'pas-une-adresse'
    const submit = wrapper.find('button[type="submit"]').element as HTMLButtonElement
    submit.focus()

    expect(await form().handleSubmit(() => {})).toBe(false)

    const emailInput = wrapper.findAll('input').find(input => input.attributes('aria-invalid') === 'true')
    expect(document.activeElement).toBe(emailInput?.element)
    wrapper.unmount()
  })

  it('focuses the focusable item of an invalid group', async () => {
    const { wrapper, form } = mountForm({ useFormRef: true })

    await form().handleSubmit(() => {})

    expect(document.activeElement?.getAttribute('role')).toBe('radio')
    wrapper.unmount()
  })

  it('focuses the field a 422 rejects', async () => {
    const { wrapper, form } = mountForm({ useFormRef: true })
    form().fields.role.value = 'volunteer'

    await form().handleSubmit(() => {
      throw { response: { status: 422, data: { errors: { name: ['Ce nom est déjà pris.'] } } } }
    })

    expect(document.activeElement?.getAttribute('aria-invalid')).toBe('true')
    expect((document.activeElement as HTMLInputElement).value).toBe('Camille')
    wrapper.unmount()
  })

  it('leaves the focus alone with focusOnError: false', async () => {
    const { wrapper, form } = mountForm({ focusOnError: false })
    const button = wrapper.find('button[type="submit"]').element as HTMLButtonElement
    button.focus()

    await form().handleSubmit(() => {})

    expect(document.activeElement).toBe(button)
    wrapper.unmount()
  })
})

describe('PrErrorSummary', () => {
  it('lists every error with its field label, in an alert', async () => {
    const { wrapper, form } = mountForm({ focusOnError: false })
    form().fields.email.value = 'pas-une-adresse'

    await form().handleSubmit(() => {})
    await wrapper.vm.$nextTick()

    const summary = wrapper.find('.pr-error-summary')
    expect(summary.attributes('role')).toBe('alert')
    expect(summary.text()).toContain('Le formulaire contient 2 erreurs')
    expect(summary.findAll('li').map(item => item.text())).toEqual(['Email : Adresse email invalide', 'Rôle : Ce champ est requis'])
    wrapper.unmount()
  })

  it('renders nothing without errors, and takes plain messages', () => {
    expect(mount(PrErrorSummary).find('.pr-error-summary').exists()).toBe(false)

    const wrapper = mount(PrErrorSummary, { props: { errors: ['Le champ nom est obligatoire.'] } })
    expect(wrapper.text()).toContain('Le formulaire contient une erreur')
    expect(wrapper.find('li').text()).toBe('Le champ nom est obligatoire.')
  })
})
