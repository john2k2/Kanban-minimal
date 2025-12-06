'use client';
import { useState, useEffect, useMemo, useRef } from "react";
import { useTheme } from "@/hooks/useTheme";
import {
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
    DragOverlay,
    closestCenter,
    DragOverEvent,
} from "@dnd-kit/core";
import type { ColumnId, NewTaskData, UpdateTaskData } from "./types";
import { BoardHeader } from "./BoardHeader";
import { Column as ColumnComp } from "./Column";
import { TaskCard } from "./TaskCard";
import { ErrorBoundary } from "../system/ErrorBoundary";
import { useKanbanStore } from "./useKanbanStore";
import { initialColumns } from "./data/initialColumns";

export function KanbanBoard() {
    const {
        columns,
        addTask,
        deleteTask,
        updateTask,
        reorderTask,
        moveTask,
        moveTaskAtIndex,
        findTask,
        lastAddedIdRef,
    } = useKanbanStore(initialColumns);

    const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
    const [overColId, setOverColId] = useState<ColumnId | null>(null);
    const [previewIndex, setPreviewIndex] = useState<number | null>(null);
    const [liveMsg, setLiveMsg] = useState<string>("");

    const { isDark, toggle: toggleTheme } = useTheme();

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );
    const focusRef = useRef<Record<string, HTMLElement | null>>({});

    const activeTask = useMemo(
        () =>
            activeTaskId
                ? columns.flatMap((c) => c.tasks).find((t) => t.id === activeTaskId)
                : null,
        [activeTaskId, columns]
    );

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (!activeTaskId) return;
            const found = findTask(activeTaskId);
            if (!found) return;

            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
                const list = found.col.tasks;
                const idx = list.findIndex((t) => t.id === activeTaskId);
                if (idx < 0) return;
                const delta = e.key === "ArrowUp" ? -1 : 1;
                const target = idx + delta;
                if (target < 0 || target >= list.length) return;
                reorderTask(found.col.id as ColumnId, idx, target);
                setLiveMsg(`Position ${target + 1} in column ${found.col.title}`);
            }

            if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                e.preventDefault();
                const colIndex = columns.findIndex((c) => c.id === found.col.id);
                const delta = e.key === "ArrowLeft" ? -1 : 1;
                const targetCol = columns[colIndex + delta];
                if (!targetCol) return;
                moveTask(activeTaskId, found.col.id as ColumnId, targetCol.id as ColumnId);
                setLiveMsg(`Moved to column ${targetCol.title}`);
            }

            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setLiveMsg(`Task ${found.task.title}. Use arrows to move.`);
            }
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [activeTaskId, columns, findTask, moveTask, reorderTask]);

    const handleDragStart = (e: DragStartEvent) => {
        setActiveTaskId(String(e.active.id));
        const t = findTask(String(e.active.id));
        if (t) {
            setLiveMsg(`Moving: ${t.task.title}. Use up/down arrows for position, left/right for column.`);
        }
    };

    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e;
        const lastPreview = previewIndex;
        setActiveTaskId(null);
        setPreviewIndex(null);
        if (!over) return;
        if (active.id === over.id) return;
        const a = findTask(String(active.id));
        if (!a) return;
        setOverColId(null);
        const overId = String(over.id);

        const o = findTask(overId.startsWith("col:") ? "" : overId);
        if (o && o.col.id === a.col.id) {
            const oi = a.col.tasks.findIndex((t) => t.id === active.id);
            const ni = a.col.tasks.findIndex((t) => t.id === over.id);
            if (oi !== ni) reorderTask(a.col.id as ColumnId, oi, ni);
            queueMicrotask(() => focusRef.current[String(active.id)]?.focus());
            return;
        }
        if (o) {
            moveTask(a.task.id, a.col.id as ColumnId, o.col.id as ColumnId);
            queueMicrotask(() => focusRef.current[a.task.id]?.focus());
            return;
        }

        if (overId.startsWith("col:")) {
            const targetColId = overId.split(":")[1];
            if (targetColId && targetColId !== a.col.id) {
                if (lastPreview != null) {
                    moveTaskAtIndex(a.task.id, a.col.id as ColumnId, targetColId as ColumnId, lastPreview);
                } else {
                    moveTask(a.task.id, a.col.id as ColumnId, targetColId as ColumnId);
                }
                setLiveMsg(`Task moved to column ${targetColId.replace("_", " ")}`);
                queueMicrotask(() => focusRef.current[a.task.id]?.focus());
            }
        }
    };

    const handleDragOver = (e: DragOverEvent) => {
        const { over } = e;
        if (!over) return;
        const overId = String(over.id);
        let targetCol: ColumnId | null = null;
        if (overId.startsWith("col:")) {
            targetCol = overId.split(":")[1] as ColumnId;
        } else {
            const o = findTask(overId);
            if (o) targetCol = o.col.id as ColumnId;
        }
        setOverColId((prev) => {
            if (targetCol && prev !== targetCol) {
                setLiveMsg(`Over column ${targetCol.replace("_", " ")}`);
            }
            return targetCol;
        });
        if (activeTaskId && targetCol) {
            if (overId.startsWith("col:")) {
                setPreviewIndex(null);
            } else {
                const o = findTask(overId);
                if (o) {
                    const idx = o.col.tasks.findIndex((t) => t.id === o.task.id);
                    setPreviewIndex(idx < 0 ? null : idx);
                }
            }
        }
    };

    const handleAdd = (colId: ColumnId, data: NewTaskData) => {
        return addTask(colId, data);
    };

    const handleDelete = (taskId: string, columnId: ColumnId) => {
        deleteTask(taskId, columnId);
    };

    const handleUpdate = (taskId: string, columnId: ColumnId, data: UpdateTaskData) => {
        updateTask(taskId, columnId, data);
    };

    return (
        <ErrorBoundary>
            <div className="h-screen flex flex-col overflow-hidden bg-slate-100 dark:bg-slate-900 transition-colors duration-200">
                <BoardHeader dark={isDark} onToggle={toggleTheme} />
                <div aria-live="polite" id="dnd-live-region" data-live-region className="sr-only">
                    {liveMsg}
                </div>
                <DndContext
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                    collisionDetection={closestCenter}
                >
                    <main
                        className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-thin p-6"
                        role="region"
                        aria-label="Kanban Board"
                    >
                        <div className="flex gap-6 h-full select-none">
                            {columns.map((col) => (
                                <ColumnComp
                                    key={col.id}
                                    column={col}
                                    tasks={col.tasks}
                                    activeTaskId={activeTaskId}
                                    onAdd={handleAdd}
                                    onDelete={handleDelete}
                                    onUpdate={handleUpdate}
                                    isOver={overColId === col.id}
                                    previewIndex={overColId === col.id ? previewIndex : null}
                                    focusRegistry={focusRef}
                                    lastAddedId={lastAddedIdRef.current}
                                />
                            ))}
                        </div>
                    </main>
                    <DragOverlay>
                        {activeTask && <TaskCard task={activeTask} />}
                    </DragOverlay>
                </DndContext>
            </div>
        </ErrorBoundary>
    );
}
