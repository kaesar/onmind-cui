import { render } from 'solid-js/web'
import { createSignal } from 'solid-js'

class AsBox extends HTMLElement {
  private dispose?: () => void

  connectedCallback() {
    const [dim] = createSignal(this.getAttribute('dim') || 'false')
    const [theme] = createSignal(this.getAttribute('theme') || 'light')

    const handleSlotChange = (e: Event) => {
      const slot = e.target as HTMLSlotElement
      const elements = slot.assignedElements()
      elements.forEach(el => {
        if (theme() === 'dark') {
          el.setAttribute('theme', 'dark')
        }
      })
    }

    const getStyles = () => {
      const isDim = dim() === 'true'
      const isDark = theme() === 'dark'
      
      let bgColor = 'whitesmoke'
      let boxShadow = '0 3px 10px 0 #aaa'
      let color = '#1f2937'
      
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
      }
      
      return { bgColor, boxShadow, color }
    }

    const Component = () => {
      const styles = getStyles()
      return (
        <>
          <style>{`
            :host {
              display: block;
            }
            .box {
              display: flex;
              flex-direction: column;
              gap: 0.5rem;
              padding: 1rem;
              border-radius: 5px;
              background-color: ${styles.bgColor};
              box-shadow: ${styles.boxShadow};
              color: ${styles.color};
            }
          `}</style>
          <div class="box">
            <slot onSlotChange={handleSlotChange} />
          </div>
        </>
      )
    }

    const shadowRoot = this.attachShadow({ mode: 'open' })
    this.dispose = render(Component, shadowRoot)
  }

  disconnectedCallback() {
    this.dispose?.()
  }

  static get observedAttributes() {
    return ['dim', 'theme']
  }
}

customElements.define('as-box', AsBox)