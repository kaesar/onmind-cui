import { render } from 'solid-js/web'
import { createSignal, For } from 'solid-js'
import { Abstract } from './Abstract'

class AsSelect extends HTMLElement {
  private dispose?: () => void
  private _value: string = ''

  connectedCallback() {
    this._value = this._value || this.getAttribute('value') || ''

    const [label, setLabel] = createSignal(this.getAttribute('label') || '')
    const [value, setValue] = createSignal(this._value)
    const [options, setOptions] = createSignal(this.getAttribute('options') || 'label=A,value=A;label=B,value=B;label=C,value=C')
    const [readonly, setReadonly] = createSignal(this.hasAttribute('readonly'))
    const [disabled, setDisabled] = createSignal(this.hasAttribute('disabled'))
    const [open, setOpen] = createSignal(false)

    const items = () => (new Abstract()).planeDeserialize(options())
    const selectedItem = () => items().find(i => i.value === value()) || items()[0]

    const selectOption = (item: any) => {
      if (readonly()) return
      this._value = item.value
      setValue(item.value)
      this.setAttribute('value', item.value)
      setOpen(false)
      this.dispatchEvent(new CustomEvent('value-changed', {
        detail: { value: item.value },
        bubbles: true,
        composed: true
      }))
    }

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
          if (attrName === 'options') setOptions(this.getAttribute('options') || '')
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
            font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif;
            position: relative;
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
          /* Match as-event: light trigger surface regardless of theme */
          .select-trigger {
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
          .select-trigger:focus {
            border-color: #1676f3;
          }
          .select-trigger[aria-disabled="true"] {
            opacity: 0.5;
            cursor: not-allowed;
            background: #f3f4f6;
          }
          .arrow {
            margin-left: 0.5rem;
            width: 20px;
            height: 20px;
            transition: transform 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }
          .arrow.open {
            transform: rotate(180deg);
          }
          /* Light trigger → dark chevron for contrast (same as as-event) */
          .arrow svg {
            width: 20px;
            height: 20px;
            color: #1f2937;
            stroke: #1f2937;
          }
          .dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            max-height: 200px;
            overflow-y: auto;
            background: white;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            margin-top: 0.25rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10;
          }
          .option {
            padding: 0.5rem 0.75rem;
            cursor: pointer;
            font-size: 0.9375rem;
            color: #1f2937;
          }
          .option:hover {
            background: #f3f4f6;
          }
          .option.selected {
            background: #e0f2fe;
          }
          :host([theme="dark"]) label {
            color: #f3f4f6;
          }
        `}</style>
        <div class="field">
          {label() && <label>{label()}</label>}
          <div
            class="select-trigger"
            tabindex={disabled() ? '-1' : '0'}
            aria-disabled={disabled()}
            onClick={() => { if (disabled() || readonly()) return; setOpen(!open()) }}
            onBlur={() => setTimeout(() => setOpen(false), 200)}
          >
            <span>{selectedItem()?.label || ''}</span>
            <span class={`arrow ${open() ? 'open' : ''}`}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                <path d="M7 10l5 5 5-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </div>
          {open() && (
            <div class="dropdown">
              <For each={items()}>
                {(item) => (
                  <div
                    class={`option ${value() === item.value ? 'selected' : ''}`}
                    onClick={() => selectOption(item)}
                  >
                    {item.label}
                  </div>
                )}
              </For>
            </div>
          )}
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
    return ['label', 'value', 'options', 'theme', 'readonly', 'disabled']
  }
}

customElements.define('as-select', AsSelect)