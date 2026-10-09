<script setup lang="ts">
import { computed } from 'vue'
import type { PrFormError } from '../../../composables/usePrForm'
import { usePrMessages } from '../../../i18n/context'
import { PrAlert } from '../Alert'

export interface PrErrorSummaryProps {
  /** `errorList` of `usePrForm`, or plain messages (`$errors->all()` in Blade). */
  errors?: Array<PrFormError | string>
  /** Defaults to the messages' `errorSummary.title`, which counts the errors. */
  title?: string
}

const props = withDefaults(defineProps<PrErrorSummaryProps>(), {
  errors: () => [],
  title: undefined,
})

const messages = usePrMessages()

// Rendered only with errors: a role="alert" region inserted into the page is announced at once.
const lines = computed(() => props.errors.map((error) => {
  if (typeof error === 'string') return error
  return error.label ? messages.errorSummary.item(error.label, error.message) : error.message
}))
</script>

<template>
  <PrAlert v-if="lines.length" class="pr-error-summary" variant="danger" :title="title ?? messages.errorSummary.title(lines.length)">
    <ul class="pr-error-summary__list pr:m-0 pr:grid pr:list-disc pr:gap-[var(--pr-space-1)] pr:pl-[var(--pr-space-5)]">
      <li v-for="(line, index) in lines" :key="index">{{ line }}</li>
    </ul>
  </PrAlert>
</template>
