import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '@vaadin/checkbox'

@customElement('as-check')
export class AsCheck extends LitElement {
    @property({ type: String })
    label = ''
    @property({ type: String })
    value = ''

    protected override render() {
        return html`
        <vaadin-checkbox
          label="${this.label}"
          .value="${this.value}"
        ></vaadin-checkbox>`
    }
}

declare global {
    interface HTMLElementTagNameMap {
      'as-check': AsCheck
    }
}
