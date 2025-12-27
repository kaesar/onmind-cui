import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

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

    static styles = css`
      button {
        padding: 0.5rem 1rem;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 0.9375rem;
        font-weight: 500;
        font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif;
        cursor: pointer;
        transition: background 0.15s;
      }
      button:hover {
        background: #2563eb;
      }
      .overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      }
      .dialog {
        background: white;
        border-radius: 8px;
        padding: 1.5rem;
        min-width: 300px;
        max-width: 500px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif;
      }
      .dialog-header {
        font-size: 1.125rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: #1f2937;
      }
      .dialog-content {
        margin-bottom: 1.5rem;
        color: #4b5563;
        font-size: 0.9375rem;
      }
      .dialog-actions {
        display: flex;
        gap: 0.5rem;
        justify-content: flex-end;
      }
      .btn-cancel {
        background: #e5e7eb;
        color: #1f2937;
      }
      .btn-cancel:hover {
        background: #d1d5db;
      }
      .btn-confirm {
        background: #ef4444;
      }
      .btn-confirm:hover {
        background: #dc2626;
      }
    `
  
    protected override render() {
        return html`
          <button @click=${this.open}>${this.label}</button>
          ${this.dialogOpened ? html`
            <div class="overlay" @click=${this.close}>
              <div class="dialog" @click=${(e: Event) => e.stopPropagation()}>
                <div class="dialog-header">Confirm ?</div>
                <div class="dialog-content">${this.message}</div>
                <div class="dialog-actions">
                  <button class="btn-cancel" @click=${this.close}>Cancel</button>
                  <button class="btn-confirm" @click=${this.onClick}>${this.label}</button>
                </div>
              </div>
            </div>
          ` : ''}
        `
    }
    
    private open() {
        this.dialogOpened = true
    }

    private close() {
        this.dialogOpened = false
    }

    private onClick() {
        console.log('Confirmed!')
        this.dialogOpened = false
        if (!!this.link)
            location.assign(this.link)
        this.dispatchEvent(new CustomEvent('confirm-tap', {
            bubbles: true,
            composed: true
        }))
    }
}

declare global {
    interface HTMLElementTagNameMap {
      'as-confirm': AsConfirm
    }
}
