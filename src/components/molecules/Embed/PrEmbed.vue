<script setup lang="ts">
import { computed, ref } from 'vue'
import { ExternalLink, ShieldCheck } from '@lucide/vue'
import { PrButton } from '../../atoms/Button'
import { usePrMessages } from '../../../i18n/context'

export interface PrEmbedProps {
  /** Address of the content to show in the frame (a form, a video, a map). */
  src: string
  /** Name of the frame for screen readers: what it holds (« Formulaire d'adhésion »). Required. */
  title: string
  /** Name of the service (`HelloAsso`, `YouTube`), shown in the consent box and the link. */
  provider?: string
  /**
   * Asks before loading the service: the frame only loads after a click on « Afficher le contenu »,
   * no request is made to the service before (GDPR, cookies of third parties).
   */
  consent?: boolean
  /** Height of the frame, a CSS length (`40rem` by default). Ignored with `aspect-ratio`. */
  height?: string
  /** Shape of the frame instead of a height: `16/9` for a video. */
  aspectRatio?: string
  /** `allow` attribute of the frame (`fullscreen; payment`...). */
  allow?: string
  /** Shows a link to open the content on the service's site, under the frame. */
  externalLink?: boolean
}

const props = withDefaults(defineProps<PrEmbedProps>(), {
  provider: undefined,
  consent: false,
  height: '40rem',
  aspectRatio: undefined,
  allow: undefined,
  externalLink: false,
})

const messages = usePrMessages()
const accepted = ref(false)
const showFrame = computed(() => !props.consent || accepted.value)
const providerName = computed(() => props.provider ?? new URL(props.src, 'https://example.invalid').hostname)

const frameStyle = computed(() => (props.aspectRatio ? { aspectRatio: props.aspectRatio } : { height: props.height }))
</script>

<template>
  <div class="pr-embed pr:grid pr:gap-[var(--pr-space-3)]">
    <!-- A frame for a third-party service, the width of its column, rounded, on a white background
         (most services are designed on white, also in the dark theme). -->
    <iframe
      v-if="showFrame"
      class="pr-embed__frame pr:block pr:w-full pr:max-w-full pr:rounded-[var(--pr-radius-xl)] pr:border-0 pr:bg-[var(--pr-neutral-0)]"
      :style="frameStyle"
      :src="src"
      :title="title"
      :allow="allow"
      loading="lazy"
      referrerpolicy="strict-origin-when-cross-origin"
    />
    <div
      v-else
      class="pr-embed__consent pr:grid pr:place-content-center pr:justify-items-center pr:gap-[var(--pr-space-4)] pr:rounded-[var(--pr-radius-xl)] pr:border pr:border-[var(--pr-color-border)] pr:bg-[var(--pr-color-surface-subtle)] pr:p-[var(--pr-space-8)] pr:text-center pr:max-[780px]:p-[var(--pr-space-5)]"
      :style="aspectRatio ? frameStyle : { minHeight: `min(${height}, 24rem)` }"
    >
      <ShieldCheck class="pr:text-[color:var(--pr-color-primary)]" :size="32" aria-hidden="true" />
      <p class="pr-embed__consent-title pr:m-0 pr:font-[family-name:var(--pr-font-heading)] pr:text-[length:var(--pr-font-size-lg)] pr:font-semibold pr:text-[color:var(--pr-color-heading)]">
        {{ messages.embed.consentTitle(providerName) }}
      </p>
      <p class="pr-embed__consent-text pr:m-0 pr:max-w-[32rem] pr:text-[length:var(--pr-font-size-sm)] pr:text-[color:var(--pr-color-text-muted)]">
        {{ messages.embed.consentText(providerName) }}
      </p>
      <PrButton @click="accepted = true">{{ messages.embed.load(providerName) }}</PrButton>
    </div>
    <PrButton
      v-if="externalLink"
      class="pr-embed__external"
      variant="link"
      size="sm"
      :href="src"
      target="_blank"
      rel="noopener"
      :icon="ExternalLink"
      icon-position="end"
    >
      {{ messages.embed.openExternal(providerName) }}
    </PrButton>
  </div>
</template>
