import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

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

  @property({ type: Boolean })
  actionable = false

  @state()
  private accessor _filter = ''

  @state()
  private accessor _sortKey: string | null = null

  @state()
  private accessor _sortDir = 1

  @state()
  private accessor _page = 0

  @state()
  private accessor _selectedRow: any = null

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
    this._selectedRow = row
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
              <input
                type="text"
                class="filter-input"
                placeholder="🔍"
                .value=${this._filter}
                @input=${(e: Event) => { this._filter = (e.target as HTMLInputElement).value; this._page = 0 }}
              />
            ` : ''}
          </div>
        ` : ''}

        <div class="table-wrapper">
          <table>
          <thead>
            <tr>
              ${this.columns.map(col => html`
                <th @click=${() => this._sort(col.key)}>
                  ${col.header}
                  ${this._sortKey === col.key ? (this._sortDir === 1 ? ' ↑' : ' ↓') : ''}
                </th>
              `)}
              ${this.actionable ? html`<th class="action-col"></th>` : ''}
            </tr>
          </thead>
          <tbody>
            ${rows.map(row => html`
              <tr 
                class="${this.selectable ? 'selectable' : ''} ${this._selectedRow === row ? 'selected' : ''}"
                @click=${() => this._selectRow(row)}
              >
                ${this.columns.map((col, idx) => html`<td class="${idx === 0 ? 'first-col' : ''}">${row[col.key]}</td>`)}
                ${this.actionable ? html`
                  <td class="action-col">
                    <button class="action-btn" @click=${(e: MouseEvent) => {
                      e.stopPropagation()
                      if (this.selectable) {
                        this._selectedRow = row
                      }
                      this.dispatchEvent(new CustomEvent('row-action', {
                        detail: { row, id: row.id, event: e },
                        bubbles: true,
                        composed: true
                      }))
                    }}>⋮</button>
                  </td>
                ` : ''}
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
      --input-bg: var(--lumo-contrast-10pct, #f5f5f5);
      --input-border: var(--lumo-contrast-20pct, #d1d5db);
      --input-text: var(--lumo-body-text-color, #1f2937);
      --button-bg: white;
      --button-hover: #f3f4f6;
    }

    :host([theme="dark"]) {
      --table-bg: #1f2937;
      --table-text: #f3f4f6;
      --table-border: #374151;
      --table-border-strong: #4b5563;
      --table-row-even: #111827;
      --table-row-hover: #1e3a5f;
      --table-row-selected: #1d4ed8;
      --input-bg: var(--lumo-contrast-10pct, #374151);
      --input-border: var(--lumo-contrast-20pct, #4b5563);
      --input-text: var(--lumo-body-text-color, #f3f4f6);
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
      --input-bg: var(--lumo-contrast-10pct, white);
      --input-border: var(--lumo-contrast-20pct, #d1d5db);
      --input-text: var(--lumo-body-text-color, #1f2937);
      --button-bg: white;
      --button-hover: #f3f4f6;
    }
    .container {
      background: var(--table-bg);
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
      overflow: hidden;
      color: var(--table-text);
    }
    .container > .header {
      padding: 0 0.5rem;
    }
    .container > .header:first-child {
      padding-top: 0.4rem;
    }
    .header {
      padding: 0 1.5rem 1rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .title {
      font-size: 1.25rem;
      font-weight: 600;
    }
    .table-wrapper {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }
    table {
      width: 100%;
    }
    thead {
      background-color: var(--table-row-even);
      border-bottom: 1px solid var(--table-border);
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
      color: var(--table-text);
      opacity: 0.7;
    }

    tbody tr {
      border-bottom: 1px solid var(--table-border);
      transition: background-color 0.15s;
    }
    tbody tr:nth-child(even) {
      background-color: var(--table-row-even);
    }

    td {
      padding: 0.5rem 0.25rem;
      font-size: 0.9375rem;
      color: var(--table-text);
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
      color: var(--table-text);
      cursor: pointer;
      font-size: 1.25rem;
      padding: 0;
      border-radius: 4px;
      line-height: 1;
    }
    .action-btn:hover {
      background: var(--option-hover, #f3f4f6);
    }
    tbody tr:hover {
      background-color: var(--table-row-hover);
    }
    tbody tr.selectable {
      cursor: pointer;
    }
    tbody tr.selected {
      background-color: var(--table-row-selected) !important;
      height: auto;
    }
    .pagination {
      padding: 0.6rem 0.5rem 0.5rem 0.5rem;
      border-top: 1px solid var(--table-border);
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
    .filter-input {
      width: 160px;
      padding: 0.5rem 0.75rem;
      border: none;
      border-radius: var(--lumo-border-radius-m, 4px);
      font-size: var(--lumo-font-size-m, 0.9375rem);
      font-family: var(--lumo-font-family);
      background: var(--input-bg);
      color: var(--input-text);
      outline: none;
    }
    .filter-input:focus {
      border: 1px solid var(--lumo-primary-color, #3b82f6);
      box-shadow: 0 0 0 2px var(--lumo-primary-color-10pct, rgba(59, 130, 246, 0.1));
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
