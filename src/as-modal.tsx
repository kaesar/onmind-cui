import { render } from 'solid-js/web'
import { createSignal, onCleanup } from 'solid-js'

class AsModal extends HTMLElement {
  private dispose?: () => void

  connectedCallback() {
    const [title] = createSignal(this.getAttribute('title') || '')
    const [open, setOpen] = createSignal(false)
    const [theme] = createSignal(this.getAttribute('theme') || '')

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open()) {
        hide()
      }
    }

    const handleFormEvents = (e: Event) => {
      if (e.type === 'form-submit' || e.type === 'form-cancel') {
        // Re-dispatch the event from this element
        this.dispatchEvent(new CustomEvent(e.type, {
          detail: (e as CustomEvent).detail,
          bubbles: true,
          composed: true
        }))
      }
    }

    const handleSlotChange = (e: Event) => {
      const slot = e.target as HTMLSlotElement
      const elements = slot.assignedElements()
      elements.forEach(el => {
        if (theme() === 'dark') {
          el.setAttribute('theme', 'dark')
        } else {
          el.removeAttribute('theme')
        }
      })
    }

    const show = () => {
      setOpen(true)
      document.addEventListener('keydown', handleKeyDown)
      // Listen for form events from slotted content
      this.addEventListener('form-submit', handleFormEvents)
      this.addEventListener('form-cancel', handleFormEvents)
      // Hide title of slotted as-form components
      notifySlottedForm(true)
    }

    const hide = () => {
      setOpen(false)
      document.removeEventListener('keydown', handleKeyDown)
      this.removeEventListener('form-submit', handleFormEvents)
      this.removeEventListener('form-cancel', handleFormEvents)
      // Restore title of slotted as-form components
      notifySlottedForm(false)
      this.dispatchEvent(new CustomEvent('modal-close', {
        bubbles: true,
        composed: true
      }))
    }

    const notifySlottedForm = (hideTitle: boolean) => {
      // Find slotted as-form and set hideTitle property
      const slot = this.shadowRoot?.querySelector('slot')
      if (!slot) return
      
      const assignedElements = slot.assignedElements()
      assignedElements.forEach(element => {
        if (element.tagName.toLowerCase() === 'as-form') {
          ;(element as any).hideTitle = hideTitle
          // Reset cancelled state when showing modal
          if (hideTitle) {
            ;(element as any)._cancelled = false
          }
        }
      })
    }

    const handleOverlayClick = (e: Event) => {
      if (e.target === e.currentTarget) {
        hide()
      }
    }

    // Exponer métodos públicos
    ;(this as any).show = show
    ;(this as any).hide = hide

    onCleanup(() => {
      document.removeEventListener('keydown', handleKeyDown)
    })

    const Component = () => (
      <>
        <style>{`
          :host {
            display: block;
          }
          .modal-overlay {
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
          .modal-content {
            background: ${theme() === 'dark' ? '#1f2937' : 'white'};
            border-radius: 8px;
            padding: 1.5rem;
            min-width: 300px;
            max-width: 500px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif;
            position: relative;
            max-height: 90vh;
            overflow-y: auto;
            color: ${theme() === 'dark' ? '#f3f4f6' : '#1f2937'};
          }
          .modal-header {
            font-size: 1.125rem;
            font-weight: 600;
            margin-bottom: 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .modal-title {
            font-size: 1.125rem;
            font-weight: 600;
          }
          .close-button {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: ${theme() === 'dark' ? '#9ca3af' : '#6b7280'};
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .close-button:hover {
            color: ${theme() === 'dark' ? '#d1d5db' : '#1f2937'};
          }
          .close-icon {
            width: 1.25rem;
            height: 1.25rem;
          }
          .modal-body {
            color: ${theme() === 'dark' ? '#d1d5db' : '#4b5563'};
            font-size: 0.9375rem;
          }
        `}</style>
        {open() && (
          <div class="modal-overlay" onClick={handleOverlayClick}>
            <div class="modal-content">
              <div class="modal-header">
                <h2 class="modal-title">{title()}</h2>
                <button class="close-button" onClick={hide}>
                  <svg class="close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              <div class="modal-body">
                <slot onSlotChange={handleSlotChange} />
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

  // API pública
  show() {
    ;(this as any).show?.()
  }

  hide() {
    ;(this as any).hide?.()
  }

  static get observedAttributes() {
    return ['title', 'theme']
  }
}

customElements.define('as-modal', AsModal)