"use client";

import { useTheme } from "next-themes";
import { LogOut, Monitor, Moon, Sun } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export default function CustomerSettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage your appearance preferences and session.
        </p>
      </div>

      <Card className="p-6">
        <CardContent className="p-0">
          <p className="font-display text-sm font-semibold">Appearance</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Choose how FixItNow looks on this device.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {THEME_OPTIONS.map((option) => {
              const Icon = option.icon;
              const active = theme === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-lg border px-4 py-4 text-sm font-medium transition-colors",
                    active
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:bg-secondary",
                  )}
                  aria-pressed={active}
                >
                  <Icon className="size-5" />
                  {option.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="p-6">
        <CardContent className="p-0">
          <p className="font-display text-sm font-semibold">Account</p>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Account type</span>
              <span className="font-medium">Customer</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/30 p-6">
        <CardContent className="p-0">
          <p className="font-display text-sm font-semibold">Session</p>
          <p className="text-muted-foreground mt-1 mb-4 text-sm">
            Sign out of FixItNow on this device.
          </p>
          <Separator className="mb-4" />
          <Button variant="destructive" onClick={logout} className="gap-2">
            <LogOut className="size-4" />
            Log out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
