import { render } from 'solid-js/web'
import { createSignal, For } from 'solid-js'
import { Abstract } from './Abstract'

class AsComplete extends HTMLElement {
  private dispose?: () => void

  connectedCallback() {
    const [label] = createSignal(this.getAttribute('label') || '')
    const [, setValue] = createSignal(this.getAttribute('value') || '')
    const [options] = createSignal(this.getAttribute('options') || 'label=A,value=A;label=B,value=B;label=C,value=C')
    const [theme] = createSignal(this.getAttribute('theme') || '')
    const [readonly] = createSignal(this.hasAttribute('readonly'))
    const [disabled] = createSignal(this.hasAttribute('disabled'))
    const [filter, setFilter] = createSignal('')
    const [open, setOpen] = createSignal(false)

    const items = () => (new Abstract()).planeDeserialize(options())
    const filtered = () => filter() 
      ? items().filter(i => i.label.toLowerCase().includes(filter().toLowerCase()))
      : items()

    const onInput = (e: Event) => {
      const newFilter = (e.target as HTMLInputElement).value
      setFilter(newFilter)
      setOpen(true)
    }

    const selectOption = (item: any) => {
      setValue(item.value)
      setFilter(item.label)
      setOpen(false)
      this.dispatchEvent(new CustomEvent('value-changed', {
        detail: { value: item.value },
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
            position: relative;
          }
          label {
            font-size: 0.875rem;
            font-weight: 500;
            color: ${theme() === 'dark' ? '#f3f4f6' : '#374151'};
          }
          input {
            padding: 0.5rem 0.75rem;
            border: 1px solid transparent;
            border-radius: 4px;
            font-size: 0.9375rem;
            font-family: inherit;
            background: ${theme() === 'dark' ? '#374151' : '#e8eaed'};
            color: ${theme() === 'dark' ? '#e5e5e5' : '#1a1a1a'};
            outline: none;
            transition: border-color 0.15s;
          }
          input:focus {
            border-color: #1676f3;
          }
          .dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            max-height: 200px;
            overflow-y: auto;
            background: ${theme() === 'dark' ? '#262626' : 'white'};
            border: 1px solid ${theme() === 'dark' ? '#525252' : '#d1d5db'};
            border-radius: 4px;
            margin-top: 0.25rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10;
          }
          .option {
            padding: 0.5rem 0.75rem;
            cursor: pointer;
            font-size: 0.9375rem;
            color: ${theme() === 'dark' ? '#e5e5e5' : '#1f2937'};
          }
          .option:hover {
            background: ${theme() === 'dark' ? '#404040' : '#f3f4f6'};
          }
        `}</style>
        <div class="field">
          {label() && <label>{label()}</label>}
          <input
            type="text"
            value={filter()}
            placeholder={label() || 'Buscar...'}
            readonly={readonly()}
            disabled={disabled()}
            onInput={onInput}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 200)}
          />
          {open() && filtered().length > 0 && (
            <div class="dropdown">
              <For each={filtered()}>
                {(item) => (
                  <div class="option" onClick={() => selectOption(item)}>
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

  static get observedAttributes() {
    return ['label', 'value', 'options', 'theme', 'readonly', 'disabled']
  }
}

customElements.define('as-complete', AsComplete)