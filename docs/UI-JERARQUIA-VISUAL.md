# Jerarquía Visual del Kanban

Principios aplicados:

1. Peso tipográfico: Títulos de tarjeta `font-weight:600`, badges en `500` y color atenuado (#5b6675) para no competir.
2. Saturación progresiva: Estados (Done / In Progress / To Do) mantienen color de fondo distintivo; en modo dark se desatura un 10% con `color-mix`.
3. Agrupación y respiración: Padding vertical de tarjeta aumentado a 12px; meta-row con `row-gap:2px` para compactar sin ruido.
4. Indicador de drag (grip) reducido: Ancho 5px y desplazado a 8px del borde para evitar colisión visual con contenido.
5. Placeholders sutiles: Patrón de fondo con menor opacidad y transición de altura para feedback suave.
6. Avatares: Fondo neutro semitransparente y shadow ligero para separación sin dominar.
7. Hover: Elevación moderada (sombra dual) + borde aclarado; evita saltos de layout.
8. Accesibilidad: Contraste mantenido >4.5:1 en texto primario y badges estado; ticket/content deliberadamente más bajo al ser secundarios.

Recomendaciones futuras:
- Ajustar dinámica de badges para colapsar ticket/content cuando haya >3 elementos.
- Animación de inserción (scale+fade) al reordenar.
- Modo compact alternativo con densidad mayor.
