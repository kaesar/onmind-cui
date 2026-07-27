import { render } from 'solid-js/web'
import { createSignal, For } from 'solid-js'
import { createStandardAttributes } from './attribute-observer'

class AsDate extends HTMLElement {
  private dispose?: () => void
  private _closeHandler?: (e: Event) => void

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

    const isPlaceholder = () => !value()

    const validateDate = (input: string) => {
      const match = input.match(/^(\d{4})-(\d{2})-(\d{2})$/)
      if (!match) return false
      const [, , m, d] = match.map(Number)
      if (m < 1 || m > 12) return false
      if (d < 1 || d > 31) return false
      return true
    }

    const handleInputChange = (e: Event) => {
      const target = e.target as HTMLInputElement
      const inputValue = target.value
      if (inputValue === '') {
        setValue('')
        return
      }
      if (validateDate(inputValue)) {
        setValue(inputValue)
        const [y, m] = inputValue.split('-').map(Number)
        setYear(y)
        setMonth(m - 1)
      }
    }

    const handleInputBlur = (e: Event) => {
      const target = e.target as HTMLInputElement
      if (target.value && !validateDate(target.value)) {
        target.value = value() || ''
      }
    }

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
          .date-trigger:focus-within {
            border-color: #1676f3;
          }
          .date-input {
            flex: 1;
            border: none;
            outline: none;
            background: transparent;
            font-family: inherit;
            font-size: 0.9375rem;
            color: #1a1a1a;
            cursor: pointer;
          }
          .date-input::placeholder {
            color: #6b7280;
          }
          .date-input:disabled {
            cursor: not-allowed;
            opacity: 0.5;
          }
          .icon {
            margin-left: 0.5rem;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            cursor: pointer;
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
            background: #1f2937;
            border-color: #4b5563;
          }
          :host([theme="dark"]) .header button {
            color: #e5e5e5;
          }
          :host([theme="dark"]) .header button:hover {
            background: #374151;
          }
          :host([theme="dark"]) .month-year {
            color: #f3f4f6;
          }
          :host([theme="dark"]) .weekday {
            color: #9ca3af;
          }
          :host([theme="dark"]) .day {
            color: #e5e7eb;
          }
          :host([theme="dark"]) .day:hover {
            background: #374151;
          }
          :host([theme="dark"]) .day.selected {
            background: #3b82f6;
            color: #ffffff;
          }
          :host([theme="dark"]) .day.other-month {
            opacity: 0.25;
          }
        `}</style>
        <div class="field">
          {label() && <label>{label()}</label>}
          <div
            class={`date-trigger ${isPlaceholder() ? 'placeholder' : ''}`}
            aria-disabled={disabled()}
          >
            <input
              type="text"
              class="date-input"
              value={value() || ''}
              placeholder={placeholder() || 'Select date'}
              readonly={readonly()}
              disabled={disabled()}
              onFocus={() => { if (!disabled() && !readonly()) setOpen(true) }}
              onBlur={(e) => { handleInputBlur(e); setOpen(false) }}
              onInput={handleInputChange}
            />
            <span class="icon" onClick={() => { if (disabled() || readonly()) return; setOpen(!open()) }}>
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

    this._closeHandler = (e: Event) => {
      if (!this.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', this._closeHandler, true)
  }

  disconnectedCallback() {
    this.dispose?.()
    if (this._closeHandler) document.removeEventListener('click', this._closeHandler, true)
  }

  static get observedAttributes() {
    return ['label', 'value', 'placeholder', 'theme', 'readonly', 'disabled']
  }
}

customElements.define('as-date', AsDate)