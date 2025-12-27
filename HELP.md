# Guía de Componentes OnMind-CUI

Conjunto selecto de componentes web como Web Components (custom elements) basados en **Lit** e inspirados en **VaadinUI**, orientados al uso común en formularios y UIs de datos (para diversos propósitos/destinos). Los componentes se registran como custom elements con nombres que comienzan por `as-` (minúsculas) y siempre se usan como etiquetas HTML completas (con cierre).

**CUI** significa: Core/Cross/Common User Interface

Componentes incluidos (nombres de etiqueta):

- `as-complete`
- `as-box`
- `as-button`
- `as-check`
- `as-confirm`
- `as-datagrid`
- `as-date`
- `as-embed`
- `as-event`
- `as-form`
- `as-image`
- `as-input`
- `as-modal`
- `as-popup`
- `as-radio`
- `as-select`
- `as-switch`
- `as-text`
- `as-time`
- `as-upload`
- `as-video`

> `as-event` es útil cuando necesitas un campo que dispare una acción personalizada (abrir modal, diálogo de archivos, etc.) en lugar de mostrar un dropdown

## Modo de uso desde HTML estático (configuración simple)

Solo incluye el CSS y el script que registra los componentes. Ejemplo mínimo:

```html
<link rel="stylesheet" href="/static/js/onmind-cui-v3.css">
<script type="module" src="/static/js/onmind-cui-elements.js"></script>
```

Tras esto puedes usar los componentes directamente en tu HTML:

```html
<as-datagrid title="Usuarios" selectable filterable pageable row-key="id"></as-datagrid>
```

Para pasar datos complejos (arrays/objetos) o configurar propiedades en tiempo de ejecución usa JavaScript:

```html
<script>
const dg = document.querySelector('as-datagrid');
dg.data = [
  { id: 1, name: 'Juan', email: 'juan@example.com' },
  { id: 2, name: 'María', email: 'maria@example.com' }
];
dg.columns = [
  { key: 'name', header: 'Nombre' },
  { key: 'email', header: 'Email' }
];
dg.addEventListener('row-select', (ev) => {
  console.log('Fila seleccionada:', ev.detail); // ev.detail contiene la fila
});
</script>
```

Nota: los atributos HTML son adecuados para valores simples (strings, booleans). Para datos/arrays/objetos asigna las propiedades desde JavaScript.

## Eventos

Los componentes emiten CustomEvent con nombres descriptivos. El detalle útil llega en `event.detail`.

Eventos disponibles:
- `button-tap` (as-button): Se dispara al hacer clic cuando no hay link ni message definido
- `confirm-tap` (as-confirm): Se dispara al confirmar la acción en el diálogo
- `value-changed` (as-input, as-date, as-time, as-text, as-select, as-radio, as-complete): Se dispara al cambiar el valor. `event.detail.value` contiene el nuevo valor
- `checked-changed` (as-check, as-switch): Se dispara al cambiar el estado. `event.detail.value` contiene true/false
- `row-select` (as-datagrid): Se dispara al seleccionar una fila. `event.detail` contiene `{ row, id }`
- `row-action` (as-datagrid): Se dispara al hacer clic en el botón de acciones de una fila (solo si `actionable` está habilitado). `event.detail` contiene `{ row, id, event }` donde `event` es el MouseEvent para posicionamiento de menús
- `form-submit` (as-form): Se dispara al enviar el formulario con validación exitosa. `event.detail` contiene `{ formData }`
- `form-cancel` (as-form): Se dispara al cancelar el formulario
- `field-change` (as-form): Se dispara al cambiar cualquier campo. `event.detail` contiene `{ fieldName, value, formData }`
- `event-trigger` (as-event): Evento personalizado configurable mediante el atributo `event`. `event.detail.value` contiene el valor actual
- `modal-close` (as-modal): Se dispara al cerrar el modal (botón X o método hide())
- `files-selected` (as-upload): Se dispara al seleccionar archivos. `event.detail.files` contiene array de archivos

---

## Ejemplos de uso por componente (resumen rápido)

AsButton
```html
<as-button label="Guardar" message="Datos guardados correctamente"></as-button>
<as-button label="Ir al inicio" link="/home"></as-button>
<as-button label="Acción personalizada"></as-button>
<script>
document.querySelector('as-button').addEventListener('button-tap', () => {
  console.log('Botón clickeado!');
});
</script>
```

AsInput
```html
<as-input placeholder="Nombre completo"></as-input>
<as-input kind="email" placeholder="correo@ejemplo.com"></as-input>
<as-input kind="password" placeholder="Contraseña"></as-input>
<as-input kind="number" placeholder="Edad"></as-input>
```

AsCheck
```html
<as-check></as-check>
```
(usa eventos y propiedades desde JS para enlazar estados; no hay v-model en HTML nativo)

AsSwitch
```html
<as-switch label="Notificaciones" checked></as-switch>
```

AsRadio
```html
<as-radio label="Selecciona tu plan" options="label=Básico,value=basic;label=Premium,value=premium"></as-radio>
```

AsSelect
```html
<as-select label="Selecciona país" options="label=México,value=mx;label=Colombia,value=co"></as-select>
```

AsEvent
```html
<as-event label="Seleccionar archivo" value="documento.pdf" event="file-select"></as-event>
<script>
document.querySelector('as-event').addEventListener('file-select', (e) => {
  console.log('Evento disparado:', e.detail.value);
  // Aquí puedes abrir un diálogo, modal, o cualquier acción personalizada
});
</script>
```

AsComplete
```html
<as-complete label="Buscar ciudad" options="label=Madrid,value=mad;label=Barcelona,value=bcn"></as-complete>
```

AsText
```html
<as-text rows="5"></as-text>
```

AsDate / AsTime
```html
<as-date placeholder="Selecciona fecha de nacimiento"></as-date>
<as-time placeholder="Selecciona hora"></as-time>
```

AsBox
```html
<as-box dim="false" theme="light">
  <h3>Título</h3>
  <p>Contenido de la tarjeta</p>
</as-box>
```

AsConfirm
```html
<as-confirm label="Eliminar" message="¿Estás seguro de eliminar este elemento?"></as-confirm>
```

AsDatagrid (ejemplo básico)
```html
<as-datagrid title="Usuarios" theme="light" selectable filterable pageable actionable></as-datagrid>
<script>
const dg = document.querySelector('as-datagrid');
dg.data = [
  { id: 1, name: 'Juan', email: 'juan@example.com' },
  { id: 2, name: 'María', email: 'maria@example.com' }
];
dg.columns = [{ key: 'name', header: 'Nombre' }, { key: 'email', header: 'Email' }];
dg.addEventListener('row-select', e => console.log('Usuario seleccionado:', e.detail));
dg.addEventListener('row-action', e => {
  console.log('Acción en fila:', e.detail);
  // e.detail.event contiene las coordenadas del mouse para posicionar menús
});
</script>
```

AsImage / AsVideo / AsEmbed / AsUpload
```html
<as-image url="https://ejemplo.com/imagen.jpg"></as-image>
<as-video url="https://www.youtube.com/embed/dQw4w9WgXcQ"></as-video>
<as-embed url="https://www.ejemplo.com" width="800" height="600"></as-embed>
<as-upload label="Subir archivos" accept="image/*" multiple></as-upload>
<script>
document.querySelector('as-upload').addEventListener('files-selected', (e) => {
  console.log('Archivos seleccionados:', e.detail.files);
  // Procesar archivos
});
</script>
```

AsForm
```html
<as-form id="myForm"></as-form>
<script>
const form = document.getElementById('myForm');
form.schema = {
  title: 'Contact Form',
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
      required: true,
      validation: ['required', 'min:2']
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true,
      validation: ['required', 'email']
    },
    {
      name: 'password',
      type: 'password',
      label: 'Password',
      required: true,
      validation: ['required', 'password']
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      required: true,
      validation: ['required', 'enum:active,inactive,pending'],
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Pending', value: 'pending' }
      ]
    }
  ]
};

// Manejar envío exitoso
form.addEventListener('form-submit', (e) => {
  console.log('Form data:', e.detail.formData);
  // Procesar datos del formulario
});

// Manejar cancelación
form.addEventListener('form-cancel', () => {
  console.log('Form cancelled');
});

// Manejar cambios de campos en tiempo real
form.addEventListener('field-change', (e) => {
  console.log('Field changed:', e.detail.fieldName, e.detail.value);
});

// Control externo de errores
form.clearErrors(); // Limpiar todos los errores
const isValid = form.validate(); // Validar manualmente
const formData = form.getFormData(); // Obtener datos actuales
form.setFormData({ name: 'John', email: 'john@example.com' }); // Establecer datos
</script>
```

AsModal
```html
<as-modal id="myModal" title="Editar Usuario">
  <as-form id="userForm"></as-form>
</as-modal>

<script>
const modal = document.getElementById('myModal');
const form = document.getElementById('userForm');

// Configurar formulario
form.schema = {
  fields: [
    { name: 'name', type: 'text', label: 'Nombre', validation: ['required'] },
    { name: 'email', type: 'email', label: 'Email', validation: ['required', 'email'] }
  ]
};

// Mostrar modal
modal.show();

// Manejar envío del formulario
form.addEventListener('form-submit', (e) => {
  console.log('Datos:', e.detail.formData);
  modal.hide(); // Cerrar modal tras envío exitoso
});

// Manejar cierre del modal
modal.addEventListener('modal-close', () => {
  console.log('Modal cerrado');
});
</script>
```

### Integración as-form con as-modal

Cuando `as-form` se usa dentro de `as-modal`, el modal automáticamente oculta el título del formulario para evitar duplicación:

- **hideTitle**: Propiedad que se activa automáticamente cuando el formulario está dentro de un modal
- El modal establece `hideTitle=true` al abrirse y `hideTitle=false` al cerrarse
- La integración funciona automáticamente tras llamar a `modal.show()`

```html
<!-- El título del formulario se oculta automáticamente -->
<as-modal title="Crear Usuario">
  <as-form id="userForm"></as-form>
</as-modal>

<script>
const modal = document.querySelector('as-modal');
const form = document.querySelector('#userForm');

// Configurar formulario con título
form.schema = {
  title: 'Formulario Usuario', // Este título se ocultará automáticamente
  fields: [
    { name: 'name', type: 'text', label: 'Nombre', validation: ['required'] }
  ]
};

// Al mostrar el modal, el título del formulario se oculta automáticamente
modal.show();
</script>
```

## Control de Errores en as-form

### Validación Automática
- Los errores se muestran automáticamente debajo de cada campo
- La validación ocurre al cambiar el valor del campo
- Los errores se limpian automáticamente al corregir el campo

### Control Manual de Errores
```javascript
const form = document.querySelector('as-form');

// Limpiar todos los errores
form.clearErrors();

// Validar formulario completo
const isValid = form.validate();
if (!isValid) {
  console.log('Form has validation errors');
}

// Obtener/establecer datos del formulario
const currentData = form.getFormData();
form.setFormData({ field1: 'value1', field2: 'value2' });
```

### Validadores Disponibles
- `required` - Campo obligatorio
- `email` - Formato de email válido
- `min:n` - Mínimo n caracteres
- `max:n` - Máximo n caracteres
- `number` - Número válido
- `positive` - Número positivo
- `url` - URL válida
- `password` - Password seguro (8+ chars, mayús, minús, número)
- `pattern:regex` - Patrón personalizado
- `enum:val1,val2,val3` - Valor debe estar en el conjunto de opciones

AsFormBuilder (Exportable Logic)
```javascript
import { AsFormBuilder } from './as-form-builder';

const builder = new AsFormBuilder({
  customValidators: {
    'strongPassword': {
      validate: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(value),
      message: 'Password must be very strong'
    }
  }
});

// Create predefined schemas
const userSchema = builder.createUserFormSchema(userData);
const contactSchema = builder.createContactFormSchema();

// Validate form data
const result = builder.validateForm(formData, schema);
if (!result.valid) {
  console.log('Errors:', result.errors);
}
```

---

## Ejemplo completo: as-datagrid con as-popup

```html
<as-datagrid id="table" actionable selectable filterable pageable></as-datagrid>
<as-popup id="contextMenu" options="label=Editar,value=edit;label=Duplicar,value=duplicate;label=Eliminar,value=delete"></as-popup>

<script>
const table = document.getElementById('table');
const popup = document.getElementById('contextMenu');

// Configurar datos del datagrid
table.data = [
  { id: 1, name: 'Usuario 1', email: 'user1@example.com' },
  { id: 2, name: 'Usuario 2', email: 'user2@example.com' }
];
table.columns = [
  { key: 'name', header: 'Nombre' },
  { key: 'email', header: 'Email' }
];

// Mostrar popup al hacer clic en acciones
table.addEventListener('row-action', (e) => {
  const mouseEvent = e.detail.event;
  popup.show(mouseEvent.clientX, mouseEvent.clientY);
  popup._currentRow = e.detail.row; // Guardar referencia de la fila
});

// Manejar selección de opciones del popup
popup.addEventListener('option-select', (e) => {
  const action = e.detail.value;
  const row = popup._currentRow;
  console.log(`Acción ${action} en:`, row);
});
</script>
```

**Notas finales**

- Usa atributos para configuraciones simples y asigna propiedades desde **JS** para datos complejos.
- Escucha eventos CustomEvent para interacción (ej. `row-select`, `row-action`).
- Las etiquetas son siempre en minúscula y se cierran como cualquier elemento HTML: <as-name></as-name>
- `as-popup` se posiciona automáticamente y detecta opciones de peligro por palabras clave en el valor
