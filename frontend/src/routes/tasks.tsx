import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { TaskCard } from "@/components/features/TaskCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import {
  fetchTasks,
  createTask,
  PRIORITIES,
  STATUSES,
  type Priority,
  type Status,
  type Task
} from "@/server/tasks";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "All tasks — Taskline" },
      {
        name: "description",
        content:
          "Browse every task and filter instantly by status, priority or assignee.",
      },
      { property: "og:title", content: "All tasks — Taskline" },
      {
        property: "og:description",
        content:
          "Browse every task and filter instantly by status, priority or assignee.",
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
  const [serverTasks, setServerTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadTasks = () => {
    setIsLoading(true);
    fetchTasks()
      .then(data => {
        setServerTasks(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.currentTarget;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const description = (form.elements.namedItem("description") as HTMLTextAreaElement)?.value || "";
    const priorityVal = (form.elements.namedItem("priority") as HTMLSelectElement).value as Priority;
    
    try {
      await createTask({ title, description, priority: priorityVal });
      toast.success("Task created successfully!");
      setIsDialogOpen(false);
      loadTasks(); // reload the list
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tasks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return serverTasks.filter(
      (t) =>
        (status === "All" || t.status === status) &&
        (priority === "All" || t.priority === priority) &&
        (q === "" ||
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          (t.assignee_name && t.assignee_name.toLowerCase().includes(q))),
    );
  }, [status, priority, search, serverTasks]);

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            All tasks
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isLoading ? "Loading tasks..." : `${tasks.length} of ${serverTasks.length} tasks shown`}
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="size-4" />
              New task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleCreateTask}>
              <DialogHeader>
                <DialogTitle>Create new task</DialogTitle>
                <DialogDescription>
                  Add a new task to your team's backlog.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" required placeholder="Fix the navbar layout" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Steps to reproduce..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Save changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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
        <FilterRow
          label="Status"
          options={STATUSES}
          value={status}
          onChange={setStatus}
        />
        <FilterRow
          label="Priority"
          options={PRIORITIES}
          value={priority}
          onChange={setPriority}
        />
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
