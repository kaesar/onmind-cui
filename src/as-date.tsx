import { render } from 'solid-js/web'
import { createSignal, For } from 'solid-js'
import { createStandardAttributes } from './attribute-observer'

class AsDate extends HTMLElement {
  private dispose?: () => void

  connectedCallback() {
    const [label, setLabel] = createSignal(this.getAttribute('label') || '')
    const [value, setValue] = createSignal(this.getAttribute('value') || '')
    const [placeholder, setPlaceholder] = createSignal(this.getAttribute('placeholder') || this.getAttribute('label') || '')
    const [theme, setTheme] = createSignal(this.getAttribute('theme') || '')
    const [readonly, setReadonly] = createSignal(this.hasAttribute('readonly'))
    const [disabled, setDisabled] = createSignal(this.hasAttribute('disabled'))
    const [open, setOpen] = createSignal(false)
    const [year, setYear] = createSignal(new Date().getFullYear())
    const [month, setMonth] = createSignal(new Date().getMonth())

    const getMonthName = () => {
      return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][month()]
    }

    const changeMonth = (delta: number) => {
      const newMonth = month() + delta
      if (newMonth < 0) { 
        setMonth(11)
        setYear(year() - 1)
      } else if (newMonth > 11) { 
        setMonth(0)
        setYear(year() + 1)
      } else {
        setMonth(newMonth)
      }
    }

    // Observar cambios en atributos usando utilidad centralizada
    createStandardAttributes(this, {
      label: [label, setLabel],
      value: [value, setValue],
      placeholder: [placeholder, setPlaceholder],
      theme: [theme, setTheme],
      readonly: { setter: setReadonly, isBoolean: true },
      disabled: { setter: setDisabled, isBoolean: true }
    })

    const getDays = () => {
      const firstDay = new Date(year(), month(), 1).getDay()
      const daysInMonth = new Date(year(), month() + 1, 0).getDate()
      const prevMonthDays = new Date(year(), month(), 0).getDate()
      const days: any[] = []
      
      for (let i = firstDay - 1; i >= 0; i--) {
        days.push({ day: prevMonthDays - i, otherMonth: true, date: null })
      }
      
      for (let i = 1; i <= daysInMonth; i++) {
        const date = `${year()}-${String(month() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
        days.push({ day: i, otherMonth: false, selected: value() === date, date })
      }
      
      const remaining = 42 - days.length
      for (let i = 1; i <= remaining; i++) {
        days.push({ day: i, otherMonth: true, date: null })
      }
      
      return days
    }

    const selectDay = (date: string | null) => {
      if (!date || readonly() || disabled()) return
      setValue(date)
      setOpen(false)
      this.dispatchEvent(new CustomEvent('value-changed', {
        detail: { value: date },
        bubbles: true,
        composed: true
      }))
    }

    const displayValue = () => {
      if (value()) {
        return value()
      }
      return placeholder() || 'Select date'
    }

    const isPlaceholder = () => !value()

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
          .date-trigger {
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
          .date-trigger.placeholder {
            color: #6b7280;
          }
          .date-trigger:focus {
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
            padding: 0.5rem;
            min-width: 280px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
            padding: 0.25rem;
          }
          .header button {
            background: none;
            border: none;
            cursor: pointer;
            padding: 0.25rem 0.5rem;
            color: #1f2937;
            font-size: 1.125rem;
            border-radius: 4px;
          }
          .header button:hover {
            background: #f3f4f6;
          }
          .month-year {
            font-weight: 500;
            font-size: 0.9375rem;
            color: #1f2937;
          }
          .weekdays {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 2px;
            margin-bottom: 2px;
          }
          .weekday {
            text-align: center;
            font-size: 0.75rem;
            font-weight: 500;
            padding: 0.25rem;
            opacity: 0.6;
            color: #1f2937;
          }
          .days {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 2px;
          }
          .day {
            text-align: center;
            padding: 0.5rem;
            cursor: pointer;
            border-radius: 4px;
            font-size: 0.875rem;
            color: #1f2937;
          }
          .day:hover {
            background: #f3f4f6;
          }
          .day.selected {
            background: #1676f3;
            color: white;
          }
          .day.other-month {
            opacity: 0.3;
          }
          :host([theme="dark"]) label {
            color: #f3f4f6;
          }
          :host([theme="dark"]) .dropdown {
            background: #262626;
            border-color: #525252;
          }
          :host([theme="dark"]) .header button {
            color: #e5e5e5;
          }
          :host([theme="dark"]) .header button:hover {
            background: #404040;
          }
          :host([theme="dark"]) .month-year {
            color: #e5e5e5;
          }
          :host([theme="dark"]) .weekday {
            color: #e5e5e5;
          }
          :host([theme="dark"]) .day {
            color: #e5e5e5;
          }
          :host([theme="dark"]) .day:hover {
            background: #404040;
          }
        `}</style>
        <div class="field">
          {label() && <label>{label()}</label>}
          <div
            class={`date-trigger ${isPlaceholder() ? 'placeholder' : ''}`}
            tabindex="0"
            aria-disabled={disabled()}
            onClick={() => { if (disabled() || readonly()) return; setOpen(!open()) }}
            onBlur={() => setTimeout(() => setOpen(false), 200)}
          >
            <span>{displayValue()}</span>
            <span class="icon">
              <svg viewBox="0 0 24 24">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
              </svg>
            </span>
          </div>
          {open() && (
            <div class="dropdown" onMouseDown={(e) => e.preventDefault()}>
              <div class="header">
                <button onClick={() => { if (readonly() || disabled()) return; changeMonth(-1) }}>‹</button>
                <div class="month-year">{getMonthName()} {year()}</div>
                <button onClick={() => { if (readonly() || disabled()) return; changeMonth(1) }}>›</button>
              </div>
              <div class="weekdays">
                <For each={['S', 'M', 'T', 'W', 'T', 'F', 'S']}>
                  {(d) => <div class="weekday">{d}</div>}
                </For>
              </div>
              <div class="days">
                <For each={getDays()}>
                  {(day) => (
                    <div
                      class={`day ${day.selected ? 'selected' : ''} ${day.otherMonth ? 'other-month' : ''}`}
                      onClick={() => selectDay(day.date)}
                    >
                      {day.day}
                    </div>
                  )}
                </For>
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

customElements.define('as-date', AsDate)