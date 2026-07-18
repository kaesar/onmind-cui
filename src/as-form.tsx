import { render } from 'solid-js/web'
import { createSignal, For, onMount, onCleanup } from 'solid-js'

class AsForm extends HTMLElement {
  private dispose?: () => void
  private _schema: any = {}
  private _hideTitle = false

  connectedCallback() {
    const [schema, setSchema] = createSignal(this._schema)
    const [theme] = createSignal((this.getAttribute('theme') as 'light' | 'dark') || undefined)
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
      // Validate all fields with validation rules
      const schemaData = schema()
      let hasErrors = false
      const newErrors: any = {}
      
      const allFields = [
        ...(schemaData.fields || []),
        ...(schemaData.sections?.flatMap((s: any) => s.fields) || [])
      ]
      
      allFields.forEach(field => {
        if (field.validation) {
          const value = formData()[field.name] || field.value || ''
          const result = validateField(value, field.validation)
          if (!result.valid) {
            newErrors[field.name] = result.message
            hasErrors = true
          }
        }
      })
      
      setErrors(newErrors)
      
      if (!hasErrors) {
        if (successMessage()) {
          showNotification(successMessage())
        }
        this.dispatchEvent(new CustomEvent('form-submit', {
          detail: { formData: formData() },
          bubbles: true,
          composed: true
        }))
      } else {
        if (this.getAttribute('errorMessage')) {
          showNotification(this.getAttribute('errorMessage')!, 'error')
        }
      }
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

    // Validation function (duplicated from AsFormBuilder for standalone use)
    const validateField = (value: any, rules: string[]) => {
      const validators: Record<string, { validate: (v: any, p: string) => boolean; message: (p: string) => string }> = {
        required: { validate: (v) => v && v.toString().trim().length > 0, message: () => 'This field is required' },
        email: { validate: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: () => 'Please enter a valid email address' },
        min: { validate: (v, p) => !v || v.toString().length >= parseInt(p), message: (p) => `Minimum ${p} characters required` },
        max: { validate: (v, p) => !v || v.toString().length <= parseInt(p), message: (p) => `Maximum ${p} characters allowed` },
        number: { validate: (v) => !v || !isNaN(Number(v)), message: () => 'Please enter a valid number' },
        positive: { validate: (v) => !v || Number(v) > 0, message: () => 'Please enter a positive number' },
        url: { validate: (v) => !v || /^https?:\/\/.+/.test(v), message: () => 'Please enter a valid URL' },
        pattern: { validate: (v, p) => !v || new RegExp(p).test(v), message: (p) => `Value must match pattern: ${p}` },
        enum: { validate: (v, p) => !v || p.split(',').includes(v), message: (p) => `Value must be one of: ${p.replace(/,/g, ', ')}` },
        password: { validate: (v) => !v || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(v), message: () => 'Password must be at least 8 characters with uppercase, lowercase and number' }
      }

      for (const rule of rules) {
        const [ruleName, ruleParam] = rule.split(':')
        const validator = validators[ruleName]
        
        if (validator && !validator.validate(value, ruleParam)) {
          return { valid: false, message: validator.message(ruleParam) }
        }
      }
      
      return { valid: true }
    }

    const renderField = (field: any) => {
      const value = formData()[field.name] || field.value || ''
      const fieldTheme = (theme() === 'dark' ? 'dark' : 'light') as 'light' | 'dark'
      const fieldDisabled = field.disabled || false
      const fieldReadonly = field.readonly || false
      const fieldRequired = field.required || false

      // Common props for all field components
      const commonProps = {
        label: field.label || field.name,
        value: value,
        placeholder: field.placeholder || '',
        theme: fieldTheme,
        disabled: fieldDisabled,
        readonly: fieldReadonly,
        // Event handler to sync formData and clear errors
        onValueChanged: (e: CustomEvent) => handleFieldChange(field.name, e.detail.value)
      }

      switch (field.type) {
        case 'text':
        case 'email':
        case 'password':
        case 'number':
          return (
            <as-input
              {...commonProps}
              kind={field.type}
              required={fieldRequired}
            />
          )

        case 'textarea':
          return (
            <as-text
              {...commonProps}
              rows={field.rows || 3}
              required={fieldRequired}
            />
          )

        case 'select':
          return (
            <as-select
              {...commonProps}
              options={formatOptions(field.options)}
              required={fieldRequired}
            />
          )

        case 'complete':
          return (
            <as-complete
              {...commonProps}
              options={formatOptions(field.options)}
              required={fieldRequired}
            />
          )

        case 'date':
          return (
            <as-date
              {...commonProps}
              required={fieldRequired}
            />
          )

        case 'time':
          return (
            <as-time
              {...commonProps}
              required={fieldRequired}
            />
          )

        case 'checkbox':
          return (
            <as-check
              label={field.label || field.name}
              checked={Boolean(value)}
              theme={fieldTheme}
              disabled={fieldDisabled}
              readonly={fieldReadonly}
              onCheckedChanged={(e: CustomEvent) => handleFieldChange(field.name, e.detail.value)}
              required={fieldRequired}
            />
          )

        case 'switch':
          return (
            <as-switch
              label={field.label || field.name}
              checked={Boolean(value)}
              theme={fieldTheme}
              disabled={fieldDisabled}
              readonly={fieldReadonly}
              onCheckedChanged={(e: CustomEvent) => handleFieldChange(field.name, e.detail.value)}
              required={fieldRequired}
            />
          )

        case 'radio':
          return (
            <as-radio
              label={field.label || field.name}
              value={value}
              options={formatOptions(field.options)}
              theme={fieldTheme}
              disabled={fieldDisabled}
              readonly={fieldReadonly}
              onValueChanged={(e: CustomEvent) => handleFieldChange(field.name, e.detail.value)}
              required={fieldRequired}
            />
          )

        case 'upload':
          return (
            <as-upload
              label={field.label || field.name}
              accept={field.accept || '*'}
              multiple={field.multiple || false}
              theme={fieldTheme}
              disabled={fieldDisabled}
              onFilesSelected={(e: CustomEvent) => handleFieldChange(field.name, e.detail.files)}
              required={fieldRequired}
            />
          )

        default:
          return (
            <as-input
              {...commonProps}
              kind="text"
              required={fieldRequired}
            />
          )
      }
    }

    const formatOptions = (options: any) => {
      if (!options) return ''
      if (Array.isArray(options)) {
        return options.map(opt => `label=${opt.label},value=${opt.value}`).join(';')
      }
      return options
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