

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  PlusCircle,
  Users,
  User,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, pathname, router]);

  // Close mobile sidebar on route change
  useEffect(() => {
    const timer = setTimeout(() => setSidebarOpen(false), 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (loading || !user) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
          <div className="h-3 w-24 bg-muted rounded animate-pulse" />
        </div>
      </div>
    );
  }

  const getNavItems = () => {
    switch (user.role) {
      case "candidate":
        return [
          { label: "Dashboard", href: "/candidate", icon: LayoutDashboard },
          { label: "CV Builder", href: "/candidate/cv-builder", icon: FileText },
          { label: "Profile", href: "/profile", icon: User },
          { label: "Messages", href: "/chat", icon: MessageSquare },
        ];
      case "employer":
        return [
          { label: "Dashboard", href: "/employer", icon: LayoutDashboard },
          { label: "Post a Job", href: "/employer/post-job", icon: PlusCircle },
          { label: "Profile", href: "/profile", icon: User },
          { label: "Messages", href: "/chat", icon: MessageSquare },
        ];
      case "admin":
        return [
          { label: "Dashboard", href: "/admin", icon: ShieldCheck },
          { label: "User Management", href: "/admin/users", icon: Users },
          { label: "Profile", href: "/profile", icon: User },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const renderNavLinks = (onClick?: () => void) => (
    <div className="flex flex-col gap-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4 shrink-0",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            />
            {item.label}
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-background transition-colors duration-300 min-h-[calc(100vh-64px)]">

      {/* Mobile topbar for dashboard navigation */}
      <div className="lg:hidden sticky top-16 z-30 bg-card border-b border-border px-4 py-2 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(true)}
          className="rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <span className="text-sm font-semibold text-foreground capitalize">
          {navItems.find(item => pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)))?.label || "Dashboard"}
        </span>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 z-50 w-72 bg-card border-r border-border",
          "flex flex-col shadow-xl transition-transform duration-300 lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <span className="font-bold text-foreground font-[family-name:var(--font-heading)]">
            Navigation
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="rounded-xl text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {renderNavLinks(() => setSidebarOpen(false))}
        </nav>
      </aside>

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex w-60 xl:w-64 bg-card border-r border-border flex-col shrink-0 sticky top-16 h-[calc(100vh-64px)]">
          {/* Subtle gradient header */}
          <div className="px-4 pt-6 pb-4">
            <div className="h-0.5 w-8 gradient-brand rounded-full mb-4" />
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              {user.role} menu
            </p>
          </div>
          <nav className="flex-1 overflow-y-auto px-3 pb-6">
            {renderNavLinks()}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
