import { render } from 'solid-js/web'
import { createSignal, For } from 'solid-js'
import { createStandardAttributes } from './attribute-observer'

class AsTime extends HTMLElement {
  private dispose?: () => void

  connectedCallback() {
    const [label, setLabel] = createSignal(this.getAttribute('label') || '')
    const [value, setValue] = createSignal(this.getAttribute('value') || '')
    const [placeholder, setPlaceholder] = createSignal(this.getAttribute('placeholder') || this.getAttribute('label') || '')
    const [theme, setTheme] = createSignal(this.getAttribute('theme') || '')
    const [readonly, setReadonly] = createSignal(this.hasAttribute('readonly'))
    const [disabled, setDisabled] = createSignal(this.hasAttribute('disabled'))
    const [open, setOpen] = createSignal(false)
    const [hour, setHour] = createSignal('12')
    const [minute, setMinute] = createSignal('00')
    const [period, setPeriod] = createSignal('AM')

    const updateValue = () => {
      let hour24 = parseInt(hour())
      if (period() === 'PM' && hour24 !== 12) hour24 += 12
      if (period() === 'AM' && hour24 === 12) hour24 = 0
      const newValue = `${hour24.toString().padStart(2, '0')}:${minute()}`
      setValue(newValue)
      this.dispatchEvent(new CustomEvent('value-changed', {
        detail: { value: newValue },
        bubbles: true,
        composed: true
      }))
    }

    const displayValue = () => {
      if (value()) {
        return value()
      }
      return placeholder() || 'Select time'
    }

    const isPlaceholder = () => !value()

    // Observar cambios en atributos usando utilidad centralizada
    createStandardAttributes(this, {
      label: [label, setLabel],
      value: [value, setValue],
      placeholder: [placeholder, setPlaceholder],
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
          .time-trigger {
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
          .time-trigger.placeholder {
            color: #6b7280;
          }
          .time-trigger:focus {
            border-color: #1676f3;
          }
          .icon {
            margin-left: 0.5rem;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }
          .icon svg {
            width: 18px;
            height: 18px;
            fill: #1f2937;
            color: #1f2937;
          }
          .dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            background: white;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            margin-top: 0.25rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10;
            padding: 0;
            width: 280px;
          }
          .time-display {
            text-align: center;
            font-size: 2.5rem;
            font-weight: 300;
            padding: 1.5rem 1rem 1rem 1rem;
            color: #1f2937;
            border-bottom: 1px solid #d1d5db;
          }
          .selectors {
            display: flex;
            height: 240px;
          }
          .column {
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
            border-right: 1px solid #d1d5db;
          }
          .column:last-child {
            border-right: none;
          }
          .period-column {
            flex: 0 0 60px;
            display: flex;
            flex-direction: column;
          }
          .option {
            padding: 0.75rem;
            cursor: pointer;
            font-size: 0.9375rem;
            color: #1f2937;
            text-align: center;
            border-bottom: 1px solid transparent;
          }
          .option:hover {
            background: #f3f4f6;
          }
          .option.selected {
            background: #e3f2fd;
            color: #1676f3;
            font-weight: 600;
          }
          .period-column .option {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            border-bottom: none;
          }
          .period-column .option.selected {
            background: #1676f3;
            color: white;
          }
          :host([theme="dark"]) label {
            color: #f3f4f6;
          }
          :host([theme="dark"]) .dropdown {
            background: #1f2937;
            border-color: #4b5563;
          }
          :host([theme="dark"]) .time-display {
            color: #f3f4f6;
            border-bottom-color: #4b5563;
          }
          :host([theme="dark"]) .column {
            border-right-color: #4b5563;
          }
          :host([theme="dark"]) .option {
            color: #e5e7eb;
          }
          :host([theme="dark"]) .option:hover {
            background: #374151;
          }
          :host([theme="dark"]) .option.selected {
            background: #1e3a5f;
            color: #60a5fa;
          }
          :host([theme="dark"]) .period-column .option.selected {
            background: #3b82f6;
            color: #ffffff;
          }
        `}</style>
        <div class="field">
          {label() && <label>{label()}</label>}
          <div
            class={`time-trigger ${isPlaceholder() ? 'placeholder' : ''}`}
            tabindex="0"
            aria-disabled={disabled()}
            onClick={() => { if (disabled() || readonly()) return; setOpen(!open()) }}
            onBlur={() => setTimeout(() => setOpen(false), 200)}
          >
            <span>{displayValue()}</span>
            <span class="icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
              </svg>
            </span>
          </div>
          {open() && (
            <div class="dropdown">
              <div class="time-display">{hour()}:{minute()} {period()}</div>
              <div class="selectors">
                <div class="column">
                  <For each={Array.from({length: 12}, (_, i) => (i + 1).toString().padStart(2, '0'))}>
                    {(h) => (
                      <div
                        class={`option ${hour() === h ? 'selected' : ''}`}
                        onClick={() => {
                          if (readonly() || disabled()) return
                          setHour(h)
                          updateValue()
                        }}
                      >
                        {h}
                      </div>
                    )}
                  </For>
                </div>
                <div class="column">
                  <For each={Array.from({length: 12}, (_, i) => (i * 5).toString().padStart(2, '0'))}>
                    {(m) => (
                      <div
                        class={`option ${minute() === m ? 'selected' : ''}`}
                        onClick={() => {
                          if (readonly() || disabled()) return
                          setMinute(m)
                          updateValue()
                        }}
                      >
                        {m}
                      </div>
                    )}
                  </For>
                </div>
                <div class="period-column">
                  <div
                    class={`option ${period() === 'AM' ? 'selected' : ''}`}
                    onClick={() => {
                      if (readonly() || disabled()) return
                      setPeriod('AM')
                      updateValue()
                    }}
                  >
                    AM
                  </div>
                  <div
                    class={`option ${period() === 'PM' ? 'selected' : ''}`}
                    onClick={() => {
                      if (readonly() || disabled()) return
                      setPeriod('PM')
                      updateValue()
                    }}
                  >
                    PM
                  </div>
                </div>
              </div>
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
    return ['label', 'value', 'placeholder', 'theme', 'readonly', 'disabled']
  }
}

customElements.define('as-time', AsTime)