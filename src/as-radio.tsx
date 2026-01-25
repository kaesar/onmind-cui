import { render } from 'solid-js/web'
import { createSignal, For } from 'solid-js'
import { Abstract } from './Abstract'

class AsRadio extends HTMLElement {
  private dispose?: () => void

  connectedCallback() {
    const [label] = createSignal(this.getAttribute('label') || '')
    const [value, setValue] = createSignal(this.getAttribute('value') || '')
    const [options] = createSignal(this.getAttribute('options') || 'label=A,value=A;label=B,value=B;label=C,value=C')
    const [theme] = createSignal(this.getAttribute('theme') || '')
    const [readonly] = createSignal(this.hasAttribute('readonly'))
    const [disabled] = createSignal(this.hasAttribute('disabled'))

    const items = () => (new Abstract()).planeDeserialize(options())

    const onChange = (e: Event, itemValue: string) => {
      if (readonly()) {
        (e.target as HTMLInputElement).checked = value() === itemValue
        return
      }
      setValue((e.target as HTMLInputElement).value)
      this.dispatchEvent(new CustomEvent('value-changed', {
        detail: { value: (e.target as HTMLInputElement).value },
        bubbles: true,
        composed: true
      }))
    }

    const Component = () => (
      <>
        <style>{`
          :host {
            display: block;
            font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif;
          }
          .group {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }
          .group-label {
            font-size: 0.875rem;
            font-weight: 500;
            color: ${theme() === 'dark' ? '#f3f4f6' : '#374151'};
            margin-bottom: 0.25rem;
          }
          .options {
            display: flex;
            gap: 1rem;
          }
          .option {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
            font-size: 0.9375rem;
            color: ${theme() === 'dark' ? '#e5e5e5' : '#1f2937'};
          }
          input[type="radio"] {
            width: 16px;
            height: 16px;
            cursor: pointer;
            appearance: none;
            -webkit-appearance: none;
            border: 2px solid #d0d7de;
            border-radius: 50%;
            background: #fafafa;
            position: relative;
          }
          input[type="radio"]:checked {
            border-color: #1676f3;
          }
          input[type="radio"]:checked::after {
            content: '';
            position: absolute;
            left: 2px;
            top: 2px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #1676f3;
          }
        `}</style>
        <div class="group">
          {label() && <div class="group-label">{label()}</div>}
          <div class="options">
            <For each={items()}>
              {(item) => (
                <label class="option">
                  <input
                    type="radio"
                    name="radio-group"
                    value={item.value}
                    checked={value() === item.value}
                    disabled={disabled()}
                    readonly={readonly()}
                    onChange={(e) => onChange(e, item.value)}
                  />
                  {item.label}
                </label>
              )}
            </For>
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

  static get observedAttributes() {
    return ['label', 'value', 'options', 'theme', 'readonly', 'disabled']
  }
}

customElements.define('as-radio', AsRadio)