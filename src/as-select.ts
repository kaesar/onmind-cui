import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { Item, Abstract } from './Abstract'

@customElement('as-select')
export class AsSelect extends LitElement {
    @property({ type: String })
    label = ''
    @property({ type: String })
    value = ''
    @property({ type: String })
    options = 'label=A,value=A;label=B,value=B;label=C,value=C'
    @property({ type: String })
    theme = ''
    @state()
    private accessor _open = false
    @property({ type: Array })
    get items(): Item[] {
        let data: Item[] = (new Abstract()).planeDeserialize(this.options)
        return data.map((option: Item) => ({ label: option.label, value: option.value }))
    }

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
      .select-trigger {
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
      .select-trigger:focus {
        border-color: var(--focus-color, #1676f3);
      }
      .arrow {
        margin-left: 0.5rem;
        width: 20px;
        height: 20px;
        transition: transform 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .arrow.open {
        transform: rotate(180deg);
      }
      svg {
        width: 20px;
        height: 20px;
        color: var(--text-color, #1f2937);
      }
      .dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        max-height: 200px;
        overflow-y: auto;
        background: var(--dropdown-bg, white);
        border: 1px solid var(--border-color, #d1d5db);
        border-radius: 4px;
        margin-top: 0.25rem;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10;
      }
      .option {
        padding: 0.5rem 0.75rem;
        cursor: pointer;
        font-size: 0.9375rem;
        color: var(--text-color, #1f2937);
      }
      .option:hover {
        background: var(--option-hover, #f3f4f6);
      }
      .option.selected {
        background: var(--option-selected, #e0f2fe);
      }
      :host([theme="dark"]) {
        --label-color: #e5e5e5;
        --border-color: #525252;
        --input-bg: #1f2937;
        --text-color: #e5e5e5;
        --focus-color: #1676f3;
        --dropdown-bg: #262626;
        --option-hover: #404040;
        --option-selected: #1e3a5f;
      }
    `
  
    protected override render() {
        const selectedItem = this.items.find(i => i.value === this.value) || this.items[0]
        return html`
        <div class="field">
            ${this.label ? html`<label>${this.label}</label>` : ''}
            <div
                class="select-trigger"
                tabindex="0"
                @click="${() => this._open = !this._open}"
                @blur="${() => setTimeout(() => this._open = false, 200)}"
            >
                <span>${selectedItem?.label || ''}</span>
                <span class="arrow ${this._open ? 'open' : ''}">
                    <svg viewBox="0 0 24 24">
                        <path d="M7 10l5 5 5-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </span>
            </div>
            ${this._open ? html`
                <div class="dropdown">
                    ${this.items.map(item => html`
                        <div
                            class="option ${this.value === item.value ? 'selected' : ''}"
                            @click="${() => {
                                this.value = item.value
                                this._open = false
                                this.dispatchEvent(new CustomEvent('value-changed', {
                                    detail: { value: this.value },
                                    bubbles: true,
                                    composed: true
                                }))
                            }}"
                        >
                            ${item.label}
                        </div>
                    `)}
                </div>
            ` : ''}
        </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
      'as-select': AsSelect
    }
}
