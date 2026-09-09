import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { TaskCard } from "@/components/features/TaskCard";
import { Input } from "@/components/ui/input";
import {
  MOCK_TASKS,
  PRIORITIES,
  STATUSES,
  type Priority,
  type Status,
} from "@/server/tasks";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "All tasks — Taskline" },
      {
        name: "description",
        content: "Browse every task and filter instantly by status, priority or assignee.",
      },
      { property: "og:title", content: "All tasks — Taskline" },
      {
        property: "og:description",
        content: "Browse every task and filter instantly by status, priority or assignee.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TasksPage,
});

function FilterRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T | "All";
  onChange: (v: T | "All") => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-16 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {(["All", ...options] as (T | "All")[]).map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
            value === opt
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border/70 text-muted-foreground hover:border-primary/50 hover:text-foreground",
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function TasksPage() {
  const [status, setStatus] = useState<Status | "All">("All");
  const [priority, setPriority] = useState<Priority | "All">("All");
  const [search, setSearch] = useState("");

  const tasks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return MOCK_TASKS.filter(
      (t) =>
        (status === "All" || t.status === status) &&
        (priority === "All" || t.priority === priority) &&
        (q === "" ||
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.assigned_user.full_name.toLowerCase().includes(q)),
    );
  }, [status, priority, search]);

  return (
    <AppShell>
      <h1 className="font-display text-3xl font-semibold tracking-tight">All tasks</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {tasks.length} of {MOCK_TASKS.length} tasks shown
      </p>

      <div className="mt-8 space-y-4 rounded-xl border border-border/70 bg-card p-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, description or assignee"
            className="pl-9"
          />
        </div>
        <FilterRow label="Status" options={STATUSES} value={status} onChange={setStatus} />
        <FilterRow label="Priority" options={PRIORITIES} value={priority} onChange={setPriority} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {tasks.length === 0 && (
        <p className="mt-16 text-center text-sm text-muted-foreground">
          No tasks match these filters.
        </p>
      )}
    </AppShell>
  );
}
