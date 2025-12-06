import type { CSSProperties, ReactNode } from "react";

interface BadgeProps {
  children?: ReactNode;
  kind?: string;
}

// Mapping from kind to variant for cleaner logic
const KIND_TO_VARIANT: Record<string, string> = {
  "In Progress": "inprogress",
  "To Do": "todo",
  Done: "done",
  uncompleted: "todo",
  content: "content",
  date: "date",
  ticket: "ticket",
  high: "priority-high",
  medium: "priority-medium",
  low: "priority-low",
};

// Style definitions for each variant
const VARIANT_STYLES: Record<string, { bg: string; border: string; fg: string }> = {
  todo: {
    bg: "var(--state-todo-bg)",
    border: "var(--state-todo-border)",
    fg: "var(--state-todo-fg)",
  },
  inprogress: {
    bg: "var(--state-progress-bg)",
    border: "var(--state-progress-border)",
    fg: "var(--state-progress-fg)",
  },
  done: {
    bg: "var(--state-done-bg)",
    border: "var(--state-done-border)",
    fg: "var(--state-done-fg)",
  },
  content: {
    bg: "var(--state-content-bg)",
    border: "var(--state-content-border)",
    fg: "var(--state-content-fg)",
  },
  date: {
    bg: "var(--state-date-bg)",
    border: "var(--state-date-border)",
    fg: "var(--state-date-fg)",
  },
  ticket: {
    bg: "var(--badge-ticket-bg)",
    border: "var(--badge-ticket-border)",
    fg: "var(--badge-ticket-fg)",
  },
  "priority-high": {
    bg: "var(--priority-high-bg)",
    border: "var(--priority-high-border)",
    fg: "var(--priority-high-fg)",
  },
  "priority-medium": {
    bg: "var(--priority-medium-bg)",
    border: "var(--priority-medium-border)",
    fg: "var(--priority-medium-fg)",
  },
  "priority-low": {
    bg: "var(--priority-low-bg)",
    border: "var(--priority-low-border)",
    fg: "var(--priority-low-fg)",
  },
};

// Priority icons mapping
const PRIORITY_ICONS: Record<string, string> = {
  "priority-high": "🔴",
  "priority-medium": "🟡",
  "priority-low": "🟢",
};

function getStyleForVariant(variant?: string): CSSProperties | undefined {
  if (!variant) return undefined;
  const entry = VARIANT_STYLES[variant];
  if (!entry) return undefined;
  return {
    background: entry.bg,
    borderColor: entry.border,
    color: entry.fg,
  };
}

export function Badge({ children, kind }: BadgeProps) {
  const variant = kind ? KIND_TO_VARIANT[kind] : undefined;
  const dynamicStyle = getStyleForVariant(variant);
  const priorityIcon = variant ? PRIORITY_ICONS[variant] : null;

  const baseClasses =
    "badge inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-[11px] font-medium leading-tight tracking-tight select-none";

  return (
    <span className={baseClasses} style={dynamicStyle} data-variant={variant}>
      {priorityIcon && <span className="text-[9px]">{priorityIcon}</span>}
      {children || kind}
    </span>
  );
}
