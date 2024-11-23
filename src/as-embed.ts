import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('as-embed')
export class AsEmbed extends LitElement {

    @property({ type: String })
    width = 1200;
    @property({ type: String })
    height = 675;
    @property({ type: String })
    url = '';
    

    static styles = css`
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
    }`;

    static properties = {
        width: { type: Number },
        height: { type: Number },
        url: { type: String }
    };

    constructor() {
        super();
        this.width = 1200;
        this.height = 675;
        this.url = '';
    }

    /*connectedCallback() {
        super.connectedCallback();
        this.update();
    }*/

    render() {
        return html`
        <div class="embed-container">
            <iframe
            width="${this.width}"
            height="${this.height}"
            frameborder="0"
            src="${this.url}"
            type="text/html"
            allowScriptAccess="always"
            allowFullScreen
            scrolling="yes"
            allowNetworking="all"
            ></iframe>
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
      'as-embed': AsEmbed
    }
}
