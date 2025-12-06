import { useReducer, useCallback, useRef, useMemo, useEffect } from "react";
import type {
    Column,
    ColumnId,
    KanbanAction,
    KanbanState,
    Task,
    NewTaskData,
    UpdateTaskData,
} from "./types";

export function kanbanReducer(
    state: KanbanState,
    action: KanbanAction
): KanbanState {
    switch (action.type) {
        case "REORDER": {
            return {
                columns: state.columns.map((c) => {
                    if (c.id !== action.columnId) return c;
                    const copy = [...c.tasks];
                    if (action.from < 0 || action.from >= copy.length) return c;
                    const [item] = copy.splice(action.from, 1);
                    const toIndex = Math.min(Math.max(action.to, 0), copy.length);
                    copy.splice(toIndex, 0, item);
                    return { ...c, tasks: copy };
                }),
            };
        }
        case "MOVE": {
            let moving: Task | undefined;
            const without = state.columns.map((c) => {
                if (c.id === action.fromCol) {
                    const rest = c.tasks.filter((t) => {
                        if (t.id === action.taskId) {
                            moving = t;
                            return false;
                        }
                        return true;
                    });
                    return { ...c, tasks: rest };
                }
                return c;
            });
            if (!moving) return state;
            return {
                columns: without.map((c) =>
                    c.id === action.toCol
                        ? { ...c, tasks: [...c.tasks, { ...moving!, status: action.toCol }] }
                        : c
                ),
            };
        }
        case "MOVE_AT_INDEX": {
            if (action.fromCol === action.toCol) {
                const fromColumn = state.columns.find((c) => c.id === action.fromCol);
                if (!fromColumn) return state;
                const currentIdx = fromColumn.tasks.findIndex((t) => t.id === action.taskId);
                if (currentIdx === -1) return state;
                return kanbanReducer(state, {
                    type: "REORDER",
                    columnId: action.fromCol,
                    from: currentIdx,
                    to: action.index,
                });
            }
            let moving: Task | undefined;
            const intermediate = state.columns.map((c) => {
                if (c.id === action.fromCol) {
                    const rest = c.tasks.filter((t) => {
                        if (t.id === action.taskId) {
                            moving = t;
                            return false;
                        }
                        return true;
                    });
                    return { ...c, tasks: rest };
                }
                return c;
            });
            if (!moving) return state;
            return {
                columns: intermediate.map((c) => {
                    if (c.id === action.toCol) {
                        const copy = [...c.tasks];
                        const insertIndex = Math.min(Math.max(action.index, 0), copy.length);
                        copy.splice(insertIndex, 0, { ...moving!, status: action.toCol });
                        return { ...c, tasks: copy };
                    }
                    return c;
                }),
            };
        }
        case "ADD": {
            return {
                columns: state.columns.map((c) => {
                    if (c.id !== action.columnId) return c;
                    const id = action.id || `${action.columnId}-${crypto.randomUUID?.() || Math.random().toString(36).slice(2, 9)}`;
                    const newTask: Task = { id, title: action.data.title, status: action.columnId };
                    if (action.data.priority) newTask.priority = action.data.priority;
                    if (action.data.assignee) newTask.assignees = [action.data.assignee];
                    return { ...c, tasks: [...c.tasks, newTask] };
                }),
            };
        }
        case "DELETE": {
            return {
                columns: state.columns.map((c) => {
                    if (c.id !== action.columnId) return c;
                    return { ...c, tasks: c.tasks.filter((t) => t.id !== action.taskId) };
                }),
            };
        }
        case "UPDATE": {
            return {
                columns: state.columns.map((c) => {
                    if (c.id !== action.columnId) return c;
                    return {
                        ...c,
                        tasks: c.tasks.map((t) => {
                            if (t.id !== action.taskId) return t;
                            const updated = { ...t };
                            if (action.data.title !== undefined) updated.title = action.data.title;
                            if (action.data.priority !== undefined) updated.priority = action.data.priority;
                            if (action.data.assignees !== undefined) updated.assignees = action.data.assignees;
                            return updated;
                        }),
                    };
                }),
            };
        }
        case "HYDRATE": {
            if (!Array.isArray(action.columns)) return state;
            return { columns: action.columns };
        }
        default:
            return state;
    }
}

export function useKanbanStore(initial: Column[]) {
    const [state, dispatch] = useReducer(kanbanReducer, { columns: initial });
    const lastAddedIdRef = useRef<string | null>(null);
    const saveTimeout = useRef<number | null>(null);
    const dirtyRef = useRef(false);

    const lookup = useMemo(() => {
        const map = new Map<string, { colIndex: number; taskIndex: number }>();
        state.columns.forEach((col, ci) => {
            col.tasks.forEach((t, ti) => {
                map.set(t.id, { colIndex: ci, taskIndex: ti });
            });
        });
        return map;
    }, [state.columns]);

    const addTask = useCallback((col: ColumnId, data: NewTaskData) => {
        const id = `${col}-${crypto.randomUUID?.() || Math.random().toString(36).slice(2, 9)}`;
        lastAddedIdRef.current = id;
        dispatch({ type: "ADD", columnId: col, data, id });
        return id;
    }, []);

    const deleteTask = useCallback((taskId: string, columnId: ColumnId) => {
        dispatch({ type: "DELETE", taskId, columnId });
    }, []);

    const updateTask = useCallback((taskId: string, columnId: ColumnId, data: UpdateTaskData) => {
        dispatch({ type: "UPDATE", taskId, columnId, data });
    }, []);

    const reorderTask = useCallback(
        (columnId: ColumnId, from: number, to: number) =>
            dispatch({ type: "REORDER", columnId, from, to }),
        []
    );

    const moveTask = useCallback(
        (taskId: string, fromCol: ColumnId, toCol: ColumnId) =>
            dispatch({ type: "MOVE", taskId, fromCol, toCol }),
        []
    );

    const moveTaskAtIndex = useCallback(
        (taskId: string, fromCol: ColumnId, toCol: ColumnId, index: number) =>
            dispatch({ type: "MOVE_AT_INDEX", taskId, fromCol, toCol, index }),
        []
    );

    const findTask = useCallback(
        (id: string) => {
            const pos = lookup.get(id);
            if (!pos) return null;
            const col = state.columns[pos.colIndex];
            const task = col.tasks[pos.taskIndex];
            if (!task) return null;
            return { col, task };
        },
        [lookup, state.columns]
    );

    const getTaskPosition = useCallback((id: string) => lookup.get(id) || null, [lookup]);

    useEffect(() => {
        if (!dirtyRef.current) {
            dirtyRef.current = true;
            return;
        }
        try {
            if (saveTimeout.current) window.clearTimeout(saveTimeout.current);
            saveTimeout.current = window.setTimeout(() => {
                try {
                    localStorage.setItem("kanban-board", JSON.stringify(state.columns));
                } catch { }
            }, 400);
        } catch { }
    }, [state.columns]);

    useEffect(() => {
        try {
            const raw = localStorage.getItem("kanban-board");
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    dispatch({ type: "HYDRATE", columns: parsed });
                }
            }
        } catch { }
    }, []);

    return {
        columns: state.columns,
        addTask,
        deleteTask,
        updateTask,
        reorderTask,
        moveTask,
        moveTaskAtIndex,
        findTask,
        getTaskPosition,
        lastAddedIdRef,
    };
}
