/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/purity */
"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  PlusCircle,
  Users,
  Settings,
  UserCheck,
  ShieldCheck,
  User,
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, pathname, router]);

  // Show loading/blank while determining user state or redirecting
  if (loading || !user) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950 min-h-[50vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-full mb-4" />
          <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
        </div>
      </div>
    );
  }


  // Define sidebar navigation items based on user role
  const getNavItems = () => {
    switch (user.role) {
      case "candidate":
        return [
          {
            label: "Dashboard",
            href: "/candidate",
            icon: LayoutDashboard,
          },
          {
            label: "CV Builder",
            href: "/candidate/cv-builder",
            icon: FileText,
          },
          {
            label: "Profile",
            href: "/profile",
            icon: User,
          },
          {
            label: "Messages",
            href: "/chat",
            icon: MessageSquare,
          },
        ];
      case "employer":
        return [
          {
            label: "Dashboard",
            href: "/employer",
            icon: LayoutDashboard,
          },
          {
            label: "Post a Job",
            href: "/employer/post-job",
            icon: PlusCircle,
          },
          {
            label: "Profile",
            href: "/profile",
            icon: User,
          },
          {
            label: "Messages",
            href: "/chat",
            icon: MessageSquare,
          },
        ];
      case "admin":
        return [
          {
            label: "Dashboard (Queue)",
            href: "/admin",
            icon: ShieldCheck,
          },
          {
            label: "User Management",
            href: "/admin/users",
            icon: Users,
          },
          {
            label: "Profile",
            href: "/profile",
            icon: User,
          },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="flex-1 flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 transition-colors duration-300 min-h-[calc(100vh-64px-180px)]">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-white dark:bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 p-4 lg:py-6 lg:px-4 shrink-0 shadow-sm lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] z-20">
        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all shrink-0 lg:shrink ${
                  isActive
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                    : "text-slate-650 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-150"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-blue-500" : "text-slate-400"}`} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
