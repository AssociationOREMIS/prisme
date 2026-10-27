import { getCurrentInstance, onBeforeUnmount, ref, type Ref } from 'vue'

/** Delay between emptying the region and writing the new text: screen readers miss a change made in the same frame. */
const ANNOUNCE_DELAY = 100

export interface PrLiveAnnouncer {
  /** The text of the component's polite status region: `<p class="pr:sr-only" role="status">{{ message }}</p>`. */
  message: Ref<string>
  /**
   * Reads `text` to screen readers, even when it is the same as the last one. `delay` (ms) waits
   * for a pause: while someone types, only the last text is read.
   */
  announce: (text: string, delay?: number) => void
}

/**
 * A polite status region of a component (WCAG 4.1.3): results of a filter, a page change, a tag
 * added or removed, a file refused. The region must be rendered from the start, empty: a region
 * inserted together with its text is not read.
 */
export function useLiveAnnouncer(): PrLiveAnnouncer {
  const message = ref('')
  let timer: ReturnType<typeof setTimeout> | undefined

  function announce(text: string, delay = ANNOUNCE_DELAY) {
    clearTimeout(timer)
    message.value = ''
    timer = setTimeout(() => {
      message.value = text
    }, delay)
  }

  if (getCurrentInstance()) onBeforeUnmount(() => clearTimeout(timer))

  return { message, announce }
}
