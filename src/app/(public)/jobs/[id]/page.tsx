/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/purity */
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/services/axiosInstance";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Eye,
  Users,
  Loader2,
  FileText,
  Upload,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Building2,
  Globe,
} from "lucide-react";
import Link from "next/link";

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, profile, isAuthenticated } = useAuth();

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Application Form States
  const [useProfileResume, setUseProfileResume] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [appliedSuccessfully, setAppliedSuccessfully] = useState(false);
  const [applyError, setApplyError] = useState("");

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axiosInstance.get(`/jobs/${id}`);
        if (response.data?.success) {
          setJob(response.data.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setApplyError("");
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplyError("");
    setApplying(true);

    try {
      let finalResumeUrl = "";

      // 1. Determine resume URL
      if (useProfileResume && profile && (profile as any).resumeUrl) {
        finalResumeUrl = (profile as any).resumeUrl;
      } else {
        if (!file) {
          setApplyError("Please select a resume file to upload.");
          setApplying(false);
          return;
        }

        // Upload resume file
        setUploading(true);
        const formData = new FormData();
        formData.append("resume", file);

        const uploadResponse = await axiosInstance.post("/profile/resume", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (uploadResponse.data?.success) {
          finalResumeUrl = uploadResponse.data.data.resumeUrl;
          // Optionally update profile with this resume URL in the background
          try {
            await axiosInstance.patch("/profile", { resumeUrl: finalResumeUrl });
          } catch (pErr) {
            console.error("Failed to update profile resume URL:", pErr);
          }
        } else {
          throw new Error("Resume upload failed.");
        }
      }

      if (!finalResumeUrl) {
        throw new Error("Resume URL could not be resolved.");
      }

      // 2. Submit application
      const applyResponse = await axiosInstance.post("/applications", {
        job: id,
        resumeUrl: finalResumeUrl,
      });

      if (applyResponse.data?.success) {
        setAppliedSuccessfully(true);
        // Refresh job count/views
        setJob((prev: any) =>
          prev ? { ...prev, applicationsCount: prev.applicationsCount + 1 } : null
        );
      }
    } catch (err: any) {
      console.error("Application error:", err);
      setApplyError(
        err.response?.data?.message || "Failed to submit application. Please try again."
      );
    } finally {
      setUploading(false);
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
        <span className="text-slate-500 dark:text-slate-400 mt-4 font-semibold">
          Loading job details...
        </span>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-950 px-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Error loading job</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{error || "Job not found."}</p>
        <Button className="mt-6 rounded-xl" onClick={() => router.push("/jobs")}>
          Back to Jobs
        </Button>
      </div>
    );
  }

  const companyInitials =
    job.company?.name
      ?.split(" ")
      ?.map((n: string) => n[0])
      ?.join("")
      ?.toUpperCase()
      ?.slice(0, 2) || "CO";

  const isCandidate = user?.role === "candidate";
  const isEmployer = user?.role === "employer";
  const isAdmin = user?.role === "admin";
  const hasSavedResume = profile && (profile as any).resumeUrl;

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 min-h-[calc(100vh-64px-180px)] py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to list
        </button>

        {/* Job Header Card */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200/30 dark:border-slate-700/30 text-xl">
                {job.company?.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={job.company.logo}
                    alt={job.company.name}
                    className="h-full w-full object-cover rounded-2xl"
                  />
                ) : (
                  companyInitials
                )}
              </div>
              <div className="space-y-1.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {job.company?.name || "Company"}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    {job.location}
                  </div>
                  <span className="hidden sm:inline">•</span>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-slate-400" />
                    {job.salaryRange}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick badges */}
            <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2 shrink-0">
              <Badge className="bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 font-semibold text-sm px-3 py-1">
                {job.jobType}
              </Badge>
              {job.category?.name && (
                <Badge variant="outline" className="border-slate-200 dark:border-slate-800 text-slate-500 text-xs px-2.5 py-0.5">
                  {job.category.name}
                </Badge>
              )}
            </div>
          </div>

          {/* Job analytics meta */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-slate-400" />
              <span>{job.views} Views</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-400" />
              <span>{job.applicationsCount} Applications</span>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Description & Apply Section */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Description */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Job Description
              </h2>
              <div className="text-slate-600 dark:text-slate-350 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {job.description}
              </div>

              {/* Skills Required */}
              {job.skillsRequired && job.skillsRequired.length > 0 && (
                <div className="pt-6 space-y-3">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Required Skills & Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skillsRequired.map((skill: string) => (
                      <Badge
                        key={skill}
                        className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1 font-medium text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Application Section */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Apply for this Position
              </h2>

              {appliedSuccessfully ? (
                <div className="flex flex-col items-center justify-center text-center p-8 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 rounded-2xl border border-green-200/50 dark:border-green-900/30">
                  <CheckCircle2 className="h-12 w-12 mb-3 text-green-500" />
                  <h3 className="text-lg font-bold">Application Submitted!</h3>
                  <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                    You have successfully applied to this job posting. The employer will review your application soon.
                  </p>
                  <Button className="mt-6 rounded-xl bg-green-600 hover:bg-green-700 text-white" asChild>
                    <Link href="/candidate">Go to Dashboard</Link>
                  </Button>
                </div>
              ) : !isAuthenticated ? (
                <div className="p-6 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/40 dark:border-blue-900/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <h3 className="font-bold text-slate-900 dark:text-white">Log in to apply</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      You need to be signed in as a candidate to apply for this job.
                    </p>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shrink-0" asChild>
                    <Link href={`/login?redirect=/jobs/${id}`}>Sign In & Apply</Link>
                  </Button>
                </div>
              ) : isEmployer || isAdmin ? (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 rounded-xl border border-amber-200/40 dark:border-amber-900/20 flex items-start gap-3 text-sm">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-amber-500" />
                  <div>
                    <span className="font-bold">Not Allowed</span>
                    <p className="mt-0.5 text-amber-600 dark:text-amber-500">
                      Only candidate accounts are eligible to submit job applications. You are currently logged in as an{" "}
                      <span className="capitalize font-semibold">{user?.role}</span>.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-6">
                  {applyError && (
                    <div className="p-4 text-sm bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-xl border border-red-200/40 dark:border-red-900/20 font-medium">
                      {applyError}
                    </div>
                  )}

                  {/* Resume Selector */}
                  <div className="space-y-4">
                    {hasSavedResume && (
                      <div className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/40 dark:border-slate-700/40">
                        <input
                          type="checkbox"
                          id="useProfile"
                          checked={useProfileResume}
                          onChange={(e) => setUseProfileResume(e.target.checked)}
                          className="h-4.5 w-4.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="useProfile" className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                          <FileText className="h-4 w-4 text-blue-500" />
                          Use my profile resume (PDF/Word document)
                        </label>
                      </div>
                    )}

                    {(!hasSavedResume || !useProfileResume) && (
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Upload New Resume
                        </label>
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors relative cursor-pointer group">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          <Upload className="h-8 w-8 text-slate-400 group-hover:text-blue-500 transition-colors mb-2" />
                          {file ? (
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                              {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                            </span>
                          ) : (
                            <>
                              <span className="text-sm text-slate-600 dark:text-slate-400 font-medium text-center">
                                Drag and drop or click to upload your resume
                              </span>
                              <span className="text-xs text-slate-400 dark:text-slate-500 text-center mt-1">
                                Acceptable formats: PDF, DOC, DOCX up to 5MB
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={applying}
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/10 flex items-center justify-center transition-colors"
                  >
                    {applying ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {uploading ? "Uploading resume..." : "Submitting application..."}
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Right: Job Overview & Company Info */}
          <div className="space-y-6">
            
            {/* Job Summary Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Job Summary</h3>
              <div className="space-y-3.5 pt-2 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Location</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{job.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Salary Range</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{job.salaryRange}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Job Type</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{job.jobType}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Info Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">About Company</h3>
              <div className="flex items-center gap-3 pt-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200/30 dark:border-slate-700/30 text-lg">
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
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-950 dark:text-white truncate">
                    {job.company?.name || "Company"}
                  </h4>
                  {job.company?.industry && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {job.company.industry}
                    </p>
                  )}
                </div>
              </div>

              {job.company?.description && (
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed pt-2">
                  {job.company.description}
                </p>
              )}

              {job.company?.website && (
                <div className="pt-2">
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1.5"
                  >
                    <Globe className="h-4 w-4" />
                    Visit Website
                  </a>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
