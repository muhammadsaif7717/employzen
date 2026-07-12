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
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="flex-1 bg-background transition-colors duration-300">

      {/* ── Hero Section ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
        {/* Decorative blobs */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-secondary/10 dark:bg-secondary/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8">
          {/* Pill badge */}
          <div className="animate-fade-slide-up">
            <Badge
              className="px-4 py-1.5 bg-primary/10 text-primary border-primary/20 rounded-full text-xs font-semibold tracking-wide gap-1.5"
              variant="outline"
            >
              <Zap className="h-3 w-3 text-primary" />
              Over 10,000+ active roles listed today
            </Badge>
          </div>

          {/* Headline */}
          <h1
            className={cn(
              "text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight",
              "text-foreground max-w-4xl mx-auto leading-[1.1]",
              "animate-fade-slide-up stagger-1",
              "font-[family-name:var(--font-heading)]"
            )}
          >
            Discover, Apply, and{" "}
            <br className="hidden sm:block" />
            <span className="gradient-text">Get Hired</span>
          </h1>

          {/* Subheadline */}
          <p
            className={cn(
              "text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed",
              "animate-fade-slide-up stagger-2"
            )}
          >
            Employzen is the ultimate job portal connecting top-tier candidates
            with leading tech recruiters. Build your profile, craft CVs, and land
            your dream job easily.
          </p>

          {/* Search Box */}
          <div className="animate-fade-slide-up stagger-3">
            <form
              onSubmit={handleSearchSubmit}
              className={cn(
                "flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto",
                "p-2 rounded-2xl",
                "bg-card/80 backdrop-blur-lg border border-border",
                "shadow-xl shadow-primary/5"
              )}
            >
              <div className="flex-1 flex items-center gap-2 px-3 py-1">
                <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                <Input
                  type="text"
                  placeholder="Job title, keywords, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 h-auto px-0 text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <Button
                type="submit"
                variant="gradient"
                className="h-12 px-6 rounded-xl text-sm font-bold"
              >
                Search Jobs
              </Button>
            </form>
          </div>

          {/* Popular searches */}
          <div
            className={cn(
              "flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground pt-2",
              "animate-fade-slide-up stagger-4"
            )}
          >
            <span className="font-medium">Popular:</span>
            {["React", "Node.js", "Python", "Remote", "UI/UX"].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSearchQuery(tag);
                  router.push(`/jobs?search=${encodeURIComponent(tag)}`);
                }}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold border border-border",
                  "bg-muted hover:bg-primary/10 hover:text-primary hover:border-primary/30",
                  "transition-all duration-150"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features / Stats Strip ────────────────────────────────────── */}
      <section className="py-10 sm:py-14 bg-card border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: TrendingUp,
                color: "text-primary",
                bg: "bg-primary/10",
                title: "Instant Applications",
                desc: "Apply with a single click and track in real-time.",
                delay: "stagger-1",
              },
              {
                icon: Users,
                color: "text-secondary",
                bg: "bg-secondary/10",
                title: "Interactive Chat",
                desc: "Direct, instant chat between candidates and employers.",
                delay: "stagger-2",
              },
              {
                icon: Building2,
                color: "text-success",
                bg: "bg-success/10",
                title: "CV Builder Tool",
                desc: "Create and download dynamic printable resumes.",
                delay: "stagger-3",
              },
            ].map((item) => (
              <div
                key={item.title}
                className={cn(
                  "flex items-start sm:items-center gap-4 p-5 rounded-2xl",
                  "hover:bg-muted/60 transition-colors duration-200",
                  "animate-fade-slide-up",
                  item.delay
                )}
              >
                <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", item.bg)}>
                  <item.icon className={cn("h-6 w-6", item.color)} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground font-[family-name:var(--font-heading)]">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent Job Listings ────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 lg:py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-[family-name:var(--font-heading)]">
              Recent Job Openings
            </h2>
            <p className="text-muted-foreground mt-1.5 text-sm sm:text-base">
              Find the latest opportunities posted by top companies.
            </p>
          </div>
          <Button
            variant="ghost"
            className="text-primary hover:text-primary/80 font-semibold flex items-center hover:bg-primary/10"
            asChild
          >
            <Link href="/jobs">
              View All Jobs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-52 rounded-2xl bg-card border border-border animate-shimmer"
              />
            ))}
          </div>
        ) : recentJobs.length === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-card rounded-2xl border border-border">
            <Briefcase className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground">No jobs available right now</h3>
            <p className="text-muted-foreground mt-1">Check back later or register to post a job.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {recentJobs.map((job, idx) => {
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
                  className={cn(
                    "flex flex-col bg-card p-5 sm:p-6 rounded-2xl border border-border",
                    "shadow-sm hover:shadow-lg hover:shadow-primary/5",
                    "hover:-translate-y-1 hover:border-primary/20 transition-all duration-200 group",
                    "animate-fade-slide-up",
                    `stagger-${Math.min(idx + 1, 6)}`
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground font-bold border border-border/50 overflow-hidden">
                      {job.company?.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={job.company.logo}
                          alt={job.company.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-bold text-muted-foreground">{companyInitials}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors text-sm sm:text-base">
                        {job.title}
                      </h4>
                      <p className="text-sm text-muted-foreground truncate mt-0.5">
                        {job.company?.name || "Company"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge variant="outline" className="text-xs">
                      {job.jobType}
                    </Badge>
                    <Badge variant="default" className="text-xs">
                      {job.category?.name || "Development"}
                    </Badge>
                  </div>

                  <div className="flex flex-col gap-1.5 mt-5 pt-4 border-t border-border text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                      <span className="truncate">{job.salaryRange}</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-5 rounded-xl hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all font-semibold text-sm"
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

      {/* ── Info Banner / CTA ──────────────────────────────────────────── */}
      <section className="gradient-brand py-14 sm:py-20 overflow-hidden relative">
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:28px_28px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white font-[family-name:var(--font-heading)]">
              Ready to find your dream job or build your business?
            </h2>
            <p className="text-white/75 text-base sm:text-lg max-w-lg mx-auto lg:mx-0">
              Join thousands of professionals and employers today. Complete your profile,
              build resumes, and apply seamlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center lg:justify-start">
              <Button
                className="bg-white hover:bg-white/90 text-primary font-bold px-6 py-3 h-auto rounded-xl shadow-xl shadow-black/10"
                asChild
              >
                <Link href="/register?role=candidate">Join as Candidate</Link>
              </Button>
              <Button
                variant="outline"
                className="border-white/30 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 h-auto rounded-xl"
                asChild
              >
                <Link href="/register?role=employer">Join as Company</Link>
              </Button>
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-2 gap-4">
            {[
              {
                icon: CheckCircle,
                title: "Online CV Builder",
                desc: "Generate printable & downloadable CVs from your profile directly.",
              },
              {
                icon: Clock,
                title: "Real-time Status",
                desc: "Get notified immediately when recruiters review or update applications.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 space-y-3"
              >
                <card.icon className="h-8 w-8 text-white/80" />
                <h4 className="font-bold text-lg text-white font-[family-name:var(--font-heading)]">
                  {card.title}
                </h4>
                <p className="text-white/65 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
