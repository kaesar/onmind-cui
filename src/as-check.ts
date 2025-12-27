import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('as-check')
export class AsCheck extends LitElement {
    @property({ type: String })
    label = ''
    @property({ type: Boolean })
    checked = false
    @property({ type: String })
    theme = ''
    @property({ type: Boolean, reflect: true })
    readonly = false
    @property({ type: Boolean, reflect: true })
    disabled = false

    static styles = css`
      :host {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif;
        font-size: 0.9375rem;
        color: var(--text-color, #1f2937);
      }
      input[type="checkbox"] {
        width: 18px;
        height: 18px;
        cursor: pointer;
        accent-color: var(--accent-color, #1676f3);
        appearance: none;
        -webkit-appearance: none;
        border: 2px solid var(--checkbox-border, #d0d7de);
        border-radius: 3px;
        background: var(--checkbox-bg, #fafafa);
        position: relative;
      }
      input[type="checkbox"]:checked {
        background: var(--accent-color, #1676f3);
        border-color: var(--accent-color, #1676f3);
      }
      input[type="checkbox"]:checked::after {
        content: '';
        position: absolute;
        left: 4px;
        top: 1px;
        width: 4px;
        height: 8px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
      }
      :host([theme="dark"]) {
        --text-color: #e5e5e5;
        --accent-color: #1676f3;
      }
    `

    protected override render() {
        return html`
          <input
            type="checkbox"
            .checked="${this.checked}"
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            @change="${(e: Event) => {
              if (this.readonly) {
                (e.target as HTMLInputElement).checked = this.checked
                return
              }
              this.checked = (e.target as HTMLInputElement).checked
              this.dispatchEvent(new CustomEvent('checked-changed', {
                detail: { value: this.checked },
                bubbles: true,
                composed: true
              }))
            }}"
          />
          ${this.label ? html`<label>${this.label}</label>` : ''}
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
      'as-check': AsCheck
    }
}
