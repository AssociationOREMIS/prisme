import { inject, type App, type InjectionKey } from 'vue'
import { prMessagesFr, type PrMessages } from './messages'

/**
 * Texts to replace: a whole pack (`prMessagesEn`) or only a few, section by section
 * (`{ dataTable: { empty: 'Aucun bénévole' } }`). What is left out stays French.
 */
export type PrMessagesOverride = {
  [K in keyof PrMessages]?: PrMessages[K] extends object ? Partial<PrMessages[K]> : PrMessages[K]
}

export const prMessagesKey = Symbol('pr-messages') as InjectionKey<PrMessages>

/** The French texts with `override` laid over them, section by section. */
export function resolvePrMessages(override: PrMessagesOverride = {}): PrMessages {
  const messages = { ...prMessagesFr } as Record<string, unknown>

  for (const [key, value] of Object.entries(override)) {
    if (value === undefined) continue
    const base = messages[key]
    messages[key] = typeof value === 'object' && typeof base === 'object' ? { ...base, ...value } : value
  }

  return messages as unknown as PrMessages
}

/** Gives every Prisme component of `app` these texts. */
export function providePrMessages(app: App, override?: PrMessagesOverride): void {
  app.provide(prMessagesKey, resolvePrMessages(override))
}

/** The texts of the app (French unless it set others), for a component's own labels. */
export function usePrMessages(): PrMessages {
  return inject(prMessagesKey, prMessagesFr)
}
