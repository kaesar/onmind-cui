import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '@vaadin/combo-box'
import { Item, Abstract } from './Abstract'

@customElement('as-complete')
export class AsComplete extends LitElement {
    @property({ type: String })
    label = ''
    @property({ type: String })
    value = ''
    @property({ type: String })
    options = 'label=A,value=A;label=B,value=B;label=C,value=C'
    @property({ type: Array })
    get items(): Item[] {
        let data: Item[] = (new Abstract()).planeDeserialize(this.options)
        return data.map((option: Item) => ({ label: option.label, value: option.value }))
    }
  
    protected override render() {
        return html`
        <vaadin-combo-box
            label="${this.label}"
            placeholder="${this.label || 'Buscar...'}"
            .items="${this.items}"
            item-label-path="label"
            item-value-path="value"
        ></vaadin-combo-box>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
      'as-complete': AsComplete
    }
}
