import { render } from 'solid-js/web'
import { createSignal } from 'solid-js'

class AsInput extends HTMLElement {
  private dispose?: () => void

  connectedCallback() {
    const [label, setLabel] = createSignal(this.getAttribute('label') || '')
    const [value, setValue] = createSignal(this.getAttribute('value') || '')
    const [placeholder, setPlaceholder] = createSignal(this.getAttribute('placeholder') || this.getAttribute('label') || '')
    const [kind, setKind] = createSignal(this.getAttribute('kind') || 'text')
    const [readonly, setReadonly] = createSignal(this.hasAttribute('readonly'))
    const [disabled, setDisabled] = createSignal(this.hasAttribute('disabled'))

    const getInputType = () => {
      const k = kind()
      return ['text', 'email', 'password', 'number'].includes(k) ? k : 'text'
    }

    const onInput = (e: Event) => {
      const newValue = (e.target as HTMLInputElement).value
      setValue(newValue)
      this.setAttribute('value', newValue)
      this.dispatchEvent(new CustomEvent('value-changed', {
        detail: { value: newValue },
        bubbles: true,
        composed: true
      }))
    }

    // Observar cambios en atributos
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          const attrName = mutation.attributeName
          if (attrName === 'label') setLabel(this.getAttribute('label') || '')
          if (attrName === 'value') setValue(this.getAttribute('value') || '')
          if (attrName === 'placeholder') setPlaceholder(this.getAttribute('placeholder') || '')
          if (attrName === 'kind') setKind(this.getAttribute('kind') || 'text')
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
          }
          label {
            font-size: 0.875rem;
            font-weight: 500;
            color: #374151;
          }
          input {
            padding: 0.5rem 0.75rem;
            border: 1px solid transparent;
            border-radius: 4px;
            font-size: 0.9375rem;
            font-family: inherit;
            background: #e8eaed;
            color: #1a1a1a;
            outline: none;
            transition: border-color 0.15s;
          }
          input:focus {
            border-color: #1676f3;
          }
          input::placeholder {
            color: #737373;
          }
          :host([theme="dark"]) label {
            color: #f3f4f6;
          }
        `}</style>
        <div class="field">
          {label() && <label>{label()}</label>}
          <input
            type={getInputType()}
            value={value()}
            placeholder={placeholder()}
            readonly={readonly()}
            disabled={disabled()}
            onInput={onInput}
          />
        </div>
      </>
    )

    const shadowRoot = this.attachShadow({ mode: 'open' })
    this.dispose = render(Component, shadowRoot)
  }

  disconnectedCallback() {
    this.dispose?.()
  }

  static get observedAttributes() {
    return ['label', 'value', 'placeholder', 'kind', 'readonly', 'disabled']
  }
}

customElements.define('as-input', AsInput)
