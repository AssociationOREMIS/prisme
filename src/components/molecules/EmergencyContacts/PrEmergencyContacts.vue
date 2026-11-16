<script setup lang="ts">
import { computed, useId } from 'vue'
import { MessageSquare, Phone } from '@lucide/vue'
import { PrVisuallyHidden } from '../../atoms/VisuallyHidden'
import { usePrMessages } from '../../../i18n/context'

export interface PrEmergencyContact {
  /** Number as shown (« 3018 », « 01 23 45 67 89 »): the spaces are left out of the link. */
  number: string
  /** What the number is for, shown under it. */
  label: string
  /** `tel` opens a call, `sms` a text message (said to screen readers: « 114 par SMS »). */
  channel: 'tel' | 'sms'
}

export interface PrEmergencyContactsProps {
  /** The numbers, the French emergency numbers (`messages.emergencyContacts.contacts`) by default. */
  contacts?: ReadonlyArray<PrEmergencyContact>
  /** Title above the list, `messages.emergencyContacts.title` by default. `""` hides it. */
  title?: string
  /** Makes the title a heading of this level. Without it, the title is a bold paragraph. */
  headingLevel?: 2 | 3 | 4
}

const props = withDefaults(defineProps<PrEmergencyContactsProps>(), {
  contacts: undefined,
  title: undefined,
  headingLevel: undefined,
})

const messages = usePrMessages()
const baseId = `pr-emergency-contacts-${useId()}`

const items = computed(() => props.contacts ?? messages.emergencyContacts.contacts)
const titleText = computed(() => props.title ?? messages.emergencyContacts.title)
const titleTag = computed(() => (props.headingLevel ? `h${props.headingLevel}` : 'p'))

function hrefOf(contact: PrEmergencyContact): string {
  return `${contact.channel}:${contact.number.replace(/[^\d+]/g, '')}`
}
</script>

<template>
  <div class="pr-emergency-contacts pr:grid pr:gap-[var(--pr-space-2)] pr:text-[color:var(--pr-color-text)]">
    <component
      :is="titleTag"
      v-if="titleText"
      :id="`${baseId}-title`"
      class="pr-emergency-contacts__title pr:m-0 pr:font-[family-name:var(--pr-font-heading)] pr:text-[length:var(--pr-font-size-lg)] pr:font-bold pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-heading)]"
    >
      {{ titleText }}
    </component>
    <ul
      class="pr-emergency-contacts__list pr:m-0 pr:list-none pr:p-0"
      :aria-labelledby="titleText ? `${baseId}-title` : undefined"
    >
      <li
        v-for="(contact, index) in items"
        :key="`${contact.channel}-${contact.number}`"
        class="pr-emergency-contacts__item pr:flex pr:flex-wrap pr:items-center pr:gap-x-[var(--pr-space-4)] pr:gap-y-[var(--pr-space-1)] pr:border-b pr:border-[var(--pr-color-border)] pr:py-[var(--pr-space-2)] pr:last:border-b-0"
      >
        <a
          class="pr-emergency-contacts__link pr:inline-flex pr:min-h-[2.75rem] pr:min-w-[5.5rem] pr:items-center pr:gap-[var(--pr-space-2)] pr:rounded-[var(--pr-radius-sm)] pr:font-[family-name:var(--pr-font-heading)] pr:text-[length:var(--pr-font-size-xl)] pr:font-bold pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-primary)] pr:no-underline pr:hover:underline pr:focus-visible:outline-2 pr:focus-visible:outline-offset-2 pr:focus-visible:outline-[var(--pr-color-focus)]"
          :href="hrefOf(contact)"
          :aria-describedby="`${baseId}-label-${index}`"
        >
          <component :is="contact.channel === 'sms' ? MessageSquare : Phone" class="pr-emergency-contacts__icon pr:shrink-0" :size="20" aria-hidden="true" />
          <span>{{ contact.number }}<PrVisuallyHidden v-if="contact.channel === 'sms'">{{ ` ${messages.emergencyContacts.sms}` }}</PrVisuallyHidden></span>
        </a>
        <span
          :id="`${baseId}-label-${index}`"
          class="pr-emergency-contacts__label pr:min-w-0 pr:flex-1 pr:basis-[12rem] pr:text-[length:var(--pr-font-size-sm)] pr:leading-[var(--pr-line-height-tight)] pr:text-[color:var(--pr-color-text-muted)]"
        >
          {{ contact.label }}
        </span>
      </li>
    </ul>
  </div>
</template>
