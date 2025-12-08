import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '@vaadin/checkbox'

@customElement('as-switch')
export class AsSwitch extends LitElement {
    @property({ type: String })
    label = ''
    @property({ type: Boolean })
    checked = false
    @property({ type: String })
    theme = ''

    static styles = css`
      :host {
        --switch-bg-off: #ccc;
      }
      :host([theme="dark"]) {
        --switch-bg-off: #4b5563;
      }
      vaadin-checkbox::part(checkbox) {
        width: 36px;
        height: 20px;
        border-radius: 10px;
        background: var(--switch-bg-off);
        position: relative;
        transition: background 0.2s;
      }
      vaadin-checkbox[checked]::part(checkbox) {
        background: var(--lumo-primary-color, #1976d2);
      }
      vaadin-checkbox::part(checkbox)::after {
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
      vaadin-checkbox[checked]::part(checkbox)::after {
        transform: translateX(16px);
      }
    `

    protected override render() {
        const vaadinTheme = this.theme === 'dark' ? 'contrast' : ''
        return html`
        <vaadin-checkbox
          label="${this.label}"
          ?checked="${this.checked}"
          theme="${vaadinTheme}"
        ></vaadin-checkbox>`
    }
}

declare global {
    interface HTMLElementTagNameMap {
      'as-switch': AsSwitch
    }
}
