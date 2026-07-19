import { render } from 'solid-js/web'
import { createSignal, For, createMemo } from 'solid-js'

interface CardItem {
  title?: string
  name?: string
  description?: string
  url?: string
  tags?: string[]
  hide?: boolean
  [key: string]: any
}

class AsCards extends HTMLElement {
  private dispose?: () => void
  private _items: CardItem[] = []
  private _setItems?: (val: CardItem[]) => void

  connectedCallback() {
    const [title, setTitle] = createSignal(this.getAttribute('title') || '')
    const [src, setSrc] = createSignal(this.getAttribute('src') || '')
    const [filtering, setFiltering] = createSignal(this.hasAttribute('filtering'))
    const [searchQuery, setSearchQuery] = createSignal('')
    const [selectedTags, setSelectedTags] = createSignal<string[]>([])
    const [items, setItems] = createSignal<CardItem[]>(this._items)
    const [loading, setLoading] = createSignal(false)

    // Expose setter so property setter can update signal
    this._setItems = setItems

    const allTags = createMemo(() =>
      [...new Set(items().flatMap(item => item.tags || []))].sort()
    )

    const filteredItems = createMemo(() =>
      items().filter(item => {
        const q = searchQuery().toLowerCase()
        const matchQuery = !q ||
          (item.title || item.name || '').toLowerCase().includes(q) ||
          (item.description || '').toLowerCase().includes(q)
        const matchTags = selectedTags().length === 0 ||
          selectedTags().every(tag => (item.tags || []).includes(tag))
        return matchQuery && matchTags
      })
    )

    const hasManyItems = () => items().length >= 18

    const loadData = async (url: string) => {
      if (!url) return
      setLoading(true)
      try {
        const res = await fetch(url)
        const data = await res.json()
        const list = (Array.isArray(data) ? data : [])
          .filter((e: CardItem) => !e.hide)
          .sort((a: CardItem, b: CardItem) =>
            (a.title || a.name || '').localeCompare(b.title || b.name || '')
          )
        this._items = list
        setItems(list)
      } catch (err) {
        console.error('as-cards fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    const fetchSrc = () => {
      const url = src()
      if (url && items().length === 0) loadData(url)
    }

    // React to attribute changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          const attr = mutation.attributeName
          if (attr === 'title') setTitle(this.getAttribute('title') || '')
          if (attr === 'src') { setSrc(this.getAttribute('src') || ''); fetchSrc() }
          if (attr === 'filtering') setFiltering(this.hasAttribute('filtering'))
        }
      })
    })
    observer.observe(this, { attributes: true })

    const onInput = (e: Event) => setSearchQuery((e.target as HTMLInputElement).value)

    const toggleTag = (tag: string) => {
      const current = selectedTags()
      setSelectedTags(
        current.includes(tag)
          ? current.filter(t => t !== tag)
          : [...current, tag]
      )
    }

    const onCardClick = (e: MouseEvent, item: CardItem) => {
      e.preventDefault()
      this.dispatchEvent(new CustomEvent('card-click', {
        detail: { item },
        bubbles: true,
        composed: true
      }))
      const url = item.url
      if (url) location.assign(url.replace('/doc/', '/').replace('.md', ''))
    }

    const Component = () => (
      <>
        <style>{`
          :host {
            display: block;
            font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif;
            margin-bottom: 2rem;
          }
          .header {
            text-align: ${hasManyItems() ? 'left' : 'center'};
            margin-bottom: 0.5rem;
          }
          .title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 0.5rem;
          }
          .filter-input {
            color: #1a1a1a;
            background: #e8eaed;
            display: inline-block;
            padding: 0.5rem 0.75rem;
            border-radius: 20px;
            border: 1px solid transparent;
            font-size: 0.9375rem;
            font-family: inherit;
            outline: none;
            transition: border-color 0.15s;
            width: 100%;
            max-width: 320px;
            box-sizing: border-box;
          }
          .filter-input:focus {
            border-color: #1676f3;
          }
          .filter-input::placeholder {
            color: #737373;
          }
          .tags-container {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-top: 0.75rem;
          }
          .tag {
            padding: 0.35rem 0.75rem;
            border-radius: 0.375rem;
            border: 1px solid transparent;
            background: #f3f4f6;
            color: #374151;
            font-size: 0.8125rem;
            font-family: inherit;
            cursor: pointer;
            transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
          }
          .tag:hover {
            background: #e5e7eb;
          }
          .tag.selected {
            background: #3b82f6;
            color: white;
            border-color: #3b82f6;
          }
          .grid {
            display: grid;
            padding-left: 0;
            padding-right: 0;
            gap: 1.5rem;
            grid-auto-rows: 12rem;
            grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
            margin-top: 1rem;
          }
          .card {
            border-radius: 5px;
            box-shadow: 0 3px 10px 0 #aaa;
            padding: 1rem;
            text-decoration: none;
            text-overflow: ellipsis;
            overflow: hidden;
            cursor: pointer;
            transition: transform 0.3s, box-shadow 0.3s;
            background: white;
            color: #1f2937;
            display: flex;
            flex-direction: column;
          }
          .card:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 14px 0 #1676f3;
            color: #1676f3;
          }
          .card-title {
            border-bottom: 0.1px solid #aaa;
            padding-bottom: 0.35rem;
            margin-bottom: 0.35rem;
            font-weight: 600;
            font-size: 0.9375rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #1676f3;
          }
          .card-desc {
            font-size: 0.8125rem;
            color: #6b7280;
            overflow: hidden;
            text-overflow: ellipsis;
            flex: 1;
          }
          .loading {
            text-align: center;
            padding: 2rem;
            color: #9ca3af;
          }
          .empty {
            text-align: center;
            padding: 2rem;
            color: #9ca3af;
          }
          :host([theme="dark"]) .title {
            color: #f3f4f6;
          }
          :host([theme="dark"]) .card {
            background: rgba(255,255,255,0.06);
            color: #e5e5e5;
            box-shadow: 0 2px 8px 0 rgba(0,0,0,0.4);
            backdrop-filter: blur(2px);
          }
          :host([theme="dark"]) .card:hover {
            transform: scale(1.03);
            box-shadow: 0 3px 12px 0 #3b82f6;
            color: #60a5fa;
          }
          :host([theme="dark"]) .card-desc {
            color: #9ca3af;
          }
          :host([theme="dark"]) .card-title {
            border-color: #4b5563;
            color: #60a5fa;
          }
          :host([theme="dark"]) .tag {
            background: transparent;
            border-color: #4b5563;
            color: #d1d5db;
          }
          :host([theme="dark"]) .tag:hover {
            background: rgba(255,255,255,0.08);
            border-color: #60a5fa;
          }
          :host([theme="dark"]) .tag.selected {
            background: #3b82f6;
            border-color: #3b82f6;
            color: white;
          }
          @media (max-width: 580px) {
            .grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>

        <div class="header" style={{ display: filtering() && hasManyItems() ? 'block' : 'none' }}>
          {title() && <div class="title">{title()}</div>}
          {filtering() && hasManyItems() && (
            <>
              <input
                type="text"
                class="filter-input"
                placeholder="🔍 ..."
                autocomplete="off"
                onInput={onInput}
              />
              <div class="tags-container">
                <For each={allTags()}>
                  {(tag) => (
                    <button
                      class={`tag ${selectedTags().includes(tag) ? 'selected' : ''}`}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </button>
                  )}
                </For>
              </div>
            </>
          )}
        </div>

        {loading() && <div class="loading">Loading…</div>}

        {!loading() && filteredItems().length === 0 && (
          <div class="empty">
            {items().length === 0 ? 'No items loaded.' : 'No matches found.'}
          </div>
        )}

        {!loading() && filteredItems().length > 0 && (
          <div class="grid">
            <For each={filteredItems()}>
              {(item) => (
                <a class="card" href={item.url || '#'} onClick={(e) => onCardClick(e, item)}>
                  <div class="card-title">{item.title || item.name || ''}</div>
                  <div class="card-desc">
                    {item.description || `About: ${item.name || item.title || ''}`}
                  </div>
                </a>
              )}
            </For>
          </div>
        )}
      </>
    )

    const shadowRoot = this.attachShadow({ mode: 'open' })
    this.dispose = render(Component, shadowRoot)

    // Auto-fetch if src attribute is present
    fetchSrc()
  }

  disconnectedCallback() {
    this.dispose?.()
  }

  set items(val: CardItem[]) {
    this._items = val
    this._setItems?.(val)
  }

  get items() {
    return this._items
  }

  static get observedAttributes() {
    return ['title', 'src', 'filtering', 'theme']
  }
}

customElements.define('as-cards', AsCards)