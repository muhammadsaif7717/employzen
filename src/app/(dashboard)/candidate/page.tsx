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
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const STATUS_BADGES: Record<string, string> = {
  Applied: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border-blue-200/50",
  Shortlisted: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400 border-purple-200/50",
  Interviewing: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-amber-200/50",
  Hired: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 border-green-200/50",
  Rejected: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 border-red-200/50",
};

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
        if (response.data?.success) {
          setApplications(response.data.data || []);
        }
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
    applied: applications.filter((app) => app.status === "Applied").length,
    shortlisted: applications.filter((app) => app.status === "Shortlisted").length,
    interviewing: applications.filter((app) => app.status === "Interviewing").length,
    hired: applications.filter((app) => app.status === "Hired").length,
  };

  const filteredApplications =
    activeTab === "All"
      ? applications
      : applications.filter((app) => app.status === activeTab);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome & Stats Summary */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Hello, {profile?.name || "Candidate"}!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Track your job applications and check recruiter reviews here.
          </p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
          <Link href="/jobs">Find More Jobs</Link>
        </Button>
      </div>

      {/* Analytics Counter Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col justify-between">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold tracking-wider uppercase">Applied</span>
          <div className="flex items-end justify-between mt-4">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.applied}</span>
            <ClipboardList className="h-5 w-5 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col justify-between">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold tracking-wider uppercase">Shortlisted</span>
          <div className="flex items-end justify-between mt-4">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.shortlisted}</span>
            <UserCheck className="h-5 w-5 text-purple-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col justify-between">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold tracking-wider uppercase">Interviews</span>
          <div className="flex items-end justify-between mt-4">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.interviewing}</span>
            <Calendar className="h-5 w-5 text-amber-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col justify-between">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold tracking-wider uppercase">Hired</span>
          <div className="flex items-end justify-between mt-4">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.hired}</span>
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col justify-between col-span-2 md:col-span-1">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold tracking-wider uppercase">Total Applications</span>
          <div className="flex items-end justify-between mt-4">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.total}</span>
            <Briefcase className="h-5 w-5 text-slate-500" />
          </div>
        </div>
      </div>

      {/* Tabs list for tracking board filter */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex gap-2 overflow-x-auto pb-px">
        {["All", "Applied", "Shortlisted", "Interviewing", "Hired", "Rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 px-4 text-sm font-semibold border-b-2 transition-colors shrink-0 ${
              activeTab === tab
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tracking Board List */}
      {filteredApplications.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
          <ClipboardList className="h-12 w-12 text-slate-350 dark:text-slate-650 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No applications found</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            You don&apos;t have any applications under status &quot;{activeTab}&quot; right now.
          </p>
          <Button variant="outline" className="mt-6 rounded-xl" asChild>
            <Link href="/jobs">Browse Jobs</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredApplications.map((app) => {
            const companyInitials = app.job?.company?.name
              ?.split(" ")
              ?.map((n: string) => n[0])
              ?.join("")
              ?.toUpperCase()
              ?.slice(0, 2) || "CO";

            // Recruiter user reference for messaging
            const recruiterId = app.job?.postedBy?._id || app.job?.postedBy;

            return (
              <div
                key={app._id}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200/30 dark:border-slate-700/30 text-lg">
                    {app.job?.company?.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={app.job.company.logo}
                        alt={app.job.company.name}
                        className="h-full w-full object-cover rounded-xl"
                      />
                    ) : (
                      companyInitials
                    )}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {app.job?.title || "Job Listing"}
                    </h3>
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {app.job?.company?.name || "Company"}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {app.job?.location}
                      </div>
                      <span className="hidden sm:inline">•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        Applied on {new Date(app.appliedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Badge className={`font-semibold border text-xs px-2.5 py-1 ${STATUS_BADGES[app.status]}`}>
                    {app.status}
                  </Badge>

                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg h-9 text-slate-700 dark:text-slate-300"
                    asChild
                  >
                    <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer">
                      <FileDown className="h-4 w-4 mr-1.5" />
                      Resume
                    </a>
                  </Button>

                  {/* Messaging Link with Recruiter */}
                  {recruiterId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-lg h-9 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/40"
                      onClick={() => {
                        // We need to fetch the user id linked to the recruiter. Wait, the chat partnerId should be the User ID!
                        // In backend, chat history partnerId is the other user's ID. Let's see if we can resolve the User ID of the recruiter.
                        // In backend model, Employer has a 'user' field which points to User.
                        // Wait, if the populated postedBy is a ref to Employer, and Employer has 'user', we can query this or pass it!
                        // Let's pass the employer profile user id if populated, otherwise the recruiterId itself.
                        // Usually the postedBy contains details, or we can message them!
                        router.push(`/chat?partnerId=${app.job?.postedBy?.user || recruiterId}`);
                      }}
                    >
                      <MessageSquare className="h-4 w-4 mr-1.5" />
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
