/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/purity */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Briefcase, Loader2, ArrowRight, UserCheck, Building2, ShieldAlert, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register, user, loading } = useAuth();

  const [role, setRole] = useState<UserRole>("candidate");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  
  // Role-specific fields
  const [title, setTitle] = useState(""); // Candidate
  const [companyName, setCompanyName] = useState(""); // Employer
  const [industry, setIndustry] = useState(""); // Employer

  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If user is already logged in, redirect them
  useEffect(() => {
    if (user && !loading) {
      router.push(`/${user.role}`);
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!email || !password || !name) {
      setFormError("Please fill in name, email, and password.");
      return;
    }

    if (role === "candidate" && !title) {
      setFormError("Please provide your professional title.");
      return;
    }

    if (role === "employer" && !companyName) {
      setFormError("Please specify your company name.");
      return;
    }

    if (role === "employer" && !industry) {
      setFormError("Please select your company industry.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        email,
        password,
        role,
        name,
        phone,
      };

      if (role === "candidate") {
        payload.title = title;
      } else if (role === "employer") {
        payload.companyName = companyName;
        payload.industry = industry;
      }

      await register(payload);
    } catch (err: any) {
      console.error("Registration error:", err);
      const data = err.response?.data;
      if (data?.errorSources && Array.isArray(data.errorSources) && data.errorSources.length > 0) {
        const errorMsgs = data.errorSources.map((source: any) => {
          if (source.path) {
            const formattedPath = source.path.charAt(0).toUpperCase() + source.path.slice(1);
            return `${formattedPath}: ${source.message}`;
          }
          return source.message;
        }).join("\n");
        setFormError(errorMsgs);
      } else {
        setFormError(data?.message || "Registration failed. Please check details and try again.");
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 min-h-screen relative">
      <Link 
        href="/" 
        className="absolute top-4 left-4 sm:top-8 sm:left-8 flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
      >
        <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
        Back to Home
      </Link>
      
      <div className="w-full max-w-lg space-y-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-md">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Role Selector Toggle */}
        <div className="grid grid-cols-3 gap-3 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
          <button
            type="button"
            onClick={() => setRole("candidate")}
            className={`flex flex-col items-center justify-center py-2.5 rounded-lg text-xs font-semibold transition-all ${
              role === "candidate"
                ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <UserCheck className="h-4 w-4 mb-1" />
            Candidate
          </button>
          <button
            type="button"
            onClick={() => setRole("employer")}
            className={`flex flex-col items-center justify-center py-2.5 rounded-lg text-xs font-semibold transition-all ${
              role === "employer"
                ? "bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Building2 className="h-4 w-4 mb-1" />
            Company
          </button>
          <button
            type="button"
            onClick={() => setRole("admin")}
            className={`flex flex-col items-center justify-center py-2.5 rounded-lg text-xs font-semibold transition-all ${
              role === "admin"
                ? "bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <ShieldAlert className="h-4 w-4 mb-1" />
            Admin
          </button>
        </div>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          {formError && (
            <div className="p-4 text-sm bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-xl border border-red-200/50 dark:border-red-900/30 font-medium whitespace-pre-line">
              {formError}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <Input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="h-11 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="h-11 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-11 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="h-11 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-500 transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Must be at least 8 characters long
              </p>
            </div>

            {/* Candidate-specific fields */}
            {role === "candidate" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Professional Title
                </label>
                <Input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Frontend Engineer, Product Designer"
                  className="h-11 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                />
              </div>
            )}

            {/* Employer-specific fields */}
            {role === "employer" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Company Name
                  </label>
                  <Input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Stripe, Acme Corp"
                    className="h-11 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Industry / Category
                  </label>
                  <select
                    required
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full h-11 rounded-xl px-3 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-sm outline-none text-slate-700 dark:text-slate-300"
                  >
                    <option value="" disabled>Select an industry...</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Education">Education</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Retail">Retail</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </>
            )}
          </div>

          <div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 dark:shadow-none flex items-center justify-center transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
