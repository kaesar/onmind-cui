import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('as-button')
export class AsButton extends LitElement {
  @property({ type: String })
  label = 'Oops!'

  @property({ type: String })
  link = ''

  @property({ type: String })
  message = ''

  @property({ type: String })
  variant = 'primary'

  @property({ type: Boolean })
  disabled = false

  static styles = css`
    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      font-size: 0.9375rem;
      font-weight: 500;
      font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif;
      cursor: pointer;
      transition: background 0.15s;
    }
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .primary {
      background: #3b82f6;
      color: white;
    }
    .primary:hover:not(:disabled) {
      background: #2563eb;
    }
    .primary:active:not(:disabled) {
      background: #1d4ed8;
    }
    .secondary {
      background: #e5e7eb;
      color: #1f2937;
    }
    .secondary:hover:not(:disabled) {
      background: #d1d5db;
    }
    .secondary:active:not(:disabled) {
      background: #9ca3af;
    }
  `

  render() {
    return html`
      <button 
        class="${this.variant}" 
        ?disabled="${this.disabled}"
        @click=${this.onClick}
      >
        ${this.label}
      </button>`
  }

  private onClick() {
    if (this.disabled) return
    
    if (!!this.link)
      location.assign(this.link)
    else if (!!this.message)
      this.showNotification(this.message)
    else {
      this.dispatchEvent(new CustomEvent('button-tap', {
        bubbles: true,
        composed: true
      }))
    }
  }

  private showNotification(msg: string) {
    const notification = document.createElement('div')
    notification.textContent = msg
    notification.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#1f2937;color:white;padding:0.75rem 1.5rem;border-radius:4px;box-shadow:0 4px 6px rgba(0,0,0,0.1);z-index:9999;'
    document.body.appendChild(notification)
    setTimeout(() => notification.remove(), 3500)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'as-button': AsButton
  }
}
