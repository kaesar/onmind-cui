import { LitElement, html, css } from 'lit'
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
    @property({ type: String })
    theme = ''

    static styles = css`
      :host {
        --vaadin-input-field-background: var(--lumo-contrast-10pct);
      }
    `

    render() {
        const vaadinTheme = this.theme === 'dark' ? 'contrast' : ''
        const style = this.theme === 'dark' ? '--vaadin-input-field-background: #374151; --vaadin-input-field-label-color: #f3f4f6; color: #f3f4f6;' : ''
        
        if (this.kind === 'email')
            return html`
              <vaadin-email-field class="as-field"
                label="${this.label}"
                value="${this.value}" 
                placeholder="${this.placeholder}"
                theme="${vaadinTheme}"
                style="${style}">
              </vaadin-email-field>`

        if (this.kind === 'password')
            return html`
              <vaadin-password-field class="as-field"
                label="${this.label}"
                value="${this.value}" 
                placeholder="${this.placeholder}"
                theme="${vaadinTheme}"
                style="${style}">
              </vaadin-password-field>`

        if (this.kind === 'number')
            return html`
              <vaadin-number-field class="as-field"
                label="${this.label}"
                value="${this.value}" 
                placeholder="${this.placeholder}"
                theme="${vaadinTheme}"
                style="${style}">
              </vaadin-number-field>`

        return html`
          <vaadin-text-field class="as-field"
            label="${this.label}"
            value="${this.value}" 
            placeholder="${this.placeholder}"
            theme="${vaadinTheme}"
            style="${style}">
          </vaadin-text-field>`
    }
}

declare global {
    interface HTMLElementTagNameMap {
      'as-input': AsInput
    }
}
