import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "./types";
import { Badge } from "./internal/Badge";
import { Avatar } from "./internal/Avatar";
import { GripIcon, EditIcon } from "@/components/icons";

interface TaskCardProps {
    task: Task;
    isActive?: boolean;
    registerRef?: (el: HTMLDivElement | null) => void;
    classNameOverride?: string | undefined;
    onEdit?: (task: Task) => void;
}

export function TaskCard({
    task,
    isActive,
    registerRef,
    classNameOverride,
    onEdit,
}: TaskCardProps) {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const parts: string[] = [task.title];
    if (task.state) parts.push(`Status ${task.state}`);
    if (task.ticket) parts.push(`Ticket ${task.ticket}`);
    if (task.dueDate) {
        parts.push(`Due ${new Date(task.dueDate).toLocaleDateString("en-US", { day: "numeric", month: "long" })}`);
    }
    if (task.assignees?.length) {
        parts.push(`Assigned to ${task.assignees.join(", ")}`);
    }
    const ariaLabel = parts.join(". ");

    const a11y: Record<string, unknown> = { ...attributes };
    if ("aria-describedby" in a11y) delete a11y["aria-describedby"];

    function handleEditClick(e: React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        if (onEdit) onEdit(task);
    }

    return (
        <div
            ref={(el) => {
                setNodeRef(el);
                if (registerRef) registerRef(el);
            }}
            style={style}
            {...a11y}
            {...listeners}
            aria-label={ariaLabel}
            tabIndex={0}
            className={`kanban-card focus-outline cursor-grab active:cursor-grabbing relative rounded-md px-4 pl-8 pr-10 py-3 text-xs transition-all bg-white border border-slate-200 shadow-sm hover:shadow-md dark:bg-slate-800 dark:border-slate-600 group/card ${isDragging ? "opacity-0" : ""
                } ${isActive ? "opacity-40 scale-[0.98]" : ""} ${classNameOverride || ""}`}
        >
            <div
                className="absolute left-2 top-1/2 -translate-y-1/2 opacity-40 group-hover/card:opacity-100 transition-opacity text-slate-400"
            >
                <GripIcon />
            </div>

            {onEdit && (
                <button
                    type="button"
                    onClick={handleEditClick}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="absolute right-2 top-2 p-1.5 rounded-md opacity-0 group-hover/card:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    aria-label="Edit task"
                >
                    <EditIcon size={12} />
                </button>
            )}

            <div className="font-medium tracking-tight text-[14px] leading-snug mb-2 text-slate-900 dark:text-white pr-4">
                {task.title}
            </div>

            <div className="flex flex-wrap gap-1.5 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400 mb-2.5">
                {task.state && <Badge kind={task.state} />}
                {task.priority && (
                    <Badge kind={task.priority}>
                        {task.priority === "high" ? "High" : task.priority === "medium" ? "Medium" : "Low"}
                    </Badge>
                )}
                {task.ticket && <Badge kind="ticket">{task.ticket}</Badge>}
                {task.contentTag && <Badge kind="content">{task.contentTag}</Badge>}
                {task.dueDate && (
                    <Badge kind="date">
                        {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </Badge>
                )}
            </div>

            {task.assignees && (
                <div className="flex flex-wrap gap-1">
                    {task.assignees.map((a) => (
                        <Avatar key={a} name={a} />
                    ))}
                </div>
            )}
        </div>
    );
}
