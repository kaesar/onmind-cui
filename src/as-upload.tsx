import { render } from 'solid-js/web'
import { createSignal } from 'solid-js'
import { createStandardAttributes } from './attribute-observer'

class AsUpload extends HTMLElement {
  private dispose?: () => void
  private fileInputRef?: HTMLInputElement

  connectedCallback() {
    const [label, setLabel] = createSignal(this.getAttribute('label') || 'Upload files')
    const [accept, setAccept] = createSignal(this.getAttribute('accept') || '*')
    const [multiple, setMultiple] = createSignal(this.hasAttribute('multiple'))
    const [theme, setTheme] = createSignal(this.getAttribute('theme') || '')
    const [disabled, setDisabled] = createSignal(this.hasAttribute('disabled'))
    const [dragOver, setDragOver] = createSignal(false)

    const handleClick = () => {
      if (disabled()) return
      this.fileInputRef?.click()
    }

    const handleFileChange = (e: Event) => {
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

    const handleDragOver = (e: DragEvent) => {
      if (disabled()) return
      e.preventDefault()
      setDragOver(true)
    }

    const handleDragLeave = () => {
      setDragOver(false)
    }

    const handleDrop = (e: DragEvent) => {
      if (disabled()) return
      e.preventDefault()
      setDragOver(false)
      const files = e.dataTransfer?.files
      if (files) {
        this.dispatchEvent(new CustomEvent('files-selected', {
          detail: { files: Array.from(files) },
          bubbles: true,
          composed: true
        }))
      }
    }

    // Observar cambios en atributos usando utilidad centralizada
    createStandardAttributes(this, {
      label: [label, setLabel],
      accept: [accept, setAccept],
      multiple: { setter: setMultiple, isBoolean: true },
      theme: [theme, setTheme],
      disabled: { setter: setDisabled, isBoolean: true }
    })

    const Component = () => (
      <>
        <style>{`
          .upload-area {
            border: 2px dashed ${theme() === 'dark' ? '#4b5563' : '#d1d5db'};
            border-radius: 8px;
            padding: 2rem;
            text-align: center;
            background: ${theme() === 'dark' ? '#1f2937' : '#f9fafb'};
            color: ${theme() === 'dark' ? '#f3f4f6' : '#374151'};
            cursor: pointer;
            transition: all 0.15s;
            font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif;
          }
          .upload-area:hover:not(.disabled) {
            border-color: #3b82f6;
            background: ${theme() === 'dark' ? '#1e3a5f' : '#eff6ff'};
          }
          .upload-area.drag-over {
            border-color: #3b82f6;
            background: ${theme() === 'dark' ? '#1d4ed8' : '#dbeafe'};
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
        `}</style>
        <div 
          class={`upload-area ${dragOver() ? 'drag-over' : ''} ${disabled() ? 'disabled' : ''}`}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div class="upload-icon">📁</div>
          <div class="upload-text">{label()}</div>
          <div class="upload-hint">Click or drag files here</div>
          <input 
            ref={(el) => this.fileInputRef = el}
            type="file" 
            accept={accept()}
            multiple={multiple()}
            onChange={handleFileChange}
          />
        </div>
      </>
    )

    const shadowRoot = this.attachShadow({ mode: 'open' })
    this.dispose = render(Component, shadowRoot)
  }

  disconnectedCallback() {
    this.dispose?.()
  }

  static get observedAttributes() {
    return ['label', 'accept', 'multiple', 'theme', 'disabled']
  }
}

customElements.define('as-upload', AsUpload)