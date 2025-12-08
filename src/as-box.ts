import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '@vaadin/vertical-layout'

@customElement('as-box')
export class AsBox extends LitElement {
    @property({ type: String })
    dim = 'false'

    @property({ type: String })
    theme = 'light'

    protected override render() {
        const isDim = this.dim === 'true'
        const isDark = this.theme === 'dark'
        
        let bgColor = 'whitesmoke'
        let boxShadow = '0 3px 10px 0 #aaa'
        let color = '#1f2937'
        
        if (isDark && isDim) {
            bgColor = '#1f2937'
            boxShadow = '0 3px 10px 0 #000'
            color = '#f3f4f6'
        } else if (isDark) {
            bgColor = '#374151'
            boxShadow = '0 3px 10px 0 #000'
            color = '#f3f4f6'
        } else if (isDim) {
            bgColor = 'silver'
        }
        
        return html`
            <vaadin-vertical-layout
                style="background-color: ${bgColor}; box-shadow: ${boxShadow}; border-radius: 5px; color: ${color};"
                theme="spacing-xs padding">
                <slot></slot>
            </vaadin-vertical-layout>`
    }
}

declare global {
    interface HTMLElementTagNameMap {
      'as-box': AsBox
    }
}
