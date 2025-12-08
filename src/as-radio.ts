import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '@vaadin/radio-group'
import { Item, Abstract } from './Abstract'

@customElement('as-radio')
export class AsRadio extends LitElement {
    @property({ type: String })
    label = ''
    @property({ type: String })
    value = ''
    @property({ type: String })
    options = 'label=A,value=A;label=B,value=B;label=C,value=C'
    @property({ type: String })
    theme = ''
    @property({ type: Array })
    get items(): Item[] {
        let data: Item[] = (new Abstract()).planeDeserialize(this.options)
        return data.map((option: Item) => ({ label: option.label, value: option.value }))
    }

    protected override render() {
        const vaadinTheme = this.theme === 'dark' ? 'horizontal contrast' : 'horizontal'
        return html`
        <vaadin-radio-group label="${this.label}" theme="${vaadinTheme}">
            ${this.items.map(item => html`
                <vaadin-radio-button value="${item.value}" label="${item.label}" ?checked="${this.value === item.value}"></vaadin-radio-button>
            `)}
        </vaadin-radio-group>`
    }
}

declare global {
    interface HTMLElementTagNameMap {
      'as-radio': AsRadio
    }
}
