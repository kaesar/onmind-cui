import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

@customElement('as-upload')
export class AsUpload extends LitElement {
    @property({ type: String })
    label = 'Upload files'
    
    @property({ type: String })
    accept = '*'
    
    @property({ type: Boolean })
    multiple = false
    
    @property({ type: String })
    theme = ''
    
    @property({ type: Boolean })
    disabled = false

    @state()
    private accessor _dragOver = false

    static styles = css`
        :host {
            display: block;
            font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif;
        }
        .upload-area {
            border: 2px dashed var(--border-color, #d1d5db);
            border-radius: 8px;
            padding: 2rem;
            text-align: center;
            background: var(--bg-color, #f9fafb);
            color: var(--text-color, #374151);
            cursor: pointer;
            transition: all 0.15s;
        }
        .upload-area:hover:not(.disabled) {
            border-color: var(--hover-border, #3b82f6);
            background: var(--hover-bg, #eff6ff);
        }
        .upload-area.drag-over {
            border-color: var(--focus-color, #3b82f6);
            background: var(--focus-bg, #dbeafe);
        }
        .upload-area.disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .upload-icon {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }
        .upload-text {
            font-size: 0.9375rem;
            margin-bottom: 0.25rem;
        }
        .upload-hint {
            font-size: 0.875rem;
            opacity: 0.7;
        }
        input[type="file"] {
            display: none;
        }
        :host([theme="dark"]) {
            --border-color: #4b5563;
            --bg-color: #1f2937;
            --text-color: #f3f4f6;
            --hover-border: #3b82f6;
            --hover-bg: #1e3a5f;
            --focus-color: #3b82f6;
            --focus-bg: #1d4ed8;
        }
    `

    private _handleClick() {
        if (this.disabled) return
        this.shadowRoot?.querySelector('input')?.click()
    }

    private _handleFileChange(e: Event) {
        const input = e.target as HTMLInputElement
        const files = input.files
        if (files) {
            this.dispatchEvent(new CustomEvent('files-selected', {
                detail: { files: Array.from(files) },
                bubbles: true,
                composed: true
            }))
        }
    }

    private _handleDragOver(e: DragEvent) {
        if (this.disabled) return
        e.preventDefault()
        this._dragOver = true
    }

    private _handleDragLeave() {
        this._dragOver = false
    }

    private _handleDrop(e: DragEvent) {
        if (this.disabled) return
        e.preventDefault()
        this._dragOver = false
        const files = e.dataTransfer?.files
        if (files) {
            this.dispatchEvent(new CustomEvent('files-selected', {
                detail: { files: Array.from(files) },
                bubbles: true,
                composed: true
            }))
        }
    }

    protected override render() {
        return html`
            <div 
                class="upload-area ${this._dragOver ? 'drag-over' : ''} ${this.disabled ? 'disabled' : ''}"
                @click="${this._handleClick}"
                @dragover="${this._handleDragOver}"
                @dragleave="${this._handleDragLeave}"
                @drop="${this._handleDrop}"
            >
                <div class="upload-icon">📁</div>
                <div class="upload-text">${this.label}</div>
                <div class="upload-hint">Click or drag files here</div>
                <input 
                    type="file" 
                    .accept="${this.accept}"
                    ?multiple="${this.multiple}"
                    @change="${this._handleFileChange}"
                />
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'as-upload': AsUpload
    }
}