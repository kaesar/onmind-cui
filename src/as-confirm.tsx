import { render } from 'solid-js/web'
import { createSignal } from 'solid-js'

class AsConfirm extends HTMLElement {
  private dispose?: () => void

  connectedCallback() {
    const [label] = createSignal(this.getAttribute('label') || 'Oops!')
    const [link] = createSignal(this.getAttribute('link') || '')
    const [message] = createSignal(this.getAttribute('message') || '')
    const [dialogOpened, setDialogOpened] = createSignal(false)

    const open = () => setDialogOpened(true)
    const close = () => setDialogOpened(false)

    const onClick = () => {
      console.log('Confirmed!')
      setDialogOpened(false)
      if (link()) {
        location.assign(link())
      }
      this.dispatchEvent(new CustomEvent('confirm-tap', {
        bubbles: true,
        composed: true
      }))
    }

    const Component = () => (
      <>
        <style>{`
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
        `}</style>
        <button onClick={open}>{label()}</button>
        {dialogOpened() && (
          <div class="overlay" onClick={close}>
            <div class="dialog" onClick={(e) => e.stopPropagation()}>
              <div class="dialog-header">Confirm ?</div>
              <div class="dialog-content">{message()}</div>
              <div class="dialog-actions">
                <button class="btn-cancel" onClick={close}>Cancel</button>
                <button class="btn-confirm" onClick={onClick}>{label()}</button>
              </div>
            </div>
          </div>
        )}
      </>
    )

    const shadowRoot = this.attachShadow({ mode: 'open' })
    this.dispose = render(Component, shadowRoot)
  }

  disconnectedCallback() {
    this.dispose?.()
  }

  static get observedAttributes() {
    return ['label', 'link', 'message']
  }
}

customElements.define('as-confirm', AsConfirm)