import { CalendarClock, User2, MoreHorizontal, Trash2 } from "lucide-react";
import { type Task, type Status, formatDue, isOverdue, updateTask, deleteTask, STATUSES } from "@/server/tasks";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

const priorityClass: Record<Task["priority"], string> = {
  URGENT: "bg-danger-soft text-danger font-bold",
  HIGH: "bg-danger-soft text-danger",
  MEDIUM: "bg-warning-soft text-warning",
  LOW: "bg-secondary text-muted-foreground",
};

const statusClass: Record<Task["status"], string> = {
  BACKLOG: "bg-secondary/50 text-muted-foreground",
  TODO: "bg-secondary text-muted-foreground",
  IN_PROGRESS: "bg-accent-soft text-accent",
  REVIEW: "bg-warning-soft text-warning",
  DONE: "bg-success-soft text-success",
  ARCHIVED: "bg-secondary/50 text-muted-foreground line-through",
};

export function TaskCard({ task, onUpdate }: { task: Task, onUpdate?: () => void }) {
  const overdue = isOverdue(task);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = async (newStatus: Status) => {
    try {
      await updateTask(task.id, { status: newStatus });
      toast.success(`Task marked as ${newStatus}`);
      onUpdate?.();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      toast.success("Task deleted");
      setShowDeleteDialog(false);
      onUpdate?.();
    } catch (err: any) {
      toast.error(err.message);
      setIsDeleting(false);
    }
  };

  return (
    <>
      <article className="group relative rounded-xl border border-border/70 bg-card p-5 transition-colors hover:border-primary/50">
        <div className="absolute right-4 top-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="size-8 p-0">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuLabel>Change Status</DropdownMenuLabel>
              {STATUSES.map(s => (
                <DropdownMenuItem
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={task.status === s ? "bg-secondary" : ""}
                >
                  {s}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-danger focus:text-danger focus:bg-danger-soft">
                <Trash2 className="mr-2 size-4" />
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-start justify-between gap-4 pr-10">
          <div className="min-w-0">
            <h3 className="truncate font-display text-base font-semibold tracking-tight">
              {task.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {task.description}
            </p>
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
          <span
            className={cn(
              "rounded-full px-2.5 py-1 font-medium",
              statusClass[task.status],
            )}
          >
            {task.status}
          </span>
          <span
            className={cn(
              "flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium",
              overdue
                ? "bg-danger-soft text-danger"
                : "bg-secondary text-muted-foreground",
            )}
          >
            <CalendarClock className="size-3.5" />
            {overdue ? "Overdue " : "Due "}
            {formatDue(task.due_date)}
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 font-medium text-muted-foreground">
            <User2 className="size-3.5" />
            {task.assignee_name || "Unassigned"}
          </span>
        </div>
      </article>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the task "{task.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-danger text-danger-foreground hover:bg-danger/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete task"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
