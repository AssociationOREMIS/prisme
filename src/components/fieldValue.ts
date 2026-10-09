import { computed, getCurrentInstance, ref, watch, type ComputedRef } from 'vue'

/**
 * The value a text field shows. A real `v-model` (a `modelValue` with an `update:modelValue`
 * listener) controls it. Otherwise the field keeps what the user types, starting from
 * `modelValue`, `defaultValue` or `initial()`: a Blade form passes the server's value as
 * `model-value` without listening, and a re-render while typing (an error showing up) must
 * not put that value back.
 */
export function useFieldValue<T>(
  props: { modelValue?: T, defaultValue?: T },
  initial: () => T | undefined,
): { value: ComputedRef<T | undefined>, set: (value: T) => void } {
  const vnodeProps = getCurrentInstance()?.vnode.props ?? {}
  const listens = 'onUpdate:modelValue' in vnodeProps || 'onUpdate:model-value' in vnodeProps

  const local = ref(props.modelValue ?? props.defaultValue ?? initial())
  watch(() => props.modelValue, (value) => {
    if (value !== undefined) local.value = value
  })

  const value = computed(() => (listens && props.modelValue !== undefined ? props.modelValue : local.value) as T | undefined)

  return {
    value,
    set: (next: T) => {
      local.value = next
    },
  }
}
