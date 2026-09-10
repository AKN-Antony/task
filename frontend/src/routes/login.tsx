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
          onSubmit={(e) => {
            e.preventDefault();
            toast.info("This screen is not connected to a server yet.");
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
