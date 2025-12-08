import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '@vaadin/checkbox'

@customElement('as-check')
export class AsCheck extends LitElement {
    @property({ type: String })
    label = ''
    @property({ type: String })
    value = ''
    @property({ type: String })
    theme = ''

    protected override render() {
        const vaadinTheme = this.theme === 'dark' ? 'contrast' : ''
        return html`
        <vaadin-checkbox
          label="${this.label}"
          .value="${this.value}"
          theme="${vaadinTheme}"
        ></vaadin-checkbox>`
    }
}

declare global {
    interface HTMLElementTagNameMap {
      'as-check': AsCheck
    }
}
