export type Priority = "Low" | "Medium" | "High";
export type Status = "Pending" | "In Progress" | "Completed";

export interface User {
  id: number;
  username: string;
  full_name: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  due_date: string; // ISO date
  status: Status;
  assigned_user: User;
  created_at: string;
}

export const PRIORITIES: Priority[] = ["Low", "Medium", "High"];
export const STATUSES: Status[] = ["Pending", "In Progress", "Completed"];

const users: User[] = [
  { id: 1, username: "anthony", full_name: "Anthony M." },
  { id: 2, username: "grace", full_name: "Grace W." },
  { id: 3, username: "dan", full_name: "Dan K." },
  { id: 4, username: "leila", full_name: "Leila A." },
];

export const USERS = users;

function day(offset: number) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d.toISOString();
}

export const MOCK_TASKS: Task[] = [
  {
    id: 1,
    title: "Ship recurring task scheduler",
    description:
      "Daily/weekly/monthly recurrence with auto-created follow-ups.",
    priority: "High",
    due_date: day(0),
    status: "In Progress",
    assigned_user: users[0]!,
    created_at: day(-6),
  },
  {
    id: 2,
    title: "Fix duplicate rows in task filter",
    description: "Joins across assignments produce repeated results.",
    priority: "High",
    due_date: day(-2),
    status: "Pending",
    assigned_user: users[2]!,
    created_at: day(-9),
  },
  {
    id: 3,
    title: "Email reminder templates",
    description: "Reminders for anything due in the next 24 hours.",
    priority: "Medium",
    due_date: day(1),
    status: "Pending",
    assigned_user: users[1]!,
    created_at: day(-3),
  },
  {
    id: 4,
    title: "Role-based access rules",
    description: "Admin, Manager and User permission matrix.",
    priority: "High",
    due_date: day(4),
    status: "In Progress",
    assigned_user: users[3]!,
    created_at: day(-4),
  },
  {
    id: 5,
    title: "Attachment uploads",
    description: "Secure file uploads and signed download links.",
    priority: "Low",
    due_date: day(9),
    status: "Pending",
    assigned_user: users[1]!,
    created_at: day(-1),
  },
  {
    id: 6,
    title: "Status change webhooks",
    description: "POST to an external URL whenever a status changes.",
    priority: "Medium",
    due_date: day(-5),
    status: "Completed",
    assigned_user: users[0]!,
    created_at: day(-14),
  },
  {
    id: 7,
    title: "Activity timeline",
    description: "Track every change made to a task.",
    priority: "Medium",
    due_date: day(-8),
    status: "Completed",
    assigned_user: users[2]!,
    created_at: day(-20),
  },
  {
    id: 8,
    title: "Dashboard charts",
    description: "Breakdown by priority and completion rate.",
    priority: "Low",
    due_date: day(6),
    status: "In Progress",
    assigned_user: users[3]!,
    created_at: day(-2),
  },
  {
    id: 9,
    title: "Login and session handling",
    description: "Token based sign-in with refresh.",
    priority: "High",
    due_date: day(2),
    status: "Pending",
    assigned_user: users[0]!,
    created_at: day(-5),
  },
];

export function isOverdue(task: Task) {
  return (
    task.status !== "Completed" &&
    new Date(task.due_date).getTime() < Date.now()
  );
}

export interface TaskFilters {
  status?: Status | "All";
  priority?: Priority | "All";
  search?: string;
}

/**
 * Front-end data source. Swap the body of this function for a fetch to your
 * own API (e.g. GET /api/tasks/?status=&priority=) — the shape stays the same.
 */
export async function listTasks(filters: TaskFilters = {}): Promise<Task[]> {
  const { status = "All", priority = "All", search = "" } = filters;
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
}

export function taskStats(tasks: Task[]) {
  return {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "Completed").length,
    inProgress: tasks.filter((t) => t.status === "In Progress").length,
    pending: tasks.filter((t) => t.status === "Pending").length,
    overdue: tasks.filter(isOverdue).length,
    byPriority: {
      High: tasks.filter((t) => t.priority === "High").length,
      Medium: tasks.filter((t) => t.priority === "Medium").length,
      Low: tasks.filter((t) => t.priority === "Low").length,
    },
  };
}

export function formatDue(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
