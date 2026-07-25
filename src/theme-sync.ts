/**
 * Global Theme Sync Utility
 *
 * Synchronizes a custom element's theme with a global theme indicator.
 * Observes a class on <html> (or any element) and sets a theme attribute on the component.
 * Works with any framework: VitePress, Astro, custom implementations, or system preference.
 *
 * Resolution order:
 * 1. Local lock — theme attribute already set on the host before sync starts
 * 2. Explicit page theme — data-theme / data-appearance, or class "dark" / "light"
 * 3. data-theme="system"|"auto" — prefers-color-scheme
 * 4. Default — light (VitePress light mode is simply the absence of .dark)
 *
 * Important: OS dark preference must NOT override a page that is intentionally light
 * (no .dark class). That was causing as-index to render dark styles (pale tag text,
 * washed-out descriptions) inside VitePress light mode.
 */

export interface ThemeSyncOptions {
  /** Class name to watch on the target element (default: 'dark') */
  syncClass?: string
  /** Target element to observe for class changes (default: document.documentElement) */
  targetElement?: HTMLElement
  /** Attribute name to set on the host (default: 'theme') */
  themeAttribute?: string
  /** Values for light/dark themes (default: 'light' | 'dark') */
  lightValue?: string
  darkValue?: string
  /**
   * When true, data-theme="system"|"auto" follows prefers-color-scheme.
   * Does not force dark merely because the OS is dark while the page is light.
   */
  respectSystemPreference?: boolean
}

function resolveGlobalIsDark(
  targetElement: HTMLElement,
  syncClass: string,
  respectSystemPreference: boolean
): boolean {
  const dataTheme = (
    targetElement.getAttribute('data-theme') ||
    targetElement.getAttribute('data-appearance') ||
    ''
  ).toLowerCase()

  if (dataTheme === 'dark') return true
  if (dataTheme === 'light') return false

  if (targetElement.classList.contains(syncClass)) return true
  if (targetElement.classList.contains('light')) return false

  // Only follow OS when the page explicitly asks for system/auto theme
  if (
    respectSystemPreference &&
    (dataTheme === 'system' || dataTheme === 'auto')
  ) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  // No dark class / no dark data-theme → light (VitePress convention)
  return false
}

/**
 * Creates a global theme synchronization for a custom element.
 * Call this in connectedCallback and the returned function in disconnectedCallback.
 *
 * If the host already has a theme attribute when sync starts, it is treated as a
 * local lock and will not be overwritten by global changes (useful for demos that
 * set theme="dark" in markup and toggle it via JS).
 *
 * @param element - The custom element host
 * @param options - Configuration options
 * @returns cleanup function to call in disconnectedCallback
 */
export function createThemeSync(
  element: HTMLElement,
  options: ThemeSyncOptions = {}
): () => void {
  const {
    syncClass = 'dark',
    targetElement = document.documentElement,
    themeAttribute = 'theme',
    lightValue = 'light',
    darkValue = 'dark',
    respectSystemPreference = true
  } = options

  // Lock only when author/app set theme before sync (e.g. theme="dark" in markup).
  // Attributes written by this sync itself must remain free to update on global changes.
  const locked = element.hasAttribute(themeAttribute)

  const updateTheme = () => {
    if (locked) return

    const isDark = resolveGlobalIsDark(
      targetElement,
      syncClass,
      respectSystemPreference
    )
    element.setAttribute(themeAttribute, isDark ? darkValue : lightValue)
  }

  updateTheme()

  const observer = new MutationObserver(updateTheme)
  observer.observe(targetElement, {
    attributes: true,
    attributeFilter: ['class', 'data-theme', 'data-appearance']
  })

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleSystemChange = () => {
    if (locked) return
    updateTheme()
  }

  mediaQuery.addEventListener?.('change', handleSystemChange)

  return () => {
    observer.disconnect()
    mediaQuery.removeEventListener?.('change', handleSystemChange)
  }
}

/**
 * Convenience: sync theme AND observe local theme attribute changes.
 * Useful for components that also accept a local 'theme' attribute override.
 */
export function createThemeSyncWithLocalOverride(
  element: HTMLElement,
  onThemeChange?: (theme: 'light' | 'dark') => void,
  options: ThemeSyncOptions = {}
): () => void {
  const globalCleanup = createThemeSync(element, options)
  const themeAttribute = options.themeAttribute || 'theme'

  const localObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === themeAttribute) {
        const theme = element.getAttribute(themeAttribute)
        if (theme === 'dark' || theme === 'light') {
          onThemeChange?.(theme)
        }
      }
    })
  })

  localObserver.observe(element, {
    attributes: true,
    attributeFilter: [themeAttribute]
  })

  return () => {
    globalCleanup()
    localObserver.disconnect()
  }
}
