/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/services/axiosInstance";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  MapPin,
  Clock,
  MessageSquare,
  FileDown,
  Loader2,
  CheckCircle2,
  ClipboardList,
  UserCheck,
  Send,
  Calendar,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<string, { variant: string; label: string }> = {
  Applied: {
    variant: "bg-primary/10 text-primary border-primary/20",
    label: "Applied",
  },
  Shortlisted: {
    variant: "bg-secondary/10 text-secondary border-secondary/20",
    label: "Shortlisted",
  },
  Interviewing: {
    variant: "bg-warning/15 text-warning-foreground border-warning/25",
    label: "Interviewing",
  },
  Hired: {
    variant: "bg-success/10 text-success border-success/20",
    label: "Hired",
  },
  Rejected: {
    variant: "bg-destructive/10 text-destructive border-destructive/20",
    label: "Rejected",
  },
};

const STAT_CARDS = [
  { key: "applied", label: "Applied", icon: ClipboardList, color: "text-primary", bg: "bg-primary/10" },
  { key: "shortlisted", label: "Shortlisted", icon: UserCheck, color: "text-secondary", bg: "bg-secondary/10" },
  { key: "interviewing", label: "Interviews", icon: Calendar, color: "text-warning-foreground", bg: "bg-warning/10" },
  { key: "hired", label: "Hired", icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
  { key: "total", label: "Total", icon: TrendingUp, color: "text-muted-foreground", bg: "bg-muted" },
];

export default function CandidateDashboard() {
  const router = useRouter();
  const { profile } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axiosInstance.get("/applications/candidate");
        if (response.data?.success) setApplications(response.data.data || []);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const stats = {
    total: applications.length,
    applied: applications.filter((a) => a.status === "Applied").length,
    shortlisted: applications.filter((a) => a.status === "Shortlisted").length,
    interviewing: applications.filter((a) => a.status === "Interviewing").length,
    hired: applications.filter((a) => a.status === "Hired").length,
  };

  const filteredApplications =
    activeTab === "All" ? applications : applications.filter((a) => a.status === activeTab);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="text-muted-foreground text-sm">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-slide-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-[family-name:var(--font-heading)]">
            Hello, {profile?.name || "Candidate"}! 👋
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Track your job applications and check recruiter reviews here.
          </p>
        </div>
        <Button asChild variant="gradient" className="rounded-xl shrink-0">
          <Link href="/jobs">Find More Jobs</Link>
        </Button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {STAT_CARDS.map((stat, idx) => {
          const Icon = stat.icon;
          const value = stats[stat.key as keyof typeof stats];
          return (
            <div
              key={stat.key}
              className={cn(
                "bg-card p-4 sm:p-5 rounded-2xl border border-border shadow-sm",
                "flex flex-col justify-between gap-3",
                "hover:shadow-md hover:border-primary/15 transition-all duration-200",
                "animate-fade-slide-up",
                `stagger-${idx + 1}`
              )}
            >
              <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                {stat.label}
              </span>
              <div className="flex items-end justify-between">
                <span className="text-2xl sm:text-3xl font-extrabold text-foreground">{value}</span>
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", stat.bg)}>
                  <Icon className={cn("h-4 w-4", stat.color)} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter tabs */}
      <div className="border-b border-border flex gap-1 overflow-x-auto scrollbar-none pb-px animate-fade-slide-up stagger-2">
        {["All", "Applied", "Shortlisted", "Interviewing", "Hired", "Rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "pb-3 px-3 sm:px-4 text-sm font-semibold border-b-2 transition-all duration-150 shrink-0 whitespace-nowrap",
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Applications list */}
      {filteredApplications.length === 0 ? (
        <div className="text-center py-16 sm:py-20 bg-card rounded-2xl border border-border animate-fade-in">
          <ClipboardList className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)]">
            No applications found
          </h3>
          <p className="text-muted-foreground mt-1.5 max-w-sm mx-auto text-sm">
            You don&apos;t have any applications under &quot;{activeTab}&quot; right now.
          </p>
          <Button variant="outline" className="mt-5 rounded-xl" asChild>
            <Link href="/jobs">Browse Jobs</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {filteredApplications.map((app, idx) => {
            const companyInitials =
              app.job?.company?.name?.split(" ")?.map((n: string) => n[0])?.join("")?.toUpperCase()?.slice(0, 2) || "CO";
            const recruiterId = app.job?.postedBy?._id || app.job?.postedBy;
            const statusConfig = STATUS_CONFIG[app.status];

            return (
              <div
                key={app._id}
                className={cn(
                  "bg-card p-5 sm:p-6 rounded-2xl border border-border shadow-sm",
                  "flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 group",
                  "hover:shadow-md hover:border-primary/15 transition-all duration-200",
                  "animate-fade-slide-up",
                  `stagger-${Math.min(idx + 1, 6)}`
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted border border-border/50 overflow-hidden font-bold text-sm text-muted-foreground">
                    {app.job?.company?.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={app.job.company.logo} alt={app.job.company.name} className="h-full w-full object-cover rounded-xl" />
                    ) : (
                      companyInitials
                    )}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors text-sm sm:text-base font-[family-name:var(--font-heading)] truncate">
                      {app.job?.title || "Job Listing"}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground/70">{app.job?.company?.name || "Company"}</span>
                      <span className="hidden sm:inline text-muted-foreground/40">•</span>
                      <div className="flex items-center gap-1"><MapPin className="h-3 w-3" />{app.job?.location}</div>
                      <span className="hidden sm:inline text-muted-foreground/40">•</span>
                      <div className="flex items-center gap-1"><Clock className="h-3 w-3" />Applied {new Date(app.appliedAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:shrink-0">
                  {statusConfig && (
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border",
                      statusConfig.variant
                    )}>
                      {app.status}
                    </span>
                  )}

                  <Button variant="outline" size="sm" className="rounded-lg h-8 text-xs" asChild>
                    <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer">
                      <FileDown className="h-3.5 w-3.5 mr-1" />
                      Resume
                    </a>
                  </Button>

                  {recruiterId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-lg h-8 text-xs text-primary hover:text-primary hover:bg-primary/10"
                      onClick={() => router.push(`/chat?partnerId=${app.job?.postedBy?.user || recruiterId}`)}
                    >
                      <MessageSquare className="h-3.5 w-3.5 mr-1" />
                      Chat
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
