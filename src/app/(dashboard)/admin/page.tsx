"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from "@/services/axiosInstance";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShieldAlert,
  Loader2,
  CheckCircle,
  XCircle,
  MapPin,
  DollarSign,
  Clock,
  ChevronDown,
  ChevronUp,
  Trash2,
  Archive,
  Ban,
  Check,
} from "lucide-react";

export default function AdminDashboard() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"Pending" | "Approved" | "Rejected">("Pending");
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  const fetchJobs = async (status: "Pending" | "Approved" | "Rejected") => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/jobs", {
        params: { status },
      });
      if (response.data?.success) {
        setJobs(response.data.data.result || []);
      }
    } catch (err) {
      console.error(`Failed to fetch ${status} jobs:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(activeTab);
    setExpandedJobId(null);
  }, [activeTab]);

  const handleUpdateStatus = async (jobId: string, newStatus: "Pending" | "Approved" | "Rejected") => {
    setActioningId(jobId);
    setActionError("");
    setActionSuccess("");

    try {
      const response = await axiosInstance.patch(`/jobs/${jobId}/status`, {
        status: newStatus,
      });

      if (response.data?.success) {
        const statusLabels = {
          Pending: "unpublished",
          Approved: "approved",
          Rejected: "rejected/banned",
        };
        setActionSuccess(`Job listing has been ${statusLabels[newStatus]} successfully!`);
        // Remove from current tab list
        setJobs((prev) => prev.filter((job) => job._id !== jobId));
      }
    } catch (err: any) {
      console.error("Status update error:", err);
      setActionError(
        err.response?.data?.message || `Failed to update status to ${newStatus}.`
      );
    } finally {
      setActioningId(null);
      setTimeout(() => {
        setActionSuccess("");
        setActionError("");
      }, 3000);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this job listing? This action cannot be undone and will delete all candidate applications associated with it.")) {
      return;
    }

    setActioningId(jobId);
    setActionError("");
    setActionSuccess("");

    try {
      const response = await axiosInstance.delete(`/jobs/${jobId}`);

      if (response.data?.success) {
        setActionSuccess("Job listing and its applications have been permanently deleted!");
        setJobs((prev) => prev.filter((job) => job._id !== jobId));
      }
    } catch (err: any) {
      console.error("Delete job error:", err);
      setActionError(
        err.response?.data?.message || "Failed to delete job listing."
      );
    } finally {
      setActioningId(null);
      setTimeout(() => {
        setActionSuccess("");
        setActionError("");
      }, 3000);
    }
  };

  const toggleExpand = (jobId: string) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <ShieldAlert className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          Job Listings Administration
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Review, approve, reject, unpublish, or delete job listings across the platform.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto scrollbar-none">
        {(["Pending", "Approved", "Rejected"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-5 font-semibold text-sm border-b-2 transition-all whitespace-nowrap relative ${
              activeTab === tab
                ? "border-purple-600 text-purple-650 dark:border-purple-400 dark:text-purple-400 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            {tab === "Pending" && `Pending Queue (${jobs.length})`}
            {tab === "Approved" && `Approved / Live (${jobs.length})`}
            {tab === "Rejected" && `Rejected / Banned (${jobs.length})`}
          </button>
        ))}
      </div>

      {actionSuccess && (
        <div className="p-4 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/30 rounded-xl text-sm font-semibold flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
          {actionSuccess}
        </div>
      )}

      {actionError && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/30 rounded-xl text-sm font-semibold flex items-center gap-2">
          <XCircle className="h-5 w-5 text-red-500 shrink-0" />
          {actionError}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm animate-fadeIn">
          <CheckCircle className="h-12 w-12 text-slate-350 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No jobs found</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {activeTab === "Pending" && "There are no pending job postings in the queue."}
            {activeTab === "Approved" && "There are no approved or live job postings."}
            {activeTab === "Rejected" && "There are no rejected or banned job postings."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => {
            const isExpanded = expandedJobId === job._id;
            const companyInitials =
              job.company?.name
                ?.split(" ")
                ?.map((n: string) => n[0])
                ?.join("")
                ?.toUpperCase()
                ?.slice(0, 2) || "CO";

            return (
              <div
                key={job._id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm overflow-hidden transition-all hover:border-slate-300 dark:hover:border-slate-700"
              >
                {/* Header Summary */}
                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200/30 dark:border-slate-700/30 text-lg">
                      {job.company?.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={job.company.logo}
                          alt={job.company.name}
                          className="h-full w-full object-cover rounded-xl"
                        />
                      ) : (
                        companyInitials
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {job.company?.name || "Company"}
                        </span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {job.location}
                        </div>
                        <span>•</span>
                        <div>{job.jobType}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0 self-end md:self-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg h-9 text-slate-600 border-slate-250 dark:text-slate-300 dark:border-slate-700"
                      onClick={() => toggleExpand(job._id)}
                    >
                      {isExpanded ? (
                        <>
                          Hide Details
                          <ChevronUp className="ml-1 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Review Details
                          <ChevronDown className="ml-1 h-4 w-4" />
                        </>
                      )}
                    </Button>

                    {/* Actions based on tab */}
                    {activeTab === "Pending" && (
                      <>
                        <Button
                          size="sm"
                          disabled={actioningId === job._id}
                          onClick={() => handleUpdateStatus(job._id, "Approved")}
                          className="bg-green-600 hover:bg-green-700 text-white rounded-lg h-9 flex items-center gap-1.5"
                        >
                          <Check className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          disabled={actioningId === job._id}
                          onClick={() => handleUpdateStatus(job._id, "Rejected")}
                          className="bg-red-600 hover:bg-red-700 text-white rounded-lg h-9 flex items-center gap-1.5"
                        >
                          <Ban className="h-4 w-4" />
                          Reject
                        </Button>
                      </>
                    )}

                    {activeTab === "Approved" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actioningId === job._id}
                          onClick={() => handleUpdateStatus(job._id, "Pending")}
                          className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 border-amber-200 dark:border-amber-800 rounded-lg h-9 flex items-center gap-1.5"
                        >
                          <Archive className="h-4 w-4" />
                          Unpublish
                        </Button>
                        <Button
                          size="sm"
                          disabled={actioningId === job._id}
                          onClick={() => handleUpdateStatus(job._id, "Rejected")}
                          className="bg-red-600 hover:bg-red-700 text-white rounded-lg h-9 flex items-center gap-1.5"
                        >
                          <Ban className="h-4 w-4" />
                          Ban / Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={actioningId === job._id}
                          onClick={() => handleDeleteJob(job._id)}
                          className="rounded-lg h-9 flex items-center gap-1.5"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </>
                    )}

                    {activeTab === "Rejected" && (
                      <>
                        <Button
                          size="sm"
                          disabled={actioningId === job._id}
                          onClick={() => handleUpdateStatus(job._id, "Approved")}
                          className="bg-green-600 hover:bg-green-700 text-white rounded-lg h-9 flex items-center gap-1.5"
                        >
                          <Check className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actioningId === job._id}
                          onClick={() => handleUpdateStatus(job._id, "Pending")}
                          className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 border-amber-200 dark:border-amber-800 rounded-lg h-9 flex items-center gap-1.5"
                        >
                          <Archive className="h-4 w-4" />
                          Unpublish
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={actioningId === job._id}
                          onClick={() => handleDeleteJob(job._id)}
                          className="rounded-lg h-9 flex items-center gap-1.5"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Expanded Details Pane */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-slate-100 dark:border-slate-800 pt-5 bg-slate-50/50 dark:bg-slate-950/20 space-y-4 animate-slideDown">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 pb-4 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-slate-400" />
                        <span className="font-bold text-slate-700 dark:text-slate-300">Salary:</span> {job.salaryRange}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="font-bold text-slate-700 dark:text-slate-300">Category:</span> {job.category?.name || "Uncategorized"}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</h4>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                        {job.description}
                      </p>
                    </div>

                    {job.skillsRequired && job.skillsRequired.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Required Skills</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {job.skillsRequired.map((skill: string) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 font-semibold"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
