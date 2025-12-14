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
- `as-image`
- `as-input`
- `as-popup`
- `as-radio`
- `as-select`
- `as-switch`
- `as-text`
- `as-time`
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
- `confirm` (as-confirm): Se dispara al confirmar la acción en el diálogo
- `value-changed` (as-input, as-date, as-time, as-text, as-select, as-radio, as-complete): Se dispara al cambiar el valor. `event.detail.value` contiene el nuevo valor
- `checked-changed` (as-check, as-switch): Se dispara al cambiar el estado. `event.detail.value` contiene true/false
- `row-select` (as-datagrid): Se dispara al seleccionar una fila. `event.detail` contiene `{ row, id }`
- `row-action` (as-datagrid): Se dispara al hacer clic en el botón de acciones de una fila (solo si `actionable` está habilitado). `event.detail` contiene `{ row, id, event }` donde `event` es el MouseEvent para posicionamiento de menús
- `option-select` (as-popup): Se dispara al seleccionar una opción del popup. `event.detail` contiene `{ value, label }`
- `event-trigger` (as-event): Evento personalizado configurable mediante el atributo `event`. `event.detail.value` contiene el valor actual

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

AsImage / AsVideo / AsEmbed
```html
<as-image url="https://ejemplo.com/imagen.jpg"></as-image>
<as-video url="https://www.youtube.com/embed/dQw4w9WgXcQ"></as-video>
<as-embed url="https://www.ejemplo.com" width="800" height="600"></as-embed>
```

AsPopup
```html
<as-popup options="label=Editar,value=edit;label=Duplicar,value=duplicate;label=Eliminar,value=delete"></as-popup>
<script>
const popup = document.querySelector('as-popup');
// Mostrar popup en coordenadas específicas
popup.show(100, 200);
// Escuchar selección de opciones
popup.addEventListener('option-select', (e) => {
  console.log('Opción seleccionada:', e.detail.value, e.detail.label);
});
// Las opciones con valores que contengan 'delete', 'remove', 'destroy', 'eliminar', 'borrar'
// se muestran automáticamente en color rojo (danger)
</script>
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
