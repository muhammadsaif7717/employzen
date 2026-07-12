/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
 
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/services/axiosInstance";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Eye,
  Users,
  MapPin,
  Clock,
  ArrowLeft,
  Loader2,
  FileText,
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileDown,
  Mail,
  Phone,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const JOB_STATUS_BADGES: Record<string, string> = {
  Approved: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 border-green-200/50",
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-amber-200/50",
  Rejected: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 border-red-200/50",
};

const APP_STATUS_COLORS: Record<string, string> = {
  Applied: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40",
  Shortlisted: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40",
  Interviewing: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40",
  Hired: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/40",
  Rejected: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40",
};

export default function EmployerDashboard() {
  const router = useRouter();
  const { profile } = useAuth();

  const [activeTab, setActiveTab] = useState<"Approved" | "Pending" | "Rejected">("Approved");
  const [jobs, setJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // Applicant Review State
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [updatingAppId, setUpdatingAppId] = useState<string | null>(null);

  // Candidate Profile Detail Modal
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  // Fetch jobs for employer
  const fetchJobs = async () => {
    if (!profile) return;
    setLoadingJobs(true);
    try {
      const response = await axiosInstance.get("/jobs", {
        params: {
          postedBy: profile._id,
          status: activeTab,
        },
      });
      if (response.data?.success) {
        setJobs(response.data.data.result || []);
      }
    } catch (err) {
      console.error("Failed to load jobs:", err);
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, activeTab]);

  // Fetch applicants for a job
  const handleViewApplicants = async (job: any) => {
    setSelectedJob(job);
    setLoadingApplicants(true);
    try {
      const response = await axiosInstance.get(`/applications/job/${job._id}`);
      if (response.data?.success) {
        setApplicants(response.data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch applicants:", err);
    } finally {
      setLoadingApplicants(false);
    }
  };

  // Update applicant status
  const handleUpdateStatus = async (appId: string, newStatus: string) => {
    setUpdatingAppId(appId);
    try {
      const response = await axiosInstance.patch(`/applications/${appId}/status`, {
        status: newStatus,
      });
      if (response.data?.success) {
        // Update local state
        setApplicants((prev) =>
          prev.map((app) => (app._id === appId ? { ...app, status: newStatus } : app))
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingAppId(null);
    }
  };

  // Analytics totals
  const totalPosts = jobs.length;
  const totalViews = jobs.reduce((acc, job) => acc + (job.views || 0), 0);
  const totalApplicants = jobs.reduce((acc, job) => acc + (job.applicationsCount || 0), 0);

  // Render Candidate details modal helper
  const renderCandidateModal = () => {
    if (!selectedCandidate) return null;
    const cv = selectedCandidate.cvBuilderData || {};
    const initials = selectedCandidate.name
      ?.split(" ")
      ?.map((n: string) => n[0])
      ?.join("")
      ?.toUpperCase()
      ?.slice(0, 2) || "CA";

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 relative animate-scaleUp">
          <button
            onClick={() => setSelectedCandidate(null)}
            className="absolute right-4 top-4 text-slate-400 hover:text-slate-650 dark:hover:text-slate-250"
          >
            <XCircle className="h-6 w-6" />
          </button>

          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="h-16 w-16 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center rounded-2xl font-bold text-xl">
              {selectedCandidate.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selectedCandidate.avatarUrl} alt={selectedCandidate.name} className="h-full w-full object-cover rounded-2xl" />
              ) : initials}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedCandidate.name}</h3>
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-0.5">{selectedCandidate.title || "Job Seeker"}</p>
              <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
                {selectedCandidate.phone && (
                  <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{selectedCandidate.phone}</span>
                )}
                {selectedCandidate.user?.email && (
                  <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{selectedCandidate.user.email}</span>
                )}
              </div>
            </div>
          </div>

          {/* Summary */}
          {cv.summary && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-450 uppercase tracking-wider">Professional Summary</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-150 dark:border-slate-800/30">
                {cv.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {selectedCandidate.experience?.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-450 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-1">Experience</h4>
              <div className="space-y-4">
                {selectedCandidate.experience.map((exp: any, idx: number) => (
                  <div key={idx} className="space-y-1 text-sm">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{exp.company}</span>
                      <span className="text-xs text-slate-500">{exp.duration}</span>
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-450 font-semibold">{exp.role}</p>
                    {exp.description && <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pl-2 border-l border-slate-200 dark:border-slate-800 mt-1">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {selectedCandidate.education?.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-450 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-1">Education</h4>
              <div className="space-y-3">
                {selectedCandidate.education.map((edu: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-start text-sm">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{edu.institution}</span>
                      <p className="text-xs text-slate-500 mt-0.5">{edu.degree}</p>
                    </div>
                    <span className="text-xs text-slate-500">{edu.year}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {selectedCandidate.skills?.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-450 uppercase tracking-wider">Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedCandidate.skills.map((skill: string) => (
                  <Badge key={skill} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-850">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Detail Applicant List View */}
      {selectedJob ? (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedJob(null)}
              className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </button>
            <div>
              <span className="text-xs text-blue-650 dark:text-blue-450 font-bold uppercase tracking-wide">Applicant Workspace</span>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                Applicants for &quot;{selectedJob.title}&quot;
              </h1>
            </div>
          </div>

          {loadingApplicants ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            </div>
          ) : applicants.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
              <Users className="h-12 w-12 text-slate-350 dark:text-slate-650 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No applicants yet</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                No candidates have applied for this job listing yet. Share the link or check back later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {applicants.map((app) => {
                const initials = app.candidate?.name
                  ?.split(" ")
                  ?.map((n: string) => n[0])
                  ?.join("")
                  ?.toUpperCase()
                  ?.slice(0, 2) || "CA";

                // Resolve user id from candidate profile details
                const candidateUserId = app.candidate?.user?._id || app.candidate?.user;

                return (
                  <div
                    key={app._id}
                    className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                  >
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => setSelectedCandidate(app.candidate)}
                        className="h-12 w-12 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center rounded-xl font-bold text-lg hover:ring-2 hover:ring-blue-500 transition-all text-left"
                      >
                        {initials}
                      </button>
                      <div>
                        <button
                          onClick={() => setSelectedCandidate(app.candidate)}
                          className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
                        >
                          {app.candidate?.name || "Candidate Name"}
                        </button>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {app.candidate?.title || "Job Seeker"}
                        </p>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-2">
                          <Clock className="h-3.5 w-3.5" />
                          Applied on {new Date(app.appliedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* Resume download */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg h-9 text-slate-700 dark:text-slate-350"
                        asChild
                      >
                        <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer">
                          <FileDown className="h-4 w-4 mr-1.5" />
                          Resume
                        </a>
                      </Button>

                      {/* Chat Space Link */}
                      {candidateUserId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-lg h-9 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/40"
                          onClick={() => router.push(`/chat?partnerId=${candidateUserId}`)}
                        >
                          <MessageSquare className="h-4 w-4 mr-1.5" />
                          Chat
                        </Button>
                      )}

                      {/* Status Dropdown selector */}
                      <div className="relative">
                        {updatingAppId === app._id ? (
                          <div className="h-9 w-28 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <Loader2 className="h-4 w-4 text-slate-400 animate-spin" />
                          </div>
                        ) : (
                          <select
                            value={app.status}
                            onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                            className={`h-9 px-2.5 rounded-lg text-xs font-bold border-none outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
                              APP_STATUS_COLORS[app.status]
                            }`}
                          >
                            <option value="Applied">Applied</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Interviewing">Interviewing</option>
                            <option value="Hired">Hired</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Employer Dashboard Main view */
        <div className="space-y-8 animate-fadeIn">
          {/* Welcome & Action Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
                Company Dashboard
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Manage your job postings, view candidate applicants, and check stats.
              </p>
            </div>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/10">
              <Link href="/employer/post-job">Post a Job</Link>
            </Button>
          </div>

          {/* Stats Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold tracking-wider uppercase">Active Listings</span>
                <p className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">{totalPosts}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                <Briefcase className="h-6 w-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold tracking-wider uppercase">Total Job Views</span>
                <p className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">{totalViews}</p>
              </div>
              <div className="h-12 w-12 bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 rounded-xl flex items-center justify-center">
                <Eye className="h-6 w-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold tracking-wider uppercase">Total Applicants</span>
                <p className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">{totalApplicants}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Job Postings Tabs list */}
          <div className="border-b border-slate-200 dark:border-slate-800 flex gap-2">
            {(["Approved", "Pending", "Rejected"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-4 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                    : "border-transparent text-slate-500 hover:text-slate-850 dark:hover:text-slate-200"
                }`}
              >
                {tab === "Approved" ? "Approved Jobs" : tab === "Pending" ? "Pending Approval" : "Rejected Jobs"}
              </button>
            ))}
          </div>

          {/* Jobs List */}
          {loadingJobs ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
              <Briefcase className="h-12 w-12 text-slate-300 dark:text-slate-650 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No listings found</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                No job postings found under status &quot;{activeTab}&quot;. Click &quot;Post a Job&quot; to create a new one.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {job.title}
                      </h3>
                      <Badge className={`font-semibold border text-xs px-2.5 py-0.5 ${JOB_STATUS_BADGES[job.status]}`}>
                        {job.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {job.location}
                      </div>
                      <span>•</span>
                      <div>{job.jobType}</div>
                      <span>•</span>
                      <div>Posted {new Date(job.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0">
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-lg">{job.views || 0}</span>
                        <span>Views</span>
                      </div>
                      <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-lg">{job.applicationsCount || 0}</span>
                        <span>Applicants</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="rounded-xl border-slate-250 hover:bg-blue-600 hover:text-white hover:border-transparent transition-all font-semibold flex items-center"
                      onClick={() => handleViewApplicants(job)}
                    >
                      View Applicants
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Render details Modal */}
      {renderCandidateModal()}
    </div>
  );
}
