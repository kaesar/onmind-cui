import { render } from 'solid-js/web'
import { createSignal } from 'solid-js'
import { createStandardAttributes } from './attribute-observer'

class AsSwitch extends HTMLElement {
  private dispose?: () => void

  connectedCallback() {
    const [label, setLabel] = createSignal(this.getAttribute('label') || '')
    const [checked, setChecked] = createSignal(this.hasAttribute('checked'))
    const [theme, setTheme] = createSignal(this.getAttribute('theme') || '')
    const [readonly, setReadonly] = createSignal(this.hasAttribute('readonly'))
    const [disabled, setDisabled] = createSignal(this.hasAttribute('disabled'))

    const onClick = () => {
      if (disabled() || readonly()) return
      const newValue = !checked()
      setChecked(newValue)
      this.dispatchEvent(new CustomEvent('checked-changed', {
        detail: { value: newValue },
        bubbles: true,
        composed: true
      }))
    }

    // Observar cambios en atributos usando utilidad centralizada
    createStandardAttributes(this, {
      label: [label, setLabel],
      checked: { setter: setChecked, isBoolean: true },
      theme: [theme, setTheme],
      readonly: { setter: setReadonly, isBoolean: true },
      disabled: { setter: setDisabled, isBoolean: true }
    })

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
          .switch {
            position: relative;
            width: 36px;
            height: 20px;
            background: ${theme() === 'dark' ? '#525252' : '#e8eaed'};
            border-radius: 10px;
            transition: background 0.2s;
            cursor: pointer;
          }
          .switch.checked {
            background: #1676f3;
          }
          .switch::after {
            content: '';
            position: absolute;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: white;
            top: 2px;
            left: 2px;
            transition: transform 0.2s;
          }
          .switch.checked::after {
            transform: translateX(16px);
          }
        `}</style>
        <div
          class={`switch ${checked() ? 'checked' : ''}`}
          aria-disabled={disabled()}
          onClick={onClick}
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

customElements.define('as-switch', AsSwitch)