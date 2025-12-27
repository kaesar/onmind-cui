import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('as-switch')
export class AsSwitch extends LitElement {
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
      .switch {
        position: relative;
        width: 36px;
        height: 20px;
        background: var(--switch-bg-off, #e8eaed);
        border-radius: 10px;
        transition: background 0.2s;
        cursor: pointer;
      }
      .switch.checked {
        background: var(--switch-bg-on, #1676f3);
      }
      .switch::after {
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: white;
        top: 2px;
        left: 2px;
        transition: transform 0.2s;
      }
      .switch.checked::after {
        transform: translateX(16px);
      }
      :host([theme="dark"]) {
        --text-color: #e5e5e5;
        --switch-bg-off: #525252;
        --switch-bg-on: #1676f3;
      }
    `

    protected override render() {
        return html`
          <div
            class="switch ${this.checked ? 'checked' : ''}"
            ?aria-disabled=${this.disabled}
            @click="${() => {
              if (this.disabled || this.readonly) return
              this.checked = !this.checked
              this.dispatchEvent(new CustomEvent('checked-changed', {
                detail: { value: this.checked },
                bubbles: true,
                composed: true
              }))
            }}"
          ></div>
          ${this.label ? html`<label>${this.label}</label>` : ''}
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
      'as-switch': AsSwitch
    }
}
