import { render } from 'solid-js/web'
import { createSignal } from 'solid-js'

class AsEvent extends HTMLElement {
  private dispose?: () => void
  private _value: string = ''

  connectedCallback() {
    const [label] = createSignal(this.getAttribute('label') || '')
    const [value, setValue] = createSignal(this._value || this.getAttribute('value') || '')
    const [placeholder] = createSignal(this.getAttribute('placeholder') || '')
    const [event] = createSignal(this.getAttribute('event') || 'event-trigger')
    const [theme] = createSignal(this.getAttribute('theme') || '')
    const [readonly] = createSignal(this.hasAttribute('readonly'))
    const [disabled] = createSignal(this.hasAttribute('disabled'))

    const handleClick = () => {
      if (disabled() || readonly()) return
      this.dispatchEvent(new CustomEvent(event(), {
        detail: { value: value() },
        bubbles: true,
        composed: true
      }))
    }

    const handleKeydown = (e: KeyboardEvent) => {
      if (disabled() || readonly()) return
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleClick()
      }
    }

    const displayValue = () => {
      if (value()) {
        return value()
      }
      return placeholder() || 'Select action'
    }

    const isPlaceholder = () => !value()

    // Exponer método para actualizar value
    ;(this as any).updateValue = (newValue: string) => {
      this._value = newValue
      setValue(newValue)
    }

    const Component = () => (
      <>
        <style>{`
          :host {
            display: block;
          }
          .field {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif;
            position: relative;
          }
          label {
            font-size: 0.875rem;
            font-weight: 500;
            color: ${theme() === 'dark' ? '#f3f4f6' : '#374151'};
          }
          .event-trigger {
            padding: 0.5rem 0.75rem;
            border: 1px solid transparent;
            border-radius: 4px;
            font-size: 0.9375rem;
            font-family: inherit;
            background: ${theme() === 'dark' ? '#374151' : '#e8eaed'};
            color: ${theme() === 'dark' ? '#e5e5e5' : '#1a1a1a'};
            outline: none;
            cursor: pointer;
            transition: border-color 0.15s;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
          }
          .event-trigger.placeholder {
            color: ${theme() === 'dark' ? '#9ca3af' : '#6b7280'};
          }
          .event-trigger:focus {
            border-color: #1676f3;
          }
          .event-trigger:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            background: #f3f4f6;
          }
          .event-trigger.readonly {
            cursor: default;
            background: #f9fafb;
          }
          .arrow {
            margin-left: 0.5rem;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          svg {
            width: 20px;
            height: 20px;
            color: ${theme() === 'dark' ? '#e5e5e5' : '#1f2937'};
          }
        `}</style>
        <div class="field">
          {label() && <label>{label()}</label>}
          <div
            class={`event-trigger ${isPlaceholder() ? 'placeholder' : ''} ${readonly() ? 'readonly' : ''}`}
            tabindex={disabled() ? '-1' : '0'}
            onClick={handleClick}
            onKeyDown={handleKeydown}
          >
            <span>{displayValue()}</span>
            <span class="arrow">
              <svg viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </div>
        </div>
      </>
    )

    const shadowRoot = this.attachShadow({ mode: 'open' })
    this.dispose = render(Component, shadowRoot)
  }

  disconnectedCallback() {
    this.dispose?.()
  }

  set value(newValue: string) {
    this._value = newValue
    this.setAttribute('value', newValue)
    ;(this as any).updateValue?.(newValue)
  }

  get value() {
    return this._value
  }

  static get observedAttributes() {
    return ['label', 'value', 'placeholder', 'event', 'theme', 'readonly', 'disabled']
  }
}

customElements.define('as-event', AsEvent)