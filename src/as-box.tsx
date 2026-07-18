import { render } from 'solid-js/web'

class AsBox extends HTMLElement {
  private dispose?: () => void
  private boxEl?: HTMLDivElement

  private applyStyles() {
    if (!this.boxEl) return
    const isDark = this.getAttribute('theme') === 'dark'
    const isDim = this.getAttribute('dim') === 'true'

    let bgColor: string
    let boxShadow: string
    let color: string

    if (isDark && isDim) {
      bgColor = '#1f2937'
      boxShadow = '0 3px 10px 0 #000'
      color = '#f3f4f6'
    } else if (isDark) {
      bgColor = '#374151'
      boxShadow = '0 3px 10px 0 #000'
      color = '#f3f4f6'
    } else if (isDim) {
      bgColor = 'silver'
      boxShadow = '0 3px 10px 0 #aaa'
      color = '#1f2937'
    } else {
      bgColor = 'whitesmoke'
      boxShadow = '0 3px 10px 0 #aaa'
      color = '#1f2937'
    }

    this.boxEl.style.backgroundColor = bgColor
    this.boxEl.style.boxShadow = boxShadow
    this.boxEl.style.color = color
  }

  private propagateTheme() {
    const isDark = this.getAttribute('theme') === 'dark'
    const slot = this.shadowRoot?.querySelector('slot')
    if (!slot) return
    const elements = (slot as HTMLSlotElement).assignedElements()
    elements.forEach(el => {
      if (isDark) {
        el.setAttribute('theme', 'dark')
      } else {
        el.removeAttribute('theme')
      }
    })
  }

  private flush() {
    this.applyStyles()
    this.propagateTheme()
  }

  connectedCallback() {
    const handleSlotChange = () => this.propagateTheme()

    const Component = () => (
      <div class="box" ref={(el) => { this.boxEl = el; this.applyStyles() }}>
        <slot onSlotChange={handleSlotChange} />
      </div>
    )

    const shadowRoot = this.attachShadow({ mode: 'open' })
    const style = document.createElement('style')
    style.textContent = `
      :host { display: block; }
      .box {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1rem;
        border-radius: 5px;
        transition: background-color 0.2s, box-shadow 0.2s, color 0.2s;
      }
    `
    shadowRoot.appendChild(style)
    this.dispose = render(Component, shadowRoot)
  }

  disconnectedCallback() {
    this.dispose?.()
  }

  /* Respond to attribute changes directly — no infinite loop */
  attributeChangedCallback() {
    this.flush()
  }

  static get observedAttributes() {
    return ['dim', 'theme']
  }
}

customElements.define('as-box', AsBox)