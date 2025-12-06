import { useState } from "react";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Column as ColumnType, Task, NewTaskData, UpdateTaskData, ColumnId } from "./types";
import { TaskCard } from "./TaskCard";
import { EmptyStateIcon, PlusIcon } from "@/components/icons";
import { AddTaskForm } from "./internal/AddTaskForm";
import { EditTaskModal } from "./internal/EditTaskModal";
import { panel } from "@/lib/ui";

type OnAddFn = (columnId: ColumnType["id"], data: NewTaskData) => string;
type OnDeleteFn = (taskId: string, columnId: ColumnId) => void;
type OnUpdateFn = (taskId: string, columnId: ColumnId, data: UpdateTaskData) => void;

interface Props {
    column: ColumnType;
    tasks: Task[];
    activeTaskId: string | null;
    onAdd: OnAddFn;
    onDelete: OnDeleteFn;
    onUpdate: OnUpdateFn;
    isOver?: boolean;
    previewIndex?: number | null;
    focusRegistry?: React.MutableRefObject<Record<string, HTMLElement | null>>;
    lastAddedId?: string | null;
}

export function Column({
    column,
    tasks,
    activeTaskId,
    onAdd,
    onDelete,
    onUpdate,
    isOver,
    previewIndex,
    focusRegistry,
    lastAddedId,
}: Props) {
    const droppableId = `col:${column.id}`;
    const headingId = `col-${column.id}-heading`;
    const [adding, setAdding] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    function handleAddClick() {
        setAdding(true);
    }

    function handleCancel() {
        setAdding(false);
    }

    function handleSubmit(data: NewTaskData) {
        const newId = onAdd(column.id, data);
        setAdding(false);
        return newId;
    }

    function handleEditTask(task: Task) {
        setEditingTask(task);
    }

    function handleCloseEdit() {
        setEditingTask(null);
    }

    return (
        <>
            <section
                className="group flex-shrink-0 w-80 kanban-column h-full"
                aria-labelledby={headingId}
            >
                <div
                    data-droppable={droppableId}
                    className={`kanban-column-inner ${panel} flex flex-col h-full transition-all ${isOver ? "ring-2 ring-blue-500 ring-offset-2" : ""
                        }`}
                >
                    {/* Header */}
                    <div className="px-3 pt-3 pb-2">
                        <div className="flex items-center gap-2.5">
                            <h2
                                id={headingId}
                                className="text-[14px] font-semibold tracking-tight text-slate-700 dark:text-slate-200"
                            >
                                {column.title}
                            </h2>
                            <span className="text-[11px] font-semibold min-w-[22px] text-center px-1.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-500 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300">
                                {tasks.length}
                            </span>
                        </div>
                        <div
                            aria-hidden="true"
                            className="mt-2.5 h-1 w-full rounded-full overflow-hidden"
                            style={{
                                background:
                                    column.id === "todo"
                                        ? "#a78bfa"
                                        : column.id === "in_progress"
                                            ? "#fbbf24"
                                            : "#a3e635",
                            }}
                        />
                    </div>

                    {/* Task list */}
                    <SortableContext
                        items={tasks.map((t) => t.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-3 pb-4 px-2 overflow-y-auto flex-1" role="list">
                            {tasks.map((task, idx) => {
                                const isActive = activeTaskId === task.id;
                                const showGap = previewIndex != null && previewIndex === idx && !isActive;
                                const isNew = lastAddedId && lastAddedId === task.id;
                                return (
                                    <div
                                        key={task.id}
                                        role="listitem"
                                        className={`transition-all ${isNew ? "is-new-card-wrapper" : ""}`}
                                    >
                                        {showGap && <div className="drag-placeholder h-[84px] mb-2" />}
                                        {isActive && <div className="drag-placeholder h-[84px]" />}
                                        <TaskCard
                                            task={task}
                                            isActive={isActive}
                                            registerRef={(el) => {
                                                if (focusRegistry) focusRegistry.current[task.id] = el;
                                            }}
                                            classNameOverride={isNew ? "is-new" : undefined}
                                            onEdit={handleEditTask}
                                        />
                                    </div>
                                );
                            })}
                            {previewIndex != null && previewIndex >= tasks.length && (
                                <div className="drag-placeholder h-[84px]" />
                            )}
                            {tasks.length === 0 && (
                                <div className="flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-slate-500 px-4 py-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-800/50">
                                    <EmptyStateIcon className="opacity-40" />
                                    <span className="text-[12px] font-medium">No tasks</span>
                                    <span className="text-[11px] opacity-70">Drag a task here or create a new one</span>
                                </div>
                            )}
                        </div>
                    </SortableContext>

                    {/* Add task button/form */}
                    <div className="mt-auto mb-3 mx-2">
                        {!adding && (
                            <button
                                onClick={handleAddClick}
                                className="w-full text-[12px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-md border border-dashed border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800 hover:border-blue-400 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                                type="button"
                            >
                                <PlusIcon size={14} />
                                <span className="font-medium">New task</span>
                            </button>
                        )}
                        {adding && (
                            <AddTaskForm
                                columnId={column.id}
                                onSubmit={handleSubmit}
                                onCancel={handleCancel}
                                {...(focusRegistry ? { focusRegistry } : {})}
                            />
                        )}
                    </div>
                </div>
            </section>

            {editingTask && (
                <EditTaskModal
                    task={editingTask}
                    columnId={column.id}
                    onSave={onUpdate}
                    onDelete={onDelete}
                    onClose={handleCloseEdit}
                />
            )}
        </>
    );
}
