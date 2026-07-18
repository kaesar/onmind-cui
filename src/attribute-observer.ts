/**
 * Shared Attribute Observer Utility
 *
 * Synchronizes HTML attributes on a custom-element host with SolidJS signals.
 * Eliminates boilerplate MutationObserver code across components.
 */

import { createSignal, type Accessor } from 'solid-js'

/**
 * Configuration for a single attribute to observe
 */
export interface AttributeConfig<T> {
  /** Attribute name to observe */
  attribute: string
  /** Signal setter function */
  setValue: (value: T) => void
  /** Transform function from raw attribute string to typed value */
  transform?: (value: string) => T
  /** Whether this is a boolean attribute (presence = true, absence = false) */
  isBoolean?: boolean
}

/**
 * Options for createAttributeObserver
 */
export interface AttributeObserverOptions {
  /** Additional attributes to observe beyond the configured ones */
  extraAttributes?: string[]
}

/**
 * Creates a MutationObserver that syncs host attributes to signal setters.
 *
 * @param element - Custom element host to observe (required)
 * @param configs - Attribute → setter mappings
 * @param options - Extra attribute filter entries
 * @returns disconnect function for disconnectedCallback
 */
export function createAttributeObserver(
  element: HTMLElement,
  configs: AttributeConfig<any>[],
  options: AttributeObserverOptions = {}
): () => void {
  const { extraAttributes = [] } = options

  const observedAttributes = [
    ...configs.map(c => c.attribute),
    ...extraAttributes
  ]

  const applyAttribute = (attrName: string) => {
    const config = configs.find(c => c.attribute === attrName)
    if (!config) return

    let value: any
    if (config.isBoolean) {
      value = element.hasAttribute(attrName)
    } else {
      const rawValue = element.getAttribute(attrName) || ''
      value = config.transform ? config.transform(rawValue) : rawValue
    }
    config.setValue(value)
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type !== 'attributes' || !mutation.attributeName) return
      applyAttribute(mutation.attributeName)
    })
  })

  observer.observe(element, {
    attributes: true,
    attributeFilter: observedAttributes.length > 0 ? observedAttributes : undefined
  })

  return () => observer.disconnect()
}

/**
 * Creates a signal pair (documentation helper — syncing still needs createAttributeObserver).
 */
export function createSyncedSignal<T>(
  _attributeName: string,
  initialValue: T,
  _transform?: (value: string) => T
): [Accessor<T>, (value: T) => void] {
  return createSignal<T>(initialValue)
}

/**
 * Standard form-field attribute observer (label/value/theme/readonly/disabled/…).
 */
export function createFormFieldAttributes(
  element: HTMLElement,
  attrs: Record<string, [any, (v: any) => void]>
): () => void {
  const configs: AttributeConfig<any>[] = []

  const typeMap: Record<string, { isBoolean?: boolean; transform?: (v: string) => any }> = {
    theme: { transform: (v: string) => (v === 'dark' ? 'dark' : 'light') },
    readonly: { isBoolean: true },
    disabled: { isBoolean: true },
    required: { isBoolean: true },
    checked: { isBoolean: true },
    multiple: { isBoolean: true },
    dim: { transform: (v: string) => (v === 'true' ? 'true' : 'false') }
  }

  for (const [attr, [, setter]] of Object.entries(attrs)) {
    const config = typeMap[attr] || {}
    configs.push({
      attribute: attr,
      setValue: setter,
      transform: config.transform,
      isBoolean: config.isBoolean
    })
  }

  return createAttributeObserver(element, configs)
}

export type StandardAttrConfig =
  | [any, (v: any) => void]
  | {
      setter: (v: any) => void
      isBoolean?: boolean
      transform?: (v: string) => any
      defaultValue?: any
    }

/**
 * Attribute observer for common custom-element patterns.
 *
 * @example
 * ```tsx
 * createStandardAttributes(this, {
 *   label: [label, setLabel],
 *   variant: [variant, setVariant],
 *   disabled: { setter: setDisabled, isBoolean: true }
 * })
 * ```
 */
export function createStandardAttributes(
  element: HTMLElement,
  attrs: Record<string, StandardAttrConfig>
): () => void {
  const configs: AttributeConfig<any>[] = []

  for (const [attr, config] of Object.entries(attrs)) {
    if (Array.isArray(config)) {
      const [, setter] = config
      configs.push({
        attribute: attr,
        setValue: setter
      })
    } else {
      configs.push({
        attribute: attr,
        setValue: config.setter,
        transform: config.transform,
        isBoolean: config.isBoolean
      })
    }
  }

  return createAttributeObserver(element, configs)
}
