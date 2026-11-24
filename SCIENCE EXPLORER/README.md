# Science Explorer

Aplicación web de una sola página desarrollada con HTML5, CSS3 y JavaScript nativo (sin frameworks ni clases).

## Ejecución local
Abre `index.html` directamente en un navegador moderno (Chrome o Firefox) o mediante un servidor estático local.

## Estructura
- `index.html`: 7 secciones (`inicio`, `descubrimientos`, `cientificos`, `laboratorio`, `cronologia`, `desafio`, `bitacora`) y modal de detalle.
- `css/estilos.css`: estilos responsivos y de accesibilidad.
- `js/datos.js`: arreglos y objetos con 30 descubrimientos, 12 perfiles científicos, 15 hitos y 25 preguntas.
- `js/biblioteca.js`, `js/laboratorio.js`, `js/desafio.js`, `js/bitacora.js`, `js/app.js`: lógica de interfaz, filtros, simulaciones, cuestionario y persistencia en `localStorage`.