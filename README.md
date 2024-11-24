# OnMind-CUI

Common User Interface (**CUI**), Native Web Components for cross use in **UI** with Content Pages (like Markdown) and Simple Web Apps. Based in a tiny selection from [**Vaadin Web Components**](https://github.com/vaadin/web-components).

> **Vaadin** is a technology, well known in the **java** world, that enable **UI** capabilities with web standards and Fullstack development.

These components are using technologies like **Lit** and **Typescript**, it allows the standard way to include as `html` tags in simple Markdown (`.md`) files, for example with `markdown-it` parser (or similar feature in `remark` and others parsers).

The idea with Native Web Componets is use with any other tecnologies because this is like simple `html` tag (with a Shadow DOM), and it could encapsulates even the styles.

**OnMInd-CUI** includes just this...

Component | Description
-- | --
`as-box` | Similar to Card to group components inside
`as-button` | Common Button component
`as-check` | Common Check component
`as-confirm` | Dialog with Modal with confirm action
`as-embed` | Component to Embed content for the web (url)
`as-image` | Common Image component
`as-input` | Common Input component
`as-radio` | Common Radio component
`as-select` | Combo-box or Dropdown component
`as-text` | Input with TextArea component
`as-video` | Common Video component (for YouTube links)

> Tu use, you can include this `tags` in simple Markdown files or Web Apps.

## How to install it ?

1. Clone it or download: `git clone https://github.com/kaesar/onmind-cui.git cui`
2. Open the folder from terminal: `cd cui`
3. Install modules: `npm install`
4. Lauch vite: `npm start`

> You get the `cui.js` file under `dist` folder and put in a `script` tag in `html` (e.g. in `head`)
