import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '@vaadin/vertical-layout'

@customElement('as-box')
export class AsBox extends LitElement {
    @property({ type: String })
    dim = 'false'

    protected override render() {
        return html`
            <vaadin-vertical-layout
                style="background-color: ${this.dim === 'true' ? 'silver' : 'whitesmoke'}; box-shadow: 0 3px 10px 0 #aaa; border-radius: 5px;"
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
