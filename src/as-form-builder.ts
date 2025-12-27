/**
 * CUI Form Builder - Exportable logic for client applications
 * Provides schema-based form generation using CUI components
 */

export class AsFormBuilder {
    validators: Map<string, any>
    config: any

    constructor(options: any = {}) {
        this.validators = new Map()
        this.config = {
            autoValidation: options.autoValidation !== false,
            customValidators: options.customValidators || {},
            ...options
        }
        this.init()
    }

    init() {
        this.setupDefaultValidators()
        this.setupCustomValidators()
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

        this.validators.set('number', {
            validate: (value: any) => !value || !isNaN(Number(value)),
            message: 'Please enter a valid number'
        })

        this.validators.set('positive', {
            validate: (value: any) => !value || Number(value) > 0,
            message: 'Please enter a positive number'
        })

        this.validators.set('url', {
            validate: (value: any) => !value || /^https?:\/\/.+/.test(value),
            message: 'Please enter a valid URL'
        })

        this.validators.set('pattern', {
            validate: (value: any, param: any) => !value || new RegExp(param).test(value),
            message: (param: any) => `Value must match pattern: ${param}`
        })

        this.validators.set('enum', {
            validate: (value: any, param: any) => !value || param.split(',').includes(value),
            message: (param: any) => `Value must be one of: ${param.replace(/,/g, ', ')}`
        })

        this.validators.set('password', {
            validate: (value: any) => !value || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value),
            message: 'Password must be at least 8 characters with uppercase, lowercase and number'
        })
    }

    setupCustomValidators() {
        Object.entries(this.config.customValidators).forEach(([name, validator]) => {
            this.validators.set(name, validator)
        })
    }

    addValidator(name: any, validator: any) {
        this.validators.set(name, validator)
    }

    validateField(value: any, rules: any) {
        if (!rules || !Array.isArray(rules)) return { valid: true }
        
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

    validateForm(formData: any, schema: any) {
        const errors = {}
        const allFields = this.getAllFields(schema)
        
        allFields.forEach((field: any) => {
            if (field.validation) {
                const value = formData[field.name] || ''
                const result = this.validateField(value, field.validation)
                if (!result.valid) {
                    (errors as any)[field.name] = result.message
                }
            }
        })
        
        return {
            valid: Object.keys(errors).length === 0,
            errors
        }
    }

    getAllFields(schema: any) {
        const fields = []
        
        if (schema.fields) {
            fields.push(...schema.fields)
        }
        
        if (schema.sections) {
            schema.sections.forEach((section: any) => {
                if (section.fields) {
                    fields.push(...section.fields)
                }
            })
        }
        
        return fields
    }

    createFormSchema(config: any) {
        return {
            title: config.title || '',
            sections: config.sections || null,
            fields: config.fields || [],
            submitLabel: config.submitLabel || 'Save',
            cancelLabel: config.cancelLabel || 'Cancel',
            hideCancelButton: config.hideCancelButton || false,
            skipActions: config.skipActions || false,
            ...config
        }
    }

    // Helper methods for common form patterns
    createUserFormSchema(userData: any = {}) {
        return this.createFormSchema({
            title: 'User Information',
            fields: [
                {
                    name: 'username',
                    type: 'text',
                    label: 'Username',
                    value: userData.username || '',
                    required: true,
                    validation: ['required', 'min:3']
                },
                {
                    name: 'email',
                    type: 'email',
                    label: 'Email',
                    value: userData.email || '',
                    required: true,
                    validation: ['required', 'email']
                },
                {
                    name: 'firstName',
                    type: 'text',
                    label: 'First Name',
                    value: userData.firstName || '',
                    required: true,
                    validation: ['required']
                },
                {
                    name: 'lastName',
                    type: 'text',
                    label: 'Last Name',
                    value: userData.lastName || '',
                    required: true,
                    validation: ['required']
                },
                {
                    name: 'enabled',
                    type: 'switch',
                    label: 'Account Enabled',
                    value: userData.enabled !== undefined ? userData.enabled : true
                }
            ]
        })
    }

    createContactFormSchema(contactData: any = {}) {
        return this.createFormSchema({
            title: 'Contact Information',
            sections: [
                {
                    title: 'Personal Information',
                    fields: [
                        {
                            name: 'name',
                            type: 'text',
                            label: 'Full Name',
                            value: contactData.name || '',
                            required: true,
                            validation: ['required', 'min:2']
                        },
                        {
                            name: 'email',
                            type: 'email',
                            label: 'Email Address',
                            value: contactData.email || '',
                            required: true,
                            validation: ['required', 'email']
                        },
                        {
                            name: 'phone',
                            type: 'text',
                            label: 'Phone Number',
                            value: contactData.phone || '',
                            placeholder: '+1 (555) 123-4567'
                        }
                    ]
                },
                {
                    title: 'Message',
                    fields: [
                        {
                            name: 'subject',
                            type: 'select',
                            label: 'Subject',
                            value: contactData.subject || '',
                            required: true,
                            validation: ['required'],
                            options: [
                                { label: 'General Inquiry', value: 'general' },
                                { label: 'Support Request', value: 'support' },
                                { label: 'Bug Report', value: 'bug' },
                                { label: 'Feature Request', value: 'feature' }
                            ]
                        },
                        {
                            name: 'message',
                            type: 'textarea',
                            label: 'Message',
                            value: contactData.message || '',
                            required: true,
                            validation: ['required', 'min:10'],
                            rows: 5,
                            placeholder: 'Please describe your inquiry...'
                        }
                    ]
                }
            ]
        })
    }

    createSettingsFormSchema(settingsData: any = {}) {
        return this.createFormSchema({
            title: 'Application Settings',
            sections: [
                {
                    title: 'General Settings',
                    fields: [
                        {
                            name: 'appName',
                            type: 'text',
                            label: 'Application Name',
                            value: settingsData.appName || '',
                            required: true,
                            validation: ['required']
                        },
                        {
                            name: 'theme',
                            type: 'radio',
                            label: 'Theme',
                            value: settingsData.theme || 'light',
                            options: [
                                { label: 'Light', value: 'light' },
                                { label: 'Dark', value: 'dark' },
                                { label: 'Auto', value: 'auto' }
                            ]
                        }
                    ]
                },
                {
                    title: 'Notifications',
                    fields: [
                        {
                            name: 'emailNotifications',
                            type: 'switch',
                            label: 'Email Notifications',
                            value: settingsData.emailNotifications !== undefined ? settingsData.emailNotifications : true
                        },
                        {
                            name: 'pushNotifications',
                            type: 'switch',
                            label: 'Push Notifications',
                            value: settingsData.pushNotifications !== undefined ? settingsData.pushNotifications : false
                        }
                    ]
                }
            ]
        })
    }

    // Utility methods
    formatOptionsString(options: any) {
        if (!options || !Array.isArray(options)) return ''
        return options.map(opt => `label=${opt.label},value=${opt.value}`).join(';')
    }

    parseOptionsString(optionsString: any) {
        if (!optionsString) return []
        return optionsString.split(';').map((opt: any) => {
            const [labelPart, valuePart] = opt.split(',')
            return {
                label: labelPart.replace('label=', ''),
                value: valuePart.replace('value=', '')
            }
        })
    }

    // Form data processing
    processFormData(formData: any, schema: any) {
        const processed = { ...formData }
        const allFields = this.getAllFields(schema)
        
        allFields.forEach(field => {
            const value = processed[field.name]
            
            // Type conversions
            if (field.type === 'number' && value) {
                processed[field.name] = Number(value)
            } else if (field.type === 'checkbox' || field.type === 'switch') {
                processed[field.name] = Boolean(value)
            }
        })
        
        return processed
    }
}

// Export for different module systems
export default AsFormBuilder

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    (window as any).AsFormBuilder = AsFormBuilder
}