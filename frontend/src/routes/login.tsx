import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Taskline" },
      {
        name: "description",
        content: "Sign in to Taskline to manage and track your team's tasks.",
      },
      { property: "og:title", content: "Sign in — Taskline" },
      {
        property: "og:description",
        content: "Sign in to Taskline to manage and track your team's tasks.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <AppShell>
      <div className="mx-auto max-w-md">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "login"
            ? "Sign in to pick up where you left off."
            : "Set up an account to start tracking tasks."}
        </p>

        <form
          className="mt-8 space-y-4 rounded-xl border border-border/70 bg-card p-6"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const email = (form.elements.namedItem('email') as HTMLInputElement).value;
            const password = (form.elements.namedItem('password') as HTMLInputElement).value;
            
            try {
              if (mode === 'login') {
                const res = await fetch('http://localhost:8000/api/v1/auth/login/', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (res.ok) {
                  localStorage.setItem('access', data.access);
                  toast.success('Logged in successfully!');
                  window.location.href = '/tasks'; // Simple redirect for now
                } else {
                  toast.error(data.detail || 'Login failed.');
                }
              } else {
                // Register
                const nameField = form.elements.namedItem('name') as HTMLInputElement | null;
                const fullName = nameField ? nameField.value.trim() : "";
                const nameParts = fullName.split(' ');
                const first_name = nameParts[0] || "";
                const last_name = nameParts.slice(1).join(' ') || "";

                const res = await fetch('http://localhost:8000/api/v1/auth/register/', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email, password, first_name, last_name })
                });
                const data = await res.json();
                if (res.ok) {
                  toast.success('Account created! Please sign in.');
                  setMode('login');
                } else {
                  toast.error(JSON.stringify(data));
                }
              }
            } catch (error) {
              toast.error('Network error connecting to the server.');
            }
          }}
        >
          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" placeholder="Ada Lovelace" required />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            {mode === "login" ? "Sign in" : "Create account"}
          </Button>
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="w-full text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {mode === "login"
              ? "No account? Register"
              : "Already registered? Sign in"}
          </button>
        </form>
      </div>
    </AppShell>
  );
}
