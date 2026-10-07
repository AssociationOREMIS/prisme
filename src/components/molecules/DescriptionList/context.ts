import type { InjectionKey } from 'vue'

export const descriptionListKey: InjectionKey<{ emptyText: () => string }> = Symbol('PrDescriptionList')
