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
  /** Messages from a 422 response that didn't match any field in the schema (e.g. array-item errors like `items.0.name` with no `items.name` field declared). */
  generalErrors: Ref<string[]>
  validate: () => boolean
  validateField: (field: keyof S) => boolean
  reset: () => void
  handleSubmit: (fn: () => Promise<void> | void) => Promise<boolean>
  isValid: ComputedRef<boolean>
  isDirty: ComputedRef<boolean>
  /** True while `handleSubmit`'s callback is running — validation failures never set it, since the callback itself never runs. */
  isSubmitting: Ref<boolean>
}

/** Deep-clones a field value so mutating a form field never mutates the schema's initial value (or a previous snapshot of it). */
function cloneFieldValue<T>(value: T): T {
  return value === null || typeof value !== 'object' ? value : structuredClone(value)
}

function isFieldValueEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true
  if (a instanceof Date || b instanceof Date) {
    return a instanceof Date && b instanceof Date && a.getTime() === b.getTime()
  }
  if (Array.isArray(a) || Array.isArray(b)) {
    return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((item, index) => isFieldValueEqual(item, b[index]))
  }
  if (typeof a === 'object' && a !== null && typeof b === 'object' && b !== null) {
    const aKeys = Object.keys(a)
    const bKeys = Object.keys(b)
    return aKeys.length === bKeys.length && aKeys.every((key) => isFieldValueEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]))
  }
  return false
}

export function usePrForm<S extends PrFormSchema>(schema: S): PrFormReturn<S> {
  type Keys = keyof S

  const fields = {} as { [K in Keys]: Ref<InferValue<S[K]>> }
  const errors = {} as { [K in Keys]: Ref<string | null> }
  const initialValues = {} as { [K in Keys]: InferValue<S[K]> }
  const generalErrors = ref<string[]>([])
  const isSubmitting = ref(false)

  for (const key in schema) {
    const initialValue = cloneFieldValue(schema[key].initialValue) as InferValue<S[typeof key]>
    initialValues[key as Keys] = initialValue
    fields[key as Keys] = ref(cloneFieldValue(initialValue)) as Ref<InferValue<S[typeof key]>>
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
      fields[key as Keys].value = cloneFieldValue(initialValues[key as Keys])
      errors[key as Keys].value = null
    }
    generalErrors.value = []
  }

  async function handleSubmit(fn: () => Promise<void> | void): Promise<boolean> {
    generalErrors.value = []
    if (!validate()) return false
    isSubmitting.value = true
    try {
      await fn()
      return true
    }
    catch (err) {
      const response = (err as { response?: { status?: number, data?: { errors?: LaravelValidationErrors } } })
        ?.response
      if (response?.status === 422 && response.data?.errors) {
        generalErrors.value = fromLaravelErrors({ errors } as Pick<PrFormReturn<S>, 'errors'>, response.data.errors)
        return false
      }
      throw err
    }
    finally {
      isSubmitting.value = false
    }
  }

  const isValid = computed(() =>
    Object.values(errors).every(e => (e as Ref<string | null>).value === null),
  )

  const isDirty = computed(() =>
    Object.keys(schema).some(key => !isFieldValueEqual(fields[key as Keys].value, initialValues[key as Keys])),
  )

  return { fields, errors, generalErrors, validate, validateField, reset, handleSubmit, isValid, isDirty, isSubmitting }
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

/**
 * Applies a Laravel 422 error bag to a form's `errors` refs. Array-item keys
 * (e.g. `items.0.name`) fall back to their base field (`items.name`) when no
 * exact match exists, since a flat form schema can't declare one field per
 * row index. Messages that still don't match any field are returned instead
 * of being silently dropped, so callers can surface them (e.g. `generalErrors`).
 */
export function fromLaravelErrors<S extends PrFormSchema>(
  form: Pick<PrFormReturn<S>, 'errors'>,
  laravelErrors: LaravelValidationErrors,
): string[] {
  const errors = form.errors as Record<string, Ref<string | null>>
  const unmatched: string[] = []

  for (const field in laravelErrors) {
    const message = laravelErrors[field]?.[0]
    if (!message) continue

    const target = field in errors ? field : field.replace(/\.\d+(?=\.|$)/g, '')

    if (target in errors) {
      errors[target].value = message
    }
    else {
      unmatched.push(message)
    }
  }

  return unmatched
}
