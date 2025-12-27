import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

// Simplified FormBuilder for CUI components
class AsFormBuilder {
    validators: Map<string, any>

    constructor() {
        this.validators = new Map()
        this.setupDefaultValidators()
    }

    setupDefaultValidators() {
        this.validators.set('required', {
            validate: (value: any) => value && value.toString().trim().length > 0,
            message: 'This field is required'
        })
        this.validators.set('email', {
            validate: (value: any) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message: 'Please enter a valid email address'
        })
        this.validators.set('min', {
            validate: (value: any, param: any) => !value || value.toString().length >= parseInt(param),
            message: (param: any) => `Minimum ${param} characters required`
        })
        this.validators.set('max', {
            validate: (value: any, param: any) => !value || value.toString().length <= parseInt(param),
            message: (param: any) => `Maximum ${param} characters allowed`
        })
        this.validators.set('enum', {
            validate: (value: any, param: any) => !value || param.split(',').includes(value),
            message: (param: any) => `Value must be one of: ${param.replace(/,/g, ', ')}`
        })
    }

    validateField(value: any, rules: any) {
        if (!rules) return { valid: true }
        
        for (const rule of rules) {
            const [ruleName, ruleParam] = rule.split(':')
            const validator = this.validators.get(ruleName)
            
            if (validator && !validator.validate(value, ruleParam)) {
                const message = typeof validator.message === 'function' 
                    ? validator.message(ruleParam) 
                    : validator.message
                return { valid: false, message }
            }
        }
        
        return { valid: true }
    }
}

@customElement('as-form')
export class AsForm extends LitElement {
    @property({ type: Object })
    schema: any = {}
    
    @property({ type: String })
    theme = ''
    
    @property({ type: String })
    successMessage = ''
    
    @property({ type: String })
    errorMessage = ''
    
    @property({ type: Boolean })
    hideTitle = false

    @state()
    private accessor _formData: any = {}
    
    @state()
    private accessor _errors: any = {}

    @state()
    private accessor _cancelled = false

    private _formBuilder = new AsFormBuilder()

    static styles = css`
        :host {
            display: block;
            font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif;
        }
        .form-container {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        .form-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: var(--text-color, #1f2937);
        }
        .form-section {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }
        .section-title {
            font-size: 1.125rem;
            font-weight: 500;
            color: var(--text-color, #374151);
            margin-bottom: 0.5rem;
        }
        .form-actions {
            display: flex;
            gap: 0.75rem;
            justify-content: flex-end;
            margin-top: 1.5rem;
            padding-top: 1rem;
            border-top: 1px solid var(--border-color, #e5e7eb);
        }
        .error-message {
            color: var(--error-color, #dc2626);
            font-size: 0.875rem;
            margin-top: 0.25rem;
        }
        :host([theme="dark"]) {
            --text-color: #f3f4f6;
            --border-color: #374151;
            --error-color: #ef4444;
        }
    `

    private _renderField(field: any) {
        const value = this._formData[field.name] || field.value || ''
        const error = this._errors[field.name]
        
        switch (field.type) {
            case 'text':
            case 'email':
            case 'password':
            case 'number':
                return html`
                    <as-input
                        label="${field.label || ''}"
                        kind="${field.type}"
                        value="${value}"
                        placeholder="${field.placeholder || ''}"
                        ?required="${field.required}"
                        ?readonly="${field.readonly}"
                        ?disabled="${field.disabled}"
                        theme="${this.theme}"
                        @value-changed="${(e: any) => this._handleFieldChange(field.name, e.detail.value, field.validation)}"
                    ></as-input>
                    ${error ? html`<div class="error-message">${error}</div>` : ''}
                `
            
            case 'textarea':
                return html`
                    <as-text
                        label="${field.label || ''}"
                        value="${value}"
                        placeholder="${field.placeholder || ''}"
                        rows="${field.rows || 3}"
                        ?required="${field.required}"
                        ?readonly="${field.readonly}"
                        ?disabled="${field.disabled}"
                        theme="${this.theme}"
                        @value-changed="${(e: any) => this._handleFieldChange(field.name, e.detail.value, field.validation)}"
                    ></as-text>
                    ${error ? html`<div class="error-message">${error}</div>` : ''}
                `
            
            case 'select':
                return html`
                    <as-select
                        label="${field.label || ''}"
                        value="${value}"
                        options="${this._formatOptions(field.options)}"
                        ?required="${field.required}"
                        ?disabled="${field.disabled}"
                        theme="${this.theme}"
                        @value-changed="${(e: any) => this._handleFieldChange(field.name, e.detail.value, field.validation)}"
                    ></as-select>
                    ${error ? html`<div class="error-message">${error}</div>` : ''}
                `
            
            case 'checkbox':
                return html`
                    <as-check
                        label="${field.label || ''}"
                        ?checked="${value}"
                        ?disabled="${field.disabled}"
                        theme="${this.theme}"
                        @checked-changed="${(e: any) => this._handleFieldChange(field.name, e.detail.value, field.validation)}"
                    ></as-check>
                    ${error ? html`<div class="error-message">${error}</div>` : ''}
                `
            
            case 'switch':
                return html`
                    <as-switch
                        label="${field.label || ''}"
                        ?checked="${value}"
                        ?disabled="${field.disabled}"
                        theme="${this.theme}"
                        @checked-changed="${(e: any) => this._handleFieldChange(field.name, e.detail.value, field.validation)}"
                    ></as-switch>
                    ${error ? html`<div class="error-message">${error}</div>` : ''}
                `
            
            case 'radio':
                return html`
                    <as-radio
                        label="${field.label || ''}"
                        value="${value}"
                        options="${this._formatOptions(field.options)}"
                        ?disabled="${field.disabled}"
                        theme="${this.theme}"
                        @value-changed="${(e: any) => this._handleFieldChange(field.name, e.detail.value, field.validation)}"
                    ></as-radio>
                    ${error ? html`<div class="error-message">${error}</div>` : ''}
                `
            
            case 'date':
                return html`
                    <as-date
                        label="${field.label || ''}"
                        value="${value}"
                        placeholder="${field.placeholder || ''}"
                        ?required="${field.required}"
                        ?readonly="${field.readonly}"
                        ?disabled="${field.disabled}"
                        theme="${this.theme}"
                        @value-changed="${(e: any) => this._handleFieldChange(field.name, e.detail.value, field.validation)}"
                    ></as-date>
                    ${error ? html`<div class="error-message">${error}</div>` : ''}
                `
            
            case 'time':
                return html`
                    <as-time
                        label="${field.label || ''}"
                        value="${value}"
                        placeholder="${field.placeholder || ''}"
                        ?required="${field.required}"
                        ?readonly="${field.readonly}"
                        ?disabled="${field.disabled}"
                        theme="${this.theme}"
                        @value-changed="${(e: any) => this._handleFieldChange(field.name, e.detail.value, field.validation)}"
                    ></as-time>
                    ${error ? html`<div class="error-message">${error}</div>` : ''}
                `
            
            case 'complete':
                return html`
                    <as-complete
                        label="${field.label || ''}"
                        value="${value}"
                        options="${this._formatOptions(field.options)}"
                        placeholder="${field.placeholder || ''}"
                        ?required="${field.required}"
                        ?disabled="${field.disabled}"
                        theme="${this.theme}"
                        @value-changed="${(e: any) => this._handleFieldChange(field.name, e.detail.value, field.validation)}"
                    ></as-complete>
                    ${error ? html`<div class="error-message">${error}</div>` : ''}
                `
            
            default:
                return html`<div>Unsupported field type: ${field.type}</div>`
        }
    }

    private _formatOptions(options: any) {
        if (!options) return ''
        return options.map((opt: any) => `label=${opt.label},value=${opt.value}`).join(';')
    }

    private _handleFieldChange(fieldName: any, value: any, validation: any) {
        this._formData = { ...this._formData, [fieldName]: value }
        
        // Clear previous error
        if (this._errors[fieldName]) {
            const newErrors = { ...this._errors }
            delete newErrors[fieldName]
            this._errors = newErrors
        }
        
        // Validate field if validation rules exist
        if (validation) {
            const result = this._formBuilder.validateField(value, validation)
            if (!result.valid) {
                this._errors = { ...this._errors, [fieldName]: result.message }
            }
        }
        
        this.dispatchEvent(new CustomEvent('field-change', {
            detail: { fieldName, value, formData: this._formData },
            bubbles: true,
            composed: true
        }))
    }

    private _handleSubmit() {
        // Validate all fields
        let hasErrors = false
        const newErrors = {}
        
        const allFields = [
            ...(this.schema.fields || []),
            ...(this.schema.sections?.flatMap((s: any) => s.fields) || [])
        ]
        
        allFields.forEach(field => {
            if (field.validation) {
                const value = (this._formData as any)[field.name] || ''
                const result = this._formBuilder.validateField(value, field.validation)
                if (!result.valid) {
                    (newErrors as any)[field.name] = result.message
                    hasErrors = true
                }
            }
        })
        
        this._errors = newErrors
        
        if (!hasErrors) {
            if (this.successMessage) {
                this.showNotification(this.successMessage)
            }
            this.dispatchEvent(new CustomEvent('form-submit', {
                detail: { formData: this._formData },
                bubbles: true,
                composed: true
            }))
        } else {
            if (this.errorMessage) {
                this.showNotification(this.errorMessage, 'error')
            }
        }
    }

    private _handleCancel() {
        this._cancelled = true
        this.dispatchEvent(new CustomEvent('form-cancel', {
            bubbles: true,
            composed: true
        }))
    }

    private _handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            this._handleCancel()
        } else if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            this._handleSubmit()
        }
    }

    private _focusFirstInput() {
        this.updateComplete.then(() => {
            const firstInput = this.shadowRoot?.querySelector('as-input, as-text, as-select, as-date, as-time, as-complete')
            if (firstInput && typeof (firstInput as any).focus === 'function') {
                (firstInput as any).focus()
            }
        })
    }

    override connectedCallback() {
        super.connectedCallback()
        document.addEventListener('keydown', this._handleKeyDown)
        this._focusFirstInput()
    }

    override disconnectedCallback() {
        super.disconnectedCallback()
        document.removeEventListener('keydown', this._handleKeyDown)
    }

    protected override render() {
        if (!this.schema || (!this.schema.fields && !this.schema.sections)) {
            return html`<div>No form schema provided</div>`
        }

        return html`
            <div class="form-container">
                ${this.schema.title && !this.hideTitle ? html`<h2 class="form-title">${this.schema.title}</h2>` : ''}
                
                ${this.schema.sections ? 
                    this.schema.sections.map((section: any) => html`
                        <div class="form-section">
                            ${section.title ? html`<h3 class="section-title">${section.title}</h3>` : ''}
                            ${section.fields?.map((field: any) => this._renderField(field))}
                        </div>
                    `) :
                    this.schema.fields?.map((field: any) => this._renderField(field))
                }
                
                ${!this.schema.skipActions ? html`
                    <div class="form-actions">
                        ${!this.schema.hideCancelButton ? html`
                            <as-button 
                                label="${this.schema.cancelLabel || 'Cancel'}"
                                variant="secondary"
                                theme="${this.theme}"
                                @button-tap="${this._handleCancel}"
                            ></as-button>
                        ` : ''}
                        <as-button 
                            label="${this.schema.submitLabel || 'Save'}"
                            variant="primary"
                            ?disabled="${this._cancelled}"
                            theme="${this.theme}"
                            @button-tap="${this._handleSubmit}"
                        ></as-button>
                    </div>
                ` : ''}
            </div>
        `
    }

    // Public API methods
    getFormData() {
        return { ...this._formData }
    }

    setFormData(data: any) {
        this._formData = { ...data }
        this.requestUpdate()
    }

    clearErrors() {
        this._errors = {}
        this.requestUpdate()
    }

    validate() {
        this._handleSubmit()
        return Object.keys(this._errors).length === 0
    }

    focus() {
        this._focusFirstInput()
    }

    showNotification(msg: string, type: 'success' | 'error' = 'success') {
        const notification = document.createElement('div')
        notification.textContent = msg
        const bgColor = type === 'error' ? '#dc2626' : '#059669'
        notification.style.cssText = `position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:${bgColor};color:white;padding:0.75rem 1.5rem;border-radius:4px;box-shadow:0 4px 6px rgba(0,0,0,0.1);z-index:9999;`
        document.body.appendChild(notification)
        setTimeout(() => notification.remove(), 3500)
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'as-form': AsForm
    }
}