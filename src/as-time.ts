import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '@vaadin/time-picker'

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

    protected override render() {
        const vaadinTheme = this.theme === 'dark' ? 'contrast' : ''
        const style = this.theme === 'dark' ? '--vaadin-input-field-background: #374151; --vaadin-input-field-label-color: #f3f4f6; color: #f3f4f6;' : ''
        return html`
        <vaadin-time-picker
          label="${this.label}"
          value="${this.value}"
          placeholder="${this.placeholder}"
          theme="${vaadinTheme}"
          style="${style}"
        ></vaadin-time-picker>`
    }
}

declare global {
    interface HTMLElementTagNameMap {
      'as-time': AsTime
    }
}
