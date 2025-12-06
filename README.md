# Kanban Minimal

> Tablero Kanban minimalista optimizado para accesibilidad, theming (light/dark) y pruebas visuales.

## 🚀 Características Clave
- Drag & Drop (mouse) y reordenamiento por teclado (flechas) con mensajes accesibles (live region)
- Temas Light / Dark persistentes via `localStorage` (sin parpadeos de hidratación)
- Tokens de diseño centralizados (`src/lib/design-system.ts` + `globals.css`)
- Jerarquía visual refinada (badges, grips, columnas con blur y elevación)
- Tests visuales con Playwright (snapshots light/dark + columnas específicas)
- Arquitectura modular: componentes desacoplados + pequeña store in‑memory (`useKanbanStore`)
- Accesibilidad: `aria-live`, focos visibles, navegación por teclado, outlines consistentes

## 📂 Estructura Simplificada
```
src/
	app/
		layout.tsx      // Script inicial tema + layout raíz
		page.tsx        // Monta el tablero
	components/kanban/
		KanbanBoard.tsx // Orquestación dnd + teclado
		Column.tsx      // Columna
		TaskCard.tsx    // Tarjeta
		BoardHeader.tsx // Header + toggle
		ThemeToggle.tsx // Control tema
		internal/Avatar.tsx / Badge.tsx
		useKanbanStore.ts   // Estado y acciones
	lib/design-system.ts  // Tokens TS
globals.css             // Tokens CSS + estilos utilitarios
```

## 🛠️ Scripts
```powershell
npm install        # Instala dependencias
npm run dev        # Desarrollo (Turbopack)
npm run build      # Build producción
npm run start      # Servir build
npm run lint       # Linter
npm run test:visual          # Corre pruebas visuales
npm run test:visual:update   # Actualiza snapshots
```

## 🎨 Theming
- Clase `dark` en `<html>` inicializada inline antes del primer paint.
- Selectores CSS: `html.dark body` y fallback light = ausencia de `.dark`.
- Toggle actualiza `localStorage` + clase sin causar mismatch de hidratación.

## ♿ Accesibilidad
- Reordenamiento por teclado (flechas ↑ ↓ dentro de columna, ← → entre columnas).
- Mensajes discretos vía región viva oculta.
- `focus-visible` con anillo de alto contraste (diferenciado en dark).

## 🧪 Visual Testing
- Playwright guarda snapshots por modo (light/dark) y por columna.
- Para actualizar tras cambio intencional: `npm run test:visual:update`.

## ✅ Checklist Técnica
- [x] Estado in‑memory modular
- [x] DnD + teclado
- [x] Persistencia de tema
- [x] Tokens de diseño
- [x] Pruebas visuales base
- [x] Reducer testeable + tests unitarios iniciales
- [ ] Animaciones suaves al insertar tarjeta
- [ ] Tests adicionales de accesibilidad

## 🔄 Flujo para Crear Nueva Tarjeta
1. Click en botón de añadir en una columna.
2. Prompt (prototipo) — en versión futura reemplazar por modal o inline form.

## 🌐 Publicación en GitHub
1. Crear repositorio vacío (sin README) en GitHub.
2. Añadir remoto y hacer push (ver sección siguiente).
3. Activar Actions opcionalmente para CI (Playwright + lint).

## ⬆️ Push Rápido (ejemplo)
```powershell
git remote add origin https://github.com/USUARIO/kanban-minimal.git
git push -u origin main
```
Si ya existe un remoto, usar:
```powershell
git remote set-url origin https://github.com/USUARIO/kanban-minimal.git
```

## 📝 Licencia
MIT (ver archivo `LICENSE`).

## 📈 Tracking de Mejoras
Ver `docs/IMPROVEMENT-TRACKING.md` para historial y backlog vivo.

---
Siente libre de abrir issues o mejorar la animación / accesibilidad avanzada.
