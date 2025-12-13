import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('as-box')
export class AsBox extends LitElement {
    @property({ type: String })
    dim = 'false'

    @property({ type: String })
    theme = 'light'

    static styles = css`
      :host {
        display: block;
      }
      .box {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1rem;
        border-radius: 5px;
      }
    `

    protected override render() {
        const isDim = this.dim === 'true'
        const isDark = this.theme === 'dark'
        
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
        
        return html`
            <div class="box" style="background-color: ${bgColor}; box-shadow: ${boxShadow}; color: ${color};">
                <slot @slotchange="${this._handleSlotChange}"></slot>
            </div>`
    }

    private _handleSlotChange(e: Event) {
        const slot = e.target as HTMLSlotElement
        const elements = slot.assignedElements()
        elements.forEach(el => {
            if (this.theme === 'dark') {
                el.setAttribute('theme', 'dark')
            }
        })
    }
}

declare global {
    interface HTMLElementTagNameMap {
      'as-box': AsBox
    }
}
