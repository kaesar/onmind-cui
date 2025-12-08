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
    @property({ type: String })
    theme = ''
    @property({ type: Array })
    get items(): Item[] {
        let data: Item[] = (new Abstract()).planeDeserialize(this.options)
        return data.map((option: Item) => ({ label: option.label, value: option.value }))
    }
  
    protected override render() {
        const vaadinTheme = this.theme === 'dark' ? 'contrast' : ''
        const style = this.theme === 'dark' ? '--vaadin-input-field-background: #374151; --vaadin-input-field-label-color: #f3f4f6; color: #f3f4f6;' : ''
        return html`
        <vaadin-select
            label="${this.label}"
            placeholder="${this.label}"
            .items="${this.items}"
            .value="${this.items[0].value}"
            theme="${vaadinTheme}"
            style="${style}"
        ></vaadin-select>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
      'as-select': AsSelect
    }
}
