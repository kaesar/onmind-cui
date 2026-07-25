/**
 * Global Theme Sync Utility
 *
 * Synchronizes a custom element's theme with a global theme indicator.
 * Observes a class on <html> (or any element) and sets a theme attribute on the component.
 * Works with any framework: VitePress, Astro, custom implementations, or system preference.
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
  /** Whether to also watch for 'prefers-color-scheme' changes when not set explicitly */
  respectSystemPreference?: boolean
}

/**
 * Creates a global theme synchronization for a custom element.
 * Call this in connectedCallback and the returned function in disconnectedCallback.
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

  const updateTheme = () => {
    const isDark = targetElement.classList.contains(syncClass)
    
    // If respecting system preference and no explicit theme is set,
    // also check prefers-color-scheme
    if (respectSystemPreference && !targetElement.hasAttribute('data-theme')) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark && !targetElement.classList.contains(syncClass)) {
        // System prefers dark but global theme hasn't set it yet
        element.setAttribute(themeAttribute, darkValue)
        return
      }
    }
    
    element.setAttribute(themeAttribute, isDark ? darkValue : lightValue)
  }

  // Initial sync
  updateTheme()

  // Observe target element class changes
  const observer = new MutationObserver(updateTheme)
  observer.observe(targetElement, {
    attributes: true,
    attributeFilter: ['class']
  })

  // Also watch for system preference changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleSystemChange = () => {
    // Only auto-switch if no explicit theme is set
    if (!targetElement.hasAttribute('data-theme') && 
        !targetElement.classList.contains(syncClass)) {
      updateTheme()
    }
  }
  
  mediaQuery.addEventListener?.('change', handleSystemChange)

  // Cleanup function
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

  // Also observe local theme attribute (for explicit overrides)
  const localObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === options.themeAttribute || 'theme') {
        const theme = element.getAttribute(options.themeAttribute || 'theme')
        if (theme === 'dark' || theme === 'light') {
          onThemeChange?.(theme)
        }
      }
    })
  })

  localObserver.observe(element, {
    attributes: true,
    attributeFilter: [options.themeAttribute || 'theme']
  })

  return () => {
    globalCleanup()
    localObserver.disconnect()
  }
}