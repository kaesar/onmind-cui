import { LitElement, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import '@vaadin/button'
import '@vaadin/confirm-dialog'
import '@vaadin/horizontal-layout'
import type { ConfirmDialogOpenedChangedEvent } from '@vaadin/confirm-dialog'

@customElement('as-confirm')
export class AsConfirm extends LitElement {
    @property({ type: String })
    label = 'Oops!'

    @property({ type: String })
    link = ''

    @property({ type: String })
    message = ''
  
    @state()
    private accessor dialogOpened = false
  
    //@state()
    //private accessor status = ''
  
    protected override render() {
        return html`
          <vaadin-horizontal-layout
            style="align-items: center; justify-content: center;"
            theme="spacing"
          >
            <vaadin-button @click=${this.open} theme="primary" style="cursor: pointer;">${this.label}</vaadin-button>
    
            <vaadin-confirm-dialog
              header='Confirm ?'
              cancel-button-visible
              confirm-text="${this.label}"
              confirm-theme="error primary"
              .opened=${this.dialogOpened}
              @opened-changed="${this.openedChanged}"
              @confirm=${this.onClick}
            >
              ${this.message}
            </vaadin-confirm-dialog>
          </vaadin-horizontal-layout>
        `;
    }
    
    openedChanged(e: ConfirmDialogOpenedChangedEvent) {
        this.dialogOpened = e.detail.value;
        //if (this.dialogOpened) { this.status = ''; }
    }
    
    private open() {
        this.dialogOpened = true;
    }

    private onClick() {
        //this.status = 'Confirmed';
        console.log('Confirmed!')
        if (!!this.link)
            location.assign(this.link)
    }
}

declare global {
    interface HTMLElementTagNameMap {
      'as-confirm': AsConfirm
    }
}
