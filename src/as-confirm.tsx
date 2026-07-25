import { render } from 'solid-js/web'
import { createSignal } from 'solid-js'
import { createThemeSync } from './theme-sync'

class AsConfirm extends HTMLElement {
  private dispose?: () => void
  private themeCleanup?: () => void
  private _observer?: MutationObserver

  connectedCallback() {
    // Sync with global theme (VitePress/Astro/system)
    this.themeCleanup = createThemeSync(this)
    
    const [label, setLabel] = createSignal(this.getAttribute('label') || 'Oops!')
    const [link, setLink] = createSignal(this.getAttribute('link') || '')
    const [message, setMessage] = createSignal(this.getAttribute('message') || '')
    const [dialogOpened, setDialogOpened] = createSignal(false)
    const [theme, setTheme] = createSignal(this.getAttribute('theme') || '')

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

    // Observar cambios en atributos
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          const attrName = mutation.attributeName
          if (attrName === 'label') setLabel(this.getAttribute('label') || 'Oops!')
          if (attrName === 'link') setLink(this.getAttribute('link') || '')
          if (attrName === 'message') setMessage(this.getAttribute('message') || '')
          if (attrName === 'theme') setTheme(this.getAttribute('theme') || '')
        }
      })
    })
    this._observer = observer
    observer.observe(this, { attributes: true })

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
            background: ${theme() === 'dark' ? '#1f2937' : 'white'};
            border-radius: 8px;
            padding: 1.5rem;
            min-width: 300px;
            max-width: 500px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif;
            color: ${theme() === 'dark' ? '#f3f4f6' : '#1f2937'};
          }
          .dialog-header {
            font-size: 1.125rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: ${theme() === 'dark' ? '#f3f4f6' : '#1f2937'};
          }
          .dialog-content {
            margin-bottom: 1.5rem;
            color: ${theme() === 'dark' ? '#d1d5db' : '#4b5563'};
            font-size: 0.9375rem;
          }
          .dialog-actions {
            display: flex;
            gap: 0.5rem;
            justify-content: flex-end;
          }
          .btn-cancel {
            background: ${theme() === 'dark' ? '#374151' : '#e5e7eb'};
            color: ${theme() === 'dark' ? '#f3f4f6' : '#1f2937'};
          }
          .btn-cancel:hover {
            background: ${theme() === 'dark' ? '#4b5563' : '#d1d5db'};
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
    this.themeCleanup?.()
    this._observer?.disconnect()
  }

  static get observedAttributes() {
    return ['label', 'link', 'message', 'theme']
  }
}

customElements.define('as-confirm', AsConfirm)