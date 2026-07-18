import { render } from 'solid-js/web'
import { createSignal } from 'solid-js'

class AsImage extends HTMLElement {
  private dispose?: () => void

  connectedCallback() {
    const [url] = createSignal(this.getAttribute('url') || '')

    const Component = () => (
      <>
        <style>{`
          :host {
            display: flex;
            justify-content: center;
          }
          img {
            margin: 10px;
          }
          .image-container {
            display: flex;
            justify-content: center;
          }
        `}</style>
        <div class="image-container">
          <br />
          <img src={url()} />
          <br />
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
    return ['url']
  }
}

customElements.define('as-image', AsImage)