/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowRight, UserCheck, Building2, ShieldAlert, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

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
      const payload: any = { email, password, role, name, phone };
      if (role === "candidate") payload.title = title;
      else if (role === "employer") { payload.companyName = companyName; payload.industry = industry; }

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

  const ROLES = [
    { value: "candidate" as UserRole, label: "Candidate", icon: UserCheck },
    { value: "employer" as UserRole, label: "Company", icon: Building2 },
    { value: "admin" as UserRole, label: "Admin", icon: ShieldAlert },
  ];

  return (
    <div className="flex-1 flex items-center justify-center min-h-screen relative overflow-hidden px-4 py-12 sm:py-16 bg-background">
      {/* Decorative background blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      {/* Back link */}
      <Link
        href="/"
        className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors z-10"
      >
        <ArrowRight className="h-4 w-4 rotate-180" />
        Back to Home
      </Link>

      {/* Card */}
      <div
        className={cn(
          "relative z-10 w-full max-w-lg",
          "bg-card/90 backdrop-blur-xl border border-border rounded-2xl",
          "shadow-2xl shadow-primary/5 p-6 sm:p-8 lg:p-10",
          "animate-fade-slide-up"
        )}
      >
        {/* Logo + header */}
        <div className="flex flex-col items-center mb-7">
          <Image src="/images/logo.png" alt="Employzen Logo" width={80} height={80} className="rounded-2xl bg-white p-2.5 object-contain shadow-lg shadow-primary/25 mb-4 ring-1 ring-border/50" />
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground text-center font-[family-name:var(--font-heading)]">
            Create your account
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
              Sign in here
            </Link>
          </p>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-3 gap-2 bg-muted p-1.5 rounded-xl border border-border mb-6">
          {ROLES.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setRole(value)}
              className={cn(
                "flex flex-col items-center justify-center py-2.5 px-2 rounded-lg text-xs font-semibold transition-all duration-150 gap-1",
                role === value
                  ? "bg-card text-primary shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Error alert */}
          {formError && (
            <div className="p-3.5 text-sm bg-destructive/10 text-destructive rounded-xl border border-destructive/20 font-medium whitespace-pre-line animate-fade-in">
              {formError}
            </div>
          )}

          {/* Name + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-foreground">Full Name</label>
              <Input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-foreground">Phone Number</label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-foreground">Email Address</label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="reg-password" className="block text-sm font-semibold text-foreground">
              Password
            </label>
            <div className="relative">
              <Input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">Must be at least 8 characters long</p>
          </div>

          {/* Candidate-specific */}
          {role === "candidate" && (
            <div className="space-y-1.5 animate-fade-in">
              <label className="block text-sm font-semibold text-foreground">Professional Title</label>
              <Input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Frontend Engineer, Product Designer"
              />
            </div>
          )}

          {/* Employer-specific */}
          {role === "employer" && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-foreground">Company Name</label>
                <Input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Stripe, Acme Corp"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-foreground">Industry / Category</label>
                <select
                  required
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className={cn(
                    "w-full h-10 rounded-xl px-3.5 text-sm outline-none transition-all duration-150",
                    "bg-muted/50 border border-border text-foreground",
                    "focus:border-primary focus:ring-3 focus:ring-primary/20 focus:bg-background",
                    "hover:border-border/80"
                  )}
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
            </div>
          )}

          {/* Submit */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="gradient"
              className="w-full h-11 rounded-xl font-bold text-base shadow-lg shadow-primary/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
