import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import type { TextAreaValueChangedEvent } from '@vaadin/text-area'
import '@vaadin/text-area'

@customElement('as-text')
export class AsText extends LitElement {
    @property({ type: String })
    label = ''
    @property({ type: String })
    value = ''
    @property({ type: String })
    placeholder = this.label

    protected override render() {
        return html`
        <vaadin-text-area
            label="${this.label}"
            placeholder="${this.placeholder}"
            .value="${this.value}"
            @value-changed="${(event: TextAreaValueChangedEvent) => {
                this.value = event.detail.value;
            }}"
        ></vaadin-text-area>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
      'as-text': AsText
    }
}
