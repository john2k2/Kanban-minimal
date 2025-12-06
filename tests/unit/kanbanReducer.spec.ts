import { describe, it, expect } from 'vitest';
import { kanbanReducer } from '../../src/components/kanban/useKanbanStore';
import type { KanbanState, Column } from '../../src/components/kanban/types';

const baseState: KanbanState = {
    columns: [
        { id: 'todo', title: 'To Do', accent: 'violet', tasks: [{ id: 't1', title: 'T1', status: 'todo' }, { id: 't2', title: 'T2', status: 'todo' }] },
        { id: 'in_progress', title: 'In Progress', accent: 'amber', tasks: [] },
        { id: 'done', title: 'Done', accent: 'lime', tasks: [] },
    ] as Column[],
};

describe('kanbanReducer', () => {
    it('reorder within same column', () => {
        const result = kanbanReducer(baseState, { type: 'REORDER', columnId: 'todo', from: 0, to: 1 });
        expect(result.columns[0].tasks.map((t) => t.id)).toEqual(['t2', 't1']);
    });

    it('move between columns to end', () => {
        const result = kanbanReducer(baseState, { type: 'MOVE', taskId: 't1', fromCol: 'todo', toCol: 'in_progress' });
        expect(result.columns[0].tasks.map((t) => t.id)).toEqual(['t2']);
        expect(result.columns[1].tasks.map((t) => t.id)).toEqual(['t1']);
    });

    it('move_at_index inserts at requested position', () => {
        const state2: KanbanState = {
            columns: [
                { id: 'todo', title: 'To Do', accent: 'violet', tasks: [{ id: 't1', title: 'T1', status: 'todo' }] },
                { id: 'in_progress', title: 'In Progress', accent: 'amber', tasks: [{ id: 't2', title: 'T2', status: 'in_progress' }, { id: 't3', title: 'T3', status: 'in_progress' }] },
                { id: 'done', title: 'Done', accent: 'lime', tasks: [] },
            ] as Column[],
        };
        const result = kanbanReducer(state2, { type: 'MOVE_AT_INDEX', taskId: 't1', fromCol: 'todo', toCol: 'in_progress', index: 1 });
        expect(result.columns[1].tasks.map((t) => t.id)).toEqual(['t2', 't1', 't3']);
    });

    it('add creates task with new id', () => {
        const result = kanbanReducer(baseState, { type: 'ADD', columnId: 'todo', data: { title: 'New' }, id: 'new-id' });
        expect(result.columns[0].tasks.map((t) => t.id)).toContain('new-id');
    });

    it('delete removes task from column', () => {
        const result = kanbanReducer(baseState, { type: 'DELETE', taskId: 't1', columnId: 'todo' });
        expect(result.columns[0].tasks.map((t) => t.id)).toEqual(['t2']);
    });

    it('update modifies task properties', () => {
        const result = kanbanReducer(baseState, { type: 'UPDATE', taskId: 't1', columnId: 'todo', data: { title: 'Updated Title', priority: 'high' } });
        const task = result.columns[0].tasks.find((t) => t.id === 't1');
        expect(task?.title).toBe('Updated Title');
        expect(task?.priority).toBe('high');
    });

    it('hydrate replaces columns', () => {
        const newCols: Column[] = [{ id: 'done', title: 'Done', accent: 'lime', tasks: [{ id: 'x', title: 'X', status: 'done' }] }];
        const result = kanbanReducer(baseState, { type: 'HYDRATE', columns: newCols });
        expect(result.columns.length).toBe(1);
        expect(result.columns[0].id).toBe('done');
    });
});
