import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { Item, Abstract } from './Abstract'

@customElement('as-complete')
export class AsComplete extends LitElement {
    @property({ type: String })
    label = ''
    @property({ type: String })
    value = ''
    @property({ type: String })
    options = 'label=A,value=A;label=B,value=B;label=C,value=C'
    @property({ type: String })
    theme = ''
    @state()
    private accessor _filter = ''
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
      input {
        padding: 0.5rem 0.75rem;
        border: 1px solid transparent;
        border-radius: 4px;
        font-size: 0.9375rem;
        font-family: inherit;
        background: var(--input-bg, #e8eaed);
        color: var(--text-color, #1a1a1a);
        outline: none;
        transition: border-color 0.15s;
      }
      input:focus {
        border-color: var(--focus-color, #1676f3);
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
      :host([theme="dark"]) {
        --label-color: #e5e5e5;
        --border-color: #525252;
        --input-bg: #1f2937;
        --text-color: #e5e5e5;
        --focus-color: #1676f3;
        --dropdown-bg: #262626;
        --option-hover: #404040;
      }
    `
  
    protected override render() {
        const filtered = this._filter
            ? this.items.filter(i => i.label.toLowerCase().includes(this._filter.toLowerCase()))
            : this.items
        return html`
        <div class="field">
            ${this.label ? html`<label>${this.label}</label>` : ''}
            <input
                type="text"
                .value="${this._filter}"
                placeholder="${this.label || 'Buscar...'}"
                @input="${(e: Event) => {
                    this._filter = (e.target as HTMLInputElement).value
                    this._open = true
                }}"
                @focus="${() => this._open = true}"
                @blur="${() => setTimeout(() => this._open = false, 200)}"
            />
            ${this._open && filtered.length ? html`
                <div class="dropdown">
                    ${filtered.map(item => html`
                        <div class="option" @click="${() => {
                            this.value = item.value
                            this._filter = item.label
                            this._open = false
                            this.dispatchEvent(new CustomEvent('value-changed', {
                                detail: { value: this.value },
                                bubbles: true,
                                composed: true
                            }))
                        }}">
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
      'as-complete': AsComplete
    }
}
