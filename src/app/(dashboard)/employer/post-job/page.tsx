/* eslint-disable @typescript-eslint/no-explicit-any */
 
 
 
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/services/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, PlusCircle, CheckCircle, AlertCircle } from "lucide-react";

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Remote", "Internship"];

export default function PostJobPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("Full-time");
  const [skillsStr, setSkillsStr] = useState("");
  const [category, setCategory] = useState("");

  const [categories, setCategories] = useState<any[]>([]);
  const [fetchingCategories, setFetchingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/categories");
        if (response.data?.success) {
          const list = response.data.data || [];
          setCategories(list);
          if (list.length > 0) {
            setCategory(list[0]._id);
          }
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setFetchingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!title || !description || !salaryRange || !location || !jobType || !category) {
      setError("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    try {
      const skillsRequired = skillsStr
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const payload = {
        title,
        description,
        salaryRange,
        location,
        jobType,
        skillsRequired,
        category,
      };

      const response = await axiosInstance.post("/jobs", payload);
      if (response.data?.success) {
        setSuccess(true);
        setTitle("");
        setDescription("");
        setSalaryRange("");
        setLocation("");
        setSkillsStr("");
        setTimeout(() => {
          router.push("/employer");
        }, 2000);
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to post job listing. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <PlusCircle className="h-8 w-8 text-blue-500" />
          Post a New Job
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Provide complete job information. Listings require Admin approval before going public.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/30 rounded-xl text-sm font-semibold flex items-start gap-2.5 animate-fadeIn">
          <CheckCircle className="h-5 w-5 shrink-0 text-green-500 mt-0.5" />
          <div>
            <p className="font-bold">Job Posted Successfully!</p>
            <p className="text-xs font-normal text-green-600 dark:text-green-500 mt-0.5">
              The listing has been created in pending state and you will be redirected to dashboard.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/30 rounded-xl text-sm font-semibold flex items-start gap-2.5">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
          <div>
            <p className="font-bold">Error Posting Job</p>
            <p className="text-xs font-normal text-red-650 dark:text-red-400 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Job Title
            </label>
            <Input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lead Frontend Engineer (React/Next)"
              className="rounded-xl h-11"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Job Category
              </label>
              {fetchingCategories ? (
                <div className="h-11 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <Loader2 className="h-5 w-5 text-slate-400 animate-spin" />
                </div>
              ) : (
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 px-3 py-2 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all"
                >
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Job Type
              </label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full h-11 px-3 py-2 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all"
              >
                {JOB_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Location
              </label>
              <Input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Remote, San Francisco, CA"
                className="rounded-xl h-11"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Salary Range
              </label>
              <Input
                type="text"
                required
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                placeholder="e.g. $120,000 - $150,000 / year"
                className="rounded-xl h-11"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Required Skills (comma-separated)
            </label>
            <Input
              type="text"
              value={skillsStr}
              onChange={(e) => setSkillsStr(e.target.value)}
              placeholder="e.g. React, Next.js, Node.js, TailwindCSS"
              className="rounded-xl h-11"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Job Description
            </label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the responsibilities, requirements, and benefits of the role..."
              rows={8}
              className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="rounded-xl px-5 h-11 border-slate-250 text-slate-650"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 h-11 font-semibold shadow-md shadow-blue-500/10 flex items-center justify-center"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Posting Job...
              </>
            ) : (
              "Post Job Listing"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
