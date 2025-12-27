import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('as-input')
export class AsInput extends LitElement {
    @property({ type: String })
    label = ''
    @property({ type: String })
    value = ''
    @property({ type: String })
    placeholder = this.label
    @property({ type: String })
    kind = 'text'
    @property({ type: String })
    theme = ''
    @property({ type: Boolean, reflect: true })
    readonly = false
    @property({ type: Boolean, reflect: true })
    disabled = false

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
      input::placeholder {
        color: var(--placeholder-color, #737373);
      }
      :host([theme="dark"]) {
        --label-color: #f3f4f6;
        --border-color: #525252;
        --input-bg: #374151;
        --text-color: #f3f4f6;
        --placeholder-color: #9ca3af;
        --focus-color: #1676f3;
      }
    `

    render() {
        const type = this.kind === 'text' ? 'text' : this.kind === 'email' ? 'email' : this.kind === 'password' ? 'password' : this.kind === 'number' ? 'number' : 'text'
        return html`
          <div class="field">
            ${this.label ? html`<label>${this.label}</label>` : ''}
            <input
              type="${type}"
              .value="${this.value}"
              placeholder="${this.placeholder}"
              ?readonly=${this.readonly}
              ?disabled=${this.disabled}
              @input="${(e: Event) => {
                this.value = (e.target as HTMLInputElement).value
                this.dispatchEvent(new CustomEvent('value-changed', {
                  detail: { value: this.value },
                  bubbles: true,
                  composed: true
                }))
              }}"
            />
          </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
      'as-input': AsInput
    }
}
