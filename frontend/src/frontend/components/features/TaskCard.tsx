import { CalendarClock, User2 } from "lucide-react";
import { type Task, formatDue, isOverdue } from "@/server/tasks";
import { cn } from "@/lib/utils";

const priorityClass: Record<Task["priority"], string> = {
  High: "bg-danger-soft text-danger",
  Medium: "bg-warning-soft text-warning",
  Low: "bg-secondary text-muted-foreground",
};

const statusClass: Record<Task["status"], string> = {
  Pending: "bg-secondary text-muted-foreground",
  "In Progress": "bg-accent-soft text-accent",
  Completed: "bg-success-soft text-success",
};

export function TaskCard({ task }: { task: Task }) {
  const overdue = isOverdue(task);

  return (
    <article className="group rounded-xl border border-border/70 bg-card p-5 transition-colors hover:border-primary/50">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate font-display text-base font-semibold tracking-tight">
            {task.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{task.description}</p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
            priorityClass[task.priority],
          )}
        >
          {task.priority}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span className={cn("rounded-full px-2.5 py-1 font-medium", statusClass[task.status])}>
          {task.status}
        </span>
        <span
          className={cn(
            "flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium",
            overdue ? "bg-danger-soft text-danger" : "bg-secondary text-muted-foreground",
          )}
        >
          <CalendarClock className="size-3.5" />
          {overdue ? "Overdue " : "Due "}
          {formatDue(task.due_date)}
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 font-medium text-muted-foreground">
          <User2 className="size-3.5" />
          {task.assigned_user.full_name}
        </span>
      </div>
    </article>
  );
}
