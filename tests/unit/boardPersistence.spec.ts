import { describe, it, expect } from "vitest";
import { kanbanReducer } from "../../src/components/kanban/useKanbanStore";
import { initialColumns } from "../../src/components/kanban/data/initialColumns";
import type { KanbanState } from "../../src/components/kanban/types";

// Probamos HYDRATE y ADD afectan estructura esperada.

describe("persistencia tablero", () => {
  it("hydrate reemplaza columnas", () => {
    const start: KanbanState = { columns: initialColumns };
    const modified = kanbanReducer(start, {
      type: "HYDRATE",
      columns: [{ id: "todo", title: "To do", accent: "x", tasks: [] }],
    } as any);
    expect(modified.columns).toHaveLength(1);
    expect(modified.columns[0].id).toBe("todo");
  });
  it("ADD produces new task with stable id if provided", () => {
    const start: KanbanState = {
      columns: [{ id: "todo", title: "To do", accent: "x", tasks: [] }],
    } as KanbanState;
    const next = kanbanReducer(start, {
      type: "ADD",
      columnId: "todo",
      data: { title: "Test" },
      id: "todo-fixed",
    });
    expect(next.columns[0].tasks[0].id).toBe("todo-fixed");
  });
});
