import { render } from 'solid-js/web'
import { createSignal, For, createMemo } from 'solid-js'
import { Abstract } from './Abstract'

interface OptionItem {
  label: string
  value: string
}

class AsComplete extends HTMLElement {
  private dispose?: () => void
  private _filterTimer?: ReturnType<typeof setTimeout>
  private _abortController?: AbortController
  private _parsedCache: OptionItem[] = []

  connectedCallback() {
    const [label, setLabel] = createSignal(this.getAttribute('label') || '')
    const [, setValue] = createSignal(this.getAttribute('value') || '')
    const [options, setOptions] = createSignal(this.getAttribute('options') || '')
    const [src, setSrc] = createSignal(this.getAttribute('src') || '')
    const [readonly, setReadonly] = createSignal(this.hasAttribute('readonly'))
    const [disabled, setDisabled] = createSignal(this.hasAttribute('disabled'))
    const [rawFilter, setRawFilter] = createSignal('')
    const [filter, setFilter] = createSignal('')
    const [open, setOpen] = createSignal(false)
    const [loading, setLoading] = createSignal(false)

    // Fetch from src endpoint — abort previous if src changes
    const loadFromSrc = async (url: string) => {
      if (!url) return
      this._abortController?.abort()
      const controller = new AbortController()
      this._abortController = controller
      setLoading(true)
      try {
        const res = await fetch(url, { signal: controller.signal })
        const data = await res.json()
        if (controller.signal.aborted) return
        const list: OptionItem[] = (Array.isArray(data) ? data : []).map((item: any) => ({
          label: item.label || item.name || String(item),
          value: item.value ?? item.label ?? item.name ?? String(item)
        }))
        this._parsedCache = list
        // Force items memo to re-evaluate by toggling options signal
        setOptions('__SRC__' + Date.now())
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        console.error('as-complete fetch error:', err)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    // Memoized: options from string or from cache (populated by src fetch)
    const items = createMemo(() => {
      const raw = options()
      // When src is active, options holds a cache-busting marker; return cached data
      if (src()) {
        return this._parsedCache
      }
      this._parsedCache = (new Abstract()).planeDeserialize(raw || 'label=A,value=A;label=B,value=B;label=C,value=C')
      return this._parsedCache
    })

    // Memoized: filtered subset — only recomputes when filter or items change
    const filtered = createMemo(() => {
      const f = filter().toLowerCase()
      if (!f) return items()
      return items().filter(i => i.label.toLowerCase().includes(f))
    })

    // Auto-fetch on mount if src is present (and no items loaded yet)
    const initialSrc = this.getAttribute('src')
    if (initialSrc) {
      loadFromSrc(initialSrc)
    }

    // Observar cambios en atributos
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        if (m.type !== 'attributes') return
        const a = m.attributeName
        if (a === 'label') setLabel(this.getAttribute('label') || '')
        if (a === 'value') setValue(this.getAttribute('value') || '')
        if (a === 'options') {
          setOptions(this.getAttribute('options') || '')
          setFilter('')
          setRawFilter('')
        }
        if (a === 'src') {
          const newSrc = this.getAttribute('src') || ''
          setSrc(newSrc)
          if (newSrc) loadFromSrc(newSrc)
        }
        if (a === 'readonly') setReadonly(this.hasAttribute('readonly'))
        if (a === 'disabled') setDisabled(this.hasAttribute('disabled'))
      })
    })
    observer.observe(this, { attributes: true })

    // Debounced filter: 150ms wait so rapid typing doesn't churn
    const onInput = (e: Event) => {
      const val = (e.target as HTMLInputElement).value
      setRawFilter(val)
      clearTimeout(this._filterTimer)
      this._filterTimer = setTimeout(() => {
        setFilter(val)
        setOpen(true)
      }, 150)
    }

    const selectOption = (item: OptionItem) => {
      setValue(item.value)
      setRawFilter(item.label)
      setFilter(item.label)
      setOpen(false)
      this.dispatchEvent(new CustomEvent('value-changed', {
        detail: { value: item.value },
        bubbles: true,
        composed: true
      }))
    }

    const Component = () => (
      <>
        <style>{`
          :host {
            display: block;
            position: relative;
            font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif;
          }
          .field {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }
          label {
            font-size: 0.875rem;
            font-weight: 500;
            color: #374151;
          }
          input {
            padding: 0.5rem 0.75rem;
            border: 1px solid transparent;
            border-radius: 4px;
            font-size: 0.9375rem;
            font-family: inherit;
            background: #e8eaed;
            color: #1a1a1a;
            outline: none;
            transition: border-color 0.15s;
          }
          input:focus { border-color: #1676f3; }
          input::placeholder { color: #737373; }
          .dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            max-height: 240px;
            overflow-y: auto;
            background: white;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            margin-top: 0.25rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10;
          }
          .option {
            padding: 0.5rem 0.75rem;
            cursor: pointer;
            font-size: 0.9375rem;
            color: #1f2937;
          }
          .option:hover { background: #f3f4f6; }
          .loading-msg {
            padding: 0.75rem;
            text-align: center;
            font-size: 0.875rem;
            color: #9ca3af;
          }
          :host([theme="dark"]) label { color: #f3f4f6; }
          :host([theme="dark"]) .dropdown {
            background: #1f2937;
            border-color: #4b5563;
          }
          :host([theme="dark"]) .option { color: #f3f4f6; }
          :host([theme="dark"]) .option:hover { background: #374151; }
        `}</style>
        <div class="field">
          {label() && <label>{label()}</label>}
          <input
            type="text"
            value={rawFilter()}
            placeholder={label() || 'Buscar...'}
            readonly={readonly()}
            disabled={disabled()}
            onInput={onInput}
            onFocus={() => { if (rawFilter()) setOpen(true) }}
            onBlur={() => setTimeout(() => setOpen(false), 200)}
          />
          {open() && loading() && (
            <div class="dropdown">
              <div class="loading-msg">Loading…</div>
            </div>
          )}
          {open() && !loading() && filtered().length > 0 && (
            <div class="dropdown">
              <For each={filtered()}>
                {(item) => (
                  <div class="option" onMouseDown={(e) => e.preventDefault()} onClick={() => selectOption(item)}>
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
    clearTimeout(this._filterTimer)
    this._abortController?.abort()
  }

  static get observedAttributes() {
    return ['label', 'value', 'options', 'src', 'theme', 'readonly', 'disabled']
  }
}

customElements.define('as-complete', AsComplete)