import { render } from 'solid-js/web'
import { createSignal, createEffect } from 'solid-js'

class AsVideo extends HTMLElement {
  private dispose?: () => void

  connectedCallback() {
    const [width, setWidth] = createSignal(parseInt(this.getAttribute('width') || '560'))
    const [height, setHeight] = createSignal(parseInt(this.getAttribute('height') || '315'))
    const [url] = createSignal(this.getAttribute('url') || '')

    createEffect(() => {
      if (window.innerWidth < 560) {
        setWidth(310)
        setHeight(175)
      }
    })

    const Component = () => (
      <>
        <style>{`
          .video {
            display: grid;
            grid-template-areas: stack;
            place-items: center;
            width: max(320px, 100%);
          }
        `}</style>
        <div class="video">
          <br />
          <iframe
            width={width()}
            height={height()}
            frameborder="0"
            src={url()}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
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
    return ['width', 'height', 'url']
  }
}

customElements.define('as-video', AsVideo)