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
        <vaadin-combo-box
            label="${this.label}"
            placeholder="${this.label || 'Buscar...'}"
            .items="${this.items}"
            item-label-path="label"
            item-value-path="value"
            theme="${vaadinTheme}"
            style="${style}"
        ></vaadin-combo-box>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
      'as-complete': AsComplete
    }
}
