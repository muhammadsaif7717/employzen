"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/services/axiosInstance";
import { Building2, MapPin, ExternalLink, Briefcase, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

interface Company {
  _id: string;
  name: string;
  logoUrl?: string;
  industry?: string;
  location?: string;
  description?: string;
}

interface Employer {
  _id: string;
  name: string;
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

  // Predefined industries matching registration
  const industries = [
    "All",
    "Information Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Manufacturing",
    "Retail",
    "Marketing",
    "Other"
  ];

  const filteredEmployers = employers.filter(employer => {
    const matchesSearch = employer.company?.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          employer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const industry = employer.company?.industry || "Other";
    const matchesIndustry = selectedIndustry === "All" || industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Discover Top <span className="text-blue-600 dark:text-blue-400">Companies</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Explore leading organizations across various industries actively hiring on Employzen.
          </p>
        </div>

        {/* Search & Filter Section */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by company or employer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-slate-200 dark:border-slate-700"
            />
          </div>
          <div className="relative">
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="h-12 px-4 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 md:w-64 outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        {/* Companies Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Loading companies...</p>
          </div>
        ) : filteredEmployers.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Building2 className="h-16 w-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">No companies found</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployers.map((employer) => (
              <div 
                key={employer._id} 
                className="group bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-inner overflow-hidden">
                      {employer.company?.logoUrl ? (
                        <img src={employer.company.logoUrl} alt={employer.company.name} className="h-full w-full object-cover" />
                      ) : (
                        <Building2 className="h-7 w-7 text-blue-500 dark:text-blue-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {employer.company?.name || employer.name}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 mt-1">
                        {employer.company?.industry || "Other"}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 flex-grow line-clamp-3">
                  {employer.company?.description || "No description provided for this company yet."}
                </p>

                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                    <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                    {employer.company?.location || "Remote / Global"}
                  </div>
                  <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                    <Briefcase className="h-4 w-4 mr-2 text-slate-400" />
                    Registered Employer: {employer.name}
                  </div>
                </div>

                <div className="mt-6 pt-2">
                  <Link href={`/jobs?company=${employer.company?.name}`} className="w-full">
                    <button className="w-full flex items-center justify-center px-4 py-2 bg-slate-50 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-xl transition-colors">
                      View Open Roles
                      <ExternalLink className="h-4 w-4 ml-2" />
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
