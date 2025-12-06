import { ThemeToggle } from "./ThemeToggle";
import { KanbanIcon } from "@/components/icons";

interface BoardHeaderProps {
    dark: boolean;
    onToggle: () => void;
}

export function BoardHeader({ dark, onToggle }: BoardHeaderProps) {
    return (
        <header className="px-6 py-3 flex items-center gap-6 border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5">
                    <KanbanIcon className="text-blue-600 dark:text-blue-400" />
                    <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                        Project Board
                    </h1>
                </div>
                <div className="h-5 w-px bg-slate-200 dark:bg-slate-600 mx-1" />
                <ThemeToggle pressed={dark} onToggle={onToggle} />
            </div>
            <div className="ml-auto flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                    Kanban Demo
                </span>
            </div>
        </header>
    );
}
