import { render } from 'solid-js/web'
import { createSignal } from 'solid-js'

class AsEmbed extends HTMLElement {
  private dispose?: () => void

  connectedCallback() {
    const [width] = createSignal(parseInt(this.getAttribute('width') || '1200'))
    const [height] = createSignal(parseInt(this.getAttribute('height') || '675'))
    const [url] = createSignal(this.getAttribute('url') || '')

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