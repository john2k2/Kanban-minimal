# Improvement Tracking

Documento de seguimiento incremental de mejoras aplicadas al tablero Kanban.

## Formato

- Fecha
- Categoría (A11y, DX, Testing, State, UI, Perf, Arch)
- Cambio
- Estado (hecho / pendiente / en progreso)

## Historial

### 2025-09-11

- [x] State: Tipado estricto `TaskState` y refactor de reducer exportable.
- [x] Arch: Extracción de `initialColumns` a `data/`.
- [x] Testing: Añadidos tests unitarios `kanbanReducer.spec.ts` y `themePersistence.spec.ts` con Vitest.
- [x] DX: Script `test:unit` y config `vitest.config.ts`.
- [x] A11y: Devolver foco tras drag & drop mediante registro de refs.
- [x] State: IDs de nuevas tareas con `crypto.randomUUID` fallback.
- [x] Testing: Actualización de snapshots visuales tras refactor de store / focus.
- [x] A11y: Migración de columnas a <section role="region" aria-labelledby> + ajuste de tests visuales.
- [x] Testing/A11y: Integración de @axe-core/playwright con test claro/oscuro.
- [x] Perf: Mapa de lookup taskId -> (colIndex, taskIndex) para búsquedas O(1) + actualización de snapshot inicial.
- [x] UI/A11y: Formulario inline accesible para crear tarea (reemplaza prompt) con enfoque automático y retorno de foco a la nueva tarjeta.
- [x] UI/Anim: Animación de aparición para nueva tarjeta + placeholder con brillo.
- [x] Feature: Persistencia local del tablero (localStorage) con HYDRATE + guardado throttle.

## Backlog (Orden Tentativo)

1. Arch: Selectores derivados memoizados.
2. i18n: Capa mínima de traducciones.

---

Actualiza este documento junto a cada PR / commit de mejora.
