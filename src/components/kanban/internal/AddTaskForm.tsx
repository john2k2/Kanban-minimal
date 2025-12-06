import { useState, useRef, useEffect, type MutableRefObject } from "react";
import type { TaskPriority, NewTaskData, ColumnId } from "../types";
import { input as inputCls } from "@/lib/ui";

interface AddTaskFormProps {
    columnId: ColumnId;
    onSubmit: (data: NewTaskData) => string;
    onCancel: () => void;
    focusRegistry?: MutableRefObject<Record<string, HTMLElement | null>>;
}

export function AddTaskForm({
    columnId,
    onSubmit,
    onCancel,
    focusRegistry,
}: AddTaskFormProps) {
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState<TaskPriority | "">("");
    const [assignee, setAssignee] = useState("");
    const inputRef = useRef<HTMLInputElement | null>(null);
    const formId = `add-form-${columnId}`;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const trimmed = title.trim();
        if (!trimmed) return;

        // Build data object without undefined properties (exactOptionalPropertyTypes)
        const data: NewTaskData = { title: trimmed };
        if (priority) data.priority = priority;
        const trimmedAssignee = assignee.trim();
        if (trimmedAssignee) data.assignee = trimmedAssignee;

        const newId = onSubmit(data);

        // Focus new card after render
        setTimeout(() => {
            if (focusRegistry) focusRegistry.current[newId]?.focus();
        }, 30);
    }

    // Auto-focus input on mount
    useEffect(() => {
        setTimeout(() => inputRef.current?.focus(), 0);
    }, []);

    return (
        <form
            id={formId}
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 bg-surface backdrop-blur-sm dark:bg-surface-dark p-3.5 rounded-lg border border-border dark:border-border-dark shadow-md w-full animate-card-pop-in text-textc-primary dark:text-textc-dark"
        >
            <label
                htmlFor={`${formId}-title`}
                className="text-[12px] font-medium text-textc-secondary dark:text-textc-secondaryDark"
            >
                New task
            </label>
            <input
                ref={inputRef}
                id={`${formId}-title`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title..."
                className={`${inputCls} text-[13px] py-2.5`}
                aria-required="true"
            />

            {/* Priority & Assignee */}
            <div className="flex gap-2">
                <div className="flex-1">
                    <label
                        htmlFor={`${formId}-priority`}
                        className="text-[11px] text-textc-tertiary dark:text-textc-tertiaryDark mb-1 block"
                    >
                        Priority
                    </label>
                    <select
                        id={`${formId}-priority`}
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
                    <label
                        htmlFor={`${formId}-assignee`}
                        className="text-[11px] text-textc-tertiary dark:text-textc-tertiaryDark mb-1 block"
                    >
                        Assign to
                    </label>
                    <input
                        id={`${formId}-assignee`}
                        value={assignee}
                        onChange={(e) => setAssignee(e.target.value)}
                        placeholder="Name..."
                        className={`${inputCls} text-[12px] py-2`}
                    />
                </div>
            </div>

            <div className="flex gap-2 justify-end pt-1">
                <button
                    type="button"
                    onClick={onCancel}
                    className="text-[12px] px-3.5 py-2 rounded-md border border-border dark:border-border-dark text-textc-secondary dark:text-textc-secondaryDark hover:text-textc-primary dark:hover:text-textc-dark hover:bg-surface-muted dark:hover:bg-surface-darkMuted transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="text-[12px] px-4 py-2 rounded-md bg-accent text-accent-contrast font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                    disabled={!title.trim()}
                >
                    Save
                </button>
            </div>
        </form>
    );
}
