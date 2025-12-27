import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

@customElement('as-time')
export class AsTime extends LitElement {
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
    private accessor _hour = '12'
    @state()
    private accessor _minute = '00'
    @state()
    private accessor _period = 'AM'

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
      .time-trigger {
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
      .time-trigger .placeholder {
        color: var(--placeholder-color, #9ca3af);
      }
      .time-trigger:focus {
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
        padding: 0;
        width: 280px;
      }
      .time-display {
        text-align: center;
        font-size: 2.5rem;
        font-weight: 300;
        padding: 1.5rem 1rem 1rem 1rem;
        color: var(--text-color, #1f2937);
        border-bottom: 1px solid var(--border-color, #d1d5db);
      }
      .selectors {
        display: flex;
        height: 240px;
      }
      .column {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        border-right: 1px solid var(--border-color, #d1d5db);
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
        color: var(--text-color, #1f2937);
        text-align: center;
        border-bottom: 1px solid transparent;
      }
      .option:hover {
        background: var(--option-hover, #f3f4f6);
      }
      .option.selected {
        background: var(--option-selected, #e3f2fd);
        color: var(--selected-text, #1676f3);
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
        background: var(--option-selected, #1676f3);
        color: white;
      }
      :host([theme="dark"]) {
        --label-color: #f3f4f6;
        --border-color: #525252;
        --input-bg: #374151;
        --text-color: #e5e5e5;
        --focus-color: #1676f3;
        --dropdown-bg: #262626;
        --option-hover: #404040;
        --option-selected: #1e3a5f;
        --placeholder-color: #6b7280;
      }
    `

    protected override render() {
        const displayValue = this.value || this.placeholder || 'HH:MM'
        const isPlaceholder = !this.value
        return html`
        <div class="field">
            ${this.label ? html`<label>${this.label}</label>` : ''}
            <div
              class="time-trigger"
              tabindex="0"
              ?aria-disabled=${this.disabled}
              @click="${() => { if (this.disabled || this.readonly) return; this._open = !this._open }}"
              @blur="${() => setTimeout(() => this._open = false, 200)}"
            >
                <span class="${isPlaceholder ? 'placeholder' : ''}">${displayValue}</span>
                <span class="icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
                    </svg>
                </span>
            </div>
            ${this._open ? html`
                <div class="dropdown">
                    <div class="time-display">${this._hour}:${this._minute} ${this._period}</div>
                    <div class="selectors">
                        <div class="column">
                            ${Array.from({length: 12}, (_, i) => {
                                const h = (i + 1).toString().padStart(2, '0')
                                return html`
                                    <div
                                      class="option ${this._hour === h ? 'selected' : ''}"
                                      @click="${() => {
                                        if (this.readonly || this.disabled) return
                                        this._hour = h
                                        this._updateValue()
                                      }}"
                                    >
                                        ${h}
                                    </div>
                                `
                            })}
                        </div>
                        <div class="column">
                            ${Array.from({length: 12}, (_, i) => {
                                const m = (i * 5).toString().padStart(2, '0')
                                return html`
                                    <div
                                      class="option ${this._minute === m ? 'selected' : ''}"
                                      @click="${() => {
                                        if (this.readonly || this.disabled) return
                                        this._minute = m
                                        this._updateValue()
                                      }}"
                                    >
                                        ${m}
                                    </div>
                                `
                            })}
                        </div>
                        <div class="period-column">
                            <div
                                class="option ${this._period === 'AM' ? 'selected' : ''}"
                                @click="${() => {
                                    if (this.readonly || this.disabled) return
                                    this._period = 'AM'
                                    this._updateValue()
                                  }}"
                            >
                                AM
                            </div>
                            <div
                                class="option ${this._period === 'PM' ? 'selected' : ''}"
                                @click="${() => {
                                    if (this.readonly || this.disabled) return
                                    this._period = 'PM'
                                    this._updateValue()
                                  }}"
                            >
                                PM
                            </div>
                        </div>
                    </div>
                </div>
            ` : ''}
        </div>`
    }

    private _updateValue() {
        let hour24 = parseInt(this._hour)
        if (this._period === 'PM' && hour24 !== 12) hour24 += 12
        if (this._period === 'AM' && hour24 === 12) hour24 = 0
        this.value = `${hour24.toString().padStart(2, '0')}:${this._minute}`
        this.dispatchEvent(new CustomEvent('value-changed', {
            detail: { value: this.value },
            bubbles: true,
            composed: true
        }))
    }
}

declare global {
    interface HTMLElementTagNameMap {
      'as-time': AsTime
    }
}
