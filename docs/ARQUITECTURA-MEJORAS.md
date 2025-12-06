# Plan de Refactor Arquitectura Kanban

## Objetivo
Estandarizar la arquitectura del tablero Kanban para facilitar escalabilidad, mantenibilidad, pruebas y extensiones futuras (persistencia, colaboración, virtualización).

## Roadmap (Iteraciones)
1. Separar componentes principales:
   - `BoardHeader`
   - `ThemeToggle`
   - `TaskCard`
   - `Column`
2. Crear hook estado: `useKanbanStore` (API mínima + selectores memoizados)
3. Extraer tokens de diseño a `design-tokens.json` y generar CSS Custom Properties.
4. Añadir `ErrorBoundary` + UI de fallback.
5. (Posterior) Persistencia de tareas, export/import, i18n, teclado completo.

## 1. Componentes
| Componente | Responsabilidad | Props clave |
|------------|-----------------|------------|
| `BoardHeader` | Título, toggle tema, meta info | `dark`, `onToggleTheme` |
| `ThemeToggle` | Control aislado accesible de tema | `pressed`, `onToggle` |
| `TaskCard` | Render de tarea + badges + arrastre | `task` |
| `Column` | Encabezado + lista de tareas + botón nueva | `column`, `tasks`, `onAdd` |

## 2. useKanbanStore
API propuesta:
```ts
const { columns, moveTask, reorderTask, addTask, findTask, getColumnTasks } = useKanbanStore();
```
Interno: `useReducer` + contexto o Zustand (fase 2). Para ahora: reducer puro testable.

## 3. Tokens Diseño
Archivo: `src/design-tokens.json`
Estructura ejemplo:
```json
{
  "colors": { "bgLight": "#ffffff", "bgDark": "#0f172a", "accentTodo": "#8b5cf6" },
  "radius": { "sm": "4px", "md": "6px" },
  "space": { "1": "4px", "2": "8px" }
}
```
Script build (futuro): lee JSON y genera `:root { --token-name: value; }`.

## 4. Error Boundary
Crear `components/system/ErrorBoundary.tsx` y envolver layout. Fallback minimal: mensaje + botón recargar. Añadir captura de errores runtime de DnD.

## Métricas de éxito
- `KanbanBoard.tsx` reduce >60% de líneas.
- Re-render de `TaskCard` solo al cambiar su tarea.
- Sin errores consola en carga inicial.

## Próximos pasos inmediatos
1. Implementar extracción de `TaskCard` y `ThemeToggle`.
2. Introducir `BoardHeader` y `Column`.
3. Añadir `useKanbanStore` (fase 1 con useReducer local).
4. Integrar ErrorBoundary.

## Notas
- Mantener accesibilidad actual (roles, aria-labels).
- Mantener IDs actuales para no romper snapshots visuales.
- Migración incremental: comprobar Playwright tras cada bloque.
