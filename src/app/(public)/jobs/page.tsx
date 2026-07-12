/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */

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
import { cn } from "@/lib/utils";

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Remote", "Internship"];

function JobsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

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
    setSearch(""); setLocation(""); setJobType(""); setPage(1);
    router.push("/jobs");
  };

  // Filter sidebar content — shared between desktop and mobile
  const filterSidebarContent = (
    <div className="space-y-5">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <h3 className="font-bold text-foreground flex items-center gap-2 font-[family-name:var(--font-heading)]">
          <Filter className="h-4 w-4 text-primary" />
          Filters
        </h3>
        {(search || location || jobType) && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs font-semibold text-destructive hover:text-destructive/80 transition-colors"
          >
            Reset All
          </button>
        )}
      </div>

      {/* Job Type */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-foreground">Job Type</label>
        <div className="space-y-2">
          {JOB_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2.5 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
              <input
                type="radio"
                name="jobType"
                checked={jobType === type}
                onChange={() => { setJobType(type); setPage(1); updateUrl({ jobType: type, page: 1 }); setShowMobileFilters(false); }}
                className="h-4 w-4 accent-primary"
              />
              {type}
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 bg-background transition-colors duration-300 min-h-[calc(100vh-64px-180px)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        {/* Header */}
        <div className="mb-6 sm:mb-8 animate-fade-slide-up">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-[family-name:var(--font-heading)]">
            Explore Jobs
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Discover opportunities matching your skills and preferences.
          </p>
        </div>

        {/* Search controls */}
        <form
          onSubmit={handleSearchSubmit}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 sm:mb-8 animate-fade-slide-up stagger-1"
        >
          <div className={cn(
            "flex items-center gap-2 px-3.5 rounded-xl border border-border bg-card",
            "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15",
            "transition-all duration-150"
          )}>
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <Input
              type="text"
              placeholder="Job title or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 h-11 px-0"
            />
          </div>

          <div className={cn(
            "flex items-center gap-2 px-3.5 rounded-xl border border-border bg-card",
            "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15",
            "transition-all duration-150"
          )}>
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
            <Input
              type="text"
              placeholder="Location (e.g. Remote, NY)..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 h-11 px-0"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" variant="gradient" className="flex-1 h-11 rounded-xl font-bold">
              Search
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="h-11 w-11 p-0 lg:hidden rounded-xl"
              aria-label="Toggle filters"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </form>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">

          {/* Desktop sidebar */}
          <div className="hidden lg:block bg-card border border-border p-6 rounded-2xl h-fit shadow-sm sticky top-20">
            {filterSidebarContent}
          </div>

          {/* Mobile filter overlay */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm lg:hidden animate-fade-in">
              <div className="w-80 bg-card p-6 flex flex-col h-full border-l border-border animate-slide-in-left">
                <div className="flex items-center justify-between mb-5">
                  <span className="font-bold text-foreground">Filters</span>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {filterSidebarContent}
                </div>
                <div className="pt-4 border-t border-border">
                  <Button variant="gradient" className="w-full rounded-xl" onClick={() => setShowMobileFilters(false)}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Results pane */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-5">

            {/* Results meta bar */}
            <div className={cn(
              "flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground",
              "bg-card px-4 py-3 rounded-xl border border-border"
            )}>
              <span className="font-medium">
                Showing <span className="text-foreground font-bold">{jobs.length}</span> of <span className="text-foreground font-bold">{meta.total}</span> jobs
              </span>
              {jobType && (
                <Badge variant="default" className="flex items-center gap-1.5 cursor-pointer" onClick={() => { setJobType(""); updateUrl({ jobType: "", page: 1 }); }}>
                  {jobType}
                  <X className="h-3 w-3" />
                </Badge>
              )}
            </div>

            {/* Job listings */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-card rounded-2xl border border-border gap-3">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <span className="text-muted-foreground font-medium">Loading job listings...</span>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20 bg-card rounded-2xl border border-border animate-fade-in">
                <Briefcase className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)]">
                  No jobs match your search
                </h3>
                <p className="text-muted-foreground mt-1.5 max-w-sm mx-auto text-sm">
                  Try adjusting your filters or search terms.
                </p>
                <Button variant="outline" className="mt-5 rounded-xl" onClick={handleResetFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {jobs.map((job, idx) => {
                  const companyInitials =
                    job.company?.name?.split(" ")?.map((n: string) => n[0])?.join("")?.toUpperCase()?.slice(0, 2) || "CO";

                  return (
                    <div
                      key={job._id}
                      className={cn(
                        "bg-card p-5 sm:p-6 rounded-2xl border border-border",
                        "shadow-sm hover:shadow-md hover:shadow-primary/5",
                        "hover:border-primary/20 transition-all duration-200",
                        "flex flex-col sm:flex-row sm:items-center justify-between gap-5 group",
                        "animate-fade-slide-up",
                        `stagger-${Math.min(idx + 1, 6)}`
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground font-bold border border-border/50 overflow-hidden">
                          {job.company?.logo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={job.company.logo} alt={job.company.name} className="h-full w-full object-cover rounded-xl" />
                          ) : (
                            <span className="text-xs font-bold">{companyInitials}</span>
                          )}
                        </div>
                        <div className="space-y-1.5 min-w-0">
                          <h3 className="font-bold text-foreground group-hover:text-primary transition-colors truncate text-sm sm:text-base font-[family-name:var(--font-heading)]">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground/70">{job.company?.name || "Company"}</span>
                            <span className="hidden sm:inline text-muted-foreground/40">•</span>
                            <div className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</div>
                            <span className="hidden sm:inline text-muted-foreground/40">•</span>
                            <div className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />{job.salaryRange}</div>
                          </div>
                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            <Badge variant="outline" className="text-xs">{job.jobType}</Badge>
                            {job.category?.name && (
                              <Badge variant="default" className="text-xs">{job.category.name}</Badge>
                            )}
                            {job.skillsRequired?.slice(0, 3).map((skill: string) => (
                              <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <Button
                          variant="gradient"
                          className="w-full sm:w-auto rounded-xl px-5 font-bold"
                          onClick={() => router.push(`/jobs/${job._id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  );
                })}

                {/* Pagination */}
                {meta.totalPage > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      disabled={page === 1}
                      onClick={() => { const p = page - 1; setPage(p); updateUrl({ page: p }); }}
                      className="rounded-xl flex items-center gap-1.5"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-sm font-semibold text-muted-foreground">
                      Page <span className="text-foreground">{page}</span> of <span className="text-foreground">{meta.totalPage}</span>
                    </span>
                    <Button
                      variant="outline"
                      disabled={page === meta.totalPage}
                      onClick={() => { const p = page + 1; setPage(p); updateUrl({ page: p }); }}
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
    <Suspense
      fallback={
        <div className="flex-1 bg-background flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <span className="text-muted-foreground font-medium">Loading job board...</span>
        </div>
      }
    >
      <JobsContent />
    </Suspense>
  );
}
