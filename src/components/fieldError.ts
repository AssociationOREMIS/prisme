import { computed, type ComputedRef } from 'vue'

/** A field error as passed by the app: one message, or Laravel's array of messages for the field. */
export type PrFieldError = string | string[]

/**
 * The message a field shows: the error itself, or the first of Laravel's messages
 * (`$errors->get('name')`, `errors.name` in an Inertia/JSON response), undefined when empty.
 */
export function useErrorText(error: () => PrFieldError | undefined): ComputedRef<string | undefined> {
  return computed(() => {
    const value = error()
    const message = Array.isArray(value) ? value[0] : value
    return message || undefined
  })
}
