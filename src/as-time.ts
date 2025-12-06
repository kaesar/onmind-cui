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

    protected override render() {
        return html`
        <vaadin-time-picker
          label="${this.label}"
          value="${this.value}"
          placeholder="${this.placeholder}"
        ></vaadin-time-picker>`
    }
}

declare global {
    interface HTMLElementTagNameMap {
      'as-time': AsTime
    }
}
