/* eslint-disable @typescript-eslint/no-explicit-any */
 
 
 
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axiosInstance from "@/services/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Search,
  ArrowRight,
  TrendingUp,
  Users,
  Building2,
  CheckCircle,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        const response = await axiosInstance.get("/jobs?limit=6");
        if (response.data?.success) {
          setRecentJobs(response.data.data.result || []);
        }
      } catch (err) {
        console.error("Failed to fetch recent jobs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentJobs();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/jobs");
    }
  };

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32 bg-gradient-to-b from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-400/20 dark:bg-violet-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <Badge className="px-3 py-1 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/30 rounded-full text-xs font-semibold tracking-wide animate-pulse">
            🔥 Over 10,000+ active roles listed today
          </Badge>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-3xl mx-auto leading-tight">
            Discover, Apply, and <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
              Get Hired
            </span>
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Employzen is the ultimate job portal connecting top-tier candidates with leading tech recruiters. Build your profile, craft CVs, and land your dream job easily.
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto p-2 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 shadow-xl"
          >
            <div className="flex-1 flex items-center gap-2 px-3 py-1">
              <Search className="h-5 w-5 text-slate-400 shrink-0" />
              <Input
                type="text"
                placeholder="Job title, keywords, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>
            <Button
              type="submit"
              className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-200 shadow-md shadow-blue-500/25"
            >
              Search Jobs
            </Button>
          </form>

          {/* Popular searches / Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400 pt-2">
            <span>Popular searches:</span>
            {["React", "Node.js", "Python", "Remote", "UI/UX"].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSearchQuery(tag);
                  router.push(`/jobs?search=${encodeURIComponent(tag)}`);
                }}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-xs font-medium transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics/Features Highlight */}
      <section className="py-12 bg-white dark:bg-slate-900 border-y border-slate-200/50 dark:border-slate-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-950 dark:text-white text-lg">Instant Applications</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Apply with a single click and track in real-time.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-950 dark:text-white text-lg">Interactive Chat</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Direct, instant chat between candidates and employers.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-950 dark:text-white text-lg">CV Builder Tool</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Create and download dynamic printable resumes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Jobs Listings */}
      <section className="py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Recent Job Openings</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Find the latest opportunities posted by top companies.</p>
          </div>
          <Button
            variant="ghost"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold flex items-center hover:bg-transparent"
            asChild
          >
            <Link href="/jobs">
              View All Jobs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 animate-pulse"
              />
            ))}
          </div>
        ) : recentJobs.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
            <Briefcase className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No jobs available right now</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Check back later or register to post a job.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentJobs.map((job) => {
              const companyInitials = job.company?.name
                ?.split(" ")
                ?.map((n: string) => n[0])
                ?.join("")
                ?.toUpperCase()
                ?.slice(0, 2) || "CO";

              return (
                <div
                  key={job._id}
                  className="flex flex-col bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200/30 dark:border-slate-700/30">
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
                      <h4 className="font-semibold text-slate-950 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {job.title}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {job.company?.name || "Company"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium">
                      {job.jobType}
                    </Badge>
                    <Badge className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 font-medium">
                      {job.category?.name || "Development"}
                    </Badge>
                  </div>

                  <div className="flex flex-col gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 shrink-0 text-slate-400" />
                      <span className="truncate">{job.salaryRange}</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-6 rounded-xl hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white transition-all font-semibold"
                    asChild
                  >
                    <Link href={`/jobs/${job._id}`}>View Details</Link>
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Info Banner Section */}
      <section className="bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-900 dark:to-violet-900 py-16 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Ready to find your dream job or build your business?
            </h2>
            <p className="text-blue-100 text-lg max-w-lg">
              Join thousands of professionals and employers today. Complete your profile, build resumes, and apply seamlessly.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                className="bg-white hover:bg-slate-50 text-blue-600 font-bold px-6 py-3 rounded-xl shadow-lg shadow-black/10 transition-all"
                asChild
              >
                <Link href="/register?role=candidate">Join as Candidate</Link>
              </Button>
              <Button
                variant="outline"
                className="border-white/40 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-xl transition-all"
                asChild
              >
                <Link href="/register?role=employer">Join as Company</Link>
              </Button>
            </div>
          </div>
          <div className="hidden lg:grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-2">
              <CheckCircle className="h-8 w-8 text-blue-300" />
              <h4 className="font-bold text-lg">Online CV Builder</h4>
              <p className="text-slate-100 text-sm">Generate printable & downloadable CVs from your profile directly.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-2">
              <Clock className="h-8 w-8 text-blue-300" />
              <h4 className="font-bold text-lg">Real-time status</h4>
              <p className="text-slate-100 text-sm">Get notified immediately when recruiters review or update applications.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
