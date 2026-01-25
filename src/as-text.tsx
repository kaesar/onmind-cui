import { render } from 'solid-js/web'
import { createSignal } from 'solid-js'

class AsText extends HTMLElement {
  private dispose?: () => void

  connectedCallback() {
    const [label] = createSignal(this.getAttribute('label') || '')
    const [value, setValue] = createSignal(this.getAttribute('value') || '')
    const [placeholder] = createSignal(this.getAttribute('placeholder') || this.getAttribute('label') || '')
    const [rows] = createSignal(parseInt(this.getAttribute('rows') || '3'))
    const [theme] = createSignal(this.getAttribute('theme') || '')
    const [readonly] = createSignal(this.hasAttribute('readonly'))
    const [disabled] = createSignal(this.hasAttribute('disabled'))

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

    const Component = () => (
      <>
        <style>{`
          .field {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif;
          }
          label {
            font-size: 0.875rem;
            font-weight: 500;
            color: ${theme() === 'dark' ? '#f3f4f6' : '#374151'};
          }
          textarea {
            padding: 0.5rem 0.75rem;
            border: 1px solid transparent;
            border-radius: 4px;
            font-size: 0.9375rem;
            font-family: inherit;
            background: ${theme() === 'dark' ? '#374151' : '#e8eaed'};
            color: ${theme() === 'dark' ? '#e5e5e5' : '#1a1a1a'};
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