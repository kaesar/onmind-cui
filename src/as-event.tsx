import { render } from 'solid-js/web'
import { createSignal } from 'solid-js'

class AsEvent extends HTMLElement {
  private dispose?: () => void
  private _value: string = ''

  connectedCallback() {
    // Prefer property value when already set; otherwise hydrate from attribute
    this._value = this._value || this.getAttribute('value') || ''

    const [label, setLabel] = createSignal(this.getAttribute('label') || '')
    const [value, setValue] = createSignal(this._value)
    const [placeholder, setPlaceholder] = createSignal(this.getAttribute('placeholder') || '')
    const [event, setEvent] = createSignal(this.getAttribute('event') || 'event-trigger')
    const [readonly, setReadonly] = createSignal(this.hasAttribute('readonly'))
    const [disabled, setDisabled] = createSignal(this.hasAttribute('disabled'))

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

    // Keep property/attribute value in sync with Solid signal (used by as-popup demos, forms, etc.)
    ;(this as any).updateValue = (newValue: string) => {
      this._value = newValue
      setValue(newValue)
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          const attrName = mutation.attributeName
          if (attrName === 'label') setLabel(this.getAttribute('label') || '')
          if (attrName === 'value') setValue(this._value || this.getAttribute('value') || '')
          if (attrName === 'placeholder') setPlaceholder(this.getAttribute('placeholder') || '')
          if (attrName === 'event') setEvent(this.getAttribute('event') || 'event-trigger')
          if (attrName === 'readonly') setReadonly(this.hasAttribute('readonly'))
          if (attrName === 'disabled') setDisabled(this.hasAttribute('disabled'))
        }
      })
    })
    observer.observe(this, { attributes: true })

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
            color: #374151;
          }
          .event-trigger {
            padding: 0.5rem 0.75rem;
            border: 1px solid transparent;
            border-radius: 4px;
            font-size: 0.9375rem;
            font-family: inherit;
            background: #e8eaed;
            color: #1a1a1a;
            outline: none;
            cursor: pointer;
            transition: border-color 0.15s;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
          }
          .event-trigger.placeholder {
            color: #6b7280;
          }
          .event-trigger:focus {
            border-color: #1676f3;
          }
          .event-trigger.disabled {
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
            flex-shrink: 0;
          }
          /* Trigger stays light regardless of theme — keep chevron dark for contrast */
          .arrow svg {
            width: 20px;
            height: 20px;
            color: #1f2937;
            stroke: #1f2937;
          }
          :host([theme="dark"]) label {
            color: #f3f4f6;
          }
        `}</style>
        <div class="field">
          {label() && <label>{label()}</label>}
          <div
            class={`event-trigger ${isPlaceholder() ? 'placeholder' : ''} ${readonly() ? 'readonly' : ''} ${disabled() ? 'disabled' : ''}`}
            tabindex={disabled() ? '-1' : '0'}
            aria-disabled={disabled()}
            onClick={handleClick}
            onKeyDown={handleKeydown}
          >
            <span>{displayValue()}</span>
            <span class="arrow">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
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
    return this._value || this.getAttribute('value') || ''
  }

  static get observedAttributes() {
    return ['label', 'value', 'placeholder', 'event', 'theme', 'readonly', 'disabled']
  }
}

customElements.define('as-event', AsEvent)