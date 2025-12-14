import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { Item, Abstract } from './Abstract'

@customElement('as-radio')
export class AsRadio extends LitElement {
    @property({ type: String })
    label = ''
    @property({ type: String })
    value = ''
    @property({ type: String })
    options = 'label=A,value=A;label=B,value=B;label=C,value=C'
    @property({ type: String })
    theme = ''
    @property({ type: Array })
    get items(): Item[] {
        let data: Item[] = (new Abstract()).planeDeserialize(this.options)
        return data.map((option: Item) => ({ label: option.label, value: option.value }))
    }

    static styles = css`
      :host {
        display: block;
        font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif;
      }
      .group {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      .group-label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--label-color, #374151);
        margin-bottom: 0.25rem;
      }
      .options {
        display: flex;
        gap: 1rem;
      }
      .option {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        font-size: 0.9375rem;
        color: var(--text-color, #1f2937);
      }
      input[type="radio"] {
        width: 16px;
        height: 16px;
        cursor: pointer;
        appearance: none;
        -webkit-appearance: none;
        border: 2px solid var(--radio-border, #d0d7de);
        border-radius: 50%;
        background: var(--radio-bg, #fafafa);
        position: relative;
      }
      input[type="radio"]:checked {
        border-color: var(--accent-color, #1676f3);
      }
      input[type="radio"]:checked::after {
        content: '';
        position: absolute;
        left: 2px;
        top: 2px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--accent-color, #1676f3);
      }
      :host([theme="dark"]) {
        --label-color: #e5e5e5;
        --text-color: #e5e5e5;
        --accent-color: #1676f3;
      }
    `

    protected override render() {
        return html`
        <div class="group">
            ${this.label ? html`<div class="group-label">${this.label}</div>` : ''}
            <div class="options">
                ${this.items.map(item => html`
                    <label class="option">
                        <input
                            type="radio"
                            name="radio-group"
                            .value="${item.value}"
                            ?checked="${this.value === item.value}"
                            @change="${(e: Event) => {
                                this.value = (e.target as HTMLInputElement).value
                                this.dispatchEvent(new CustomEvent('value-changed', {
                                    detail: { value: this.value },
                                    bubbles: true,
                                    composed: true
                                }))
                            }}"
                        />
                        ${item.label}
                    </label>
                `)}
            </div>
        </div>`
    }
}

declare global {
    interface HTMLElementTagNameMap {
      'as-radio': AsRadio
    }
}
