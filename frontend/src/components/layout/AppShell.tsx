import { Link } from "@tanstack/react-router";
import { type ReactNode, useEffect, useState } from "react";
import { LayoutDashboard, ListChecks, LogIn, LogOut, User } from "lucide-react";
import { Chatbot } from "@/components/features/Chatbot";
import { ModeToggle } from "@/components/features/ModeToggle";

export function AppShell({ children }: { children: ReactNode }) {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      fetch("http://localhost:8000/api/v1/users/me/", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(r => r.json())
      .then(data => {
        if (data.email) setUserEmail(data.email);
      })
      .catch(() => {});
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-md bg-primary font-display text-sm font-bold text-primary-foreground">
              T
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">
              Taskline
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              to="/"
              activeOptions={{ exact: true }}
              activeProps={{ className: "bg-secondary text-foreground" }}
              inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors"
            >
              <LayoutDashboard className="size-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            
            <Link
              to="/tasks"
              activeProps={{ className: "bg-secondary text-foreground" }}
              inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors"
            >
              <ListChecks className="size-4" />
              <span className="hidden sm:inline">Tasks</span>
            </Link>

            {userEmail ? (
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-border/50">
                <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <User className="size-4" />
                  {userEmail}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors ml-2"
                >
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                activeProps={{ className: "bg-secondary text-foreground" }}
                inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ml-4 pl-4 border-l border-border/50"
              >
                <LogIn className="size-4" />
                <span className="hidden sm:inline">Sign in</span>
              </Link>
            )}

            <div className="ml-2 pl-2 border-l border-border/50">
              <ModeToggle />
            </div>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10">{children}</main>
      <Chatbot />
    </div>
  );
}
