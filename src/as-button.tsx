import { render } from 'solid-js/web'
import { createSignal } from 'solid-js'

class AsButton extends HTMLElement {
  private dispose?: () => void

  connectedCallback() {
    const [label] = createSignal(this.getAttribute('label') || 'Oops!')
    const [link] = createSignal(this.getAttribute('link') || '')
    const [message] = createSignal(this.getAttribute('message') || '')
    const [variant] = createSignal(this.getAttribute('variant') || 'primary')
    const [disabled] = createSignal(this.hasAttribute('disabled'))

    const onClick = () => {
      if (disabled()) return
      
      if (link()) {
        location.assign(link())
      } else if (message()) {
        showNotification(message())
      } else {
        this.dispatchEvent(new CustomEvent('button-tap', {
          bubbles: true,
          composed: true
        }))
      }
    }

    const showNotification = (msg: string) => {
      const notification = document.createElement('div')
      notification.textContent = msg
      notification.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#1f2937;color:white;padding:0.75rem 1.5rem;border-radius:4px;box-shadow:0 4px 6px rgba(0,0,0,0.1);z-index:9999;'
      document.body.appendChild(notification)
      setTimeout(() => notification.remove(), 3500)
    }

    const Component = () => (
      <>
        <style>{`
          :host {
            display: inline-block;
          }
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
        `}</style>
        <button 
          class={variant()}
          disabled={disabled()}
          onClick={onClick}
        >
          {label()}
        </button>
      </>
    )

    const shadowRoot = this.attachShadow({ mode: 'open' })
    this.dispose = render(Component, shadowRoot)
  }

  disconnectedCallback() {
    this.dispose?.()
  }

  static get observedAttributes() {
    return ['label', 'link', 'message', 'variant', 'disabled']
  }
}

customElements.define('as-button', AsButton)
