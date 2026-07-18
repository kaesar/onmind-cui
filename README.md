# OnMind-CUI

Core User Interface (**CUI**), Native Web Components for cross use in **UI** with Content Pages (like Markdown) and Simple Web Apps. Inspired in [**Vaadin Web Components**](https://github.com/vaadin/web-components) but not based on it.

These components are using technologies like **Lit** and **Typescript**, it allows the standard way to include as `html` tags in simple Markdown (`.md`) files, for example with `markdown-it` parser (or similar feature in `remark` and others parsers).

The idea with Native Web Componets is use with any other tecnologies because this is like simple `html` tag (with a Shadow DOM), and it could encapsulates even the styles.

**OnMind-CUI** includes just this...

Component | Description
-- | --
`as-complete` | Autocomplete/ComboBox component
`as-box` | Similar to Card to group components inside
`as-button` | Common Button component
`as-check` | Common Checkbox component
`as-confirm` | Dialog with Modal with confirm action
`as-datagrid` | Data grid/table with sorting, filtering and pagination
`as-date` | Date picker component
`as-embed` | Component to Embed content for the web (url)
`as-event` | Input with icon to trigger an event for modal or menu
`as-form` | Schema-based form component with validation
`as-image` | Common Image component
`as-input` | Common Input component (text, email, password, number)
`as-modal` | Modal dialog component with slot support
`as-popup` | Context menu/popup component with smart positioning
`as-radio` | Common Radio button group component
`as-select` | Dropdown/Select component
`as-switch` | Toggle switch component
`as-text` | TextArea component
`as-time` | Time picker component
`as-upload` | File upload component with drag-and-drop support
`as-video` | Common Video component (for YouTube links)

> Tu use, you can include this `tags` in simple Markdown files or Web Apps.

## How to install it ?

1. Clone it or download: `git clone https://github.com/kaesar/onmind-cui.git cui`
2. Open the folder from terminal: `cd cui`
3. Install modules: `npm install`
4. Lauch vite: `npm start`

> You get the `cui.js` file under `dist` folder and put in a `script` tag in `html` (e.g. in `head`)
