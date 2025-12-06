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

    protected override render() {
        return html`
        <vaadin-date-picker
          label="${this.label}"
          value="${this.value}"
          placeholder="${this.placeholder}"
        ></vaadin-date-picker>`
    }
}

declare global {
    interface HTMLElementTagNameMap {
      'as-date': AsDate
    }
}
