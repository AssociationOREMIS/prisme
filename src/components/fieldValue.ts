import { computed, getCurrentInstance, ref, watch, type ComputedRef } from 'vue'

/**
 * The value a field shows. A real `v-model` (an `update:modelValue` listener) controls it
 * entirely: `undefined` there means empty, so `usePrForm.reset()` back to an `undefined` initial
 * value clears the field. Without a listener (a Blade form), the field keeps its own value,
 * starting from `modelValue`, `defaultValue` or `initial()`: the server's value passed as
 * `model-value` is a starting point, and a re-render (an error showing up) must not put it back.
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

  const value = computed(() => (listens ? props.modelValue : local.value) as T | undefined)

  return {
    value,
    set: (next: T) => {
      local.value = next
    },
  }
}
