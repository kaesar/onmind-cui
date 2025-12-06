import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import '@vaadin/text-field'

interface Column {
  key: string
  header: string
}

@customElement('as-datagrid')
export class AsDatagrid extends LitElement {
  @property({ type: Array })
  data: any[] = []

  @property({ type: Array })
  columns: Column[] = []

  @property({ type: Number })
  pageSize = 15

  @property({ type: String })
  title = ''

  @property({ type: String })
  theme = ''

  @property({ type: Boolean })
  selectable = false

  @property({ type: Boolean })
  pageable = false

  @property({ type: Boolean })
  filterable = false

  @state()
  private accessor _filter = ''

  @state()
  private accessor _sortKey: string | null = null

  @state()
  private accessor _sortDir = 1

  @state()
  private accessor _page = 0

  @state()
  private accessor _selectedId: any = null

  private _getFilteredData() {
    if (!this._filter) return this.data
    const f = this._filter.toLowerCase()
    return this.data.filter(row => 
      Object.values(row).some(v => String(v).toLowerCase().includes(f))
    )
  }

  private _getSortedData() {
    const filtered = this._getFilteredData()
    if (!this._sortKey) return filtered
    return [...filtered].sort((a, b) => {
      const av = a[this._sortKey!]
      const bv = b[this._sortKey!]
      return av < bv ? -this._sortDir : av > bv ? this._sortDir : 0
    })
  }

  private _getPaginatedData() {
    const sorted = this._getSortedData()
    if (!this.pageable) return sorted
    const start = this._page * this.pageSize
    return sorted.slice(start, start + this.pageSize)
  }

  private _sort(key: string) {
    if (this._sortKey === key) {
      this._sortDir = this._sortDir === 1 ? -1 : 1
    } else {
      this._sortKey = key
      this._sortDir = 1
    }
  }

  private _selectRow(row: any) {
    if (!this.selectable) return
    this._selectedId = row.id
    this.dispatchEvent(new CustomEvent('row-select', {
      detail: { row, id: row.id },
      bubbles: true,
      composed: true
    }))
  }

  protected override render() {
    if (!this.data.length || !this.columns.length) return html``
    
    const rows = this._getPaginatedData()
    const total = this._getSortedData().length
    const pages = Math.ceil(total / this.pageSize)

    return html`
      <div class="container">
        ${this.title || this.filterable ? html`
          <div class="header">
            ${this.title ? html`<div class="title">${this.title}</div>` : html`<div></div>`}
            ${this.filterable ? html`
              <vaadin-text-field
                placeholder="🔍"
                .value=${this._filter}
                @value-changed=${(e: any) => { this._filter = e.detail.value; this._page = 0 }}
                clear-button-visible
                theme="contrast"
                style="max-width: 400px; ${this.theme === 'dark' ? '--vaadin-input-field-background: #374151; color: #f3f4f6;' : ''}"
              ></vaadin-text-field>
            ` : ''}
          </div>
        ` : ''}

        <div class="table-wrapper">
          <table>
          <thead>
            <tr>
              ${this.selectable ? html`<th class="select-col"></th>` : ''}
              ${this.columns.map(col => html`
                <th @click=${() => this._sort(col.key)}>
                  ${col.header}
                  ${this._sortKey === col.key ? (this._sortDir === 1 ? ' ↑' : ' ↓') : ''}
                </th>
              `)}
            </tr>
          </thead>
          <tbody>
            ${rows.map(row => html`
              <tr 
                class="${this.selectable ? 'selectable' : ''} ${this._selectedId === row.id ? 'selected' : ''}"
                @click=${() => this._selectRow(row)}
              >
                ${this.selectable ? html`<td class="select-col">${this._selectedId === row.id ? '»' : ''}</td>` : ''}
                ${this.columns.map(col => html`<td>${row[col.key]}</td>`)}
              </tr>
            `)}
          </tbody>
          </table>
        </div>

        ${this.pageable ? html`
          <div class="pagination">
            <div># ${total}</div>
            <div class="pagination-controls">
              <button 
                @click=${() => this._page--}
                ?disabled=${this._page === 0}
              >
                &lt;
              </button>
              <span>${this._page + 1} / ${pages}</span>
              <button 
                @click=${() => this._page++}
                ?disabled=${this._page >= pages - 1}
              >
                &gt;
              </button>
            </div>
          </div>
        ` : ''}
      </div>
    `
  }

  static override styles = css`
    :host {
      display: block;
      font-family: var(--lumo-font-family, -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol");
      --table-bg: white;
      --table-text: #1f2937;
      --table-border: #e5e7eb;
      --table-border-strong: #d1d5db;
      --table-row-even: #f9fafb;
      --table-row-hover: #e0f2fe;
      --table-row-selected: #dbeafe;
      --input-bg: white;
      --input-border: #d1d5db;
      --button-bg: white;
      --button-hover: #f3f4f6;
    }
    @media (prefers-color-scheme: dark) {
      :host {
        --table-bg: #1f2937;
        --table-text: #f3f4f6;
        --table-border: #374151;
        --table-border-strong: #4b5563;
        --table-row-even: #111827;
        --table-row-hover: #1e3a5f;
        --table-row-selected: #1e40af;
        --input-bg: #374151;
        --input-border: #4b5563;
        --button-bg: #374151;
        --button-hover: #4b5563;
      }
    }
    :host([theme="dark"]) {
      --table-bg: #1f2937;
      --table-text: #f3f4f6;
      --table-border: #374151;
      --table-border-strong: #4b5563;
      --table-row-even: #111827;
      --table-row-hover: #1e3a5f;
      --table-row-selected: #1e40af;
      --input-bg: #374151;
      --input-border: #4b5563;
      --button-bg: #374151;
      --button-hover: #4b5563;
    }
    :host([theme="light"]) {
      --table-bg: white;
      --table-text: #1f2937;
      --table-border: #e5e7eb;
      --table-border-strong: #d1d5db;
      --table-row-even: #f9fafb;
      --table-row-hover: #e0f2fe;
      --table-row-selected: #dbeafe;
      --input-bg: white;
      --input-border: #d1d5db;
      --button-bg: white;
      --button-hover: #f3f4f6;
    }
    .container {
      padding: 1rem;
      background: var(--table-bg);
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      color: var(--table-text);
    }
    .header {
      margin-bottom: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .title {
      font-size: var(--lumo-font-size-xl, 1.25rem);
      font-weight: 600;
    }
    .table-wrapper {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th {
      padding: 0.5rem 0.75rem;
      text-align: left;
      border-bottom: 2px solid var(--table-border);
      cursor: pointer;
      user-select: none;
      color: var(--table-text);
    }
    th.select-col {
      width: 1ch;
      padding: 0;
      cursor: default;
    }
    td {
      padding: 0.5rem 0.75rem;
      color: var(--table-text);
      border-bottom: 1px solid var(--table-border);
    }
    td.select-col {
      width: 1ch;
      text-align: center;
      padding: 0;
    }
    tbody tr:nth-child(even) {
      background-color: var(--table-row-even);
    }
    tbody tr:hover {
      background-color: var(--table-row-hover);
    }
    tbody tr.selectable {
      cursor: pointer;
    }
    tbody tr.selected {
      background-color: var(--table-row-selected) !important;
    }
    .pagination {
      margin-top: 1rem;
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
      border: 1px solid var(--table-border-strong);
      border-radius: var(--lumo-border-radius-m, 4px);
      background: var(--button-bg);
      color: var(--table-text);
      cursor: pointer;
      font-family: inherit;
      font-size: var(--lumo-font-size-s, 0.875rem);
    }
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    button:hover:not(:disabled) {
      background: var(--button-hover);
    }
    @media (max-width: 768px) {
      .container {
        padding: 0.5rem;
      }
      .header {
        flex-direction: column;
        gap: 0.5rem;
        align-items: stretch;
      }
      .title {
        font-size: 1rem;
      }
      th, td {
        padding: 0.25rem 0.5rem;
        font-size: 0.875rem;
      }
      .pagination {
        font-size: 0.75rem;
      }
      button {
        padding: 0.375rem 0.75rem;
        font-size: 0.875rem;
      }
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'as-datagrid': AsDatagrid
  }
}
