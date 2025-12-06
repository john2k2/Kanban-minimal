export type ColumnId = 'todo' | 'in_progress' | 'done';
export type TaskState = 'To Do' | 'In Progress' | 'Done' | 'uncompleted';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface Task {
    id: string;
    title: string;
    status: ColumnId;
    ticket?: string;
    state?: TaskState;
    priority?: TaskPriority;
    contentTag?: string;
    dueDate?: string;
    assignees?: string[];
}

export interface Column {
    id: ColumnId;
    title: string;
    accent: string;
    tasks: Task[];
}

export interface KanbanState {
    columns: Column[];
}

export interface NewTaskData {
    title: string;
    priority?: TaskPriority;
    assignee?: string;
}

export interface UpdateTaskData {
    title?: string;
    priority?: TaskPriority;
    assignees?: string[];
}

export type KanbanAction =
    | { type: 'REORDER'; columnId: ColumnId; from: number; to: number }
    | { type: 'MOVE'; taskId: string; fromCol: ColumnId; toCol: ColumnId }
    | { type: 'MOVE_AT_INDEX'; taskId: string; fromCol: ColumnId; toCol: ColumnId; index: number }
    | { type: 'ADD'; columnId: ColumnId; data: NewTaskData; id?: string }
    | { type: 'DELETE'; taskId: string; columnId: ColumnId }
    | { type: 'UPDATE'; taskId: string; columnId: ColumnId; data: UpdateTaskData }
    | { type: 'HYDRATE'; columns: Column[] };
