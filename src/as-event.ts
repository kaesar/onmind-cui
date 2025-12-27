import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('as-event')
export class AsEvent extends LitElement {
    @property({ type: String })
    label = ''
    @property({ type: String })
    value = ''
    @property({ type: String })
    placeholder = ''
    @property({ type: String })
    event = 'event-trigger'
    @property({ type: String })
    theme = ''
    @property({ type: Boolean })
    readonly = false
    @property({ type: Boolean })
    disabled = false

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
      .event-trigger {
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
      .event-trigger .placeholder {
        color: var(--placeholder-color, #9ca3af);
      }
      .event-trigger:focus {
        border-color: var(--focus-color, #1676f3);
      }
      .event-trigger:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background: var(--disabled-bg, #f3f4f6);
      }
      .event-trigger.readonly {
        cursor: default;
        background: var(--readonly-bg, #f9fafb);
      }
      .arrow {
        margin-left: 0.5rem;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      svg {
        width: 20px;
        height: 20px;
        color: var(--text-color, #1f2937);
      }
      :host([theme="dark"]) {
        --label-color: #f3f4f6;
        --border-color: #525252;
        --input-bg: #374151;
        --text-color: #e5e5e5;
        --focus-color: #1676f3;
        --placeholder-color: #6b7280;
      }
    `
  
    protected override render() {
        const displayValue = this.value || this.placeholder || ''
        const isPlaceholder = !this.value && this.placeholder
        return html`
        <div class="field">
            ${this.label ? html`<label>${this.label}</label>` : ''}
            <div
                class="event-trigger ${this.readonly ? 'readonly' : ''}"
                tabindex="${this.disabled ? '-1' : '0'}"
                ?disabled="${this.disabled}"
                @click="${this._handleClick}"
                @keydown="${this._handleKeydown}"
            >
                <span class="${isPlaceholder ? 'placeholder' : ''}">${displayValue}</span>
                <span class="arrow">
                    <svg viewBox="0 0 24 24">
                        <path d="M7 10l5 5 5-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </span>
            </div>
        </div>
        `
    }

    private _handleClick() {
        if (this.disabled || this.readonly) return
        this.dispatchEvent(new CustomEvent(this.event, {
            detail: { value: this.value },
            bubbles: true,
            composed: true
        }))
    }

    private _handleKeydown(e: KeyboardEvent) {
        if (this.disabled || this.readonly) return
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            this._handleClick()
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
      'as-event': AsEvent
    }
}
