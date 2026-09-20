"use client";

import React from "react";
import { ThemeToggle } from "@/components/public/theme-toggle";
import { User, ShieldCheck } from "lucide-react";

interface AdminHeaderProps {
  userEmail?: string;
}

export function AdminHeader({ userEmail = "admin@saeful.dev" }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Title / Status Badge */}
      <div className="flex items-center gap-2 pl-12 lg:pl-0">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Admin Portal</span>
        </div>
      </div>

      {/* User Info & Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Active Admin Account Badge */}
        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-border bg-card">
          <div className="p-1 rounded-lg bg-secondary text-foreground">
            <User className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-foreground leading-tight">
              {userEmail}
            </span>
            <span className="text-[10px] text-emerald-500 font-semibold">
              Session Active
            </span>
          </div>
        </div>

        {/* Theme Switcher Toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}