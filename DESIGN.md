# CUI Design System Documentation

## Overview

CUI (Core User Interface) is a collection of native Web Components built with **SolidJS** for form data capture and content display. Inspired by Vaadin UI design principles but implemented without external dependencies for minimal bundle size.

## Design Principles

1. **Native Web Components** - Standard `<custom-element>` tags with Shadow DOM encapsulation
2. **Framework Agnostic** - Works with any framework or vanilla HTML/JS via standard custom element interop, e.g.: React, Vue, Svelte, Solid, Astro, etc.
3. **Lightweight** - SolidJS runtime (~7KB gzipped) for minimal bundle size
4. **Accessible** - Semantic HTML, ARIA attributes, keyboard navigation
5. **Themeable** - Light/Dark mode support via `theme` attribute
6. **Composable** - Components work standalone or combined (e.g., `as-form` inside `as-modal`)

---

## Input Surface Consistency (Key Rule)

**Input fields always use a light surface background regardless of theme.**  
Inspired by Vaadin's approach where input fields maintain a light, readable surface even inside dark containers.

| Element | Style (light & dark) | Reason |
|---------|----------------------|--------|
| Input / textarea / trigger | `background: #e8eaed`, `color: #1a1a1a` | High contrast, clean readability |
| Label | Reacts to theme (`#374151` light, `#f3f4f6` dark) | Respects surrounding context |
| SVG icon / chevron | Always `#1f2937` (dark) | Maximum contrast on light surface |
| Placeholder | Always `#737373` | Independent of theme |
| Dropdown / overlay | Adapts to theme | Overlays are contextual |

**Only the label, dropdowns, and overlays react to the theme.**  
The input surface itself stays light. This ensures consistency across form fields and prevents one-off style breaks when placing inputs in dark containers.

```html
<!-- Dark container — inputs stay light, labels turn white -->
<as-box theme="dark">
  <as-input label="Name" /><!-- label: white, input: #e8eaed -->
  <as-select label="Role" />  <!-- label: white, trigger: #e8eaed -->
</as-box>

<!-- Light container — default -->
<as-box>
  <as-input label="Name" /><!-- label: #374151, input: #e8eaed -->
</as-box>
```

> **Exception:** `as-button`, `as-switch`, `as-check` use theme-reactive backgrounds since their entire surface is the interactive element. The rule applies to data-entry fields (input, textarea, select, date, time, complete, event).

---

## Color System

### Light Theme (Default)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#3b82f6` | Primary buttons, focus rings, selected states |
| `--color-primary-hover` | `#2563eb` | Primary button hover |
| `--color-primary-active` | `#1d4ed8` | Primary button active |
| `--color-secondary-bg` | `#e5e7eb` | Secondary buttons, input backgrounds |
| `--color-secondary-hover` | `#d1d5db` | Secondary button hover |
| `--color-background` | `#ffffff` | Page/card backgrounds |
| `--color-surface` | `#f9fafb` | Elevated surfaces |
| `--color-text-primary` | `#1f2937` | Primary text |
| `--color-text-secondary` | `#4b5563` | Secondary text, labels |
| `--color-text-muted` | `#9ca3af` | Placeholders, disabled text |
| `--color-border` | `#d1d5db` | Input borders, dividers |
| `--color-border-focus` | `#1676f3` | Focus rings |
| `--color-error` | `#dc2626` | Error messages, destructive actions |
| `--color-success` | `#059669` | Success messages |
| `--color-checkbox-border` | `#d0d7de` | Checkbox borders |
| `--color-checkbox-bg` | `#fafafa` | Checkbox background |
| `--color-checkbox-checked` | `#1676f3` | Checked checkbox background |
| `--color-switch-off` | `#e8eaed` | Switch off background |
| `--color-switch-on` | `#1676f3` | Switch on background |
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.1)` | Card shadows |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Dropdown/modal shadows |
| `--shadow-lg` | `0 10px 25px rgba(0,0,0,0.2)` | Modal overlays |

### Dark Theme (`theme="dark"` on host or ancestor)

| Token | Value |
|-------|-------|
| `--color-primary` | `#3b82f6` |
| `--color-primary-hover` | `#2563eb` |
| `--color-primary-active` | `#1d4ed8` |
| `--color-secondary-bg` | `#374151` |
| `--color-secondary-hover` | `#4b5563` |
| `--color-background` | `#1f2937` |
| `--color-surface` | `#111827` |
| `--color-text-primary` | `#f3f4f6` |
| `--color-text-secondary` | `#d1d5db` |
| `--color-text-muted` | `#9ca3af` |
| `--color-border` | `#525252` |
| `--color-border-focus` | `#1676f3` |
| `--color-error` | `#ef4444` |
| `--color-success` | `#10b981` |
| `--color-checkbox-border` | `#525252` |
| `--color-checkbox-bg` | `#374151` |
| `--color-checkbox-checked` | `#1676f3` |
| `--color-switch-off` | `#525252` |
| `--color-switch-on` | `#1676f3` |
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.3)` |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.4)` |
| `--shadow-lg` | `0 10px 25px rgba(0,0,0,0.5)` |

### Theme Application

Components accept a `theme` attribute (`"light"` | `"dark"`). Theme cascades to slotted content via `slotchange` handler in container components (`as-box`, `as-modal`).

```html
<!-- Light theme (default) -->
<as-box>
  <as-input label="Name"></as-input>
</as-box>

<!-- Dark theme on container -->
<as-box theme="dark">
  <as-input label="Name"></as-input>  <!-- inherits dark theme -->
</as-box>

<!-- Dark theme on individual component -->
<as-input label="Name" theme="dark"></as-input>
```

---

## Typography

### Font Stack

```css
font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif;
```

### Type Scale

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| Form Title (`as-form h2`) | 1.5rem (24px) | 600 | 1.25 |
| Section Title (`as-form h3`) | 1.125rem (18px) | 500 | 1.33 |
| Label | 0.875rem (14px) | 500 | 1.43 |
| Input Text | 0.9375rem (15px) | 400 | 1.5 |
| Button Text | 0.9375rem (15px) | 500 | 1.5 |
| Small/Helper Text | 0.875rem (14px) | 400 | 1.43 |
| Checkbox/Switch Label | 0.9375rem (15px) | 400 | 1.5 |
| Datagrid Header | 0.75rem (12px) | 500 | 1.5 |
| Datagrid Cell | 0.9375rem (15px) | 400 | 1.5 |

---

## Spacing System

Based on 4px base unit (0.25rem):

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 0.25rem (4px) | Gap between label/input, checkbox gap |
| `--space-2` | 0.5rem (8px) | Field gaps, padding |
| `--space-3` | 0.75rem (12px) | Section gaps |
| `--space-4` | 1rem (16px) | Card padding, modal padding |
| `--space-6` | 1.5rem (24px) | Form section gaps, modal margins |
| `--space-8` | 2rem (32px) | Page-level spacing |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 3px | Checkboxes |
| `--radius-md` | 4px | Inputs, buttons, dropdowns, cards |
| `--radius-lg` | 8px | Modals, upload area |
| `--radius-full` | 10px | Switch track |
| `--radius-pill` | 9999px | Switch thumb |

---

## Component Specifications

### Form Input Components

#### `as-input`
Text input with label, supporting `text`, `email`, `password`, `number` types via `kind` attribute.

**Attributes:**

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `label` | string | `''` | Label text |
| `value` | string | `''` | Input value |
| `placeholder` | string | `label` | Placeholder text |
| `kind` | `text\|email\|password\|number` | `'text'` | Input type |
| `theme` | `light\|dark` | `''` | Theme variant |
| `readonly` | boolean | `false` | Read-only state |
| `disabled` | boolean | `false` | Disabled state |

**Events:** `value-changed` (detail: `{ value }`)

**Styling:**
- Label: 14px, 500 weight, `#374151` (light) / `#f3f4f6` (dark via `:host([theme="dark"])`)
- Input surface: `#e8eaed` background, `#1a1a1a` text — **does not change with theme**
- Focus border: `#1676f3`
- Placeholder: `#737373`

#### `as-text`
Multi-line textarea component.

**Styling:** Same input surface consistency as `as-input` — `#e8eaed` background independent of theme.

**Attributes:** Same as `as-input` plus `rows` (default: 3)

#### `as-select`
Dropdown/select component with options format `label=Label,value=value`.

**Styling:** Trigger follows surface consistency rule — `#e8eaed` background independent of theme. Chevron always `#1f2937`. Dropdown adapts to theme.

**Attributes:**

| Attribute | Type | Default |
|-----------|------|---------|
| `label` | string | `''` |
| `value` | string | `''` |
| `options` | string | `'label=A,value=A;label=B,value=B'` |
| `theme` | `light\|dark` | `''` |
| `readonly` | boolean | `false` |
| `disabled` | boolean | `false` |

**Options format:** `label=Label,value=value;label=Label2,value=value2`

**Events:** `value-changed` (detail: `{ value }`)

#### `as-complete`
Autocomplete/combobox with filtering.

**Styling:** Input follows surface consistency rule — `#e8eaed` background independent of theme. Dropdown adapts to theme.

**Attributes:** Same as `as-select` plus `placeholder` (default: `'Buscar...'`)

#### `as-date`
Date picker with calendar dropdown.

**Styling:** Trigger follows surface consistency rule — `#e8eaed` background independent of theme. Calendar dropdown adapts to theme.

**Attributes:** `label`, `value` (YYYY-MM-DD), `placeholder`, `theme`, `readonly`, `disabled`

**Events:** `value-changed` (detail: `{ value }`)

#### `as-time`
Time picker with hour/minute/AM-PM selectors.

**Styling:** Trigger follows surface consistency rule — `#e8eaed` background independent of theme. Time picker dropdown adapts to theme.

#### `as-checkbox` / `as-check`
Single checkbox with label.

**Attributes:** `label`, `checked` (boolean attribute), `theme`, `readonly`, `disabled`

**Events:** `checked-changed` (detail: `{ value: boolean }`)

#### `as-switch`
Toggle switch component.

**Attributes:** Same as `as-checkbox`

**Events:** `checked-changed` (detail: `{ value: boolean }`)

#### `as-radio`
Radio button group.

**Attributes:** `label`, `value`, `options` (same format as select), `theme`, `readonly`, `disabled`

**Events:** `value-changed` (detail: `{ value }`)

#### `as-upload`
File upload with drag-and-drop.

**Attributes:**

| Attribute | Type | Default |
|-----------|------|---------|
| `label` | string | `'Upload files'` |
| `accept` | string | `'*'` |
| `multiple` | boolean | `false` |
| `theme` | `light\|dark` | `''` |
| `disabled` | boolean | `false` |

**Events:** `files-selected` (detail: `{ files: File[] }`)

---

### Layout Components

#### `as-box`
Container card component with optional dimmed variant.

**Attributes:**

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `dim` | `true\|false` | `'false'` | Dimmed variant |
| `theme` | `light\|dark` | `'light'` | Theme |

**Slots:** Default slot for child components

**Theme Propagation:** Automatically sets `theme` attribute on slotted elements when container has `theme="dark"`

#### `as-modal`
Modal dialog with slot for content.

**Attributes:** `title`, `theme`

**Methods:** `show()`, `hide()`

**Events:** `modal-close`

**Slots:** Default slot for form/content

---

### Data Display Components

#### `as-datagrid`
Feature-rich data table.

**Properties (JavaScript):**

| Property | Type | Description |
|----------|------|-------------|
| `data` | `Array<Object>` | Row data |
| `columns` | `Array<{key, header}>` | Column definitions |
| `selectable` | boolean | Enable row selection |
| `pageable` | boolean | Enable pagination |
| `filterable` | boolean | Enable filtering |
| `actionable` | boolean | Show action menu |
| `pageSize` | number | Rows per page (default: 15) |
| `title` | string | Table title |
| `theme` | `light\|dark` | Theme |

**Events:**
- `row-select` (detail: `{ row, id }`)
- `row-action` (detail: `{ row, id, event }`)

**Attributes:** `selectable`, `pageable`, `filterable`, `actionable`, `theme`, `title`

#### `as-image`
Centered image display.

**Attributes:** `url`

#### `as-video`
Video embed (iframe for YouTube/Vimeo).

**Attributes:**

| Attribute | Type | Default |
|-----------|------|---------|
| `url` | string | `''` |
| `width` | number | `560` |
| `height` | number | `315` |

**Note:** Responsive - auto-adjusts to 310×175 on screens < 560px

#### `as-embed`
Responsive iframe embed (16:9 aspect ratio).

**Attributes:** `url`, `width` (default: 1200), `height` (default: 675)

---

### Form Composition

#### `as-form`
Schema-driven form generator with validation.

**Attributes:** `theme`, `successMessage`, `errorMessage`, `hideTitle`

**Properties (JavaScript):**

```javascript
form.schema = {
  title: 'Form Title',
  sections: [
    { title: 'Section', fields: [ ... ] }
  ],
  // or flat fields:
  fields: [ ... ],
  submitLabel: 'Save',
  cancelLabel: 'Cancel',
  hideCancelButton: false,
  skipActions: false
}
```

**Field Schema:**

```javascript
{
  name: 'fieldName',        // required
  type: 'text|email|password|number|textarea|select|switch|date|time|complete|radio|checkbox|upload',
  label: 'Field Label',
  value: '',                // default value
  placeholder: '',
  required: false,
  disabled: false,
  readonly: false,
  validation: ['required', 'email', 'min:8'],  // validation rules
  options: [                // for select/radio/complete
    { label: 'Option', value: 'value' }
  ],
  rows: 3,                  // for textarea
  accept: '*',              // for upload
  multiple: false           // for upload
}
```

**Methods:**
- `form.getFormData()` → `Object`
- `form.setFormData(data)` → `void`
- `form.clearErrors()` → `void`
- `form.validate()` → `boolean`
- `form.focus()` → `void`

**Events:** `form-submit` (detail: `{ formData }`), `form-cancel`, `field-change` (detail: `{ fieldName, value, formData }`)

#### `AsFormBuilder` (Export)
Utility class for programmatic form validation and schema creation.

```javascript
import { AsFormBuilder } from 'cui';

const builder = new AsFormBuilder();
builder.validateField(value, ['required', 'email']);  // { valid: true/false, message }
builder.validateForm(formData, schema);               // { valid: true/false, errors: {} }
builder.createFormSchema({ title: '', fields: [] });  // normalized schema
```

---

### Interaction Components

#### `as-button`
Action button with variants.

**Attributes:**

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `label` | string | `'Oops!'` | Button text |
| `variant` | `primary\|secondary` | `'primary'` | Visual style |
| `link` | string | `''` | Navigate on click |
| `message` | string | `''` | Show toast on click |
| `disabled` | boolean | `false` | Disabled state |

**Events:** `button-tap` (when no link/message)

**Variants:**
- **Primary**: Blue background (`#3b82f6`), white text
- **Secondary**: Gray background (`#e5e7eb`), dark text

#### `as-cards`
Card index with filtering and tag-based search. Displays a grid of linked cards.

**Attributes:**

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | string | `''` | Optional heading |
| `src` | string | `''` | URL to fetch JSON data from |
| `filtering` | boolean | `false` | Enable filter input + tag filter |
| `theme` | `light\|dark` | `''` | Theme |

**Properties (JavaScript):**

| Property | Type | Description |
|----------|------|-------------|
| `items` | `CardItem[]` | Array of card objects |

**CardItem shape:**

| Field | Type | Description |
|-------|------|-------------|
| `title` / `name` | string | Card heading |
| `description` | string | Card body text |
| `url` | string | Link target |
| `tags` | string[] | Tag labels (for tag filter) |
| `hide` | boolean | If true, item is filtered out |

**Events:**
- `card-click` (detail: `{ item }`) — when a card is clicked

**Styling:**

**Light theme (default):**
| Element | Style |
|---------|-------|
| Card background | `white` |
| Card shadow | `0 3px 10px 0 #aaa` |
| Card hover | `scale(1.05)`, shadow `0 4px 14px 0 #1676f3`, text `#1676f3` |
| Card title | `#1676f3` (azul primario), `font-weight: 600` |
| Card description | `#6b7280` (gris medio) |
| Tag background | `#f3f4f6` (gris claro), sin borde |
| Tag text | `#374151` (gris oscuro) |
| Tag hover background | `#e5e7eb` |
| Tag selected | `background: #3b82f6`, text `white` |
| Filter input | Surface consistency `#e8eaed`, texto `#1a1a1a`, `border-radius: 20px` |
| Grid | `repeat(auto-fit, minmax(12rem, 1fr))`, `gap: 1.5rem`, `grid-auto-rows: 12rem` |

**Dark theme (`theme="dark"`):**
| Element | Style |
|---------|-------|
| Card background | `rgba(255,255,255,0.06)` |
| Card shadow | `0 2px 8px 0 rgba(0,0,0,0.4)` |
| Card `backdrop-filter` | `blur(2px)` |
| Card hover | `scale(1.03)`, shadow `0 3px 12px 0 #3b82f6`, text `#60a5fa` |
| Card title | `#60a5fa`, `font-weight: 600` |
| Card description | `#9ca3af` |
| Tag background | `transparent`, borde `#4b5563` |
| Tag text | `#d1d5db` |
| Tag hover | `rgba(255,255,255,0.08)`, borde `#60a5fa` |
| Tag selected | `background: #3b82f6`, borde `#3b82f6`, text `white` |
| Title heading | `#f3f4f6` |

**Shared rules:**
- Filter input background always `#e8eaed` independent of theme (surface consistency)
- `.card-title` always has `border-bottom: 0.1px solid #aaa` (light) / `#4b5563` (dark)
- Grid collapses to single column at ≤580px
- Tags use `border-radius: 0.375rem` and `transition: background-color 0.2s, color 0.2s, border-color 0.2s`
- Cards use `transition: transform 0.3s, box-shadow 0.3s`

**Data sources (either works):**
```html
<!-- Via src attribute (auto-fetch) -->
<as-cards src="/api/data.json" filtering></as-cards>

<!-- Via JS property (manual) -->
<as-cards id="myCards" filtering></as-cards>
<script>
  myCards.items = [
    { title: 'Hello', description: 'World', tags: ['demo'], url: '/page' }
  ]
</script>
```

#### `as-confirm`
Confirm dialog triggered by button.

**Attributes:** `label`, `link`, `message`

**Behavior:** Clicking button shows modal with confirm/cancel. On confirm: navigates to `link` OR dispatches `confirm-tap` OR shows `message` toast.

#### `as-event`
Button-like input that dispatches custom event (for triggering popups/modals).

**Styling:** Trigger follows surface consistency rule — `#e8eaed` background independent of theme. Chevron always `#1f2937`.

**Attributes:** `label`, `value`, `placeholder`, `event` (event name, default: `'event-trigger'`), `theme`, `readonly`, `disabled`

**Events:** Dispatches custom event named by `event` attribute with `{ value }`

#### `as-popup`
Context menu/popup with smart positioning.

**Attributes:** `options` (same format as select), `theme`

**Methods:** `show(x, y)`, `hide()`

**Properties:** `options` (get/set)

**Events:** `option-select` (detail: `{ value, label }`)

**Features:** Auto-closes on outside click, confirms dangerous actions (delete/remove/destroy)

<!--

## Bundle Size

| Version | Framework | Build Output (gzipped) |
|---------|-----------|------------------------|
| v2.0.0 (x21) | Lit 3 | ~23 KB |
| v3.0.0 (x22) | SolidJS | ~24 KB |

-->

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 15+
- Edge 90+

Requires: `Custom Elements v1`, `Shadow DOM v1`, `ES2020` (nullish coalescing, optional chaining)

---

## Usage

### HTML/Markdown

```html
<script type="module" src="dist/cui.js"></script>

<as-box theme="dark">
  <as-input label="Email" kind="email"></as-input>
  <as-button label="Submit" variant="primary"></as-button>
</as-box>
```

### JavaScript/TypeScript

```javascript
import 'cui'; // or import './src/index-solid'

const form = document.createElement('as-form');
form.schema = { title: 'Login', fields: [...] };
document.body.appendChild(form);
```

---

## Extending the Design System

### Adding a New Component

1. Create `src/as-new-component.tsx`
2. Follow the SolidJS component pattern:

```typescript
import { render } from 'solid-js/web';
import { createSignal } from 'solid-js';
import { createStandardAttributes } from './attribute-observer';

class AsNewComponent extends HTMLElement {
  private dispose?: () => void;

  connectedCallback() {
    const [prop, setProp] = createSignal(this.getAttribute('prop') || '');
    
    // Observe attribute changes using centralized utility
    createStandardAttributes({
      prop: [prop, setProp]
    });

    const Component = () => (
      <>
        <style>{`/* CSS using ${prop()} */`}</style>
        <div>{prop()}</div>
      </>
    );

    const shadowRoot = this.attachShadow({ mode: 'open' });
    this.dispose = render(Component, shadowRoot);
  }

  disconnectedCallback() { this.dispose?.(); }
  static get observedAttributes() { return ['prop']; }
}

customElements.define('as-new-component', AsNewComponent);
```

**Key requirements for new components:**

| File | Purpose |
|------|---------|
| `src/as-new-component.tsx` | Component implementation |
| `src/index-solid.ts` | Export the component |
| `src/vite-env.d.ts` | Add to JSX IntrinsicElements |
| `src/custom-elements.d.ts` | Add TypeScript types |
| `index.html` | Demo/example usage |
| `README.md` | Update component table |

### Required Type Definitions

**Add to `src/vite-env.d.ts`** (for JSX support in HTML/TSX):
```typescript
declare namespace JSX {
  interface IntrinsicElements {
    // ... existing elements
    'as-new-component': {
      prop?: string;
      // Add all component attributes here
    }
  }
}
```

**Add to `src/custom-elements.d.ts`** (for full TypeScript support):
```typescript
declare module 'solid-js' {
  namespace JSX {
    interface IntrinsicElements {
      // ... existing elements
      'as-new-component': {
        prop?: string;
        // Add all component attributes with proper types
        onPropChanged?: (e: CustomEvent<{ value: string }>) => void;
        'on:prop-changed'?: (e: CustomEvent<{ value: string }>) => void;
      }
    }
  }
}
```

### Using the Attribute Observer Utility

The project includes a centralized attribute synchronization utility at `src/attribute-observer.ts`:

```typescript
import { createStandardAttributes, createFormFieldAttributes } from './attribute-observer';

// For simple components (button, checkbox, select, etc.)
createStandardAttributes({
  label: [label, setLabel],
  value: [value, setValue],
  disabled: { setter: setDisabled, isBoolean: true },
  readonly: { setter: setReadonly, isBoolean: true },
  theme: [theme, setTheme] // uses built-in 'dark' | 'light' transform
});

// For form field components (input, select, date, etc.)
createFormFieldAttributes({
  label: [label, setLabel],
  value: [value, setValue],
  placeholder: [placeholder, setPlaceholder],
  disabled: [disabled, setDisabled],
  readonly: [readonly, setReadonly],
  theme: [theme, setTheme],
  required: [required, setRequired]
});
```

**API Reference:**

| Function | Use Case |
|----------|----------|
| `createStandardAttributes(attrs)` | Most components - handles string, boolean, and theme attributes |
| `createFormFieldAttributes(attrs)` | Form inputs - pre-configures common form attributes with types |
| `createAttributeObserver(configs, options)` | Low-level - full control over each attribute's behavior |

### Component Checklist

When adding a new component, verify:

- [ ] `src/as-new-component.tsx` implements component with Shadow DOM
- [ ] Uses `createStandardAttributes` or `createFormFieldAttributes` for attribute sync
- [ ] Supports `theme="light|dark"` attribute
- [ ] Dispatches standard events (`value-changed`, `checked-changed`, etc.)
- [ ] Cleans up in `disconnectedCallback()` (`this.dispose?.()`)
- [ ] Declares `static get observedAttributes()`
- [ ] Exported in `src/index-solid.ts`
- [ ] Added to `src/vite-env.d.ts` (JSX IntrinsicElements)
- [ ] Added to `src/custom-elements.d.ts` (TypeScript types)
- [ ] Demo in `index.html`
- [ ] Entry in `README.md` component table
- [ ] Build passes (`bun run build`)

---

## Extending the Design System

### Adding a New Component

1. Create `src/as-new-component.tsx`
2. Follow the SolidJS component pattern with centralized attribute observer:

```typescript
import { render } from 'solid-js/web';
import { createSignal } from 'solid-js';
import { createStandardAttributes } from './attribute-observer'

class AsNewComponent extends HTMLElement {
  private dispose?: () => void

  connectedCallback() {
    const [prop, setProp] = createSignal(this.getAttribute('prop') || '')
    
    // Use centralized attribute observer (replaces manual MutationObserver)
    createStandardAttributes({
      prop: [prop, setProp],
      disabled: { setter: setDisabled, isBoolean: true }
    })

    const Component = () => (
      <>
        <style>{`/* CSS using ${prop()} */`}</style>
        <div>{prop()}</div>
      </>
    )

    const shadowRoot = this.attachShadow({ mode: 'open' })
    this.dispose = render(Component, shadowRoot)
  }

  disconnectedCallback() { this.dispose?.(); }
  static get observedAttributes() { return ['prop', 'disabled']; }
}

customElements.define('as-new-component', AsNewComponent)
```

3. Export in `src/index-solid.ts`
4. Add to `index.html` demo
5. Update `README.md` component table
6. Add types in `src/vite-env.d.ts` and `src/custom-elements.d.ts`

### Required Files Checklist

| File | What to Add |
|------|-------------|
| `src/as-new-component.tsx` | Component class using `createStandardAttributes` |
| `src/index-solid.ts` | `import './as-new-component'` |
| `src/vite-env.d.ts` | `'as-new-component': { prop?: string }` in `JSX.IntrinsicElements` |
| `src/custom-elements.d.ts` | Full types with events in `JSX.IntrinsicElements` |
| `index.html` | Usage example |
| `README.md` | Row in component table |

### Key Implementation Notes

- **Use `createStandardAttributes`** from `./attribute-observer` instead of manual `MutationObserver`
- **Support `theme="light|dark"`** attribute on every component
- **Dispatch standard events**: `value-changed`, `checked-changed`, `files-selected`, etc.
- **Cleanup in `disconnectedCallback`**: dispose render, remove listeners
- **TypeScript types** in `declare global` block for `HTMLElementTagNameMap`
