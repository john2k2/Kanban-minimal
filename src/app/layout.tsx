import './globals.css';
import type { ReactNode } from 'react';

// Script crítico para prevenir flash de tema incorrecto
const PREF_SCRIPT = `
(function() {
  try {
    var localValue = localStorage.getItem('kanban-theme');
    var systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (localValue === 'dark' || (!localValue && systemPreference)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();
`;

export const metadata = {
    title: 'Kanban Board',
    description: 'A minimal, accessible Kanban board built with Next.js and React',
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: PREF_SCRIPT }} />
            </head>
            {/* 
        IMPORTANTE: background transition para suavizar el cambio.
        Usamos colores Slate estándar de Tailwind.
      */}
            <body className="min-h-screen transition-colors duration-200 bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100" suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}
