import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent, ref } from 'vue'
import { PrButton } from '../../components/atoms/Button'
import { PrInput } from '../../components/atoms/Input'
import { PrDatePicker } from '../../components/molecules/DatePicker'
import { PrSelect } from '../../components/molecules/Select'
import {
  email,
  maxLength,
  minLength,
  required,
  usePrForm,
} from '../../composables/usePrForm'
import '../stories.css'

const DemoForm = defineComponent({
  components: { PrInput, PrDatePicker, PrSelect, PrButton },
  setup() {
    const roleOptions = [
      { label: 'Administrateur', value: 'admin' },
      { label: 'Éditeur', value: 'editor' },
      { label: 'Lecteur', value: 'reader' },
    ]

    const today = new Date().toISOString().slice(0, 10)

    const { fields, errors, reset, handleSubmit, isValid, isDirty } = usePrForm({
      name: { initialValue: '', rules: [required(), minLength(2), maxLength(80)] },
      email: { initialValue: '', rules: [required(), email()] },
      birthDate: { initialValue: '', rules: [required('Veuillez indiquer votre date de naissance')] },
      role: { initialValue: '', rules: [required('Veuillez choisir un rôle')] },
    })

    const submitted = ref(false)
    const isLoading = ref(false)
    const forceLaravel422 = ref(false)

    async function onSubmit() {
      submitted.value = false
      isLoading.value = true

      // handleSubmit validates, runs the async submission, and maps a
      // Laravel 422 response straight onto the form's errors on failure.
      const ok = await handleSubmit(async () => {
        await new Promise(r => setTimeout(r, 800)) // Simulate API call

        if (forceLaravel422.value) {
          forceLaravel422.value = false
          throw {
            response: {
              status: 422,
              data: {
                errors: {
                  name: ['Ce nom est déjà utilisé.'],
                  email: ['Cette adresse email est déjà enregistrée.'],
                },
              },
            },
          }
        }
      })

      isLoading.value = false
      submitted.value = ok
    }

    function simulateLaravel422() {
      forceLaravel422.value = true
      onSubmit()
    }

    return { fields, errors, reset, isValid, isDirty, onSubmit, simulateLaravel422, submitted, isLoading, roleOptions, today }
  },
  template: `
    <form class="story-column" style="max-width: 28rem" @submit.prevent="onSubmit">
      <PrInput v-model="fields.name.value" :error="errors.name.value ?? undefined" label="Nom complet" placeholder="Jean Dupont" required />
      <PrInput v-model="fields.email.value" :error="errors.email.value ?? undefined" label="Email" type="email" placeholder="jean@example.com" required />
      <PrDatePicker v-model="fields.birthDate.value" :error="errors.birthDate.value ?? undefined" label="Date de naissance" :max="today" required />
      <PrSelect v-model="fields.role.value" :error="errors.role.value ?? undefined" label="Rôle" :options="roleOptions" placeholder="Choisir un rôle" required />

      <div class="story-row" style="margin-top: 0.5rem">
        <PrButton type="submit" :loading="isLoading">Soumettre</PrButton>
        <PrButton type="button" variant="ghost" @click="reset">Réinitialiser</PrButton>
        <PrButton type="button" variant="secondary" @click="simulateLaravel422">Simuler erreur 422</PrButton>
      </div>

      <div v-if="submitted" style="padding: 0.75rem; border-radius: var(--pr-radius-md); background: var(--pr-color-success-subtle, var(--pr-color-surface-subtle)); color: var(--pr-color-success, var(--pr-color-text)); font-size: var(--pr-font-size-sm)">
        Formulaire soumis avec succès !
      </div>

      <div style="margin-top: 0.5rem; font-size: var(--pr-font-size-xs); color: var(--pr-color-text-muted)">
        <code>isValid: {{ isValid }} · isDirty: {{ isDirty }}</code>
      </div>
    </form>
  `,
})

const meta = {
  title: 'Composables/usePrForm',
  component: DemoForm,
  tags: ['autodocs'],
} satisfies Meta<typeof DemoForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { DemoForm },
    template: '<DemoForm />',
  }),
}
