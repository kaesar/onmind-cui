import { render } from 'solid-js/web'
import { createSignal, For, onMount, onCleanup } from 'solid-js'

class AsForm extends HTMLElement {
  private dispose?: () => void
  private _schema: any = {}
  private _hideTitle = false

  connectedCallback() {
    const [schema, setSchema] = createSignal(this._schema)
    const [theme] = createSignal(this.getAttribute('theme') || '')
    const [successMessage] = createSignal(this.getAttribute('successMessage') || '')
    const [hideTitle, setHideTitle] = createSignal(this._hideTitle || this.hasAttribute('hideTitle'))
    const [formData, setFormData] = createSignal<any>({})
    const [errors, setErrors] = createSignal<any>({})
    const [cancelled, setCancelled] = createSignal(false)

    const handleFieldChange = (fieldName: string, value: any) => {
      setFormData({ ...formData(), [fieldName]: value })
      
      if (errors()[fieldName]) {
        const newErrors = { ...errors() }
        delete newErrors[fieldName]
        setErrors(newErrors)
      }
      
      this.dispatchEvent(new CustomEvent('field-change', {
        detail: { fieldName, value, formData: formData() },
        bubbles: true,
        composed: true
      }))
    }

    const handleSubmit = () => {
      if (successMessage()) {
        showNotification(successMessage())
      }
      this.dispatchEvent(new CustomEvent('form-submit', {
        detail: { formData: formData() },
        bubbles: true,
        composed: true
      }))
    }

    const handleCancel = () => {
      setCancelled(true)
      this.dispatchEvent(new CustomEvent('form-cancel', {
        bubbles: true,
        composed: true
      }))
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel()
      } else if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
    }

    const showNotification = (msg: string, type: 'success' | 'error' = 'success') => {
      const notification = document.createElement('div')
      notification.textContent = msg
      const bgColor = type === 'error' ? '#dc2626' : '#059669'
      notification.style.cssText = `position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:${bgColor};color:white;padding:0.75rem 1.5rem;border-radius:4px;box-shadow:0 4px 6px rgba(0,0,0,0.1);z-index:9999;`
      document.body.appendChild(notification)
      setTimeout(() => notification.remove(), 3500)
    }

    const renderField = (field: any) => {
      const value = formData()[field.name] || field.value || ''
      const error = errors()[field.name]
      
      return (
        <div>
          <label style="font-size: 0.875rem; font-weight: 500; margin-bottom: 0.25rem; display: block;">
            {field.label}
          </label>
          <input
            type={field.type || 'text'}
            value={value}
            placeholder={field.placeholder || ''}
            disabled={field.disabled}
            readonly={field.readonly}
            style={`
              padding: 0.5rem 0.75rem;
              border: 1px solid transparent;
              border-radius: 4px;
              font-size: 0.9375rem;
              background: ${theme() === 'dark' ? '#374151' : '#e8eaed'};
              color: ${theme() === 'dark' ? '#e5e5e5' : '#1a1a1a'};
              outline: none;
              width: 100%;
              box-sizing: border-box;
            `}
            onInput={(e) => handleFieldChange(field.name, e.target.value)}
          />
          {error && (
            <div style="color: #dc2626; font-size: 0.875rem; margin-top: 0.25rem;">
              {error}
            </div>
          )}
        </div>
      )
    }

    onMount(() => {
      document.addEventListener('keydown', handleKeyDown)
    })

    onCleanup(() => {
      document.removeEventListener('keydown', handleKeyDown)
    })

    // Exponer métodos públicos para API
    ;(this as any).clearErrors = () => {
      setErrors({})
    }
    ;(this as any).validate = () => {
      return Object.keys(errors()).length === 0
    }
    ;(this as any).getFormData = () => {
      return { ...formData() }
    }
    ;(this as any).setFormData = (data: any) => {
      setFormData({ ...data })
    }

    // Exponer método para actualizar schema
    ;(this as any).updateSchema = (newSchema: any) => {
      this._schema = newSchema
      setSchema(newSchema)
    }

    // Exponer método para actualizar hideTitle
    ;(this as any).updateHideTitle = (value: boolean) => {
      this._hideTitle = value
      setHideTitle(value)
    }

    const Component = () => (
      <>
        <style>{`
          :host {
            display: block;
          }
          .form-container {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif;
          }
          .form-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: ${theme() === 'dark' ? '#f3f4f6' : '#1f2937'};
          }
          .form-section {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }
          .section-title {
            font-size: 1.125rem;
            font-weight: 500;
            color: ${theme() === 'dark' ? '#f3f4f6' : '#374151'};
            margin-bottom: 0.5rem;
          }
          .form-actions {
            display: flex;
            gap: 0.75rem;
            justify-content: flex-end;
            margin-top: 1.5rem;
            padding-top: 1rem;
            border-top: 1px solid ${theme() === 'dark' ? '#374151' : '#e5e7eb'};
          }
          button {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 4px;
            font-size: 0.9375rem;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.15s;
          }
          .btn-primary {
            background: #3b82f6;
            color: white;
          }
          .btn-primary:hover {
            background: #2563eb;
          }
          .btn-secondary {
            background: #e5e7eb;
            color: #1f2937;
          }
          .btn-secondary:hover {
            background: #d1d5db;
          }
        `}</style>
        <div class="form-container">
          {schema().title && !hideTitle() && (
            <h2 class="form-title">{schema().title}</h2>
          )}
          
          {schema().sections ? (
            <For each={schema().sections}>
              {(section) => (
                <div class="form-section">
                  {section.title && <h3 class="section-title">{section.title}</h3>}
                  <For each={section.fields}>
                    {(field) => renderField(field)}
                  </For>
                </div>
              )}
            </For>
          ) : (
            <For each={schema().fields || []}>
              {(field) => renderField(field)}
            </For>
          )}
          
          {!schema().skipActions && (
            <div class="form-actions">
              {!schema().hideCancelButton && (
                <button 
                  class="btn-secondary"
                  onClick={handleCancel}
                >
                  {schema().cancelLabel || 'Cancel'}
                </button>
              )}
              <button 
                class="btn-primary"
                disabled={cancelled()}
                onClick={handleSubmit}
              >
                {schema().submitLabel || 'Save'}
              </button>
            </div>
          )}
        </div>
      </>
    )

    const shadowRoot = this.attachShadow({ mode: 'open' })
    this.dispose = render(Component, shadowRoot)
  }

  disconnectedCallback() {
    this.dispose?.()
  }

  set schema(value: any) {
    this._schema = value
    ;(this as any).updateSchema?.(value)
  }

  get schema() {
    return this._schema
  }

  set hideTitle(value: boolean) {
    this._hideTitle = value
    ;(this as any).updateHideTitle?.(value)
  }

  get hideTitle() {
    return this._hideTitle
  }

  // API pública
  clearErrors() {
    ;(this as any).clearErrors?.()
  }

  validate() {
    return (this as any).validate?.()
  }

  getFormData() {
    return (this as any).getFormData?.()
  }

  setFormData(data: any) {
    ;(this as any).setFormData?.(data)
  }
}

customElements.define('as-form', AsForm)