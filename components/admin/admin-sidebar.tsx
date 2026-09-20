"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  FolderGit2,
  FileText,
  Code2,
  Briefcase,
  Mail,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Globe,
  Sparkles,
  Menu,
  X,
} from "lucide-react";

interface AdminSidebarProps {
  unreadMessagesCount?: number;
}

export function AdminSidebar({ unreadMessagesCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("[Logout Error]:", error);
    }
  };

  const menuItems = [
    {
      title: "Overview",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Projects",
      href: "/admin/projects",
      icon: FolderGit2,
    },
    {
      title: "Blog Posts",
      href: "/admin/posts",
      icon: FileText,
    },
    {
      title: "Skills",
      href: "/admin/skills",
      icon: Code2,
    },
    {
      title: "Experience & Edu",
      href: "/admin/experiences",
      icon: Briefcase,
    },
    {
      title: "Messages",
      href: "/admin/messages",
      icon: Mail,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
    },
  ];

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-3 left-4 z-50 p-2.5 rounded-xl bg-card border border-border text-foreground shadow-md hover:bg-muted transition-colors"
        aria-label="Toggle Navigation Menu"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm animate-in fade-in"
        />
      )}

      {/* Sidebar Main Container */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen bg-card border-r border-border transition-all duration-300 flex flex-col justify-between ${
          isCollapsed ? "w-20" : "w-64"
        } ${
          isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Top Header Section */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <Link
            href="/admin/dashboard"
            className={`flex items-center gap-3 overflow-hidden ${
              isCollapsed ? "justify-center w-full" : ""
            }`}
          >
            <div className="p-2 rounded-xl bg-primary text-primary-foreground shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold text-base text-foreground tracking-tight leading-none">
                  Saeful Admin
                </span>
                <span className="text-[11px] text-muted-foreground font-medium mt-1">
                  CMS Control Panel
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all relative group ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                } ${isCollapsed ? "justify-center" : ""}`}
                title={isCollapsed ? item.title : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span className="truncate">{item.title}</span>}

                {/* Badge Alert counter */}
                {item.badge && (
                  <span
                    className={`ml-auto px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive
                        ? "bg-primary-foreground text-primary"
                        : "bg-destructive text-destructive-foreground"
                    } ${isCollapsed ? "absolute -top-1 -right-1 px-1.5 py-0.2" : ""}`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom Actions Section */}
        <div className="p-3 border-t border-border space-y-2">
          {/* Quick link to public website */}
          <Link
            href="/"
            target="_blank"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "View Public Site" : undefined}
          >
            <Globe className="w-4 h-4 shrink-0 text-primary" />
            {!isCollapsed && <span>View Public Site</span>}
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Logout Session" : undefined}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}