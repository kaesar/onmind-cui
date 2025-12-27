import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

@customElement('as-date')
export class AsDate extends LitElement {
    @property({ type: String })
    label = ''
    @property({ type: String })
    value = ''
    @property({ type: String })
    placeholder = this.label
    @property({ type: String })
    theme = ''
    @property({ type: Boolean, reflect: true })
    readonly = false
    @property({ type: Boolean, reflect: true })
    disabled = false
    @state()
    private accessor _open = false
    @state()
    private accessor _year = new Date().getFullYear()
    @state()
    private accessor _month = new Date().getMonth()

    static styles = css`
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
        color: var(--label-color, #374151);
      }
      .date-trigger {
        padding: 0.5rem 0.75rem;
        border: 1px solid transparent;
        border-radius: 4px;
        font-size: 0.9375rem;
        font-family: inherit;
        background: var(--input-bg, #e8eaed);
        color: var(--text-color, #1a1a1a);
        outline: none;
        cursor: pointer;
        transition: border-color 0.15s;
        display: flex;
        justify-content: space-between;
        align-items: center;
        user-select: none;
      }
      .date-trigger .placeholder {
        color: var(--placeholder-color, #9ca3af);
      }
      .date-trigger:focus {
        border-color: var(--focus-color, #1676f3);
      }
      .icon {
        margin-left: 0.5rem;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      svg {
        width: 18px;
        height: 18px;
        fill: var(--text-color, #1f2937);
      }
      .dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        background: var(--dropdown-bg, white);
        border: 1px solid var(--border-color, #d1d5db);
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
        color: var(--text-color, #1f2937);
        font-size: 1.125rem;
        border-radius: 4px;
      }
      .header button:hover {
        background: var(--option-hover, #f3f4f6);
      }
      .month-year {
        font-weight: 500;
        font-size: 0.9375rem;
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
        color: var(--text-color, #1f2937);
        opacity: 0.6;
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
        color: var(--text-color, #1f2937);
      }
      .day:hover {
        background: var(--option-hover, #f3f4f6);
      }
      .day.selected {
        background: var(--option-selected, #1676f3);
        color: white;
      }
      .day.other-month {
        opacity: 0.3;
      }
      :host([theme="dark"]) {
        --label-color: #f3f4f6;
        --border-color: #525252;
        --input-bg: #374151;
        --text-color: #e5e5e5;
        --focus-color: #1676f3;
        --dropdown-bg: #262626;
        --option-hover: #404040;
        --option-selected: #1676f3;
        --placeholder-color: #6b7280;
      }
    `

    protected override render() {
        const displayValue = this.value || this.placeholder || 'YYYY-MM-DD'
        const isPlaceholder = !this.value
        return html`
        <div class="field">
            ${this.label ? html`<label>${this.label}</label>` : ''}
            <div
              class="date-trigger"
              tabindex="0"
              ?aria-disabled=${this.disabled}
              @click="${() => { if (this.disabled || this.readonly) return; this._open = !this._open }}"
              @blur="${() => setTimeout(() => this._open = false, 200)}"
            >
                <span class="${isPlaceholder ? 'placeholder' : ''}">${displayValue}</span>
                <span class="icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
                    </svg>
                </span>
            </div>
            ${this._open ? html`
                <div class="dropdown" @mousedown="${(e: Event) => e.preventDefault()}">
                    <div class="header">
                    <button @click="${() => { if (this.readonly || this.disabled) return; this._changeMonth(-1) }}">‹</button>
                    <div class="month-year">${this._getMonthName()} ${this._year}</div>
                    <button @click="${() => { if (this.readonly || this.disabled) return; this._changeMonth(1) }}">›</button>
                  </div>
                    <div class="weekdays">
                        ${['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => html`<div class="weekday">${d}</div>`)}
                    </div>
                    <div class="days">
                        ${this._getDays().map(day => html`
                            <div
                              class="day ${day.selected ? 'selected' : ''} ${day.otherMonth ? 'other-month' : ''}"
                              @click="${() => { if (this.readonly || this.disabled) return; this._selectDay(day.date) }}"
                            >
                                ${day.day}
                            </div>
                        `)}
                    </div>
                </div>
            ` : ''}
        </div>`
    }

    private _getMonthName() {
        return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][this._month]
    }

    private _changeMonth(delta: number) {
        this._month += delta
        if (this._month < 0) { this._month = 11; this._year-- }
        if (this._month > 11) { this._month = 0; this._year++ }
    }

    private _getDays() {
        const firstDay = new Date(this._year, this._month, 1).getDay()
        const daysInMonth = new Date(this._year, this._month + 1, 0).getDate()
        const prevMonthDays = new Date(this._year, this._month, 0).getDate()
        const days: any[] = []
        
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({ day: prevMonthDays - i, otherMonth: true, date: null })
        }
        
        for (let i = 1; i <= daysInMonth; i++) {
            const date = `${this._year}-${String(this._month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
            days.push({ day: i, otherMonth: false, selected: this.value === date, date })
        }
        
        const remaining = 42 - days.length
        for (let i = 1; i <= remaining; i++) {
            days.push({ day: i, otherMonth: true, date: null })
        }
        
        return days
    }

    private _selectDay(date: string | null) {
        if (!date) return
        this.value = date
        this._open = false
        this.dispatchEvent(new CustomEvent('value-changed', {
            detail: { value: this.value },
            bubbles: true,
            composed: true
        }))
    }
}

declare global {
    interface HTMLElementTagNameMap {
      'as-date': AsDate
    }
}
