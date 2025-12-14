import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { Item, Abstract } from './Abstract'

@customElement('as-popup')
export class AsPopup extends LitElement {
    @property({ type: String })
    options = 'label=Editar,value=edit;label=Duplicar,value=duplicate;label=Eliminar,value=delete'
    @property({ type: String })
    theme = ''
    @property({ type: Boolean })
    open = false

    @state()
    private accessor _x = 0
    @state()
    private accessor _y = 0
    @state()
    private accessor _showConfirm = false
    @state()
    private accessor _pendingItem: Item | null = null

    @property({ type: Array })
    get items(): Item[] {
        return (new Abstract()).planeDeserialize(this.options)
    }

    static styles = css`
        :host {
            position: fixed;
            z-index: 1000;
            font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif;
        }
        .popup {
            background: var(--popup-bg, white);
            border: 1px solid var(--border-color, #ccc);
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            min-width: 120px;
        }
        .option {
            padding: 0.5rem 0.75rem;
            cursor: pointer;
            font-size: 0.9375rem;
            color: var(--text-color, #1f2937);
            border-bottom: 1px solid var(--border-light, #eee);
            transition: background-color 0.15s;
        }
        .option:last-child {
            border-bottom: none;
        }
        .option:hover {
            background-color: var(--option-hover, #e0f2fe);
        }
        .option.danger {
            color: var(--danger-color, #dc2626);
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
            z-index: 10000;
        }
        .dialog {
            background: var(--popup-bg, white);
            border-radius: 8px;
            padding: 1.5rem;
            min-width: 300px;
            max-width: 500px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            font-family: inherit;
        }
        .dialog-header {
            font-size: 1.125rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: var(--text-color, #1f2937);
        }
        .dialog-content {
            margin-bottom: 1.5rem;
            color: var(--text-color, #4b5563);
            font-size: 0.9375rem;
        }
        .dialog-actions {
            display: flex;
            gap: 0.5rem;
            justify-content: flex-end;
        }
        .btn-cancel {
            padding: 0.5rem 1rem;
            background: var(--cancel-bg, #e5e7eb);
            color: var(--cancel-text, #1f2937);
            border: none;
            border-radius: 4px;
            font-size: 0.9375rem;
            cursor: pointer;
        }
        .btn-confirm {
            padding: 0.5rem 1rem;
            background: var(--danger-color, #ef4444);
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 0.9375rem;
            cursor: pointer;
        }
        :host([theme="dark"]) {
            --popup-bg: #1f2937;
            --border-color: #374151;
            --border-light: #374151;
            --text-color: #f3f4f6;
            --option-hover: #1e3a5f;
            --danger-color: #ef4444;
        }
    `

    show(x: number, y: number) {
        this._x = x
        this._y = y
        this.open = true
        this.updateComplete.then(() => {
            this._adjustPosition()
            this._addOutsideClickListener()
        })
    }

    hide() {
        this.open = false
        this._removeOutsideClickListener()
    }

    private _adjustPosition() {
        const rect = this.getBoundingClientRect()
        
        // Posicionar hacia la izquierda
        let left = this._x - rect.width
        if (left < 0) left = this._x // Si no cabe a la izquierda, mostrar a la derecha
        
        // Posicionar verticalmente, hacia arriba si no hay espacio abajo
        let top = this._y
        if (top + rect.height > window.innerHeight) {
            top = this._y - rect.height
        }
        
        this.style.left = left + 'px'
        this.style.top = top + 'px'
    }

    private _handleOptionClick(item: Item) {
        if (this._isDangerOption(item.value)) {
            this._pendingItem = item
            this._showConfirm = true
        } else {
            this._executeOption(item)
        }
    }

    private _executeOption(item: Item) {
        this.dispatchEvent(new CustomEvent('option-select', {
            detail: { value: item.value, label: item.label },
            bubbles: true,
            composed: true
        }))
        this.hide()
    }

    private _confirmAction() {
        if (this._pendingItem) {
            this._executeOption(this._pendingItem)
            this._pendingItem = null
        }
        this._showConfirm = false
    }

    private _cancelAction() {
        this._pendingItem = null
        this._showConfirm = false
        this.hide()
    }

    private _outsideClickHandler = (e: Event) => {
        if (!this.contains(e.target as Node)) {
            this.hide()
        }
    }

    private _addOutsideClickListener() {
        setTimeout(() => {
            document.addEventListener('click', this._outsideClickHandler)
        }, 0)
    }

    private _removeOutsideClickListener() {
        document.removeEventListener('click', this._outsideClickHandler)
    }

    private _isDangerOption(value: string): boolean {
        const dangerKeywords = ['delete', 'remove', 'destroy', 'eliminar', 'borrar']
        return dangerKeywords.some(keyword => value.toLowerCase().includes(keyword))
    }

    protected override render() {
        return html`
            ${this.open ? html`
                <div class="popup">
                    ${this.items.map(item => html`
                        <div 
                            class="option ${this._isDangerOption(item.value) ? 'danger' : ''}" 
                            data-value="${item.value}"
                            @click="${() => this._handleOptionClick(item)}"
                        >
                            ${item.label}
                        </div>
                    `)}
                </div>
            ` : ''}
            
            ${this._showConfirm && this._pendingItem ? html`
                <div class="overlay" @click="${this._cancelAction}">
                    <div class="dialog" @click="${(e: Event) => e.stopPropagation()}">
                        <div class="dialog-header">Confirmar acción</div>
                        <div class="dialog-content">
                            ¿Estás seguro de que deseas ${this._pendingItem.label.toLowerCase()}?
                        </div>
                        <div class="dialog-actions">
                            <button class="btn-cancel" @click="${this._cancelAction}">Cancelar</button>
                            <button class="btn-confirm" @click="${this._confirmAction}">${this._pendingItem.label}</button>
                        </div>
                    </div>
                </div>
            ` : ''}
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'as-popup': AsPopup
    }
}