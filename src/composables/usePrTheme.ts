import { computed, readonly, ref } from 'vue'

export type PrTheme = 'light' | 'dark' | 'system'
export type PrResolvedTheme = 'light' | 'dark'

export const PR_THEME_STORAGE_KEY = 'oremis-prisme-theme'

const systemThemeQuery = '(prefers-color-scheme: dark)'
const theme = ref<PrTheme>('system')
const resolvedTheme = ref<PrResolvedTheme>('light')

let mediaQuery: MediaQueryList | undefined
let isInitialized = false

function isPrTheme(value: string | null): value is PrTheme {
  return value === 'light' || value === 'dark' || value === 'system'
}

function getSystemTheme(): PrResolvedTheme {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return window.matchMedia(systemThemeQuery).matches ? 'dark' : 'light'
}

function resolveTheme(value: PrTheme): PrResolvedTheme {
  return value === 'system' ? getSystemTheme() : value
}

function applyResolvedTheme(value: PrResolvedTheme) {
  resolvedTheme.value = value

  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.dataset.prTheme = value
  document.documentElement.style.colorScheme = value
}

function applyTheme(value: PrTheme) {
  applyResolvedTheme(resolveTheme(value))
}

function readStoredTheme(): PrTheme {
  if (typeof window === 'undefined') {
    return 'system'
  }

  try {
    const storedTheme = window.localStorage.getItem(PR_THEME_STORAGE_KEY)
    return isPrTheme(storedTheme) ? storedTheme : 'system'
  } catch {
    return 'system'
  }
}

function writeStoredTheme(value: PrTheme) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(PR_THEME_STORAGE_KEY, value)
  } catch {
    // Storage can be unavailable in private browsing or embedded previews.
  }
}

function handleSystemThemeChange() {
  if (theme.value === 'system') {
    applyTheme('system')
  }
}

function initializeTheme() {
  if (isInitialized || typeof window === 'undefined') {
    return
  }

  isInitialized = true
  mediaQuery = window.matchMedia(systemThemeQuery)
  theme.value = readStoredTheme()
  applyTheme(theme.value)

  if ('addEventListener' in mediaQuery) {
    mediaQuery.addEventListener('change', handleSystemThemeChange)
  } else {
    const legacyMediaQuery = mediaQuery as MediaQueryList & {
      addListener: (listener: () => void) => void
    }
    legacyMediaQuery.addListener(handleSystemThemeChange)
  }
}

export function setPrTheme(value: PrTheme) {
  initializeTheme()
  theme.value = value
  writeStoredTheme(value)
  applyTheme(value)
}

export function togglePrTheme() {
  initializeTheme()
  setPrTheme(resolvedTheme.value === 'dark' ? 'light' : 'dark')
}

export function applyPrThemePreference(value?: PrTheme) {
  initializeTheme()

  if (value) {
    theme.value = value
  }

  applyTheme(value ?? theme.value)
}

export function getPrThemeInitScript() {
  return `(() => {
  const key = '${PR_THEME_STORAGE_KEY}';
  const allowed = ['light', 'dark', 'system'];
  let stored;
  try {
    stored = localStorage.getItem(key);
  } catch {
    stored = null;
  }
  const theme = allowed.includes(stored) ? stored : 'system';
  const resolved = theme === 'system'
    ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;
  document.documentElement.dataset.prTheme = resolved;
  document.documentElement.style.colorScheme = resolved;
})();`
}

export function usePrTheme() {
  initializeTheme()

  return {
    theme: readonly(theme),
    resolvedTheme: readonly(resolvedTheme),
    setTheme: setPrTheme,
    toggleTheme: togglePrTheme,
    isDark: computed(() => resolvedTheme.value === 'dark'),
  }
}
