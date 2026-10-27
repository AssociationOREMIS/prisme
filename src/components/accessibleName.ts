import { getCurrentInstance } from 'vue'

/**
 * Warns in the console when a control has no accessible name (RGAA 11.1, WCAG 4.1.2): no `label`,
 * no `aria-label`/`aria-labelledby`, and no `id` an outside `<label for>` could point at. Like
 * PrButton's and PrDialog's warnings: a Blade page gets no type error, the console says it.
 */
export function warnWithoutName(component: string, label: unknown, hint = '`label`'): void {
  const instance = getCurrentInstance()
  const attrs = instance?.attrs ?? {}
  const props = (instance?.props ?? {}) as Record<string, unknown>
  const named = Boolean(label)
    || Boolean(attrs['aria-label'] || attrs.ariaLabel || attrs['aria-labelledby'] || attrs.ariaLabelledby)
    || Boolean(props.ariaLabel)
    || Boolean(props.id || attrs.id)
  if (!named) {
    console.warn(`[prisme] ${component}: give it a ${hint} (or an \`aria-label\`), its name for screen readers.`)
  }
}
