import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '@vaadin/date-picker'

@customElement('as-date')
export class AsDate extends LitElement {
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
        <vaadin-date-picker
          label="${this.label}"
          value="${this.value}"
          placeholder="${this.placeholder}"
          theme="${vaadinTheme}"
          style="${style}"
        ></vaadin-date-picker>`
    }
}

declare global {
    interface HTMLElementTagNameMap {
      'as-date': AsDate
    }
}
