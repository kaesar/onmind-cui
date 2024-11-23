import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '@vaadin/select'
import { Item, Abstract } from './Abstract'

@customElement('as-select')
export class AsSelect extends LitElement {
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
        <vaadin-select
            label="${this.label}"
            placeholder="${this.label}"
            .items="${this.items}"
            .value="${this.items[0].value}"
        ></vaadin-select>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
      'as-select': AsSelect
    }
}
