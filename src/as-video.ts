import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('as-video')
export class AsVideo extends LitElement {

    @property({ type: String })
    width = 560;
    @property({ type: String })
    height = 315;
    @property({ type: String })
    url = '';
    
    constructor() {
        super();
        this.width = 560;
        this.height = 315;
        this.url = '';
    }

    static styles = css`
    .video {
      display: grid;
      grid-template-areas: stack;
      place-items: center;
      width: max(320px, 100%);
    }`;


    /*connectedCallback() {
        super.connectedCallback();
        this.update();
    }*/

    updated(changedProperties: Map<string, any>) {
        if (changedProperties.has('width')) {
        if (window.innerWidth < 560) {
            this.width = 310;
            this.height = 175;
        }
        }
    }

    render() {
        return html`
        <div class="video">
            <br />
            <iframe
                width="${this.width}"
                height="${this.height}"
                frameborder="0"
                src="${this.url}"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
            ></iframe>
            <br />
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
      'as-video': AsVideo
    }
}
