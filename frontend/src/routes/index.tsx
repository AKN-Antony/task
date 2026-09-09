import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, CheckCircle2, LoaderCircle, ListTodo } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { TaskCard } from "@/components/features/TaskCard";
import { MOCK_TASKS, isOverdue, taskStats } from "@/server/tasks";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Taskline — Team task dashboard" },
      {
        name: "description",
        content:
          "See total, completed and overdue tasks at a glance, with a live breakdown by priority.",
      },
      { property: "og:title", content: "Taskline — Team task dashboard" },
      {
        property: "og:description",
        content:
          "See total, completed and overdue tasks at a glance, with a live breakdown by priority.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: typeof ListTodo;
  tone: "neutral" | "accent" | "success" | "danger";
}) {
  const tones = {
    neutral: "bg-secondary text-muted-foreground",
    accent: "bg-accent-soft text-accent",
    success: "bg-success-soft text-success",
    danger: "bg-danger-soft text-danger",
  } as const;

  return (
    <div className="rounded-xl border border-border/70 bg-card p-5">
      <div className={cn("grid size-9 place-items-center rounded-lg", tones[tone])}>
        <Icon className="size-4.5" />
      </div>
      <p className="mt-4 font-display text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function Dashboard() {
  const stats = taskStats(MOCK_TASKS);
  const priorityRows = [
    { label: "High", value: stats.byPriority.High, bar: "bg-danger" },
    { label: "Medium", value: stats.byPriority.Medium, bar: "bg-warning" },
    { label: "Low", value: stats.byPriority.Low, bar: "bg-accent" },
  ];
  const attention = MOCK_TASKS.filter(isOverdue).slice(0, 4);

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            A live snapshot of everything your team is working on.
          </p>
        </div>
        <Link
          to="/tasks"
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          View all tasks <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total tasks" value={stats.total} icon={ListTodo} tone="neutral" />
        <StatCard label="In progress" value={stats.inProgress} icon={LoaderCircle} tone="accent" />
        <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} tone="success" />
        <StatCard label="Overdue" value={stats.overdue} icon={AlertTriangle} tone="danger" />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <section className="rounded-xl border border-border/70 bg-card p-6">
          <h2 className="font-display text-lg font-semibold tracking-tight">By priority</h2>
          <div className="mt-5 space-y-5">
            {priorityRows.map((row) => (
              <div key={row.label}>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-medium">{row.label}</span>
                  <span className="text-muted-foreground">{row.value}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className={cn("h-full rounded-full", row.bar)}
                    style={{ width: `${(row.value / Math.max(stats.total, 1)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-border/70 pt-5">
            <p className="text-sm text-muted-foreground">Completion rate</p>
            <p className="mt-1 font-display text-2xl font-semibold tracking-tight">
              {Math.round((stats.completed / Math.max(stats.total, 1)) * 100)}%
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold tracking-tight">Needs attention</h2>
          <div className="mt-5 grid gap-4">
            {attention.length > 0 ? (
              attention.map((task) => <TaskCard key={task.id} task={task} />)
            ) : (
              <p className="text-sm text-muted-foreground">Nothing overdue. Nice.</p>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
