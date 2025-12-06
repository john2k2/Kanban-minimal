# Tokens de Diseño

## Colores Base

- Fondo: `--color-bg`, dark: `--dark-bg`
- Superficies: `--color-surface`, `--color-surface-alt`, dark: `--dark-surface`, `--dark-surface-alt`
- Bordes: `--color-border`, dark: `--dark-border`
- Texto primario/secundario/terciario y variantes dark

## Estados (Badges)

Variables (modo claro):

- ToDo: `--state-todo-bg`, `--state-todo-border`, `--state-todo-fg`
- InProgress: `--state-progress-*`
- Done: `--state-done-*`
- Content: `--state-content-*`
- Date: `--state-date-*`
- Ticket: `--badge-ticket-bg`, `--badge-ticket-border`, `--badge-ticket-fg`

En modo oscuro (`.dark`) reasignamos las variables base a sus variantes `*-dark` para no duplicar lógica en componentes.

## Líneas de Columna

- Light: `--accent-line-todo`, `--accent-line-progress`, `--accent-line-done`
- Dark override: valores saturados mapeados al mismo nombre.

## Principios

1. El componente solo conoce nombres semánticos, no tokens crudos de Tailwind.
2. Modo oscuro se aplica sobrescribiendo las mismas keys para reducir condicionales.
3. Transiciones suaves: se evita recargar snapshots con cambios micro en opacidades.

## Próximas Extensiones

- Tokenizar spacing (ej. `--space-x-card`, `--space-y-column-gap`).
- Altos contrastes (flag `data-high-contrast`) para aumentar legibilidad a demanda.

## Modo Alto Contraste (HC)

Se activa añadiendo clase `hc` al `<html>`. Ajustes clave:

- Refuerza bordes y focus ring (`--color-border-accent`, `--focus-ring`).
- Incrementa saturación y contraste de badges (`filter: saturate(1.15) contrast(1.1)`).
- Eleva peso tipográfico en títulos de columna y badges.
- Mantiene mismas variables semánticas para no duplicar lógica en componentes.

Persistencia: `localStorage['kanban-hc'] = 'on' | 'off'`.
