import { render } from 'solid-js/web'
import { createSignal, For, onCleanup } from 'solid-js'
import { Abstract } from './Abstract'

class AsPopup extends HTMLElement {
  private dispose?: () => void
  private _options: string = 'label=Editar,value=edit;label=Duplicar,value=duplicate;label=Eliminar,value=delete'
  public _currentRow: any = null

  connectedCallback() {
    const [options, setOptions] = createSignal(this._options)
    const [theme] = createSignal(this.getAttribute('theme') || '')
    const [open, setOpen] = createSignal(false)
    const [x, setX] = createSignal(0)
    const [y, setY] = createSignal(0)
    const [showConfirm, setShowConfirm] = createSignal(false)
    const [pendingItem, setPendingItem] = createSignal<any>(null)
    
    // Modal element outside shadow DOM
    let modalElement: HTMLElement | null = null

    const items = () => (new Abstract()).planeDeserialize(options())

    const show = (xPos: number, yPos: number) => {
      // Calcular posición inteligente
      const viewportHeight = window.innerHeight
      const popupWidth = 150 // Ancho estimado del popup
      const popupHeight = items().length * 40 // Alto estimado del popup
      
      // Ajustar X (preferir hacia la izquierda)
      let adjustedX = xPos - popupWidth
      if (adjustedX < 10) {
        adjustedX = xPos + 10
      }
      
      // Ajustar Y (detectar si debe ir hacia arriba)
      let adjustedY = yPos + 10
      if (yPos + popupHeight > viewportHeight - 20) {
        adjustedY = yPos - popupHeight - 10
      }
      
      setX(adjustedX)
      setY(adjustedY)
      setOpen(true)
      setTimeout(() => addOutsideClickListener(), 0)
    }

    const hide = () => {
      setOpen(false)
      removeOutsideClickListener()
    }

    const isDangerOption = (value: string) => {
      const dangerKeywords = ['delete', 'remove', 'destroy', 'eliminar', 'borrar']
      return dangerKeywords.some(keyword => value.toLowerCase().includes(keyword))
    }

    const handleOptionClick = (item: any) => {
      if (isDangerOption(item.value)) {
        setPendingItem(item)
        setShowConfirm(true)
        showModalOutside()
      } else {
        executeOption(item)
      }
    }

    const showModalOutside = () => {
      if (modalElement) {
        document.body.removeChild(modalElement)
      }
      
      modalElement = document.createElement('div')
      modalElement.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000; font-family: -apple-system, BlinkMacSystemFont, 'Roboto', 'Segoe UI', Helvetica, Arial, sans-serif;">
          <div style="background: white; border-radius: 8px; padding: 1.5rem; min-width: 300px; max-width: 500px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); font-family: -apple-system, BlinkMacSystemFont, 'Roboto', 'Segoe UI', Helvetica, Arial, sans-serif;">
            <div style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem; color: #1f2937;">Confirmar acción</div>
            <div style="margin-bottom: 1.5rem; color: #4b5563; font-size: 0.9375rem;">¿Estás seguro de que deseas ${pendingItem()?.label?.toLowerCase()}?</div>
            <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
              <button id="cancel-btn" style="padding: 0.5rem 1rem; background: #e5e7eb; color: #1f2937; border: none; border-radius: 4px; font-size: 0.9375rem; cursor: pointer; font-family: -apple-system, BlinkMacSystemFont, 'Roboto', 'Segoe UI', Helvetica, Arial, sans-serif;">Cancelar</button>
              <button id="confirm-btn" style="padding: 0.5rem 1rem; background: #ef4444; color: white; border: none; border-radius: 4px; font-size: 0.9375rem; cursor: pointer; font-family: -apple-system, BlinkMacSystemFont, 'Roboto', 'Segoe UI', Helvetica, Arial, sans-serif;">${pendingItem()?.label}</button>
            </div>
          </div>
        </div>
      `
      
      const cancelBtn = modalElement.querySelector('#cancel-btn')
      const confirmBtn = modalElement.querySelector('#confirm-btn')
      
      cancelBtn?.addEventListener('click', () => {
        cancelAction()
        hideModalOutside()
      })
      
      confirmBtn?.addEventListener('click', () => {
        confirmAction()
        hideModalOutside()
      })
      
      modalElement.addEventListener('click', (e) => {
        if (e.target === modalElement) {
          cancelAction()
          hideModalOutside()
        }
      })
      
      document.body.appendChild(modalElement)
    }
    
    const hideModalOutside = () => {
      if (modalElement && document.body.contains(modalElement)) {
        document.body.removeChild(modalElement)
        modalElement = null
      }
    }

    const executeOption = (item: any) => {
      this.dispatchEvent(new CustomEvent('option-select', {
        detail: { value: item.value, label: item.label },
        bubbles: true,
        composed: true
      }))
      hide()
    }

    const confirmAction = () => {
      const item = pendingItem()
      if (item) {
        executeOption(item)
        setPendingItem(null)
      }
      setShowConfirm(false)
      hideModalOutside()
    }

    const cancelAction = () => {
      setShowConfirm(false)
      setPendingItem(null)
      hideModalOutside()
      hide()
    }

    const outsideClickHandler = (e: Event) => {
      const target = e.target as Element
      if (!target.closest('as-popup') && !showConfirm()) {
        hide()
      }
    }

    const addOutsideClickListener = () => {
      document.addEventListener('click', outsideClickHandler)
    }

    const removeOutsideClickListener = () => {
      document.removeEventListener('click', outsideClickHandler)
    }

    // Exponer métodos públicos
    ;(this as any).show = show
    ;(this as any).hide = hide
    ;(this as any).updateOptions = (newOptions: string) => {
      this._options = newOptions
      setOptions(newOptions)
    }

    onCleanup(() => {
      removeOutsideClickListener()
    })

    const Component = () => (
      <>
        <style>{`
          :host {
            position: fixed;
            z-index: 1000;
            pointer-events: none;
          }
          .popup {
            background: ${theme() === 'dark' ? '#1f2937' : 'white'};
            border: 1px solid ${theme() === 'dark' ? '#374151' : '#ccc'};
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            min-width: 140px;
            font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif;
            pointer-events: auto;
          }
          .option {
            padding: 0.5rem 0.75rem;
            cursor: pointer;
            font-size: 0.9375rem;
            color: ${theme() === 'dark' ? '#f3f4f6' : '#1f2937'};
            border-bottom: 1px solid ${theme() === 'dark' ? '#374151' : '#eee'};
            transition: background-color 0.15s;
          }
          .option:last-child {
            border-bottom: none;
          }
          .option:hover {
            background-color: ${theme() === 'dark' ? '#1e3a5f' : '#e0f2fe'};
          }
          .option.danger {
            color: #dc2626;
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
            font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif;
          }
          .dialog {
            background: ${theme() === 'dark' ? '#1f2937' : 'white'};
            border-radius: 8px;
            padding: 1.5rem;
            min-width: 300px;
            max-width: 500px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif;
          }
          .dialog-header {
            font-size: 1.125rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: ${theme() === 'dark' ? '#f3f4f6' : '#1f2937'};
          }
          .dialog-content {
            margin-bottom: 1.5rem;
            color: ${theme() === 'dark' ? '#d1d5db' : '#4b5563'};
            font-size: 0.9375rem;
          }
          .dialog-actions {
            display: flex;
            gap: 0.5rem;
            justify-content: flex-end;
          }
          .btn-cancel {
            padding: 0.5rem 1rem;
            background: #e5e7eb;
            color: #1f2937;
            border: none;
            border-radius: 4px;
            font-size: 0.9375rem;
            cursor: pointer;
            font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif;
          }
          .btn-confirm {
            padding: 0.5rem 1rem;
            background: #ef4444;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 0.9375rem;
            cursor: pointer;
            font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif;
          }
        `}</style>
        <div style={`position: fixed; left: ${x()}px; top: ${y()}px; z-index: 1000;`}>
          {open() && (
            <div class="popup">
              <For each={items()}>
                {(item) => (
                  <div 
                    class={`option ${isDangerOption(item.value) ? 'danger' : ''}`}
                    data-value={item.value}
                    onClick={() => handleOptionClick(item)}
                  >
                    {item.label}
                  </div>
                )}
              </For>
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

  set options(value: string) {
    this._options = value
    ;(this as any).updateOptions?.(value)
  }

  get options() {
    return this._options
  }

  show(x: number, y: number) {
    ;(this as any).show?.(x, y)
  }

  hide() {
    ;(this as any).hide?.()
  }
}

customElements.define('as-popup', AsPopup)