export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type Status = "BACKLOG" | "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE" | "ARCHIVED";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  due_date: string | null;
  status: Status;
  assignee_name: string | null;
  created_at: string;
}

export const PRIORITIES: Priority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];
export const STATUSES: Status[] = ["BACKLOG", "TODO", "IN_PROGRESS", "REVIEW", "DONE", "ARCHIVED"];

export async function fetchTasks(): Promise<Task[]> {
  const token = localStorage.getItem("access");
  if (!token) {
    window.location.href = "/login";
    return [];
  }
  
  const res = await fetch("http://localhost:8000/api/v1/tasks/", {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
  
  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("access");
    window.location.href = "/login";
    return [];
  }
  
  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }
  
  const data = await res.json();
  return data.results || data;
}

export async function createTask(payload: Partial<Task>): Promise<Task> {
  const token = localStorage.getItem("access");
  if (!token) throw new Error("Not logged in");

  const res = await fetch("http://localhost:8000/api/v1/tasks/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to create task");
  }

  return res.json();
}

export function formatDue(iso: string | null) {
  if (!iso) return "No due date";
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function isOverdue(task: Task) {
  if (!task.due_date) return false;
  if (["DONE", "ARCHIVED"].includes(task.status)) return false;
  return new Date(task.due_date) < new Date();
}

export function taskStats(tasks: Task[]) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "DONE" || t.status === "ARCHIVED").length;
  const inProgress = tasks.filter(t => t.status === "IN_PROGRESS").length;
  const overdue = tasks.filter(isOverdue).length;
  
  const byPriority = {
    URGENT: tasks.filter(t => t.priority === "URGENT").length,
    HIGH: tasks.filter(t => t.priority === "HIGH").length,
    MEDIUM: tasks.filter(t => t.priority === "MEDIUM").length,
    LOW: tasks.filter(t => t.priority === "LOW").length,
  };

  return { total, completed, inProgress, overdue, byPriority };
}
