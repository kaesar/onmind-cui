import { render } from 'solid-js/web'
import { createSignal, For } from 'solid-js'

interface Column {
  key: string
  header: string
}

class AsDatagrid extends HTMLElement {
  private dispose?: () => void
  private _data: any[] = []
  private _columns: Column[] = []

  connectedCallback() {
    const [data, setData] = createSignal(this._data)
    const [columns, setColumns] = createSignal(this._columns)
    const [pageSize] = createSignal(parseInt(this.getAttribute('pageSize') || '15'))
    const [title] = createSignal(this.getAttribute('title') || '')
    const [theme] = createSignal(this.getAttribute('theme') || '')
    // Crear signals reactivos que se actualicen cuando cambien los atributos
    const [selectable, setSelectable] = createSignal(this.hasAttribute('selectable'))
    const [pageable, setPageable] = createSignal(this.hasAttribute('pageable'))
    const [filterable, setFilterable] = createSignal(this.hasAttribute('filterable'))
    const [actionable, setActionable] = createSignal(this.hasAttribute('actionable'))

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
    const [filter, setFilter] = createSignal('')
    const [sortKey, setSortKey] = createSignal<string | null>(null)
    const [sortDir, setSortDir] = createSignal(1)
    const [page, setPage] = createSignal(0)
    const [selectedRow, setSelectedRow] = createSignal<any>(null)

    const getFilteredData = () => {
      if (!filter()) return data()
      const f = filter().toLowerCase()
      return data().filter(row => 
        Object.values(row).some(v => String(v).toLowerCase().includes(f))
      )
    }

    const getSortedData = () => {
      const filtered = getFilteredData()
      if (!sortKey()) return filtered
      return [...filtered].sort((a, b) => {
        const key = sortKey()
        if (!key) return 0
        const av = a[key]
        const bv = b[key]
        return av < bv ? -sortDir() : av > bv ? sortDir() : 0
      })
    }

    const getPaginatedData = () => {
      const sorted = getSortedData()
      if (!pageable()) return sorted
      const start = page() * pageSize()
      return sorted.slice(start, start + pageSize())
    }

    const sort = (key: string) => {
      if (sortKey() === key) {
        setSortDir(sortDir() === 1 ? -1 : 1)
      } else {
        setSortKey(key)
        setSortDir(1)
      }
    }

    const selectRow = (row: any) => {
      if (!selectable()) return
      setSelectedRow(row)
      this.dispatchEvent(new CustomEvent('row-select', {
        detail: { row, id: row.id },
        bubbles: true,
        composed: true
      }))
    }

    const rows = () => getPaginatedData()
    const total = () => getSortedData().length
    const pages = () => Math.ceil(total() / pageSize())

    // Exponer métodos para actualizar data y columns
    ;(this as any).updateData = (newData: any[]) => {
      this._data = newData
      setData(newData)
    }
    ;(this as any).updateColumns = (newColumns: Column[]) => {
      this._columns = newColumns
      setColumns(newColumns)
    }

    const Component = () => (
      <>
        <style>{`
          :host {
            display: block;
          }
          .container {
            background: ${theme() === 'dark' ? '#1f2937' : 'white'};
            border-radius: 0.5rem;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
            overflow: hidden;
            color: ${theme() === 'dark' ? '#f3f4f6' : '#1f2937'};
            font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif;
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
            border: none;
            border-radius: 4px;
            font-size: 0.9375rem;
            background: ${theme() === 'dark' ? '#374151' : '#f5f5f5'};
            color: ${theme() === 'dark' ? '#f3f4f6' : '#1f2937'};
            outline: none;
          }
          .table-wrapper {
            overflow-x: auto;
          }
          table {
            width: 100%;
          }
          thead {
            background-color: ${theme() === 'dark' ? '#111827' : '#f9fafb'};
            border-bottom: 1px solid ${theme() === 'dark' ? '#374151' : '#e5e7eb'};
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
            opacity: 0.7;
          }
          tbody tr {
            border-bottom: 1px solid ${theme() === 'dark' ? '#374151' : '#e5e7eb'};
            transition: background-color 0.15s;
          }
          tbody tr:nth-child(even) {
            background-color: ${theme() === 'dark' ? '#111827' : '#f9fafb'};
          }
          tbody tr:hover {
            background-color: ${theme() === 'dark' ? '#1e3a5f' : '#e0f2fe'};
          }
          tbody tr.selectable {
            cursor: pointer;
          }
          tbody tr.selectable:hover {
            background-color: ${theme() === 'dark' ? '#1e3a5f' : '#e0f2fe'} !important;
          }
          tbody tr.selected {
            background-color: ${theme() === 'dark' ? '#1d4ed8' : '#dbeafe'} !important;
          }
          td.first-col {
            border-left: 3px solid transparent;
          }
          tbody tr.selected td.first-col {
            border-left-color: #1676f3;
          }
          th.action-col {
            width: 0.5rem;
            text-align: center;
            cursor: default;
            padding: 0;
          }
          td.action-col {
            width: 0.5rem;
            text-align: center;
            padding: 0;
          }
          .action-btn {
            background: transparent;
            border: none;
            color: ${theme() === 'dark' ? '#f3f4f6' : '#1f2937'};
            cursor: pointer;
            font-size: 1.25rem;
            padding: 0;
            border-radius: 4px;
            line-height: 1;
          }
          td {
            padding: 0.5rem 0.25rem;
            font-size: 0.9375rem;
          }
          .pagination {
            padding: 0.6rem 0.5rem;
            border-top: 1px solid ${theme() === 'dark' ? '#374151' : '#e5e7eb'};
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.875rem;
          }
          .pagination-controls {
            display: flex;
            gap: 0.5rem;
            align-items: center;
          }
          button {
            padding: 0.5rem 1rem;
            border: 1px solid ${theme() === 'dark' ? '#4b5563' : '#d1d5db'};
            border-radius: 4px;
            background: ${theme() === 'dark' ? '#374151' : 'white'};
            color: ${theme() === 'dark' ? '#f3f4f6' : '#1f2937'};
            cursor: pointer;
            font-family: inherit;
            font-size: 0.875rem;
          }
          button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          button:hover:not(:disabled) {
            background: ${theme() === 'dark' ? '#4b5563' : '#f3f4f6'};
          }
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
                  value={filter()}
                  onInput={(e) => { setFilter(e.target.value); setPage(0) }}
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
                      onClick={() => selectRow(row)}
                    >
                      <For each={columns()}>
                        {(col, idx) => <td class={idx() === 0 ? 'first-col' : ''}>{row[col.key]}</td>}
                      </For>
                      {actionable() && (
                        <td class="action-col">
                          <button class="action-btn" onClick={(e) => {
                            e.stopPropagation()
                            if (selectable()) {
                              setSelectedRow(row)
                            }
                            this.dispatchEvent(new CustomEvent('row-action', {
                              detail: { row, id: row.id, event: e },
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
                <button 
                  onClick={() => setPage(page() - 1)}
                  disabled={page() === 0}
                >
                  &lt;
                </button>
                <span>{page() + 1} / {pages()}</span>
                <button 
                  onClick={() => setPage(page() + 1)}
                  disabled={page() >= pages() - 1}
                >
                  &gt;
                </button>
              </div>
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
    // Limpiar observer
    if ((this as any).observer) {
      (this as any).observer.disconnect()
    }
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
    if (value) {
      this.setAttribute('selectable', '')
    } else {
      this.removeAttribute('selectable')
    }
  }

  set filterable(value: boolean) {
    if (value) {
      this.setAttribute('filterable', '')
    } else {
      this.removeAttribute('filterable')
    }
  }

  set pageable(value: boolean) {
    if (value) {
      this.setAttribute('pageable', '')
    } else {
      this.removeAttribute('pageable')
    }
  }
}

customElements.define('as-datagrid', AsDatagrid)