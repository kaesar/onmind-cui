import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('as-image')
export class AsImage extends LitElement {

    @property({ type: String })
    url = '';

    static styles = css`
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
    }`;
  
    render() {
        return html`
        <div class="image-container">
          <br />
          <img src="${this.url}" />
          <br />
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
      'as-image': AsImage
    }
}
