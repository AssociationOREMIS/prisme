import { computed, ref, type ComputedRef, type Ref } from 'vue'

export type PrValidationRule<T = unknown> = (value: T) => string | true

export interface PrFieldConfig<T = unknown> {
  initialValue: T
  rules?: PrValidationRule<T>[]
}

export type PrFormSchema = Record<string, PrFieldConfig>

type InferValue<C> = C extends PrFieldConfig<infer T> ? T : never

export interface PrFormReturn<S extends PrFormSchema> {
  fields: { [K in keyof S]: Ref<InferValue<S[K]>> }
  errors: { [K in keyof S]: Ref<string | null> }
  validate: () => boolean
  validateField: (field: keyof S) => boolean
  reset: () => void
  handleSubmit: (fn: () => Promise<void> | void) => Promise<boolean>
  isValid: ComputedRef<boolean>
  isDirty: ComputedRef<boolean>
}

export function usePrForm<S extends PrFormSchema>(schema: S): PrFormReturn<S> {
  type Keys = keyof S

  const fields = {} as { [K in Keys]: Ref<InferValue<S[K]>> }
  const errors = {} as { [K in Keys]: Ref<string | null> }

  for (const key in schema) {
    fields[key as Keys] = ref(schema[key].initialValue) as Ref<InferValue<S[typeof key]>>
    errors[key as Keys] = ref(null)
  }

  function validateField(key: Keys): boolean {
    const config = schema[key as string]
    const value = fields[key].value
    if (!config.rules?.length) {
      errors[key].value = null
      return true
    }
    for (const rule of config.rules) {
      const result = (rule as PrValidationRule)(value)
      if (result !== true) {
        errors[key].value = result
        return false
      }
    }
    errors[key].value = null
    return true
  }

  function validate(): boolean {
    let valid = true
    for (const key in schema) {
      if (!validateField(key as Keys)) valid = false
    }
    return valid
  }

  function reset(): void {
    for (const key in schema) {
      fields[key as Keys].value = schema[key].initialValue as InferValue<S[typeof key]>
      errors[key as Keys].value = null
    }
  }

  async function handleSubmit(fn: () => Promise<void> | void): Promise<boolean> {
    if (!validate()) return false
    try {
      await fn()
      return true
    }
    catch (err) {
      const laravelErrors = (err as { response?: { status?: number, data?: { errors?: LaravelValidationErrors } } })
        ?.response
      if (laravelErrors?.status === 422 && laravelErrors.data?.errors) {
        fromLaravelErrors({ errors } as Pick<PrFormReturn<S>, 'errors'>, laravelErrors.data.errors)
        return false
      }
      throw err
    }
  }

  const isValid = computed(() =>
    Object.values(errors).every(e => (e as Ref<string | null>).value === null),
  )

  const isDirty = computed(() =>
    Object.keys(schema).some(key => fields[key as Keys].value !== schema[key].initialValue),
  )

  return { fields, errors, validate, validateField, reset, handleSubmit, isValid, isDirty }
}

// Built-in validation rule helpers
export const required =
  (message = 'Ce champ est requis'): PrValidationRule<unknown> =>
  (value) => {
    if (value === null || value === undefined) return message
    if (typeof value === 'string' && value.trim() === '') return message
    if (Array.isArray(value) && value.length === 0) return message
    return true
  }

export const email =
  (message = 'Adresse email invalide'): PrValidationRule<string> =>
  (value) => {
    if (!value) return true
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || message
  }

export const minLength =
  (min: number, message?: string): PrValidationRule<string> =>
  (value) => {
    if (!value) return true
    return value.length >= min || (message ?? `Minimum ${min} caractères`)
  }

export const maxLength =
  (max: number, message?: string): PrValidationRule<string> =>
  (value) => {
    if (!value) return true
    return value.length <= max || (message ?? `Maximum ${max} caractères`)
  }

export const pattern =
  (regex: RegExp, message = 'Format invalide'): PrValidationRule<string> =>
  (value) => {
    if (!value) return true
    return regex.test(value) || message
  }

export const min =
  (minVal: number, message?: string): PrValidationRule<number> =>
  (value) =>
    value >= minVal || (message ?? `Valeur minimale : ${minVal}`)

export const max =
  (maxVal: number, message?: string): PrValidationRule<number> =>
  (value) =>
    value <= maxVal || (message ?? `Valeur maximale : ${maxVal}`)

// Laravel 422 error integration
export type LaravelValidationErrors = Record<string, string[]>

export function fromLaravelErrors<S extends PrFormSchema>(
  form: Pick<PrFormReturn<S>, 'errors'>,
  laravelErrors: LaravelValidationErrors,
): void {
  const errors = form.errors as Record<string, Ref<string | null>>
  for (const field in laravelErrors) {
    if (field in errors) {
      errors[field].value = laravelErrors[field]?.[0] ?? null
    }
  }
}
