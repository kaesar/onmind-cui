# Guía de Componentes OnMind-CUI

Conjunto selecto de componentes web como Web Components (custom elements) basados en **Lit** & **VaadinUI**, orientados al uso común en formularios y UIs de datos (para diversos propósitos/destinos). Los componentes se registran como custom elements con nombres que comienzan por `as-` (minúsculas) y siempre se usan como etiquetas HTML completas (con cierre).

**CUI** significa: Cross User Interface

Componentes incluidos (nombres de etiqueta):

- `as-complete`
- `as-box`
- `as-button`
- `as-check`
- `as-confirm`
- `as-datagrid`
- `as-date`
- `as-embed`
- `as-image`
- `as-input`
- `as-radio`
- `as-select`
- `as-switch`
- `as-text`
- `as-time`
- `as-video`

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

Los componentes emiten CustomEvent con nombres descriptivos (por ejemplo `row-select` en as-datagrid). El detalle útil llega en `event.detail`.

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
<as-datagrid title="Usuarios" theme="light" selectable filterable pageable row-key="id"></as-datagrid>
<script>
const dg = document.querySelector('as-datagrid');
dg.data = [
  { id: 1, name: 'Juan', email: 'juan@example.com' },
  { id: 2, name: 'María', email: 'maria@example.com' }
];
dg.columns = [{ key: 'name', header: 'Nombre' }, { key: 'email', header: 'Email' }];
dg.addEventListener('row-select', e => console.log('Usuario seleccionado:', e.detail));
</script>
```

AsImage / AsVideo / AsEmbed
```html
<as-image url="https://ejemplo.com/imagen.jpg"></as-image>
<as-video url="https://www.youtube.com/embed/dQw4w9WgXcQ"></as-video>
<as-embed url="https://www.ejemplo.com" width="800" height="600"></as-embed>
```

---

Notas finales
- Usa atributos para configuraciones simples y asigna propiedades desde JS para datos complejos.
- Escucha eventos CustomEvent para interacción (p. ej. `row-select`).
- Las etiquetas son siempre en minúscula y se cierran como cualquier elemento HTML: <as-name></as-name>
