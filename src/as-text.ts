import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('as-text')
export class AsText extends LitElement {
    @property({ type: String })
    label = ''
    @property({ type: String })
    value = ''
    @property({ type: String })
    placeholder = this.label
    @property({ type: Number })
    rows = 3
    @property({ type: String })
    theme = ''

    static styles = css`
      :host {
        display: block;
        font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif;
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
      textarea {
        padding: 0.5rem 0.75rem;
        border: 1px solid transparent;
        border-radius: 4px;
        font-size: 0.9375rem;
        font-family: inherit;
        background: var(--input-bg, #e8eaed);
        color: var(--text-color, #1a1a1a);
        outline: none;
        resize: vertical;
        transition: border-color 0.15s;
      }
      textarea:focus {
        border-color: var(--focus-color, #1676f3);
      }
      textarea::placeholder {
        color: var(--placeholder-color, #737373);
      }
      :host([theme="dark"]) {
        --label-color: #e5e5e5;
        --border-color: #525252;
        --input-bg: #1f2937;
        --text-color: #e5e5e5;
        --placeholder-color: #737373;
        --focus-color: #1676f3;
      }
    `

    protected override render() {
        return html`
        <div class="field">
            ${this.label ? html`<label>${this.label}</label>` : ''}
            <textarea
                rows="${this.rows}"
                placeholder="${this.placeholder}"
                .value="${this.value}"
                @input="${(e: Event) => {
                    this.value = (e.target as HTMLTextAreaElement).value
                    this.dispatchEvent(new CustomEvent('value-changed', {
                        detail: { value: this.value },
                        bubbles: true,
                        composed: true
                    }))
                }}"
            ></textarea>
        </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
      'as-text': AsText
    }
}
