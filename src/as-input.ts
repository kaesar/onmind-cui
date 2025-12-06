import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '@vaadin/text-field'
import '@vaadin/email-field'
import '@vaadin/password-field'
import '@vaadin/number-field'

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

    render() {
        if (this.kind === 'email')
            return html`
              <vaadin-email-field class="as-field"
                label="${this.label}"
                value="${this.value}" 
                placeholder="${this.placeholder}">
              </vaadin-email-field>`

        if (this.kind === 'password')
            return html`
              <vaadin-password-field class="as-field"
                label="${this.label}"
                value="${this.value}" 
                placeholder="${this.placeholder}">
              </vaadin-password-field>`

        if (this.kind === 'number')
            return html`
              <vaadin-number-field class="as-field"
                label="${this.label}"
                value="${this.value}" 
                placeholder="${this.placeholder}">
              </vaadin-number-field>`

        return html`
          <vaadin-text-field class="as-field"
            label="${this.label}"
            value="${this.value}" 
            placeholder="${this.placeholder}">
          </vaadin-text-field>`
    }
}

declare global {
    interface HTMLElementTagNameMap {
      'as-input': AsInput
    }
}
