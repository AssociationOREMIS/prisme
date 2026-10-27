import { useAttrs } from 'vue'

/**
 * Splits the attributes given to a field component whose root is a wrapper: `class` and `style`
 * stay on the wrapper (the layout), the others (`autocomplete`, `aria-*`, `data-*`...) go to the
 * actual control, where they mean something (WCAG 1.3.5: `autocomplete="bday"` on a <div> was lost).
 * Functions, not computed values: attributes are not reactive, a render reads their latest state.
 */
export function useControlAttrs() {
  const attrs = useAttrs()

  return {
    rootAttrs: () => ({ class: attrs.class, style: attrs.style }),
    controlAttrs: () => Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style')),
  }
}
