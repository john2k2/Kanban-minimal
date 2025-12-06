// Paleta suave para modo claro y más saturada para modo oscuro.
// Usamos clases fijas para que Tailwind las incluya en el build (no dinámicas).
const LIGHT_COLOR_CLASSES = [
  'bg-violet-500','bg-fuchsia-500','bg-rose-500','bg-amber-500','bg-emerald-500','bg-cyan-500','bg-indigo-500'
];
const DARK_COLOR_CLASSES = [
  'dark:bg-violet-400','dark:bg-fuchsia-400','dark:bg-rose-400','dark:bg-amber-400','dark:bg-emerald-400','dark:bg-cyan-400','dark:bg-indigo-400'
];

function pickIndex(name: string){
  let h = 0;
  for(let i=0;i<name.length;i++) h = (h*31 + name.charCodeAt(i)) >>> 0;
  return h % LIGHT_COLOR_CLASSES.length;
}

export function Avatar({ name }: { name: string }) {
  const initials = name.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase();
  const idx = pickIndex(name);
  // Construimos la clase combinando color claro + correspondiente variante dark para el mismo índice
  const light = LIGHT_COLOR_CLASSES[idx];
  const dark = DARK_COLOR_CLASSES[idx];
  // NOTA: Solo utilidades Tailwind; nada depende de globals.css aquí.
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] leading-tight bg-surface-alt/80 dark:bg-surface-darkAlt/40 backdrop-blur-[1px] border border-border/60 dark:border-border-dark/60 text-textc-secondary dark:text-textc-dark shadow-[0_1px_1px_rgba(0,0,0,0.04)] max-w-[120px]">
      <span
        className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-medium leading-none shadow text-textc-dark ${light} ${dark}`}
        aria-hidden
      >
        {initials}
      </span>
      <span className="truncate" title={name}>
        {name}
      </span>
    </span>
  );
}
