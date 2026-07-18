import { render } from 'solid-js/web'
import { createSignal } from 'solid-js'
import { createStandardAttributes } from './attribute-observer'

class AsText extends HTMLElement {
  private dispose?: () => void

  connectedCallback() {
    const [label, setLabel] = createSignal(this.getAttribute('label') || '')
    const [value, setValue] = createSignal(this.getAttribute('value') || '')
    const [placeholder, setPlaceholder] = createSignal(this.getAttribute('placeholder') || this.getAttribute('label') || '')
    const [rows, setRows] = createSignal(parseInt(this.getAttribute('rows') || '3'))
    const [theme, setTheme] = createSignal(this.getAttribute('theme') || '')
    const [readonly, setReadonly] = createSignal(this.hasAttribute('readonly'))
    const [disabled, setDisabled] = createSignal(this.hasAttribute('disabled'))

    const onInput = (e: Event) => {
      if (readonly()) return
      const newValue = (e.target as HTMLTextAreaElement).value
      setValue(newValue)
      this.dispatchEvent(new CustomEvent('value-changed', {
        detail: { value: newValue },
        bubbles: true,
        composed: true
      }))
    }

    // Observar cambios en atributos usando utilidad centralizada
    createStandardAttributes(this, {
      label: [label, setLabel],
      value: [value, setValue],
      placeholder: [placeholder, setPlaceholder],
      rows: [rows, setRows],
      theme: [theme, setTheme],
      readonly: { setter: setReadonly, isBoolean: true },
      disabled: { setter: setDisabled, isBoolean: true }
    })

    const Component = () => (
      <>
        <style>{`
          :host {
            display: block;
            font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif;
          }
          .field {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }
          label {
            font-size: 0.875rem;
            font-weight: 500;
            color: #374151;
          }
          textarea {
            padding: 0.5rem 0.75rem;
            border: 1px solid transparent;
            border-radius: 4px;
            font-size: 0.9375rem;
            font-family: inherit;
            background: #e8eaed;
            color: #1a1a1a;
            outline: none;
            resize: vertical;
            transition: border-color 0.15s;
          }
          textarea:focus {
            border-color: #1676f3;
          }
          textarea::placeholder {
            color: #737373;
          }
          :host([theme="dark"]) label {
            color: #f3f4f6;
          }
        `}</style>
        <div class="field">
          {label() && <label>{label()}</label>}
          <textarea
            rows={rows()}
            placeholder={placeholder()}
            value={value()}
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
    return ['label', 'value', 'placeholder', 'rows', 'theme', 'readonly', 'disabled']
  }
}

customElements.define('as-text', AsText)