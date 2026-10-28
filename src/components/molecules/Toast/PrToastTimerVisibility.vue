<script setup lang="ts">
// The toasts' close timers follow whether the page can be seen, not where the focus is.
// - Reka pauses them on window blur: a click on another screen or another application stopped
//   them though the page stays in sight. Undone here: while the page is visible, a blur that
//   paused them resumes them at once (a pause already there, for a hovered or focused toast,
//   is kept).
// - Hidden (another tab, minimised window, locked screen), they pause, and resume with the
//   time left when the page shows again: a message must not disappear while nobody can read
//   it, including one that appears in a page loading in a background tab.
// Goes through Reka's own pause state. Placed first in the ToastProvider, so that a toast
// mounted while the page is hidden never starts its timer.
import { injectToastProviderContext } from 'reka-ui'
import { onBeforeUnmount, onMounted } from 'vue'

const provider = injectToastProviderContext()
let pausedWhileHidden = false
let pausedBeforeBlur = false

function viewportEvent(name: 'toast.viewportPause' | 'toast.viewportResume') {
  provider.viewport.value?.dispatchEvent(new CustomEvent(name))
}

function pause() {
  viewportEvent('toast.viewportPause')
  provider.isClosePausedRef.value = true
}

function resume() {
  viewportEvent('toast.viewportResume')
  provider.isClosePausedRef.value = false
}

function onVisibilityChange() {
  if (document.visibilityState === 'hidden') {
    if (!provider.isClosePausedRef.value) {
      pause()
      pausedWhileHidden = true
    }
  } else if (pausedWhileHidden) {
    pausedWhileHidden = false
    if (provider.isClosePausedRef.value) {
      resume()
    }
  }
}

// Captured, so it runs before Reka's own blur listener, whatever their order: it sees whether
// the toasts were already paused. Reka's pause then happens, and is undone right after.
function onBlurCapture() {
  pausedBeforeBlur = provider.isClosePausedRef.value
  queueMicrotask(() => {
    if (document.visibilityState === 'visible' && !pausedBeforeBlur && provider.isClosePausedRef.value) {
      resume()
    }
  })
}

if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
  provider.isClosePausedRef.value = true
  pausedWhileHidden = true
}

onMounted(() => {
  document.addEventListener('visibilitychange', onVisibilityChange)
  window.addEventListener('blur', onBlurCapture, { capture: true })
})
onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', onVisibilityChange)
  window.removeEventListener('blur', onBlurCapture, { capture: true })
})
</script>

<template>
  <slot />
</template>
