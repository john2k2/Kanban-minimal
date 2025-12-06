import { useState, useEffect, useRef } from "react";
import type { Task, TaskPriority, UpdateTaskData, ColumnId } from "../types";
import { CloseIcon } from "@/components/icons";
import { input as inputCls } from "@/lib/ui";

interface EditTaskModalProps {
    task: Task;
    columnId: ColumnId;
    onSave: (taskId: string, columnId: ColumnId, data: UpdateTaskData) => void;
    onDelete: (taskId: string, columnId: ColumnId) => void;
    onClose: () => void;
}

export function EditTaskModal({
    task,
    columnId,
    onSave,
    onDelete,
    onClose,
}: EditTaskModalProps) {
    const [title, setTitle] = useState(task.title);
    const [priority, setPriority] = useState<TaskPriority | "">(task.priority || "");
    const [assignee, setAssignee] = useState(task.assignees?.join(", ") || "");
    const [confirmDelete, setConfirmDelete] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    function handleSave(e: React.FormEvent) {
        e.preventDefault();
        const trimmed = title.trim();
        if (!trimmed) return;

        const data: UpdateTaskData = {};
        if (trimmed !== task.title) data.title = trimmed;
        if (priority && priority !== task.priority) data.priority = priority;

        const assigneeList = assignee.split(",").map((a) => a.trim()).filter(Boolean);
        if (JSON.stringify(assigneeList) !== JSON.stringify(task.assignees || [])) {
            if (assigneeList.length > 0) {
                data.assignees = assigneeList;
            }
        }

        if (Object.keys(data).length > 0) {
            onSave(task.id, columnId, data);
        }
        onClose();
    }

    function handleDelete() {
        if (confirmDelete) {
            onDelete(task.id, columnId);
            onClose();
        } else {
            setConfirmDelete(true);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay - opaco */}
            <div
                className="absolute inset-0 bg-slate-900/70 dark:bg-slate-950/80"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal - fondo sólido */}
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-task-title"
                className="relative w-full max-w-md rounded-lg border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800 animate-card-pop-in"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 id="edit-task-title" className="text-[16px] font-semibold text-slate-900 dark:text-white">
                        Edit Task
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-500 dark:text-slate-400"
                        aria-label="Close"
                    >
                        <CloseIcon size={16} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSave} className="p-4 space-y-4">
                    <div>
                        <label htmlFor="edit-title" className="text-[12px] font-medium text-slate-600 dark:text-slate-300 mb-1 block">
                            Title
                        </label>
                        <input
                            ref={inputRef}
                            id="edit-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={`${inputCls} text-[13px] py-2.5`}
                            aria-required="true"
                        />
                    </div>

                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label htmlFor="edit-priority" className="text-[12px] font-medium text-slate-600 dark:text-slate-300 mb-1 block">
                                Priority
                            </label>
                            <select
                                id="edit-priority"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as TaskPriority | "")}
                                className={`${inputCls} text-[12px] py-2`}
                            >
                                <option value="">No priority</option>
                                <option value="high">🔴 High</option>
                                <option value="medium">🟡 Medium</option>
                                <option value="low">🟢 Low</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label htmlFor="edit-assignee" className="text-[12px] font-medium text-slate-600 dark:text-slate-300 mb-1 block">
                                Assignees
                            </label>
                            <input
                                id="edit-assignee"
                                value={assignee}
                                onChange={(e) => setAssignee(e.target.value)}
                                placeholder="Comma separated..."
                                className={`${inputCls} text-[12px] py-2`}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2">
                        <button
                            type="button"
                            onClick={handleDelete}
                            className={`text-[12px] px-3 py-2 rounded-md font-medium transition-all ${confirmDelete
                                    ? "bg-red-600 text-white hover:bg-red-700"
                                    : "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 border border-red-200 dark:border-red-800"
                                }`}
                        >
                            {confirmDelete ? "Confirm Delete" : "Delete"}
                        </button>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-[12px] px-4 py-2 rounded-md border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="text-[12px] px-4 py-2 rounded-md bg-blue-600 text-white font-medium shadow-sm disabled:opacity-50 hover:bg-blue-700 transition-all"
                                disabled={!title.trim()}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
