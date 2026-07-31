import { render } from 'solid-js/web'
import { createSignal, For, createMemo } from 'solid-js'
import { createThemeSync } from './theme-sync'

interface Column {
  key: string
  header: string
}

class AsDatagrid extends HTMLElement {
  private dispose?: () => void
  private themeCleanup?: () => void
  private _data: any[] = []
  private _columns: Column[] = []
  private _filterTimer?: ReturnType<typeof setTimeout>

  connectedCallback() {
    const [data, setData] = createSignal(this._data)
    const [columns, setColumns] = createSignal(this._columns)
    const [pageSize] = createSignal(parseInt(this.getAttribute('pageSize') || '50'))
    const [title] = createSignal(this.getAttribute('title') || '')
    const [selectable, setSelectable] = createSignal(this.hasAttribute('selectable'))
    const [pageable, setPageable] = createSignal(this.hasAttribute('pageable'))
    const [filterable, setFilterable] = createSignal(this.hasAttribute('filterable'))
    const [actionable, setActionable] = createSignal(this.hasAttribute('actionable'))

    // Raw filter value (immediate from input), debounced filter (used for computation)
    const [rawFilter, setRawFilter] = createSignal('')
    const [filter, setFilter] = createSignal('')
    const [sortKey, setSortKey] = createSignal<string | null>(null)
    const [sortDir, setSortDir] = createSignal(1)
    const [page, setPage] = createSignal(0)
    const [selectedRow, setSelectedRow] = createSignal<any>(null)

    // Debounce filter: waits 300ms after last keystroke before updating computation
    const onFilterInput = (e: Event) => {
      const val = (e.target as HTMLInputElement).value
      setRawFilter(val)
      clearTimeout(this._filterTimer)
      this._filterTimer = setTimeout(() => {
        setFilter(val)
        setPage(0)
      }, 300)
    }

    // Observer para cambios de atributos
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          const attrName = mutation.attributeName
          if (attrName === 'selectable') setSelectable(this.hasAttribute('selectable'))
          if (attrName === 'pageable') setPageable(this.hasAttribute('pageable'))
          if (attrName === 'filterable') setFilterable(this.hasAttribute('filterable'))
          if (attrName === 'actionable') setActionable(this.hasAttribute('actionable'))
        }
      })
    })
    observer.observe(this, { attributes: true })

    // ── Memoized data pipeline ──────────────────────────────────
    // Only re-execute each step when its direct dependencies change.

    const filteredData = createMemo(() => {
      const f = filter().toLowerCase()
      if (!f) return data()
      return data().filter(row =>
        Object.values(row).some(v => String(v).toLowerCase().includes(f))
      )
    })

    const sortedData = createMemo(() => {
      const d = filteredData()
      const key = sortKey()
      if (!key) return d
      const dir = sortDir()
      return [...d].sort((a, b) => {
        const av = a[key]
        const bv = b[key]
        return av < bv ? -dir : av > bv ? dir : 0
      })
    })

    const paginatedData = createMemo(() => {
      if (!pageable()) return sortedData()
      const start = page() * pageSize()
      return sortedData().slice(start, start + pageSize())
    })

    const total = createMemo(() => sortedData().length)
    const pages = createMemo(() => Math.ceil(total() / pageSize()))
    const rows = createMemo(() => paginatedData())

    // ── Actions ─────────────────────────────────────────────────

    const sort = (key: string) => {
      if (sortKey() === key) {
        setSortDir(d => d === 1 ? -1 : 1)
      } else {
        setSortKey(key)
        setSortDir(1)
      }
    }

    const selectRow = (row: any) => {
      if (!selectable()) return
      this.dispatchEvent(new CustomEvent('row-select', {
        detail: { row, id: row?.id },
        bubbles: true,
        composed: true
      }))
    }

    // ── Exposed setters ─────────────────────────────────────────

    ;(this as any).updateData = (newData: any[]) => {
      this._data = newData
      setData(newData)
      setPage(0)
      setFilter('')
      setRawFilter('')
    }
    ;(this as any).updateColumns = (newColumns: Column[]) => {
      this._columns = newColumns
      setColumns(newColumns)
    }

    // ── Component ───────────────────────────────────────────────

    const Component = () => (
      <>
        <style>{`
          :host { display: block; }
          .container {
            border-radius: 0.5rem;
            box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1);
            overflow: hidden;
            background: #ffffff;
            color: #1f2937;
            font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif;
          }
          :host([theme="dark"]) .container {
            background: #1f2937;
            color: #f3f4f6;
          }
          .header {
            padding: 1rem 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .title {
            font-size: 1.25rem;
            font-weight: 600;
          }
          .filter-input {
            width: 160px;
            padding: 0.5rem 0.75rem;
            border: 1px solid transparent;
            border-radius: 4px;
            font-size: 0.9375rem;
            outline: none;
            background: #f5f5f5;
            color: #1f2937;
          }
          .filter-input:focus {
            border-color: #1676f3;
          }
          :host([theme="dark"]) .filter-input {
            background: #374151;
            color: #f3f4f6;
          }
          :host([theme="dark"]) .filter-input:focus {
            border-color: #1676f3;
          }
          .table-wrapper { overflow-x: auto; }
          table { width: 100%; border-collapse: collapse; }
          thead {
            background: #f9fafb;
            border-bottom: 1px solid #e5e7eb;
          }
          :host([theme="dark"]) thead {
            background: #111827;
            border-bottom-color: #374151;
          }
          th {
            padding: 0.5rem 0.25rem;
            text-align: left;
            font-size: 0.75rem;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            cursor: pointer;
            user-select: none;
          }
          td {
            padding: 0.5rem 0.25rem;
            font-size: 0.9375rem;
            border-bottom: 1px solid #e5e7eb;
          }
          :host([theme="dark"]) td {
            border-bottom-color: #374151;
          }
          tbody tr:nth-child(even) { background: #f9fafb; }
          :host([theme="dark"]) tbody tr:nth-child(even) { background: #111827; }
          tbody tr:hover { background: #e0f2fe; }
          :host([theme="dark"]) tbody tr:hover { background: #1e3a5f; }
          tbody tr.selectable { cursor: pointer; }
          tbody tr.selected { background: #dbeafe !important; }
          :host([theme="dark"]) tbody tr.selected { background: #1d4ed8 !important; }
          td.first-col { border-left: 3px solid transparent; }
          tbody tr.selected td.first-col { border-left-color: #1676f3; }
          th.action-col, td.action-col { width: 0.5rem; text-align: center; padding: 0; }
          .action-btn {
            background: transparent;
            border: none;
            cursor: pointer;
            font-size: 1.25rem;
            padding: 0 0.25rem;
            border-radius: 4px;
            line-height: 1;
            color: #1f2937;
          }
          :host([theme="dark"]) .action-btn { color: #f3f4f6; }
          .action-btn:hover { background: rgba(0,0,0,0.08); }
          :host([theme="dark"]) .action-btn:hover { background: rgba(255,255,255,0.12); }
          .pagination {
            padding: 0.6rem 0.5rem;
            border-top: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.875rem;
          }
          :host([theme="dark"]) .pagination { border-top-color: #374151; }
          .pagination-controls { display: flex; gap: 0.5rem; align-items: center; }
          .page-btn {
            padding: 0.5rem 1rem;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            background: #ffffff;
            color: #1f2937;
            cursor: pointer;
            font-family: inherit;
            font-size: 0.875rem;
          }
          :host([theme="dark"]) .page-btn {
            border-color: #4b5563;
            background: #374151;
            color: #f3f4f6;
          }
          .page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
          .page-btn:hover:not(:disabled) { background: #f3f4f6; }
          :host([theme="dark"]) .page-btn:hover:not(:disabled) { background: #4b5563; }
        `}</style>

        <div class="container">
          {(title() || filterable()) && (
            <div class="header">
              <div class="title">{title()}</div>
              {filterable() && (
                <input
                  type="text"
                  class="filter-input"
                  placeholder="🔍"
                  value={rawFilter()}
                  onInput={onFilterInput}
                />
              )}
            </div>
          )}

          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <For each={columns()}>
                    {(col) => (
                      <th onClick={() => sort(col.key)}>
                        {col.header}
                        {sortKey() === col.key ? (sortDir() === 1 ? ' ↑' : ' ↓') : ''}
                      </th>
                    )}
                  </For>
                  {actionable() && <th class="action-col"></th>}
                </tr>
              </thead>
              <tbody>
                <For each={rows()}>
                  {(row) => (
                    <tr
                      class={`${selectable() ? 'selectable' : ''} ${selectedRow() === row ? 'selected' : ''}`}
                      onClick={() => { selectRow(row); setSelectedRow(row) }}
                    >
                      <For each={columns()}>
                        {(col, idx) => <td class={idx() === 0 ? 'first-col' : ''}>{row[col.key]}</td>}
                      </For>
                      {actionable() && (
                        <td class="action-col">
                          <button class="action-btn" onClick={(e) => {
                            e.stopPropagation()
                            this.dispatchEvent(new CustomEvent('row-action', {
                              detail: { row, id: row?.id, event: e },
                              bubbles: true,
                              composed: true
                            }))
                          }}>⋮</button>
                        </td>
                      )}
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>

          {pageable() && (
            <div class="pagination">
              <div># {total()}</div>
              <div class="pagination-controls">
                <button class="page-btn"
                  onClick={() => setPage(page() - 1)}
                  disabled={page() === 0}
                >&lt;</button>
                <span>{page() + 1} / {pages()}</span>
                <button class="page-btn"
                  onClick={() => setPage(page() + 1)}
                  disabled={page() >= pages() - 1}
                >&gt;</button>
              </div>
            </div>
          )}
        </div>
      </>
    )

    const shadowRoot = this.attachShadow({ mode: 'open' })
    this.dispose = render(Component, shadowRoot)

    // Sync with VitePress global theme
    this.themeCleanup = createThemeSync(this)
  }

  disconnectedCallback() {
    this.dispose?.()
    this.themeCleanup?.()
    clearTimeout(this._filterTimer)
  }

  set data(value: any[]) {
    this._data = value
    ;(this as any).updateData?.(value)
  }

  get data() {
    return this._data
  }

  set columns(value: Column[]) {
    this._columns = value
    ;(this as any).updateColumns?.(value)
  }

  get columns() {
    return this._columns
  }

  set selectable(value: boolean) {
    value ? this.setAttribute('selectable', '') : this.removeAttribute('selectable')
  }

  set filterable(value: boolean) {
    value ? this.setAttribute('filterable', '') : this.removeAttribute('filterable')
  }

  set pageable(value: boolean) {
    value ? this.setAttribute('pageable', '') : this.removeAttribute('pageable')
  }

  static get observedAttributes() {
    return ['selectable', 'pageable', 'filterable', 'actionable', 'theme', 'pageSize']
  }
}

customElements.define('as-datagrid', AsDatagrid)