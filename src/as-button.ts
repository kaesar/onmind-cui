import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '@vaadin/button'
import { Notification } from '@vaadin/notification'

@customElement('as-button')
export class AsButton extends LitElement {
  @property({ type: String })
  label = 'Oops!'

  @property({ type: String })
  link = ''

  @property({ type: String })
  message = ''

  render() {
    return html`
      <vaadin-button @click=${this.onClick} theme="primary" style="cursor: pointer;">
        ${this.label}
      </vaadin-button>`
  }

  private onClick() {
    if (!!this.link)
      location.assign(this.link)
    else if (!!this.message)
      Notification.show(this.message, {
        position: 'bottom-center',
        duration: 3500,
        theme: 'contrast',
      });
    else {
      this.dispatchEvent(new CustomEvent('button-tap', {
        bubbles: true,
        composed: true
      }))
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'as-button': AsButton
  }
}
