import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('as-modal')
export class AsModal extends LitElement {
    @property({ type: String })
    title = ''
    
    @property({ type: Boolean })
    open = false
    
    @property({ type: String })
    theme = ''

    static styles = css`
        :host {
            font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif;
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
            background: white;
            border-radius: 8px;
            padding: 1.5rem;
            min-width: 300px;
            max-width: 500px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif;
            position: relative;
            max-height: 90vh;
            overflow-y: auto;
        }
        .modal-header {
            font-size: 1.125rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: #1f2937;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .modal-title {
            font-size: 1.125rem;
            font-weight: 600;
            color: #1f2937;
        }
        .close-button {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #6b7280;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .close-button:hover {
            color: #1f2937;
        }
        .close-icon {
            width: 1.25rem;
            height: 1.25rem;
        }
        .modal-body {
            color: #4b5563;
            font-size: 0.9375rem;
        }
        .hidden {
            display: none;
        }
        :host([theme="dark"]) .modal-content {
            background: #1f2937;
            color: #f3f4f6;
        }
        :host([theme="dark"]) .modal-title {
            color: #f3f4f6;
        }
        :host([theme="dark"]) .close-button {
            color: #9ca3af;
        }
        :host([theme="dark"]) .close-button:hover {
            color: #d1d5db;
        }
        :host([theme="dark"]) .modal-body {
            color: #d1d5db;
        }
    `

    show() {
        this.open = true
        // Add escape key listener
        document.addEventListener('keydown', this._handleKeyDown)
        // Wait for next update cycle to ensure slot is available
        this.updateComplete.then(() => {
            this._notifySlottedForm(true)
        })
    }

    hide() {
        this.open = false
        // Remove escape key listener
        document.removeEventListener('keydown', this._handleKeyDown)
        // Restore as-form title when modal closes
        this._notifySlottedForm(false)
        this.dispatchEvent(new CustomEvent('modal-close', {
            bubbles: true,
            composed: true
        }))
    }

    private _notifySlottedForm(hideTitle: boolean) {
        // Find slotted as-form and set hideTitle property
        const slot = this.shadowRoot?.querySelector('slot')
        if (!slot) return
        
        const assignedElements = slot.assignedElements()
        
        assignedElements.forEach(element => {
            if (element.tagName.toLowerCase() === 'as-form') {
                (element as any).hideTitle = hideTitle
                // Reset cancelled state when showing modal
                if (hideTitle) {
                    (element as any)._cancelled = false
                }
                // Force update of the form component
                if (typeof (element as any).requestUpdate === 'function') {
                    (element as any).requestUpdate()
                }
            }
        })
    }

    private _handleOverlayClick(e: Event) {
        if (e.target === e.currentTarget) {
            this.hide()
        }
    }

    private _handleSlotChange(e: Event) {
        const slot = e.target as HTMLSlotElement
        const elements = slot.assignedElements()
        elements.forEach(el => {
            if (this.theme === 'dark') {
                el.setAttribute('theme', 'dark')
            } else {
                el.removeAttribute('theme')
            }
        })
    }

    private _handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && this.open) {
            this.hide()
        }
    }

    protected override render() {
        if (!this.open) return html``

        return html`
            <div class="modal-overlay" @click="${this._handleOverlayClick}">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title">${this.title}</h2>
                        <button class="close-button" @click="${this.hide}">
                            <svg class="close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                    <div class="modal-body">
                        <slot @slotchange="${this._handleSlotChange}"></slot>
                    </div>
                </div>
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'as-modal': AsModal
    }
}