/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/purity */
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axiosInstance from "@/services/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Remote", "Internship"];

function JobsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load initial filters from URL params
  const initialSearch = searchParams.get("search") || "";
  const initialLocation = searchParams.get("location") || "";
  const initialJobType = searchParams.get("jobType") || "";
  const initialPage = Number(searchParams.get("page")) || 1;

  const [search, setSearch] = useState(initialSearch);
  const [location, setLocation] = useState(initialLocation);
  const [jobType, setJobType] = useState(initialJobType);
  const [page, setPage] = useState(initialPage);
  
  const [jobs, setJobs] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({ page: 1, limit: 10, total: 0, totalPage: 1 });
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync state with URL params when they change
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setLocation(searchParams.get("location") || "");
    setJobType(searchParams.get("jobType") || "");
    setPage(Number(searchParams.get("page")) || 1);
  }, [searchParams]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = { page, limit: 10 };
      if (search) params.search = search;
      if (location) params.location = location;
      if (jobType) params.jobType = jobType;

      const response = await axiosInstance.get("/jobs", { params });
      if (response.data?.success) {
        setJobs(response.data.data.result || []);
        setMeta(response.data.data.meta || { page, limit: 10, total: 0, totalPage: 1 });
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, page]);

  const updateUrl = (newFilters: { search?: string; location?: string; jobType?: string; page?: number }) => {
    const params = new URLSearchParams();
    
    const s = newFilters.search !== undefined ? newFilters.search : search;
    const l = newFilters.location !== undefined ? newFilters.location : location;
    const jt = newFilters.jobType !== undefined ? newFilters.jobType : jobType;
    const p = newFilters.page !== undefined ? newFilters.page : page;

    if (s) params.set("search", s);
    if (l) params.set("location", l);
    if (jt) params.set("jobType", jt);
    if (p > 1) params.set("page", String(p));

    router.push(`/jobs?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    updateUrl({ page: 1 });
  };

  const handleResetFilters = () => {
    setSearch("");
    setLocation("");
    setJobType("");
    setPage(1);
    router.push("/jobs");
  };

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 min-h-[calc(100vh-64px-180px)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Explore Jobs</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Discover opportunities matching your skills and preferences.
          </p>
        </div>

        {/* Search & Filter Controls (Top Bar) */}
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
            <Search className="h-5 w-5 text-slate-400 shrink-0" />
            <Input
              type="text"
              placeholder="Search by job title or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
            <MapPin className="h-5 w-5 text-slate-400 shrink-0" />
            <Input
              type="text"
              placeholder="Filter by location (e.g. Remote, NY)..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-500/10"
            >
              Search
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="h-12 w-12 p-0 md:hidden rounded-xl border-slate-200 dark:border-slate-800"
            >
              <Filter className="h-5 w-5" />
            </Button>
          </div>
        </form>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 h-fit shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Filter className="h-4 w-4 text-blue-500" />
                Filters
              </h3>
              {(search || location || jobType) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Job Type Filter */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Job Type</label>
              <div className="space-y-2">
                {JOB_TYPES.map((type) => (
                  <label key={type} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                    <input
                      type="radio"
                      name="jobType"
                      checked={jobType === type}
                      onChange={() => {
                        setJobType(type);
                        setPage(1);
                        updateUrl({ jobType: type, page: 1 });
                      }}
                      className="h-4 w-4 rounded-full border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Filters Sheet/Drawer Overlay */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm lg:hidden">
              <div className="w-80 bg-white dark:bg-slate-900 p-6 flex flex-col h-full border-l border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Filter className="h-4 w-4 text-blue-500" />
                    Filters
                  </h3>
                  <button onClick={() => setShowMobileFilters(false)}>
                    <X className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                  </button>
                </div>

                <div className="flex-1 space-y-6">
                  {/* Job Type Filter */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Job Type</label>
                    <div className="space-y-3">
                      {JOB_TYPES.map((type) => (
                        <label key={type} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                          <input
                            type="radio"
                            name="mobileJobType"
                            checked={jobType === type}
                            onChange={() => {
                              setJobType(type);
                              setPage(1);
                              updateUrl({ jobType: type, page: 1 });
                              setShowMobileFilters(false);
                            }}
                            className="h-4 w-4 rounded-full border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          {type}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2">
                  {(search || location || jobType) && (
                    <Button
                      variant="outline"
                      className="w-full rounded-xl"
                      onClick={() => {
                        handleResetFilters();
                        setShowMobileFilters(false);
                      }}
                    >
                      Reset All
                    </Button>
                  )}
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                    onClick={() => setShowMobileFilters(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Results Pane */}
          <div className="lg:col-span-3 space-y-6">
            
            <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-4 py-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
              <span>Showing {jobs.length} of {meta.total} jobs</span>
              {jobType && (
                <Badge variant="secondary" className="flex items-center gap-1.5 px-2.5 py-1">
                  {jobType}
                  <button
                    onClick={() => {
                      setJobType("");
                      updateUrl({ jobType: "", page: 1 });
                    }}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
                <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                <span className="text-slate-500 dark:text-slate-400 mt-4 font-semibold">Loading job listings...</span>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
                <Briefcase className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">No jobs match your search</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Try checking your spelling, removing filter tags, or clearing search criteria.
                </p>
                <Button variant="outline" className="mt-6 rounded-xl" onClick={handleResetFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => {
                  const companyInitials = job.company?.name
                    ?.split(" ")
                    ?.map((n: string) => n[0])
                    ?.join("")
                    ?.toUpperCase()
                    ?.slice(0, 2) || "CO";

                  return (
                    <div
                      key={job._id}
                      className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200/30 dark:border-slate-700/30">
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
                        <div className="space-y-1">
                          <h3 className="font-bold text-lg text-slate-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-sm text-slate-500 dark:text-slate-400">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
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

                          <div className="flex flex-wrap gap-2 pt-2">
                            <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium">
                              {job.jobType}
                            </Badge>
                            {job.category?.name && (
                              <Badge className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 font-medium">
                                {job.category.name}
                              </Badge>
                            )}
                            {job.skillsRequired?.slice(0, 3).map((skill: string) => (
                              <Badge key={skill} variant="outline" className="border-slate-200 dark:border-slate-800 text-slate-500">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <Button
                          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-5 py-2.5 transition-all duration-200 shadow-md shadow-blue-500/10"
                          onClick={() => router.push(`/jobs/${job._id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  );
                })}

                {/* Pagination Controls */}
                {meta.totalPage > 1 && (
                  <div className="flex items-center justify-between pt-6 border-t border-slate-200/50 dark:border-slate-800/50">
                    <Button
                      variant="outline"
                      disabled={page === 1}
                      onClick={() => {
                        const newPage = page - 1;
                        setPage(newPage);
                        updateUrl({ page: newPage });
                      }}
                      className="rounded-xl flex items-center gap-1.5"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Page {page} of {meta.totalPage}
                    </span>
                    <Button
                      variant="outline"
                      disabled={page === meta.totalPage}
                      onClick={() => {
                        const newPage = page + 1;
                        setPage(newPage);
                        updateUrl({ page: newPage });
                      }}
                      className="rounded-xl flex items-center gap-1.5"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 min-h-[calc(100vh-64px-180px)] flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
        <span className="text-slate-500 dark:text-slate-400 mt-4 font-semibold">Loading job board...</span>
      </div>
    }>
      <JobsContent />
    </Suspense>
  );
}
