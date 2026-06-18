# Products Table

Aplicación web para gestión y visualización de productos con tabla virtualizada, filtros avanzados y tema claro/oscuro.

## Stack

- **Angular** 18.2 (standalone components, SSR)
- **Tailwind CSS** 3.4 + SCSS con variables CSS
- **Reactive Forms** con filtrado reactivo

## Características

- **Virtualización incremental**: carga de 20 en 20 registros al hacer scroll
- **Skeleton loader** animado durante la carga inicial
- **Búsqueda en tiempo real** por código o nombre (debounce 300ms)
- **Filtros avanzados** en modal: categoría, estado, rango de precio
- **Tema claro/oscuro** con persistencia en `localStorage`
- **Diseño responsive**: tabla en desktop, cards en mobile/tablet

## Requisitos

- Node.js 22.x
- npm

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

La aplicación se abre en `http://localhost:4200`.

## Comandos

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm run watch` | Compilación en modo watch |
| `npm run test` | Ejecuta las pruebas unitarias |
| `npm run serve:ssr:products-table` | Inicia el servidor SSR |

## Autor

**Waldir Mendoza Huamán** — waldirmendozahuaman887@gmail.com
