import { render } from 'solid-js/web'
import { createSignal } from 'solid-js'

class AsCheck extends HTMLElement {
  private dispose?: () => void

  connectedCallback() {
    const [label] = createSignal(this.getAttribute('label') || '')
    const [checked, setChecked] = createSignal(this.hasAttribute('checked'))
    const [theme] = createSignal(this.getAttribute('theme') || '')
    const [readonly] = createSignal(this.hasAttribute('readonly'))
    const [disabled] = createSignal(this.hasAttribute('disabled'))

    const onChange = (e: Event) => {
      if (readonly()) {
        (e.target as HTMLInputElement).checked = checked()
        return
      }
      const newValue = (e.target as HTMLInputElement).checked
      setChecked(newValue)
      this.dispatchEvent(new CustomEvent('checked-changed', {
        detail: { value: newValue },
        bubbles: true,
        composed: true
      }))
    }

    const Component = () => (
      <>
        <style>{`
          :host {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
            font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif;
            font-size: 0.9375rem;
            color: ${theme() === 'dark' ? '#e5e5e5' : '#1f2937'};
          }
          input[type="checkbox"] {
            width: 18px;
            height: 18px;
            cursor: pointer;
            appearance: none;
            -webkit-appearance: none;
            border: 2px solid #d0d7de;
            border-radius: 3px;
            background: #fafafa;
            position: relative;
          }
          input[type="checkbox"]:checked {
            background: #1676f3;
            border-color: #1676f3;
          }
          input[type="checkbox"]:checked::after {
            content: '';
            position: absolute;
            left: 4px;
            top: 1px;
            width: 4px;
            height: 8px;
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
          }
        `}</style>
        <input
          type="checkbox"
          checked={checked()}
          disabled={disabled()}
          readonly={readonly()}
          onChange={onChange}
        />
        {label() && <label>{label()}</label>}
      </>
    )

    const shadowRoot = this.attachShadow({ mode: 'open' })
    this.dispose = render(Component, shadowRoot)
  }

  disconnectedCallback() {
    this.dispose?.()
  }

  static get observedAttributes() {
    return ['label', 'checked', 'theme', 'readonly', 'disabled']
  }
}

customElements.define('as-check', AsCheck)