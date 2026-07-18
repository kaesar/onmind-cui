import { render } from 'solid-js/web'
import { createSignal, onCleanup } from 'solid-js'

class AsEmbed extends HTMLElement {
  private dispose?: () => void

  connectedCallback() {
    const [width, setWidth] = createSignal(parseInt(this.getAttribute('width') || '1200'))
    const [height, setHeight] = createSignal(parseInt(this.getAttribute('height') || '675'))
    const [url, setUrl] = createSignal(this.getAttribute('url') || '')

    // Observar cambios en atributos
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          const attrName = mutation.attributeName
          if (attrName === 'width') setWidth(parseInt(this.getAttribute('width') || '1200'))
          if (attrName === 'height') setHeight(parseInt(this.getAttribute('height') || '675'))
          if (attrName === 'url') setUrl(this.getAttribute('url') || '')
        }
      })
    })
    observer.observe(this, { attributes: true })
    onCleanup(() => observer.disconnect())

    const Component = () => (
      <>
        <style>{`
          :host {
            width: 100%;
          }
          .embed-container {
            position: relative;
            padding-bottom: 56.25%;
            padding-top: 0;
            height: 0;
          }
          iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
        `}</style>
        <div class="embed-container">
          <iframe
            width={width()}
            height={height()}
            frameborder="0"
            src={url()}
            allowfullscreen
            scrolling="yes"
          />
        </div>
      </>
    )

    const shadowRoot = this.attachShadow({ mode: 'open' })
    this.dispose = render(Component, shadowRoot)
  }

  disconnectedCallback() {
    this.dispose?.()
  }

  static get observedAttributes() {
    return ['width', 'height', 'url']
  }
}

customElements.define('as-embed', AsEmbed)