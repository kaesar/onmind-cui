/// <reference types="solid-js" />

declare module 'solid-js' {
  namespace JSX {
    interface IntrinsicElements {
      'as-input': {
        label?: string
        value?: string
        placeholder?: string
        kind?: 'text' | 'email' | 'password' | 'number'
        theme?: 'light' | 'dark'
        readonly?: boolean
        disabled?: boolean
        required?: boolean
        onValueChanged?: (e: CustomEvent<{ value: string }>) => void
        'on:value-changed'?: (e: CustomEvent<{ value: string }>) => void
      }
      'as-text': {
        label?: string
        value?: string
        placeholder?: string
        rows?: number
        theme?: 'light' | 'dark'
        readonly?: boolean
        disabled?: boolean
        required?: boolean
        onValueChanged?: (e: CustomEvent<{ value: string }>) => void
        'on:value-changed'?: (e: CustomEvent<{ value: string }>) => void
      }
      'as-select': {
        label?: string
        value?: string
        options?: string
        theme?: 'light' | 'dark'
        readonly?: boolean
        disabled?: boolean
        required?: boolean
        onValueChanged?: (e: CustomEvent<{ value: string }>) => void
        'on:value-changed'?: (e: CustomEvent<{ value: string }>) => void
      }
      'as-complete': {
        label?: string
        value?: string
        options?: string
        theme?: 'light' | 'dark'
        readonly?: boolean
        disabled?: boolean
        required?: boolean
        onValueChanged?: (e: CustomEvent<{ value: string }>) => void
        'on:value-changed'?: (e: CustomEvent<{ value: string }>) => void
      }
      'as-date': {
        label?: string
        value?: string
        placeholder?: string
        theme?: 'light' | 'dark'
        readonly?: boolean
        disabled?: boolean
        required?: boolean
        onValueChanged?: (e: CustomEvent<{ value: string }>) => void
        'on:value-changed'?: (e: CustomEvent<{ value: string }>) => void
      }
      'as-time': {
        label?: string
        value?: string
        placeholder?: string
        theme?: 'light' | 'dark'
        readonly?: boolean
        disabled?: boolean
        required?: boolean
        onValueChanged?: (e: CustomEvent<{ value: string }>) => void
        'on:value-changed'?: (e: CustomEvent<{ value: string }>) => void
      }
      'as-check': {
        label?: string
        checked?: boolean
        theme?: 'light' | 'dark'
        readonly?: boolean
        disabled?: boolean
        required?: boolean
        onCheckedChanged?: (e: CustomEvent<{ value: boolean }>) => void
        'on:checked-changed'?: (e: CustomEvent<{ value: boolean }>) => void
      }
      'as-switch': {
        label?: string
        checked?: boolean
        theme?: 'light' | 'dark'
        readonly?: boolean
        disabled?: boolean
        required?: boolean
        onCheckedChanged?: (e: CustomEvent<{ value: boolean }>) => void
        'on:checked-changed'?: (e: CustomEvent<{ value: boolean }>) => void
      }
      'as-radio': {
        label?: string
        value?: string
        options?: string
        theme?: 'light' | 'dark'
        readonly?: boolean
        disabled?: boolean
        required?: boolean
        onValueChanged?: (e: CustomEvent<{ value: string }>) => void
        'on:value-changed'?: (e: CustomEvent<{ value: string }>) => void
      }
      'as-upload': {
        label?: string
        accept?: string
        multiple?: boolean
        theme?: 'light' | 'dark'
        disabled?: boolean
        required?: boolean
        onFilesSelected?: (e: CustomEvent<{ files: File[] }>) => void
        'on:files-selected'?: (e: CustomEvent<{ files: File[] }>) => void
      }
      'as-box': {
        dim?: 'true' | 'false'
        theme?: 'light' | 'dark'
      }
      'as-modal': {
        title?: string
        theme?: 'light' | 'dark'
      }
      'as-datagrid': {
        selectable?: boolean
        pageable?: boolean
        filterable?: boolean
        actionable?: boolean
        theme?: 'light' | 'dark'
        title?: string
        pageSize?: number
      }
      'as-image': {
        url?: string
      }
      'as-video': {
        url?: string
        width?: number
        height?: number
      }
      'as-embed': {
        url?: string
        width?: number
        height?: number
      }
      'as-button': {
        label?: string
        link?: string
        message?: string
        variant?: 'primary' | 'secondary'
        disabled?: boolean
        onButtonTap?: () => void
        'on:button-tap'?: () => void
      }
      'as-confirm': {
        label?: string
        link?: string
        message?: string
        onConfirmTap?: () => void
        'on:confirm-tap'?: () => void
      }
      'as-event': {
        label?: string
        value?: string
        placeholder?: string
        event?: string
        theme?: 'light' | 'dark'
        readonly?: boolean
        disabled?: boolean
      }
      'as-index': {
        title?: string
        src?: string
        lang?: string
        filtering?: boolean
        theme?: 'light' | 'dark'
        items?: any[]
        onCardClick?: (e: CustomEvent<{ item: any }>) => void
        'on:card-click'?: (e: CustomEvent<{ item: any }>) => void
      }
      'as-popup': {
        options?: string
        theme?: 'light' | 'dark'
        onOptionSelect?: (e: CustomEvent<{ value: string, label: string }>) => void
        'on:option-select'?: (e: CustomEvent<{ value: string, label: string }>) => void
      }
      'as-form': {
        schema?: any
        theme?: 'light' | 'dark'
        successMessage?: string
        errorMessage?: string
        hideTitle?: boolean
        onFormSubmit?: (e: CustomEvent<{ formData: any }>) => void
        'on:form-submit'?: (e: CustomEvent<{ formData: any }>) => void
        onFormCancel?: (e: CustomEvent) => void
        'on:form-cancel'?: (e: CustomEvent) => void
        onFieldChange?: (e: CustomEvent<{ fieldName: string, value: any, formData: any }>) => void
        'on:field-change'?: (e: CustomEvent<{ fieldName: string, value: any, formData: any }>) => void
      }
    }
  }
}

export {}