"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/services/axiosInstance";
import { Building2, MapPin, ExternalLink, Briefcase, Search, Loader2, Globe, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Company {
  _id: string;
  name: string;
  logoUrl?: string;
  industry?: string;
  location?: string;
  description?: string;
  website?: string;
}

interface Employer {
  _id: string;
  name: string;
  phone?: string;
  user: { email: string };
  company: Company;
}

export default function CompaniesPage() {
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("All");

  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        const response = await axiosInstance.get("/employers");
        setEmployers(response.data.data);
      } catch (error) {
        console.error("Failed to fetch employers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployers();
  }, []);

  const industries = [
    "All", "Information Technology", "Healthcare", "Finance",
    "Education", "Manufacturing", "Retail", "Marketing", "Other"
  ];

  const filteredEmployers = employers.filter(employer => {
    const companyName = employer.company?.name || "";
    const matchesSearch = companyName.toLowerCase().includes(searchQuery.toLowerCase());
    const industry = (employer.company?.industry || "Other").trim().toLowerCase();
    const matchesIndustry = selectedIndustry === "All" || industry === selectedIndustry.trim().toLowerCase();
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="min-h-screen bg-background py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto animate-fade-slide-up">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground font-[family-name:var(--font-heading)]">
            Discover Top{" "}
            <span className="gradient-text">Companies</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Explore leading organizations across various industries actively hiring on Employzen.
          </p>
        </div>

        {/* Search & Filter */}
        <div
          className={cn(
            "bg-card border border-border p-3 sm:p-4 rounded-2xl",
            "flex flex-col sm:flex-row gap-3",
            "animate-fade-slide-up stagger-1"
          )}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search by company name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative">
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className={cn(
                "h-10 pl-3.5 pr-10 rounded-xl text-sm outline-none transition-all duration-150 appearance-none w-full sm:w-56",
                "bg-muted/50 border border-border text-foreground",
                "focus:border-primary focus:ring-3 focus:ring-primary/20 focus:bg-background",
                "hover:border-border/80"
              )}
            >
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-muted-foreground">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Companies Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-muted-foreground font-medium">Loading companies...</p>
          </div>
        ) : filteredEmployers.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border border-border animate-fade-in">
            <Building2 className="h-14 w-14 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-semibold text-foreground font-[family-name:var(--font-heading)]">
              No companies found
            </h3>
            <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredEmployers.map((employer, idx) => (
              <div
                key={employer._id}
                className={cn(
                  "group bg-card rounded-2xl p-5 sm:p-6 border border-border",
                  "hover:shadow-lg hover:shadow-primary/5 hover:border-primary/25",
                  "transition-all duration-200 hover:-translate-y-1 flex flex-col h-full",
                  "animate-fade-slide-up",
                  `stagger-${Math.min(idx + 1, 6)}`
                )}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/10 overflow-hidden shrink-0">
                    {employer.company?.logoUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={employer.company.logoUrl}
                        alt={employer.company.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Building2 className="h-7 w-7 text-primary" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors truncate font-[family-name:var(--font-heading)]">
                      {employer.company?.name || employer.name}
                    </h3>
                    <span className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/15">
                      {employer.company?.industry || "Other"}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-5 flex-grow line-clamp-3 leading-relaxed">
                  {employer.company?.description || "No description provided for this company yet."}
                </p>

                <div className="space-y-2 pt-4 border-t border-border">
                  {employer.company?.location && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 mr-2 text-muted-foreground/60 shrink-0" />
                      <span className="truncate">{employer.company.location}</span>
                    </div>
                  )}
                  {employer.company?.website && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Globe className="h-3.5 w-3.5 mr-2 text-muted-foreground/60 shrink-0" />
                      <a
                        href={employer.company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors truncate"
                      >
                        {employer.company.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  {employer.user?.email && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="h-3.5 w-3.5 mr-2 text-muted-foreground/60 shrink-0" />
                      <a
                        href={`mailto:${employer.user.email}`}
                        className="hover:text-primary transition-colors truncate"
                      >
                        {employer.user.email}
                      </a>
                    </div>
                  )}
                  {employer.phone && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="h-3.5 w-3.5 mr-2 text-muted-foreground/60 shrink-0" />
                      <span>{employer.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Briefcase className="h-3.5 w-3.5 mr-2 text-muted-foreground/60 shrink-0" />
                    <span className="truncate">Contact: {employer.name}</span>
                  </div>
                </div>

                <div className="mt-5">
                  <Link href={`/jobs?company=${employer.company?.name}`} className="w-full">
                    <button className={cn(
                      "w-full flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold",
                      "bg-muted hover:bg-primary/10 hover:text-primary text-muted-foreground",
                      "border border-border hover:border-primary/30 transition-all duration-150"
                    )}>
                      View Open Roles
                      <ExternalLink className="h-3.5 w-3.5 ml-2" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
